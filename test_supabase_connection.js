// Test Supabase connection with the current API key
const { createClient } = require('@supabase/supabase-js');

// Use the same values from Vercel
const supabaseUrl = 'https://fvnelqjpptwteiesonhq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bmVscWpwcHR3dGVpZXNvbmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMjAxMDMsImV4cCI6MjA3Mjg5NjEwM30.kwt5L91-VM7IWZddHCo0uuXHdfpoknyajcQBDM3h7-g';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseAnonKey.length);
console.log('Key starts with:', supabaseAnonKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n1. Testing basic connection...');
    
    // Test 1: Simple query without filters
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('Products query error:', productsError);
    } else {
      console.log('✅ Products query successful:', products?.length || 0, 'products found');
    }
    
    // Test 2: Categories query
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);
    
    if (categoriesError) {
      console.error('Categories query error:', categoriesError);
    } else {
      console.log('✅ Categories query successful:', categories?.length || 0, 'categories found');
    }
    
    // Test 3: Check RLS status
    console.log('\n2. Testing RLS status...');
    const { data: rlsTest, error: rlsError } = await supabase
      .from('products')
      .select('id, name, is_active')
      .eq('is_active', true)
      .limit(1);
    
    if (rlsError) {
      console.error('RLS test error:', rlsError);
    } else {
      console.log('✅ RLS test successful:', rlsTest?.length || 0, 'active products found');
    }
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();
