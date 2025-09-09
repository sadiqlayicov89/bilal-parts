const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fvnelgjpptwteiesonhg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bmVsZ2pwcHR3dGVpZXNvbmg2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5ODc0OTAsImV4cCI6MjA1MDU2MzQ5MH0.8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K';

const supabase = createClient(supabaseUrl, supabaseKey);

// Real categories with subcategories
const categories = [
  {
    name: "Forklift Parts",
    slug: "forklift-parts",
    description: "Complete range of forklift parts and components",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Electric Forklifts", slug: "electric-forklifts", description: "Electric forklift components and parts" },
      { name: "Diesel Forklifts", slug: "diesel-forklifts", description: "Diesel forklift components and parts" },
      { name: "LPG Forklifts", slug: "lpg-forklifts", description: "LPG forklift components and parts" },
      { name: "Warehouse Forklifts", slug: "warehouse-forklifts", description: "Warehouse forklift components and parts" }
    ]
  },
  {
    name: "Engine Parts",
    slug: "engine-parts",
    description: "Engine components and parts for all vehicle types",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Pistons & Rings", slug: "pistons-rings", description: "Pistons and piston rings" },
      { name: "Crankshafts", slug: "crankshafts", description: "Engine crankshafts" },
      { name: "Cylinder Heads", slug: "cylinder-heads", description: "Cylinder head components" },
      { name: "Valves & Springs", slug: "valves-springs", description: "Engine valves and springs" }
    ]
  },
  {
    name: "Transmission",
    slug: "transmission",
    description: "Transmission system components",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Gearboxes", slug: "gearboxes", description: "Manual and automatic gearboxes" },
      { name: "Clutches", slug: "clutches", description: "Clutch components" },
      { name: "Differentials", slug: "differentials", description: "Differential components" },
      { name: "Drive Shafts", slug: "drive-shafts", description: "Drive shaft components" }
    ]
  },
  {
    name: "Brake System",
    slug: "brake-system",
    description: "Brake system components and parts",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Brake Pads", slug: "brake-pads", description: "Brake pad sets" },
      { name: "Brake Discs", slug: "brake-discs", description: "Brake discs and rotors" },
      { name: "Brake Calipers", slug: "brake-calipers", description: "Brake caliper components" },
      { name: "Brake Lines", slug: "brake-lines", description: "Brake lines and hoses" }
    ]
  },
  {
    name: "Electrical",
    slug: "electrical",
    description: "Electrical components and systems",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Batteries", slug: "batteries", description: "Vehicle batteries" },
      { name: "Alternators", slug: "alternators", description: "Alternator components" },
      { name: "Starters", slug: "starters", description: "Starter motor components" },
      { name: "Wiring", slug: "wiring", description: "Electrical wiring and harnesses" }
    ]
  },
  {
    name: "Filters",
    slug: "filters",
    description: "Air, oil, and fuel filters",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Air Filters", slug: "air-filters", description: "Engine air filters" },
      { name: "Oil Filters", slug: "oil-filters", description: "Engine oil filters" },
      { name: "Fuel Filters", slug: "fuel-filters", description: "Fuel system filters" },
      { name: "Hydraulic Filters", slug: "hydraulic-filters", description: "Hydraulic system filters" }
    ]
  },
  {
    name: "Hydraulic Parts",
    slug: "hydraulic-parts",
    description: "Hydraulic system components",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Hydraulic Pumps", slug: "hydraulic-pumps", description: "Hydraulic pump components" },
      { name: "Hydraulic Cylinders", slug: "hydraulic-cylinders", description: "Hydraulic cylinder components" },
      { name: "Control Valves", slug: "control-valves", description: "Hydraulic control valves" },
      { name: "Hydraulic Hoses", slug: "hydraulic-hoses", description: "Hydraulic hose components" }
    ]
  },
  {
    name: "Cooling System",
    slug: "cooling-system",
    description: "Cooling system components",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Radiators", slug: "radiators", description: "Cooling radiators" },
      { name: "Water Pumps", slug: "water-pumps", description: "Water pump components" },
      { name: "Thermostats", slug: "thermostats", description: "Thermostat components" },
      { name: "Cooling Fans", slug: "cooling-fans", description: "Cooling fan components" }
    ]
  },
  {
    name: "Suspension",
    slug: "suspension",
    description: "Suspension system components",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Shock Absorbers", slug: "shock-absorbers", description: "Shock absorber components" },
      { name: "Springs", slug: "springs", description: "Suspension springs" },
      { name: "Control Arms", slug: "control-arms", description: "Control arm components" },
      { name: "Bushings", slug: "bushings", description: "Suspension bushings" }
    ]
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Vehicle accessories and tools",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    subcategories: [
      { name: "Tools", slug: "tools", description: "Vehicle maintenance tools" },
      { name: "Lubricants", slug: "lubricants", description: "Lubricants and oils" },
      { name: "Safety Equipment", slug: "safety-equipment", description: "Safety equipment and gear" },
      { name: "Cleaning Supplies", slug: "cleaning-supplies", description: "Vehicle cleaning supplies" }
    ]
  }
];

async function createCategories() {
  try {
    console.log('Starting category creation...');
    
    // First, clear existing categories
    console.log('Clearing existing categories...');
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('Error clearing categories:', deleteError);
    } else {
      console.log('Existing categories cleared successfully');
    }
    
    // Create main categories
    for (const category of categories) {
      console.log(`Creating main category: ${category.name}`);
      
      const { data: mainCategory, error: mainError } = await supabase
        .from('categories')
        .insert([{
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          parent_id: null,
          is_active: true,
          sort_order: categories.indexOf(category) + 1
        }])
        .select()
        .single();
      
      if (mainError) {
        console.error(`Error creating main category ${category.name}:`, mainError);
        continue;
      }
      
      console.log(`Main category created: ${mainCategory.name} (ID: ${mainCategory.id})`);
      
      // Create subcategories
      for (const subcategory of category.subcategories) {
        console.log(`Creating subcategory: ${subcategory.name}`);
        
        const { data: subCategory, error: subError } = await supabase
          .from('categories')
          .insert([{
            name: subcategory.name,
            slug: subcategory.slug,
            description: subcategory.description,
            image: category.image, // Use parent category image
            parent_id: mainCategory.id,
            is_active: true,
            sort_order: category.subcategories.indexOf(subcategory) + 1
          }])
          .select()
          .single();
        
        if (subError) {
          console.error(`Error creating subcategory ${subcategory.name}:`, subError);
        } else {
          console.log(`Subcategory created: ${subCategory.name} (ID: ${subCategory.id})`);
        }
      }
    }
    
    console.log('Category creation completed!');
    
    // Verify categories
    const { data: allCategories, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    
    if (fetchError) {
      console.error('Error fetching categories:', fetchError);
    } else {
      console.log(`Total categories created: ${allCategories.length}`);
      console.log('Categories:', allCategories.map(c => `${c.name} (${c.parent_id ? 'Sub' : 'Main'})`));
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the script
createCategories();
