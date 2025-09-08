# Bilal Parts Backend API

A comprehensive backend API for the Bilal Parts e-commerce platform built with Node.js, Express, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Full CRUD operations with categories, subcategories, and specifications
- **Shopping Cart & Wishlist**: Complete cart and wishlist functionality
- **Order Management**: Order processing with status tracking
- **User Management**: User profiles, addresses, and admin panel
- **File Upload**: Image upload and processing with Sharp
- **Email Integration**: Contact forms and notifications
- **Payment Processing**: Stripe integration (placeholder)
- **Admin Dashboard**: Comprehensive admin panel with statistics
- **API Documentation**: Well-documented REST API endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer with Sharp for image processing
- **Email**: Nodemailer
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bilal_parts_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Email (Optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npm run seed
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search/suggestions` - Get search suggestions

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/tree` - Get categories in tree structure
- `GET /api/categories/:slug` - Get single category

### Cart (Authenticated)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Wishlist (Authenticated)
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove/:itemId` - Remove item from wishlist
- `POST /api/wishlist/toggle` - Toggle item in wishlist

### Orders (Authenticated)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order details
- `POST /api/orders/create` - Create new order
- `PUT /api/orders/:orderId/cancel` - Cancel order

### Admin (Admin Only)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId` - Update user
- `GET /api/admin/products` - Get all products
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:orderId/status` - Update order status

### Other Endpoints
- `POST /api/contact` - Send contact message
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/news` - Get news articles
- `GET /api/company` - Get company information
- `POST /api/upload/image` - Upload image
- `POST /api/payments/create-intent` - Create payment intent

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **ADMIN**: Full access to all endpoints and admin panel
- **CUSTOMER**: Standard user with cart, wishlist, and order access
- **MANAGER**: Limited admin access (can be extended)

## 🗄️ Database Schema

The database includes the following main entities:

- **Users**: User accounts with roles and profiles
- **Categories**: Product categories and subcategories
- **Products**: Product catalog with images and specifications
- **Cart Items**: Shopping cart functionality
- **Wishlist Items**: User wishlists
- **Orders**: Order management with items
- **Addresses**: User shipping/billing addresses
- **Reviews**: Product reviews and ratings
- **Contact Messages**: Contact form submissions
- **News Articles**: Company news and updates

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Production Deployment

### 1. Environment Variables

Set up production environment variables:

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
PORT=5000
```

### 2. Database Migration

```bash
npx prisma migrate deploy
```

### 3. Start Production Server

```bash
npm start
```

## 🔧 Development

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name migration-name
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 📝 API Documentation

For detailed API documentation, visit:
- Development: `http://localhost:5000/`
- Health Check: `http://localhost:5000/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: admin@bilal-parts.com
- Phone: 0086-18520438258

## 🎯 Default Credentials

After seeding the database:

**Admin User:**
- Email: admin@bilal-parts.com
- Password: admin123

**Test Customer:**
- Email: customer@example.com
- Password: customer123
