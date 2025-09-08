const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { optionalAuth } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('category').optional().isString(),
  query('subcategory').optional().isString(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('inStock').optional().isBoolean(),
  query('sortBy').optional().isIn(['name', 'price', 'created_at', 'popularity']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid query parameters',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      search,
      category,
      subcategory,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      is_active: true
    };

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { catalog_number: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Category filter
    if (category) {
      where.category = {
        name: { equals: category, mode: 'insensitive' }
      };
    }

    // Subcategory filter
    if (subcategory) {
      where.subcategory = {
        name: { equals: subcategory, mode: 'insensitive' }
      };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Stock filter
    if (inStock !== undefined) {
      if (inStock === 'true') {
        where.in_stock = true;
        where.stock_quantity = { gt: 0 };
      } else {
        where.OR = [
          { in_stock: false },
          { stock_quantity: { lte: 0 } }
        ];
      }
    }

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case 'price':
        orderBy = { price: sortOrder };
        break;
      case 'created_at':
        orderBy = { created_at: sortOrder };
        break;
      case 'popularity':
        // For now, we'll use created_at as popularity proxy
        // You can implement a more sophisticated popularity algorithm later
        orderBy = { created_at: 'desc' };
        break;
      default:
        orderBy = { name: sortOrder };
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          subcategory: {
            select: { id: true, name: true, slug: true }
          },
          images: {
            where: { is_primary: true },
            select: { image_url: true, alt_text: true }
          },
          specifications: {
            select: { name: true, value: true, unit: true }
          },
          _count: {
            select: { reviews: true }
          }
        },
        orderBy,
        skip,
        take: parseInt(limit)
      }),
      prisma.product.count({ where })
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Format products for response
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      catalogNumber: product.catalog_number,
      description: product.description,
      shortDescription: product.short_description,
      price: product.price,
      originalPrice: product.original_price,
      stockQuantity: product.stock_quantity,
      inStock: product.in_stock,
      isFeatured: product.is_featured,
      weight: product.weight,
      dimensions: product.dimensions,
      brand: product.brand,
      model: product.model,
      year: product.year,
      category: product.category?.name,
      subcategory: product.subcategory?.name,
      image: product.images[0]?.image_url || null,
      images: product.images.map(img => ({
        url: img.image_url,
        alt: img.alt_text
      })),
      specifications: product.specifications,
      reviewCount: product._count.reviews,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    res.json({
      products: formattedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching products'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true, description: true }
        },
        subcategory: {
          select: { id: true, name: true, slug: true }
        },
        images: {
          orderBy: { sort_order: 'asc' },
          select: { id: true, image_url: true, alt_text: true, is_primary: true }
        },
        specifications: {
          orderBy: { sort_order: 'asc' },
          select: { name: true, value: true, unit: true }
        },
        reviews: {
          where: { is_approved: true },
          include: {
            user: {
              select: { first_name: true, last_name: true }
            }
          },
          orderBy: { created_at: 'desc' },
          take: 10
        },
        _count: {
          select: { reviews: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product Not Found',
        message: 'The requested product does not exist'
      });
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    // Check if user has this product in wishlist (if authenticated)
    let isInWishlist = false;
    if (req.user) {
      const wishlistItem = await prisma.wishlistItem.findUnique({
        where: {
          user_id_product_id: {
            user_id: req.user.id,
            product_id: product.id
          }
        }
      });
      isInWishlist = !!wishlistItem;
    }

    const formattedProduct = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      catalogNumber: product.catalog_number,
      description: product.description,
      shortDescription: product.short_description,
      price: product.price,
      originalPrice: product.original_price,
      costPrice: product.cost_price,
      stockQuantity: product.stock_quantity,
      minStockLevel: product.min_stock_level,
      inStock: product.in_stock,
      isActive: product.is_active,
      isFeatured: product.is_featured,
      weight: product.weight,
      dimensions: product.dimensions,
      brand: product.brand,
      model: product.model,
      year: product.year,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        description: product.category.description
      },
      subcategory: product.subcategory ? {
        id: product.subcategory.id,
        name: product.subcategory.name,
        slug: product.subcategory.slug
      } : null,
      images: product.images.map(img => ({
        id: img.id,
        url: img.image_url,
        alt: img.alt_text,
        isPrimary: img.is_primary
      })),
      specifications: product.specifications,
      reviews: product.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        isVerified: review.is_verified,
        user: {
          name: `${review.user.first_name} ${review.user.last_name}`
        },
        createdAt: review.created_at
      })),
      reviewCount: product._count.reviews,
      averageRating: Math.round(avgRating * 10) / 10,
      isInWishlist,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };

    res.json(formattedProduct);

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching the product'
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', optionalAuth, async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await prisma.product.findMany({
      where: {
        is_active: true,
        is_featured: true,
        in_stock: true
      },
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
      },
      orderBy: { created_at: 'desc' },
      take: parseInt(limit)
    });

    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      catalogNumber: product.catalog_number,
      price: product.price,
      originalPrice: product.original_price,
      stockQuantity: product.stock_quantity,
      inStock: product.in_stock,
      category: product.category?.name,
      subcategory: product.subcategory?.name,
      image: product.images[0]?.image_url || null,
      reviewCount: product._count.reviews
    }));

    res.json(formattedProducts);

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching featured products'
    });
  }
});

// @route   GET /api/products/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const products = await prisma.product.findMany({
      where: {
        is_active: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } },
          { catalog_number: { contains: q, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        sku: true,
        catalog_number: true,
        price: true,
        images: {
          where: { is_primary: true },
          select: { image_url: true }
        }
      },
      take: 5
    });

    const suggestions = products.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      catalogNumber: product.catalog_number,
      price: product.price,
      image: product.images[0]?.image_url || null
    }));

    res.json(suggestions);

  } catch (error) {
    console.error('Get search suggestions error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching search suggestions'
    });
  }
});

// @route   GET /api/products/categories/:categorySlug
// @desc    Get products by category
// @access  Public
router.get('/categories/:categorySlug', optionalAuth, async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 12, subcategory } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      is_active: true,
      category: {
        slug: categorySlug
      }
    };

    if (subcategory) {
      where.subcategory = {
        slug: subcategory
      };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { name: true, slug: true }
          },
          subcategory: {
            select: { name: true, slug: true }
          },
          images: {
            where: { is_primary: true },
            select: { image_url: true, alt_text: true }
          }
        },
        orderBy: { name: 'asc' },
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
      category: product.category?.name,
      subcategory: product.subcategory?.name,
      image: product.images[0]?.image_url || null
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
    console.error('Get products by category error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching products by category'
    });
  }
});

module.exports = router;
