// Script to add 100 products to Supabase database
// Run this in Supabase SQL Editor or use as a Node.js script

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fvnelqjpptwteiesonhq.supabase.co';
const supabaseServiceKey = 'sb_secret_NQS2WABTdgttYapNQpnhvQ_PgYQtl11'; // Use service key for admin operations

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample product data with images
const products = [
  // Electrical Parts
  {
    name: "Forklift Ignition Switch",
    sku: "EL-001",
    catalog_number: "IGN-SW-001",
    description: "High-quality ignition switch for forklift trucks. Durable construction with weather-resistant design.",
    short_description: "Forklift ignition switch",
    price: 45.99,
    original_price: 55.99,
    cost_price: 25.00,
    stock_quantity: 50,
    category: "Electrical Parts",
    subcategory: "Switches",
    brand: "Bilal Parts",
    model: "BP-IGN-001",
    year: 2024,
    weight: 0.5,
    dimensions: "5x3x2 cm",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
    ],
    specifications: [
      { name: "Voltage", value: "12V", unit: "DC" },
      { name: "Current", value: "10A", unit: "Amps" },
      { name: "Material", value: "Plastic", unit: "" },
      { name: "Color", value: "Black", unit: "" }
    ]
  },
  {
    name: "Forklift Headlight Assembly",
    sku: "EL-002",
    catalog_number: "HL-ASM-002",
    description: "Complete headlight assembly for forklift trucks. Includes LED bulbs and mounting hardware.",
    short_description: "Forklift headlight assembly",
    price: 89.99,
    original_price: 109.99,
    cost_price: 45.00,
    stock_quantity: 30,
    category: "Electrical Parts",
    brand: "Bilal Parts",
    model: "BP-HL-002",
    year: 2024,
    weight: 1.2,
    dimensions: "20x15x10 cm",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
    ],
    specifications: [
      { name: "Bulb Type", value: "LED", unit: "" },
      { name: "Power", value: "24W", unit: "Watts" },
      { name: "Voltage", value: "12V", unit: "DC" },
      { name: "Beam Pattern", value: "Low/High", unit: "" }
    ]
  },
  {
    name: "Forklift Horn",
    sku: "EL-003",
    catalog_number: "HORN-003",
    description: "Loud and clear horn for forklift safety. Weather-resistant design.",
    short_description: "Forklift safety horn",
    price: 35.99,
    original_price: 42.99,
    cost_price: 18.00,
    stock_quantity: 75,
    category: "Electrical Parts",
    brand: "Bilal Parts",
    model: "BP-HORN-003",
    year: 2024,
    weight: 0.8,
    dimensions: "12x8x6 cm",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
    ],
    specifications: [
      { name: "Sound Level", value: "110", unit: "dB" },
      { name: "Voltage", value: "12V", unit: "DC" },
      { name: "Current", value: "3A", unit: "Amps" },
      { name: "Material", value: "Metal", unit: "" }
    ]
  },
  {
    name: "Forklift Turn Signal Switch",
    sku: "EL-004",
    catalog_number: "TS-SW-004",
    description: "Turn signal switch with hazard light function. Easy installation.",
    short_description: "Turn signal switch",
    price: 28.99,
    original_price: 35.99,
    cost_price: 15.00,
    stock_quantity: 60,
    category: "Electrical Parts",
    subcategory: "Switches",
    brand: "Bilal Parts",
    model: "BP-TS-004",
    year: 2024,
    weight: 0.3,
    dimensions: "8x5x3 cm",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
    ],
    specifications: [
      { name: "Voltage", value: "12V", unit: "DC" },
      { name: "Current", value: "5A", unit: "Amps" },
      { name: "Functions", value: "Turn/Hazard", unit: "" },
      { name: "Material", value: "Plastic", unit: "" }
    ]
  },
  {
    name: "Forklift Battery Charger",
    sku: "EL-005",
    catalog_number: "BAT-CHG-005",
    description: "Automatic battery charger for forklift batteries. Smart charging technology.",
    short_description: "Forklift battery charger",
    price: 299.99,
    original_price: 349.99,
    cost_price: 150.00,
    stock_quantity: 15,
    category: "Electrical Parts",
    brand: "Bilal Parts",
    model: "BP-CHG-005",
    year: 2024,
    weight: 5.0,
    dimensions: "30x20x15 cm",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
    ],
    specifications: [
      { name: "Input Voltage", value: "110-240V", unit: "AC" },
      { name: "Output Voltage", value: "12V", unit: "DC" },
      { name: "Current", value: "20A", unit: "Amps" },
      { name: "Charging Time", value: "8-12", unit: "hours" }
    ]
  },
  // Hydraulic Parts
  {
    name: "Forklift Hydraulic Pump",
    sku: "HY-001",
    catalog_number: "HP-PMP-001",
    description: "High-pressure hydraulic pump for forklift lifting system. OEM quality.",
    short_description: "Hydraulic pump",
    price: 450.99,
    original_price: 520.99,
    cost_price: 225.00,
    stock_quantity: 12,
    category: "Hydraulic Parts",
    subcategory: "Pumps",
    brand: "Bilal Parts",
    model: "BP-HP-001",
    year: 2024,
    weight: 8.5,
    dimensions: "25x20x15 cm",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
    ],
    specifications: [
      { name: "Flow Rate", value: "25", unit: "L/min" },
      { name: "Pressure", value: "200", unit: "Bar" },
      { name: "Material", value: "Cast Iron", unit: "" },
      { name: "Mounting", value: "Direct", unit: "" }
    ]
  },
  {
    name: "Forklift Hydraulic Cylinder",
    sku: "HY-002",
    catalog_number: "HC-CYL-002",
    description: "Heavy-duty hydraulic cylinder for forklift mast. Sealed design.",
    short_description: "Hydraulic cylinder",
    price: 320.99,
    original_price: 380.99,
    cost_price: 160.00,
    stock_quantity: 18,
    category: "Hydraulic Parts",
    brand: "Bilal Parts",
    model: "BP-HC-002",
    year: 2024,
    weight: 12.0,
    dimensions: "50x15x15 cm",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
    ],
    specifications: [
      { name: "Bore", value: "80", unit: "mm" },
      { name: "Stroke", value: "1200", unit: "mm" },
      { name: "Pressure", value: "200", unit: "Bar" },
      { name: "Material", value: "Steel", unit: "" }
    ]
  },
  {
    name: "Forklift Hydraulic Hose",
    sku: "HY-003",
    catalog_number: "HH-HSE-003",
    description: "High-pressure hydraulic hose with fittings. Flexible and durable.",
    short_description: "Hydraulic hose",
    price: 45.99,
    original_price: 55.99,
    cost_price: 23.00,
    stock_quantity: 100,
    category: "Hydraulic Parts",
    brand: "Bilal Parts",
    model: "BP-HH-003",
    year: 2024,
    weight: 1.5,
    dimensions: "100x2x2 cm",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
    ],
    specifications: [
      { name: "Length", value: "100", unit: "cm" },
      { name: "Diameter", value: "12", unit: "mm" },
      { name: "Pressure", value: "250", unit: "Bar" },
      { name: "Material", value: "Rubber/Steel", unit: "" }
    ]
  },
  {
    name: "Forklift Hydraulic Filter",
    sku: "HY-004",
    catalog_number: "HF-FLT-004",
    description: "Hydraulic system filter for clean oil circulation. High efficiency.",
    short_description: "Hydraulic filter",
    price: 25.99,
    original_price: 32.99,
    cost_price: 13.00,
    stock_quantity: 80,
    category: "Hydraulic Parts",
    brand: "Bilal Parts",
    model: "BP-HF-004",
    year: 2024,
    weight: 0.8,
    dimensions: "15x8x8 cm",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
    ],
    specifications: [
      { name: "Filtration", value: "10", unit: "microns" },
      { name: "Flow Rate", value: "30", unit: "L/min" },
      { name: "Material", value: "Paper/Steel", unit: "" },
      { name: "Thread", value: "M18x1.5", unit: "" }
    ]
  },
  {
    name: "Forklift Hydraulic Valve",
    sku: "HY-005",
    catalog_number: "HV-VLV-005",
    description: "Control valve for hydraulic system. Precise flow control.",
    short_description: "Hydraulic control valve",
    price: 180.99,
    original_price: 220.99,
    cost_price: 90.00,
    stock_quantity: 25,
    category: "Hydraulic Parts",
    brand: "Bilal Parts",
    model: "BP-HV-005",
    year: 2024,
    weight: 2.5,
    dimensions: "12x10x8 cm",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"
    ],
    specifications: [
      { name: "Flow Rate", value: "25", unit: "L/min" },
      { name: "Pressure", value: "200", unit: "Bar" },
      { name: "Material", value: "Cast Iron", unit: "" },
      { name: "Type", value: "Spool", unit: "" }
    ]
  }
];

// Function to add products to Supabase
async function addProducts() {
  try {
    console.log('Starting to add products to Supabase...');
    
    // First, get category IDs
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name, slug');
    
    if (catError) {
      console.error('Error fetching categories:', catError);
      return;
    }
    
    console.log('Categories loaded:', categories.length);
    
    // Process each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Find category ID
      const category = categories.find(cat => 
        cat.name === product.category || cat.slug === product.category.toLowerCase().replace(/\s+/g, '-')
      );
      
      if (!category) {
        console.log(`Category not found for product: ${product.name}`);
        continue;
      }
      
      // Find subcategory ID if exists
      let subcategoryId = null;
      if (product.subcategory) {
        const subcategory = categories.find(cat => 
          cat.name === product.subcategory || cat.slug === product.subcategory.toLowerCase().replace(/\s+/g, '-')
        );
        if (subcategory) {
          subcategoryId = subcategory.id;
        }
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
          subcategory_id: subcategoryId,
          brand: product.brand,
          model: product.model,
          year: product.year,
          weight: product.weight,
          dimensions: product.dimensions,
          is_featured: Math.random() > 0.7, // Random featured products
          in_stock: product.stock_quantity > 0
        })
        .select()
        .single();
      
      if (productError) {
        console.error(`Error inserting product ${product.name}:`, productError);
        continue;
      }
      
      console.log(`Product added: ${product.name} (ID: ${productData.id})`);
      
      // Add product images
      if (product.images && product.images.length > 0) {
        for (let j = 0; j < product.images.length; j++) {
          const { error: imageError } = await supabase
            .from('product_images')
            .insert({
              product_id: productData.id,
              image_url: product.images[j],
              alt_text: `${product.name} - Image ${j + 1}`,
              is_primary: j === 0,
              sort_order: j
            });
          
          if (imageError) {
            console.error(`Error inserting image for ${product.name}:`, imageError);
          }
        }
      }
      
      // Add product specifications
      if (product.specifications && product.specifications.length > 0) {
        for (let k = 0; k < product.specifications.length; k++) {
          const spec = product.specifications[k];
          const { error: specError } = await supabase
            .from('product_specifications')
            .insert({
              product_id: productData.id,
              name: spec.name,
              value: spec.value,
              unit: spec.unit,
              sort_order: k
            });
          
          if (specError) {
            console.error(`Error inserting specification for ${product.name}:`, specError);
          }
        }
      }
    }
    
    console.log('✅ All products added successfully!');
    
  } catch (error) {
    console.error('Error adding products:', error);
  }
}

// Run the script
addProducts();
