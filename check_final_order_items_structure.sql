-- Check the final structure of order_items table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;

-- Check current data in order_items
SELECT 
  'Current order_items data:' as info,
  COUNT(*) as total_items
FROM order_items;

-- Check sample data
SELECT 
  'Sample order_items:' as info,
  *
FROM order_items 
LIMIT 3;
