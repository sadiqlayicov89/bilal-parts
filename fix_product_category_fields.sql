-- Fix product category fields to match category names
-- Run this in Supabase SQL Editor

-- Update product.category field based on category_id
UPDATE public.products 
SET category = c.name
FROM public.categories c
WHERE public.products.category_id = c.id;

-- Check the results
SELECT 
  p.name as product_name,
  p.category_id,
  c.name as category_name,
  p.category as product_category_field
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE c.name = 'Electrical'
ORDER BY p.name
LIMIT 10;

-- Check how many products now have matching category fields
SELECT 
  COUNT(*) as total_products,
  COUNT(CASE WHEN p.category = c.name THEN 1 END) as matching_categories
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id;
