// Add images to all products that don't have images
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fvnelqjpptwteiesonhq.supabase.co';
const supabaseServiceKey = 'sb_secret_NQS2WABTdgttYapNQpnhvQ_PgYQtl11';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Product-specific images from Unsplash
const productImages = {
  // Electrical Parts
  'Forklift Ignition Switch': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Headlight Assembly': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Horn': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Turn Signal Switch': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Battery Charger': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Starter Motor': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Alternator': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Voltage Regulator': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Fuse Box': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Wiring Harness': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Relay': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Solenoid': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Connector': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Terminal': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Cable': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Switch': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Sensor': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Controller': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',

  // Hydraulic Parts
  'Forklift Hydraulic Pump': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Hydraulic Cylinder': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Hydraulic Hose': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Hydraulic Filter': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Hydraulic Valve': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Hydraulic Reservoir': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Hydraulic Manifold': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Hydraulic Accumulator': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Hydraulic Pressure Gauge': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Hydraulic Relief Valve': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Seal Kit': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift O-Ring': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Gasket': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Bearing': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Bushing': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Cylinder Rod': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Piston Seal': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Forklift Valve Body': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',

  // Engine Parts
  'Forklift Engine Oil Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Air Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Spark Plug': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Fuel Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Engine Belt': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Piston': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Cylinder Head': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Camshaft': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Crankshaft': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Timing Belt': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Oil Pump': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Water Pump': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Thermostat': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',

  // Brake Parts
  'Forklift Brake Pad Set': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Brake Disc': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Brake Fluid': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Brake Master Cylinder': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Brake Caliper': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Brake Line': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Brake Booster': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Brake Shoe': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Brake Spring': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Brake Cable': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Brake Lever': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Brake Drum': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Brake Rotor': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',

  // Filters
  'Forklift Cabin Air Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Hydraulic Oil Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Fuel Water Separator': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Transmission Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Coolant Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Fuel Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Oil Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Air Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Hydraulic Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Transmission Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Coolant Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Cabin Filter': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Water Separator': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',

  // Cooling Parts
  'Forklift Radiator': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Water Pump': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Thermostat': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Cooling Fan': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Coolant Hose': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Radiator Cap': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Cooling Fan': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Thermostat Housing': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Water Outlet': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Cooling Hose': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Expansion Tank': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Fan Clutch': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Radiator Support': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',

  // Transmission Parts
  'Forklift Clutch Kit': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Gear Oil': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Transmission Mount': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Shift Lever': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Differential Oil': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Clutch Disc': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Pressure Plate': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Throwout Bearing': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Pilot Bearing': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Transmission Mount': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Shift Fork': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Synchro Ring': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Forklift Gear Set': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
};

// Fallback images for categories
const categoryImages = {
  'Electrical Parts': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Hydraulic Parts': 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop',
  'Engine Parts': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Brake Parts': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Filters': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Cooling Parts': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  'Transmission Parts': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
};

async function addImagesToProducts() {
  try {
    console.log('Starting to add images to products...');
    
    // Get all products with their categories
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id, name, sku, category_id,
        categories!products_category_id_fkey(name)
      `)
      .eq('is_active', true);
    
    if (productsError) throw productsError;
    
    console.log(`Found ${products.length} products`);
    
    // Get products that don't have images
    const { data: productsWithoutImages, error: imagesError } = await supabase
      .from('products')
      .select(`
        id, name, sku, category_id,
        categories!products_category_id_fkey(name),
        product_images(id)
      `)
      .eq('is_active', true)
      .is('product_images.id', null);
    
    if (imagesError) throw imagesError;
    
    console.log(`Found ${productsWithoutImages.length} products without images`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of productsWithoutImages) {
      try {
        // Get image URL for this product
        let imageUrl = productImages[product.name];
        
        // If no specific image, use category image
        if (!imageUrl) {
          imageUrl = categoryImages[product.categories?.name] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop';
        }
        
        // Insert image
        const { error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: product.id,
            image_url: imageUrl,
            alt_text: `${product.name} - Product Image`,
            is_primary: true,
            sort_order: 1
          });
        
        if (insertError) {
          console.log(`Error adding image to ${product.name}:`, insertError.message);
          errorCount++;
          continue;
        }
        
        console.log(`✅ Added image to: ${product.name}`);
        successCount++;
        
      } catch (error) {
        console.log(`Error processing product ${product.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n✅ Successfully added images to ${successCount} products`);
    console.log(`❌ Failed to add images to ${errorCount} products`);
    
    // Check final count
    const { data: finalProducts, error: finalError } = await supabase
      .from('products')
      .select(`
        id, name,
        product_images(id)
      `)
      .eq('is_active', true);
    
    if (!finalError) {
      const productsWithImages = finalProducts.filter(p => p.product_images && p.product_images.length > 0);
      console.log(`\n📊 Products with images: ${productsWithImages.length}/${finalProducts.length}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

addImagesToProducts();
