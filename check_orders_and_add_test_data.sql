-- Check orders table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Check if there are any orders in the table
SELECT COUNT(*) as total_orders FROM orders;

-- Check RLS status for orders table
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'orders';

-- Check RLS policies for orders table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'orders';

-- Check if we have any users to create orders for
SELECT id, email, first_name, last_name FROM profiles LIMIT 5;

-- Add test orders for admin testing
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
),
(
    'BP' || (EXTRACT(EPOCH FROM NOW())::bigint + 1),
    (SELECT id FROM profiles WHERE email = 'admin@bilal-parts.com' LIMIT 1),
    NOW() - INTERVAL '1 day',
    'confirmed',
    'Cash on Delivery',
    'г. Баку, ул. Тестовая, д. 456',
    275.00,
    275.00,
    5,
    13.75,
    '[
        {
            "name": "BATTERY CHARGER",
            "sku": "BC-001",
            "catalogNumber": "BC-001",
            "quantity": 1,
            "price": 180.00
        },
        {
            "name": "CLUTCH DISC",
            "sku": "CD-002",
            "catalogNumber": "CD-002",
            "quantity": 1,
            "price": 95.00
        }
    ]'::jsonb,
    'Admin User',
    'admin@bilal-parts.com',
    'Bilal Parts',
    '7707083893'
);

-- Check orders after insertion
SELECT COUNT(*) as total_orders_after FROM orders;
SELECT id, user_name, status, total, date FROM orders ORDER BY date DESC;
