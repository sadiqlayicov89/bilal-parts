# Bilal Parts E-commerce Platform

Modern e-commerce platform with 1C:Enterprise integration, built with React and Node.js.

## 🚀 Features

- **Modern React Frontend** - Responsive design with Tailwind CSS
- **Node.js Backend** - RESTful API with Express.js
- **1C Integration** - Full CommerceML2 support for product synchronization
- **Admin Dashboard** - Complete management interface
- **CSV Import** - Bulk product import functionality
- **Prisma ORM** - Type-safe database operations
- **Authentication** - JWT-based user authentication

## 🛠 Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router
- Context API for state management

### Backend
- Node.js
- Express.js
- Prisma ORM
- SQLite Database
- JWT Authentication
- Multer for file uploads

### 1C Integration
- CommerceML2 XML parser
- PHP endpoint for 1C communication
- Real-time synchronization
- Comprehensive logging

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bilal-parts-ecommerce.git
   cd bilal-parts-ecommerce
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend && npm install

   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Setup environment variables**
   ```bash
   # Backend
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize database**
   ```bash
   cd backend
   npx prisma db push
   npx prisma db seed
   ```

5. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

## 🌐 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

### Environment Variables for Production

```bash
DATABASE_URL="file:./production.db"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="production"
CORS_ORIGIN="https://yourdomain.vercel.app"
```

## 🔧 1C Integration Setup

### 1C Configuration
1. Open 1C:Enterprise
2. Go to "Администрирование" → "Интернет-поддержка и сервисы" → "Обмен данными"
3. Select "Настройка обмена с сайтом"
4. Configure:
   - **URL:** `https://yourdomain.vercel.app/backend/1c_exchange.php`
   - **Username:** `1c_user`
   - **Password:** `1c_password`
5. Enable "Выгрузка каталога" and "Выгрузка остатков и цен"

### Supported Data Types
- Categories (Классификатор)
- Products (Товары)
- Prices (Цены)
- Stock quantities (Остатки)

## 📊 Admin Features

- **Dashboard** - Overview statistics
- **User Management** - Customer approval and management
- **Product Management** - CRUD operations, CSV import
- **Order Management** - Order processing and tracking
- **1C Integration** - Monitoring and configuration
- **Category Management** - Hierarchical category structure

## 🔒 Security Features

- JWT authentication
- Password hashing
- Input validation
- CORS protection
- Rate limiting
- File upload restrictions

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)

### 1C Integration
- `POST /api/1c/categories` - Sync categories from 1C
- `POST /api/1c/products` - Sync products from 1C
- `POST /api/1c/offers` - Update prices and stock
- `GET /api/1c/status` - Integration status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email admin@bilal-parts.com or create an issue on GitHub.

## 🔄 Version History

- **v1.0.0** - Initial release with full 1C integration
- Complete e-commerce functionality
- Admin dashboard
- CSV import capabilities