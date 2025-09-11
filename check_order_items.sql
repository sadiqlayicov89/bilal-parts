-- Check order_items table structure and data
SELECT 
  'order_items table structure:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;

-- Check if there are any order_items
SELECT 
  'order_items count:' as info,
  COUNT(*) as count
FROM order_items;

-- Check sample order_items data
SELECT 
  'sample order_items:' as info,
  *
FROM order_items 
LIMIT 5;

-- Check if orders have corresponding order_items
SELECT 
  'orders with order_items:' as info,
  o.id as order_id,
  o.order_number,
  COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number
ORDER BY o.created_at DESC;
