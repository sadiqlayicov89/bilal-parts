const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fvnelgjpptwteiesonhg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bmVsZ2pwcHR3dGVpZXNvbmg2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5ODc0OTAsImV4cCI6MjA1MDU2MzQ5MH0.8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K';

const supabase = createClient(supabaseUrl, supabaseKey);

// Product to category mapping based on product names and descriptions
const productCategoryMapping = {
  // Forklift Parts
  'forklift': ['Forklift Parts', 'Electric Forklifts', 'Diesel Forklifts', 'LPG Forklifts', 'Warehouse Forklifts'],
  'gear': ['Forklift Parts', 'Transmission', 'Gearboxes'],
  'synchro': ['Forklift Parts', 'Transmission', 'Gearboxes'],
  'shift': ['Forklift Parts', 'Transmission', 'Gearboxes'],
  'transmission': ['Forklift Parts', 'Transmission', 'Gearboxes'],
  'pilot': ['Forklift Parts', 'Transmission', 'Gearboxes'],
  'throwout': ['Forklift Parts', 'Transmission', 'Clutches'],
  'bearing': ['Forklift Parts', 'Engine Parts', 'Pistons & Rings'],
  'mount': ['Forklift Parts', 'Suspension', 'Control Arms'],
  
  // Engine Parts
  'engine': ['Engine Parts', 'Pistons & Rings'],
  'piston': ['Engine Parts', 'Pistons & Rings'],
  'ring': ['Engine Parts', 'Pistons & Rings'],
  'crankshaft': ['Engine Parts', 'Crankshafts'],
  'cylinder': ['Engine Parts', 'Cylinder Heads'],
  'valve': ['Engine Parts', 'Valves & Springs'],
  'spring': ['Engine Parts', 'Valves & Springs'],
  'camshaft': ['Engine Parts', 'Cylinder Heads'],
  'timing': ['Engine Parts', 'Cylinder Heads'],
  
  // Transmission
  'clutch': ['Transmission', 'Clutches'],
  'differential': ['Transmission', 'Differentials'],
  'driveshaft': ['Transmission', 'Drive Shafts'],
  'gearbox': ['Transmission', 'Gearboxes'],
  
  // Brake System
  'brake': ['Brake System', 'Brake Pads'],
  'pad': ['Brake System', 'Brake Pads'],
  'disc': ['Brake System', 'Brake Discs'],
  'rotor': ['Brake System', 'Brake Discs'],
  'caliper': ['Brake System', 'Brake Calipers'],
  'line': ['Brake System', 'Brake Lines'],
  'hose': ['Brake System', 'Brake Lines'],
  
  // Electrical
  'battery': ['Electrical', 'Batteries'],
  'alternator': ['Electrical', 'Alternators'],
  'starter': ['Electrical', 'Starters'],
  'wire': ['Electrical', 'Wiring'],
  'harness': ['Electrical', 'Wiring'],
  'sensor': ['Electrical', 'Wiring'],
  'switch': ['Electrical', 'Wiring'],
  
  // Filters
  'filter': ['Filters', 'Air Filters'],
  'air': ['Filters', 'Air Filters'],
  'oil': ['Filters', 'Oil Filters'],
  'fuel': ['Filters', 'Fuel Filters'],
  'hydraulic': ['Filters', 'Hydraulic Filters'],
  
  // Hydraulic Parts
  'pump': ['Hydraulic Parts', 'Hydraulic Pumps'],
  'cylinder': ['Hydraulic Parts', 'Hydraulic Cylinders'],
  'valve': ['Hydraulic Parts', 'Control Valves'],
  'hose': ['Hydraulic Parts', 'Hydraulic Hoses'],
  
  // Cooling System
  'radiator': ['Cooling System', 'Radiators'],
  'water': ['Cooling System', 'Water Pumps'],
  'thermostat': ['Cooling System', 'Thermostats'],
  'fan': ['Cooling System', 'Cooling Fans'],
  'cooling': ['Cooling System', 'Radiators'],
  
  // Suspension
  'shock': ['Suspension', 'Shock Absorbers'],
  'absorber': ['Suspension', 'Shock Absorbers'],
  'spring': ['Suspension', 'Springs'],
  'arm': ['Suspension', 'Control Arms'],
  'bushing': ['Suspension', 'Bushings'],
  
  // Accessories
  'tool': ['Accessories', 'Tools'],
  'lubricant': ['Accessories', 'Lubricants'],
  'oil': ['Accessories', 'Lubricants'],
  'safety': ['Accessories', 'Safety Equipment'],
  'cleaning': ['Accessories', 'Cleaning Supplies']
};

async function assignProductsToCategories() {
  try {
    console.log('Starting product category assignment...');
    
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) {
      console.error('Error fetching products:', productsError);
      return;
    }
    
    console.log(`Found ${products.length} products to categorize`);
    
    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return;
    }
    
    console.log(`Found ${categories.length} categories`);
    
    // Create category lookup map
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    
    let assignedCount = 0;
    let unassignedCount = 0;
    
    // Assign categories to products
    for (const product of products) {
      let assignedCategory = null;
      
      // Try to find matching category based on product name and description
      const productText = `${product.name} ${product.description || ''}`.toLowerCase();
      
      for (const [keyword, categoryNames] of Object.entries(productCategoryMapping)) {
        if (productText.includes(keyword)) {
          // Find the first available category
          for (const categoryName of categoryNames) {
            if (categoryMap[categoryName]) {
              assignedCategory = categoryMap[categoryName];
              break;
            }
          }
          if (assignedCategory) break;
        }
      }
      
      // If no specific category found, assign to a default category
      if (!assignedCategory) {
        // Default categories based on product type
        if (productText.includes('forklift')) {
          assignedCategory = categoryMap['Forklift Parts'];
        } else if (productText.includes('engine') || productText.includes('piston')) {
          assignedCategory = categoryMap['Engine Parts'];
        } else if (productText.includes('transmission') || productText.includes('gear')) {
          assignedCategory = categoryMap['Transmission'];
        } else if (productText.includes('brake')) {
          assignedCategory = categoryMap['Brake System'];
        } else if (productText.includes('electrical') || productText.includes('battery')) {
          assignedCategory = categoryMap['Electrical'];
        } else if (productText.includes('filter')) {
          assignedCategory = categoryMap['Filters'];
        } else if (productText.includes('hydraulic')) {
          assignedCategory = categoryMap['Hydraulic Parts'];
        } else if (productText.includes('cooling') || productText.includes('radiator')) {
          assignedCategory = categoryMap['Cooling System'];
        } else if (productText.includes('suspension') || productText.includes('shock')) {
          assignedCategory = categoryMap['Suspension'];
        } else {
          // Default to Forklift Parts
          assignedCategory = categoryMap['Forklift Parts'];
        }
      }
      
      // Update product with category
      if (assignedCategory) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ category_id: assignedCategory })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`Error updating product ${product.name}:`, updateError);
          unassignedCount++;
        } else {
          console.log(`Assigned ${product.name} to category ID: ${assignedCategory}`);
          assignedCount++;
        }
      } else {
        console.log(`Could not assign category to product: ${product.name}`);
        unassignedCount++;
      }
    }
    
    console.log(`\nCategory assignment completed!`);
    console.log(`Assigned: ${assignedCount} products`);
    console.log(`Unassigned: ${unassignedCount} products`);
    
    // Verify assignments
    const { data: updatedProducts, error: verifyError } = await supabase
      .from('products')
      .select(`
        id, name, category_id,
        categories!products_category_id_fkey(name)
      `)
      .limit(10);
    
    if (verifyError) {
      console.error('Error verifying assignments:', verifyError);
    } else {
      console.log('\nSample product assignments:');
      updatedProducts.forEach(product => {
        console.log(`${product.name} -> ${product.categories?.name || 'No category'}`);
      });
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the script
assignProductsToCategories();
