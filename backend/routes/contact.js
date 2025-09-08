const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();
const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @route   POST /api/contact
// @desc    Send contact message
// @access  Public
router.post('/', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('subject').optional().trim(),
  body('message').notEmpty().trim().withMessage('Message is required')
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

    const { name, email, phone, subject, message } = req.body;

    // Save contact message to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message
      }
    });

    // Send email notification to admin
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.COMPANY_EMAIL,
        subject: `New Contact Message: ${subject || 'No Subject'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">New Contact Message</h2>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
              <p><strong>Message:</strong></p>
              <div style="background-color: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p style="color: #666; font-size: 12px;">
              This message was sent from the Bilal Parts website contact form.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError);
      // Don't fail the request if email fails
    }

    // Send auto-reply to customer
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Thank you for contacting Bilal Parts',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Thank you for contacting us!</h2>
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to Bilal Parts. We have received your message and will get back to you as soon as possible.</p>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Your Message:</strong></p>
              <div style="background-color: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p>We typically respond within 24 hours during business days.</p>
            <p>If you have any urgent inquiries, please call us at ${process.env.COMPANY_PHONE}.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              Bilal Parts Co., Ltd.<br>
              Premium Parts & Accessories<br>
              Stock Code: ${process.env.COMPANY_STOCK_CODE}<br>
              Email: ${process.env.COMPANY_EMAIL}<br>
              Phone: ${process.env.COMPANY_PHONE}<br>
              Address: ${process.env.COMPANY_ADDRESS}
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send auto-reply email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Your message has been sent successfully. We will get back to you soon!',
      messageId: contactMessage.id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while sending your message'
    });
  }
});

// @route   GET /api/contact/messages
// @desc    Get contact messages (Admin only)
// @access  Private (Admin)
router.get('/messages', async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Admin privileges required'
      });
    }

    const { page = 1, limit = 20, isRead } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (isRead !== undefined) {
      where.is_read = isRead === 'true';
    }

    const [messages, totalCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.contactMessage.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      messages,
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
    console.error('Get contact messages error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching contact messages'
    });
  }
});

// @route   PUT /api/contact/messages/:messageId/read
// @desc    Mark contact message as read (Admin only)
// @access  Private (Admin)
router.put('/messages/:messageId/read', async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Admin privileges required'
      });
    }

    const { messageId } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({
        error: 'Message Not Found',
        message: 'The requested message does not exist'
      });
    }

    await prisma.contactMessage.update({
      where: { id: messageId },
      data: { is_read: true }
    });

    res.json({
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating message status'
    });
  }
});

// @route   DELETE /api/contact/messages/:messageId
// @desc    Delete contact message (Admin only)
// @access  Private (Admin)
router.delete('/messages/:messageId', async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Admin privileges required'
      });
    }

    const { messageId } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({
        error: 'Message Not Found',
        message: 'The requested message does not exist'
      });
    }

    await prisma.contactMessage.delete({
      where: { id: messageId }
    });

    res.json({
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while deleting the message'
    });
  }
});

module.exports = router;
