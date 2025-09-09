-- Redistribute all products to categories more evenly
-- Run this in Supabase SQL Editor

-- First, let's see current distribution
SELECT 
  c.name as category_name,
  COUNT(p.id) as product_count
FROM public.categories c
LEFT JOIN public.products p ON p.category_id = c.id
WHERE c.parent_id IS NULL
GROUP BY c.id, c.name
ORDER BY product_count DESC;

-- Now redistribute products more evenly
-- Get all main categories
WITH main_categories AS (
  SELECT id, name, sort_order 
  FROM public.categories 
  WHERE parent_id IS NULL 
  ORDER BY sort_order
),
-- Get all products
all_products AS (
  SELECT id, name 
  FROM public.products 
  ORDER BY name
),
-- Assign products to categories in round-robin fashion
product_assignments AS (
  SELECT 
    p.id as product_id,
    p.name as product_name,
    c.id as category_id,
    c.name as category_name,
    ROW_NUMBER() OVER (ORDER BY p.name) as product_rank,
    ROW_NUMBER() OVER (ORDER BY p.name) % (SELECT COUNT(*) FROM main_categories) as category_index
  FROM all_products p
  CROSS JOIN main_categories c
  WHERE ROW_NUMBER() OVER (ORDER BY p.name) % (SELECT COUNT(*) FROM main_categories) = 
        (SELECT ROW_NUMBER() OVER (ORDER BY sort_order) - 1 FROM main_categories mc WHERE mc.id = c.id)
)

-- Update products with new category assignments
UPDATE public.products 
SET category_id = pa.category_id
FROM (
  SELECT DISTINCT
    p.id as product_id,
    FIRST_VALUE(c.id) OVER (PARTITION BY p.id ORDER BY c.sort_order) as category_id
  FROM public.products p
  CROSS JOIN main_categories c
  WHERE (ROW_NUMBER() OVER (ORDER BY p.name) % (SELECT COUNT(*) FROM main_categories)) = 
        (ROW_NUMBER() OVER (ORDER BY c.sort_order) - 1)
) pa
WHERE public.products.id = pa.product_id;

-- Show new distribution
SELECT 
  c.name as category_name,
  COUNT(p.id) as product_count
FROM public.categories c
LEFT JOIN public.products p ON p.category_id = c.id
WHERE c.parent_id IS NULL
GROUP BY c.id, c.name
ORDER BY product_count DESC;
