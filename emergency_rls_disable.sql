-- EMERGENCY FIX: Completely disable RLS for all tables
-- This will allow public access to all data
-- Run this in Supabase SQL Editor

-- Disable RLS completely for all tables
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Product images are viewable by everyone" ON public.product_images;
DROP POLICY IF EXISTS "Product specifications are viewable by everyone" ON public.product_specifications;
DROP POLICY IF EXISTS "Company info is viewable by everyone" ON public.company_info;
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
DROP POLICY IF EXISTS "Public can view product specifications" ON public.product_specifications;
DROP POLICY IF EXISTS "Public can view company info" ON public.company_info;

-- Test query to verify access
SELECT 
  'Products count: ' || COUNT(*) as products_count,
  'Categories count: ' || (SELECT COUNT(*) FROM public.categories) as categories_count,
  'Active products: ' || (SELECT COUNT(*) FROM public.products WHERE is_active = true) as active_products
FROM public.products;

-- Success message
SELECT 'EMERGENCY FIX APPLIED: RLS completely disabled for all tables. All data is now publicly accessible.' as message;
