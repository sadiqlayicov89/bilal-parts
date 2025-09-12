import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';
import { getProductPriceInfo, formatPrice } from '../utils/priceUtils';
import { Badge } from '../components/ui/badge';

const CartPage = () => {
  const { cartItems, cartCount, cartTotal, loading, updateQuantity, removeFromCart, clearCart, getCartTotals, userDiscount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
            <p className="text-gray-600 mb-8">Please log in to view your cart and make purchases.</p>
            
            <div className="space-y-4">
              <LoginModal>
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Login to View Cart
                </Button>
              </LoginModal>
              
              <div>
                <Link to="/products">
                  <Button variant="outline" size="lg">
                    Continue Shopping
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
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          </div>
          
          {cartCount > 0 && (
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            
            <Link to="/products">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.images?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNiA0MEg2MFY1NkgzNlY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTQ4IDI4QzQ4IDI4IDQ4IDI4IDQ4IDI4QzQ4IDI4IDQ4IDI4IDQ4IDI4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        
                        {/* Price with discount info */}
                        <div className="mt-1">
                          {(() => {
                            const priceInfo = getProductPriceInfo(item.product, userDiscount);
                            
                            if (priceInfo.hasDiscount) {
                              return (
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-red-600">
                                      {formatPrice(priceInfo.discountedPrice)} each
                                    </span>
                                    <Badge variant="destructive" className="text-xs">
                                      -{userDiscount}%
                                    </Badge>
                                  </div>
                                  <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(priceInfo.originalPrice)} each
                                  </span>
                                </div>
                              );
                            }
                            
                            return (
                              <span className="text-sm text-gray-500">
                                {formatPrice(priceInfo.displayPrice)} each
                              </span>
                            );
                          })()}
                        </div>
                        
                        {!item.product.in_stock && (
                          <p className="text-sm text-red-600 mt-1">Out of Stock</p>
                        )}
                        
                        {item.product.stock_quantity < 10 && item.product.in_stock && (
                          <p className="text-sm text-orange-600 mt-1">
                            Only {item.product.stock_quantity} left in stock
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end space-y-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            disabled={loading}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="text-sm font-medium w-12 text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={loading || item.quantity >= (item.product.stock_quantity || 0)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Item Total */}
                        <p className="text-lg font-semibold text-gray-900">
                          {(() => {
                            const priceInfo = getProductPriceInfo(item.product, userDiscount);
                            const itemTotal = priceInfo.displayPrice * item.quantity;
                            return formatPrice(itemTotal);
                          })()}
                        </p>
                        
                        {/* Remove Button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromCart(item.product.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const totals = getCartTotals();
                    
                    return (
                      <>
                        {/* Subtotal */}
                        <div className="flex justify-between">
                          <span>Subtotal ({cartCount} items):</span>
                          <span>{formatPrice(totals.subtotal)}</span>
                        </div>
                        
                        {/* User Discount */}
                        {totals.hasDiscount && (
                          <div className="flex justify-between text-red-600">
                            <div className="flex items-center space-x-2">
                              <span>Your Discount ({totals.discountPercentage}%):</span>
                              <Badge variant="destructive" className="text-xs">
                                -{totals.discountPercentage}%
                              </Badge>
                            </div>
                            <span>-{formatPrice(totals.discountAmount)}</span>
                          </div>
                        )}
                        
                        {/* Subtotal after discount */}
                        {totals.hasDiscount && (
                          <div className="flex justify-between font-medium border-t pt-2">
                            <span>Subtotal after discount:</span>
                            <span>{formatPrice(totals.total)}</span>
                          </div>
                        )}
                        
                        {/* VAT */}
                        <div className="flex justify-between">
                          <span>НДС (20%):</span>
                          <span>₽{(totals.total - (totals.total / 1.20)).toFixed(2)}</span>
                        </div>
                        
                        {/* Final Total */}
                        <div className="border-t pt-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span className="text-red-600">
                              {formatPrice(totals.total)}
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                  
                  <div className="space-y-3 pt-4">
                    <Link to="/checkout">
                      <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                        Proceed to Checkout
                      </Button>
                    </Link>
                    
                    <Link to="/products">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;