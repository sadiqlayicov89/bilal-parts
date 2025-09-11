-- Add test order items with only existing columns
-- Based on the actual table structure (without updated_at)

-- First, let's check what orders we have
SELECT 'Existing orders:' as info, id, order_number, status FROM orders ORDER BY created_at DESC;

-- Add order items for the first order (7255530d-fb47-4aad-a6ca-8790985a9c9d)
INSERT INTO order_items (
  order_id,
  product_id,
  quantity,
  price,
  total,
  created_at
) VALUES 
(
  '7255530d-fb47-4aad-a6ca-8790985a9c9d',
  (SELECT id FROM products LIMIT 1), -- Get first product
  2,
  50.00,
  100.00,
  NOW()
),
(
  '7255530d-fb47-4aad-a6ca-8790985a9c9d',
  (SELECT id FROM products OFFSET 1 LIMIT 1), -- Get second product
  1,
  75.00,
  75.00,
  NOW()
);

-- Add order items for the second order (f57ddee4-5bef-4449-a960-9b7d35444107)
INSERT INTO order_items (
  order_id,
  product_id,
  quantity,
  price,
  total,
  created_at
) VALUES 
(
  'f57ddee4-5bef-4449-a960-9b7d35444107',
  (SELECT id FROM products OFFSET 2 LIMIT 1), -- Get third product
  3,
  25.00,
  75.00,
  NOW()
),
(
  'f57ddee4-5bef-4449-a960-9b7d35444107',
  (SELECT id FROM products OFFSET 3 LIMIT 1), -- Get fourth product
  1,
  100.00,
  100.00,
  NOW()
);

-- Verify the order items were added
SELECT 
  'Order items added:' as info,
  oi.id,
  oi.order_id,
  oi.quantity,
  oi.price,
  oi.total,
  p.name as product_name
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.id
ORDER BY oi.created_at DESC;
