// Add remaining products to reach 100 total
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fvnelqjpptwteiesonhq.supabase.co';
const supabaseServiceKey = 'sb_secret_NQS2WABTdgttYapNQpnhvQ_PgYQtl11';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Generate 55 more products to reach 100 total
const generateProducts = () => {
  const products = [];
  const categories = [
    'Engine Parts', 'Hydraulic Parts', 'Electrical Parts', 'Brake Parts', 
    'Filters', 'Cooling Parts', 'Transmission Parts'
  ];
  
  const productTypes = {
    'Engine Parts': ['Piston', 'Cylinder Head', 'Camshaft', 'Crankshaft', 'Timing Belt', 'Oil Pump', 'Water Pump', 'Thermostat'],
    'Hydraulic Parts': ['Seal Kit', 'O-Ring', 'Gasket', 'Bearing', 'Bushing', 'Cylinder Rod', 'Piston Seal', 'Valve Body'],
    'Electrical Parts': ['Relay', 'Solenoid', 'Connector', 'Terminal', 'Cable', 'Switch', 'Sensor', 'Controller'],
    'Brake Parts': ['Brake Line', 'Brake Booster', 'Brake Shoe', 'Brake Spring', 'Brake Cable', 'Brake Lever', 'Brake Drum', 'Brake Rotor'],
    'Filters': ['Fuel Filter', 'Oil Filter', 'Air Filter', 'Hydraulic Filter', 'Transmission Filter', 'Coolant Filter', 'Cabin Filter', 'Water Separator'],
    'Cooling Parts': ['Radiator Cap', 'Cooling Fan', 'Thermostat Housing', 'Water Outlet', 'Cooling Hose', 'Expansion Tank', 'Fan Clutch', 'Radiator Support'],
    'Transmission Parts': ['Clutch Disc', 'Pressure Plate', 'Throwout Bearing', 'Pilot Bearing', 'Transmission Mount', 'Shift Fork', 'Synchro Ring', 'Gear Set']
  };
  
  let skuCounter = 1;
  
  categories.forEach(category => {
    const types = productTypes[category];
    const categoryPrefix = category.substring(0, 2).toUpperCase();
    
    types.forEach((type, index) => {
      const sku = `${categoryPrefix}-${String(skuCounter).padStart(3, '0')}`;
      const catalogNumber = `${type.toUpperCase().replace(/\s+/g, '-')}-${String(skuCounter).padStart(3, '0')}`;
      
      products.push({
        name: `Forklift ${type}`,
        sku: sku,
        catalog_number: catalogNumber,
        description: `High-quality ${type.toLowerCase()} for forklift trucks. Durable construction with excellent performance.`,
        short_description: `Forklift ${type.toLowerCase()}`,
        price: Math.round((Math.random() * 200 + 20) * 100) / 100, // 20-220 range
        original_price: Math.round((Math.random() * 250 + 30) * 100) / 100, // 30-280 range
        cost_price: Math.round((Math.random() * 100 + 10) * 100) / 100, // 10-110 range
        stock_quantity: Math.floor(Math.random() * 50) + 5, // 5-55 range
        category: category,
        brand: 'Bilal Parts',
        model: `BP-${type.toUpperCase().replace(/\s+/g, '-')}-${String(skuCounter).padStart(3, '0')}`,
        year: 2024,
        weight: Math.round((Math.random() * 10 + 0.5) * 100) / 100, // 0.5-10.5 range
        dimensions: `${Math.floor(Math.random() * 20 + 5)}x${Math.floor(Math.random() * 15 + 3)}x${Math.floor(Math.random() * 10 + 2)} cm`,
        images: [`https://images.unsplash.com/photo-${1581093458791 + Math.floor(Math.random() * 1000000)}?w=500&h=500&fit=crop`],
        specifications: [
          { name: 'Material', value: ['Steel', 'Aluminum', 'Plastic', 'Rubber'][Math.floor(Math.random() * 4)], unit: '' },
          { name: 'Weight', value: Math.round((Math.random() * 10 + 0.5) * 100) / 100, unit: 'kg' },
          { name: 'Color', value: ['Black', 'Silver', 'Blue', 'Red'][Math.floor(Math.random() * 4)], unit: '' }
        ]
      });
      
      skuCounter++;
    });
  });
  
  return products;
};

async function addProducts() {
  try {
    console.log('Starting to add remaining products...');
    
    // Get categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name');
    
    if (catError) throw catError;
    
    console.log('Categories loaded:', categories.length);
    
    // Generate products
    const products = generateProducts();
    console.log(`Generated ${products.length} products`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        // Find category ID
        const category = categories.find(cat => cat.name === product.category);
        if (!category) {
          console.log(`Category not found: ${product.category}`);
          continue;
        }
        
        // Insert product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .insert({
            name: product.name,
            sku: product.sku,
            catalog_number: product.catalog_number,
            description: product.description,
            short_description: product.short_description,
            price: product.price,
            original_price: product.original_price,
            cost_price: product.cost_price,
            stock_quantity: product.stock_quantity,
            category_id: category.id,
            brand: product.brand,
            model: product.model,
            year: product.year,
            weight: product.weight,
            dimensions: product.dimensions,
            is_active: true,
            is_featured: Math.random() > 0.8, // 20% chance of being featured
            in_stock: product.stock_quantity > 0
          })
          .select()
          .single();
        
        if (productError) {
          console.log(`Error inserting product ${product.name}:`, productError.message);
          errorCount++;
          continue;
        }
        
        // Insert images
        if (product.images && product.images.length > 0) {
          for (let i = 0; i < product.images.length; i++) {
            await supabase
              .from('product_images')
              .insert({
                product_id: productData.id,
                image_url: product.images[i],
                alt_text: `${product.name} - Image ${i + 1}`,
                is_primary: i === 0,
                sort_order: i + 1
              });
          }
        }
        
        // Insert specifications
        if (product.specifications && product.specifications.length > 0) {
          for (let i = 0; i < product.specifications.length; i++) {
            await supabase
              .from('product_specifications')
              .insert({
                product_id: productData.id,
                name: product.specifications[i].name,
                value: product.specifications[i].value,
                unit: product.specifications[i].unit || '',
                sort_order: i + 1
              });
          }
        }
        
        console.log(`✅ Added: ${product.name} (${product.sku})`);
        successCount++;
        
      } catch (error) {
        console.log(`Error processing product ${product.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n✅ Successfully added ${successCount} products`);
    console.log(`❌ Failed to add ${errorCount} products`);
    
    // Check final count
    const { data: finalProducts, error: finalError } = await supabase
      .from('products')
      .select('id')
      .eq('is_active', true);
    
    if (!finalError) {
      console.log(`\n📊 Total active products in database: ${finalProducts.length}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

addProducts();
