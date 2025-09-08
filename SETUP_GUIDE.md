# 🚀 Bilal Parts E-commerce Platform - Complete Setup Guide

## 📋 Overview

This is a complete, production-ready e-commerce platform for Bilal Parts Co., Ltd. featuring:

- **Frontend**: React.js with modern UI components
- **Backend**: Node.js/Express API with PostgreSQL database
- **Features**: Full e-commerce functionality with admin panel

## 🎯 Quick Start (5 Minutes)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env file with your database URL
# DATABASE_URL="postgresql://username:password@localhost:5432/bilal_parts_db"

# Setup database
npx prisma generate
npx prisma migrate dev
npm run seed

# Start backend server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start frontend development server
npm start
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin

## 🔐 Default Login Credentials

After running the seed script:

**Admin User:**
- Email: `admin@bilal-parts.com`
- Password: `admin123`

**Test Customer:**
- Email: `customer@example.com`
- Password: `customer123`

## 🛠️ Detailed Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Configuration

1. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb bilal_parts_db
   
   # Or use your preferred database management tool
   ```

2. **Environment Variables**
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

3. **Database Migration & Seeding**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed with sample data
   npm run seed
   ```

### Frontend Configuration

1. **Environment Variables**
   ```env
   # Backend API
   REACT_APP_BACKEND_URL=http://localhost:5000
   
   # Optional: Supabase (if using)
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

## 🎨 Features Overview

### 🛍️ E-commerce Features
- ✅ Product catalog with categories and subcategories
- ✅ Advanced search and filtering
- ✅ Shopping cart with persistent storage
- ✅ Wishlist functionality
- ✅ User authentication and registration
- ✅ Order management system
- ✅ Product reviews and ratings
- ✅ User profiles and addresses
- ✅ Discount system for users

### 👨‍💼 Admin Panel
- ✅ Dashboard with statistics
- ✅ User management
- ✅ Product management
- ✅ Order management
- ✅ Category management
- ✅ Contact message management
- ✅ Newsletter subscribers
- ✅ Company information management

### 🎯 Technical Features
- ✅ Responsive design (mobile-friendly)
- ✅ Modern UI with Tailwind CSS
- ✅ JWT authentication
- ✅ File upload with image processing
- ✅ Email notifications
- ✅ API rate limiting
- ✅ Error handling and validation
- ✅ Database relationships with Prisma ORM

## 📁 Project Structure

```
bilal-parts-platform/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth, Cart, Wishlist)
│   │   ├── pages/          # Page components
│   │   ├── data/           # Mock data
│   │   └── hooks/          # Custom React hooks
│   └── package.json
├── backend/                 # Node.js backend
│   ├── routes/             # API route handlers
│   ├── middleware/         # Express middleware
│   ├── prisma/            # Database schema and migrations
│   ├── scripts/           # Database seeding scripts
│   └── package.json
└── README.md
```

## 🔧 Development Commands

### Backend Commands
```bash
npm run dev          # Start development server
npm start           # Start production server
npm run migrate     # Run database migrations
npm run generate    # Generate Prisma client
npm run seed        # Seed database with sample data
npm run studio      # Open Prisma Studio
```

### Frontend Commands
```bash
npm start           # Start development server
npm run build       # Build for production
npm test           # Run tests
```

## 🚀 Production Deployment

### Backend Deployment

1. **Environment Setup**
   ```env
   NODE_ENV=production
   DATABASE_URL=your-production-database-url
   JWT_SECRET=your-production-jwt-secret
   PORT=5000
   ```

2. **Database Migration**
   ```bash
   npx prisma migrate deploy
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform**
   - Vercel, Netlify, or any static hosting service
   - Update `REACT_APP_BACKEND_URL` to your production API URL

## 🔍 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products

### Cart Endpoints (Authenticated)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item from cart

### Admin Endpoints (Admin Only)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/products` - Get all products
- `GET /api/admin/orders` - Get all orders

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- Helmet.js security headers
- SQL injection protection with Prisma

## 📱 Mobile Responsiveness

The platform is fully responsive and works perfectly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎨 UI/UX Features

- Modern, clean design
- Intuitive navigation
- Fast loading times
- Smooth animations
- Accessible components
- Multi-language support ready

## 🔧 Customization

### Adding New Product Categories
1. Use the admin panel to add categories
2. Or directly add to the database via Prisma Studio

### Modifying Company Information
1. Use the admin panel company section
2. Or update via API endpoint `/api/company`

### Customizing Styling
- Modify Tailwind CSS classes in components
- Update theme colors in `tailwind.config.js`
- Add custom CSS in `src/index.css`

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **Frontend Can't Connect to Backend**
   - Check `REACT_APP_BACKEND_URL` in frontend `.env`
   - Ensure backend server is running on correct port
   - Check CORS settings in backend

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in backend `.env`
   - Verify token expiration settings

### Getting Help

- Check the console for error messages
- Review the API documentation
- Check database logs
- Verify environment variables

## 🎉 Success!

Your Bilal Parts e-commerce platform is now ready! 

**Next Steps:**
1. Customize the company information
2. Add your actual products
3. Configure email settings
4. Set up payment processing
5. Deploy to production

**Happy Selling! 🚀**
