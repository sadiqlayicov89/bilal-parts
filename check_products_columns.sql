-- Check what image-related columns exist in products table
SELECT 
  'Image-related columns in products table:' as info,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND (column_name LIKE '%image%' OR column_name LIKE '%photo%' OR column_name LIKE '%picture%' OR column_name LIKE '%img%')
ORDER BY column_name;

-- Check all columns in products table to see the exact structure
SELECT 
  'All products table columns:' as info,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;