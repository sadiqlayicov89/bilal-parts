const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist items
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { user_id: userId },
      include: {
        product: {
          include: {
            category: {
              select: { name: true }
            },
            subcategory: {
              select: { name: true }
            },
            images: {
              where: { is_primary: true },
              select: { image_url: true, alt_text: true }
            },
            _count: {
              select: { reviews: true }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const formattedItems = wishlistItems.map(item => ({
      id: item.id,
      product: {
        id: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        catalogNumber: item.product.catalog_number,
        price: item.product.price,
        originalPrice: item.product.original_price,
        stockQuantity: item.product.stock_quantity,
        inStock: item.product.in_stock,
        category: item.product.category?.name,
        subcategory: item.product.subcategory?.name,
        image: item.product.images[0]?.image_url || null,
        images: item.product.images.map(img => ({
          url: img.image_url,
          alt: img.alt_text
        })),
        reviewCount: item.product._count.reviews
      },
      createdAt: item.created_at
    }));

    res.json({
      items: formattedItems,
      count: formattedItems.length
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching wishlist items'
    });
  }
});

// @route   POST /api/wishlist/add
// @desc    Add item to wishlist
// @access  Private
router.post('/add', [
  body('productId').notEmpty().withMessage('Product ID is required')
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

    const { productId } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        is_active: true,
        images: {
          where: { is_primary: true },
          select: { image_url: true, alt_text: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product Not Found',
        message: 'The requested product does not exist'
      });
    }

    if (!product.is_active) {
      return res.status(400).json({
        error: 'Product Unavailable',
        message: 'This product is currently unavailable'
      });
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId
        }
      }
    });

    if (existingItem) {
      return res.status(400).json({
        error: 'Item Already in Wishlist',
        message: 'This product is already in your wishlist'
      });
    }

    // Add item to wishlist
    const newItem = await prisma.wishlistItem.create({
      data: {
        user_id: userId,
        product_id: productId
      },
      include: {
        product: {
          include: {
            images: {
              where: { is_primary: true },
              select: { image_url: true, alt_text: true }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Item added to wishlist successfully',
      item: {
        id: newItem.id,
        product: {
          id: newItem.product.id,
          name: newItem.product.name,
          price: newItem.product.price,
          image: newItem.product.images[0]?.image_url || null
        },
        createdAt: newItem.created_at
      }
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while adding item to wishlist'
    });
  }
});

// @route   DELETE /api/wishlist/remove/:itemId
// @desc    Remove item from wishlist
// @access  Private
router.delete('/remove/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    // Check if wishlist item exists and belongs to user
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        id: itemId,
        user_id: userId
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({
        error: 'Wishlist Item Not Found',
        message: 'The requested wishlist item does not exist'
      });
    }

    // Remove item from wishlist
    await prisma.wishlistItem.delete({
      where: { id: itemId }
    });

    res.json({
      message: 'Item removed from wishlist successfully'
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while removing item from wishlist'
    });
  }
});

// @route   DELETE /api/wishlist/remove-product/:productId
// @desc    Remove product from wishlist by product ID
// @access  Private
router.delete('/remove-product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Check if wishlist item exists and belongs to user
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId
        }
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({
        error: 'Wishlist Item Not Found',
        message: 'This product is not in your wishlist'
      });
    }

    // Remove item from wishlist
    await prisma.wishlistItem.delete({
      where: { id: wishlistItem.id }
    });

    res.json({
      message: 'Item removed from wishlist successfully'
    });

  } catch (error) {
    console.error('Remove product from wishlist error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while removing product from wishlist'
    });
  }
});

// @route   DELETE /api/wishlist/clear
// @desc    Clear all items from wishlist
// @access  Private
router.delete('/clear', async (req, res) => {
  try {
    const userId = req.user.id;

    // Remove all wishlist items for user
    await prisma.wishlistItem.deleteMany({
      where: { user_id: userId }
    });

    res.json({
      message: 'Wishlist cleared successfully'
    });

  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while clearing wishlist'
    });
  }
});

// @route   GET /api/wishlist/count
// @desc    Get wishlist items count
// @access  Private
router.get('/count', async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await prisma.wishlistItem.count({
      where: { user_id: userId }
    });

    res.json({ count });

  } catch (error) {
    console.error('Get wishlist count error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching wishlist count'
    });
  }
});

// @route   GET /api/wishlist/check/:productId
// @desc    Check if product is in wishlist
// @access  Private
router.get('/check/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId
        }
      }
    });

    res.json({
      isInWishlist: !!wishlistItem
    });

  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while checking wishlist status'
    });
  }
});

// @route   POST /api/wishlist/toggle
// @desc    Toggle product in wishlist (add if not exists, remove if exists)
// @access  Private
router.post('/toggle', [
  body('productId').notEmpty().withMessage('Product ID is required')
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

    const { productId } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        is_active: true,
        images: {
          where: { is_primary: true },
          select: { image_url: true, alt_text: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product Not Found',
        message: 'The requested product does not exist'
      });
    }

    if (!product.is_active) {
      return res.status(400).json({
        error: 'Product Unavailable',
        message: 'This product is currently unavailable'
      });
    }

    // Check if item exists in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId
        }
      }
    });

    if (existingItem) {
      // Remove from wishlist
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id }
      });

      res.json({
        message: 'Item removed from wishlist',
        action: 'removed',
        isInWishlist: false
      });
    } else {
      // Add to wishlist
      const newItem = await prisma.wishlistItem.create({
        data: {
          user_id: userId,
          product_id: productId
        }
      });

      res.json({
        message: 'Item added to wishlist',
        action: 'added',
        isInWishlist: true,
        item: {
          id: newItem.id,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0]?.image_url || null
          },
          createdAt: newItem.created_at
        }
      });
    }

  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while toggling wishlist item'
    });
  }
});

module.exports = router;
