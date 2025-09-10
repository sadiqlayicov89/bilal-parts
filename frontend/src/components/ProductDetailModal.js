import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Star, Package, Info, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { getProductPriceInfo } from '../utils/priceUtils';
import LoginModal from './auth/LoginModal';
import mockData from '../data/mockData';

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  const { user, userDiscount, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, checkInWishlist } = useWishlist();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      setCurrentProduct(product);
      setSelectedImageIndex(0);
    }
  }, [product, isOpen]);

  const getSimilarProducts = () => {
    if (!currentProduct) return [];
    
    const savedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const allProducts = savedProducts.length > 0 ? savedProducts : mockData.products;
    
    return allProducts
      .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
      .slice(0, 4);
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

  if (!currentProduct) return null;

  const images = currentProduct.images && currentProduct.images.length > 0 ? currentProduct.images : 
                 currentProduct.image ? [currentProduct.image] : [];
  const similarProducts = getSimilarProducts();
  const priceInfo = getProductPriceInfo(currentProduct, userDiscount) || {
    displayPrice: currentProduct.price || 0,
    originalPrice: currentProduct.price || 0,
    hasDiscount: false,
    discountPercentage: 0,
    discountAmount: 0
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl max-h-[95vh] overflow-hidden p-0"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {currentProduct.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row h-full overflow-y-auto">
          {/* Left Column - Images */}
          <div className="lg:w-1/2 p-4">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group">
                <img
                  src={images.length > 0 ? images[selectedImageIndex] : 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=400&h=300&fit=crop'}
                  alt={currentProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
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
                      className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
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
          <div className="lg:w-1/2 p-4">
            <div className="space-y-3">
              {/* Product Information */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Məhsul Məlumatları</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-xs font-bold text-gray-700">SKU:</span>
                      <span className="text-xs text-gray-900 ml-1">{currentProduct.sku}</span>
                    </div>
                  </div>

                  {currentProduct.catalogNumber && (
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <div>
                        <span className="text-xs font-bold text-gray-700">Kataloq №:</span>
                        <span className="text-xs text-gray-900 ml-1">{currentProduct.catalogNumber}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-gray-700">Kateqoriya:</span>
                      <div className="text-xs text-gray-900 mt-1">
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
                            className={`h-3 w-3 ${
                              star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">(4.0) - 128 rəy</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Qiymət</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-red-600">
                      {priceInfo.displayPrice.toFixed(2)} ₽
                    </span>
                    {priceInfo.hasDiscount && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                        {priceInfo.discountPercentage}% endirim
                      </Badge>
                    )}
                  </div>
                  
                  {priceInfo.hasDiscount && (
                    <div className="text-xs text-gray-600">
                      <span className="line-through">{priceInfo.originalPrice.toFixed(2)} ₽</span>
                      <span className="ml-2 text-green-600">
                        {priceInfo.discountAmount.toFixed(2)} ₽ qənaət
                      </span>
                    </div>
                  )}

                  {userDiscount > 0 && (
                    <div className="text-xs text-blue-600">
                      Sizin endiriminiz: {userDiscount}%
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {currentProduct.description && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Təsvir</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {currentProduct.description}
                  </p>
                </div>
              )}

              {/* Specifications */}
              {currentProduct.specifications && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Texniki Xüsusiyyətlər</h3>
                  <div className="space-y-1">
                    {Object.entries(currentProduct.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                        <span className="text-xs font-medium text-gray-600">{key}</span>
                        <span className="text-xs text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-1 space-y-2">
                {/* Add to Cart Button */}
                {user ? (
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !currentProduct.in_stock}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 text-sm"
                  >
                    {isAddingToCart ? (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2 animate-spin" />
                        Səbətə əlavə edilir...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Səbətə əlavə et
                      </>
                    )}
                  </Button>
                ) : (
                  <LoginModal
                    trigger={
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 text-sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Giriş edin
                      </Button>
                    }
                  />
                )}
                
                {/* Add to Wishlist Button */}
                {user ? (
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-50 py-2 text-sm"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist-ə əlavə et
                  </Button>
                ) : (
                  <LoginModal
                    trigger={
                      <Button
                        variant="outline"
                        className="w-full border-red-600 text-red-600 hover:bg-red-50 py-2 text-sm"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Giriş edin
                      </Button>
                    }
                  />
                )}
              </div>

              {/* Similar Products */}
              {similarProducts.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg -mx-4 -mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Oxşar Məhsullar</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {similarProducts.map((product) => (
                      <div key={product.id} className="bg-white p-2 rounded-lg border hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                        <div className="aspect-square mb-2">
                          <img
                            src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1 leading-tight">
                          {product.name}
                        </h4>
                        <p className="text-xs text-red-600 font-bold">
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
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
