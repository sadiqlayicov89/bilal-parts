-- Check product category field values
-- Run this in Supabase SQL Editor

-- Check how products are categorized
SELECT 
  p.name as product_name,
  p.category_id,
  c.name as category_name,
  p.category as product_category_field
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
ORDER BY c.name, p.name
LIMIT 20;

-- Check unique values in product.category field
SELECT DISTINCT 
  p.category as product_category_field,
  COUNT(*) as count
FROM public.products p
WHERE p.category IS NOT NULL
GROUP BY p.category
ORDER BY count DESC;

-- Check if products have both category_id and category field
SELECT 
  COUNT(*) as total_products,
  COUNT(category_id) as products_with_category_id,
  COUNT(category) as products_with_category_field
FROM public.products;
