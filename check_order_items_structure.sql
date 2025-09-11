-- Check the actual structure of order_items table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY ordinal_position;

-- Check if table exists and show all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%order%';

-- Check if there are any order_items at all
SELECT COUNT(*) as total_order_items FROM order_items;
