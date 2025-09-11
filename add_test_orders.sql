-- Add test orders to the orders table
-- First check if we have any users
SELECT id, email, first_name, last_name FROM profiles WHERE email = 'admin@bilal-parts.com';

-- Add test orders
INSERT INTO orders (
    id,
    user_id,
    date,
    status,
    payment_method,
    shipping_address,
    subtotal,
    total,
    discount_percentage,
    discount_amount,
    items,
    user_name,
    user_email,
    company,
    inn
) VALUES 
(
    'BP' || EXTRACT(EPOCH FROM NOW())::bigint,
    (SELECT id FROM profiles WHERE email = 'admin@bilal-parts.com' LIMIT 1),
    NOW(),
    'pending',
    'Bank Transfer',
    'г. Москва, ул. Примерная, д. 123',
    330.48,
    330.48,
    0,
    0,
    '[
        {
            "name": "Forklift Alternator",
            "sku": "ALT-007",
            "catalogNumber": "ALT-007",
            "quantity": 1,
            "price": 189.99
        },
        {
            "name": "Forklift Air Filter",
            "sku": "AF-FLT-002", 
            "catalogNumber": "AF-FLT-002",
            "quantity": 1,
            "price": 32.99
        },
        {
            "name": "Forklift Air Filter",
            "sku": "AIR-FILTER-035",
            "catalogNumber": "AIR-FILTER-035", 
            "quantity": 1,
            "price": 107.50
        }
    ]'::jsonb,
    'Admin User',
    'admin@bilal-parts.com',
    'Bilal Parts',
    '7707083893'
);

-- Check if orders were added
SELECT COUNT(*) as total_orders FROM orders;
SELECT id, user_name, status, total, date FROM orders ORDER BY date DESC LIMIT 5;
