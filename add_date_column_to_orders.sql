-- Add date column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS date DATE;

-- Update existing orders to have a default date value
UPDATE orders 
SET date = created_at::date 
WHERE date IS NULL;

-- Verify the column was added
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'date';

-- Check sample data
SELECT 
  'Sample orders with date:' as info,
  id,
  order_number,
  date,
  created_at,
  status
FROM orders 
LIMIT 3;
