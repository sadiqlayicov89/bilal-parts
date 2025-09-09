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
  },
  // Engine Parts
  {
    name: "Forklift Engine Oil Filter",
    sku: "EN-001",
    catalog_number: "EO-FLT-001",
    description: "High-quality engine oil filter for forklift engines. Extended service life.",
    short_description: "Engine oil filter",
    price: 18.99,
    original_price: 24.99,
    cost_price: 9.50,
    stock_quantity: 120,
    category: "Engine Parts",
    brand: "Bilal Parts",
    model: "BP-EO-001",
    year: 2024,
    weight: 0.6,
    dimensions: "10x8x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Filtration", value: "15", unit: "microns" },
      { name: "Thread", value: "M20x1.5", unit: "" },
      { name: "Material", value: "Paper/Steel", unit: "" },
      { name: "Capacity", value: "0.5", unit: "L" }
    ]
  },
  {
    name: "Forklift Air Filter",
    sku: "EN-002",
    catalog_number: "AF-FLT-002",
    description: "Heavy-duty air filter for forklift engines. High dust capacity.",
    short_description: "Engine air filter",
    price: 32.99,
    original_price: 39.99,
    cost_price: 16.50,
    stock_quantity: 80,
    category: "Engine Parts",
    brand: "Bilal Parts",
    model: "BP-AF-002",
    year: 2024,
    weight: 1.2,
    dimensions: "25x20x15 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Filtration", value: "5", unit: "microns" },
      { name: "Air Flow", value: "200", unit: "CFM" },
      { name: "Material", value: "Paper", unit: "" },
      { name: "Service Life", value: "500", unit: "hours" }
    ]
  },
  {
    name: "Forklift Spark Plug",
    sku: "EN-003",
    catalog_number: "SP-PLG-003",
    description: "Iridium spark plug for optimal engine performance. Long-lasting design.",
    short_description: "Iridium spark plug",
    price: 12.99,
    original_price: 15.99,
    cost_price: 6.50,
    stock_quantity: 200,
    category: "Engine Parts",
    brand: "Bilal Parts",
    model: "BP-SP-003",
    year: 2024,
    weight: 0.1,
    dimensions: "8x1x1 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Gap", value: "0.8", unit: "mm" },
      { name: "Thread", value: "M14x1.25", unit: "" },
      { name: "Material", value: "Iridium", unit: "" },
      { name: "Heat Range", value: "6", unit: "" }
    ]
  },
  {
    name: "Forklift Fuel Filter",
    sku: "EN-004",
    catalog_number: "FF-FLT-004",
    description: "High-efficiency fuel filter for clean fuel delivery. Water separation capability.",
    short_description: "Fuel filter",
    price: 24.99,
    original_price: 29.99,
    cost_price: 12.50,
    stock_quantity: 90,
    category: "Engine Parts",
    brand: "Bilal Parts",
    model: "BP-FF-004",
    year: 2024,
    weight: 0.8,
    dimensions: "12x8x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Filtration", value: "10", unit: "microns" },
      { name: "Flow Rate", value: "50", unit: "L/h" },
      { name: "Material", value: "Paper/Steel", unit: "" },
      { name: "Water Separation", value: "Yes", unit: "" }
    ]
  },
  {
    name: "Forklift Engine Belt",
    sku: "EN-005",
    catalog_number: "EB-BLT-005",
    description: "Heavy-duty engine belt for power transmission. Weather-resistant rubber.",
    short_description: "Engine drive belt",
    price: 35.99,
    original_price: 42.99,
    cost_price: 18.00,
    stock_quantity: 60,
    category: "Engine Parts",
    brand: "Bilal Parts",
    model: "BP-EB-005",
    year: 2024,
    weight: 0.5,
    dimensions: "120x2x1 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Length", value: "1200", unit: "mm" },
      { name: "Width", value: "20", unit: "mm" },
      { name: "Material", value: "Rubber", unit: "" },
      { name: "Type", value: "V-Belt", unit: "" }
    ]
  },
  // Brake Parts
  {
    name: "Forklift Brake Pad Set",
    sku: "BR-001",
    catalog_number: "BP-PAD-001",
    description: "High-performance brake pads for forklift braking system. Low dust formula.",
    short_description: "Brake pad set",
    price: 89.99,
    original_price: 109.99,
    cost_price: 45.00,
    stock_quantity: 40,
    category: "Brake Parts",
    brand: "Bilal Parts",
    model: "BP-BP-001",
    year: 2024,
    weight: 2.5,
    dimensions: "15x10x3 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Material", value: "Ceramic", unit: "" },
      { name: "Thickness", value: "12", unit: "mm" },
      { name: "Temperature", value: "600", unit: "°C" },
      { name: "Friction", value: "0.4", unit: "μ" }
    ]
  },
  {
    name: "Forklift Brake Disc",
    sku: "BR-002",
    catalog_number: "BD-DSC-002",
    description: "Vented brake disc for optimal heat dissipation. Corrosion-resistant coating.",
    short_description: "Brake disc",
    price: 125.99,
    original_price: 149.99,
    cost_price: 63.00,
    stock_quantity: 25,
    category: "Brake Parts",
    brand: "Bilal Parts",
    model: "BP-BD-002",
    year: 2024,
    weight: 8.5,
    dimensions: "30x30x2 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Diameter", value: "300", unit: "mm" },
      { name: "Thickness", value: "20", unit: "mm" },
      { name: "Material", value: "Cast Iron", unit: "" },
      { name: "Coating", value: "Zinc", unit: "" }
    ]
  },
  {
    name: "Forklift Brake Fluid",
    sku: "BR-003",
    catalog_number: "BF-FLD-003",
    description: "High-performance brake fluid. DOT 4 specification. Boiling point 230°C.",
    short_description: "Brake fluid DOT 4",
    price: 15.99,
    original_price: 19.99,
    cost_price: 8.00,
    stock_quantity: 150,
    category: "Brake Parts",
    brand: "Bilal Parts",
    model: "BP-BF-003",
    year: 2024,
    weight: 1.0,
    dimensions: "20x8x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Specification", value: "DOT 4", unit: "" },
      { name: "Boiling Point", value: "230", unit: "°C" },
      { name: "Volume", value: "500", unit: "ml" },
      { name: "Color", value: "Clear", unit: "" }
    ]
  },
  {
    name: "Forklift Brake Master Cylinder",
    sku: "BR-004",
    catalog_number: "BMC-CYL-004",
    description: "Brake master cylinder for hydraulic brake system. Sealed design.",
    short_description: "Brake master cylinder",
    price: 180.99,
    original_price: 220.99,
    cost_price: 90.50,
    stock_quantity: 15,
    category: "Brake Parts",
    brand: "Bilal Parts",
    model: "BP-BMC-004",
    year: 2024,
    weight: 2.8,
    dimensions: "15x10x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Bore", value: "22", unit: "mm" },
      { name: "Stroke", value: "35", unit: "mm" },
      { name: "Material", value: "Aluminum", unit: "" },
      { name: "Type", value: "Tandem", unit: "" }
    ]
  },
  {
    name: "Forklift Brake Caliper",
    sku: "BR-005",
    catalog_number: "BC-CAL-005",
    description: "Floating brake caliper for disc brake system. Corrosion-resistant.",
    short_description: "Brake caliper",
    price: 220.99,
    original_price: 269.99,
    cost_price: 110.50,
    stock_quantity: 20,
    category: "Brake Parts",
    brand: "Bilal Parts",
    model: "BP-BC-005",
    year: 2024,
    weight: 4.2,
    dimensions: "20x15x10 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Type", value: "Floating", unit: "" },
      { name: "Piston", value: "2", unit: "pcs" },
      { name: "Material", value: "Cast Iron", unit: "" },
      { name: "Coating", value: "Zinc", unit: "" }
    ]
  },
  // Filters
  {
    name: "Forklift Cabin Air Filter",
    sku: "FL-001",
    catalog_number: "CAF-FLT-001",
    description: "Cabin air filter for operator comfort. HEPA filtration system.",
    short_description: "Cabin air filter",
    price: 28.99,
    original_price: 35.99,
    cost_price: 14.50,
    stock_quantity: 70,
    category: "Filters",
    subcategory: "Air Filters",
    brand: "Bilal Parts",
    model: "BP-CAF-001",
    year: 2024,
    weight: 0.8,
    dimensions: "20x15x5 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Filtration", value: "HEPA", unit: "" },
      { name: "Efficiency", value: "99.97%", unit: "" },
      { name: "Material", value: "Paper", unit: "" },
      { name: "Service Life", value: "6", unit: "months" }
    ]
  },
  {
    name: "Forklift Hydraulic Oil Filter",
    sku: "FL-002",
    catalog_number: "HOF-FLT-002",
    description: "High-pressure hydraulic oil filter. Extended service intervals.",
    short_description: "Hydraulic oil filter",
    price: 42.99,
    original_price: 52.99,
    cost_price: 21.50,
    stock_quantity: 55,
    category: "Filters",
    subcategory: "Oil Filters",
    brand: "Bilal Parts",
    model: "BP-HOF-002",
    year: 2024,
    weight: 1.5,
    dimensions: "18x12x12 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Filtration", value: "5", unit: "microns" },
      { name: "Flow Rate", value: "40", unit: "L/min" },
      { name: "Material", value: "Paper/Steel", unit: "" },
      { name: "Thread", value: "M22x1.5", unit: "" }
    ]
  },
  {
    name: "Forklift Fuel Water Separator",
    sku: "FL-003",
    catalog_number: "FWS-SEP-003",
    description: "Fuel water separator for clean fuel delivery. Automatic drain valve.",
    short_description: "Fuel water separator",
    price: 95.99,
    original_price: 115.99,
    cost_price: 48.00,
    stock_quantity: 30,
    category: "Filters",
    brand: "Bilal Parts",
    model: "BP-FWS-003",
    year: 2024,
    weight: 2.8,
    dimensions: "25x15x15 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Filtration", value: "10", unit: "microns" },
      { name: "Water Capacity", value: "200", unit: "ml" },
      { name: "Material", value: "Aluminum", unit: "" },
      { name: "Drain", value: "Automatic", unit: "" }
    ]
  },
  {
    name: "Forklift Transmission Filter",
    sku: "FL-004",
    catalog_number: "TF-FLT-004",
    description: "Transmission fluid filter for smooth gear operation. High efficiency.",
    short_description: "Transmission filter",
    price: 38.99,
    original_price: 47.99,
    cost_price: 19.50,
    stock_quantity: 45,
    category: "Filters",
    brand: "Bilal Parts",
    model: "BP-TF-004",
    year: 2024,
    weight: 1.2,
    dimensions: "15x10x10 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Filtration", value: "15", unit: "microns" },
      { name: "Flow Rate", value: "25", unit: "L/min" },
      { name: "Material", value: "Paper/Steel", unit: "" },
      { name: "Thread", value: "M18x1.5", unit: "" }
    ]
  },
  {
    name: "Forklift Coolant Filter",
    sku: "FL-005",
    catalog_number: "CF-FLT-005",
    description: "Coolant filter for engine cooling system. Corrosion protection.",
    short_description: "Coolant filter",
    price: 22.99,
    original_price: 28.99,
    cost_price: 11.50,
    stock_quantity: 85,
    category: "Filters",
    brand: "Bilal Parts",
    model: "BP-CF-005",
    year: 2024,
    weight: 0.6,
    dimensions: "12x8x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Filtration", value: "20", unit: "microns" },
      { name: "Flow Rate", value: "30", unit: "L/min" },
      { name: "Material", value: "Paper/Steel", unit: "" },
      { name: "Protection", value: "Corrosion", unit: "" }
    ]
  },
  // Cooling Parts
  {
    name: "Forklift Radiator",
    sku: "CL-001",
    catalog_number: "RAD-RAD-001",
    description: "Heavy-duty radiator for engine cooling. Aluminum construction.",
    short_description: "Engine radiator",
    price: 320.99,
    original_price: 389.99,
    cost_price: 160.50,
    stock_quantity: 12,
    category: "Cooling Parts",
    brand: "Bilal Parts",
    model: "BP-RAD-001",
    year: 2024,
    weight: 15.5,
    dimensions: "60x40x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Material", value: "Aluminum", unit: "" },
      { name: "Core", value: "2", unit: "rows" },
      { name: "Capacity", value: "8", unit: "L" },
      { name: "Pressure", value: "1.5", unit: "Bar" }
    ]
  },
  {
    name: "Forklift Water Pump",
    sku: "CL-002",
    catalog_number: "WP-PMP-002",
    description: "High-flow water pump for cooling system. Sealed bearing design.",
    short_description: "Water pump",
    price: 185.99,
    original_price: 225.99,
    cost_price: 93.00,
    stock_quantity: 18,
    category: "Cooling Parts",
    brand: "Bilal Parts",
    model: "BP-WP-002",
    year: 2024,
    weight: 3.2,
    dimensions: "20x15x15 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Flow Rate", value: "120", unit: "L/min" },
      { name: "Material", value: "Cast Iron", unit: "" },
      { name: "Bearing", value: "Sealed", unit: "" },
      { name: "Impeller", value: "Steel", unit: "" }
    ]
  },
  {
    name: "Forklift Thermostat",
    sku: "CL-003",
    catalog_number: "THM-THM-003",
    description: "Engine thermostat for temperature control. Wax pellet design.",
    short_description: "Engine thermostat",
    price: 25.99,
    original_price: 32.99,
    cost_price: 13.00,
    stock_quantity: 100,
    category: "Cooling Parts",
    brand: "Bilal Parts",
    model: "BP-THM-003",
    year: 2024,
    weight: 0.3,
    dimensions: "8x6x3 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Opening Temp", value: "82", unit: "°C" },
      { name: "Material", value: "Brass", unit: "" },
      { name: "Type", value: "Wax Pellet", unit: "" },
      { name: "Thread", value: "M30x1.5", unit: "" }
    ]
  },
  {
    name: "Forklift Cooling Fan",
    sku: "CL-004",
    catalog_number: "CF-FAN-004",
    description: "Electric cooling fan for radiator. Variable speed control.",
    short_description: "Cooling fan",
    price: 125.99,
    original_price: 155.99,
    cost_price: 63.00,
    stock_quantity: 25,
    category: "Cooling Parts",
    brand: "Bilal Parts",
    model: "BP-CF-004",
    year: 2024,
    weight: 2.8,
    dimensions: "35x35x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Diameter", value: "350", unit: "mm" },
      { name: "Blades", value: "7", unit: "pcs" },
      { name: "Speed", value: "Variable", unit: "" },
      { name: "Power", value: "150", unit: "W" }
    ]
  },
  {
    name: "Forklift Coolant Hose",
    sku: "CL-005",
    catalog_number: "CH-HSE-005",
    description: "Heavy-duty coolant hose. Heat-resistant rubber construction.",
    short_description: "Coolant hose",
    price: 35.99,
    original_price: 44.99,
    cost_price: 18.00,
    stock_quantity: 80,
    category: "Cooling Parts",
    brand: "Bilal Parts",
    model: "BP-CH-005",
    year: 2024,
    weight: 1.2,
    dimensions: "80x3x3 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Length", value: "800", unit: "mm" },
      { name: "Diameter", value: "32", unit: "mm" },
      { name: "Material", value: "Rubber", unit: "" },
      { name: "Temperature", value: "120", unit: "°C" }
    ]
  },
  // Transmission Parts
  {
    name: "Forklift Clutch Kit",
    sku: "TR-001",
    catalog_number: "CK-KIT-001",
    description: "Complete clutch kit for manual transmission. Includes disc, pressure plate, and bearing.",
    short_description: "Clutch kit",
    price: 450.99,
    original_price: 549.99,
    cost_price: 225.50,
    stock_quantity: 8,
    category: "Transmission Parts",
    brand: "Bilal Parts",
    model: "BP-CK-001",
    year: 2024,
    weight: 12.5,
    dimensions: "30x30x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Diameter", value: "240", unit: "mm" },
      { name: "Splines", value: "24", unit: "pcs" },
      { name: "Material", value: "Organic", unit: "" },
      { name: "Torque", value: "300", unit: "Nm" }
    ]
  },
  {
    name: "Forklift Gear Oil",
    sku: "TR-002",
    catalog_number: "GO-OIL-002",
    description: "High-performance gear oil for transmission. 75W-90 specification.",
    short_description: "Gear oil 75W-90",
    price: 28.99,
    original_price: 35.99,
    cost_price: 14.50,
    stock_quantity: 120,
    category: "Transmission Parts",
    brand: "Bilal Parts",
    model: "BP-GO-002",
    year: 2024,
    weight: 1.0,
    dimensions: "20x8x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Viscosity", value: "75W-90", unit: "" },
      { name: "Volume", value: "1", unit: "L" },
      { name: "Type", value: "Synthetic", unit: "" },
      { name: "Color", value: "Amber", unit: "" }
    ]
  },
  {
    name: "Forklift Transmission Mount",
    sku: "TR-003",
    catalog_number: "TM-MNT-003",
    description: "Rubber transmission mount for vibration isolation. Heavy-duty design.",
    short_description: "Transmission mount",
    price: 65.99,
    original_price: 79.99,
    cost_price: 33.00,
    stock_quantity: 35,
    category: "Transmission Parts",
    brand: "Bilal Parts",
    model: "BP-TM-003",
    year: 2024,
    weight: 1.8,
    dimensions: "15x12x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Material", value: "Rubber/Steel", unit: "" },
      { name: "Load", value: "150", unit: "kg" },
      { name: "Isolation", value: "Vibration", unit: "" },
      { name: "Bolt Pattern", value: "4xM10", unit: "" }
    ]
  },
  {
    name: "Forklift Shift Lever",
    sku: "TR-004",
    catalog_number: "SL-LEV-004",
    description: "Heavy-duty shift lever for manual transmission. Ergonomic design.",
    short_description: "Shift lever",
    price: 85.99,
    original_price: 104.99,
    cost_price: 43.00,
    stock_quantity: 20,
    category: "Transmission Parts",
    brand: "Bilal Parts",
    model: "BP-SL-004",
    year: 2024,
    weight: 2.2,
    dimensions: "40x5x5 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Length", value: "400", unit: "mm" },
      { name: "Material", value: "Steel", unit: "" },
      { name: "Grip", value: "Rubber", unit: "" },
      { name: "Thread", value: "M12x1.5", unit: "" }
    ]
  },
  {
    name: "Forklift Differential Oil",
    sku: "TR-005",
    catalog_number: "DO-OIL-005",
    description: "Heavy-duty differential oil. 80W-90 specification for high loads.",
    short_description: "Differential oil 80W-90",
    price: 32.99,
    original_price: 39.99,
    cost_price: 16.50,
    stock_quantity: 90,
    category: "Transmission Parts",
    brand: "Bilal Parts",
    model: "BP-DO-005",
    year: 2024,
    weight: 1.0,
    dimensions: "20x8x8 cm",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop"],
    specifications: [
      { name: "Viscosity", value: "80W-90", unit: "" },
      { name: "Volume", value: "1", unit: "L" },
      { name: "Type", value: "Mineral", unit: "" },
      { name: "Load", value: "High", unit: "" }
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
