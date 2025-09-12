import React from 'react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Heart, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistModal = ({ children }) => {
  const { wishlistItems, wishlistCount, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  const handleMoveToCart = async (productId) => {
    await addToCart(productId, 1);
    await removeFromWishlist(productId);
  };

  if (!isAuthenticated) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Wishlist</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Heart className="h-16 w-16 text-gray-300" />
            <p className="text-gray-600">Please log in to view your wishlist</p>
            <Button className="bg-red-600 hover:bg-red-700">
              Login
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Wishlist</span>
            </div>
            {wishlistCount > 0 && (
              <Badge variant="destructive" className="bg-red-600">
                {wishlistCount}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            {wishlistCount === 0 ? 'Your wishlist is empty' : `${wishlistCount} item${wishlistCount > 1 ? 's' : ''} in your wishlist`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 space-y-4">
              <Heart className="h-16 w-16 text-gray-300" />
              <p className="text-gray-600">Your wishlist is empty</p>
              <Link to="/products">
                <Button className="bg-red-600 hover:bg-red-700">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Items */}
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                {wishlistItems.map((item) => {
                  // Check if item and item.product exist
                  if (!item || !item.product) {
                    console.warn('Invalid wishlist item:', item);
                    return null;
                  }
                  
                  return (
                    <div key={item.id} className="flex space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.image || item.product.images?.[0] || '/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyN0g0MFYzOEgyNFYyN1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMyIDIwQzMyIDIwIDMyIDIwIDMyIDIwQzMyIDIwIDMyIDIwIDMyIDIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'}
                          alt={item.product.name || 'Product'}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = '/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyN0g0MFYzOEgyNFYyN1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMyIDIwQzMyIDIwIDMyIDIwIDMyIDIwQzMyIDIwIDMyIDIwIDMyIDIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name || 'Unknown Product'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ₽{(item.product.price || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {(item.product.category || 'General').replace('_', ' ')}
                        </p>
                        
                        {item.product.in_stock === false && (
                          <p className="text-xs text-red-600">Out of Stock</p>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        {/* Add to Cart Button */}
                        <Button
                          size="sm"
                          className="h-8 bg-red-600 hover:bg-red-700"
                          onClick={() => handleAddToCart(item.product.id)}
                          disabled={loading || !item.product.in_stock}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                        
                        {/* Move to Cart Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => handleMoveToCart(item.product.id)}
                          disabled={loading || !item.product.in_stock}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Move
                        </Button>
                        
                        {/* Remove Button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromWishlist(item.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Wishlist Actions */}
              <div className="border-t pt-4 space-y-2">
                <Link to="/wishlist" className="block">
                  <Button variant="outline" className="w-full">
                    View Full Wishlist
                  </Button>
                </Link>
                
                <Button
                  variant="ghost"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    // Clear wishlist functionality can be added here
                  }}
                >
                  Clear Wishlist
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WishlistModal;
