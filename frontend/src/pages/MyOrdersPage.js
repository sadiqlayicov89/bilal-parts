import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Package, Calendar, MapPin, CreditCard, Eye, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { getProductPriceInfo, formatPrice, calculateCartTotals } from '../utils/priceUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

const MyOrdersPage = () => {
  const { user, userDiscount } = useAuth();
  const { getUserOrders } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Mock orders data - in real app, this would come from API
  const mockOrders = [
    {
      id: 'BP7083688750',
      date: '2025-09-05',
      status: 'completed',
      userDiscount: userDiscount, // Use current user discount
      subtotal: 275.00,
      discountAmount: userDiscount > 0 ? (275.00 * userDiscount) / 100 : 0,
      discountPercentage: userDiscount,
      total: userDiscount > 0 ? 275.00 - ((275.00 * userDiscount) / 100) : 275.00,
      items: [
        { name: 'BATTERY CHARGER', quantity: 1, price: 180.00 },
        { name: 'CLUTCH DISC', quantity: 1, price: 95.00 }
      ],
      shippingAddress: 'г. Москва, ул. Примерная, д. 123',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'BP7083688751',
      date: '2025-09-04',
      status: 'processing',
      userDiscount: userDiscount,
      subtotal: 450.00,
      discountAmount: userDiscount > 0 ? (450.00 * userDiscount) / 100 : 0,
      discountPercentage: userDiscount,
      total: userDiscount > 0 ? 450.00 - ((450.00 * userDiscount) / 100) : 450.00,
      items: [
        { name: 'ENGINE FILTER', quantity: 2, price: 150.00 },
        { name: 'HYDRAULIC PUMP', quantity: 1, price: 150.00 }
      ],
      shippingAddress: 'г. Москва, ул. Примерная, д. 123',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'BP7083688752',
      date: '2025-09-03',
      status: 'shipped',
      userDiscount: userDiscount,
      subtotal: 320.00,
      discountAmount: userDiscount > 0 ? (320.00 * userDiscount) / 100 : 0,
      discountPercentage: userDiscount,
      total: userDiscount > 0 ? 320.00 - ((320.00 * userDiscount) / 100) : 320.00,
      items: [
        { name: 'TRANSMISSION BELT', quantity: 1, price: 320.00 }
      ],
      shippingAddress: 'г. Москва, ул. Примерная, д. 123',
      paymentMethod: 'Bank Transfer'
    }
  ];

  useEffect(() => {
    // Load user's orders from localStorage first
    const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const userOrders = getUserOrders();
    
    // Combine saved orders with context orders and mock orders
    const allOrders = [...savedOrders, ...userOrders, ...mockOrders];
    
    // Remove duplicates by ID
    const uniqueOrders = allOrders.filter((order, index, self) => 
      index === self.findIndex(o => o.id === order.id)
    );
    
    // Sort by date (newest first)
    uniqueOrders.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    
    setOrders(uniqueOrders);
    setLoading(false);
  }, [getUserOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const handleViewOrder = (orderId) => {
    const order = [...mockOrders, ...orders].find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowOrderDetails(true);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to view your orders</h2>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">View and track your order history</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <Button onClick={() => navigate('/products')}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              // Calculate order total with discount
              const orderDiscount = order.discountPercentage || order.userDiscount || userDiscount;
              const orderSubtotal = order.subtotal || order.total;
              const orderFinalTotal = order.total;
              
              return (
                <Card 
                  key={order.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewOrder(order.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      {/* Left side - Order info */}
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                          <Package className="w-5 h-5 text-gray-500" />
                          <div>
                            <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(order.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {/* Status */}
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                      
                      {/* Right side - Total and actions */}
                      <div className="flex items-center space-x-4">
                        {/* Total amount */}
                        <div className="text-right">
                          {orderDiscount > 0 ? (
                            <div>
                              <div className="text-lg font-bold text-red-600">
                                {formatPrice(orderFinalTotal)}
                              </div>
                              <div className="text-xs text-gray-400 line-through">
                                {formatPrice(orderSubtotal)}
                              </div>
                              <div className="text-xs text-red-600">
                                -{orderDiscount}% discount
                              </div>
                            </div>
                          ) : (
                            <div className="text-lg font-bold text-gray-900">
                              {formatPrice(orderFinalTotal)}
                            </div>
                          )}
                        </div>
                        
                        {/* View Details button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleViewOrder(order.id);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-red-600" />
                <span>Order Details - #{selectedOrder?.id}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOrderDetails(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {getStatusText(selectedOrder.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{selectedOrder.paymentMethod}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => {
                      const originalPrice = item.price;
                      const orderDiscount = selectedOrder.discountPercentage || selectedOrder.userDiscount || userDiscount;
                      const discountAmount = orderDiscount > 0 ? (originalPrice * orderDiscount) / 100 : 0;
                      const discountedPrice = originalPrice - discountAmount;
                      const itemTotal = discountedPrice * item.quantity;
                      
                      return (
                        <div key={index} className="flex justify-between items-start py-3 border-b">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            
                            <div className="mt-1">
                              {orderDiscount > 0 ? (
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-red-600">
                                      {formatPrice(discountedPrice)} each
                                    </span>
                                    <Badge variant="destructive" className="text-xs">
                                      -{orderDiscount}%
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(originalPrice)} each
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  {formatPrice(originalPrice)} each
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-semibold">{formatPrice(itemTotal)}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Order Total */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const orderDiscount = selectedOrder.discountPercentage || selectedOrder.userDiscount || userDiscount;
                    const orderSubtotal = selectedOrder.subtotal || selectedOrder.total;
                    const orderDiscountAmount = selectedOrder.discountAmount || (orderDiscount > 0 ? (orderSubtotal * orderDiscount) / 100 : 0);
                    const orderFinalTotal = selectedOrder.total;
                    
                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatPrice(orderSubtotal)}</span>
                        </div>
                        
                        {orderDiscount > 0 && (
                          <div className="flex justify-between text-red-600">
                            <div className="flex items-center space-x-2">
                              <span>Applied Discount ({orderDiscount}%):</span>
                              <Badge variant="destructive" className="text-xs">
                                -{orderDiscount}%
                              </Badge>
                            </div>
                            <span>-{formatPrice(orderDiscountAmount)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-lg font-bold border-t pt-3">
                          <span>Total Amount:</span>
                          <span className="text-red-600">{formatPrice(orderFinalTotal)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrdersPage;
