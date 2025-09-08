const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories with subcategories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { is_active: true },
      include: {
        children: {
          where: { is_active: true },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true,
            sort_order: true
          },
          orderBy: { sort_order: 'asc' }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { sort_order: 'asc' }
    });

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      parentId: category.parent_id,
      sortOrder: category.sort_order,
      subcategories: category.children.map(child => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        description: child.description,
        image: child.image,
        sortOrder: child.sort_order
      })),
      productCount: category._count.products
    }));

    res.json(formattedCategories);

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching categories'
    });
  }
});

// @route   GET /api/categories/tree
// @desc    Get categories in tree structure
// @access  Public
router.get('/tree', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { is_active: true },
      include: {
        children: {
          where: { is_active: true },
          include: {
            _count: {
              select: { products: true }
            }
          },
          orderBy: { sort_order: 'asc' }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { sort_order: 'asc' }
    });

    // Build tree structure
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create all category objects
    categories.forEach(category => {
      categoryMap.set(category.id, {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        sortOrder: category.sort_order,
        productCount: category._count.products,
        children: []
      });
    });

    // Second pass: build tree structure
    categories.forEach(category => {
      const categoryObj = categoryMap.get(category.id);
      
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryObj);
        }
      } else {
        rootCategories.push(categoryObj);
      }
    });

    res.json(rootCategories);

  } catch (error) {
    console.error('Get categories tree error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching categories tree'
    });
  }
});

// @route   GET /api/categories/:slug
// @desc    Get single category by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        children: {
          where: { is_active: true },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true,
            sort_order: true
          },
          orderBy: { sort_order: 'asc' }
        },
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        error: 'Category Not Found',
        message: 'The requested category does not exist'
      });
    }

    const formattedCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      parentId: category.parent_id,
      parent: category.parent ? {
        id: category.parent.id,
        name: category.parent.name,
        slug: category.parent.slug
      } : null,
      sortOrder: category.sort_order,
      subcategories: category.children.map(child => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        description: child.description,
        image: child.image,
        sortOrder: child.sort_order
      })),
      productCount: category._count.products
    };

    res.json(formattedCategory);

  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching the category'
    });
  }
});

// @route   GET /api/categories/:slug/products
// @desc    Get products in a category
// @access  Public
router.get('/:slug/products', async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 12, subcategory } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      is_active: true,
      category: {
        slug: slug
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
    console.error('Get category products error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching category products'
    });
  }
});

module.exports = router;
