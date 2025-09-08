const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { optionalAuth } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', optionalAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true }
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product Not Found',
        message: 'The requested product does not exist'
      });
    }

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: {
          product_id: productId,
          is_approved: true
        },
        include: {
          user: {
            select: {
              first_name: true,
              last_name: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.review.count({
        where: {
          product_id: productId,
          is_approved: true
        }
      })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    const formattedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isVerified: review.is_verified,
      user: {
        name: `${review.user.first_name} ${review.user.last_name}`
      },
      createdAt: review.created_at
    }));

    res.json({
      product: {
        id: product.id,
        name: product.name
      },
      reviews: formattedReviews,
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: totalCount,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching product reviews'
    });
  }
});

// @route   POST /api/reviews
// @desc    Create a product review
// @access  Private
router.post('/', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().trim().isLength({ max: 200 }),
  body('comment').optional().trim().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const { productId, rating, title, comment } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true }
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product Not Found',
        message: 'The requested product does not exist'
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId
        }
      }
    });

    if (existingReview) {
      return res.status(400).json({
        error: 'Review Already Exists',
        message: 'You have already reviewed this product'
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        user_id: userId,
        product_id: productId,
        rating,
        title,
        comment,
        is_verified: false,
        is_approved: false // Reviews need admin approval
      },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Review submitted successfully. It will be published after admin approval.',
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        user: {
          name: `${review.user.first_name} ${review.user.last_name}`
        },
        createdAt: review.created_at
      }
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while creating the review'
    });
  }
});

// @route   PUT /api/reviews/:reviewId
// @desc    Update a review
// @access  Private
router.put('/:reviewId', [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('title').optional().trim().isLength({ max: 200 }),
  body('comment').optional().trim().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;

    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        user_id: userId
      }
    });

    if (!existingReview) {
      return res.status(404).json({
        error: 'Review Not Found',
        message: 'The requested review does not exist'
      });
    }

    // Update review
    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (title !== undefined) updateData.title = title;
    if (comment !== undefined) updateData.comment = comment;

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true
          }
        }
      }
    });

    res.json({
      message: 'Review updated successfully',
      review: {
        id: updatedReview.id,
        rating: updatedReview.rating,
        title: updatedReview.title,
        comment: updatedReview.comment,
        user: {
          name: `${updatedReview.user.first_name} ${updatedReview.user.last_name}`
        },
        createdAt: updatedReview.created_at,
        updatedAt: updatedReview.updated_at
      }
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating the review'
    });
  }
});

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete a review
// @access  Private
router.delete('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Check if review exists and belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        user_id: userId
      }
    });

    if (!review) {
      return res.status(404).json({
        error: 'Review Not Found',
        message: 'The requested review does not exist'
      });
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId }
    });

    res.json({
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while deleting the review'
    });
  }
});

// @route   GET /api/reviews/user
// @desc    Get user's reviews
// @access  Private
router.get('/user', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { user_id: userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: {
                where: { is_primary: true },
                select: { image_url: true }
              }
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.review.count({
        where: { user_id: userId }
      })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    const formattedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isVerified: review.is_verified,
      isApproved: review.is_approved,
      product: {
        id: review.product.id,
        name: review.product.name,
        image: review.product.images[0]?.image_url || null
      },
      createdAt: review.created_at,
      updatedAt: review.updated_at
    }));

    res.json({
      reviews: formattedReviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching user reviews'
    });
  }
});

module.exports = router;
