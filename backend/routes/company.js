const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// @route   GET /api/company
// @desc    Get company information
// @access  Public
router.get('/', async (req, res) => {
  try {
    let companyInfo = await prisma.companyInfo.findFirst({
      orderBy: { created_at: 'desc' }
    });

    // If no company info exists, return default data
    if (!companyInfo) {
      companyInfo = {
        name: process.env.COMPANY_NAME || "BILAL-PARTS CO.,LTD",
        chinese_name: "Premium Parts & Accessories",
        stock_code: process.env.COMPANY_STOCK_CODE || "02499. HK",
        established: "2007",
        headquarters: "Guangzhou, China",
        outlets: "100+",
        countries: "150+",
        parts_in_stock: "3,000,000+",
        experience: "21 years",
        email: process.env.COMPANY_EMAIL || "admin@bilal-parts.com",
        phone: process.env.COMPANY_PHONE || "0086-18520438258",
        fax: "0086-20-3999 3597",
        address: process.env.COMPANY_ADDRESS || "No. 999,Asian Games Avenue,Shiqi Town,Panyu District,Guangzhou,China."
      };
    }

    res.json(companyInfo);

  } catch (error) {
    console.error('Get company info error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching company information'
    });
  }
});

// @route   PUT /api/company
// @desc    Update company information (Admin only)
// @access  Private (Admin)
router.put('/', async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Admin privileges required'
      });
    }

    const {
      name,
      chinese_name,
      stock_code,
      established,
      headquarters,
      outlets,
      countries,
      parts_in_stock,
      experience,
      email,
      phone,
      fax,
      address
    } = req.body;

    // Check if company info exists
    const existingInfo = await prisma.companyInfo.findFirst();

    let companyInfo;
    if (existingInfo) {
      // Update existing
      companyInfo = await prisma.companyInfo.update({
        where: { id: existingInfo.id },
        data: {
          name,
          chinese_name,
          stock_code,
          established,
          headquarters,
          outlets,
          countries,
          parts_in_stock,
          experience,
          email,
          phone,
          fax,
          address
        }
      });
    } else {
      // Create new
      companyInfo = await prisma.companyInfo.create({
        data: {
          name,
          chinese_name,
          stock_code,
          established,
          headquarters,
          outlets,
          countries,
          parts_in_stock,
          experience,
          email,
          phone,
          fax,
          address
        }
      });
    }

    res.json({
      message: 'Company information updated successfully',
      companyInfo
    });

  } catch (error) {
    console.error('Update company info error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating company information'
    });
  }
});

module.exports = router;
