-- Create real categories with subcategories
-- Run this in Supabase SQL Editor

-- Clear existing categories first
DELETE FROM public.categories;

-- Insert main categories
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

-- Get the IDs of main categories for subcategories
-- Forklift Parts subcategories
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

-- Engine Parts subcategories
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

-- Transmission subcategories
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

-- Brake System subcategories
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

-- Electrical subcategories
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

-- Filters subcategories
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

-- Hydraulic Parts subcategories
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

-- Cooling System subcategories
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

-- Suspension subcategories
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

-- Accessories subcategories
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

-- Verify categories were created
SELECT 
  c1.name as main_category,
  c2.name as subcategory,
  c2.id as subcategory_id
FROM public.categories c1
LEFT JOIN public.categories c2 ON c2.parent_id = c1.id
WHERE c1.parent_id IS NULL
ORDER BY c1.sort_order, c2.sort_order;
