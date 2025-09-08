const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
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

    const { email } = req.body;

    // Check if email is already subscribed
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return res.status(400).json({
          error: 'Already Subscribed',
          message: 'This email is already subscribed to our newsletter'
        });
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            is_active: true,
            unsubscribed_at: null
          }
        });

        return res.json({
          message: 'Successfully resubscribed to our newsletter!'
        });
      }
    }

    // Create new subscription
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        is_active: true
      }
    });

    res.status(201).json({
      message: 'Successfully subscribed to our newsletter!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while subscribing to the newsletter'
    });
  }
});

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post('/unsubscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
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

    const { email } = req.body;

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (!subscriber) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'This email is not subscribed to our newsletter'
      });
    }

    if (!subscriber.is_active) {
      return res.status(400).json({
        error: 'Already Unsubscribed',
        message: 'This email is already unsubscribed from our newsletter'
      });
    }

    // Unsubscribe
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        is_active: false,
        unsubscribed_at: new Date()
      }
    });

    res.json({
      message: 'Successfully unsubscribed from our newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while unsubscribing from the newsletter'
    });
  }
});

// @route   GET /api/newsletter/subscribers
// @desc    Get newsletter subscribers (Admin only)
// @access  Private (Admin)
router.get('/subscribers', async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Admin privileges required'
      });
    }

    const { page = 1, limit = 50, isActive } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (isActive !== undefined) {
      where.is_active = isActive === 'true';
    }

    const [subscribers, totalCount] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { subscribed_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.newsletterSubscriber.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      subscribers,
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
    console.error('Get newsletter subscribers error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching newsletter subscribers'
    });
  }
});

// @route   DELETE /api/newsletter/subscribers/:subscriberId
// @desc    Delete newsletter subscriber (Admin only)
// @access  Private (Admin)
router.delete('/subscribers/:subscriberId', async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Admin privileges required'
      });
    }

    const { subscriberId } = req.params;

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: subscriberId }
    });

    if (!subscriber) {
      return res.status(404).json({
        error: 'Subscriber Not Found',
        message: 'The requested subscriber does not exist'
      });
    }

    await prisma.newsletterSubscriber.delete({
      where: { id: subscriberId }
    });

    res.json({
      message: 'Subscriber deleted successfully'
    });

  } catch (error) {
    console.error('Delete newsletter subscriber error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while deleting the subscriber'
    });
  }
});

module.exports = router;
