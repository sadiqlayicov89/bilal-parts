-- Check final product distribution across categories
-- Run this in Supabase SQL Editor

-- Show product count per main category
SELECT 
  c.name as category_name,
  COUNT(p.id) as product_count
FROM public.categories c
LEFT JOIN public.products p ON p.category_id = c.id
WHERE c.parent_id IS NULL  -- Only main categories
GROUP BY c.id, c.name
ORDER BY product_count DESC;

-- Show total products
SELECT 
  'Total Products with Categories' as info,
  COUNT(*) as count
FROM public.products
WHERE category_id IS NOT NULL;

-- Show products without categories (should be 0)
SELECT 
  'Products without Categories' as info,
  COUNT(*) as count
FROM public.products
WHERE category_id IS NULL;
