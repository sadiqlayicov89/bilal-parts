import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Heart, Star, Package, Info, ChevronLeft, ChevronRight, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { getProductPriceInfo } from '../utils/priceUtils';
import LoginModal from '../components/auth/LoginModal';
import SupabaseService from '../services/supabaseService';
import mockData from '../data/mockData';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, userDiscount } = useAuth();
  const { addToCart } = useCart();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // First try to fetch from Supabase
        const supabaseProducts = await SupabaseService.getProducts();
        if (supabaseProducts && supabaseProducts.length > 0) {
          const product = supabaseProducts.find(p => p.id === productId);
          if (product) {
            setCurrentProduct(product);
            setLoading(false);
            return;
          }
        }
        
        // Fallback to localStorage or mockData
        const savedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        const allProducts = savedProducts.length > 0 ? savedProducts : mockData.products;
        
        const product = allProducts.find(p => p.id === parseInt(productId));
        if (product) {
          setCurrentProduct(product);
        } else {
          // Product not found, redirect to products page
          navigate('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, navigate]);

  // Load similar products when currentProduct changes
  useEffect(() => {
    const loadSimilarProducts = async () => {
      if (currentProduct) {
        const similar = await getSimilarProducts();
        setSimilarProducts(similar);
      }
    };
    
    loadSimilarProducts();
  }, [currentProduct]);

  const getSimilarProducts = async () => {
    if (!currentProduct) return [];
    
    try {
      // First try to fetch from Supabase
      const supabaseProducts = await SupabaseService.getProducts();
      if (supabaseProducts && supabaseProducts.length > 0) {
        return supabaseProducts
          .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
          .slice(0, 4);
      }
      
      // Fallback to localStorage or mockData
      const savedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      const allProducts = savedProducts.length > 0 ? savedProducts : mockData.products;
      
      return allProducts
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    } catch (error) {
      console.error('Error fetching similar products:', error);
      return [];
    }
  };

  const handleAddToCart = async () => {
    if (!user) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(currentProduct.id, 1);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleImageNavigation = (direction) => {
    const images = currentProduct.images && currentProduct.images.length > 0 ? currentProduct.images : 
                   currentProduct.image ? [currentProduct.image] : [];
    
    if (direction === 'prev') {
      setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    } else {
      setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handleImageNavigation('prev');
    } else if (e.key === 'ArrowRight') {
      handleImageNavigation('next');
    }
  };

  const handleSimilarProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Məhsul yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Məhsul tapılmadı</h1>
          <Button onClick={() => navigate('/products')} className="bg-red-600 hover:bg-red-700">
            Məhsullara qayıt
          </Button>
        </div>
      </div>
    );
  }

  const images = currentProduct.images && currentProduct.images.length > 0 ? currentProduct.images : 
                 currentProduct.image ? [currentProduct.image] : [];
  const priceInfo = getProductPriceInfo(currentProduct, userDiscount) || {
    displayPrice: currentProduct.price || 0,
    originalPrice: currentProduct.price || 0,
    hasDiscount: false,
    discountPercentage: 0,
    discountAmount: 0
  };

  return (
    <div className="min-h-screen bg-gray-50" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Geri</span>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Images */}
            <div className="lg:w-1/2 p-6">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative group">
                  <img
                    src={images.length > 0 ? images[selectedImageIndex] : 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=400&h=300&fit=crop'}
                    alt={currentProduct.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  
                  {/* Stock Badge */}
                  <div className="absolute top-4 left-4">
                    {currentProduct.in_stock ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Stokda ({currentProduct.stock_quantity})
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Stokda yoxdur
                      </Badge>
                    )}
                  </div>

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-blue-500 hover:bg-blue-600">
                        {selectedImageIndex + 1}/{images.length}
                      </Badge>
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => handleImageNavigation('prev')}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleImageNavigation('next')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Wishlist Button */}
                  <div className="absolute top-4 right-16">
                    {user ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white bg-opacity-90 hover:bg-opacity-100"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    ) : (
                      <LoginModal
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white bg-opacity-90 hover:bg-opacity-100"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        }
                      />
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${currentProduct.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="lg:w-1/2 p-6">
              <div className="space-y-6">
                {/* Product Title */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentProduct.name}
                  </h1>
                </div>

                {/* Product Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Məhsul Məlumatları</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <div>
                        <span className="text-sm font-bold text-gray-700">SKU:</span>
                        <span className="text-sm text-gray-900 ml-1">{currentProduct.sku}</span>
                      </div>
                    </div>

                    {currentProduct.catalogNumber && (
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <div>
                          <span className="text-sm font-bold text-gray-700">Kataloq №:</span>
                          <span className="text-sm text-gray-900 ml-1">{currentProduct.catalogNumber}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-sm font-bold text-gray-700">Kateqoriya:</span>
                        <div className="text-sm text-gray-900 mt-1">
                          {currentProduct.category} {currentProduct.subcategory && `• ${currentProduct.subcategory}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">(4.0) - 128 rəy</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Qiymət</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-red-600">
                        {priceInfo.displayPrice.toFixed(2)} ₽
                      </span>
                      {priceInfo.hasDiscount && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {priceInfo.discountPercentage}% endirim
                        </Badge>
                      )}
                    </div>
                    
                    {priceInfo.hasDiscount && (
                      <div className="text-sm text-gray-600">
                        <span className="line-through">{priceInfo.originalPrice.toFixed(2)} ₽</span>
                        <span className="ml-2 text-green-600">
                          {priceInfo.discountAmount.toFixed(2)} ₽ qənaət
                        </span>
                      </div>
                    )}

                    {userDiscount > 0 && (
                      <div className="text-sm text-blue-600">
                        Sizin endiriminiz: {userDiscount}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {currentProduct.description && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Təsvir</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {currentProduct.description}
                    </p>
                  </div>
                )}

                {/* Specifications */}
                {currentProduct.specifications && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Texniki Xüsusiyyətlər</h3>
                    <div className="space-y-2">
                      {Object.entries(currentProduct.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                          <span className="text-sm font-medium text-gray-600">{key}</span>
                          <span className="text-sm text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="pt-4">
                  {user ? (
                    <Button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || !currentProduct.in_stock}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                    >
                      {isAddingToCart ? (
                        <>
                          <ShoppingCart className="h-5 w-5 mr-2 animate-spin" />
                          Səbətə əlavə edilir...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Səbətə əlavə et
                        </>
                      )}
                    </Button>
                  ) : (
                    <LoginModal
                      trigger={
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg">
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Giriş edin
                        </Button>
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="bg-gray-50 p-8 border-t">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Oxşar Məhsullar</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {similarProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white p-4 rounded-lg border hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => handleSimilarProductClick(product.id)}
                  >
                    <div className="aspect-square mb-4">
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-lg text-red-600 font-bold">
                      {(getProductPriceInfo(product, userDiscount)?.displayPrice || product.price || 0).toFixed(2)} ₽
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;





