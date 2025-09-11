-- Check if 'total' column exists in orders table
SELECT 
  'orders table columns:' as info,
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Check if 'total_amount' column exists (which might be the correct column name)
SELECT 
  'Looking for total-related columns:' as info,
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND (column_name LIKE '%total%' OR column_name LIKE '%amount%')
ORDER BY column_name;
