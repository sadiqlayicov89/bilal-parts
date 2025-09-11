-- Add test orders to the orders table with correct column names
-- First check if we have any users
SELECT id, email, first_name, last_name FROM profiles WHERE email = 'admin@bilal-parts.com';

-- Add test orders (using created_at instead of date)
INSERT INTO orders (
    id,
    user_id,
    status,
    payment_method,
    shipping_address,
    subtotal,
    total,
    discount_percentage,
    discount_amount,
    user_name,
    user_email,
    company,
    inn,
    created_at,
    updated_at
) VALUES 
(
    'BP' || EXTRACT(EPOCH FROM NOW())::bigint,
    (SELECT id FROM profiles WHERE email = 'admin@bilal-parts.com' LIMIT 1),
    'pending',
    'Bank Transfer',
    'г. Москва, ул. Примерная, д. 123',
    330.48,
    330.48,
    0,
    0,
    'Admin User',
    'admin@bilal-parts.com',
    'Bilal Parts',
    '7707083893',
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
    name,
    sku,
    catalog_number
)
SELECT 
    no.id,
    p.id,
    1,
    p.price,
    p.name,
    p.sku,
    p.catalog_number
FROM new_order no
CROSS JOIN products p
WHERE p.name IN ('Forklift Alternator', 'Forklift Air Filter')
LIMIT 3;

-- Add another test order
INSERT INTO orders (
    id,
    user_id,
    status,
    payment_method,
    shipping_address,
    subtotal,
    total,
    discount_percentage,
    discount_amount,
    user_name,
    user_email,
    company,
    inn,
    created_at,
    updated_at
) VALUES 
(
    'BP' || (EXTRACT(EPOCH FROM NOW())::bigint + 1),
    (SELECT id FROM profiles WHERE email = 'admin@bilal-parts.com' LIMIT 1),
    'completed',
    'Credit Card',
    'г. Баку, ул. Тестовая, д. 456',
    275.00,
    275.00,
    10,
    27.50,
    'Admin User',
    'admin@bilal-parts.com',
    'Bilal Parts',
    '7707083893',
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
    name,
    sku,
    catalog_number
)
SELECT 
    no.id,
    p.id,
    2,
    p.price,
    p.name,
    p.sku,
    p.catalog_number
FROM new_order no
CROSS JOIN products p
WHERE p.name = 'Forklift Ignition Switch'
LIMIT 1;

-- Check if orders were added
SELECT COUNT(*) as total_orders FROM orders;
SELECT id, user_name, status, total, created_at FROM orders ORDER BY created_at DESC LIMIT 5;

-- Check order items
SELECT oi.*, o.user_name, o.status 
FROM order_items oi 
JOIN orders o ON oi.order_id = o.id 
ORDER BY o.created_at DESC;
