const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// @route   GET /api/news
// @desc    Get all news articles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, published } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    // Only show published articles for public access
    if (published !== 'false') {
      where.is_published = true;
      where.published_at = { not: null };
    }

    if (category) {
      where.category = category;
    }

    const [articles, totalCount] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          category: true,
          published_at: true,
          created_at: true
        },
        orderBy: { published_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.newsArticle.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      image: article.image,
      category: article.category,
      publishedAt: article.published_at,
      createdAt: article.created_at
    }));

    res.json({
      articles: formattedArticles,
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
    console.error('Get news articles error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching news articles'
    });
  }
});

// @route   GET /api/news/:slug
// @desc    Get single news article by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        image: true,
        category: true,
        is_published: true,
        published_at: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!article) {
      return res.status(404).json({
        error: 'Article Not Found',
        message: 'The requested article does not exist'
      });
    }

    if (!article.is_published) {
      return res.status(404).json({
        error: 'Article Not Found',
        message: 'The requested article is not published'
      });
    }

    const formattedArticle = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      category: article.category,
      publishedAt: article.published_at,
      createdAt: article.created_at,
      updatedAt: article.updated_at
    };

    res.json(formattedArticle);

  } catch (error) {
    console.error('Get news article error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching the article'
    });
  }
});

// @route   GET /api/news/categories
// @desc    Get news categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.newsArticle.findMany({
      where: {
        is_published: true,
        category: { not: null }
      },
      select: {
        category: true
      },
      distinct: ['category']
    });

    const categoryList = categories
      .map(item => item.category)
      .filter(Boolean)
      .sort();

    res.json(categoryList);

  } catch (error) {
    console.error('Get news categories error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching news categories'
    });
  }
});

module.exports = router;
