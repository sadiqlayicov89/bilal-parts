-- Check orders table structure and data
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Check if there are any orders in the table
SELECT COUNT(*) as total_orders FROM orders;

-- Check RLS status for orders table
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'orders';

-- Check RLS policies for orders table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'orders';

-- Sample orders data (if any)
SELECT * FROM orders LIMIT 5;
