const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const router = express.Router();

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { user_id: userId };
    if (status) {
      where.status = status.toUpperCase();
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  images: {
                    where: { is_primary: true },
                    select: { image_url: true }
                  }
                }
              }
            }
          },
          shipping_address: {
            select: {
              first_name: true,
              last_name: true,
              address_line_1: true,
              city: true,
              country: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.order.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      subtotal: order.subtotal,
      taxAmount: order.tax_amount,
      shippingAmount: order.shipping_amount,
      discountAmount: order.discount_amount,
      totalAmount: order.total_amount,
      currency: order.currency,
      items: order.items.map(item => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          image: item.product.images[0]?.image_url || null
        },
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      shippingAddress: order.shipping_address,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }));

    res.json({
      orders: formattedOrders,
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
    console.error('Get orders error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching orders'
    });
  }
});

// @route   GET /api/orders/:orderId
// @desc    Get single order details
// @access  Private
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        user_id: userId
      },
      include: {
        items: {
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
        },
        shipping_address: true,
        billing_address: true
      }
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order Not Found',
        message: 'The requested order does not exist'
      });
    }

    const formattedOrder = {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      subtotal: order.subtotal,
      taxAmount: order.tax_amount,
      shippingAmount: order.shipping_amount,
      discountAmount: order.discount_amount,
      totalAmount: order.total_amount,
      currency: order.currency,
      notes: order.notes,
      items: order.items.map(item => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          catalogNumber: item.product.catalog_number,
          image: item.product.images[0]?.image_url || null,
          images: item.product.images.map(img => ({
            url: img.image_url,
            alt: img.alt_text
          }))
        },
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      shippingAddress: order.shipping_address,
      billingAddress: order.billing_address,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    };

    res.json(formattedOrder);

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching order details'
    });
  }
});

// @route   POST /api/orders/create
// @desc    Create new order from cart
// @access  Private
router.post('/create', [
  body('shippingAddressId').notEmpty().withMessage('Shipping address is required'),
  body('billingAddressId').optional(),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  body('notes').optional().isString()
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

    const { shippingAddressId, billingAddressId, paymentMethod, notes } = req.body;
    const userId = req.user.id;

    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock_quantity: true,
            in_stock: true
          }
        }
      }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        error: 'Empty Cart',
        message: 'Your cart is empty'
      });
    }

    // Validate stock availability
    for (const cartItem of cartItems) {
      if (!cartItem.product.in_stock || cartItem.product.stock_quantity < cartItem.quantity) {
        return res.status(400).json({
          error: 'Insufficient Stock',
          message: `${cartItem.product.name} is out of stock or insufficient quantity available`
        });
      }
    }

    // Get user discount
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { discount: true }
    });

    // Calculate totals
    let subtotal = 0;
    cartItems.forEach(item => {
      subtotal += item.product.price * item.quantity;
    });

    const discountAmount = user?.discount ? (subtotal * user.discount) / 100 : 0;
    const taxAmount = (subtotal - discountAmount) * 0.20; // 20% VAT
    const shippingAmount = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;

    // Generate order number
    const orderNumber = `BP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Create order in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          order_number: orderNumber,
          user_id: userId,
          status: 'PENDING',
          payment_status: 'PENDING',
          payment_method: paymentMethod,
          subtotal,
          tax_amount: taxAmount,
          shipping_amount: shippingAmount,
          discount_amount: discountAmount,
          total_amount: totalAmount,
          shipping_address_id: shippingAddressId,
          billing_address_id: billingAddressId || shippingAddressId,
          notes
        }
      });

      // Create order items and update stock
      const orderItems = [];
      for (const cartItem of cartItems) {
        const orderItem = await tx.orderItem.create({
          data: {
            order_id: order.id,
            product_id: cartItem.product.id,
            quantity: cartItem.quantity,
            price: cartItem.product.price,
            total: cartItem.product.price * cartItem.quantity
          }
        });
        orderItems.push(orderItem);

        // Update product stock
        await tx.product.update({
          where: { id: cartItem.product.id },
          data: {
            stock_quantity: {
              decrement: cartItem.quantity
            }
          }
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { user_id: userId }
      });

      return { order, orderItems };
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: result.order.id,
        orderNumber: result.order.order_number,
        status: result.order.status,
        totalAmount: result.order.total_amount,
        currency: result.order.currency,
        createdAt: result.order.created_at
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while creating the order'
    });
  }
});

// @route   PUT /api/orders/:orderId/cancel
// @desc    Cancel an order
// @access  Private
router.put('/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        user_id: userId
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, stock_quantity: true }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order Not Found',
        message: 'The requested order does not exist'
      });
    }

    if (order.status === 'CANCELLED') {
      return res.status(400).json({
        error: 'Order Already Cancelled',
        message: 'This order has already been cancelled'
      });
    }

    if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
      return res.status(400).json({
        error: 'Cannot Cancel Order',
        message: 'This order cannot be cancelled as it has already been shipped or delivered'
      });
    }

    // Cancel order and restore stock
    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' }
      });

      // Restore product stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stock_quantity: {
              increment: item.quantity
            }
          }
        });
      }
    });

    res.json({
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while cancelling the order'
    });
  }
});

module.exports = router;
