-- Add inn column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS inn VARCHAR(50);

-- Update existing orders to have a default inn value
UPDATE orders 
SET inn = 'N/A' 
WHERE inn IS NULL;

-- Verify the column was added
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'inn';

-- Check sample data
SELECT 
  'Sample orders with inn:' as info,
  id,
  order_number,
  inn,
  status
FROM orders 
LIMIT 3;
