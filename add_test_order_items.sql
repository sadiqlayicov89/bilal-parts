-- Add test order items to existing orders
-- First, let's check what orders we have
SELECT 'Existing orders:' as info, id, order_number, status FROM orders ORDER BY created_at DESC;

-- Add order items for the first order (7255530d-fb47-4aad-a6ca-8790985a9c9d)
INSERT INTO order_items (
  order_id,
  product_id,
  product_name,
  product_sku,
  product_article,
  quantity,
  unit_price,
  total_price,
  created_at,
  updated_at
) VALUES 
(
  '7255530d-fb47-4aad-a6ca-8790985a9c9d',
  (SELECT id FROM products LIMIT 1), -- Get first product
  'Test Product 1',
  'SKU001',
  'ART001',
  2,
  50.00,
  100.00,
  NOW(),
  NOW()
),
(
  '7255530d-fb47-4aad-a6ca-8790985a9c9d',
  (SELECT id FROM products OFFSET 1 LIMIT 1), -- Get second product
  'Test Product 2',
  'SKU002',
  'ART002',
  1,
  75.00,
  75.00,
  NOW(),
  NOW()
);

-- Add order items for the second order (f57ddee4-5bef-4449-a960-9b7d35444107)
INSERT INTO order_items (
  order_id,
  product_id,
  product_name,
  product_sku,
  product_article,
  quantity,
  unit_price,
  total_price,
  created_at,
  updated_at
) VALUES 
(
  'f57ddee4-5bef-4449-a960-9b7d35444107',
  (SELECT id FROM products OFFSET 2 LIMIT 1), -- Get third product
  'Test Product 3',
  'SKU003',
  'ART003',
  3,
  25.00,
  75.00,
  NOW(),
  NOW()
),
(
  'f57ddee4-5bef-4449-a960-9b7d35444107',
  (SELECT id FROM products OFFSET 3 LIMIT 1), -- Get fourth product
  'Test Product 4',
  'SKU004',
  'ART004',
  1,
  100.00,
  100.00,
  NOW(),
  NOW()
);

-- Verify the order items were added
SELECT 
  'Order items added:' as info,
  oi.id,
  oi.order_id,
  oi.product_name,
  oi.quantity,
  oi.unit_price,
  oi.total_price
FROM order_items oi
ORDER BY oi.created_at DESC;
