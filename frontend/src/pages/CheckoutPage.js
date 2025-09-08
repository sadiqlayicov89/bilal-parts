import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import InvoiceModal from '../components/InvoiceModal';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';
import { getProductPriceInfo, formatPrice } from '../utils/priceUtils';
import { Badge } from '../components/ui/badge';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart, getCartTotals, userDiscount } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const handleCheckout = async () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const orderNumber = `BP${timestamp.toString().slice(-6)}${randomNum.toString().padStart(3, '0')}`;
    setInvoiceNumber(orderNumber);

    // Create order
    const orderData = {
      items: cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: cartTotal,
      shippingAddress: user?.address || 'N/A',
      paymentMethod: 'Bank Transfer',
      company: user?.company || '',
      inn: user?.inn || ''
    };

    const result = await createOrder(orderData);
    if (result.success) {
      setShowInvoice(true);
    }
  };

  const handleInvoiceClose = () => {
    setShowInvoice(false);
    clearCart();
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some products to your cart before checkout.</p>
            <Button onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/cart')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const priceInfo = getProductPriceInfo(item.product, userDiscount);
                    const itemTotal = priceInfo.displayPrice * item.quantity;
                    
                    return (
                      <div key={item.product.id} className="flex justify-between items-start py-3 border-b">
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          
                          {/* Show price details */}
                          <div className="mt-1">
                            {priceInfo.hasDiscount ? (
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-red-600">
                                    {formatPrice(priceInfo.discountedPrice)}
                                  </span>
                                  <Badge variant="destructive" className="text-xs">
                                    -{userDiscount}%
                                  </Badge>
                                </div>
                                <span className="text-xs text-gray-400 line-through">
                                  {formatPrice(priceInfo.originalPrice)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm font-medium">
                                {formatPrice(priceInfo.displayPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold">{formatPrice(itemTotal)}</span>
                      </div>
                    );
                  })}
                  
                  {(() => {
                    const totals = getCartTotals();
                    
                    return (
                      <div className="pt-4 space-y-3">
                        {/* Subtotal */}
                        <div className="flex justify-between text-sm">
                          <span>Subtotal ({cartItems.length} items):</span>
                          <span>{formatPrice(totals.subtotal)}</span>
                        </div>
                        
                        {/* User Discount */}
                        {totals.hasDiscount && (
                          <div className="flex justify-between text-sm text-red-600">
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
                          <div className="flex justify-between text-sm font-medium border-t pt-2">
                            <span>Subtotal after discount:</span>
                            <span>{formatPrice(totals.total)}</span>
                          </div>
                        )}
                        
                        {/* VAT */}
                        <div className="flex justify-between text-sm">
                          <span>НДС (20%):</span>
                          <span>₽{(totals.total - (totals.total / 1.20)).toFixed(2)}</span>
                        </div>
                        
                        {/* Final Total */}
                        <div className="flex justify-between text-lg font-bold border-t pt-3">
                          <span>Total:</span>
                          <span className="text-red-600">{formatPrice(totals.total)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue={user?.first_name || ''}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue={user?.last_name || ''}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email || ''}
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      defaultValue={user?.phone || ''}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      defaultValue={user?.address || ''}
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      defaultValue={user?.company || ''}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="inn">INN (Tax ID)</Label>
                    <Input
                      id="inn"
                      defaultValue={user?.inn || ''}
                      placeholder="Enter INN number"
                      maxLength="12"
                    />
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-red-600 hover:bg-red-700"
                    size="lg"
                  >
                    Complete Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Invoice Modal */}
        <InvoiceModal
          isOpen={showInvoice}
          onClose={handleInvoiceClose}
          orderData={{
            company: user?.company || 'N/A',
            inn: user?.inn || 'N/A',
            kpp: 'N/A',
            address: user?.address || 'N/A',
            contactName: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'N/A',
            phone: user?.phone || 'N/A'
          }}
          cartItems={cartItems}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;

