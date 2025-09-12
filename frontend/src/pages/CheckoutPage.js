import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, CreditCard, Truck, Building2, CreditCard as CardIcon } from 'lucide-react';
import { getProductPriceInfo, formatPrice } from '../utils/priceUtils';
import { Badge } from '../components/ui/badge';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart, getCartTotals, userDiscount } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    inn: ''
  });

  // Auto-fill form data from user profile
  useEffect(() => {
    if (user) {
      const userMeta = user.user_metadata || {};
      setFormData({
        firstName: user.first_name || userMeta.first_name || '',
        lastName: user.last_name || userMeta.last_name || '',
        email: user.email || '',
        phone: user.phone || userMeta.phone || '',
        address: user.address || userMeta.address || '',
        company: user.company || userMeta.company_name || '',
        inn: user.inn || userMeta.vat_number || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      shippingAddress: formData.address || 'N/A',
      paymentMethod: paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'P2P Card to Card',
      company: formData.company || '',
      inn: formData.inn || '',
      user_name: `${formData.firstName} ${formData.lastName}`.trim(),
      user_email: formData.email,
      phone: formData.phone
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
                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-base font-semibold">Ödəniş Metodu</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Button
                        type="button"
                        variant={paymentMethod === 'bank_transfer' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('bank_transfer')}
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                      >
                        <Building2 className="w-6 h-6" />
                        <span>Bank Transfer</span>
                        <span className="text-xs text-gray-500">Hesabdan ödəniş</span>
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === 'p2p' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('p2p')}
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                      >
                        <CardIcon className="w-6 h-6" />
                        <span>P2P Card to Card</span>
                        <span className="text-xs text-gray-500">Kartdan karta</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="inn">INN (Tax ID)</Label>
                    <Input
                      id="inn"
                      name="inn"
                      value={formData.inn}
                      onChange={handleInputChange}
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

