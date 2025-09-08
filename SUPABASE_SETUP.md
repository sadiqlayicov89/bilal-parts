# 🚀 Supabase Setup Guide

Bu təlimat sizə Supabase ilə database və authentication quraşdırmağı göstərir.

## 1. Supabase Project Yaradın

### Addım 1: Supabase hesabı
1. [supabase.com](https://supabase.com) saytına keçin
2. "Start your project" düyməsini basın
3. GitHub hesabınızla daxil olun

### Addım 2: Yeni project yaradın
1. "New Project" düyməsini basın
2. **Name:** `bilal-parts-ecommerce`
3. **Database Password:** güclü parol yaradın (yadda saxlayın!)
4. **Region:** Europe (Frankfurt) seçin
5. **Create new project** basın

## 2. Database Schema Yaradın

### Addım 1: SQL Editor açın
Supabase dashboard-da **"SQL Editor"** bölməsinə keçin

### Addım 2: Database schema yaradın
Aşağıdakı SQL kodunu icra edin:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase auth.users ilə əlaqəli)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company_name TEXT,
  country TEXT,
  city TEXT,
  vat_number TEXT,
  role TEXT DEFAULT 'customer',
  status TEXT DEFAULT 'pending',
  is_active BOOLEAN DEFAULT false,
  discount DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES public.categories(id),
  external_id TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  catalog_number TEXT,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 5,
  in_stock BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  weight DECIMAL(8,2),
  dimensions TEXT,
  brand TEXT,
  model TEXT,
  year INTEGER,
  external_id TEXT UNIQUE,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  subcategory_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Images table
CREATE TABLE public.product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Specifications table
CREATE TABLE public.product_specifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Product images are viewable by everyone" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Product specifications are viewable by everyone" ON public.product_specifications
  FOR SELECT USING (true);

-- Create policies for user profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

-- Add updated_at triggers
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER set_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
```

## 3. Authentication Ayarları

### Addım 1: Auth ayarları
1. **"Authentication"** bölməsinə keçin
2. **"Settings"** tab-ına keçin
3. **"Site URL"** əlavə edin:
   - Development: `http://localhost:3000`
   - Production: `https://your-project-name.vercel.app`

### Addım 2: Email templates (opsional)
**"Email Templates"** bölməsində email şablonlarını fərdiləşdirə bilərsiniz.

## 4. API Keys Alın

**"Settings"** → **"API"** bölməsinə keçin və aşağıdakı açarları kopyalayın:

- **Project URL:** `https://your-project-ref.supabase.co`
- **anon/public key:** `eyJ...` (uzun token)
- **service_role key:** `eyJ...` (uzun token, GİZLİ!)

## 5. Environment Variables

### Backend (.env)
```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.your-project-ref.supabase.co:5432/postgres
```

### Frontend (.env)
```bash
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

## 6. Test Connection

Backend-də test edin:
```bash
cd backend
npm install
npm run migrate
```

Frontend-də test edin:
```bash
cd frontend
npm install
npm start
```

## 7. Admin User Yaradın

Supabase dashboard-da **"Authentication"** → **"Users"** bölməsinə keçin və admin user yaradın:

- **Email:** `admin@bilal-parts.com`
- **Password:** güclü parol
- **User Metadata:**
```json
{
  "role": "admin",
  "first_name": "Admin",
  "last_name": "User"
}
```

## ✅ Hazır!

İndi sisteminiz Supabase ilə tam inteqrasiya olunub:
- ✅ PostgreSQL database
- ✅ Authentication
- ✅ Real-time subscriptions
- ✅ Row Level Security
- ✅ Auto-generated API

## 🔄 Migration

Əgər mövcud SQLite database-dən məlumatları köçürmək istəyirsinizsə, Prisma migrate əmrlərini istifadə edin.
