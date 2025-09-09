-- Simple product redistribution to categories
-- Run this in Supabase SQL Editor

-- Step 1: Temporarily remove NOT NULL constraint from category_id
ALTER TABLE public.products ALTER COLUMN category_id DROP NOT NULL;

-- Step 2: Clear all current category assignments
UPDATE public.products SET category_id = NULL;

-- Step 3: Get all main categories in order
-- We have 10 main categories, so we'll distribute 94 products evenly
-- That's about 9-10 products per category

-- Step 4: Assign products to Forklift Parts (first 10 products)
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Forklift Parts' AND parent_id IS NULL)
WHERE id IN (
  SELECT id FROM public.products 
  ORDER BY name 
  LIMIT 10
);

-- Step 5: Assign products to Engine Parts (next 10 products)
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Engine Parts' AND parent_id IS NULL)
WHERE id IN (
  SELECT id FROM public.products 
  WHERE category_id IS NULL
  ORDER BY name 
  LIMIT 10
);

-- Step 6: Assign products to Transmission (next 10 products)
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Transmission' AND parent_id IS NULL)
WHERE id IN (
  SELECT id FROM public.products 
  WHERE category_id IS NULL
  ORDER BY name 
  LIMIT 10
);

-- Step 7: Assign products to Brake System (next 10 products)
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Brake System' AND parent_id IS NULL)
WHERE id IN (
  SELECT id FROM public.products 
  WHERE category_id IS NULL
  ORDER BY name 
  LIMIT 10
);

-- Step 8: Assign products to Electrical (next 10 products)
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Electrical' AND parent_id IS NULL)
WHERE id IN (
  SELECT id FROM public.products 
  WHERE category_id IS NULL
  ORDER BY name 
  LIMIT 10
);

-- Step 9: Assign products to Filters (next 10 products)
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Filters' AND parent_id IS NULL)
WHERE id IN (
  SELECT id FROM public.products 
  WHERE category_id IS NULL
  ORDER BY name 
  LIMIT 10
);

-- Step 10: Assign products to Hydraulic Parts (next 10 products)
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Hydraulic Parts' AND parent_id IS NULL)
WHERE id IN (
  SELECT id FROM public.products 
  WHERE category_id IS NULL
  ORDER BY name 
  LIMIT 10
);

-- Step 11: Assign products to Cooling System (next 10 products)
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Cooling System' AND parent_id IS NULL)
WHERE id IN (
  SELECT id FROM public.products 
  WHERE category_id IS NULL
  ORDER BY name 
  LIMIT 10
);

-- Step 12: Assign products to Suspension (next 10 products)
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Suspension' AND parent_id IS NULL)
WHERE id IN (
  SELECT id FROM public.products 
  WHERE category_id IS NULL
  ORDER BY name 
  LIMIT 10
);

-- Step 13: Assign remaining products to Accessories
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Accessories' AND parent_id IS NULL)
WHERE category_id IS NULL;

-- Step 14: Restore NOT NULL constraint on category_id
ALTER TABLE public.products ALTER COLUMN category_id SET NOT NULL;

-- Step 15: Show final distribution
SELECT 
  c.name as category_name,
  COUNT(p.id) as product_count
FROM public.categories c
LEFT JOIN public.products p ON p.category_id = c.id
WHERE c.parent_id IS NULL
GROUP BY c.id, c.name
ORDER BY product_count DESC;

-- Step 16: Show total
SELECT 
  'Total Products' as info,
  COUNT(*) as count
FROM public.products
WHERE category_id IS NOT NULL;
