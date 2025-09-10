import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';

const WishlistPage = () => {
  const { wishlistItems, wishlistCount, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  const handleMoveToCart = async (productId) => {
    await addToCart(productId, 1);
    await removeFromWishlist(productId);
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      await clearWishlist();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Bilal-Parts Wishlist',
        text: 'Check out my wishlist on Bilal-Parts',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Wishlist</h1>
            <p className="text-gray-600 mb-8">Please log in to view your wishlist and save your favorite items.</p>
            
            <div className="space-y-4">
              <LoginModal>
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Login to View Wishlist
                </Button>
              </LoginModal>
              
              <div>
                <Link to="/products">
                  <Button variant="outline" size="lg">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-red-600 hover:text-red-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
            {wishlistCount > 0 && (
              <span className="text-gray-500">({wishlistCount} items)</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            {wishlistCount > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="text-gray-600 border-gray-300"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleClearWishlist}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save items you love by clicking the heart icon on products.</p>
            
            <Link to="/products">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Link to={`/products/${item.product.id}`}>
                    <img
                      src={item.product.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  {/* Remove from Wishlist */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white shadow-md hover:shadow-lg text-red-600"
                    onClick={() => removeFromWishlist(item.product.id)}
                    disabled={loading}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                  
                  {/* Stock Status */}
                  <div className="absolute top-2 left-2">
                    {item.product.in_stock ? (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                        In Stock
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Product Info */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {item.product.category?.replace('_', ' ')}
                      </p>
                      
                      <Link to={`/products/${item.product.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-red-600 transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      <p className="text-lg font-bold text-red-600 mt-2">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleAddToCart(item.product.id)}
                        disabled={!item.product.in_stock || loading}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {item.product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      
                      <Button
                        onClick={() => handleMoveToCart(item.product.id)}
                        disabled={!item.product.in_stock || loading}
                        variant="outline"
                        className="w-full"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Move to Cart
                      </Button>
                    </div>
                    
                    {/* Added Date */}
                    <p className="text-xs text-gray-400">
                      Added {new Date(item.added_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Continue Shopping */}
        {wishlistItems.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default WishlistPage;