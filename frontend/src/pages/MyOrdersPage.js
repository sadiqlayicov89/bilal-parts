import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Package, Calendar, MapPin, CreditCard, Eye, X, Printer } from 'lucide-react';
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

  const handlePrintOrder = () => {
    if (!selectedOrder) return;
    
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Details - #${selectedOrder.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .order-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .total-section { text-align: right; margin-top: 20px; }
            .total-amount { font-size: 18px; font-weight: bold; color: #dc2626; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Bilal Parts - Order Details</h1>
            <h2>Order #${selectedOrder.id}</h2>
          </div>
          
          <div class="order-info">
            <div>
              <p><strong>Date:</strong> ${new Date(selectedOrder.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${getStatusText(selectedOrder.status)}</p>
            </div>
            <div>
              <p><strong>Payment Method:</strong> ${selectedOrder.paymentMethod}</p>
              <p><strong>Customer:</strong> ${user?.first_name} ${user?.last_name}</p>
            </div>
          </div>
          
          <div class="section">
            <h3>Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Catalog No</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${selectedOrder.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.sku || '-'}</td>
                    <td>${item.catalogNumber || '-'}</td>
                    <td>${item.quantity}</td>
                    <td>${formatPrice(item.price)}</td>
                    <td>${formatPrice(item.price * item.quantity)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="total-section">
            <p><strong>Subtotal:</strong> ${formatPrice(selectedOrder.subtotal)}</p>
            ${selectedOrder.discountAmount > 0 ? `
              <p><strong>Discount (${selectedOrder.discountPercentage}%):</strong> -${formatPrice(selectedOrder.discountAmount)}</p>
            ` : ''}
            <p class="total-amount"><strong>Total Amount:</strong> ${formatPrice(selectedOrder.total)}</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

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
        { name: 'BATTERY CHARGER', quantity: 1, price: 180.00, catalogNumber: 'BC-001', sku: 'BATTERY-CHARGER-001' },
        { name: 'CLUTCH DISC', quantity: 1, price: 95.00, catalogNumber: 'CD-002', sku: 'CLUTCH-DISC-002' }
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
        { name: 'ENGINE FILTER', quantity: 2, price: 150.00, catalogNumber: 'EF-003', sku: 'ENGINE-FILTER-003' },
        { name: 'HYDRAULIC PUMP', quantity: 1, price: 150.00, catalogNumber: 'HP-004', sku: 'HYDRAULIC-PUMP-004' }
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
        { name: 'TRANSMISSION BELT', quantity: 1, price: 320.00, catalogNumber: 'TB-005', sku: 'TRANSMISSION-BELT-005' }
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
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-red-600" />
                <span>Order Details - #{selectedOrder?.id}</span>
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handlePrintOrder}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </Button>
                <Button
                  onClick={() => setShowOrderDetails(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              {/* Order Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <Card className="h-fit">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
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

                <Card className="h-fit">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm">{selectedOrder.shippingAddress}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => {
                      const originalPrice = item.price;
                      const orderDiscount = selectedOrder.discountPercentage || selectedOrder.userDiscount || userDiscount;
                      const discountAmount = orderDiscount > 0 ? (originalPrice * orderDiscount) / 100 : 0;
                      const discountedPrice = originalPrice - discountAmount;
                      const itemTotal = discountedPrice * item.quantity;
                      
                      return (
                        <div key={index} className="flex justify-between items-start py-2 border-b last:border-b-0">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <div className="text-xs text-gray-500 space-y-0.5">
                              <p>Kataloq №: {item.catalogNumber || 'N/A'}</p>
                              <p>Artikul: {item.sku || item.artikul || 'N/A'}</p>
                              <p>Miqdar: {item.quantity}</p>
                            </div>
                            
                            <div className="mt-1">
                              {orderDiscount > 0 ? (
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs font-medium text-red-600">
                                      {formatPrice(discountedPrice)} hər biri
                                    </span>
                                    <Badge variant="destructive" className="text-xs">
                                      -{orderDiscount}%
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(originalPrice)} hər biri
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">
                                  {formatPrice(originalPrice)} hər biri
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-semibold text-sm">{formatPrice(itemTotal)}</span>
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
