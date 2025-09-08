const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// @route   POST /api/payments/create-intent
// @desc    Create payment intent (Stripe integration placeholder)
// @access  Private
router.post('/create-intent', [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('currency').optional().isString().withMessage('Currency must be a string'),
  body('orderId').optional().isString().withMessage('Order ID must be a string')
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

    const { amount, currency = 'USD', orderId } = req.body;
    const userId = req.user.id;

    // For now, we'll simulate a payment intent creation
    // In a real implementation, you would integrate with Stripe or another payment processor
    
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        user_id: userId,
        order_id: orderId || null
      }
    };

    res.json({
      message: 'Payment intent created successfully',
      paymentIntent
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      error: 'Payment Failed',
      message: 'An error occurred while creating payment intent'
    });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment
// @access  Private
router.post('/confirm', [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('orderId').optional().isString().withMessage('Order ID must be a string')
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

    const { paymentIntentId, orderId } = req.body;
    const userId = req.user.id;

    // Simulate payment confirmation
    // In a real implementation, you would verify with Stripe
    
    const paymentResult = {
      id: paymentIntentId,
      status: 'succeeded',
      amount_received: 10000, // Example amount in cents
      currency: 'usd',
      created: Math.floor(Date.now() / 1000)
    };

    // Update order payment status if orderId is provided
    if (orderId) {
      await prisma.order.update({
        where: {
          id: orderId,
          user_id: userId
        },
        data: {
          payment_status: 'PAID',
          payment_id: paymentIntentId,
          status: 'CONFIRMED'
        }
      });
    }

    res.json({
      message: 'Payment confirmed successfully',
      payment: paymentResult
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      error: 'Payment Confirmation Failed',
      message: 'An error occurred while confirming payment'
    });
  }
});

// @route   GET /api/payments/methods
// @desc    Get available payment methods
// @access  Public
router.get('/methods', async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Pay with Visa, Mastercard, or American Express',
        icon: 'credit-card',
        enabled: true
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer',
        icon: 'bank',
        enabled: true
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: 'paypal',
        enabled: false // Disabled for now
      }
    ];

    res.json({
      paymentMethods: paymentMethods.filter(method => method.enabled)
    });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching payment methods'
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle payment webhooks (Stripe integration placeholder)
// @access  Public (but should be secured with webhook signature verification)
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;

    // In a real implementation, you would:
    // 1. Verify the webhook signature
    // 2. Handle different event types
    // 3. Update order status accordingly

    console.log('Payment webhook received:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object.id);
        break;
      
      case 'payment_intent.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object.id);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({
      error: 'Webhook Error',
      message: 'An error occurred while processing webhook'
    });
  }
});

module.exports = router;
