const express = require('express');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const router = express.Router();

// 1C Integration logging
const logFile = path.join(__dirname, '../logs/1c_integration.log');
const logDir = path.dirname(logFile);

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
  console.log(`1C Integration: ${message}`);
};

// Middleware to log all 1C requests
router.use((req, res, next) => {
  log(`${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// @route   POST /api/1c/categories
// @desc    Create or update category from 1C
// @access  Private (1C only)
router.post('/categories', async (req, res) => {
  try {
    const { id: external_id, name, parent_id } = req.body;

    if (!external_id || !name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'external_id and name are required'
      });
    }

    // Check if category already exists
    let category = await prisma.category.findFirst({
      where: { 
        OR: [
          { external_id: external_id },
          { name: name }
        ]
      }
    });

    const slug = name.toLowerCase()
      .replace(/[^a-z0-9а-я]+/gi, '-')
      .replace(/^-|-$/g, '');

    const categoryData = {
      name: name,
      slug: slug,
      external_id: external_id,
      description: `Imported from 1C: ${name}`,
      is_active: true
    };

    // Handle parent category
    if (parent_id) {
      const parentCategory = await prisma.category.findFirst({
        where: { external_id: parent_id }
      });
      if (parentCategory) {
        categoryData.parent_id = parentCategory.id;
      }
    }

    if (category) {
      // Update existing category
      category = await prisma.category.update({
        where: { id: category.id },
        data: categoryData
      });
      log(`Updated category: ${name} (ID: ${category.id})`);
    } else {
      // Create new category
      category = await prisma.category.create({
        data: categoryData
      });
      log(`Created category: ${name} (ID: ${category.id})`);
    }

    res.json({
      success: true,
      category: {
        id: category.id,
        external_id: category.external_id,
        name: category.name,
        slug: category.slug
      }
    });

  } catch (error) {
    log(`Error processing category: ${error.message}`);
    console.error('1C Category error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process category'
    });
  }
});

// @route   POST /api/1c/products
// @desc    Create or update product from 1C
// @access  Private (1C only)
router.post('/products', async (req, res) => {
  try {
    const { 
      id: external_id, 
      name, 
      sku, 
      description, 
      category_id,
      properties = {}
    } = req.body;

    if (!external_id || !name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'external_id and name are required'
      });
    }

    // Find category by external_id
    let categoryId = null;
    if (category_id) {
      const category = await prisma.category.findFirst({
        where: { external_id: category_id }
      });
      categoryId = category?.id;
    }

    // If no category found, create default category
    if (!categoryId) {
      let defaultCategory = await prisma.category.findFirst({
        where: { name: 'Imported from 1C' }
      });
      
      if (!defaultCategory) {
        defaultCategory = await prisma.category.create({
          data: {
            name: 'Imported from 1C',
            slug: 'imported-from-1c',
            description: 'Products imported from 1C system'
          }
        });
      }
      categoryId = defaultCategory.id;
    }

    // Check if product already exists
    let product = await prisma.product.findFirst({
      where: { 
        OR: [
          { external_id: external_id },
          { sku: sku }
        ]
      }
    });

    const productData = {
      name: name,
      sku: sku || external_id,
      external_id: external_id,
      description: description || '',
      price: 0, // Will be updated by offers
      stock_quantity: 0, // Will be updated by offers
      in_stock: false, // Will be updated by offers
      is_active: true,
      category_id: categoryId
    };

    if (product) {
      // Update existing product
      product = await prisma.product.update({
        where: { id: product.id },
        data: productData
      });
      log(`Updated product: ${name} (ID: ${product.id})`);
    } else {
      // Create new product
      product = await prisma.product.create({
        data: productData
      });
      log(`Created product: ${name} (ID: ${product.id})`);
    }

    // Handle product properties/specifications
    if (Object.keys(properties).length > 0) {
      // Delete existing specifications
      await prisma.productSpecification.deleteMany({
        where: { product_id: product.id }
      });

      // Create new specifications
      for (const [propId, propValue] of Object.entries(properties)) {
        if (propValue) {
          await prisma.productSpecification.create({
            data: {
              product_id: product.id,
              name: `Property_${propId}`,
              value: String(propValue)
            }
          });
        }
      }
    }

    res.json({
      success: true,
      product: {
        id: product.id,
        external_id: product.external_id,
        name: product.name,
        sku: product.sku
      }
    });

  } catch (error) {
    log(`Error processing product: ${error.message}`);
    console.error('1C Product error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process product'
    });
  }
});

// @route   POST /api/1c/offers
// @desc    Update product prices and stock from 1C
// @access  Private (1C only)
router.post('/offers', async (req, res) => {
  try {
    const { 
      product_id: external_id, 
      price, 
      stock_quantity 
    } = req.body;

    if (!external_id) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'product_id is required'
      });
    }

    // Find product by external_id
    const product = await prisma.product.findFirst({
      where: { external_id: external_id }
    });

    if (!product) {
      log(`Product not found for offer: ${external_id}`);
      return res.status(404).json({
        error: 'Product not found',
        message: `Product with external_id ${external_id} not found`
      });
    }

    // Update product price and stock
    const updateData = {};
    
    if (price !== undefined && price !== null) {
      updateData.price = parseFloat(price) || 0;
    }
    
    if (stock_quantity !== undefined && stock_quantity !== null) {
      updateData.stock_quantity = parseInt(stock_quantity) || 0;
      updateData.in_stock = updateData.stock_quantity > 0;
    }

    if (Object.keys(updateData).length > 0) {
      const updatedProduct = await prisma.product.update({
        where: { id: product.id },
        data: updateData
      });

      log(`Updated offer for product: ${product.name} (Price: ${updateData.price || 'unchanged'}, Stock: ${updateData.stock_quantity || 'unchanged'})`);

      res.json({
        success: true,
        product: {
          id: updatedProduct.id,
          external_id: updatedProduct.external_id,
          name: updatedProduct.name,
          price: updatedProduct.price,
          stock_quantity: updatedProduct.stock_quantity,
          in_stock: updatedProduct.in_stock
        }
      });
    } else {
      res.json({
        success: true,
        message: 'No updates needed'
      });
    }

  } catch (error) {
    log(`Error processing offer: ${error.message}`);
    console.error('1C Offer error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process offer'
    });
  }
});

// @route   GET /api/1c/status
// @desc    Get 1C integration status
// @access  Private (Admin only)
router.get('/status', async (req, res) => {
  try {
    // Get statistics
    const stats = {
      total_categories: await prisma.category.count(),
      imported_categories: await prisma.category.count({
        where: { external_id: { not: null } }
      }),
      total_products: await prisma.product.count(),
      imported_products: await prisma.product.count({
        where: { external_id: { not: null } }
      }),
      last_sync: null
    };

    // Try to get last sync time from log file
    try {
      if (fs.existsSync(logFile)) {
        const logContent = fs.readFileSync(logFile, 'utf8');
        const lines = logContent.trim().split('\n');
        if (lines.length > 0) {
          const lastLine = lines[lines.length - 1];
          const timestampMatch = lastLine.match(/\[(.*?)\]/);
          if (timestampMatch) {
            stats.last_sync = timestampMatch[1];
          }
        }
      }
    } catch (error) {
      // Ignore log reading errors
    }

    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('1C Status error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get 1C status'
    });
  }
});

// @route   GET /api/1c/logs
// @desc    Get 1C integration logs
// @access  Private (Admin only)
router.get('/logs', async (req, res) => {
  try {
    const { lines = 100 } = req.query;
    
    if (!fs.existsSync(logFile)) {
      return res.json({
        success: true,
        logs: []
      });
    }

    const logContent = fs.readFileSync(logFile, 'utf8');
    const logLines = logContent.trim().split('\n');
    const recentLogs = logLines.slice(-parseInt(lines));

    res.json({
      success: true,
      logs: recentLogs
    });

  } catch (error) {
    console.error('1C Logs error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get logs'
    });
  }
});

// @route   POST /api/1c/test-connection
// @desc    Test 1C connection
// @access  Private (Admin only)
router.post('/test-connection', async (req, res) => {
  try {
    log('Test connection requested from admin panel');
    
    res.json({
      success: true,
      message: '1C Integration endpoint is working',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('1C Test connection error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Connection test failed'
    });
  }
});

module.exports = router;
