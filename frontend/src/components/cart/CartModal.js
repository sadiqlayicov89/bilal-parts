import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { ShoppingCart, Plus, Minus, Trash2, Loader2, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import InvoiceModal from '../InvoiceModal';
import { getProductPriceInfo, formatPrice } from '../../utils/priceUtils';

const CartModal = ({ children }) => {
  const { cartItems, cartCount, cartTotal, loading, updateQuantity, removeFromCart, getCartTotals, userDiscount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Generate invoice number and go directly to invoice
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    const orderNumber = `BP${timestamp.toString().slice(-6)}${randomNum.toString().padStart(3, '0')}`;
    setInvoiceNumber(orderNumber);

    // Create order and save to localStorage
    const totals = getCartTotals();
    const newOrder = {
      id: orderNumber,
      userId: user?.id,
      userEmail: user?.email,
      userName: `${user?.first_name} ${user?.last_name}`,
      userDiscount: userDiscount,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      items: cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        sku: item.product.sku,
        catalogNumber: item.product.catalogNumber
      })),
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      discountPercentage: totals.discountPercentage,
      total: totals.total,
      shippingAddress: user?.address || 'г. Москва, ул. Примерная, д. 123',
      paymentMethod: 'Bank Transfer',
      company: user?.company_name || '',
      inn: user?.vat_number || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('userOrders', JSON.stringify(updatedOrders));

    // Create admin notification
    const notification = {
      id: `notif-${Date.now()}`,
      type: 'new_order',
      title: 'Yeni Sifariş',
      message: `${user?.first_name} ${user?.last_name} tərəfindən yeni sifariş verildi`,
      orderNumber: orderNumber,
      customerName: `${user?.first_name} ${user?.last_name}`,
      orderTotal: formatPrice(totals.total),
      discount: totals.discountPercentage > 0 ? `${totals.discountPercentage}%` : null,
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'high'
    };

    // Save notification to localStorage
    const existingNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    const updatedNotifications = [notification, ...existingNotifications];
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));

    // Dispatch event for admin panel
    window.dispatchEvent(new CustomEvent('newAdminNotification', { detail: notification }));

    // Show invoice directly
    setShowInvoice(true);
  };


  if (!isAuthenticated) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Shopping Cart</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <ShoppingCart className="h-16 w-16 text-gray-300" />
            <p className="text-gray-600">Please log in to view your cart</p>
            <Button className="bg-red-600 hover:bg-red-700">
              Login
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg h-[100vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Shopping Cart</span>
            </div>
            {cartCount > 0 && (
              <Badge variant="destructive" className="bg-red-600">
                {cartCount}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            {cartCount === 0 ? 'Your cart is empty' : `${cartCount} item${cartCount > 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 space-y-4">
              <ShoppingCart className="h-16 w-16 text-gray-300" />
              <p className="text-gray-600">Your cart is empty</p>
              <Link to="/products">
                <Button className="bg-red-600 hover:bg-red-700">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-1 py-2 max-h-[62vh]">
                                  {cartItems.map((item) => {
                    if (!item || !item.product) {
                      return null;
                    }
                    
                    return (
                      <div key={item.id} className="flex space-x-3 p-2 border rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.images?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyN0g0MFYzOEgyNFYyN1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMyIDIwQzMyIDIwIDMyIDIwIDMyIDIwQzMyIDIwIDMyIDIwIDMyIDIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyN0g0MFYzOEgyNFYyN1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMyIDIwQzMyIDIwIDMyIDIwIDMyIDIwQzMyIDIwIDMyIDIwIDMyIDIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 leading-tight">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Код: {item.product.catalogNumber || item.product.sku || 'N/A'}
                        </p>

                        <div className="text-sm text-gray-500 mt-1">
                          {(() => {
                              const priceInfo = getProductPriceInfo(item.product, userDiscount);
                              
                              if (priceInfo.hasDiscount) {
                              return (
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                  <span className="text-red-600 font-medium">
                                        {formatPrice(priceInfo.discountedPrice)}
                                  </span>
                                      <Badge variant="destructive" className="text-xs px-1 py-0">
                                        -{userDiscount}%
                                  </Badge>
                                    </div>
                                    <span className="text-gray-400 line-through text-xs">
                                      {formatPrice(priceInfo.originalPrice)}
                                    </span>
                                </div>
                              );
                            }
                            
                              return (
                                <span className="text-sm font-medium">
                                  {formatPrice(priceInfo.displayPrice)}
                                  </span>
                              );
                          })()}
                        </div>
                        
                        {!item.product.in_stock && (
                          <p className="text-xs text-red-600 mt-1">Out of Stock</p>
                        )}
                      </div>
                      
                        <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-1">
                          <Button
                              variant="outline"
                            size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                          <Button
                              variant="outline"
                            size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                            variant="ghost"
                          size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-8 space-y-5 pb-8">
                  {(() => {
                    const totals = getCartTotals();
                    
                    return (
                      <>
                        {/* Subtotal (original price) */}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Subtotal:</span>
                          <span>{formatPrice(totals.subtotal)}</span>
                        </div>
                        
                        {/* User Discount */}
                        {totals.hasDiscount && (
                          <div className="flex justify-between items-center text-sm text-red-600">
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
                        <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-2">
                          <span>Subtotal after discount:</span>
                          <span>{formatPrice(totals.total)}</span>
                        </div>
                        
                        {/* VAT calculations */}
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Subtotal (без НДС):</span>
                          <span>₽{(totals.total / 1.20).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>НДС (20%):</span>
                          <span>₽{(totals.total - (totals.total / 1.20)).toFixed(2)}</span>
                </div>
                        
                        {/* Final Total */}
                        <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-red-600">
                            {formatPrice(totals.total)}
                  </span>
                </div>
                      </>
                    );
                  })()}
                
                <div className="space-y-3 pt-5 pb-6">
                  <Link to="/cart" className="block">
                    <Button variant="outline" className="w-full">
                      View Cart
                    </Button>
                  </Link>
                  
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
      </Sheet>


      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
        invoiceNumber={invoiceNumber}
        orderData={{
          company: user?.company_name || 'N/A',
          inn: user?.vat_number || 'N/A',
          kpp: 'N/A',
          address: user?.address || 'N/A',
          contactName: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'N/A',
          phone: user?.phone || 'N/A'
        }}
        cartItems={cartItems}
      />
    </>
  );
};

export default CartModal;