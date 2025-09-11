-- Check products table structure to see what image column exists
SELECT 
  'products table structure:' as info,
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND (column_name LIKE '%image%' OR column_name LIKE '%photo%' OR column_name LIKE '%picture%')
ORDER BY column_name;

-- Check all columns in products table
SELECT 
  'All products table columns:' as info,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;
