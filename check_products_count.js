// Check current products count in Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fvnelqjpptwteiesonhq.supabase.co';
const supabaseServiceKey = 'sb_secret_NQS2WABTdgttYapNQpnhvQ_PgYQtl11';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProducts() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, sku, category_id, is_active')
      .eq('is_active', true);
    
    if (error) throw error;
    
    console.log(`Total active products: ${products.length}`);
    console.log('Categories distribution:');
    
    const categoryCount = {};
    products.forEach(product => {
      categoryCount[product.category_id] = (categoryCount[product.category_id] || 0) + 1;
    });
    
    console.log(categoryCount);
    
    // Get categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name');
    
    if (catError) throw catError;
    
    console.log('\nCategories:');
    categories.forEach(cat => {
      console.log(`${cat.id}: ${cat.name} (${categoryCount[cat.id] || 0} products)`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProducts();
