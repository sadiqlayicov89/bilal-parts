-- Check current product distribution across categories
-- Run this in Supabase SQL Editor

-- Check how many products are in each category
SELECT 
  c.name as category_name,
  COUNT(p.id) as product_count
FROM public.categories c
LEFT JOIN public.products p ON p.category_id = c.id
WHERE c.parent_id IS NULL  -- Only main categories
GROUP BY c.id, c.name
ORDER BY product_count DESC;

-- Check total products
SELECT COUNT(*) as total_products FROM public.products;

-- Check products without categories
SELECT COUNT(*) as products_without_category 
FROM public.products 
WHERE category_id IS NULL;

-- Show sample products and their categories
SELECT 
  p.name as product_name,
  c.name as category_name,
  p.category_id
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
ORDER BY c.name, p.name
LIMIT 20;
