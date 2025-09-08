import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/use-toast';
import { calculateCartTotals } from '../utils/priceUtils';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, userDiscount } = useAuth();
  const { toast } = useToast();

  // Load orders from localStorage
  const loadOrders = () => {
    try {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  // Save orders to localStorage
  const saveOrders = (newOrders) => {
    try {
      localStorage.setItem('orders', JSON.stringify(newOrders));
      setOrders(newOrders);
      // Dispatch event for admin panel to update
      window.dispatchEvent(new CustomEvent('ordersUpdated'));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  // Create new order
  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      // Calculate totals with user discount
      const orderItems = orderData.items.map(item => ({
        price: item.price,
        quantity: item.quantity
      }));
      const totals = calculateCartTotals(orderItems, userDiscount);

      const newOrder = {
        id: `BP${Date.now().toString().slice(-10)}`,
        userId: user?.id,
        userEmail: user?.email,
        userName: `${user?.first_name} ${user?.last_name}`,
        userDiscount: userDiscount, // Save user discount at time of order
        date: new Date().toISOString().split('T')[0],
        status: 'pending', // pending, processing, shipped, completed, cancelled
        items: orderData.items,
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        discountPercentage: totals.discountPercentage,
        total: totals.total, // Use discounted total
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        company: orderData.company,
        inn: orderData.inn,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedOrders = [...orders, newOrder];
      saveOrders(updatedOrders);

      toast({
        title: 'Order Created',
        description: `Your order #${newOrder.id} has been placed successfully.`,
      });

      return { success: true, order: newOrder };
    } catch (error) {
      toast({
        title: 'Order Failed',
        description: 'Failed to create order. Please try again.',
        variant: 'destructive'
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update order status (admin only)
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });
    saveOrders(updatedOrders);

    // Find the order to show toast
    const order = orders.find(o => o.id === orderId);
    if (order) {
      toast({
        title: 'Order Status Updated',
        description: `Order #${orderId} status changed to ${newStatus}`,
      });
    }
  };

  // Get user's orders
  const getUserOrders = () => {
    if (!user) return [];
    return orders.filter(order => order.userId === user.id);
  };

  // Get all orders (admin only)
  const getAllOrders = () => {
    return orders;
  };

  // Get order by ID
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  useEffect(() => {
    loadOrders();
    
    // Listen for orders updates
    const handleOrdersUpdate = () => {
      loadOrders();
    };
    
    window.addEventListener('ordersUpdated', handleOrdersUpdate);
    
    return () => {
      window.removeEventListener('ordersUpdated', handleOrdersUpdate);
    };
  }, []);

  const value = {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    getUserOrders,
    getAllOrders,
    getOrderById,
    loadOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

