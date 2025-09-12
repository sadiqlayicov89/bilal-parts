import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/contexts/CategoryContext';
import SupabaseService from '@/services/supabaseService';
import { Plus, Edit, Trash2, Eye, Bell, CreditCard } from 'lucide-react';

const AdminPage = () => {
  const { user } = useAuth();
  const { categories, loadCategories } = useCategories();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('categories');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Category form state
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    image: '',
    parent_id: null
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    if (user) {
      loadCategories();
      fetchOrders();
      fetchNotifications();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const ordersData = await SupabaseService.getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Xəta",
        description: "Sifarişlər yüklənə bilmədi.",
        variant: "destructive"
      });
    }
  };

  const fetchNotifications = async () => {
    try {
      const notificationsData = await SupabaseService.getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await SupabaseService.addCategory({
        name: categoryFormData.name,
        description: categoryFormData.description,
        image: categoryFormData.image,
        parent_id: categoryFormData.parent_id || null
      });
      
      if (result) {
        toast({
          title: "Uğurla Əlavə Edildi",
          description: "Kateqoriya uğurla əlavə edildi.",
        });
        setCategoryFormData({ name: '', description: '', image: '', parent_id: null });
        setShowCategoryForm(false);
        loadCategories();
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Xəta",
        description: "Kateqoriya əlavə edilə bilmədi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await SupabaseService.updateCategory(editingCategory.id, {
        name: categoryFormData.name,
        description: categoryFormData.description,
        image: categoryFormData.image,
        parent_id: categoryFormData.parent_id || null
      });
      
      if (result) {
        toast({
          title: "Uğurla Yeniləndi",
          description: "Kateqoriya uğurla yeniləndi.",
        });
        setCategoryFormData({ name: '', description: '', image: '', parent_id: null });
        setEditingCategory(null);
        setShowCategoryForm(false);
        loadCategories();
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Xəta",
        description: "Kateqoriya yenilənə bilmədi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Bu kateqoriyanı silmək istədiyinizə əminsiniz?')) {
      try {
        const result = await SupabaseService.deleteCategory(categoryId);
        if (result) {
          toast({
            title: "Uğurla Silindi",
            description: "Kateqoriya uğurla silindi.",
          });
          loadCategories();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Xəta",
          description: "Kateqoriya silinə bilmədi.",
          variant: "destructive"
        });
      }
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      const result = await SupabaseService.updateOrderStatus(orderId, newStatus);
      
      if (result) {
        await fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({...selectedOrder, status: newStatus});
        }
        toast({
          title: "Uğurla Yeniləndi",
          description: `Sifariş statusu "${newStatus}" olaraq dəyişdirildi`,
        });
        
        // Create notification in Supabase
        const notificationData = {
          user_id: order.user_id,
          type: 'order',
          title: 'Sifariş Status Yeniləndi',
          message: `Sizin #${order.order_number || orderId} nömrəli sifarişinizin statusu "${newStatus}" olaraq dəyişdi`,
          data: {
            order_id: orderId,
            order_number: order.order_number || orderId,
            new_status: newStatus
          }
        };
        await SupabaseService.createNotification(notificationData);

        // Dispatch event for customer notification
        const customerNotification = {
          id: Date.now(),
          type: 'order',
          title: 'Sifariş Status Yeniləndi',
          message: `Sizin #${order.order_number || orderId} nömrəli sifarişinizin statusu "${newStatus}" olaraq dəyişdi`,
          data: {
            order_id: orderId,
            order_number: order.order_number || orderId,
            new_status: newStatus,
            status_text: {
              'pending': 'Gözləyir',
              'processing': 'Hazırlanır',
              'shipped': 'Göndərildi',
              'delivered': 'Çatdırıldı',
              'cancelled': 'Ləğv Edildi'
            }[newStatus] || newStatus
          }
        };
        window.dispatchEvent(new CustomEvent('newCustomerNotification', { detail: customerNotification }));
      } else {
        throw new Error('SupabaseService.updateOrderStatus returned no data');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Xəta",
        description: "Sifariş statusu yenilənə bilmədi.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      const result = await SupabaseService.updatePaymentStatus(orderId, newStatus);
      
      if (result) {
        await fetchOrders();
        toast({
          title: "Uğurla Yeniləndi",
          description: `Ödəniş statusu "${newStatus}" olaraq dəyişdirildi`,
        });
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Xəta",
        description: "Ödəniş statusu yenilənə bilmədi.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Admin paneline daxil olmaq üçün giriş edin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Kateqoriyalar</TabsTrigger>
          <TabsTrigger value="orders">Sifarişlər</TabsTrigger>
          <TabsTrigger value="payments">Ödənişlər</TabsTrigger>
          <TabsTrigger value="notifications">
            Bildirişlər
            {notifications.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Kateqoriyalar</CardTitle>
              <Button onClick={() => setShowCategoryForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Kateqoriya
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card key={category.id} className="relative">
                    <CardContent className="p-4">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <h3 className="font-semibold mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCategory(category);
                            setCategoryFormData({
                              name: category.name,
                              description: category.description,
                              image: category.image || '',
                              parent_id: category.parent_id
                            });
                            setShowCategoryForm(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {showCategoryForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingCategory ? 'Kateqoriyanı Redaktə Et' : 'Yeni Kateqoriya'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingCategory ? handleEditCategory : handleAddCategory}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Ad</Label>
                      <Input
                        id="name"
                        value={categoryFormData.name}
                        onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Təsvir</Label>
                      <Textarea
                        id="description"
                        value={categoryFormData.description}
                        onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Şəkil URL</Label>
                      <Input
                        id="image"
                        value={categoryFormData.image}
                        onChange={(e) => setCategoryFormData({...categoryFormData, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                      {categoryFormData.image && (
                        <img
                          src={categoryFormData.image}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded mt-2"
                        />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="parent">Ana Kateqoriya</Label>
                      <Select
                        value={categoryFormData.parent_id || ''}
                        onValueChange={(value) => setCategoryFormData({...categoryFormData, parent_id: value || null})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Ana kateqoriya seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Ana kateqoriya yoxdur</SelectItem>
                          {categories.filter(c => !c.parent_id).map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Yüklənir...' : (editingCategory ? 'Yenilə' : 'Əlavə Et')}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCategoryForm(false);
                          setEditingCategory(null);
                          setCategoryFormData({ name: '', description: '', image: '', parent_id: null });
                        }}
                      >
                        Ləğv Et
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sifarişlər</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Sifariş №</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Ad</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Soyad</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Şirkət</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">VÖEN</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Tarix</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Məbləğ</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="border border-gray-300 px-4 py-2">#{order.order_number || order.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{order.user_name || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">{order.user_surname || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">{order.company || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">{order.inn || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(order.created_at).toLocaleDateString('az-AZ')}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{order.total} ₼</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleOrderStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Gözləyir</SelectItem>
                                <SelectItem value="processing">Hazırlanır</SelectItem>
                                <SelectItem value="shipped">Göndərildi</SelectItem>
                                <SelectItem value="delivered">Çatdırıldı</SelectItem>
                                <SelectItem value="cancelled">Ləğv Edildi</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {selectedOrder && (
            <Card>
              <CardHeader>
                <CardTitle>Sifariş Detalları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Sifariş Nömrəsi</Label>
                      <p className="font-semibold">#{selectedOrder.order_number || selectedOrder.id}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div>
                      <Label>Müştəri</Label>
                      <p>{selectedOrder.user_name} {selectedOrder.user_surname}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p>{selectedOrder.user_email}</p>
                    </div>
                    <div>
                      <Label>Şirkət</Label>
                      <p>{selectedOrder.company || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>VÖEN</Label>
                      <p>{selectedOrder.inn || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Ünvan</Label>
                      <p>{selectedOrder.shippingAddress || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Ödəniş Metodu</Label>
                      <p>{selectedOrder.paymentMethod || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Cəmi</Label>
                      <p className="font-semibold">{selectedOrder.total} ₼</p>
                    </div>
                    <div>
                      <Label>Tarix</Label>
                      <p>{new Date(selectedOrder.created_at).toLocaleString('az-AZ')}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Sifariş Məhsulları</Label>
                    <div className="space-y-2 mt-2">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{item.product?.name || item.name}</p>
                            <p className="text-sm text-gray-600">Miqdar: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">{item.total_price || (item.unit_price * item.quantity)} ₼</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ödənişlər</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Sifariş №</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Ad</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Soyad</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Şirkət</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">VÖEN</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Tarix</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Ödəniş Metodu</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="border border-gray-300 px-4 py-2">#{order.order_number || order.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{order.user_name || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">{order.user_surname || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">{order.company || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">{order.inn || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(order.created_at).toLocaleDateString('az-AZ')}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{order.paymentMethod || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Badge className={getPaymentStatusColor(order.payment_status || 'pending')}>
                            {order.payment_status || 'pending'}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Select
                            value={order.payment_status || 'pending'}
                            onValueChange={(value) => handlePaymentStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Gözləyir</SelectItem>
                              <SelectItem value="paid">Ödənildi</SelectItem>
                              <SelectItem value="failed">Uğursuz</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bildirişlər</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Bell className="w-5 h-5 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-gray-600">{notification.message}</p>
                        <p className="text-sm text-gray-400 mt-2">
                          {new Date(notification.created_at).toLocaleString('az-AZ')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center text-gray-500">Hələ bildiriş yoxdur.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
