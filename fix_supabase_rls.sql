-- Fix Supabase RLS policies to allow public access to products and categories
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Product images are viewable by everyone" ON public.product_images;
DROP POLICY IF EXISTS "Product specifications are viewable by everyone" ON public.product_specifications;

-- Create new public read policies (no authentication required)
CREATE POLICY "Public can view products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view product images" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Public can view product specifications" ON public.product_specifications
  FOR SELECT USING (true);

-- Also allow public access to company info
DROP POLICY IF EXISTS "Company info is viewable by everyone" ON public.company_info;
CREATE POLICY "Public can view company info" ON public.company_info
  FOR SELECT USING (true);

-- Success message
SELECT 'RLS policies updated successfully! Products and categories are now publicly accessible.' as message;
