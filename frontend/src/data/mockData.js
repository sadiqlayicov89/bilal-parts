// Mock data for the Folangsi forklift website
export const mockData = {
  // Company information
  company: {
    name: "BILAL-PARTS CO.,LTD",
    chineseName: "Premium Parts & Accessories",
    stockCode: "02499. HK",
    established: "2007",
    headquarters: "Guangzhou, China",
    outlets: "100+",
    countries: "150+",
    partsInStock: "3,000,000+",
    experience: "21 years",
    email: "admin@bilal-parts.com",
    phone: "0086-18520438258",
    fax: "0086-20-3999 3597",
    address: "No. 999,Asian Games Avenue,Shiqi Town,Panyu District,Guangzhou,China."
  },

  // Product categories
  productCategories: [
    {
      id: 1,
      name: "Forklift",
      slug: "forklift",
      description: "Complete forklifts and forklift solutions",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
      subcategories: [
        { id: 1, name: "Electric Forklifts", slug: "electric-forklifts" },
        { id: 2, name: "Diesel Forklifts", slug: "diesel-forklifts" },
        { id: 3, name: "LPG Forklifts", slug: "lpg-forklifts" },
        { id: 4, name: "Warehouse Forklifts", slug: "warehouse-forklifts" }
      ]
    },
    {
      id: 2,
      name: "Engine Parts",
      slug: "engine-parts",
      description: "High-quality engine components",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      subcategories: [
        { id: 5, name: "Pistons & Rings", slug: "pistons-rings" },
        { id: 6, name: "Crankshafts", slug: "crankshafts" },
        { id: 7, name: "Cylinder Heads", slug: "cylinder-heads" },
        { id: 8, name: "Valves & Springs", slug: "valves-springs" }
      ]
    },
    {
      id: 3,
      name: "Cooling Parts",
      slug: "cooling-parts",
      description: "Radiators and cooling systems",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
      subcategories: [
        { id: 9, name: "Radiators", slug: "radiators" },
        { id: 10, name: "Water Pumps", slug: "water-pumps" },
        { id: 11, name: "Thermostats", slug: "thermostats" },
        { id: 12, name: "Cooling Fans", slug: "cooling-fans" }
      ]
    },
    {
      id: 4,
      name: "Filters",
      slug: "filters",
      description: "Air, oil, fuel, and hydraulic filters",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      subcategories: [
        { id: 13, name: "Air Filters", slug: "air-filters" },
        { id: 14, name: "Oil Filters", slug: "oil-filters" },
        { id: 15, name: "Fuel Filters", slug: "fuel-filters" },
        { id: 16, name: "Hydraulic Filters", slug: "hydraulic-filters" }
      ]
    },
    {
      id: 5,
      name: "Transmission Parts",
      slug: "transmission-parts",
      description: "Transmission components and solutions",
      image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=400&h=300&fit=crop",
      subcategories: [
        { id: 17, name: "Gears", slug: "gears" },
        { id: 18, name: "Clutches", slug: "clutches" },
        { id: 19, name: "Drive Shafts", slug: "drive-shafts" },
        { id: 20, name: "Transmission Cases", slug: "transmission-cases" }
      ]
    },
    {
      id: 6,
      name: "Hydraulic Parts",
      slug: "hydraulic-parts",
      description: "Hydraulic pumps and cylinders",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      subcategories: [
        { id: 21, name: "Hydraulic Pumps", slug: "hydraulic-pumps" },
        { id: 22, name: "Hydraulic Cylinders", slug: "hydraulic-cylinders" },
        { id: 23, name: "Control Valves", slug: "control-valves" },
        { id: 24, name: "Hydraulic Hoses", slug: "hydraulic-hoses" }
      ]
    }
  ],

  // Products for admin panel and catalog
  products: [
    {
      id: "1",
      name: "FORWARD and REVERSE SWITCH",
      sku: "FLS#：A-LB32-101A-0479A",
      catalogNumber: "CAT-001",
      category: "Electrical Parts",
      subcategory: "Switches",
      price: 45.00,
      originalPrice: 55.00,
      discount: 18, // 18% endirim
      stock_quantity: 15,
      in_stock: true,
      description: "High-quality forward and reverse switch for forklift control systems. Features durable construction and reliable performance.",
      image: "https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=400&h=300&fit=crop",
      specifications: {
        "Voltage": "12V/24V",
        "Current": "10A",
        "Material": "ABS Plastic",
        "Protection": "IP65"
      }
    },
    {
      id: "2",
      name: "COMBINATION SWITCH",
      sku: "FLS#：A-LB31-912B-0377A",
      catalogNumber: "CAT-002",
      category: "Electrical Parts",
      subcategory: "Switches",
      price: 38.50,
      originalPrice: 48.00,
      discount: 20, // 20% endirim
      stock_quantity: 8,
      in_stock: true,
      description: "Multi-function combination switch for forklift lighting and control systems. Includes turn signals, wipers, and horn controls.",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      specifications: {
        "Voltage": "12V/24V",
        "Functions": "Turn, Wipers, Horn",
        "Material": "Thermoplastic",
        "Connections": "6-pin"
      }
    },
    {
      id: "3",
      name: "HYDRAULIC PUMP ASSEMBLY",
      sku: "FLS#：HP-001",
      catalogNumber: "CAT-003",
      category: "Hydraulic Parts",
      subcategory: "Hydraulic Pumps",
      price: 150.00,
      originalPrice: 180.00,
      discount: 17, // 17% endirim
      stock_quantity: 3,
      in_stock: true,
      description: "Complete hydraulic pump assembly for forklift lifting systems. High-pressure performance with excellent reliability.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      specifications: {
        "Pressure": "250 bar",
        "Flow Rate": "20 L/min",
        "Material": "Cast Iron",
        "Mounting": "Flange Type"
      }
    },
    {
      id: "4",
      name: "BRAKE PAD SET",
      sku: "FLS#：BP-002",
      catalogNumber: "CAT-004",
      category: "Brake Parts",
      subcategory: "Brake Pads",
      price: 25.00,
      originalPrice: 35.00,
      discount: 29, // 29% endirim
      stock_quantity: 0,
      in_stock: false,
      description: "Premium brake pad set for forklift braking systems. High-friction material for optimal stopping power.",
      image: "https://images.unsplash.com/photo-1558618047/3c8c76ca7d13?w=400&h=300&fit=crop",
      specifications: {
        "Material": "Ceramic",
        "Thickness": "12mm",
        "Temperature": "Up to 600°C",
        "Compatibility": "Universal"
      }
    },
    {
      id: "5",
      name: "ENGINE AIR FILTER",
      sku: "FLS#：AF-001",
      catalogNumber: "CAT-005",
      category: "Filters",
      subcategory: "Air Filters",
      price: 18.50,
      originalPrice: 22.00,
      discount: 16, // 16% endirim
      stock_quantity: 25,
      in_stock: true,
      description: "High-efficiency air filter for forklift engines. Provides excellent filtration and extended engine life.",
      image: "https://images.unsplash.com/photo-1558618047/3c8c76ca7d13?w=400&h=300&fit=crop",
      specifications: {
        "Filtration": "99.9%",
        "Material": "Paper/Cotton",
        "Size": "200x150mm",
        "Service Life": "500 hours"
      }
    },
    {
      id: "6",
      name: "OIL FILTER CARTRIDGE",
      sku: "FLS#：OF-001",
      catalogNumber: "CAT-006",
      category: "Filters",
      subcategory: "Oil Filters",
      price: 12.00,
      originalPrice: 15.00,
      discount: 20, // 20% endirim
      stock_quantity: 40,
      in_stock: true,
      description: "Premium oil filter cartridge for engine lubrication systems. Ensures clean oil circulation.",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      specifications: {
        "Filtration": "10 microns",
        "Material": "Cellulose",
        "Bypass Valve": "Yes",
        "Anti-drain": "Yes"
      }
    },
    {
      id: "7",
      name: "WATER PUMP ASSEMBLY",
      sku: "FLS#：WP-001",
      catalogNumber: "CAT-007",
      category: "Cooling Parts",
      subcategory: "Water Pumps",
      price: 85.00,
      originalPrice: 95.00,
      stock_quantity: 12,
      in_stock: true,
      description: "Complete water pump assembly for engine cooling systems. High-flow design for optimal heat dissipation.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
      specifications: {
        "Flow Rate": "80 L/min",
        "Material": "Aluminum",
        "Bearing": "Ceramic",
        "Seal": "Mechanical"
      }
    },
    {
      id: "8",
      name: "RADIATOR CORE",
      sku: "FLS#：RC-001",
      catalogNumber: "CAT-008",
      category: "Cooling Parts",
      subcategory: "Radiators",
      price: 120.00,
      originalPrice: 140.00,
      stock_quantity: 8,
      in_stock: true,
      description: "High-performance radiator core for efficient engine cooling. Copper-brass construction for durability.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
      specifications: {
        "Material": "Copper-Brass",
        "Tubes": "32",
        "Fins": "400/inch",
        "Capacity": "15L"
      }
    },
    {
      id: "9",
      name: "PISTON RING SET",
      sku: "FLS#：PR-001",
      catalogNumber: "CAT-009",
      category: "Engine Parts",
      subcategory: "Pistons & Rings",
      price: 65.00,
      originalPrice: 75.00,
      stock_quantity: 18,
      in_stock: true,
      description: "Complete piston ring set for engine rebuilds. High-quality materials for optimal compression.",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      specifications: {
        "Material": "Cast Iron",
        "Coating": "Chrome",
        "Set": "3 rings",
        "Diameter": "85mm"
      }
    },
    {
      id: "10",
      name: "CRANKSHAFT BEARING",
      sku: "FLS#：CB-001",
      catalogNumber: "CAT-010",
      category: "Engine Parts",
      subcategory: "Crankshafts",
      price: 45.00,
      originalPrice: 55.00,
      stock_quantity: 22,
      in_stock: true,
      description: "Precision-engineered crankshaft bearing for smooth engine operation. High-load capacity design.",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      specifications: {
        "Material": "Babbitt",
        "Thickness": "2.5mm",
        "Load": "High",
        "Finish": "Mirror"
      }
    },
    {
      id: "11",
      name: "GEAR SET",
      sku: "FLS#：GS-001",
      catalogNumber: "CAT-011",
      category: "Transmission Parts",
      subcategory: "Gears",
      price: 180.00,
      originalPrice: 220.00,
      stock_quantity: 6,
      in_stock: true,
      description: "Complete gear set for transmission systems. Hardened steel construction for long service life.",
      image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=400&h=300&fit=crop",
      specifications: {
        "Material": "Hardened Steel",
        "Teeth": "24",
        "Module": "3.0",
        "Hardness": "HRC 58-62"
      }
    },
    {
      id: "12",
      name: "CLUTCH DISC",
      sku: "FLS#：CD-001",
      catalogNumber: "CAT-012",
      category: "Transmission Parts",
      subcategory: "Clutches",
      price: 95.00,
      originalPrice: 110.00,
      stock_quantity: 15,
      in_stock: true,
      description: "High-performance clutch disc for smooth engagement. Organic friction material for excellent feel.",
      image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=400&h=300&fit=crop",
      specifications: {
        "Material": "Organic",
        "Diameter": "240mm",
        "Splines": "24",
        "Thickness": "8mm"
      }
    },
    {
      id: "13",
      name: "HYDRAULIC CYLINDER",
      sku: "FLS#：HC-001",
      catalogNumber: "CAT-013",
      category: "Hydraulic Parts",
      subcategory: "Hydraulic Cylinders",
      price: 280.00,
      originalPrice: 320.00,
      stock_quantity: 4,
      in_stock: true,
      description: "Heavy-duty hydraulic cylinder for lifting applications. Chrome-plated rod for corrosion resistance.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      specifications: {
        "Bore": "80mm",
        "Stroke": "500mm",
        "Pressure": "250 bar",
        "Rod": "Chrome-plated"
      }
    },
    {
      id: "14",
      name: "CONTROL VALVE",
      sku: "FLS#：CV-001",
      catalogNumber: "CAT-014",
      category: "Hydraulic Parts",
      subcategory: "Control Valves",
      price: 75.00,
      originalPrice: 85.00,
      stock_quantity: 20,
      in_stock: true,
      description: "Precision control valve for hydraulic systems. Smooth operation with minimal leakage.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      specifications: {
        "Ports": "4-way",
        "Pressure": "250 bar",
        "Flow": "30 L/min",
        "Operation": "Manual"
      }
    },
    {
      id: "15",
      name: "THERMOSTAT",
      sku: "FLS#：TH-001",
      catalogNumber: "CAT-015",
      category: "Cooling Parts",
      subcategory: "Thermostats",
      price: 22.00,
      originalPrice: 28.00,
      stock_quantity: 35,
      in_stock: true,
      description: "Temperature-controlled thermostat for engine cooling. Opens at 82°C for optimal engine temperature.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
      specifications: {
        "Opening Temp": "82°C",
        "Material": "Brass",
        "Type": "Wax",
        "Size": "M30x1.5"
      }
    },
    {
      id: "16",
      name: "COOLING FAN",
      sku: "FLS#：CF-001",
      catalogNumber: "CAT-016",
      category: "Cooling Parts",
      subcategory: "Cooling Fans",
      price: 55.00,
      originalPrice: 65.00,
      stock_quantity: 16,
      in_stock: true,
      description: "High-performance cooling fan for engine temperature control. Balanced design for smooth operation.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
      specifications: {
        "Diameter": "400mm",
        "Blades": "7",
        "Material": "Plastic",
        "Speed": "2000 RPM"
      }
    },
    {
      id: "17",
      name: "FUEL FILTER",
      sku: "FLS#：FF-001",
      catalogNumber: "CAT-017",
      category: "Filters",
      subcategory: "Fuel Filters",
      price: 28.00,
      originalPrice: 35.00,
      stock_quantity: 30,
      in_stock: true,
      description: "High-efficiency fuel filter for clean fuel delivery. Prevents injector clogging and engine damage.",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      specifications: {
        "Filtration": "5 microns",
        "Material": "Paper",
        "Capacity": "2L",
        "Connections": "M14x1.5"
      }
    },
    {
      id: "18",
      name: "HYDRAULIC FILTER",
      sku: "FLS#：HF-001",
      catalogNumber: "CAT-018",
      category: "Filters",
      subcategory: "Hydraulic Filters",
      price: 42.00,
      originalPrice: 50.00,
      stock_quantity: 18,
      in_stock: true,
      description: "High-pressure hydraulic filter for clean hydraulic oil. Extends pump and valve life.",
      image: "https://images.unsplash.com/photo-1558618047/3c8c76ca7d13?w=400&h=300&fit=crop",
      specifications: {
        "Filtration": "10 microns",
        "Pressure": "250 bar",
        "Flow": "40 L/min",
        "Material": "Steel"
      }
    },
    {
      id: "19",
      name: "CYLINDER HEAD",
      sku: "FLS#：CH-001",
      catalogNumber: "CAT-019",
      category: "Engine Parts",
      subcategory: "Cylinder Heads",
      price: 450.00,
      originalPrice: 520.00,
      stock_quantity: 3,
      in_stock: true,
      description: "Complete cylinder head assembly for engine rebuilds. Includes valves and springs.",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      specifications: {
        "Material": "Cast Iron",
        "Valves": "8",
        "Ports": "4",
        "Compression": "9.5:1"
      }
    },
    {
      id: "20",
      name: "VALVE SPRING SET",
      sku: "FLS#：VS-001",
      catalogNumber: "CAT-020",
      category: "Engine Parts",
      subcategory: "Valves & Springs",
      price: 35.00,
      originalPrice: 42.00,
      stock_quantity: 25,
      in_stock: true,
      description: "High-performance valve springs for engine valve control. Maintains proper valve timing.",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      specifications: {
        "Material": "Spring Steel",
        "Rate": "200 N/mm",
        "Height": "45mm",
        "Set": "8 springs"
      }
    },
    {
      id: "21",
      name: "DRIVE SHAFT",
      sku: "FLS#：DS-001",
      category: "Transmission Parts",
      subcategory: "Drive Shafts",
      price: 320.00,
      originalPrice: 380.00,
      stock_quantity: 5,
      in_stock: true,
      description: "Heavy-duty drive shaft for power transmission. Balanced design for smooth operation.",
      image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=400&h=300&fit=crop",
      specifications: {
        "Material": "Steel",
        "Length": "800mm",
        "Diameter": "50mm",
        "Balance": "G6.3"
      }
    },
    {
      id: "22",
      name: "TRANSMISSION CASE",
      sku: "FLS#：TC-001",
      category: "Transmission Parts",
      subcategory: "Transmission Cases",
      price: 580.00,
      originalPrice: 650.00,
      stock_quantity: 2,
      in_stock: true,
      description: "Complete transmission case for gearbox assembly. High-strength aluminum construction.",
      image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=400&h=300&fit=crop",
      specifications: {
        "Material": "Aluminum",
        "Weight": "25kg",
        "Gears": "5-speed",
        "Mounting": "Bolt-on"
      }
    },
    {
      id: "23",
      name: "HYDRAULIC HOSE",
      sku: "FLS#：HH-001",
      category: "Hydraulic Parts",
      subcategory: "Hydraulic Hoses",
      price: 18.00,
      originalPrice: 22.00,
      stock_quantity: 50,
      in_stock: true,
      description: "High-pressure hydraulic hose for fluid transfer. Reinforced construction for durability.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      specifications: {
        "Pressure": "250 bar",
        "Material": "Rubber/Steel",
        "Length": "1m",
        "Connections": "M16x1.5"
      }
    },
    {
      id: "24",
      name: "ELECTRIC FORKLIFT MOTOR",
      sku: "FLS#：EFM-001",
      category: "Forklift",
      subcategory: "Electric Forklifts",
      price: 1200.00,
      originalPrice: 1400.00,
      stock_quantity: 4,
      in_stock: true,
      description: "High-torque electric motor for forklift drive systems. Energy-efficient operation.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
      specifications: {
        "Power": "15kW",
        "Voltage": "48V",
        "Speed": "3000 RPM",
        "Efficiency": "95%"
      }
    },
    {
      id: "25",
      name: "DIESEL ENGINE BLOCK",
      sku: "FLS#：DEB-001",
      category: "Forklift",
      subcategory: "Diesel Forklifts",
      price: 2800.00,
      originalPrice: 3200.00,
      stock_quantity: 2,
      in_stock: true,
      description: "Complete diesel engine block for forklift applications. High-compression design.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
      specifications: {
        "Displacement": "2.5L",
        "Cylinders": "4",
        "Power": "45kW",
        "Material": "Cast Iron"
      }
    },
    {
      id: "26",
      name: "LPG CONVERSION KIT",
      sku: "FLS#：LCK-001",
      category: "Forklift",
      subcategory: "LPG Forklifts",
      price: 450.00,
      originalPrice: 520.00,
      stock_quantity: 8,
      in_stock: true,
      description: "Complete LPG conversion kit for forklift engines. Includes tank and regulator.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
      specifications: {
        "Tank Capacity": "20L",
        "Pressure": "2.5 bar",
        "Material": "Steel",
        "Certification": "CE"
      }
    },
    {
      id: "27",
      name: "WAREHOUSE FORKLIFT MAST",
      sku: "FLS#：WFM-001",
      category: "Forklift",
      subcategory: "Warehouse Forklifts",
      price: 850.00,
      originalPrice: 950.00,
      stock_quantity: 6,
      in_stock: true,
      description: "High-lift mast for warehouse forklifts. Telescopic design for maximum reach.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
      specifications: {
        "Lift Height": "6m",
        "Material": "Steel",
        "Sections": "3",
        "Capacity": "2.5 tons"
      }
    },
    {
      id: "28",
      name: "ELECTRICAL WIRING HARNESS",
      sku: "FLS#：EWH-001",
      category: "Electrical Parts",
      subcategory: "Wiring",
      price: 95.00,
      originalPrice: 110.00,
      stock_quantity: 12,
      in_stock: true,
      description: "Complete electrical wiring harness for forklift systems. Color-coded for easy installation.",
      image: "https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=400&h=300&fit=crop",
      specifications: {
        "Length": "5m",
        "Connectors": "20",
        "Gauge": "16 AWG",
        "Protection": "Heat-shrink"
      }
    },
    {
      id: "29",
      name: "BATTERY CHARGER",
      sku: "FLS#：BC-001",
      category: "Electrical Parts",
      subcategory: "Chargers",
      price: 180.00,
      originalPrice: 210.00,
      stock_quantity: 10,
      in_stock: true,
      description: "Smart battery charger for electric forklifts. Automatic charging with safety features.",
      image: "https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=400&h=300&fit=crop",
      specifications: {
        "Voltage": "48V",
        "Current": "20A",
        "Charging Time": "8 hours",
        "Protection": "Overcharge"
      }
    },
    {
      id: "30",
      name: "SENSOR ASSEMBLY",
      sku: "FLS#：SA-001",
      category: "Electrical Parts",
      subcategory: "Sensors",
      price: 65.00,
      originalPrice: 75.00,
      stock_quantity: 25,
      in_stock: true,
      description: "Multi-function sensor assembly for forklift monitoring systems. Includes temperature and pressure sensors.",
      image: "https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=400&h=300&fit=crop",
      specifications: {
        "Sensors": "3",
        "Output": "4-20mA",
        "Accuracy": "±1%",
        "Temperature": "-40°C to +85°C"
      }
    }
  ],

  // Hot products
  hotProducts: [
    {
      id: 1,
      name: "FORWARD and REVERSE SWITCH",
      code: "FLS#：A-LB32-101A-0479A",
      catalogNumber: "CAT-001",
      category: "Electrical Parts",
      image: "https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=300&h=200&fit=crop",
      price: "$45.00",
      inStock: true,
      stock_quantity: 15,
      in_stock: true
    },
    {
      id: 2,
      name: "COMBINATION SWITCH",
      code: "FLS#：A-LB31-912B-0377A",
      catalogNumber: "CAT-002",
      category: "Electrical Parts",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop",
      price: "$38.50",
      inStock: true,
      stock_quantity: 8,
      in_stock: true
    },
    {
      id: 3,
      name: "COMBINATION SWITCH",
      code: "FLS#：A-LB31-912A-0377A",
      catalogNumber: "CAT-003",
      category: "Electrical Parts",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=200&fit=crop",
      price: "$42.00",
      inStock: true,
      stock_quantity: 5,
      in_stock: true
    }
  ],

  // Users for admin panel
  users: [
    {
      id: "1",
      first_name: "Admin",
      last_name: "User",
      email: "admin@bilal-parts.com",
      phone: "+1234567890",
      role: "admin",
      is_active: true,
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      phone: "+1234567891",
      role: "user",
      is_active: true,
      created_at: "2024-01-15T00:00:00Z"
    },
    {
      id: "3",
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
      phone: "+1234567892",
      role: "user",
      is_active: false,
      created_at: "2024-02-01T00:00:00Z"
    }
  ],

  // Orders for admin panel
  orders: [
    {
      id: "1",
      user_id: "2",
      items: [
        { product_id: "1", quantity: 2, price: 45.00 }
      ],
      total_amount: 90.00,
      status: "pending",
      created_at: "2024-03-01T00:00:00Z"
    },
    {
      id: "2",
      user_id: "3",
      items: [
        { product_id: "2", quantity: 1, price: 38.50 }
      ],
      total_amount: 38.50,
      status: "delivered",
      created_at: "2024-02-28T00:00:00Z"
    }
  ],

  // Contact messages for admin panel
  contactMessages: [
    {
      id: "1",
      name: "Ahmed Ali",
      email: "ahmed@example.com",
      message: "I need information about forklift parts availability.",
      is_read: false,
      created_at: "2024-03-01T10:00:00Z"
    },
    {
      id: "2",
      name: "Maria Garcia",
      email: "maria@example.com",
      message: "Can you provide a quote for bulk orders?",
      is_read: true,
      created_at: "2024-02-28T14:30:00Z"
    }
  ],

  // Newsletter subscribers for admin panel
  newsletterSubscribers: [
    {
      id: "1",
      email: "subscriber1@example.com",
      subscribed_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      email: "subscriber2@example.com",
      subscribed_at: "2024-01-15T00:00:00Z"
    }
  ],

  // News articles
  news: [
    {
      id: 1,
      date: "04-23",
      title: "Folangsi Co., Ltd. participated in the 137th Canton Fair",
      excerpt: "On April 15, 2025, the 137th China Import and Export Fair (Canton Fair) opened grandly in Guangzhou...",
      category: "Company News",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      date: "03-22",
      title: "Charming Phuket,Encountering a Tropical Paradise--2025 Folangsi International Business Center Phuket Tour",
      excerpt: "One person can walk fast,two people can walk leisurely,but a group of people can go further...",
      category: "Company Trip",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      date: "01-14",
      title: "Striving for the forefront and taking advantage of the momentum - Folangsi 2024 summary",
      excerpt: "On January 11, 2025, the 2024 Summary and Commendation Meeting of Folangsi Co., Ltd...",
      category: "Company Events",
      image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=400&h=250&fit=crop"
    }
  ],

  // Company highlights
  highlights: [
    {
      icon: "package",
      title: "More than 3000000 forklift parts in stock",
      description: "Our large inventory can ensure a short delivery time for each part or accessory you need."
    },
    {
      icon: "award",
      title: "21 years of experience in forklift industry",
      description: "Our strong technical research and development team can guarantee the continuous updating of parts."
    },
    {
      icon: "clock",
      title: "Easily search for parts online 24 hours a day",
      description: "All our products carefully selected from the best manufacturers with a second-quality inspection before shipment."
    }
  ],

  // Languages supported
  languages: [
    "English", "中文", "Русский язык", "español", "Português", 
    "بالعربية", "Français", "Deutsch", "日本語", "Italiano", 
    "हिंदी", "Türkçe", "한국어", "ภาษาไทย", "Tiếng Việt"
  ]
};

export default mockData;