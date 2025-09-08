const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total_amount: true },
        where: { payment_status: 'PAID' }
      }),
      prisma.order.count({
        where: { status: 'PENDING' }
      }),
      prisma.product.count({
        where: {
          stock_quantity: { lte: 10 },
          in_stock: true
        }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { first_name: true, last_name: true, email: true }
          }
        }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          created_at: true
        }
      })
    ]);

    res.json({
      statistics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.total_amount || 0,
        pendingOrders,
        lowStockProducts
      },
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: order.total_amount,
        status: order.status,
        user: {
          name: `${order.user.first_name} ${order.user.last_name}`,
          email: order.user.email
        },
        createdAt: order.created_at
      })),
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        createdAt: user.created_at
      }))
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, status, country } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company_name: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role.toUpperCase();
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
          company_name: true,
          country: true,
          city: true,
          role: true,
          status: true,
          is_active: true,
          discount: true,
          created_at: true,
          updated_at: true
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      users,
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
    console.error('Get admin users error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching users'
    });
  }
});

// @route   PUT /api/admin/users/:userId
// @desc    Update user (Admin only)
// @access  Private (Admin)
router.put('/users/:userId', [
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone(),
  body('company_name').optional().trim(),
  body('country').optional().trim(),
  body('city').optional().trim(),
  body('vat_number').optional().trim(),
  body('role').optional().isIn(['ADMIN', 'CUSTOMER', 'MANAGER']),
  body('status').optional().isIn(['PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED']),
  body('is_active').optional().isBoolean(),
  body('discount').optional().isFloat({ min: 0, max: 100 })
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

    const { userId } = req.params;
    const updateData = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'The requested user does not exist'
      });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        company_name: true,
        country: true,
        city: true,
        vat_number: true,
        role: true,
        status: true,
        is_active: true,
        discount: true,
        updated_at: true
      }
    });

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating user'
    });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products with filtering and pagination
// @access  Private (Admin)
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, inStock } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { catalog_number: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = {
        name: { equals: category, mode: 'insensitive' }
      };
    }

    if (inStock !== undefined) {
      where.in_stock = inStock === 'true';
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { name: true }
          },
          subcategory: {
            select: { name: true }
          },
          images: {
            where: { is_primary: true },
            select: { image_url: true }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      catalogNumber: product.catalog_number,
      price: product.price,
      originalPrice: product.original_price,
      stockQuantity: product.stock_quantity,
      inStock: product.in_stock,
      isActive: product.is_active,
      isFeatured: product.is_featured,
      category: product.category?.name,
      subcategory: product.subcategory?.name,
      image: product.images[0]?.image_url || null,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    res.json({
      products: formattedProducts,
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
    console.error('Get admin products error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching products'
    });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders with filtering and pagination
// @access  Private (Admin)
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (status) {
      where.status = status.toUpperCase();
    }

    if (paymentStatus) {
      where.payment_status = paymentStatus.toUpperCase();
    }

    if (search) {
      where.OR = [
        { order_number: { contains: search, mode: 'insensitive' } },
        { user: { 
          OR: [
            { first_name: { contains: search, mode: 'insensitive' } },
            { last_name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        }}
      ];
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  sku: true
                }
              }
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
      totalAmount: order.total_amount,
      currency: order.currency,
      user: {
        id: order.user.id,
        name: `${order.user.first_name} ${order.user.last_name}`,
        email: order.user.email
      },
      items: order.items.map(item => ({
        product: {
          name: item.product.name,
          sku: item.product.sku
        },
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
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
    console.error('Get admin orders error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching orders'
    });
  }
});

// @route   PUT /api/admin/orders/:orderId/status
// @desc    Update order status
// @access  Private (Admin)
router.put('/orders/:orderId/status', [
  body('status').isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).withMessage('Invalid status'),
  body('paymentStatus').optional().isIn(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'])
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

    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order Not Found',
        message: 'The requested order does not exist'
      });
    }

    const updateData = { status };
    if (paymentStatus) {
      updateData.payment_status = paymentStatus;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData
    });

    res.json({
      message: 'Order status updated successfully',
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.order_number,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.payment_status,
        updatedAt: updatedOrder.updated_at
      }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating order status'
    });
  }
});

module.exports = router;
