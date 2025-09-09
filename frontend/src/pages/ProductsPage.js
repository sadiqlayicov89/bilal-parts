import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import { mockData } from "../data/mockData";
import SupabaseService from "../services/supabaseService";

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  // console.log('=== PRODUCTS PAGE MOUNTED ==='); // Commented out to reduce console spam
  // console.log('Initial URL:', window.location.href); // Commented out to reduce console spam
  // console.log('Location pathname:', location.pathname); // Commented out to reduce console spam
  // console.log('Location search:', location.search); // Commented out to reduce console spam
  
  // Parse URL parameters manually to avoid useSearchParams re-renders
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(location.search);
    return {
      search: urlParams.get("search") || "",
      category: urlParams.get("category") || "",
      subcategory: urlParams.get("subcategory") || "",
      page: urlParams.get("page") || "1"
    };
  };
  
  const [searchQuery, setSearchQuery] = useState(getUrlParams().search);
  const [searchInput, setSearchInput] = useState(getUrlParams().search); // Local input state
  const [selectedCategory, setSelectedCategory] = useState(getUrlParams().category);
  const [selectedSubcategory, setSelectedSubcategory] = useState(getUrlParams().subcategory);
  const [currentPage, setCurrentPage] = useState(parseInt(getUrlParams().page) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  // console.log('Initial state values:', {
  //   searchQuery: getUrlParams().search,
  //   selectedCategory: getUrlParams().category,
  //   selectedSubcategory: getUrlParams().subcategory,
  //   currentPage: parseInt(getUrlParams().page) || 1
  // });

  // Handle product ID parameter
  useEffect(() => {
    if (id) {
      const product = mockData.products.find(p => p.id.toString() === id);
      if (product) {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
      } else {
        // Product not found, redirect to products page
        navigate('/products');
      }
    }
  }, [id, navigate]);

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Listen for location changes (URL navigation from header)
  useEffect(() => {
    // console.log('=== LOCATION CHANGED ==='); // Commented out to reduce console spam
    // console.log('New location:', location.pathname + location.search); // Commented out to reduce console spam
    // console.log('New URL:', window.location.href); // Commented out to reduce console spam
    
    const urlParams = getUrlParams();
    // console.log('URL parameters from location:', urlParams); // Commented out to reduce console spam
    
    // Update state if URL parameters changed
    if (urlParams.category !== selectedCategory) {
      // console.log('Category changed in URL, updating state:', urlParams.category); // Commented out to reduce console spam
      setSelectedCategory(urlParams.category);
    }
    
    if (urlParams.subcategory !== selectedSubcategory) {
      // console.log('Subcategory changed in URL, updating state:', urlParams.subcategory); // Commented out to reduce console spam
      setSelectedSubcategory(urlParams.subcategory);
    }
    
    // Only update search query from URL if user is not currently typing
    if (urlParams.search !== searchQuery && document.activeElement?.type !== 'text') {
      setSearchQuery(urlParams.search);
      setSearchInput(urlParams.search); // Also update input state
    }
    
    // Update page if changed
    if (urlParams.page !== currentPage.toString()) {
      const pageNum = parseInt(urlParams.page);
      if (pageNum >= 1) {
        // console.log('Page changed in URL, updating state:', pageNum); // Commented out to reduce console spam
        setCurrentPage(pageNum);
      }
    }
  }, [location.search]); // Only depend on location.search to avoid loops

  // Debug: Log selected category and subcategory changes
  // useEffect(() => {
  //   console.log('Selected category changed:', selectedCategory);
  // }, [selectedCategory]);

  // useEffect(() => {
  //   console.log('Selected subcategory changed:', selectedSubcategory);
  // }, [selectedSubcategory]);

    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("name");
   
  // Pagination states
  const [productsPerPage, setProductsPerPage] = useState(12);
  
  // Update URL when filters change (using navigate to avoid re-renders)
  useEffect(() => {
    const currentParams = getUrlParams();
    
    // Only update URL if the values are actually different
    if (currentParams.category !== selectedCategory || 
        currentParams.subcategory !== selectedSubcategory || 
        currentParams.search !== searchQuery) {
      
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedSubcategory) params.set("subcategory", selectedSubcategory);
      if (priceRange.min) params.set("minPrice", priceRange.min);
      if (priceRange.max) params.set("maxPrice", priceRange.max);
      if (sortBy !== "name") params.set("sort", sortBy);
      
             // console.log('Updating URL with params:', { // Commented out to reduce console spam
       //   search: searchQuery,
       //   category: selectedCategory,
       //   subcategory: selectedSubcategory,
       //   minPrice: priceRange.min,
       //   maxPrice: priceRange.max,
       //   sort: sortBy
       // });
      
      // Use navigate instead of setSearchParams to avoid re-renders
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [searchQuery, selectedCategory, selectedSubcategory, priceRange, sortBy, navigate, location.pathname]);
  
  // Update URL when page changes
  useEffect(() => {
    const currentParams = getUrlParams();
    const currentPageFromURL = parseInt(currentParams.page) || 1;
    
    if (currentPage !== currentPageFromURL) {
      const params = new URLSearchParams(location.search);
      if (currentPage > 1) {
        params.set("page", currentPage.toString());
      } else {
        params.delete("page");
      }
      
             // console.log('Updating page in URL:', currentPage); // Commented out to reduce console spam
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [currentPage, navigate, location.pathname, location.search]);
  
  // Initialize filters and page from URL on mount
  useEffect(() => {
         try {
       // console.log('=== INITIALIZING FROM URL ==='); // Commented out to reduce console spam
       // console.log('Current URL:', window.location.href); // Commented out to reduce console spam
       
       const urlParams = getUrlParams();
       // console.log('URL parameters:', urlParams); // Commented out to reduce console spam
       
       // Set category filter from URL
       if (urlParams.category) {
         // console.log('Setting category from URL:', urlParams.category); // Commented out to reduce console spam
         setSelectedCategory(urlParams.category);
       } else {
         // console.log('No category found in URL'); // Commented out to reduce console spam
       }
       
       // Set subcategory filter from URL
       if (urlParams.subcategory) {
         // console.log('Setting subcategory from URL:', urlParams.subcategory); // Commented out to reduce console spam
         setSelectedSubcategory(urlParams.subcategory);
       } else {
         // console.log('No subcategory found in URL'); // Commented out to reduce console spam
       }
       
       // Set page from URL
       if (urlParams.page && !isNaN(parseInt(urlParams.page))) {
         const pageNum = parseInt(urlParams.page);
         if (pageNum >= 1) {
           setCurrentPage(pageNum);
         }
       }
       
       // console.log('URL initialization completed'); // Commented out to reduce console spam
     } catch (error) {
       console.error('Error initializing from URL:', error);
     }
  }, []); // Empty dependency array - only run once on mount

  // Default categories
  const defaultCategories = [
    {
      name: "Forklift",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
      description: "Complete forklifts and forklift solutions for all industrial needs",
      subcategories: [
        { name: "Electric Forklifts" },
        { name: "Diesel Forklifts" },
        { name: "LPG Forklifts" },
        { name: "Warehouse Forklifts" }
      ]
    },
    {
      name: "Engine Parts",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      description: "High-quality engine components and replacement parts",
      subcategories: [
        { name: "Pistons & Rings" },
        { name: "Crankshafts" },
        { name: "Cylinder Heads" },
        { name: "Valves & Springs" }
      ]
    },
    {
      name: "Cooling Parts",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
      description: "Radiators, cooling fans, and thermal management systems",
      subcategories: [
        { name: "Radiators" },
        { name: "Water Pumps" },
        { name: "Thermostats" },
        { name: "Cooling Fans" }
      ]
    },
    {
      name: "Filters",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      description: "Air, oil, fuel, and hydraulic filters for optimal performance",
      subcategories: [
        { name: "Air Filters" },
        { name: "Oil Filters" },
        { name: "Fuel Filters" },
        { name: "Hydraulic Filters" }
      ]
    },
    {
      name: "Transmission Parts",
      image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=400&h=300&fit=crop",
      description: "Transmission components and drive train solutions",
      subcategories: [
        { name: "Gears" },
        { name: "Clutches" },
        { name: "Drive Shafts" },
        { name: "Transmission Cases" }
      ]
    },
    {
      name: "Hydraulic Parts",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      description: "Hydraulic pumps, cylinders, and fluid power components",
      subcategories: [
        { name: "Hydraulic Pumps" },
        { name: "Hydraulic Cylinders" },
        { name: "Control Valves" },
        { name: "Hydraulic Hoses" }
      ]
    }
  ];

  const [categories, setCategories] = useState(defaultCategories);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load categories from Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const supabaseCategories = await SupabaseService.getCategories();
        if (supabaseCategories && supabaseCategories.length > 0) {
          // Convert Supabase categories to the format expected by the UI
          const formattedCategories = supabaseCategories
            .filter(cat => cat.parent_id === null) // Only main categories
            .map(mainCat => {
              const subcategories = supabaseCategories
                .filter(sub => sub.parent_id === mainCat.id)
                .map(sub => ({ name: sub.name }));
              
              return {
                name: mainCat.name,
                image: mainCat.image || mainCat.image_url || "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
                description: mainCat.description || "",
                subcategories: subcategories
              };
            });
          
          setCategories(formattedCategories);
          console.log('Categories loaded from Supabase:', formattedCategories);
        } else {
          console.log('No categories found in Supabase, using default categories');
        }
      } catch (error) {
        console.error('Error loading categories from Supabase:', error);
        console.log('Using default categories as fallback');
      }
    };

    loadCategories();
  }, []);

  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const supabaseProducts = await SupabaseService.getProducts();
        
        if (supabaseProducts && supabaseProducts.length > 0) {
          // Format products for the frontend
          const formattedProducts = supabaseProducts.map(product => ({
            id: product.id,
            name: product.name,
            sku: product.sku,
            catalogNumber: product.catalog_number,
            price: parseFloat(product.price) || 0,
            originalPrice: parseFloat(product.original_price) || parseFloat(product.price) || 0,
            description: product.description || '',
            shortDescription: product.short_description || '',
            category: product.categories?.name || product.category || 'Unknown',
            subcategory: product.subcategories?.name || product.subcategory || '',
            images: product.product_images ? product.product_images.map(img => img.image_url) : [],
            image: product.product_images && product.product_images.length > 0 
              ? product.product_images[0].image_url 
              : 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=300&h=200&fit=crop',
            in_stock: product.in_stock,
            stock_quantity: product.stock_quantity || 0,
            brand: product.brand || '',
            model: product.model || '',
            year: product.year || null,
            weight: product.weight || null,
            dimensions: product.dimensions || '',
            specifications: product.product_specifications ? 
              product.product_specifications.reduce((acc, spec) => {
                acc[spec.name] = spec.value;
                return acc;
              }, {}) : {}
          }));
          console.log('Formatted products:', formattedProducts);
          console.log('Formatted products count:', formattedProducts.length);
          console.log('First product sample:', formattedProducts[0]);
          setProducts(formattedProducts);
        } else {
          // Fallback to localStorage or mockData
          const savedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
          const sourceProducts = savedProducts.length > 0 ? savedProducts : mockData.products;
          setProducts(sourceProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to localStorage or mockData
        const savedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        const sourceProducts = savedProducts.length > 0 ? savedProducts : mockData.products;
        setProducts(sourceProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Debug: Log categories state changes
  // useEffect(() => {
  //   console.log('Categories state updated:', categories);
  // }, [categories]);

  // Load categories from localStorage (admin panel categories)
  useEffect(() => {
    const loadCategories = () => {
      try {
        // console.log('Loading categories...'); // Commented out to reduce console spam
        const savedCategories = localStorage.getItem('adminCategories');
        if (savedCategories) {
          const adminCategories = JSON.parse(savedCategories);
          // console.log('Admin categories from localStorage:', adminCategories); // Commented out to reduce console spam
          
          // Convert admin categories format to products page format
          const convertedCategories = adminCategories.map(cat => {
            const existingCategory = defaultCategories.find(c => c.name === cat.name);
            return {
              name: cat.name,
              image: existingCategory?.image || "https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=400&h=300&fit=crop",
              description: cat.description || existingCategory?.description || `${cat.name} components and parts`,
              subcategories: cat.subcategories ? cat.subcategories.map(sub => ({ name: sub.name })) : []
            };
          });
          
          // Merge with default categories to ensure all are available
          const mergedCategories = [...defaultCategories];
          
          // Add admin categories that don't exist in defaults
          adminCategories.forEach(adminCat => {
            const exists = mergedCategories.find(cat => cat.name === adminCat.name);
            if (!exists) {
              mergedCategories.push({
                name: adminCat.name,
                image: "https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=400&h=300&fit=crop",
                description: adminCat.description || `${adminCat.name} components and parts`,
                subcategories: adminCat.subcategories ? adminCat.subcategories.map(sub => ({ name: sub.name })) : []
              });
            }
          });
          
          // console.log('Categories loaded:', mergedCategories); // Commented out to reduce console spam
          setCategories(mergedCategories);
        } else {
          // console.log('No admin categories found in localStorage, using defaults'); // Commented out to reduce console spam
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error('Failed to load categories from localStorage:', error);
        // console.log('Falling back to default categories'); // Commented out to reduce console spam
        setCategories(defaultCategories);
      }
    };

    // Load categories on component mount
    loadCategories();

    // Listen for storage changes (when admin panel updates categories)
    const handleStorageChange = (e) => {
      if (e.key === 'adminCategories') {
        loadCategories();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event (for same-tab updates)
    window.addEventListener('categoriesUpdated', loadCategories);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('categoriesUpdated', loadCategories);
    };
  }, []); // Remove categories dependency to avoid infinite loop

  // Debounce search input to avoid too many updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput);
        setCurrentPage(1); // Reset to first page when searching
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery]);

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    try {
      // console.log('=== CATEGORY CHANGE ==='); // Commented out to reduce console spam
      // console.log('Previous category:', selectedCategory); // Commented out to reduce console spam
      // console.log('New category:', category); // Commented out to reduce console spam
      // console.log('Resetting subcategory and page...'); // Commented out to reduce console spam
      
      setSelectedCategory(category);
      setSelectedSubcategory(""); // Reset subcategory when category changes
      setCurrentPage(1); // Reset to first page when category changes
      
      // console.log('Category change completed'); // Commented out to reduce console spam
    } catch (error) {
      console.error('Error changing category:', error);
    }
  };

  // Handle subcategory change
  const handleSubcategoryChange = (subcategory) => {
    try {
      // console.log('=== SUBCATEGORY CHANGE ==='); // Commented out to reduce console spam
      // console.log('Previous subcategory:', selectedSubcategory); // Commented out to reduce console spam
      // console.log('New subcategory:', subcategory); // Commented out to reduce console spam
      // console.log('Current category:', selectedCategory); // Commented out to reduce console spam
      // console.log('Resetting page...'); // Commented out to reduce console spam
      
      setSelectedSubcategory(subcategory);
      setCurrentPage(1); // Reset to first page when subcategory changes
      
      // console.log('Subcategory change completed'); // Commented out to reduce console spam
    } catch (error) {
      console.error('Error changing subcategory:', error);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSearchInput(""); // Clear input state too
    setSelectedCategory("");
    setSelectedSubcategory("");
    setPriceRange({ min: "", max: "" });
    setSortBy("name");
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Use useMemo to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
         try {
       console.log('=== FILTERING PRODUCTS ===');
       console.log('Current filters:', {
         searchQuery,
         selectedCategory,
         selectedSubcategory,
         priceRange,
         sortBy
       });
       console.log('Available categories:', categories.map(cat => cat.name));
       console.log('Products to filter:', products.length);
       console.log('Sample products:', products.slice(0, 3).map(p => ({ name: p.name, category: p.category })));
       console.log('All product categories:', [...new Set(products.map(p => p.category))]);
      
      // Early return if no products
      if (!products || products.length === 0) {
        console.log('No products to filter, returning empty array');
        return [];
      }
      
      // Get filtered and sorted products
      let filtered = [...products];
      
      // Add test products for admin panel categories that don't exist in mockData
      if (categories && Array.isArray(categories) && categories.length > 0) {
        const adminCategories = categories.filter(cat => 
          !mockData.products.some(p => p.category === cat.name)
        );
        
        adminCategories.forEach(cat => {
          // Add a test product for each admin category
          filtered.push({
            id: `admin-${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
            name: `Test Product - ${cat.name}`,
            sku: `ADMIN-${cat.name.toUpperCase().replace(/\s+/g, '-')}-001`,
            catalogNumber: `ADMIN-${cat.name.toUpperCase().replace(/\s+/g, '-')}-001`,
            category: cat.name,
            subcategory: cat.subcategories?.[0]?.name || "General",
            price: 99.99,
            originalPrice: 129.99,
            stock_quantity: 10,
            in_stock: true,
            description: `Test product for ${cat.name} category`,
            image: "https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=400&h=300&fit=crop"
          });
        });
      }

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.subcategory && product.subcategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (product.catalogNumber && product.catalogNumber.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

             // Apply category filter - check both mockData categories and admin panel categories
       if (selectedCategory) {
         // console.log('Applying category filter for:', selectedCategory); // Commented out to reduce console spam
         const beforeFilter = filtered.length;
         
         filtered = filtered.filter(product => {
           // Direct match with product category
           if (product.category === selectedCategory) {
             return true;
           }
           
           // Check if product category matches any admin panel category name
           const adminCategory = categories.find(cat => cat.name === selectedCategory);
           if (adminCategory && product.category === adminCategory.name) {
             return true;
           }
           
           return false;
         });
         
         // console.log(`Category filter: ${beforeFilter} -> ${filtered.length} products`); // Commented out to reduce console spam
         // console.log('Filtered products:', filtered.map(p => ({ name: p.name, category: p.category }))); // Commented out to reduce console spam
       }

             // Apply subcategory filter - check both mockData subcategories and admin panel subcategories
       if (selectedSubcategory) {
         // console.log('Applying subcategory filter for:', selectedSubcategory); // Commented out to reduce console spam
         const beforeFilter = filtered.length;
         
         filtered = filtered.filter(product => {
           // Direct match with product subcategory
           if (product.subcategory === selectedSubcategory) {
             return true;
           }
           
           // Check if product subcategory matches any admin panel subcategory name
           const adminSubcategory = categories
             .flatMap(cat => cat.subcategories || [])
             .find(sub => sub.name === selectedSubcategory);
           
           if (adminSubcategory && product.subcategory === adminSubcategory.name) {
             return true;
           }
           
           return false;
         });
         
         // console.log(`Subcategory filter: ${beforeFilter} -> ${filtered.length} products`); // Commented out to reduce console spam
         // console.log('Filtered products:', filtered.map(p => ({ name: p.name, subcategory: p.subcategory }))); // Commented out to reduce console spam
       }

      // Apply price range filter
      if (priceRange.min) {
        filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
      }
      if (priceRange.max) {
        filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "newest":
            return b.id.localeCompare(a.id);
          default:
            return 0;
        }
      });

       console.log('=== FILTERING COMPLETED ===');
       console.log(`Final result: ${filtered.length} products`);
       console.log('Final products:', filtered.map(p => ({ name: p.name, category: p.category, subcategory: p.subcategory })));
       
       return filtered;
    } catch (error) {
      console.error('Error in getFilteredProducts:', error);
      return [];
    }
  }, [
    products,
    searchQuery, 
    selectedCategory, 
    selectedSubcategory, 
    priceRange.min, 
    priceRange.max, 
    sortBy,
    categories
  ]);
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  
  // Pagination functions
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-red-600">
            FORKLIFT PARTS & ACCESSORIES
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            Loading products...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            FORKLIFT PARTS & ACCESSORIES
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Over 3,000,000 parts in stock - Find exactly what you need
          </p>
          <form onSubmit={handleSearch} className="flex justify-center max-w-xl mx-auto px-4">
            <div className="flex w-full shadow-md rounded-md overflow-hidden bg-white border border-gray-200">
              <input
                type="text"
                placeholder="Search parts, SKU, category..."
                className="flex-1 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-none min-w-[70px] text-sm font-medium transition-colors duration-200"
              >
                <Search className="w-4 h-4 mr-1" />
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Products</h2>
            
            {/* Items per page selector and pagination on same line */}
            <div className="flex items-center space-x-6">
              {/* Items per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                </select>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => goToPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            {/* Left Sidebar - Filters */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>
                
                                 {/* Category Filter */}
                 <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                   <select
                     value={selectedCategory}
                     onChange={(e) => handleCategoryChange(e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                   >
                     <option value="">All Categories</option>
                     {categories.map((cat) => (
                       <option key={cat.name} value={cat.name}>{cat.name}</option>
                     ))}
                   </select>
                 </div>

                 {/* Subcategory Filter */}
                 <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                   <select
                     value={selectedSubcategory}
                     onChange={(e) => handleSubcategoryChange(e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                     disabled={!selectedCategory}
                   >
                     <option value="">All Subcategories</option>
                     {selectedCategory && categories
                       .find(cat => cat.name === selectedCategory)
                       ?.subcategories?.map((sub) => (
                         <option key={sub.name} value={sub.name}>{sub.name}</option>
                       ))}
                   </select>
                 </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="name">Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>

            {/* Right Content - Products */}
            <div className="flex-1">
              {/* Results Summary */}
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>

              {/* Products Grid */}
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
          // Navigate back to products page without ID
          if (id) {
            navigate('/products');
          }
        }}
      />
    </div>
  );
};

export default ProductsPage;
