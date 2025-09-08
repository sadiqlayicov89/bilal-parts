const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart items
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await prisma.cartItem.findMany({
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
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Calculate totals
    let totalItems = 0;
    let subtotal = 0;

    const formattedItems = cartItems.map(item => {
      const itemTotal = item.product.price * item.quantity;
      totalItems += item.quantity;
      subtotal += itemTotal;

      return {
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
          }))
        },
        quantity: item.quantity,
        itemTotal: itemTotal,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };
    });

    // Apply user discount if available
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { discount: true }
    });

    const discountAmount = user?.discount ? (subtotal * user.discount) / 100 : 0;
    const finalTotal = subtotal - discountAmount;

    res.json({
      items: formattedItems,
      summary: {
        totalItems,
        subtotal,
        discountAmount,
        discountPercentage: user?.discount || 0,
        total: finalTotal
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching cart items'
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
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

    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Check if product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        stock_quantity: true,
        in_stock: true,
        is_active: true
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

    if (!product.in_stock || product.stock_quantity < quantity) {
      return res.status(400).json({
        error: 'Insufficient Stock',
        message: `Only ${product.stock_quantity} items available in stock`
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId
        }
      }
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.stock_quantity) {
        return res.status(400).json({
          error: 'Insufficient Stock',
          message: `Cannot add ${quantity} more items. Only ${product.stock_quantity - existingItem.quantity} additional items available`
        });
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
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

      return res.json({
        message: 'Item quantity updated in cart',
        item: {
          id: updatedItem.id,
          product: {
            id: updatedItem.product.id,
            name: updatedItem.product.name,
            price: updatedItem.product.price,
            image: updatedItem.product.images[0]?.image_url || null
          },
          quantity: updatedItem.quantity,
          itemTotal: updatedItem.product.price * updatedItem.quantity
        }
      });
    } else {
      // Add new item to cart
      const newItem = await prisma.cartItem.create({
        data: {
          user_id: userId,
          product_id: productId,
          quantity: quantity
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

      return res.status(201).json({
        message: 'Item added to cart successfully',
        item: {
          id: newItem.id,
          product: {
            id: newItem.product.id,
            name: newItem.product.name,
            price: newItem.product.price,
            image: newItem.product.images[0]?.image_url || null
          },
          quantity: newItem.quantity,
          itemTotal: newItem.product.price * newItem.quantity
        }
      });
    }

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while adding item to cart'
    });
  }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/update/:itemId', [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
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

    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        user_id: userId
      },
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

    if (!cartItem) {
      return res.status(404).json({
        error: 'Cart Item Not Found',
        message: 'The requested cart item does not exist'
      });
    }

    // Check stock availability
    if (!cartItem.product.in_stock || cartItem.product.stock_quantity < quantity) {
      return res.status(400).json({
        error: 'Insufficient Stock',
        message: `Only ${cartItem.product.stock_quantity} items available in stock`
      });
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: quantity },
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

    res.json({
      message: 'Cart item updated successfully',
      item: {
        id: updatedItem.id,
        product: {
          id: updatedItem.product.id,
          name: updatedItem.product.name,
          price: updatedItem.product.price,
          image: updatedItem.product.images[0]?.image_url || null
        },
        quantity: updatedItem.quantity,
        itemTotal: updatedItem.product.price * updatedItem.quantity
      }
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating cart item'
    });
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        user_id: userId
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        error: 'Cart Item Not Found',
        message: 'The requested cart item does not exist'
      });
    }

    // Remove item from cart
    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    res.json({
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while removing item from cart'
    });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear all items from cart
// @access  Private
router.delete('/clear', async (req, res) => {
  try {
    const userId = req.user.id;

    // Remove all cart items for user
    await prisma.cartItem.deleteMany({
      where: { user_id: userId }
    });

    res.json({
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while clearing cart'
    });
  }
});

// @route   GET /api/cart/count
// @desc    Get cart items count
// @access  Private
router.get('/count', async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: userId },
      select: { quantity: true }
    });

    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ count: totalCount });

  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching cart count'
    });
  }
});

module.exports = router;
