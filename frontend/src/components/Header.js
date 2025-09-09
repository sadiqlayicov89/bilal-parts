import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, ChevronDown, Globe, ShoppingCart, Heart, LogOut, Settings, Package, X, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCategories } from "../contexts/CategoryContext";
import LoginModal from "./auth/LoginModal";
import RegisterModal from "./auth/RegisterModal";
import CartModal from "./cart/CartModal";
import WishlistModal from "./wishlist/WishlistModal";
import { mockData } from "../data/mockData";

const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [customerNotifications, setCustomerNotifications] = useState([]);
  const [unreadCustomerNotifications, setUnreadCustomerNotifications] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth and Cart/Wishlist contexts
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cartCount, getCartCount } = useCart();
  const { wishlistCount, getWishlistCount } = useWishlist();
  const { categories } = useCategories();

  // Update counts when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      getCartCount();
      getWishlistCount();
      loadCustomerNotifications();
    }
  }, [isAuthenticated, getCartCount, getWishlistCount]);

  // Load customer notifications
  const loadCustomerNotifications = () => {
    if (isAuthenticated && user) {
      const savedNotifications = JSON.parse(localStorage.getItem('customerNotifications') || '[]');
      // Filter notifications for current user
      const userNotifications = savedNotifications.filter(n => 
        n.customerEmail === user.email
      );
      setCustomerNotifications(userNotifications);
      
      // Count unread
      const unreadCount = userNotifications.filter(n => !n.isRead).length;
      setUnreadCustomerNotifications(unreadCount);
    }
  };

  // Listen for new customer notifications
  useEffect(() => {
    const handleNewCustomerNotification = (event) => {
      if (isAuthenticated && user && event.detail.customerEmail === user.email) {
        loadCustomerNotifications();
        // Show toast notification
        setTimeout(() => {
          alert(`Sifariş Yeniləməsi: Sizin #${event.detail.orderNumber} sifarişinizin statusu "${event.detail.statusText}" olaraq dəyişdi`);
        }, 500);
      }
    };

    window.addEventListener('newCustomerNotification', handleNewCustomerNotification);
    
    return () => {
      window.removeEventListener('newCustomerNotification', handleNewCustomerNotification);
    };
  }, [isAuthenticated, user]);

  // Convert categories from context to header format
  useEffect(() => {
    if (categories && categories.length > 0) {
      const convertedCategories = categories.map(cat => ({
        name: cat.name,
        subcategories: cat.subcategories ? cat.subcategories.map(sub => sub.name) : []
      }));
      setProductCategories(convertedCategories);
    }
  }, [categories]);

  // Close search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && !event.target.closest('.search-container')) {
        setIsSearchOpen(false);
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const [productCategories, setProductCategories] = useState([
    {
      name: "Forklift",
      subcategories: ["Electric Forklifts", "Diesel Forklifts", "LPG Forklifts", "Warehouse Forklifts"]
    },
    {
      name: "Engine Parts",
      subcategories: ["Pistons & Rings", "Crankshafts", "Cylinder Heads", "Valves & Springs"]
    },
    {
      name: "Cooling Parts",
      subcategories: ["Radiators", "Water Pumps", "Thermostats", "Cooling Fans"]
    },
    {
      name: "Filters",
      subcategories: ["Air Filters", "Oil Filters", "Fuel Filters", "Hydraulic Filters"]
    },
    {
      name: "Transmission Parts",
      subcategories: ["Gears", "Clutches", "Drive Shafts", "Transmission Cases"]
    },
    {
      name: "Hydraulic Parts",
      subcategories: ["Hydraulic Pumps", "Hydraulic Cylinders", "Control Valves", "Hydraulic Hoses"]
    },
    {
      name: "Electrical Parts",
      subcategories: ["Switches", "Wiring", "Chargers", "Sensors"]
    }
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results using React Router
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      // Close search bar after search
      setIsSearchOpen(false);
      // Clear search query
      setSearchQuery("");
      setShowSearchResults(false);
    }
  };

  // Search products as user types
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length >= 2) {
      // Search in products
      const results = mockData.products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(query.toLowerCase())) ||
        (product.catalogNumber && product.catalogNumber.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5); // Show max 5 results
      
      setSearchResults(results);
      setShowSearchResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Navigate to product detail
  const handleProductClick = (productId) => {
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setShowSearchResults(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    logout();
  };

  const languages = [
    "English", "中文", "Русский язык", "español", "Português", 
    "بالعربية", "Français", "Deutsch", "日本語", "Italiano", 
    "हिंदी", "Türkçe", "한국어", "ภาษาไทย", "Tiếng Việt"
  ];

  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-100 py-1 text-xs text-gray-600">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>STOCK CODE: 02499. HK</span>
            <span>LISTED ON THE MAIN BOARD OF THE HKEX</span>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 hover:text-red-600">
                <Globe className="w-3 h-3" />
                <span>English</span>
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang} className="text-xs">
                    {lang}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-red-600 italic">
                Bilal-parts
              </div>
              <div className="ml-2 text-xs text-gray-500">
                Premium Parts & Accessories
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-red-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition-colors">
                Home
              </Link>
              
              {/* Products Mega Menu */}
              <div 
                className="relative"
                onMouseEnter={() => setIsProductsHovered(true)}
                onMouseLeave={() => setIsProductsHovered(false)}
              >
                <button 
                  className="flex items-center space-x-1 hover:text-red-600 transition-colors py-2"
                  onClick={() => navigate('/products')}
                >
                  <span>Products</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Mega Menu Dropdown */}
                {isProductsHovered && (
                  <div className="absolute top-full left-0 w-screen max-w-7xl bg-white shadow-2xl border-t-4 border-red-600 z-50 transform -translate-x-1/3">
                    <div className="p-8">
                      <div className="grid grid-cols-4 gap-6">
                        {/* Column 1 - Categories with subcategories */}
                        <div>
                          {productCategories
                            .filter(cat => cat.subcategories && cat.subcategories.length > 0)
                            .slice(0, 3)
                            .map((category, index) => (
                            <div key={index} className="mb-6">
                              <Link
                                to={`/products?category=${encodeURIComponent(category.name)}`}
                                className="block mb-2"
                                onClick={() => {
                                  console.log('=== HEADER CATEGORY CLICKED ===');
                                  console.log('Category:', category.name);
                                  console.log('Generated URL:', `/products?category=${encodeURIComponent(category.name)}`);
                                  console.log('Current URL before navigation:', window.location.href);
                                }}
                              >
                                <h3 className="font-semibold text-red-600 hover:text-red-700 text-lg cursor-pointer">
                                  {category.name}
                                </h3>
                              </Link>
                              <div className="space-y-1">
                                {category.subcategories.map((sub, subIndex) => (
                                  <Link
                                    key={subIndex}
                                    to={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                                    className="block py-1.5 px-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors rounded-md text-sm"
                                    onClick={() => {
                                      console.log('=== HEADER SUBCATEGORY CLICKED ===');
                                      console.log('Category:', category.name);
                                      console.log('Subcategory:', sub);
                                      console.log('Generated URL:', `/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`);
                                      console.log('Current URL before navigation:', window.location.href);
                                    }}
                                  >
                                    <div className="flex items-center">
                                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                                      <span>{sub}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Column 2 - More categories with subcategories */}
                        <div>
                          {productCategories
                            .filter(cat => cat.subcategories && cat.subcategories.length > 0)
                            .slice(3, 6)
                            .map((category, index) => (
                            <div key={index} className="mb-6">
                              <Link
                                to={`/products?category=${encodeURIComponent(category.name)}`}
                                className="block mb-2"
                                onClick={() => {
                                  console.log('=== HEADER CATEGORY CLICKED ===');
                                  console.log('Category:', category.name);
                                  console.log('Generated URL:', `/products?category=${encodeURIComponent(category.name)}`);
                                  console.log('Current URL before navigation:', window.location.href);
                                }}
                              >
                                <h3 className="font-semibold text-red-600 hover:text-red-700 text-lg cursor-pointer">
                                  {category.name}
                                </h3>
                              </Link>
                              <div className="space-y-1">
                                {category.subcategories.map((sub, subIndex) => (
                                  <Link
                                    key={subIndex}
                                    to={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                                    className="block py-1.5 px-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors rounded-md text-sm"
                                    onClick={() => {
                                      console.log('=== HEADER SUBCATEGORY CLICKED ===');
                                      console.log('Category:', category.name);
                                      console.log('Subcategory:', sub);
                                      console.log('Generated URL:', `/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`);
                                      console.log('Current URL before navigation:', window.location.href);
                                    }}
                                  >
                                    <div className="flex items-center">
                                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                                      <span>{sub}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Column 3 - Categories without subcategories */}
                        <div>
                          {productCategories
                            .filter(cat => !cat.subcategories || cat.subcategories.length === 0)
                            .slice(0, 4)
                            .map((category, index) => (
                            <div key={index} className="mb-6">
                              <Link
                                to={`/products?category=${encodeURIComponent(category.name)}`}
                                className="block mb-2"
                                onClick={() => {
                                  console.log('=== HEADER CATEGORY CLICKED ===');
                                  console.log('Category:', category.name);
                                  console.log('Generated URL:', `/products?category=${encodeURIComponent(category.name)}`);
                                  console.log('Current URL before navigation:', window.location.href);
                                }}
                              >
                                <h3 className="font-semibold text-red-600 hover:text-red-700 text-lg cursor-pointer">
                                  {category.name}
                                </h3>
                              </Link>
                              {/* No subcategories for categories without subcategories */}
                            </div>
                          ))}
                        </div>
                        
                        {/* Column 4 - More categories without subcategories */}
                        <div>
                          {productCategories
                            .filter(cat => !cat.subcategories || cat.subcategories.length === 0)
                            .slice(4)
                            .map((category, index) => (
                            <div key={index} className="mb-6">
                              <Link
                                to={`/products?category=${encodeURIComponent(category.name)}`}
                                className="block mb-2"
                                onClick={() => {
                                  console.log('=== HEADER CATEGORY CLICKED ===');
                                  console.log('Category:', category.name);
                                  console.log('Generated URL:', `/products?category=${encodeURIComponent(category.name)}`);
                                  console.log('Current URL before navigation:', window.location.href);
                                }}
                              >
                                <h3 className="font-semibold text-red-600 hover:text-red-700 text-lg cursor-pointer">
                                  {category.name}
                                </h3>
                              </Link>
                              {/* No subcategories for categories without subcategories */}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Bottom section with call-to-action */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold text-red-600">3,000,000+</span> parts in stock
                          </div>
                          <Link to="/products">
                            <Button className="bg-red-600 hover:bg-red-700 text-white">
                              View All Products
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/company" className="hover:text-red-600 transition-colors">
                Company
              </Link>
              
              <Link to="/download" className="hover:text-red-600 transition-colors">
                Download
              </Link>
              
              <Link to="/contact" className="hover:text-red-600 transition-colors">
                Contact
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:text-red-600"
              >
                <Search className="w-4 h-4" />
              </Button>
              
              {/* Wishlist */}
              {isAuthenticated ? (
                <WishlistModal>
                  <Button variant="ghost" size="sm" className="relative hover:text-red-600">
                    <Heart className="w-4 h-4" />
                    {wishlistCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs h-4 w-4 flex items-center justify-center p-0 min-w-0">
                        {wishlistCount}
                      </Badge>
                    )}
                  </Button>
                </WishlistModal>
              ) : (
                <LoginModal>
                  <Button variant="ghost" size="sm" className="hover:text-red-600">
                    <Heart className="w-4 h-4" />
                  </Button>
                </LoginModal>
              )}
              
              {/* Cart */}
              {isAuthenticated ? (
                <CartModal>
                  <Button variant="ghost" size="sm" className="relative hover:text-red-600">
                    <ShoppingCart className="w-4 h-4" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs h-4 w-4 flex items-center justify-center p-0 min-w-0">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </CartModal>
              ) : (
                <LoginModal>
                  <Button variant="ghost" size="sm" className="hover:text-red-600">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </LoginModal>
              )}
              
              {/* User Account */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-1 text-sm hover:text-red-600">
                    <User className="w-4 h-4" />
                    <span className="hidden md:block">
                      {user?.first_name || 'Account'}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist" className="flex items-center">
                        <Heart className="w-4 h-4 mr-2" />
                        Wishlist ({wishlistCount})
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/cart" className="flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Cart ({cartCount})
                      </Link>
                    </DropdownMenuItem>
                    
                    {user?.email === 'admin@bilal-parts.com' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center text-red-600">
                            <Settings className="w-4 h-4 mr-2" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center text-red-600 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <LoginModal>
                    <Button variant="ghost" size="sm" className="hover:text-red-600">
                      Login
                    </Button>
                  </LoginModal>
                  
                  <RegisterModal>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      Register
                    </Button>
                  </RegisterModal>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="pb-4 search-container relative">
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search for parts, SKU, category..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  autoFocus
                />
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  Search
                </Button>
              </form>
              
              {/* Search Results Modal */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto w-full">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Найдено товаров: {searchResults.length}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSearchResults(false)}
                        className="h-6 w-6 p-0 hover:bg-gray-200"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Results List */}
                  <div className="py-2">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=64&h=64&fit=crop';
                              }}
                            />
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {product.name}
                            </h4>
                  
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                Арт: {product.sku}
                              </Badge>
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                Кат: {product.category}
                              </Badge>
                            </div>
                            
                            <p className="text-sm font-bold text-gray-900 mt-1">
                              ${product.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* View All Results */}
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <Button
                      onClick={handleSearch}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      View All Results ({searchResults.length})
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link
                to="/products"
                className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              
              <Link
                to="/company"
                className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Company
              </Link>
              
              <Link
                to="/contact"
                className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Categories */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Categories
              </h3>
              <div className="space-y-1">
                {productCategories.slice(0, 6).map((category, index) => (
                  <Link
                    key={index}
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Welcome, {user?.first_name || user?.email}
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <LoginModal>
                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">
                      Login
                    </button>
                  </LoginModal>
                  <Link
                    to="/register"
                    className="block px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;