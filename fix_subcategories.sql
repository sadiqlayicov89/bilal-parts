-- Fix subcategory assignments for products
-- Run this in Supabase SQL Editor

-- Assign more products to subcategories based on their names
-- Forklift subcategories
UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Electric Forklifts' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%electric%' OR LOWER(name) LIKE '%ignition%' OR LOWER(name) LIKE '%switch%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Forklift Parts' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Diesel Forklifts' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%diesel%' OR LOWER(name) LIKE '%fuel%' OR LOWER(name) LIKE '%injector%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Forklift Parts' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'LPG Forklifts' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%lpg%' OR LOWER(name) LIKE '%gas%' OR LOWER(name) LIKE '%propane%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Forklift Parts' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Warehouse Forklifts' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%warehouse%' OR LOWER(name) LIKE '%narrow%' OR LOWER(name) LIKE '%reach%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Forklift Parts' AND parent_id IS NULL);

-- Engine subcategories
UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Pistons & Rings' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%piston%' OR LOWER(name) LIKE '%ring%' OR LOWER(name) LIKE '%cylinder%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Engine Parts' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Crankshafts' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%crankshaft%' OR LOWER(name) LIKE '%crank%' OR LOWER(name) LIKE '%shaft%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Engine Parts' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Cylinder Heads' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%head%' OR LOWER(name) LIKE '%valve%' OR LOWER(name) LIKE '%spring%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Engine Parts' AND parent_id IS NULL);

-- Transmission subcategories
UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Gearboxes' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%gearbox%' OR LOWER(name) LIKE '%gear%' OR LOWER(name) LIKE '%transmission%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Transmission' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Clutches' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%clutch%' OR LOWER(name) LIKE '%disc%' OR LOWER(name) LIKE '%pressure%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Transmission' AND parent_id IS NULL);

-- Brake subcategories
UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Brake Pads' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%pad%' OR LOWER(name) LIKE '%shoe%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Brake System' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Brake Discs' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%disc%' OR LOWER(name) LIKE '%rotor%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Brake System' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Brake Calipers' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%caliper%' OR LOWER(name) LIKE '%cylinder%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Brake System' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Brake Lines' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%line%' OR LOWER(name) LIKE '%hose%' OR LOWER(name) LIKE '%cable%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Brake System' AND parent_id IS NULL);

-- Electrical subcategories
UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Batteries' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%battery%' OR LOWER(name) LIKE '%cell%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Electrical' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Alternators' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%alternator%' OR LOWER(name) LIKE '%generator%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Electrical' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Starters' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%starter%' OR LOWER(name) LIKE '%motor%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Electrical' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Wiring' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%wire%' OR LOWER(name) LIKE '%harness%' OR LOWER(name) LIKE '%cable%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Electrical' AND parent_id IS NULL);

-- Filter subcategories
UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Air Filters' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%air%' AND LOWER(name) LIKE '%filter%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Filters' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Oil Filters' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%oil%' AND LOWER(name) LIKE '%filter%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Filters' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Fuel Filters' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%fuel%' AND LOWER(name) LIKE '%filter%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Filters' AND parent_id IS NULL);

-- Hydraulic subcategories
UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Hydraulic Pumps' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%pump%' AND LOWER(name) LIKE '%hydraulic%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Hydraulic Parts' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Hydraulic Cylinders' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%cylinder%' AND LOWER(name) LIKE '%hydraulic%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Hydraulic Parts' AND parent_id IS NULL);

-- Cooling subcategories
UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Radiators' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%radiator%' OR LOWER(name) LIKE '%cooling%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Cooling System' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Water Pumps' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%water%' AND LOWER(name) LIKE '%pump%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Cooling System' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Cooling Fans' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%fan%' OR LOWER(name) LIKE '%cooling%'
AND category_id = (SELECT id FROM public.categories WHERE name = 'Cooling System' AND parent_id IS NULL);

-- Show results
SELECT 
  'Subcategory Assignment Results' as info,
  COUNT(*) as total_products_with_subcategories
FROM public.products
WHERE subcategory_id IS NOT NULL;

-- Show sample products with subcategories
SELECT 
  p.name as product_name,
  c1.name as main_category,
  c2.name as subcategory
FROM public.products p
LEFT JOIN public.categories c1 ON p.category_id = c1.id
LEFT JOIN public.categories c2 ON p.subcategory_id = c2.id
WHERE p.subcategory_id IS NOT NULL
ORDER BY c1.name, c2.name, p.name
LIMIT 20;
