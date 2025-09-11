-- Add test orders to the orders table with correct column names
-- First check if we have any users
SELECT id, email, first_name, last_name FROM profiles WHERE email = 'admin@bilal-parts.com';

-- Add test orders (using correct column names from schema)
INSERT INTO orders (
    order_number,
    user_id,
    status,
    payment_method,
    subtotal,
    total_amount,
    discount_amount,
    currency,
    notes,
    created_at,
    updated_at
) VALUES 
(
    'BP' || EXTRACT(EPOCH FROM NOW())::bigint,
    (SELECT id FROM profiles WHERE email = 'admin@bilal-parts.com' LIMIT 1),
    'pending',
    'Bank Transfer',
    330.48,
    330.48,
    0,
    'USD',
    'Test order 1',
    NOW(),
    NOW()
);

-- Get the order ID we just created
WITH new_order AS (
    SELECT id FROM orders ORDER BY created_at DESC LIMIT 1
)
-- Add order items for the new order
INSERT INTO order_items (
    order_id,
    product_id,
    quantity,
    price,
    total
)
SELECT 
    no.id,
    p.id,
    1,
    p.price,
    p.price * 1
FROM new_order no
CROSS JOIN products p
WHERE p.name IN ('Forklift Alternator', 'Forklift Air Filter')
LIMIT 3;

-- Add another test order
INSERT INTO orders (
    order_number,
    user_id,
    status,
    payment_method,
    subtotal,
    total_amount,
    discount_amount,
    currency,
    notes,
    created_at,
    updated_at
) VALUES 
(
    'BP' || (EXTRACT(EPOCH FROM NOW())::bigint + 1),
    (SELECT id FROM profiles WHERE email = 'admin@bilal-parts.com' LIMIT 1),
    'delivered',
    'Credit Card',
    275.00,
    275.00,
    27.50,
    'USD',
    'Test order 2',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
);

-- Add order items for the second order
WITH new_order AS (
    SELECT id FROM orders ORDER BY created_at DESC LIMIT 1
)
INSERT INTO order_items (
    order_id,
    product_id,
    quantity,
    price,
    total
)
SELECT 
    no.id,
    p.id,
    2,
    p.price,
    p.price * 2
FROM new_order no
CROSS JOIN products p
WHERE p.name = 'Forklift Ignition Switch'
LIMIT 1;

-- Check if orders were added
SELECT COUNT(*) as total_orders FROM orders;
SELECT id, order_number, status, total_amount, created_at FROM orders ORDER BY created_at DESC LIMIT 5;

-- Check order items
SELECT oi.*, o.order_number, o.status 
FROM order_items oi 
JOIN orders o ON oi.order_id = o.id 
ORDER BY o.created_at DESC;
