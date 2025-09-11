-- Add shipping_address column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_address TEXT;

-- Update existing orders to have a default shipping_address value
UPDATE orders 
SET shipping_address = 'N/A' 
WHERE shipping_address IS NULL;

-- Verify the column was added
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'shipping_address';

-- Check sample data
SELECT 
  'Sample orders with shipping_address:' as info,
  id,
  order_number,
  shipping_address,
  status
FROM orders 
LIMIT 3;
