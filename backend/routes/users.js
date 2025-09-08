const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User does not exist'
      });
    }

    res.json(user);

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching user profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('phone').optional().isMobilePhone(),
  body('company_name').optional().trim(),
  body('country').optional().trim(),
  body('city').optional().trim(),
  body('vat_number').optional().trim()
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

    const userId = req.user.id;
    const {
      first_name,
      last_name,
      phone,
      company_name,
      country,
      city,
      vat_number
    } = req.body;

    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (phone !== undefined) updateData.phone = phone;
    if (company_name !== undefined) updateData.company_name = company_name;
    if (country !== undefined) updateData.country = country;
    if (city !== undefined) updateData.city = city;
    if (vat_number !== undefined) updateData.vat_number = vat_number;

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
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating user profile'
    });
  }
});

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses', async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await prisma.address.findMany({
      where: { user_id: userId },
      orderBy: [
        { is_default: 'desc' },
        { created_at: 'desc' }
      ]
    });

    res.json(addresses);

  } catch (error) {
    console.error('Get user addresses error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching addresses'
    });
  }
});

// @route   POST /api/users/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', [
  body('type').isIn(['SHIPPING', 'BILLING']).withMessage('Type must be SHIPPING or BILLING'),
  body('first_name').notEmpty().trim().withMessage('First name is required'),
  body('last_name').notEmpty().trim().withMessage('Last name is required'),
  body('address_line_1').notEmpty().trim().withMessage('Address line 1 is required'),
  body('city').notEmpty().trim().withMessage('City is required'),
  body('postal_code').notEmpty().trim().withMessage('Postal code is required'),
  body('country').notEmpty().trim().withMessage('Country is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('is_default').optional().isBoolean()
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

    const userId = req.user.id;
    const {
      type,
      first_name,
      last_name,
      company,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
      phone,
      is_default
    } = req.body;

    // If this is set as default, unset other default addresses of the same type
    if (is_default) {
      await prisma.address.updateMany({
        where: {
          user_id: userId,
          type: type
        },
        data: { is_default: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        user_id: userId,
        type,
        first_name,
        last_name,
        company,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
        phone,
        is_default: is_default || false
      }
    });

    res.status(201).json({
      message: 'Address added successfully',
      address
    });

  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while adding address'
    });
  }
});

// @route   PUT /api/users/addresses/:addressId
// @desc    Update address
// @access  Private
router.put('/addresses/:addressId', [
  body('type').optional().isIn(['SHIPPING', 'BILLING']),
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('address_line_1').optional().trim().notEmpty(),
  body('city').optional().trim().notEmpty(),
  body('postal_code').optional().trim().notEmpty(),
  body('country').optional().trim().notEmpty(),
  body('phone').optional().isMobilePhone(),
  body('is_default').optional().isBoolean()
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

    const { addressId } = req.params;
    const userId = req.user.id;

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        user_id: userId
      }
    });

    if (!existingAddress) {
      return res.status(404).json({
        error: 'Address Not Found',
        message: 'The requested address does not exist'
      });
    }

    const {
      type,
      first_name,
      last_name,
      company,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
      phone,
      is_default
    } = req.body;

    // If this is set as default, unset other default addresses of the same type
    if (is_default) {
      await prisma.address.updateMany({
        where: {
          user_id: userId,
          type: type || existingAddress.type,
          id: { not: addressId }
        },
        data: { is_default: false }
      });
    }

    const updateData = {};
    if (type !== undefined) updateData.type = type;
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (company !== undefined) updateData.company = company;
    if (address_line_1 !== undefined) updateData.address_line_1 = address_line_1;
    if (address_line_2 !== undefined) updateData.address_line_2 = address_line_2;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (postal_code !== undefined) updateData.postal_code = postal_code;
    if (country !== undefined) updateData.country = country;
    if (phone !== undefined) updateData.phone = phone;
    if (is_default !== undefined) updateData.is_default = is_default;

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: updateData
    });

    res.json({
      message: 'Address updated successfully',
      address: updatedAddress
    });

  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating address'
    });
  }
});

// @route   DELETE /api/users/addresses/:addressId
// @desc    Delete address
// @access  Private
router.delete('/addresses/:addressId', async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    // Check if address exists and belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        user_id: userId
      }
    });

    if (!address) {
      return res.status(404).json({
        error: 'Address Not Found',
        message: 'The requested address does not exist'
      });
    }

    await prisma.address.delete({
      where: { id: addressId }
    });

    res.json({
      message: 'Address deleted successfully'
    });

  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while deleting address'
    });
  }
});

module.exports = router;
