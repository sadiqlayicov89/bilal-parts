-- Update order totals based on order items
UPDATE orders 
SET 
  total_amount = (
    SELECT COALESCE(SUM(total_price), 0) 
    FROM order_items 
    WHERE order_id = orders.id
  ),
  updated_at = NOW()
WHERE id IN (
  '7255530d-fb47-4aad-a6ca-8790985a9c9d',
  'f57ddee4-5bef-4449-a960-9b7d35444107'
);

-- Verify the updates
SELECT 
  'Updated orders:' as info,
  id,
  order_number,
  total_amount,
  status
FROM orders 
WHERE id IN (
  '7255530d-fb47-4aad-a6ca-8790985a9c9d',
  'f57ddee4-5bef-4449-a960-9b7d35444107'
);
