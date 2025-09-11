-- Check orders table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders'
ORDER BY ordinal_position;

-- Check if orders table has any data
SELECT COUNT(*) as total_orders FROM orders;

-- Check order_items table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'order_items'
ORDER BY ordinal_position;

-- Check if order_items table has any data
SELECT COUNT(*) as total_order_items FROM order_items;
