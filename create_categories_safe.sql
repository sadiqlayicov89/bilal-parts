-- Safe category creation - handle foreign key constraints
-- Run this in Supabase SQL Editor

-- Step 1: Temporarily remove NOT NULL constraint from category_id
ALTER TABLE public.products ALTER COLUMN category_id DROP NOT NULL;

-- Step 2: Set all products to have NULL category_id and subcategory_id
UPDATE public.products SET category_id = NULL, subcategory_id = NULL;

-- Step 3: Now we can safely delete categories
DELETE FROM public.categories;

-- Step 4: Insert main categories
INSERT INTO public.categories (name, slug, description, image, parent_id, is_active, sort_order) VALUES
('Forklift Parts', 'forklift-parts', 'Complete range of forklift parts and components', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop', null, true, 1),
('Engine Parts', 'engine-parts', 'Engine components and parts for all vehicle types', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', null, true, 2),
('Transmission', 'transmission', 'Transmission system components', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop', null, true, 3),
('Brake System', 'brake-system', 'Brake system components and parts', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', null, true, 4),
('Electrical', 'electrical', 'Electrical components and systems', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', null, true, 5),
('Filters', 'filters', 'Air, oil, and fuel filters', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', null, true, 6),
('Hydraulic Parts', 'hydraulic-parts', 'Hydraulic system components', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', null, true, 7),
('Cooling System', 'cooling-system', 'Cooling system components', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', null, true, 8),
('Suspension', 'suspension', 'Suspension system components', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', null, true, 9),
('Accessories', 'accessories', 'Vehicle accessories and tools', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', null, true, 10);

-- Step 5: Create subcategories for Forklift Parts
INSERT INTO public.categories (name, slug, description, image, parent_id, is_active, sort_order)
SELECT 
  sub.name,
  sub.slug,
  sub.description,
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
  main.id,
  true,
  sub.sort_order
FROM (VALUES 
  ('Electric Forklifts', 'electric-forklifts', 'Electric forklift components and parts', 1),
  ('Diesel Forklifts', 'diesel-forklifts', 'Diesel forklift components and parts', 2),
  ('LPG Forklifts', 'lpg-forklifts', 'LPG forklift components and parts', 3),
  ('Warehouse Forklifts', 'warehouse-forklifts', 'Warehouse forklift components and parts', 4)
) AS sub(name, slug, description, sort_order)
CROSS JOIN (SELECT id FROM public.categories WHERE name = 'Forklift Parts') AS main;

-- Step 6: Create subcategories for Engine Parts
INSERT INTO public.categories (name, slug, description, image, parent_id, is_active, sort_order)
SELECT 
  sub.name,
  sub.slug,
  sub.description,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  main.id,
  true,
  sub.sort_order
FROM (VALUES 
  ('Pistons & Rings', 'pistons-rings', 'Pistons and piston rings', 1),
  ('Crankshafts', 'crankshafts', 'Engine crankshafts', 2),
  ('Cylinder Heads', 'cylinder-heads', 'Cylinder head components', 3),
  ('Valves & Springs', 'valves-springs', 'Engine valves and springs', 4)
) AS sub(name, slug, description, sort_order)
CROSS JOIN (SELECT id FROM public.categories WHERE name = 'Engine Parts') AS main;

-- Step 7: Create subcategories for Transmission
INSERT INTO public.categories (name, slug, description, image, parent_id, is_active, sort_order)
SELECT 
  sub.name,
  sub.slug,
  sub.description,
  'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop',
  main.id,
  true,
  sub.sort_order
FROM (VALUES 
  ('Gearboxes', 'gearboxes', 'Manual and automatic gearboxes', 1),
  ('Clutches', 'clutches', 'Clutch components', 2),
  ('Differentials', 'differentials', 'Differential components', 3),
  ('Drive Shafts', 'drive-shafts', 'Drive shaft components', 4)
) AS sub(name, slug, description, sort_order)
CROSS JOIN (SELECT id FROM public.categories WHERE name = 'Transmission') AS main;

-- Step 8: Create subcategories for Brake System
INSERT INTO public.categories (name, slug, description, image, parent_id, is_active, sort_order)
SELECT 
  sub.name,
  sub.slug,
  sub.description,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  main.id,
  true,
  sub.sort_order
FROM (VALUES 
  ('Brake Pads', 'brake-pads', 'Brake pad sets', 1),
  ('Brake Discs', 'brake-discs', 'Brake discs and rotors', 2),
  ('Brake Calipers', 'brake-calipers', 'Brake caliper components', 3),
  ('Brake Lines', 'brake-lines', 'Brake lines and hoses', 4)
) AS sub(name, slug, description, sort_order)
CROSS JOIN (SELECT id FROM public.categories WHERE name = 'Brake System') AS main;

-- Step 9: Create subcategories for Electrical
INSERT INTO public.categories (name, slug, description, image, parent_id, is_active, sort_order)
SELECT 
  sub.name,
  sub.slug,
  sub.description,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  main.id,
  true,
  sub.sort_order
FROM (VALUES 
  ('Batteries', 'batteries', 'Vehicle batteries', 1),
  ('Alternators', 'alternators', 'Alternator components', 2),
  ('Starters', 'starters', 'Starter motor components', 3),
  ('Wiring', 'wiring', 'Electrical wiring and harnesses', 4)
) AS sub(name, slug, description, sort_order)
CROSS JOIN (SELECT id FROM public.categories WHERE name = 'Electrical') AS main;

-- Step 10: Create subcategories for Filters
INSERT INTO public.categories (name, slug, description, image, parent_id, is_active, sort_order)
SELECT 
  sub.name,
  sub.slug,
  sub.description,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  main.id,
  true,
  sub.sort_order
FROM (VALUES 
  ('Air Filters', 'air-filters', 'Engine air filters', 1),
  ('Oil Filters', 'oil-filters', 'Engine oil filters', 2),
  ('Fuel Filters', 'fuel-filters', 'Fuel system filters', 3),
  ('Hydraulic Filters', 'hydraulic-filters', 'Hydraulic system filters', 4)
) AS sub(name, slug, description, sort_order)
CROSS JOIN (SELECT id FROM public.categories WHERE name = 'Filters') AS main;

-- Step 11: Create subcategories for Hydraulic Parts
INSERT INTO public.categories (name, slug, description, image, parent_id, is_active, sort_order)
SELECT 
  sub.name,
  sub.slug,
  sub.description,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  main.id,
  true,
  sub.sort_order
FROM (VALUES 
  ('Hydraulic Pumps', 'hydraulic-pumps', 'Hydraulic pump components', 1),
  ('Hydraulic Cylinders', 'hydraulic-cylinders', 'Hydraulic cylinder components', 2),
  ('Control Valves', 'control-valves', 'Hydraulic control valves', 3),
  ('Hydraulic Hoses', 'hydraulic-hoses', 'Hydraulic hose components', 4)
) AS sub(name, slug, description, sort_order)
CROSS JOIN (SELECT id FROM public.categories WHERE name = 'Hydraulic Parts') AS main;

-- Step 12: Create subcategories for Cooling System
INSERT INTO public.categories (name, slug, description, image, parent_id, is_active, sort_order)
SELECT 
  sub.name,
  sub.slug,
  sub.description,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  main.id,
  true,
  sub.sort_order
FROM (VALUES 
  ('Radiators', 'radiators', 'Cooling radiators', 1),
  ('Water Pumps', 'water-pumps', 'Water pump components', 2),
  ('Thermostats', 'thermostats', 'Thermostat components', 3),
  ('Cooling Fans', 'cooling-fans', 'Cooling fan components', 4)
) AS sub(name, slug, description, sort_order)
CROSS JOIN (SELECT id FROM public.categories WHERE name = 'Cooling System') AS main;

-- Step 13: Create subcategories for Suspension
INSERT INTO public.categories (name, slug, description, image, parent_id, is_active, sort_order)
SELECT 
  sub.name,
  sub.slug,
  sub.description,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  main.id,
  true,
  sub.sort_order
FROM (VALUES 
  ('Shock Absorbers', 'shock-absorbers', 'Shock absorber components', 1),
  ('Springs', 'springs', 'Suspension springs', 2),
  ('Control Arms', 'control-arms', 'Control arm components', 3),
  ('Bushings', 'bushings', 'Suspension bushings', 4)
) AS sub(name, slug, description, sort_order)
CROSS JOIN (SELECT id FROM public.categories WHERE name = 'Suspension') AS main;

-- Step 14: Create subcategories for Accessories
INSERT INTO public.categories (name, slug, description, image, parent_id, is_active, sort_order)
SELECT 
  sub.name,
  sub.slug,
  sub.description,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  main.id,
  true,
  sub.sort_order
FROM (VALUES 
  ('Tools', 'tools', 'Vehicle maintenance tools', 1),
  ('Lubricants', 'lubricants', 'Lubricants and oils', 2),
  ('Safety Equipment', 'safety-equipment', 'Safety equipment and gear', 3),
  ('Cleaning Supplies', 'cleaning-supplies', 'Vehicle cleaning supplies', 4)
) AS sub(name, slug, description, sort_order)
CROSS JOIN (SELECT id FROM public.categories WHERE name = 'Accessories') AS main;

-- Step 15: Now assign products to appropriate categories
-- Assign Forklift-related products to main category
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Forklift Parts' AND parent_id IS NULL)
WHERE LOWER(name) LIKE '%forklift%' OR LOWER(name) LIKE '%gear%' OR LOWER(name) LIKE '%synchro%' OR LOWER(name) LIKE '%shift%' OR LOWER(name) LIKE '%transmission%' OR LOWER(name) LIKE '%pilot%' OR LOWER(name) LIKE '%throwout%' OR LOWER(name) LIKE '%bearing%' OR LOWER(name) LIKE '%mount%';

-- Assign specific forklift products to subcategories
UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Electric Forklifts' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%electric%' AND category_id = (SELECT id FROM public.categories WHERE name = 'Forklift Parts' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Diesel Forklifts' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%diesel%' AND category_id = (SELECT id FROM public.categories WHERE name = 'Forklift Parts' AND parent_id IS NULL);

-- Assign Engine-related products
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Engine Parts' AND parent_id IS NULL)
WHERE LOWER(name) LIKE '%engine%' OR LOWER(name) LIKE '%piston%' OR LOWER(name) LIKE '%ring%' OR LOWER(name) LIKE '%crankshaft%' OR LOWER(name) LIKE '%cylinder%' OR LOWER(name) LIKE '%valve%' OR LOWER(name) LIKE '%spring%' OR LOWER(name) LIKE '%camshaft%' OR LOWER(name) LIKE '%timing%';

-- Assign specific engine products to subcategories
UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Pistons & Rings' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%piston%' OR LOWER(name) LIKE '%ring%' AND category_id = (SELECT id FROM public.categories WHERE name = 'Engine Parts' AND parent_id IS NULL);

UPDATE public.products 
SET subcategory_id = (SELECT id FROM public.categories WHERE name = 'Crankshafts' AND parent_id IS NOT NULL)
WHERE LOWER(name) LIKE '%crankshaft%' AND category_id = (SELECT id FROM public.categories WHERE name = 'Engine Parts' AND parent_id IS NULL);

-- Assign Transmission-related products
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Transmission' AND parent_id IS NULL)
WHERE LOWER(name) LIKE '%clutch%' OR LOWER(name) LIKE '%differential%' OR LOWER(name) LIKE '%driveshaft%' OR LOWER(name) LIKE '%gearbox%';

-- Assign Brake-related products
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Brake System' AND parent_id IS NULL)
WHERE LOWER(name) LIKE '%brake%' OR LOWER(name) LIKE '%pad%' OR LOWER(name) LIKE '%disc%' OR LOWER(name) LIKE '%rotor%' OR LOWER(name) LIKE '%caliper%' OR LOWER(name) LIKE '%line%' OR LOWER(name) LIKE '%hose%';

-- Assign Electrical-related products
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Electrical' AND parent_id IS NULL)
WHERE LOWER(name) LIKE '%battery%' OR LOWER(name) LIKE '%alternator%' OR LOWER(name) LIKE '%starter%' OR LOWER(name) LIKE '%wire%' OR LOWER(name) LIKE '%harness%' OR LOWER(name) LIKE '%sensor%' OR LOWER(name) LIKE '%switch%';

-- Assign Filter-related products
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Filters' AND parent_id IS NULL)
WHERE LOWER(name) LIKE '%filter%' OR LOWER(name) LIKE '%air%' OR LOWER(name) LIKE '%oil%' OR LOWER(name) LIKE '%fuel%' OR LOWER(name) LIKE '%hydraulic%';

-- Assign Hydraulic-related products
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Hydraulic Parts' AND parent_id IS NULL)
WHERE LOWER(name) LIKE '%pump%' OR LOWER(name) LIKE '%cylinder%' OR LOWER(name) LIKE '%valve%' OR LOWER(name) LIKE '%hose%';

-- Assign Cooling-related products
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Cooling System' AND parent_id IS NULL)
WHERE LOWER(name) LIKE '%radiator%' OR LOWER(name) LIKE '%water%' OR LOWER(name) LIKE '%thermostat%' OR LOWER(name) LIKE '%fan%' OR LOWER(name) LIKE '%cooling%';

-- Assign Suspension-related products
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Suspension' AND parent_id IS NULL)
WHERE LOWER(name) LIKE '%shock%' OR LOWER(name) LIKE '%absorber%' OR LOWER(name) LIKE '%spring%' OR LOWER(name) LIKE '%arm%' OR LOWER(name) LIKE '%bushing%';

-- Assign Accessories-related products
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Accessories' AND parent_id IS NULL)
WHERE LOWER(name) LIKE '%tool%' OR LOWER(name) LIKE '%lubricant%' OR LOWER(name) LIKE '%safety%' OR LOWER(name) LIKE '%cleaning%';

-- For any remaining unassigned products, assign to Forklift Parts as default
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE name = 'Forklift Parts' AND parent_id IS NULL)
WHERE category_id IS NULL;

-- Step 16: Restore NOT NULL constraint on category_id
ALTER TABLE public.products ALTER COLUMN category_id SET NOT NULL;

-- Step 17: Verify the results
SELECT 
  'Categories Created' as info,
  COUNT(*) as count
FROM public.categories
UNION ALL
SELECT 
  'Products Assigned' as info,
  COUNT(*) as count
FROM public.products
WHERE category_id IS NOT NULL
UNION ALL
SELECT 
  'Main Categories' as info,
  COUNT(*) as count
FROM public.categories
WHERE parent_id IS NULL
UNION ALL
SELECT 
  'Sub Categories' as info,
  COUNT(*) as count
FROM public.categories
WHERE parent_id IS NOT NULL;

-- Show sample results
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  COUNT(p.id) as product_count
FROM public.categories c1
LEFT JOIN public.categories c2 ON c2.parent_id = c1.id
LEFT JOIN public.products p ON (p.category_id = c1.id OR p.category_id = c2.id OR p.subcategory_id = c2.id)
WHERE c1.parent_id IS NULL
GROUP BY c1.name, c2.name, c1.sort_order, c2.sort_order
ORDER BY c1.sort_order, c2.sort_order;

-- Show products with both main and sub categories
SELECT 
  p.name as product_name,
  c1.name as main_category,
  c2.name as subcategory
FROM public.products p
LEFT JOIN public.categories c1 ON p.category_id = c1.id
LEFT JOIN public.categories c2 ON p.subcategory_id = c2.id
WHERE p.category_id IS NOT NULL
ORDER BY c1.name, c2.name, p.name
LIMIT 20;
