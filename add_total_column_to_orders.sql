-- Add 'total' column to orders table
-- This column should store the total order amount

ALTER TABLE orders
ADD COLUMN total DECIMAL(10,2) DEFAULT 0.00;

-- Update existing rows to set total from total_amount if it exists
UPDATE orders 
SET total = total_amount 
WHERE total_amount IS NOT NULL;

-- Verify the column was added
SELECT 
  'orders table structure after adding total column:' as info,
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name = 'total';

-- Show sample data with new total column
SELECT 
  'Sample orders with total column:' as info,
  id, 
  order_number, 
  total_amount, 
  total,
  status
FROM orders 
LIMIT 3;
