-- Comprehensive RLS fix for Supabase
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily to ensure access
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_info DISABLE ROW LEVEL SECURITY;

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

-- Re-enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;

-- Create new public read policies (no authentication required)
CREATE POLICY "Public can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Public can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view product images" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Public can view product specifications" ON public.product_specifications
  FOR SELECT USING (true);

CREATE POLICY "Public can view company info" ON public.company_info
  FOR SELECT USING (true);

-- Test query to verify access
SELECT 
  'Products count: ' || COUNT(*) as products_count,
  'Categories count: ' || (SELECT COUNT(*) FROM public.categories) as categories_count
FROM public.products 
WHERE is_active = true;

-- Success message
SELECT 'RLS policies updated successfully! All tables are now publicly accessible.' as message;
