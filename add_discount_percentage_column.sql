-- Add discount_percentage column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT 0.00;

-- Update existing orders to have a default discount_percentage value
UPDATE orders 
SET discount_percentage = 0.00 
WHERE discount_percentage IS NULL;

-- Verify the column was added
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'discount_percentage';

-- Check sample data
SELECT 
  'Sample orders with discount_percentage:' as info,
  id,
  order_number,
  discount_percentage,
  status
FROM orders 
LIMIT 3;
