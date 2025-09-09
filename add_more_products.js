// Add more products to reach 100 total
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fvnelqjpptwteiesonhq.supabase.co';
const supabaseServiceKey = 'sb_secret_NQS2WABTdgttYapNQpnhvQ_PgYQtl11';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Additional products to reach 100 total
const additionalProducts = [
  // More Electrical Parts
  {
    name: "Forklift Starter Motor",
    sku: "EL-006",
    catalog_number: "ST-MOT-006",
    description: "High-torque starter motor for forklift engines. Reliable starting in all weather conditions.",
    short_description: "Forklift starter motor",
    price: 299.99,
    original_price: 349.99,
    cost_price: 180.00,
    stock_quantity: 25,
    category: "Electrical Parts",
    brand: "Bilal Parts",
    model: "BP-ST-006",
    year: 2024,
    weight: 8.5,
    dimensions: "15x12x10 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Voltage", value: "12V", unit: "DC" },
      { name: "Power", value: "2.5kW", unit: "" },
      { name: "Material", value: "Steel", unit: "" }
    ]
  },
  {
    name: "Forklift Alternator",
    sku: "EL-007",
    catalog_number: "ALT-007",
    description: "High-output alternator for forklift charging systems. Maintains battery charge during operation.",
    short_description: "Forklift alternator",
    price: 189.99,
    original_price: 229.99,
    cost_price: 120.00,
    stock_quantity: 30,
    category: "Electrical Parts",
    brand: "Bilal Parts",
    model: "BP-ALT-007",
    year: 2024,
    weight: 4.2,
    dimensions: "12x10x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Voltage", value: "12V", unit: "DC" },
      { name: "Current", value: "80A", unit: "Amps" },
      { name: "Material", value: "Aluminum", unit: "" }
    ]
  },
  {
    name: "Forklift Voltage Regulator",
    sku: "EL-008",
    catalog_number: "VR-008",
    description: "Electronic voltage regulator for stable electrical system operation.",
    short_description: "Forklift voltage regulator",
    price: 45.99,
    original_price: 55.99,
    cost_price: 25.00,
    stock_quantity: 40,
    category: "Electrical Parts",
    brand: "Bilal Parts",
    model: "BP-VR-008",
    year: 2024,
    weight: 0.3,
    dimensions: "8x6x4 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Voltage", value: "12V", unit: "DC" },
      { name: "Current", value: "5A", unit: "Amps" },
      { name: "Material", value: "Plastic", unit: "" }
    ]
  },
  {
    name: "Forklift Fuse Box",
    sku: "EL-009",
    catalog_number: "FB-009",
    description: "Complete fuse box assembly with all necessary fuses and relays.",
    short_description: "Forklift fuse box",
    price: 35.99,
    original_price: 42.99,
    cost_price: 20.00,
    stock_quantity: 50,
    category: "Electrical Parts",
    brand: "Bilal Parts",
    model: "BP-FB-009",
    year: 2024,
    weight: 0.8,
    dimensions: "20x15x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Voltage", value: "12V", unit: "DC" },
      { name: "Fuses", value: "12", unit: "pieces" },
      { name: "Material", value: "Plastic", unit: "" }
    ]
  },
  {
    name: "Forklift Wiring Harness",
    sku: "EL-010",
    catalog_number: "WH-010",
    description: "Complete wiring harness for forklift electrical system. Color-coded wires for easy installation.",
    short_description: "Forklift wiring harness",
    price: 89.99,
    original_price: 109.99,
    cost_price: 50.00,
    stock_quantity: 20,
    category: "Electrical Parts",
    brand: "Bilal Parts",
    model: "BP-WH-010",
    year: 2024,
    weight: 2.1,
    dimensions: "200x5x3 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Length", value: "2m", unit: "" },
      { name: "Wires", value: "24", unit: "pieces" },
      { name: "Material", value: "Copper", unit: "" }
    ]
  },
  
  // More Hydraulic Parts
  {
    name: "Forklift Hydraulic Reservoir",
    sku: "HY-006",
    catalog_number: "HR-006",
    description: "High-capacity hydraulic fluid reservoir with integrated filter system.",
    short_description: "Forklift hydraulic reservoir",
    price: 159.99,
    original_price: 189.99,
    cost_price: 95.00,
    stock_quantity: 15,
    category: "Hydraulic Parts",
    brand: "Bilal Parts",
    model: "BP-HR-006",
    year: 2024,
    weight: 12.5,
    dimensions: "30x25x20 cm",
    images: ["https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Capacity", value: "20L", unit: "" },
      { name: "Material", value: "Steel", unit: "" },
      { name: "Pressure", value: "200", unit: "PSI" }
    ]
  },
  {
    name: "Forklift Hydraulic Manifold",
    sku: "HY-007",
    catalog_number: "HM-007",
    description: "Precision-machined hydraulic manifold for optimal fluid distribution.",
    short_description: "Forklift hydraulic manifold",
    price: 89.99,
    original_price: 109.99,
    cost_price: 55.00,
    stock_quantity: 25,
    category: "Hydraulic Parts",
    brand: "Bilal Parts",
    model: "BP-HM-007",
    year: 2024,
    weight: 3.2,
    dimensions: "15x12x8 cm",
    images: ["https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Ports", value: "6", unit: "pieces" },
      { name: "Material", value: "Aluminum", unit: "" },
      { name: "Pressure", value: "3000", unit: "PSI" }
    ]
  },
  {
    name: "Forklift Hydraulic Accumulator",
    sku: "HY-008",
    catalog_number: "HA-008",
    description: "High-pressure hydraulic accumulator for smooth operation and energy storage.",
    short_description: "Forklift hydraulic accumulator",
    price: 199.99,
    original_price: 239.99,
    cost_price: 120.00,
    stock_quantity: 12,
    category: "Hydraulic Parts",
    brand: "Bilal Parts",
    model: "BP-HA-008",
    year: 2024,
    weight: 8.7,
    dimensions: "25x15x15 cm",
    images: ["https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Capacity", value: "2L", unit: "" },
      { name: "Material", value: "Steel", unit: "" },
      { name: "Pressure", value: "3000", unit: "PSI" }
    ]
  },
  {
    name: "Forklift Hydraulic Pressure Gauge",
    sku: "HY-009",
    catalog_number: "HPG-009",
    description: "Precision hydraulic pressure gauge with easy-to-read dial.",
    short_description: "Forklift hydraulic pressure gauge",
    price: 25.99,
    original_price: 32.99,
    cost_price: 15.00,
    stock_quantity: 60,
    category: "Hydraulic Parts",
    brand: "Bilal Parts",
    model: "BP-HPG-009",
    year: 2024,
    weight: 0.4,
    dimensions: "8x8x4 cm",
    images: ["https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Range", value: "0-5000", unit: "PSI" },
      { name: "Material", value: "Steel", unit: "" },
      { name: "Connection", value: "1/4 NPT", unit: "" }
    ]
  },
  {
    name: "Forklift Hydraulic Relief Valve",
    sku: "HY-010",
    catalog_number: "HRV-010",
    description: "Adjustable hydraulic relief valve for system protection.",
    short_description: "Forklift hydraulic relief valve",
    price: 45.99,
    original_price: 55.99,
    cost_price: 28.00,
    stock_quantity: 35,
    category: "Hydraulic Parts",
    brand: "Bilal Parts",
    model: "BP-HRV-010",
    year: 2024,
    weight: 1.2,
    dimensions: "10x8x6 cm",
    images: ["https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Pressure", value: "3000", unit: "PSI" },
      { name: "Material", value: "Steel", unit: "" },
      { name: "Connection", value: "1/2 NPT", unit: "" }
    ]
  }
];

async function addProducts() {
  try {
    console.log('Starting to add additional products...');
    
    // Get categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name');
    
    if (catError) throw catError;
    
    console.log('Categories loaded:', categories.length);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of additionalProducts) {
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
            is_featured: false,
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
        
        console.log(`✅ Added: ${product.name}`);
        successCount++;
        
      } catch (error) {
        console.log(`Error processing product ${product.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n✅ Successfully added ${successCount} products`);
    console.log(`❌ Failed to add ${errorCount} products`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

addProducts();
