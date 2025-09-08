const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@bilal-parts.com' },
      update: {},
      create: {
        email: 'admin@bilal-parts.com',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        phone: '+1234567890',
        role: 'ADMIN',
        status: 'ACTIVE',
        is_active: true,
        email_verified: true,
        discount: 0
      }
    });

    console.log('✅ Admin user created:', adminUser.email);

    // Create test customer
    const customerPassword = await bcrypt.hash('customer123', 12);
    
    const customerUser = await prisma.user.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: {
        email: 'customer@example.com',
        password: customerPassword,
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567891',
        company_name: 'Test Company',
        country: 'United States',
        city: 'New York',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        is_active: true,
        email_verified: true,
        discount: 5
      }
    });

    console.log('✅ Customer user created:', customerUser.email);

    // Create categories
    const categories = [
      {
        name: 'Forklift',
        slug: 'forklift',
        description: 'Complete forklifts and forklift solutions',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'
      },
      {
        name: 'Engine Parts',
        slug: 'engine-parts',
        description: 'High-quality engine components',
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop'
      },
      {
        name: 'Cooling Parts',
        slug: 'cooling-parts',
        description: 'Radiators and cooling systems',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
      },
      {
        name: 'Filters',
        slug: 'filters',
        description: 'Air, oil, fuel, and hydraulic filters',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
      },
      {
        name: 'Transmission Parts',
        slug: 'transmission-parts',
        description: 'Transmission components and solutions',
        image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=400&h=300&fit=crop'
      },
      {
        name: 'Hydraulic Parts',
        slug: 'hydraulic-parts',
        description: 'Hydraulic pumps and cylinders',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        name: 'Electrical Parts',
        slug: 'electrical-parts',
        description: 'Electrical components and systems',
        image: 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=400&h=300&fit=crop'
      }
    ];

    const createdCategories = [];
    for (const categoryData of categories) {
      const category = await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: {},
        create: categoryData
      });
      createdCategories.push(category);
      console.log('✅ Category created:', category.name);
    }

    // Create subcategories
    const subcategories = [
      // Forklift subcategories
      { name: 'Electric Forklifts', slug: 'electric-forklifts', parentSlug: 'forklift' },
      { name: 'Diesel Forklifts', slug: 'diesel-forklifts', parentSlug: 'forklift' },
      { name: 'LPG Forklifts', slug: 'lpg-forklifts', parentSlug: 'forklift' },
      { name: 'Warehouse Forklifts', slug: 'warehouse-forklifts', parentSlug: 'forklift' },
      
      // Engine Parts subcategories
      { name: 'Pistons & Rings', slug: 'pistons-rings', parentSlug: 'engine-parts' },
      { name: 'Crankshafts', slug: 'crankshafts', parentSlug: 'engine-parts' },
      { name: 'Cylinder Heads', slug: 'cylinder-heads', parentSlug: 'engine-parts' },
      { name: 'Valves & Springs', slug: 'valves-springs', parentSlug: 'engine-parts' },
      
      // Cooling Parts subcategories
      { name: 'Radiators', slug: 'radiators', parentSlug: 'cooling-parts' },
      { name: 'Water Pumps', slug: 'water-pumps', parentSlug: 'cooling-parts' },
      { name: 'Thermostats', slug: 'thermostats', parentSlug: 'cooling-parts' },
      { name: 'Cooling Fans', slug: 'cooling-fans', parentSlug: 'cooling-parts' },
      
      // Filters subcategories
      { name: 'Air Filters', slug: 'air-filters', parentSlug: 'filters' },
      { name: 'Oil Filters', slug: 'oil-filters', parentSlug: 'filters' },
      { name: 'Fuel Filters', slug: 'fuel-filters', parentSlug: 'filters' },
      { name: 'Hydraulic Filters', slug: 'hydraulic-filters', parentSlug: 'filters' },
      
      // Transmission Parts subcategories
      { name: 'Gears', slug: 'gears', parentSlug: 'transmission-parts' },
      { name: 'Clutches', slug: 'clutches', parentSlug: 'transmission-parts' },
      { name: 'Drive Shafts', slug: 'drive-shafts', parentSlug: 'transmission-parts' },
      { name: 'Transmission Cases', slug: 'transmission-cases', parentSlug: 'transmission-parts' },
      
      // Hydraulic Parts subcategories
      { name: 'Hydraulic Pumps', slug: 'hydraulic-pumps', parentSlug: 'hydraulic-parts' },
      { name: 'Hydraulic Cylinders', slug: 'hydraulic-cylinders', parentSlug: 'hydraulic-parts' },
      { name: 'Control Valves', slug: 'control-valves', parentSlug: 'hydraulic-parts' },
      { name: 'Hydraulic Hoses', slug: 'hydraulic-hoses', parentSlug: 'hydraulic-parts' },
      
      // Electrical Parts subcategories
      { name: 'Switches', slug: 'switches', parentSlug: 'electrical-parts' },
      { name: 'Wiring', slug: 'wiring', parentSlug: 'electrical-parts' },
      { name: 'Chargers', slug: 'chargers', parentSlug: 'electrical-parts' },
      { name: 'Sensors', slug: 'sensors', parentSlug: 'electrical-parts' }
    ];

    for (const subcatData of subcategories) {
      const parentCategory = createdCategories.find(cat => cat.slug === subcatData.parentSlug);
      if (parentCategory) {
        const subcategory = await prisma.category.upsert({
          where: { slug: subcatData.slug },
          update: {},
          create: {
            name: subcatData.name,
            slug: subcatData.slug,
            description: `${subcatData.name} for ${parentCategory.name}`,
            parent_id: parentCategory.id
          }
        });
        console.log('✅ Subcategory created:', subcategory.name);
      }
    }

    // Create sample products
    const products = [
      {
        name: 'FORWARD and REVERSE SWITCH',
        sku: 'FLS#：A-LB32-101A-0479A',
        catalog_number: 'CAT-001',
        category: 'Electrical Parts',
        subcategory: 'Switches',
        price: 45.00,
        original_price: 55.00,
        stock_quantity: 15,
        description: 'High-quality forward and reverse switch for forklift control systems. Features durable construction and reliable performance.',
        image: 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=400&h=300&fit=crop'
      },
      {
        name: 'COMBINATION SWITCH',
        sku: 'FLS#：A-LB31-912B-0377A',
        catalog_number: 'CAT-002',
        category: 'Electrical Parts',
        subcategory: 'Switches',
        price: 38.50,
        original_price: 48.00,
        stock_quantity: 8,
        description: 'Multi-function combination switch for forklift lighting and control systems. Includes turn signals, wipers, and horn controls.',
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop'
      },
      {
        name: 'HYDRAULIC PUMP ASSEMBLY',
        sku: 'FLS#：HP-001',
        catalog_number: 'CAT-003',
        category: 'Hydraulic Parts',
        subcategory: 'Hydraulic Pumps',
        price: 150.00,
        original_price: 180.00,
        stock_quantity: 3,
        description: 'Complete hydraulic pump assembly for forklift lifting systems. High-pressure performance with excellent reliability.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        name: 'ENGINE AIR FILTER',
        sku: 'FLS#：AF-001',
        catalog_number: 'CAT-005',
        category: 'Filters',
        subcategory: 'Air Filters',
        price: 18.50,
        original_price: 22.00,
        stock_quantity: 25,
        description: 'High-efficiency air filter for forklift engines. Provides excellent filtration and extended engine life.',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'
      },
      {
        name: 'WATER PUMP ASSEMBLY',
        sku: 'FLS#：WP-001',
        catalog_number: 'CAT-007',
        category: 'Cooling Parts',
        subcategory: 'Water Pumps',
        price: 85.00,
        original_price: 95.00,
        stock_quantity: 12,
        description: 'Complete water pump assembly for engine cooling systems. High-flow design for optimal heat dissipation.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
      }
    ];

    for (const productData of products) {
      const category = createdCategories.find(cat => cat.name === productData.category);
      const subcategory = await prisma.category.findFirst({
        where: { name: productData.subcategory }
      });

      if (category) {
        const product = await prisma.product.upsert({
          where: { sku: productData.sku },
          update: {},
          create: {
            name: productData.name,
            sku: productData.sku,
            catalog_number: productData.catalog_number,
            description: productData.description,
            price: productData.price,
            original_price: productData.original_price,
            stock_quantity: productData.stock_quantity,
            category_id: category.id,
            subcategory_id: subcategory?.id,
            in_stock: productData.stock_quantity > 0,
            is_active: true
          }
        });

        // Create product image
        await prisma.productImage.upsert({
          where: { 
            product_id_image_url: {
              product_id: product.id,
              image_url: productData.image
            }
          },
          update: {},
          create: {
            product_id: product.id,
            image_url: productData.image,
            alt_text: productData.name,
            is_primary: true
          }
        });

        console.log('✅ Product created:', product.name);
      }
    }

    // Create company info
    await prisma.companyInfo.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        name: 'BILAL-PARTS CO.,LTD',
        chinese_name: 'Premium Parts & Accessories',
        stock_code: '02499. HK',
        established: '2007',
        headquarters: 'Guangzhou, China',
        outlets: '100+',
        countries: '150+',
        parts_in_stock: '3,000,000+',
        experience: '21 years',
        email: 'admin@bilal-parts.com',
        phone: '0086-18520438258',
        fax: '0086-20-3999 3597',
        address: 'No. 999,Asian Games Avenue,Shiqi Town,Panyu District,Guangzhou,China.'
      }
    });

    console.log('✅ Company info created');

    // Create sample news articles
    const newsArticles = [
      {
        title: 'Folangsi Co., Ltd. participated in the 137th Canton Fair',
        slug: 'canton-fair-137th',
        excerpt: 'On April 15, 2025, the 137th China Import and Export Fair (Canton Fair) opened grandly in Guangzhou...',
        content: 'On April 15, 2025, the 137th China Import and Export Fair (Canton Fair) opened grandly in Guangzhou. As a leading company in the forklift parts industry, Folangsi Co., Ltd. actively participated in this international trade event, showcasing our latest products and technologies.',
        category: 'Company News',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop',
        is_published: true,
        published_at: new Date('2024-04-23')
      },
      {
        title: 'Charming Phuket, Encountering a Tropical Paradise',
        slug: 'phuket-business-tour-2025',
        excerpt: 'One person can walk fast, two people can walk leisurely, but a group of people can go further...',
        content: 'One person can walk fast, two people can walk leisurely, but a group of people can go further. In 2025, our international business center organized a memorable team building trip to Phuket, Thailand, strengthening our team bonds and exploring new business opportunities.',
        category: 'Company Trip',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop',
        is_published: true,
        published_at: new Date('2024-03-22')
      }
    ];

    for (const articleData of newsArticles) {
      await prisma.newsArticle.upsert({
        where: { slug: articleData.slug },
        update: {},
        create: articleData
      });
      console.log('✅ News article created:', articleData.title);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@bilal-parts.com / admin123');
    console.log('Customer: customer@example.com / customer123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
