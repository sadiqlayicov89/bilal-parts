const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const imageFileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const csvFileFilter = (req, file, cb) => {
  // Check file type for CSV
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};

const imageUpload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter: imageFileFilter
});

const csvUpload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter: csvFileFilter
});

// @route   POST /api/upload/image
// @desc    Upload and process image
// @access  Private
router.post('/image', imageUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No File Uploaded',
        message: 'Please select an image file to upload'
      });
    }

    const originalPath = req.file.path;
    const filename = path.parse(req.file.filename).name;
    const ext = path.parse(req.file.filename).ext;

    // Process image with Sharp
    const processedFilename = `${filename}_processed${ext}`;
    const processedPath = path.join(uploadsDir, processedFilename);

    await sharp(originalPath)
      .resize(800, 600, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toFile(processedPath);

    // Delete original file
    fs.unlinkSync(originalPath);

    // Return processed image URL
    const imageUrl = `/uploads/${processedFilename}`;

    res.json({
      message: 'Image uploaded and processed successfully',
      imageUrl: imageUrl,
      filename: processedFilename
    });

  } catch (error) {
    console.error('Image upload error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Upload Failed',
      message: 'An error occurred while uploading the image'
    });
  }
});

// @route   POST /api/upload/images
// @desc    Upload multiple images
// @access  Private
router.post('/images', imageUpload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No Files Uploaded',
        message: 'Please select image files to upload'
      });
    }

    const processedImages = [];

    for (const file of req.files) {
      try {
        const originalPath = file.path;
        const filename = path.parse(file.filename).name;
        const ext = path.parse(file.filename).ext;

        // Process image with Sharp
        const processedFilename = `${filename}_processed${ext}`;
        const processedPath = path.join(uploadsDir, processedFilename);

        await sharp(originalPath)
          .resize(800, 600, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 85 })
          .toFile(processedPath);

        // Delete original file
        fs.unlinkSync(originalPath);

        processedImages.push({
          filename: processedFilename,
          imageUrl: `/uploads/${processedFilename}`
        });

      } catch (processError) {
        console.error('Error processing file:', file.filename, processError);
        
        // Clean up file if it exists
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    res.json({
      message: `${processedImages.length} images uploaded and processed successfully`,
      images: processedImages
    });

  } catch (error) {
    console.error('Multiple image upload error:', error);
    
    // Clean up any uploaded files
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      error: 'Upload Failed',
      message: 'An error occurred while uploading the images'
    });
  }
});

// Helper function to find or create category
async function findOrCreateCategory(categoryName, subcategoryName = null) {
  if (!categoryName) return null;

  // Find or create main category
  let category = await prisma.category.findFirst({
    where: { name: { equals: categoryName, mode: 'insensitive' } }
  });

  if (!category) {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    category = await prisma.category.create({
      data: {
        name: categoryName,
        slug: slug,
        description: `Auto-created category: ${categoryName}`
      }
    });
  }

  // Handle subcategory if provided
  if (subcategoryName) {
    let subcategory = await prisma.category.findFirst({
      where: { 
        name: { equals: subcategoryName, mode: 'insensitive' },
        parent_id: category.id
      }
    });

    if (!subcategory) {
      const subSlug = subcategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      subcategory = await prisma.category.create({
        data: {
          name: subcategoryName,
          slug: subSlug,
          parent_id: category.id,
          description: `Auto-created subcategory: ${subcategoryName}`
        }
      });
    }

    return { category, subcategory };
  }

  return { category, subcategory: null };
}

// @route   POST /api/upload/csv-products
// @desc    Upload and import products from CSV
// @access  Private (Admin only)
router.post('/csv-products', csvUpload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No File Uploaded',
        message: 'Please select a CSV file to upload'
      });
    }

    const filePath = req.file.path;
    const results = [];
    const errors = [];
    let lineNumber = 0;

    // Parse CSV file
    const csvStream = fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim()
      }));

    // Process each row
    for await (const row of csvStream) {
      lineNumber++;
      
      try {
        // Validate required fields
        const requiredFields = ['Name', 'SKU', 'Price'];
        const missingFields = requiredFields.filter(field => !row[field] || row[field].trim() === '');
        
        if (missingFields.length > 0) {
          errors.push({
            line: lineNumber,
            error: `Missing required fields: ${missingFields.join(', ')}`,
            data: row
          });
          continue;
        }

        // Parse and validate data
        const name = row.Name.trim();
        const sku = row.SKU.trim();
        const catalogNumber = row['Catalog Number']?.trim() || null;
        const price = parseFloat(row.Price);
        const stockQuantity = parseInt(row['Stock Quantity']) || 0;
        const description = row.Description?.trim() || null;
        const inStock = row['In Stock']?.toLowerCase() === 'yes' || stockQuantity > 0;

        if (isNaN(price) || price < 0) {
          errors.push({
            line: lineNumber,
            error: 'Invalid price value',
            data: row
          });
          continue;
        }

        // Check if product with SKU already exists
        const existingProduct = await prisma.product.findUnique({
          where: { sku: sku }
        });

        if (existingProduct) {
          errors.push({
            line: lineNumber,
            error: `Product with SKU "${sku}" already exists`,
            data: row
          });
          continue;
        }

        // Find or create categories
        const categoryData = await findOrCreateCategory(
          row.Category?.trim(),
          row.Subcategory?.trim()
        );

        // Create product
        const productData = {
          name: name,
          sku: sku,
          catalog_number: catalogNumber,
          description: description,
          price: price,
          stock_quantity: stockQuantity,
          in_stock: inStock,
          is_active: true,
          category_id: categoryData?.category?.id || null,
          subcategory_id: categoryData?.subcategory?.id || null
        };

        // Remove null category_id if not provided
        if (!productData.category_id) {
          delete productData.category_id;
          // Create a default category
          let defaultCategory = await prisma.category.findFirst({
            where: { name: 'Uncategorized' }
          });
          
          if (!defaultCategory) {
            defaultCategory = await prisma.category.create({
              data: {
                name: 'Uncategorized',
                slug: 'uncategorized',
                description: 'Default category for uncategorized products'
              }
            });
          }
          
          productData.category_id = defaultCategory.id;
        }

        const product = await prisma.product.create({
          data: productData
        });

        results.push({
          line: lineNumber,
          success: true,
          productId: product.id,
          sku: product.sku,
          name: product.name
        });

      } catch (error) {
        console.error(`Error processing line ${lineNumber}:`, error);
        errors.push({
          line: lineNumber,
          error: error.message || 'Unknown error occurred',
          data: row
        });
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Return results
    res.json({
      message: 'CSV import completed',
      summary: {
        totalLines: lineNumber,
        successful: results.length,
        failed: errors.length
      },
      results: results,
      errors: errors
    });

  } catch (error) {
    console.error('CSV import error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Import Failed',
      message: 'An error occurred while importing the CSV file'
    });
  }
});

// @route   DELETE /api/upload/:filename
// @desc    Delete uploaded file
// @access  Private
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File Not Found',
        message: 'The requested file does not exist'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.json({
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      error: 'Delete Failed',
      message: 'An error occurred while deleting the file'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File Too Large',
        message: 'File size exceeds the maximum allowed limit'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too Many Files',
        message: 'Too many files uploaded at once'
      });
    }
  }

  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      error: 'Invalid File Type',
      message: 'Only image files are allowed'
    });
  }

  res.status(500).json({
    error: 'Upload Error',
    message: error.message
  });
});

module.exports = router;
