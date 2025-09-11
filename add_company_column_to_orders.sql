-- Add company column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS company VARCHAR(255);

-- Update existing orders to have a default company value
UPDATE orders 
SET company = 'N/A' 
WHERE company IS NULL;

-- Verify the column was added
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'company';

-- Check sample data
SELECT 
  'Sample orders with company:' as info,
  id,
  order_number,
  company,
  status
FROM orders 
LIMIT 3;
