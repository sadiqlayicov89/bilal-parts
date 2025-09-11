-- Check the structure of orders table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Check if company column exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'company'
    ) 
    THEN 'company column EXISTS' 
    ELSE 'company column DOES NOT EXIST' 
  END as company_column_status;
