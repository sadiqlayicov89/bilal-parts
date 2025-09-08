import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './auth/LoginModal';
import { getProductPriceInfo, formatPrice } from '../utils/priceUtils';

const ProductCard = ({ product, className = "" }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { toggleWishlist, checkInWishlist, loading: wishlistLoading } = useWishlist();
  const { isAuthenticated, user, userDiscount } = useAuth();

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (isAuthenticated) {
        const inWishlist = await checkInWishlist(product.id);
        setIsInWishlist(inWishlist);
      }
    };
    
    checkWishlistStatus();
  }, [product.id, isAuthenticated, checkInWishlist]);

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };



  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return;
    }
    
    await addToCart(product.id, 1);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return;
    }
    
    const result = await toggleWishlist(product.id);
    if (result.success) {
      setIsInWishlist(!isInWishlist);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    // Check for multiple images first, then fallback to single image
    const images = product.images && product.images.length > 0 ? product.images : 
                   product.image ? [product.image] : [];
    
    if (imageError || images.length === 0) {
      return 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=300&h=200&fit=crop';
    }
    
    // Return first image (primary image)
    return images[0];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(price);
  };

  const getDisplayPrice = () => {
    // Get price info with user discount
    const priceInfo = getProductPriceInfo(product, userDiscount);
    
    // If user has discount, show discounted price
    if (priceInfo.hasDiscount) {
      return (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-red-600">
              {formatPrice(priceInfo.discountedPrice)}
            </span>
            <Badge variant="destructive" className="text-xs">
              -{userDiscount}%
            </Badge>
          </div>
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(priceInfo.originalPrice)}
          </span>
        </div>
      );
    }
    
    // No discount - show regular price
    return (
      <span className="text-lg font-bold text-gray-900">
        {formatPrice(priceInfo.displayPrice)}
      </span>
    );
  };

  return (
    <>
      <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
        <div className="relative overflow-hidden">
          <img
            src={getImageSrc()}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
          
          {/* Stock Status Badge */}
          <div className="absolute top-2 left-2">
            {product.in_stock ? (
              <Badge className="bg-green-500 hover:bg-green-600">
                In Stock
              </Badge>
            ) : (
              <Badge variant="destructive">
                Out of Stock
              </Badge>
            )}
          </div>
          
          {/* Multiple Images Indicator */}
          {(() => {
            const images = product.images && product.images.length > 0 ? product.images : 
                           product.image ? [product.image] : [];
            return images.length > 1 ? (
              <div className="absolute top-2 right-2">
                <Badge className="bg-blue-600 text-white">
                  +{images.length - 1}
                </Badge>
              </div>
            ) : null;
          })()}
          

          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleViewDetails();
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Product Category */}
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category} {product.subcategory && `• ${product.subcategory}`}
            </p>
            

            
            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-red-600 transition-colors cursor-pointer" onClick={handleViewDetails}>
              {product.name}
            </h3>
            
            {/* Product SKU */}
            {product.sku && (
              <p className="text-xs text-gray-500 font-medium">
                SKU: {product.sku}
              </p>
            )}

            {/* Product Catalog Number */}
            {product.catalogNumber && (
              <p className="text-xs text-gray-500 font-medium">
                Catalog: {product.catalogNumber}
              </p>
            )}
            
            {/* Rating (Mock data for now) */}
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
              <span className="text-xs text-gray-500">(4.0)</span>
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                {getDisplayPrice()}
              </div>
            </div>
            
            {/* Brand */}
            {product.brand && (
              <p className="text-xs text-gray-600">
                Brand: <span className="font-medium">{product.brand}</span>
              </p>
            )}
            
            {/* Add to Cart and Wishlist Buttons */}
            <div className="pt-2 space-y-2">
              {/* Add to Cart Button */}
              {isAuthenticated ? (
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock || cartLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300"
                >
                  {cartLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>
                        {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                      </span>
                    </div>
                  )}
                </Button>
              ) : (
                <LoginModal>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </LoginModal>
              )}
              
              {/* View Details Button */}
              <Button
                onClick={handleViewDetails}
                variant="outline"
                size="sm"
                className="w-full text-blue-600 border-blue-300 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>

              {/* Wishlist Button */}
              {isAuthenticated ? (
                <Button
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  variant="outline"
                  size="sm"
                  className={`w-full transition-all duration-200 ${
                    isInWishlist 
                      ? 'text-red-500 border-red-500 hover:bg-red-50' 
                      : 'text-gray-600 border-gray-300 hover:border-red-500 hover:text-red-500 hover:bg-red-50'
                  }`}
                  title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  {wishlistLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Heart 
                        className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} 
                      />
                      <span>
                        {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      </span>
                    </div>
                  )}
                </Button>
              ) : (
                <LoginModal>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-gray-600 border-gray-300 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Add to Wishlist
                  </Button>
                </LoginModal>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductCard;