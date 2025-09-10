import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCategories } from "../contexts/CategoryContext";
import { useOrders } from "../contexts/OrderContext";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { 
  Users, Package, ShoppingCart, MessageSquare, 
  DollarSign, Eye, EyeOff, CheckCircle, XCircle,
  BarChart3, Search, Filter, Download, Trash2, UserPlus, Crown, Shield, Star, Truck, Globe, Edit, RefreshCw, Settings, ArrowLeft, X, Plus
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";
// Removed mockData import - using only Supabase
import { calculateCartTotals, formatPrice } from "../utils/priceUtils";
import SupabaseService from "../services/supabaseService";
import { supabase } from "../config/supabase";

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { getAllOrders, updateOrderStatus } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // User management states
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  
  // Edit user modal states
  const [editUserModal, setEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    country: '',
    city: '',
    vat_number: '',
    discount: 0
  });

  // Product management states
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [editProductModal, setEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductFormData, setEditProductFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    sku: '',
    catalogNumber: '',
    price: 0,
    stock_quantity: 0,
    description: '',
    images: [], // Changed to array for multiple images
    in_stock: true,
    specifications: {} // Add specifications object
  });

  // CSV Import states
  const [csvImportModal, setCsvImportModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvImportLoading, setCsvImportLoading] = useState(false);
  const [csvImportResults, setCsvImportResults] = useState(null);

  // 1C Integration states
  const [oneCStatus, setOneCStatus] = useState(null);
  const [oneCLogs, setOneCLogs] = useState([]);
  const [oneCTestLoading, setOneCTestLoading] = useState(false);
  const [oneCLogsLoading, setOneCLogsLoading] = useState(false);

  // Additional states for new sections
  const [localCategories, setLocalCategories] = useState([]);
  const [adminCategories, setAdminCategories] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // Specifications management
  const [specifications, setSpecifications] = useState([]);
  const [delivery, setDelivery] = useState([]);
  const [marketplaces, setMarketplaces] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [logo, setLogo] = useState(null);
  const [settings, setSettings] = useState({});
  const [security, setSecurity] = useState({});
  const [database, setDatabase] = useState({});

  // Order management states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Category management states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    parent_id: null,
    is_active: true
  });

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin() && user?.email !== 'admin@bilal-parts.com') {
      navigate("/");
      return;
    }
    fetchDashboardStats();
    // Only fetch notifications if user is admin
    if (isAdmin() && user?.email === 'admin@bilal-parts.com') {
      fetchNotifications();
    }
    
    // Listen for new notifications
    const handleNewNotification = (event) => {
      fetchNotifications();
      toast({
        title: "Yeni Bildirim",
        description: event.detail.message,
      });
    };

    window.addEventListener('newAdminNotification', handleNewNotification);
    
    return () => {
      window.removeEventListener('newAdminNotification', handleNewNotification);
    };
  }, [isAdmin, navigate, user]);

  // Load categories from context
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const fetchDashboardStats = async () => {
    try {
      console.log('Fetching dashboard stats from Supabase...');
      
      // Fetch real data from Supabase
      const [supabaseUsers, supabaseProducts, supabaseOrders] = await Promise.all([
        SupabaseService.getUsers().catch(() => []),
        SupabaseService.getProducts().catch(() => []),
        SupabaseService.getOrders().catch(() => [])
      ]);
      
      console.log('Dashboard stats data:', {
        users: supabaseUsers.length,
        products: supabaseProducts.length,
        orders: supabaseOrders.length
      });
      
      // Calculate stats from real data
      const stats = {
        users: {
          total: supabaseUsers.length,
          active: supabaseUsers.filter(u => u.is_approved !== false).length,
          inactive: supabaseUsers.filter(u => u.is_approved === false).length,
          pending: supabaseUsers.filter(u => u.is_approved === false).length
        },
        products: {
          total: supabaseProducts.length,
          in_stock: supabaseProducts.filter(p => p.in_stock).length,
          out_of_stock: supabaseProducts.filter(p => !p.in_stock).length
        },
        orders: {
          total: supabaseOrders.length,
          pending: supabaseOrders.filter(o => o.status === 'pending').length,
          completed: supabaseOrders.filter(o => o.status === 'delivered' || o.status === 'completed').length
        },
        revenue: {
          monthly: supabaseOrders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + (o.total_amount || 0), 0),
          average_order: supabaseOrders.length > 0 
            ? supabaseOrders
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, o) => sum + (o.total_amount || 0), 0) / supabaseOrders.length 
            : 0
        },
        messages: {
          unread: 0 // Will be updated when we implement contact messages
        },
        newsletter: {
          subscribers: 0 // Will be updated when we implement newsletter
        }
      };
      
      setDashboardStats(stats);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
      // Fallback to mock data
      const stats = {
        users: {
          total: mockData.users.length,
          active: mockData.users.filter(u => u.is_active).length,
          inactive: mockData.users.filter(u => !u.is_active).length,
          pending: mockData.users.filter(u => u.status === 'pending').length
        },
        products: {
          total: mockData.products.length,
          in_stock: mockData.products.filter(p => p.in_stock).length,
          out_of_stock: mockData.products.filter(p => !p.in_stock).length
        },
        orders: {
          total: mockData.orders.length,
          pending: mockData.orders.filter(o => o.status === 'pending').length,
          completed: mockData.orders.filter(o => o.status === 'delivered').length
        },
        revenue: {
          monthly: mockData.orders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.total_amount, 0),
          average_order: mockData.orders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.total_amount, 0) / mockData.orders.length || 0
        },
        messages: {
          unread: mockData.contactMessages.filter(m => !m.is_read).length
        },
        newsletter: {
          subscribers: mockData.newsletterSubscribers.length
        }
      };
      
      setDashboardStats(stats);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from Supabase...');
      const supabaseUsers = await SupabaseService.getUsers();
      console.log('Fetched users from Supabase:', supabaseUsers);
      setUsers(supabaseUsers || []);
    } catch (error) {
      console.error("Failed to fetch users from Supabase:", error);
      // Fallback to localStorage for now
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      setUsers(registeredUsers);
    }
  };

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders from Supabase...');
      const supabaseOrders = await SupabaseService.getOrders();
      console.log('Fetched orders from Supabase:', supabaseOrders);
      setOrders(supabaseOrders || []);
    } catch (error) {
      console.error("Failed to fetch orders from Supabase:", error);
      // Fallback to localStorage for now
      const allOrders = getAllOrders();
      setOrders(allOrders);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      console.log('Updating order status in Supabase:', orderId, newStatus);
      
      // Update order status in Supabase
      await SupabaseService.updateOrderStatus(orderId, newStatus);
      
      // Refresh orders from Supabase
      await fetchOrders();
      
      // Update selected order if it's currently open in modal
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({...selectedOrder, status: newStatus});
      }

      // Create customer notification in Supabase
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const notificationData = {
          user_id: order.user_id,
          type: 'order',
          title: 'Sifariş Status Yeniləndi',
          message: `Sizin #${order.order_number || orderId} nömrəli sifarişinizin statusu "${newStatus}" olaraq dəyişdi`,
          data: {
            order_id: orderId,
            order_number: order.order_number || orderId,
            new_status: newStatus,
            status_text: {
            'pending': 'Gözləyir',
            'confirmed': 'Təsdiqləndi',
            'processing': 'Hazırlanır',
            'shipped': 'Göndərildi', 
            'delivered': 'Çatdırıldı',
            'cancelled': 'Ləğv Edildi'
            }[newStatus] || newStatus
          }
        };

        // Create notification in Supabase
        await SupabaseService.createNotification(notificationData);

        // Dispatch event for customer notification
        window.dispatchEvent(new CustomEvent('newCustomerNotification', { detail: customerNotification }));
      }
      
      toast({
        title: "Uğurla Yeniləndi",
        description: `Sifariş statusu "${newStatus}" olaraq dəyişdirildi`,
      });
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Status dəyişdirilə bilmədi",
        variant: "destructive"
      });
    }
  };

  const fetchAllProducts = async () => {
    try {
      console.log('AdminPage: Fetching products from Supabase...');
      
      // Fetch categories from Supabase first
      const { data: supabaseCategories, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('name');
      
      if (catError) {
        console.error('Error fetching categories:', catError);
      } else {
        console.log('Fetched categories from Supabase:', supabaseCategories);
        setAdminCategories(supabaseCategories || []);
      }
      
      // Fetch products from Supabase
      const supabaseProducts = await SupabaseService.getProducts();
      
      if (supabaseProducts && supabaseProducts.length > 0) {
        // Format products for admin panel
        const formattedProducts = supabaseProducts.map(product => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          catalogNumber: product.catalog_number,
          price: parseFloat(product.price) || 0,
          originalPrice: parseFloat(product.original_price) || parseFloat(product.price) || 0,
          costPrice: parseFloat(product.cost_price) || 0,
          description: product.description || '',
          shortDescription: product.short_description || '',
          category: product.categories?.name || 'Unknown',
          subcategory: product.subcategories?.name || '',
          brand: product.brand || '',
          model: product.model || '',
          year: product.year || null,
          weight: product.weight || null,
          dimensions: product.dimensions || '',
          stock_quantity: product.stock_quantity || 0,
          in_stock: product.in_stock,
          is_featured: product.is_featured || false,
          is_active: product.is_active,
          images: product.product_images ? product.product_images.map(img => img.image_url) : [],
          image: product.product_images && product.product_images.length > 0 
            ? product.product_images[0].image_url 
            : 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=300&h=200&fit=crop',
          specifications: product.product_specifications ? 
            product.product_specifications.reduce((acc, spec) => {
              acc[spec.name] = spec.value;
              return acc;
            }, {}) : {},
          createdAt: product.created_at,
          updatedAt: product.updated_at
        }));
        
        console.log(`AdminPage: Loaded ${formattedProducts.length} products from Supabase`);
        setProducts(formattedProducts);
      } else {
        console.log('AdminPage: No products found in Supabase, using mock data');
        setProducts(mockData.products);
      }
    } catch (error) {
      console.error("AdminPage: Failed to fetch products from Supabase:", error);
      // Fallback to mock data
      setProducts(mockData.products);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      // Mock data'dan düşük stok ürünlerini al
      const lowStockProducts = mockData.products.filter(p => p.stock_quantity <= 10);
      setProducts(lowStockProducts);
    } catch (error) {
      console.error("Failed to fetch low stock products:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      setMessages(mockData.contactMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      console.log('Fetching admin notifications from Supabase...');
      const supabaseNotifications = await SupabaseService.getNotifications(null); // Admin notifications (no user_id)
      console.log('Fetched notifications from Supabase:', supabaseNotifications);
      setNotifications(supabaseNotifications || []);
      
      // Count unread notifications
      const unreadCount = (supabaseNotifications || []).filter(n => !n.is_read).length;
      setUnreadNotifications(unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications from Supabase:", error);
      // Fallback to localStorage for now
      const savedNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      setNotifications(savedNotifications);
      const unreadCount = savedNotifications.filter(n => !n.isRead).length;
      setUnreadNotifications(unreadCount);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      console.log('Marking notification as read in Supabase:', notificationId);
      
      // Mark notification as read in Supabase
      await SupabaseService.markNotificationAsRead(notificationId);
      
      // Refresh notifications from Supabase
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Fallback to localStorage
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
    
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
    setUnreadNotifications(unreadCount);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      console.log('Marking all notifications as read in Supabase');
      
      // Mark all notifications as read in Supabase
      await SupabaseService.markAllNotificationsAsRead(); // Admin notifications (no user_id)
      
      // Refresh notifications from Supabase
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Fallback to localStorage
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
    setUnreadNotifications(0);
    }
  };

  const handleUserToggle = async (userId) => {
    try {
      // Mock data'da user status'unu güncelle
      const userIndex = mockData.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockData.users[userIndex].is_active = !mockData.users[userIndex].is_active;
        toast({
          title: "Success",
          description: "User status updated successfully",
        });
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const handleUserDiscountUpdate = async (userId, newDiscount) => {
    try {
      console.log('Updating user discount in Supabase:', userId, newDiscount);
      
      // Update user in Supabase
      await SupabaseService.updateUser(userId, { discount: newDiscount });
      
      // Refresh users from Supabase
      await fetchUsers();
        
        // Show success toast after a short delay to avoid spam
        clearTimeout(window.discountUpdateTimeout);
        window.discountUpdateTimeout = setTimeout(() => {
          toast({
            title: "Success",
          description: `Discount updated to ${newDiscount}% in Supabase`,
          });
        }, 1000);
    } catch (error) {
      console.error('Error updating user discount:', error);
      toast({
        title: "Error",
        description: `Failed to update discount: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleUserApproval = async (userId, newStatus, discountValue = null) => {
    try {
      console.log('Updating user status in Supabase:', userId, newStatus, discountValue);
      
        // Handle both boolean (old way) and string (new way) parameters
        let status, isActive;
        if (typeof newStatus === 'boolean') {
        status = newStatus ? 'active' : 'suspended';
          isActive = newStatus;
        } else {
        status = newStatus.toLowerCase();
        isActive = newStatus.toLowerCase() === 'approved' || newStatus.toLowerCase() === 'active';
      }
      
      // Prepare update data
      const updateData = { status, is_active: isActive };
        if (discountValue !== null) {
        updateData.discount = parseFloat(discountValue) || 0;
        }
        
      // Update user in Supabase
      await SupabaseService.updateUser(userId, updateData);
        
      // Refresh users from Supabase
      await fetchUsers();
        
        toast({
          title: "Success",
        description: `User status updated to ${status}${discountValue !== null ? ` with ${discountValue}% discount` : ''} in Supabase`,
        });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: `Failed to update user status: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  const handleDeleteSelectedUsers = () => {
    if (selectedUsers.length === 0) return;
    
    setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
    setSelectedUsers([]);
    
    toast({
      title: "Success",
      description: `${selectedUsers.length} users deleted successfully`,
    });
  };

  const handleDeleteAllUsers = () => {
    setUsers([]);
    setSelectedUsers([]);
    
    toast({
      title: "Success",
      description: "All users deleted successfully",
    });
  };

  const handleExportUsers = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,First Name,Last Name,Email,Role,Status,Country,City\n" +
      users.map(u => `${u.id},${u.first_name},${u.last_name},${u.email},${u.role},${u.status},${u.country || '-'},${u.city || '-'}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Users exported successfully",
    });
  };

  const openEditUserModal = (user) => {
    setEditingUser(user);
    setEditFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || '',
      company_name: user.company_name || '',
      country: user.country || '',
      city: user.city || '',
      vat_number: user.vat_number || '',
      discount: user.discount || 0
    });
    setEditUserModal(true);
  };

  const handleEditUser = async () => {
    try {
      // Update local state
      const userIndex = users.findIndex(u => u.id === editingUser.id);
      if (userIndex !== -1) {
        const updatedUsers = [...users];
        updatedUsers[userIndex] = {
          ...updatedUsers[userIndex],
          ...editFormData,
          discount: parseFloat(editFormData.discount) || 0 // Ensure discount is saved as number
        };
        setUsers(updatedUsers);
        
        // Also update localStorage if this user exists in registeredUsers
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const registeredUserIndex = registeredUsers.findIndex(u => u.id === editingUser.id);
        if (registeredUserIndex !== -1) {
          registeredUsers[registeredUserIndex] = {
            ...registeredUsers[registeredUserIndex],
            ...editFormData,
            discount: parseFloat(editFormData.discount) || 0
          };
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
        
        toast({
          title: "Success",
          description: "User updated successfully",
        });
        
        setEditUserModal(false);
        setEditingUser(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditProductFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleDeleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) return;
    
    try {
      // Delete products from Supabase
      for (const productId of selectedProducts) {
        await SupabaseService.deleteProduct(productId);
      }
      
      // Refresh products list
      await fetchAllProducts();
    setSelectedProducts([]);
    
    toast({
      title: "Success",
        description: `${selectedProducts.length} products deleted successfully from Supabase`,
      });
    } catch (error) {
      console.error('Error deleting products:', error);
      toast({
        title: "Error",
        description: `Failed to delete products: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteAllProducts = () => {
    setProducts([]);
    setSelectedProducts([]);
    
    toast({
      title: "Success",
      description: "All products deleted successfully",
    });
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setEditProductFormData({
      name: product.name || '',
      category: product.category || '',
      subcategory: product.subcategory || 'none',
      sku: product.sku || '',
      catalogNumber: product.catalogNumber || '',
      price: product.originalPrice || product.price || 0,
      stock_quantity: product.stock_quantity || 0,
      description: product.description || '',
      images: product.images ? [...product.images] : (product.image ? [product.image] : []),
      in_stock: product.in_stock !== undefined ? product.in_stock : true,
      specifications: product.specifications || {}
    });
    
    // Load specifications into the specifications state
    if (product.specifications) {
      const specsArray = Object.entries(product.specifications).map(([key, value]) => ({
        key,
        value
      }));
      setSpecifications(specsArray);
    } else {
      setSpecifications([]);
    }
    
    setEditProductModal(true);
  };

  const handleEditProduct = async () => {
    try {
      // Convert specifications array to object
      const specificationsObj = convertSpecificationsToObject();
      
      if (editingProduct) {
        // Update existing product
        const productIndex = products.findIndex(p => p.id === editingProduct.id);
        if (productIndex !== -1) {
          const updatedProducts = [...products];
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            ...editProductFormData,
            originalPrice: editProductFormData.price, // Save original price
            subcategory: editProductFormData.subcategory === 'none' ? '' : editProductFormData.subcategory,
            specifications: specificationsObj,
            updatedAt: new Date().toISOString()
          };
          setProducts(updatedProducts);
          
          // Save to localStorage
          localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
          
          toast({
            title: "Success",
            description: "Product updated successfully",
          });
        }
      } else {
        // Create new product in Supabase
        try {
          // Get categories from Supabase instead of localStorage
          const { data: supabaseCategories, error: catError } = await supabase
            .from('categories')
            .select('id, name')
            .eq('is_active', true);
          
          if (catError) {
            throw new Error(`Failed to fetch categories: ${catError.message}`);
          }
          
          // Find category ID
          console.log('Available categories in Supabase:', supabaseCategories.map(c => c.name));
          console.log('Looking for category:', editProductFormData.category);
          
          const category = supabaseCategories.find(cat => cat.name === editProductFormData.category);
          if (!category) {
            console.error('Category not found. Available categories:', supabaseCategories);
            throw new Error(`Category "${editProductFormData.category}" not found in Supabase. Available: ${supabaseCategories.map(c => c.name).join(', ')}`);
          }
          
          console.log('Found category:', category);
          console.log('Category ID:', category.id, 'Type:', typeof category.id);
          
          // Prepare product data for Supabase (don't include ID, let Supabase generate it)
          const productData = {
            name: editProductFormData.name,
            sku: editProductFormData.sku,
            catalog_number: editProductFormData.catalogNumber,
            description: editProductFormData.description,
            short_description: editProductFormData.shortDescription,
            price: parseFloat(editProductFormData.price),
            original_price: parseFloat(editProductFormData.originalPrice || editProductFormData.price),
            cost_price: parseFloat(editProductFormData.costPrice || 0),
            stock_quantity: parseInt(editProductFormData.stock_quantity || 0),
            category_id: category.id,
            brand: editProductFormData.brand || '',
            model: editProductFormData.model || '',
            year: editProductFormData.year ? parseInt(editProductFormData.year) : null,
            weight: editProductFormData.weight ? parseFloat(editProductFormData.weight) : null,
            dimensions: editProductFormData.dimensions || '',
            is_active: true,
            is_featured: editProductFormData.is_featured || false,
            in_stock: parseInt(editProductFormData.stock_quantity || 0) > 0
          };
          
          console.log('Creating product with data:', productData);
          
          // Create product in Supabase
          const { data: newProduct, error: productError } = await SupabaseService.createProduct(productData);
          
          if (productError) {
            throw productError;
          }
          
          // Add images if provided
          if (editProductFormData.images && editProductFormData.images.length > 0) {
            for (let i = 0; i < editProductFormData.images.length; i++) {
              await supabase
                .from('product_images')
                .insert({
                  product_id: newProduct.id,
                  image_url: editProductFormData.images[i],
                  alt_text: `${editProductFormData.name} - Image ${i + 1}`,
                  is_primary: i === 0,
                  sort_order: i + 1
                });
            }
          }
          
          // Add specifications if provided
          if (specifications && specifications.length > 0) {
            for (let i = 0; i < specifications.length; i++) {
              await supabase
                .from('product_specifications')
                .insert({
                  product_id: newProduct.id,
                  name: specifications[i].name,
                  value: specifications[i].value,
                  unit: specifications[i].unit || '',
                  sort_order: i + 1
                });
            }
          }
          
          // Refresh products list
          await fetchAllProducts();
        
        toast({
          title: "Success",
            description: "New product created successfully in Supabase",
          });
          
        } catch (error) {
          console.error('Error creating product:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          toast({
            title: "Error",
            description: `Failed to create product: ${error.message || 'Unknown error'}`,
            variant: "destructive"
          });
        }
      }
      
      setEditProductModal(false);
      setEditingProduct(null);
      setSpecifications([]); // Reset specifications
    } catch (error) {
      toast({
        title: "Error",
        description: editingProduct ? "Failed to update product" : "Failed to create product",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const promises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target.result);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(images => {
        setEditProductFormData(prev => ({
          ...prev,
          images: [...prev.images, ...images]
        }));
      });
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setEditProductFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Get subcategories for selected category
  const getSubcategoriesForCategory = (categoryName) => {
    const category = localCategories.find(cat => cat.name === categoryName);
    return category?.subcategories || [];
  };

  // Handle category change in product form
  const handleCategoryChange = (categoryName) => {
    setEditProductFormData(prev => ({
      ...prev,
      category: categoryName,
      subcategory: 'none' // Reset subcategory when category changes
    }));
  };

  // Excel Export Products
  const handleExportProducts = () => {
    // Create Excel workbook
    const worksheet = XLSX.utils.json_to_sheet(
      products.map(p => ({
        'Name': p.name || '',
        'Category': p.category || '',
        'Subcategory': p.subcategory || '',
        'SKU': p.sku || '',
        'Catalog Number': p.catalogNumber || '',
        'Price': p.originalPrice || p.price || 0,
        'Stock Quantity': p.stock_quantity || 0,
        'Description': p.description || '',
        'In Stock': p.in_stock ? 'Yes' : 'No'
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    
    // Export as Excel file
    XLSX.writeFile(workbook, `products_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Success",
      description: "Products exported to Excel successfully",
    });
  };

  // CSV Import function
  const handleCsvImport = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file first",
        variant: "destructive"
      });
      return;
    }

    setCsvImportLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('csvFile', csvFile);

      const response = await fetch('/api/upload/csv-products', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Import failed');
      }

      setCsvImportResults(result);
      
      // Refresh products list
      fetchAllProducts();
      
      toast({
        title: "Success",
        description: `CSV import completed: ${result.summary.successful} products imported, ${result.summary.failed} failed`,
      });

    } catch (error) {
      console.error('CSV import error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to import CSV file",
        variant: "destructive"
      });
    } finally {
      setCsvImportLoading(false);
    }
  };

  const handleCsvFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid CSV file",
        variant: "destructive"
      });
    }
  };

  // 1C Integration functions
  const fetch1CStatus = async () => {
    try {
      const response = await fetch('/api/1c/status', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setOneCStatus(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch 1C status:', error);
    }
  };

  const fetch1CLogs = async () => {
    setOneCLogsLoading(true);
    try {
      const response = await fetch('/api/1c/logs?lines=50', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setOneCLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch 1C logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch 1C logs",
        variant: "destructive"
      });
    } finally {
      setOneCLogsLoading(false);
    }
  };

  const test1CConnection = async () => {
    setOneCTestLoading(true);
    try {
      const response = await fetch('/api/1c/test-connection', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "1C connection test successful",
        });
        fetch1CStatus(); // Refresh status
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('1C connection test failed:', error);
      toast({
        title: "Error",
        description: "1C connection test failed",
        variant: "destructive"
      });
    } finally {
      setOneCTestLoading(false);
    }
  };

  // Excel Import Products
  // CSV parsing function that handles quoted fields properly
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const handleImportProducts = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let newProducts = [];
        
        // Check file type
        if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
          // Handle Excel files
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            toast({
              title: "Error",
              description: "Excel file must have at least a header and one data row",
              variant: "destructive"
            });
            return;
          }
          
          console.log('Excel Data:', jsonData); // Debug log
          
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row && row.length >= 9) {
              const product = {
                id: `product-${Date.now()}-${i}`,
                name: String(row[0] || ''),
                category: String(row[1] || ''),
                subcategory: String(row[2] || ''),
                sku: String(row[3] || ''),
                catalogNumber: String(row[4] || ''),
                price: parseFloat(row[5]) || 0,
                originalPrice: parseFloat(row[5]) || 0,
                stock_quantity: parseInt(row[6]) || 0,
                description: String(row[7] || ''),
                in_stock: String(row[8] || '').toLowerCase() === 'yes',
                images: [],
                createdAt: new Date().toISOString()
              };
              newProducts.push(product);
            }
          }
        } else {
          // Handle CSV files
          const csv = event.target.result;
          const lines = csv.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            toast({
              title: "Error",
              description: "CSV file must have at least a header and one data row",
              variant: "destructive"
            });
            return;
          }
          
          const headers = parseCSVLine(lines[0]);
          console.log('CSV Headers:', headers);
          
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
              const values = parseCSVLine(line);
              console.log(`Row ${i} values:`, values);
              
              if (values.length >= 9) {
                const product = {
                  id: `product-${Date.now()}-${i}`,
                  name: values[0]?.replace(/"/g, '') || '',
                  category: values[1]?.replace(/"/g, '') || '',
                  subcategory: values[2]?.replace(/"/g, '') || '',
                  sku: values[3]?.replace(/"/g, '') || '',
                  catalogNumber: values[4]?.replace(/"/g, '') || '',
                  price: parseFloat(values[5]) || 0,
                  originalPrice: parseFloat(values[5]) || 0,
                  stock_quantity: parseInt(values[6]) || 0,
                  description: values[7]?.replace(/"/g, '') || '',
                  in_stock: values[8]?.replace(/"/g, '').toLowerCase() === 'yes',
                  images: [],
                  createdAt: new Date().toISOString()
                };
                newProducts.push(product);
              }
            }
          }
        }
        
        if (newProducts.length > 0) {
          // Update existing products or add new ones based on SKU
          setProducts(prev => {
            const updatedProducts = [...prev];
            let addedCount = 0;
            let updatedCount = 0;
            
            newProducts.forEach(newProduct => {
              const existingIndex = updatedProducts.findIndex(p => p.sku === newProduct.sku);
              
              if (existingIndex !== -1) {
                // Update existing product
                updatedProducts[existingIndex] = {
                  ...updatedProducts[existingIndex],
                  name: newProduct.name,
                  category: newProduct.category,
                  subcategory: newProduct.subcategory,
                  catalogNumber: newProduct.catalogNumber,
                  price: newProduct.price,
                  originalPrice: newProduct.originalPrice,
                  stock_quantity: newProduct.stock_quantity,
                  description: newProduct.description,
                  in_stock: newProduct.in_stock,
                  updatedAt: new Date().toISOString()
                };
                updatedCount++;
              } else {
                // Add new product
                updatedProducts.push(newProduct);
                addedCount++;
              }
            });
            
            return updatedProducts;
          });
          
          toast({
            title: "Success",
            description: `${addedCount} new products added, ${updatedCount} existing products updated`,
          });
        } else {
          toast({
            title: "Error",
            description: "No valid products found in file",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to import products. Please check file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  };

  const handleMarkMessageRead = async (messageId) => {
    try {
      // Mock data'da message'ı read olarak işaretle
      const messageIndex = mockData.contactMessages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        mockData.contactMessages[messageIndex].is_read = true;
        toast({
          title: "Success",
          description: "Message marked as read",
        });
        fetchMessages();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesCountry = countryFilter === "all" || user.country === countryFilter;
    const matchesCity = cityFilter === "all" || user.city === cityFilter;
    
    return matchesSearch && matchesStatus && matchesRole && matchesCountry && matchesCity;
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                         (product.catalogNumber && product.catalogNumber.toLowerCase().includes(productSearchTerm.toLowerCase())) ||
                         (product.description && product.description.toLowerCase().includes(productSearchTerm.toLowerCase()));
    
    const matchesCategory = productCategoryFilter === "all" || product.category === productCategoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const fetchCategories = async () => {
    try {
      // Load categories from Supabase
      const supabaseCategories = await SupabaseService.getCategories();
      
      if (supabaseCategories && supabaseCategories.length > 0) {
        // Convert Supabase categories to admin format
        // Show both main and sub categories, but format them properly
        const formattedCategories = supabaseCategories.map(cat => {
          const isSubcategory = cat.parent_id !== null;
          const parentCategory = isSubcategory ? 
            supabaseCategories.find(p => p.id === cat.parent_id) : null;
          
          return {
            id: cat.id,
            name: isSubcategory ? `  └─ ${cat.name}` : cat.name, // Indent subcategories
            originalName: cat.name, // Keep original name for operations
            description: cat.description || '',
            image: cat.image || cat.image_url || '',
            parent_id: cat.parent_id,
            parent_name: parentCategory ? parentCategory.name : null,
            is_active: cat.is_active,
            sort_order: cat.sort_order || 0,
            slug: cat.slug || '',
            created_at: cat.created_at,
            updated_at: cat.updated_at,
            is_subcategory: isSubcategory
          };
        });
        
        // Sort categories: main categories first, then subcategories under their parents
        const sortedCategories = formattedCategories.sort((a, b) => {
          if (a.parent_id === null && b.parent_id === null) {
            return a.sort_order - b.sort_order;
          }
          if (a.parent_id === null) return -1;
          if (b.parent_id === null) return 1;
          if (a.parent_id === b.parent_id) {
            return a.sort_order - b.sort_order;
          }
          return 0;
        });
        
        // Get product counts for each category
        const categoriesWithCounts = await Promise.all(
          sortedCategories.map(async (category) => {
            try {
              const { count } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('category_id', category.id);
              
              return {
                ...category,
                product_count: count || 0
              };
            } catch (error) {
              console.error(`Error getting product count for category ${category.name}:`, error);
              return {
                ...category,
                product_count: 0
              };
            }
          })
        );
        
        setAdminCategories(categoriesWithCounts);
        console.log('Admin categories loaded from Supabase with product counts:', categoriesWithCounts);
        return;
      }
      
      // Fallback to localStorage if Supabase is empty
      const savedCategories = localStorage.getItem('adminCategories');
      
      if (savedCategories) {
        setAdminCategories(JSON.parse(savedCategories));
        return;
      }
      
      // If no saved categories, load default mock categories
      const mockCategories = [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Forklift",
          description: "Forklift parts and accessories",
          product_count: 45,
          is_active: true,
          parent_id: null,
          subcategories: [
            { id: "1-1", name: "Electric Forklifts", description: "Electric forklift components", product_count: 15, is_active: true, parent_id: "1" },
            { id: "1-2", name: "Diesel Forklifts", description: "Diesel forklift components", product_count: 18, is_active: true, parent_id: "1" },
            { id: "1-3", name: "LPG Forklifts", description: "LPG forklift components", product_count: 12, is_active: true, parent_id: "1" },
            { id: "1-4", name: "Warehouse Forklifts", description: "Warehouse forklift components", product_count: 20, is_active: true, parent_id: "1" }
          ]
        },
        {
          id: "2",
          name: "Engine Parts",
          description: "Engine components and parts",
          product_count: 38,
          is_active: true,
          parent_id: null,
          subcategories: [
            { id: "2-1", name: "Pistons & Rings", description: "Pistons and piston rings", product_count: 12, is_active: true, parent_id: "2" },
            { id: "2-2", name: "Crankshafts", description: "Engine crankshafts", product_count: 8, is_active: true, parent_id: "2" },
            { id: "2-3", name: "Cylinder Heads", description: "Cylinder head components", product_count: 10, is_active: true, parent_id: "2" },
            { id: "2-4", name: "Valves & Springs", description: "Engine valves and springs", product_count: 8, is_active: true, parent_id: "2" }
          ]
        },
        {
          id: "3",
          name: "Cooling Parts",
          description: "Cooling system components",
          product_count: 22,
          is_active: true,
          parent_id: null,
          subcategories: [
            { id: "3-1", name: "Radiators", description: "Cooling radiators", product_count: 8, is_active: true, parent_id: "3" },
            { id: "3-2", name: "Water Pumps", description: "Water pump components", product_count: 6, is_active: true, parent_id: "3" },
            { id: "3-3", name: "Thermostats", description: "Thermostat components", product_count: 4, is_active: true, parent_id: "3" },
            { id: "3-4", name: "Cooling Fans", description: "Cooling fan components", product_count: 4, is_active: true, parent_id: "3" }
          ]
        },
        {
          id: "4",
          name: "Filters",
          description: "Various filter types",
          product_count: 28,
          is_active: true,
          parent_id: null,
          subcategories: [
            { id: "4-1", name: "Air Filters", description: "Air filtration systems", product_count: 10, is_active: true, parent_id: "4" },
            { id: "4-2", name: "Oil Filters", description: "Oil filtration systems", product_count: 8, is_active: true, parent_id: "4" },
            { id: "4-3", name: "Fuel Filters", description: "Fuel filtration systems", product_count: 6, is_active: true, parent_id: "4" },
            { id: "4-4", name: "Hydraulic Filters", description: "Hydraulic filtration systems", product_count: 4, is_active: true, parent_id: "4" }
          ]
        },
        {
          id: "5",
          name: "Transmission Parts",
          description: "Transmission system components",
          product_count: 32,
          is_active: true,
          parent_id: null,
          subcategories: [
            { id: "5-1", name: "Gears", description: "Transmission gears", product_count: 12, is_active: true, parent_id: "5" },
            { id: "5-2", name: "Clutches", description: "Clutch components", product_count: 8, is_active: true, parent_id: "5" },
            { id: "5-3", name: "Drive Shafts", description: "Drive shaft components", product_count: 6, is_active: true, parent_id: "5" },
            { id: "5-4", name: "Transmission Cases", description: "Transmission case components", product_count: 6, is_active: true, parent_id: "5" }
          ]
        },
        {
          id: "6",
          name: "Hydraulic Parts",
          description: "Hydraulic system components",
          product_count: 25,
          is_active: true,
          parent_id: null,
          subcategories: [
            { id: "6-1", name: "Hydraulic Pumps", description: "Hydraulic pump components", product_count: 8, is_active: true, parent_id: "6" },
            { id: "6-2", name: "Hydraulic Cylinders", description: "Hydraulic cylinder components", product_count: 10, is_active: true, parent_id: "6" },
            { id: "6-3", name: "Control Valves", description: "Hydraulic control valves", product_count: 4, is_active: true, parent_id: "6" },
            { id: "6-4", name: "Hydraulic Hoses", description: "Hydraulic hose components", product_count: 3, is_active: true, parent_id: "6" }
          ]
        },
        {
          id: "7",
          name: "Electrical Parts",
          description: "Electrical system components",
          product_count: 30,
          is_active: true,
          parent_id: null,
          subcategories: [
            { id: "7-1", name: "Switches", description: "Electrical switches", product_count: 12, is_active: true, parent_id: "7" },
            { id: "7-2", name: "Wiring", description: "Electrical wiring components", product_count: 8, is_active: true, parent_id: "7" },
            { id: "7-3", name: "Chargers", description: "Charging system components", product_count: 6, is_active: true, parent_id: "7" },
            { id: "7-4", name: "Sensors", description: "Electrical sensors", product_count: 4, is_active: true, parent_id: "7" }
          ]
        }
      ];
      
      setAdminCategories(mockCategories);
      // Save default categories to localStorage
      localStorage.setItem('adminCategories', JSON.stringify(mockCategories));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('categoriesUpdated'));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const mockPayments = [
        { id: "1", order_id: "ORD-001", amount: 1500, method: "Credit Card", status: "completed", date: "2024-03-01" },
        { id: "2", order_id: "ORD-002", amount: 2300, method: "Bank Transfer", status: "pending", date: "2024-03-02" },
        { id: "3", order_id: "ORD-003", amount: 800, method: "Cash", status: "completed", date: "2024-03-03" }
      ];
      setPayments(mockPayments);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const mockReviews = [
        { id: "1", product_name: "FORWARD and REVERSE SWITCH", customer: "Ahmed Ali", rating: 5, comment: "Excellent quality", status: "approved" },
        { id: "2", product_name: "Hydraulic Pump", customer: "Maria Garcia", rating: 4, comment: "Good product", status: "pending" },
        { id: "3", product_name: "Brake Pads", customer: "John Smith", rating: 3, comment: "Average", status: "rejected" }
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const fetchDelivery = async () => {
    try {
      const mockDelivery = [
        { id: "1", order_id: "ORD-001", method: "Express", status: "delivered", tracking: "TRK-123456", date: "2024-03-01" },
        { id: "2", order_id: "ORD-002", method: "Standard", status: "in_transit", tracking: "TRK-123457", date: "2024-03-02" },
        { id: "3", order_id: "ORD-003", method: "Local Pickup", status: "ready", tracking: "N/A", date: "2024-03-03" }
      ];
      setDelivery(mockDelivery);
    } catch (error) {
      console.error("Failed to fetch delivery:", error);
    }
  };

  const fetchMarketplaces = async () => {
    try {
      const mockMarketplaces = [
        { id: "1", name: "Amazon", status: "active", products_count: 150, last_sync: "2024-03-01" },
        { id: "2", name: "eBay", status: "active", products_count: 120, last_sync: "2024-03-01" },
        { id: "3", name: "Walmart", status: "inactive", products_count: 0, last_sync: "2024-02-28" }
      ];
      setMarketplaces(mockMarketplaces);
    } catch (error) {
      console.error("Failed to fetch marketplaces:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const mockAnalytics = {
        sales: { daily: 2500, weekly: 15000, monthly: 65000 },
        visitors: { daily: 150, weekly: 900, monthly: 3800 },
        conversion: { rate: 2.5, trend: "+0.3%" },
        top_products: [
          { name: "FORWARD and REVERSE SWITCH", sales: 45 },
          { name: "Hydraulic Pump", sales: 38 },
          { name: "Brake Pads", sales: 32 }
        ]
      };
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Təsdiqlənmiş</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Gözləyir</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rədd edildi</Badge>;
      default:
        return <Badge variant="outline">Bilinmir</Badge>;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  // Category management functions
  const handleSelectCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === adminCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(adminCategories.map(c => c.id));
    }
  };

  const handleDeleteSelectedCategories = async () => {
    if (selectedCategories.length === 0) return;
    
    try {
      console.log('Deleting categories:', selectedCategories);
      
      // Delete categories from Supabase
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .in('id', selectedCategories);
      
      if (deleteError) {
        console.error('Supabase category deletion error:', deleteError);
        throw new Error(`Failed to delete categories: ${deleteError.message}`);
      }
      
      console.log('Categories deleted successfully from Supabase');
      
      // Refresh categories and products
      await fetchAllProducts();
      
      setSelectedCategories([]);
    
    toast({
      title: "Success",
        description: `${selectedCategories.length} categories deleted successfully from Supabase`,
      });
    } catch (error) {
      console.error('Error deleting categories:', error);
      toast({
        title: "Error",
        description: `Failed to delete categories: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteAllCategories = async () => {
    try {
      console.log('Deleting all categories from Supabase');
      
      // Delete all categories from Supabase
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (this condition is always true)
      
      if (deleteError) {
        console.error('Supabase delete all categories error:', deleteError);
        throw new Error(`Failed to delete all categories: ${deleteError.message}`);
      }
      
      console.log('All categories deleted successfully from Supabase');
      
      // Refresh categories and products
      await fetchAllProducts();
      
      setSelectedCategories([]);
    
    toast({
      title: "Success",
        description: "All categories deleted successfully from Supabase",
      });
    } catch (error) {
      console.error('Error deleting all categories:', error);
      toast({
        title: "Error",
        description: `Failed to delete all categories: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const openAddCategoryModal = () => {
    setCategoryFormData({
      name: '',
      description: '',
      parent_id: "main",
      is_active: true
    });
    setAddCategoryModal(true);
  };

  const openEditCategoryModal = (category) => {
    console.log('Opening edit modal for category:', category);
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || '',
      parent_id: category.parent_id,
      is_active: category.is_active
    });
    setEditCategoryModal(true);
  };

  const handleAddCategory = async () => {
    try {
      console.log('Creating category with data:', categoryFormData);
      
      // Validate parent_id is a valid UUID
      let parentId = null;
      if (categoryFormData.parent_id && categoryFormData.parent_id !== "main" && categoryFormData.parent_id !== null) {
        // Check if it's a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(categoryFormData.parent_id)) {
          parentId = categoryFormData.parent_id;
        } else {
          console.error('Invalid UUID format for parent_id:', categoryFormData.parent_id);
          toast({
            title: 'Error',
            description: 'Invalid parent category selection. Please select a valid category.',
            variant: 'destructive'
          });
          return;
        }
      }
      
      // Prepare category data for Supabase
      const categoryData = {
        name: categoryFormData.name,
        description: categoryFormData.description || '',
        slug: categoryFormData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        parent_id: parentId,
        is_active: categoryFormData.is_active,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
      };
      
      console.log('Category data for Supabase:', categoryData);
      
      // Insert category into Supabase
      const { data: newCategory, error: categoryError } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();
      
      if (categoryError) {
        console.error('Supabase category creation error:', categoryError);
        throw new Error(`Failed to create category: ${categoryError.message}`);
      }
      
      console.log('Category created successfully:', newCategory);
      
      // Refresh categories and products
      await fetchAllProducts();
      
      toast({
        title: "Success",
        description: "Category added successfully to Supabase",
      });
      
      setAddCategoryModal(false);
      setCategoryFormData({
        name: '',
        description: '',
        parent_id: "main",
        is_active: true
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: `Failed to add category: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleEditCategory = async () => {
    try {
      console.log('Updating category:', editingCategory.id, 'with data:', categoryFormData);
      
      // Prepare update data for Supabase
      const updateData = {
        name: categoryFormData.name,
        description: categoryFormData.description || '',
        slug: categoryFormData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        is_active: categoryFormData.is_active
      };
      
      console.log('Update data for Supabase:', updateData);
      
      // Update category in Supabase
      const { data: updatedCategory, error: updateError } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', editingCategory.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Supabase category update error:', updateError);
        throw new Error(`Failed to update category: ${updateError.message}`);
      }
      
      console.log('Category updated successfully:', updatedCategory);
      
      // Refresh categories and products
      await fetchAllProducts();
        
        toast({
          title: "Success",
        description: "Category updated successfully in Supabase",
        });
        
        setEditCategoryModal(false);
        setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: `Failed to update category: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredCategories = adminCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
                         (category.description && category.description.toLowerCase().includes(categorySearchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Specifications management functions
  const addSpecification = () => {
    setSpecifications(prev => [...prev, { key: '', value: '' }]);
  };

  const removeSpecification = (index) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  };

  const updateSpecification = (index, field, value) => {
    setSpecifications(prev => prev.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    ));
  };

  const convertSpecificationsToObject = () => {
    const specsObj = {};
    specifications.forEach(spec => {
      if (spec.key && spec.value) {
        specsObj[spec.key] = spec.value;
      }
    });
    return specsObj;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Panel</h1>
          
          {/* Navigation Menu */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "dashboard" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("users"); fetchUsers(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "users" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Users</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("products"); fetchAllProducts(); fetchCategories(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "products" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Products</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("categories"); fetchCategories(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "categories" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Categories</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("orders"); fetchOrders(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "orders" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Orders</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("payments"); fetchPayments(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "payments" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Payments</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("1c-integration"); fetch1CStatus(); fetch1CLogs(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "1c-integration" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-medium">1C İnteqrasiya</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("reviews"); fetchReviews(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "reviews" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Star className="w-5 h-5" />
              <span className="font-medium">Reviews</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("delivery"); fetchDelivery(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "delivery" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Truck className="w-5 h-5" />
              <span className="font-medium">Delivery</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("marketplaces"); fetchMarketplaces(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "marketplaces" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">Marketplaces</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("analytics"); fetchAnalytics(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "analytics" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </button>
            
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "settings" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
            
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "security" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Security</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("notifications"); fetchNotifications(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "notifications" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <MessageSquare className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs bg-red-600 text-white rounded-full flex items-center justify-center"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </div>
              <span className="font-medium">Notifications</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("messages"); fetchMessages(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "messages" 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Messages</span>
            </button>
          </nav>
          
          {/* Back to Website Button */}
          <div className="mt-8 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="w-full border-red-600 text-red-600 hover:bg-red-50"
            >
              Back to Website
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">{activeTab}</h2>
              <p className="text-gray-600">Welcome back, {user?.first_name}</p>
            </div>
            
            {/* Notifications Button in Header */}
            <div className="flex items-center space-x-4">
              <Button
                variant={activeTab === "notifications" ? "default" : "outline"}
                size="sm"
                onClick={() => { setActiveTab("notifications"); fetchNotifications(); }}
                className="relative"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Notifications
                {unreadNotifications > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-600 text-white rounded-full flex items-center justify-center"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              
              {/* Quick Actions */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Website
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <div className="space-y-6">
          {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.users?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                        {dashboardStats?.users?.active || 0} active, {dashboardStats?.users?.pending || 0} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.products?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats?.products?.in_stock || 0} in stock
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.orders?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats?.orders?.pending || 0} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardStats?.revenue?.monthly || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("products")}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Check Low Stock
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("messages")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Messages
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Unread Messages</span>
                      <Badge variant="secondary">{dashboardStats?.messages?.unread || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Newsletter Subscribers</span>
                      <Badge variant="secondary">{dashboardStats?.newsletter?.subscribers || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Out of Stock Products</span>
                      <Badge variant="destructive">{dashboardStats?.products?.out_of_stock || 0}</Badge>
                    </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Pending Users</span>
                          <Badge variant="secondary">{dashboardStats?.users?.pending || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
              </div>
            )}

          {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
            <Card>
              <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold">İstifadəçilərin idarə edilməsi</CardTitle>
                        <p className="text-gray-600 mt-1">İstifadəçilərin və onların hüquqlarının idarə edilməsi</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={handleDeleteSelectedUsers}
                          disabled={selectedUsers.length === 0}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Seçilənləri sil
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={handleDeleteAllUsers}
                          disabled={users.length === 0}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Bütün istifadəçiləri sil
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => {/* Add user modal */}}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          + İstifadəçi əlavə et
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleExportUsers}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          İxrac et
                        </Button>
                      </div>
                    </div>
              </CardHeader>
              <CardContent>
                    {/* Search and Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Axtarış</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Ad və ya email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Bütün statuslar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Bütün statuslar</SelectItem>
                            <SelectItem value="pending">Gözləyir</SelectItem>
                            <SelectItem value="approved">Təsdiqlənmiş</SelectItem>
                            <SelectItem value="rejected">Rədd edildi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Bütün rollar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Bütün rollar</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="customer">Müştəri</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ölkə</label>
                        <Select value={countryFilter} onValueChange={setCountryFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Bütün ölkələr" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Bütün ölkələr</SelectItem>
                            <SelectItem value="Azerbaijan">Azerbaijan</SelectItem>
                            <SelectItem value="Spain">Spain</SelectItem>
                            <SelectItem value="Turkey">Turkey</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setRoleFilter("all");
                            setCountryFilter("all");
                            setCityFilter("all");
                          }}
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          Sıfırla
                        </Button>
                      </div>
                    </div>

                    {/* Users Table */}
                <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">İstifadəçilər ({filteredUsers.length})</h3>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-3 text-left">
                                <Checkbox 
                                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                  onCheckedChange={handleSelectAllUsers}
                                />
                              </th>
                              <th className="border border-gray-200 p-3 text-left font-medium">İSTİFADƏÇİ</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">FIRMA</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">VÖEN</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">ƏLAQƏ</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">ÖLKƏ</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">ŞƏHƏR</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">ENDİRİM %</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">ROL</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">STATUS</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">ƏMƏLİYYATLAR</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50">
                                <td className="border border-gray-200 p-3">
                                  <Checkbox 
                                    checked={selectedUsers.includes(user.id)}
                                    onCheckedChange={() => handleSelectUser(user.id)}
                                  />
                                </td>
                                <td className="border border-gray-200 p-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <span className="text-blue-600 font-medium text-sm">
                                        {user.first_name.charAt(0)}
                                      </span>
                                    </div>
                      <div>
                                      <div className="font-medium">{user.first_name} {user.last_name}</div>
                                      <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                                  </div>
                                </td>
                                <td className="border border-gray-200 p-3 text-sm">
                                  {user.vat_number || '-'}
                                </td>
                                <td className="border border-gray-200 p-3 text-sm">
                                  {user.company_name || '-'}
                                </td>
                                <td className="border border-gray-200 p-3 text-sm">
                                  {user.phone || '-'}
                                </td>
                                <td className="border border-gray-200 p-3 text-sm">
                                  {user.country || '-'}
                                </td>
                                <td className="border border-gray-200 p-3 text-sm">
                                  {user.city || '-'}
                                </td>
                                <td className="border border-gray-200 p-3 text-sm">
                                  <div className="flex items-center space-x-1">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={user.discount || 0}
                                      onChange={(e) => {
                                        const newDiscount = parseFloat(e.target.value) || 0;
                                        handleUserDiscountUpdate(user.id, newDiscount);
                                      }}
                                      className="w-16 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <span className="text-xs">%</span>
                                  </div>
                                </td>
                                <td className="border border-gray-200 p-3">
                      <div className="flex items-center space-x-2">
                                    {getRoleIcon(user.role)}
                                    <span className="text-sm">
                                      {user.role === 'admin' ? 'Администратор' : 
                                       user.role === 'moderator' ? 'Moderator' : 'Müştəri'}
                                    </span>
                                  </div>
                                </td>
                                <td className="border border-gray-200 p-3">
                                  <select 
                                    value={user.status || 'pending'} 
                                    onChange={(e) => handleUserApproval(user.id, e.target.value)}
                                    className="px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                </td>
                                <td className="border border-gray-200 p-3">
                                  <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                                       onClick={() => openEditUserModal(user)}
                        >
                                       <Eye className="w-4 h-4" />
                        </Button>
                                    {user.status === 'pending' && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="default"
                                          onClick={() => handleUserApproval(user.id, true)}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleUserApproval(user.id, false)}
                                        >
                                          <XCircle className="w-4 h-4" />
                                        </Button>
                                      </>
                                    )}
                      </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Heç bir istifadəçi tapılmadı
                        </div>
                  )}
                </div>
              </CardContent>
            </Card>
              </div>
            )}

          {/* Products Tab */}
             {activeTab === "products" && (
               <div className="space-y-6">
            <Card>
              <CardHeader>
                     <div className="flex items-center justify-between">
                       <div>
                         <CardTitle className="text-2xl font-bold">Məhsullar ({filteredProducts.length} ədəd)</CardTitle>
                         <p className="text-gray-600 mt-1">Məhsulların idarə edilməsi</p>
                       </div>
                       <div className="flex flex-wrap gap-2">
                         <Button 
                           variant="default" 
                           size="sm"
                           onClick={() => {
                             setEditProductFormData({
                               name: '',
                               category: '',
                               subcategory: 'none',
                               sku: '',
                               catalogNumber: '',
                               price: 0,
                               stock_quantity: 0,
                               description: '',
                               images: [],
                               in_stock: true
                             });
                             setEditingProduct(null);
                             setEditProductModal(true);
                           }}
                         >
                           <UserPlus className="w-4 h-4 mr-2" />
                           + Yeni Məhsul
                         </Button>
                         <Button 
                           variant="outline" 
                           size="sm"
                           onClick={handleExportProducts}
                         >
                           <Download className="w-4 h-4 mr-2" />
                           Excel Export
                         </Button>
                         <Button 
                           variant="outline" 
                           size="sm"
                           onClick={() => document.getElementById('excel-import').click()}
                         >
                           <UserPlus className="w-4 h-4 mr-2" />
                           Excel Import
                         </Button>
                         <Button 
                           variant="outline" 
                           size="sm"
                           onClick={() => setCsvImportModal(true)}
                         >
                           <Package className="w-4 h-4 mr-2" />
                           CSV Import
                         </Button>
                         <input
                           id="excel-import"
                           type="file"
                           accept=".xlsx,.xls,.csv"
                           style={{ display: 'none' }}
                           onChange={handleImportProducts}
                         />
                         <Button 
                           variant="destructive" 
                           size="sm"
                           onClick={handleDeleteSelectedProducts}
                           disabled={selectedProducts.length === 0}
                         >
                           <Trash2 className="w-4 h-4 mr-2" />
                           Seçilənləri sil
                         </Button>
                       </div>
                     </div>
              </CardHeader>
              <CardContent>
                     {/* Search and Filters */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                       <div className="md:col-span-2">
                         <label className="block text-sm font-medium text-gray-700 mb-2">Axtarış</label>
                         <div className="relative">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                           <Input
                             placeholder="Axtarış... (ad, artikul, kataloq №)"
                             value={productSearchTerm}
                             onChange={(e) => setProductSearchTerm(e.target.value)}
                             className="pl-10"
                           />
                         </div>
                       </div>
                                               <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya</label>
                          <Select value={productCategoryFilter} onValueChange={setProductCategoryFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Bütün kateqoriyalar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Bütün kateqoriyalar</SelectItem>
                              {adminCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                     </div>

                     {/* Products Table */}
                <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <h3 className="text-lg font-semibold">Məhsullar ({filteredProducts.length})</h3>
                       </div>
                       
                       <div className="overflow-x-auto">
                         <table className="w-full border-collapse border border-gray-200">
                           <thead>
                             <tr className="bg-gray-50">
                               <th className="border border-gray-200 p-3 text-left">
                                 <Checkbox 
                                   checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                   onCheckedChange={handleSelectAllProducts}
                                 />
                               </th>
                               <th className="border border-gray-200 p-3 text-left font-medium">ŞƏKİL</th>
                               <th className="border border-gray-200 p-3 text-left font-medium">AD</th>
                               <th className="border border-gray-200 p-3 text-left font-medium">KATEQORİYA</th>
                               <th className="border border-gray-200 p-3 text-left font-medium">ARTİKUL</th>
                               <th className="border border-gray-200 p-3 text-left font-medium">KATALOQ №</th>
                               <th className="border border-gray-200 p-3 text-left font-medium">QİYMƏT</th>
                               <th className="border border-gray-200 p-3 text-left font-medium">STOK</th>
                               <th className="border border-gray-200 p-3 text-left font-medium">STATUS</th>
                               <th className="border border-gray-200 p-3 text-left font-medium">ƏMƏLİYYATLAR</th>
                             </tr>
                           </thead>
                           <tbody>
                             {filteredProducts.map((product) => (
                               <tr key={product.id} className="hover:bg-gray-50">
                                 <td className="border border-gray-200 p-3">
                                   <Checkbox 
                                     checked={selectedProducts.includes(product.id)}
                                     onCheckedChange={() => handleSelectProduct(product.id)}
                                   />
                                 </td>
                                 <td className="border border-gray-200 p-3">
                                   <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center relative">
                                     {(() => {
                                       const images = product.images && product.images.length > 0 ? product.images : 
                                                      product.image ? [product.image] : [];
                                       
                                       if (images.length > 0) {
                                         return (
                                           <>
                                             <img 
                                               src={images[0]} 
                                               alt={product.name}
                                               className="w-12 h-12 object-cover rounded-lg"
                                             />
                                             {images.length > 1 && (
                                               <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-blue-600 text-white rounded-full flex items-center justify-center">
                                                 {images.length}
                                               </Badge>
                                             )}
                                           </>
                                         );
                                       } else {
                                         return <span className="text-xs text-gray-500">IMG</span>;
                                       }
                                     })()}
                                   </div>
                                 </td>
                                 <td className="border border-gray-200 p-3">
                      <div>
                                     <div className="font-medium">{product.name}</div>
                                     {product.description && (
                                       <div className="text-xs text-gray-500 truncate max-w-32">
                                         {product.description}
                      </div>
                                     )}
                                   </div>
                                 </td>
                                 <td className="border border-gray-200 p-3 text-sm">
                                   {product.category || '-'}
                                 </td>
                                 <td className="border border-gray-200 p-3 text-sm">
                                   {product.sku || '-'}
                                 </td>
                                 <td className="border border-gray-200 p-3 text-sm">
                                   {product.catalogNumber || '-'}
                                 </td>
                                 <td className="border border-gray-200 p-3 text-sm font-medium">
                                   <div className="space-y-1">
                                     <div className="text-red-600 font-bold">
                                       {product.originalPrice || product.price} ₽
                                     </div>
                                   </div>
                                 </td>
                                 <td className="border border-gray-200 p-3 text-sm">
                                   {product.stock_quantity}
                                 </td>
                                 <td className="border border-gray-200 p-3">
                                   <div className="flex flex-col space-y-1">
                                     <Badge 
                                       variant={product.in_stock ? "default" : "secondary"}
                                       className={product.in_stock ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                                     >
                                       {product.in_stock ? 'Stokda' : 'Stok yoxdur'}
                        </Badge>
                                     {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                                       <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                         Az stok
                                       </Badge>
                                     )}
                      </div>
                                 </td>
                                 <td className="border border-gray-200 p-3">
                                   <div className="flex items-center space-x-2">
                                     <Button
                                       size="sm"
                                       variant="outline"
                                       onClick={() => openEditProductModal(product)}
                                     >
                                       <Eye className="w-4 h-4" />
                                     </Button>
                                     <Button
                                       size="sm"
                                       variant="destructive"
                                       onClick={async () => {
                                         try {
                                           await SupabaseService.deleteProduct(product.id);
                                           await fetchAllProducts();
                                           toast({
                                             title: "Success",
                                             description: "Product deleted successfully from Supabase",
                                           });
                                         } catch (error) {
                                           console.error('Error deleting product:', error);
                                           toast({
                                             title: "Error",
                                             description: `Failed to delete product: ${error.message}`,
                                             variant: "destructive"
                                           });
                                         }
                                       }}
                                     >
                                       <Trash2 className="w-4 h-4" />
                                     </Button>
                    </div>
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                       
                       {filteredProducts.length === 0 && (
                         <div className="text-center py-8 text-gray-500">
                           Heç bir məhsul tapılmadı
                         </div>
                  )}
                </div>
              </CardContent>
            </Card>
               </div>
             )}

          {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-bold">Sifarişlər ({orders.length})</CardTitle>
                          <p className="text-gray-600 mt-1">Sifarişlərin idarə edilməsi</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Search and Filter */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Axtarış</label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              placeholder="Sifariş №, müştəri adı..."
                              value={orderSearchTerm}
                              onChange={(e) => setOrderSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                          <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Bütün statuslar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Bütün statuslar</SelectItem>
                              <SelectItem value="pending">Gözləyir</SelectItem>
                              <SelectItem value="confirmed">Təsdiqləndi</SelectItem>
                              <SelectItem value="processing">İşlənir</SelectItem>
                              <SelectItem value="shipped">Göndərildi</SelectItem>
                              <SelectItem value="delivered">Çatdırıldı</SelectItem>
                              <SelectItem value="cancelled">Ləğv edildi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {orders.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Heç bir sifariş yoxdur
                          </div>
                        ) : (
                          orders
                            .filter(order => {
                              const matchesSearch = orderSearchTerm === "" || 
                                order.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                                order.userName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                                (order.company && order.company.toLowerCase().includes(orderSearchTerm.toLowerCase()));
                              const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
                              return matchesSearch && matchesStatus;
                            })
                            .map((order) => (
                              <Card 
                                key={order.id} 
                                className="hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderModal(true);
                                }}
                              >
                                <CardContent className="p-6">
                                  <div className="flex justify-between items-center">
                                    {/* Left side - Order info */}
                                    <div className="flex items-center space-x-6">
                                      <div className="flex items-center space-x-3">
                                        <ShoppingCart className="w-5 h-5 text-gray-500" />
                                        <div>
                                          <h3 className="font-semibold text-gray-900">#{order.id}</h3>
                                          <p className="text-sm text-gray-500">
                                            {new Date(order.date).toLocaleDateString('az-AZ', {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric'
                                            })}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      {/* Company info */}
                                      <div>
                                        <div className="font-medium text-gray-900">
                                          {order.company || order.userName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {order.userEmail}
                                        </div>
                                      </div>
                                      
                                      {/* Status */}
                                      <Badge className={
                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                      }>
                                        {
                                          order.status === 'pending' ? 'Gözləyir' :
                                          order.status === 'confirmed' ? 'Təsdiqləndi' :
                                          order.status === 'processing' ? 'İşlənir' :
                                          order.status === 'shipped' ? 'Göndərildi' :
                                          order.status === 'delivered' ? 'Çatdırıldı' :
                                          order.status === 'cancelled' ? 'Ləğv edildi' :
                                          'Bilinmir'
                                        }
                                      </Badge>
                                    </div>
                                    
                                    {/* Right side - Total and actions */}
                                    <div className="flex items-center space-x-4">
                                      {/* Total amount */}
                                      <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">
                                          {formatPrice(order.total)}
                                        </div>
                                        {order.discountPercentage > 0 && (
                                          <div className="text-xs text-red-600">
                                            -{order.discountPercentage}% endirim
                                          </div>
                                        )}
                                        <div className="text-xs text-gray-500">
                                          {order.items.length} məhsul
                                        </div>
                                      </div>
                                      
                                      {/* Quick status change */}
                                      <div className="flex flex-col space-y-1">
                                        {order.status === 'pending' && (
                                          <Button
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleOrderStatusChange(order.id, 'confirmed');
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                          >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Təsdiq Et
                                          </Button>
                                        )}
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedOrder(order);
                                            setShowOrderModal(true);
                                          }}
                                        >
                                          <Eye className="w-4 h-4 mr-1" />
                                          Detallar
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

                             {/* Categories Tab */}
               {activeTab === "categories" && (
                 <div className="space-y-6">
                   <Card>
                     <CardHeader>
                       <div className="flex items-center justify-between">
                         <div>
                           <CardTitle className="text-2xl font-bold">Kateqoriyalar</CardTitle>
                           <p className="text-gray-600 mt-1">Məhsul kateqoriyalarının və sub-kateqoriyaların idarə edilməsi</p>
                         </div>
                         <div className="flex space-x-2">
                           <Button 
                             variant="destructive" 
                             size="sm"
                             onClick={handleDeleteSelectedCategories}
                             disabled={selectedCategories.length === 0}
                           >
                             <Trash2 className="w-4 h-4 mr-2" />
                             Seçilənləri sil
                           </Button>
                           <Button 
                             variant="destructive" 
                             size="sm"
                             onClick={handleDeleteAllCategories}
                             disabled={localCategories.length === 0}
                           >
                             <Trash2 className="w-4 h-4 mr-2" />
                             Bütün kateqoriyaları sil
                           </Button>
                           <Button 
                             variant="default" 
                             size="sm"
                             onClick={openAddCategoryModal}
                           >
                             <UserPlus className="w-4 h-4 mr-2" />
                             + Yeni Kateqoriya
                           </Button>
                         </div>
                       </div>
                     </CardHeader>
                     <CardContent>
                       {/* Search */}
                       <div className="mb-6">
                         <label className="block text-sm font-medium text-gray-700 mb-2">Axtarış</label>
                         <div className="relative">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                           <Input
                             placeholder="Kateqoriya adı və ya təsviri..."
                             value={categorySearchTerm}
                             onChange={(e) => setCategorySearchTerm(e.target.value)}
                             className="pl-10"
                           />
                         </div>
                       </div>

                       {/* Categories Table */}
                       <div className="space-y-4">
                         <div className="flex items-center justify-between">
                           <h3 className="text-lg font-semibold">Kateqoriyalar ({filteredCategories.length})</h3>
                         </div>
                         
                         <div className="overflow-x-auto">
                           <table className="w-full border-collapse border border-gray-200">
                             <thead>
                               <tr className="bg-gray-50">
                                 <th className="border border-gray-200 p-3 text-left">
                                   <Checkbox 
                                     checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                                     onCheckedChange={handleSelectAllCategories}
                                   />
                                 </th>
                                 <th className="border border-gray-200 p-3 text-left font-medium">Kateqoriya</th>
                                 <th className="border border-gray-200 p-3 text-left font-medium">Təsvir</th>
                                 <th className="border border-gray-200 p-3 text-left font-medium">Sub-kateqoriyalar</th>
                                 <th className="border border-gray-200 p-3 text-left font-medium">Məhsul Sayı</th>
                                 <th className="border border-gray-200 p-3 text-left font-medium">Status</th>
                                 <th className="border border-gray-200 p-3 text-left font-medium">Əməliyyatlar</th>
                               </tr>
                             </thead>
                             <tbody>
                               {filteredCategories.map((category) => (
                                 <React.Fragment key={category.id}>
                                   {/* Main Category */}
                                   <tr className="hover:bg-gray-50 bg-blue-50">
                                     <td className="border border-gray-200 p-3">
                                       <Checkbox 
                                         checked={selectedCategories.includes(category.id)}
                                         onCheckedChange={() => handleSelectCategory(category.id)}
                                       />
                                     </td>
                                     <td className="border border-gray-200 p-3">
                                       <div className="font-medium text-blue-800">{category.name}</div>
                                     </td>
                                     <td className="border border-gray-200 p-3 text-sm">{category.description}</td>
                                     <td className="border border-gray-200 p-3 text-sm">
                                       <Badge variant="secondary">
                                         {category.is_subcategory ? 'Alt kateqoriya' : 
                                          adminCategories.filter(cat => cat.parent_id === category.id).length + ' sub'}
                                       </Badge>
                                     </td>
                                     <td className="border border-gray-200 p-3 text-sm font-medium">{category.product_count}</td>
                                     <td className="border border-gray-200 p-3">
                                       <Badge variant={category.is_active ? "default" : "secondary"}>
                                         {category.is_active ? 'Aktiv' : 'Deaktiv'}
                                       </Badge>
                                     </td>
                                     <td className="border border-gray-200 p-3">
                                       <div className="flex items-center space-x-2">
                                         <Button 
                                           size="sm" 
                                           variant="outline"
                                           onClick={() => openEditCategoryModal(category)}
                                         >
                                           <Edit className="w-4 h-4" />
                                         </Button>
                                         <Button 
                                           size="sm" 
                                           variant="destructive"
                                           onClick={() => {
                                             setAdminCategories(prev => prev.filter(c => c.id !== category.id));
                                           }}
                                         >
                                           <Trash2 className="w-4 h-4" />
                                         </Button>
                                       </div>
                                     </td>
                                   </tr>
                                   
                                   {/* Subcategories */}
                                 </React.Fragment>
                               ))}
                             </tbody>
                           </table>
                         </div>
                         
                         {filteredCategories.length === 0 && (
                           <div className="text-center py-8 text-gray-500">
                             Heç bir kateqoriya tapılmadı
                           </div>
                         )}
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               )}

              {/* Payments Tab */}
              {activeTab === "payments" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">Ödənişlər</CardTitle>
                      <p className="text-gray-600 mt-1">Ödənişlərin idarə edilməsi</p>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-3 text-left font-medium">Sifariş №</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">Məbləğ</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">Metod</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">Status</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">Tarix</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((payment) => (
                              <tr key={payment.id} className="hover:bg-gray-50">
                                <td className="border border-gray-200 p-3 font-medium">{payment.order_id}</td>
                                <td className="border border-gray-200 p-3 font-medium">{payment.amount} P</td>
                                <td className="border border-gray-200 p-3 text-sm">{payment.method}</td>
                                <td className="border border-gray-200 p-3">
                                  <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                                    {payment.status === 'completed' ? 'Tamamlandı' : 'Gözləyir'}
                                  </Badge>
                                </td>
                                <td className="border border-gray-200 p-3 text-sm">{payment.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* 1C Integration Tab */}
              {activeTab === "1c-integration" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-bold">1C İnteqrasiya</CardTitle>
                          <p className="text-gray-600 mt-1">1C:Предприятие ilə inteqrasiya idarəetməsi</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={test1CConnection}
                            disabled={oneCTestLoading}
                          >
                            {oneCTestLoading ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4 mr-2" />
                            )}
                            Əlaqəni Test Et
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              fetch1CStatus();
                              fetch1CLogs();
                            }}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Yenilə
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Connection Status */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              <Package className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium">Ümumi Məhsullar</p>
                                <p className="text-2xl font-bold text-blue-600">
                                  {oneCStatus?.total_products || 0}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              <Download className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="text-sm font-medium">1C-dən İmport</p>
                                <p className="text-2xl font-bold text-green-600">
                                  {oneCStatus?.imported_products || 0}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              <Package className="h-5 w-5 text-purple-600" />
                              <div>
                                <p className="text-sm font-medium">Kateqoriyalar</p>
                                <p className="text-2xl font-bold text-purple-600">
                                  {oneCStatus?.total_categories || 0}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              <RefreshCw className="h-5 w-5 text-orange-600" />
                              <div>
                                <p className="text-sm font-medium">Son Sinxronizasiya</p>
                                <p className="text-sm text-orange-600">
                                  {oneCStatus?.last_sync ? 
                                    new Date(oneCStatus.last_sync).toLocaleString('az-AZ') : 
                                    'Heç vaxt'
                                  }
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Integration Instructions */}
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle className="text-lg">1C Konfiqurasiyası</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Exchange URL:</h4>
                              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                                {window.location.origin}/backend/1c_exchange.php
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">İstifadəçi adı:</h4>
                                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                                  1c_user
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Şifrə:</h4>
                                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                                  1c_password
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="font-medium text-blue-900 mb-2">Konfiqurasiya addımları:</h4>
                              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                                <li>1C-də "Администрирование" → "Интернет-поддержка и сервисы" → "Обмен данными" bölməsinə keçin</li>
                                <li>"Настройка обмена с сайтом" seçin</li>
                                <li>Yuxarıdakı URL, istifadəçi adı və şifrəni daxil edin</li>
                                <li>"Выгрузка каталога" və "Выгрузка остатков и цен" fəallaşdırın</li>
                                <li>Sinxronizasiyanı başladın</li>
                              </ol>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Logs Section */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">İnteqrasiya Logları</CardTitle>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={fetch1CLogs}
                              disabled={oneCLogsLoading}
                            >
                              {oneCLogsLoading ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                              )}
                              Logları Yenilə
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                            {oneCLogs.length > 0 ? (
                              oneCLogs.map((log, index) => (
                                <div key={index} className="mb-1">
                                  {log}
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-500">
                                Log məlumatları yoxdur
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">Rəylər</CardTitle>
                      <p className="text-gray-600 mt-1">Məhsul rəylərinin idarə edilməsi</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-medium">{review.product_name}</h3>
                                  <span className="text-sm text-gray-600">({review.customer})</span>
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                                <Badge variant={review.status === 'approved' ? 'default' : review.status === 'pending' ? 'secondary' : 'destructive'}>
                                  {review.status === 'approved' ? 'Təsdiqlənmiş' : review.status === 'pending' ? 'Gözləyir' : 'Rədd edildi'}
                                </Badge>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-bold">Bildirimlər ({notifications.length})</CardTitle>
                          <p className="text-gray-600 mt-1">Sistem bildirimlərinin idarə edilməsi</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={markAllNotificationsAsRead}
                            disabled={unreadNotifications === 0}
                          >
                            Hamısını Oxunmuş Et
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              setNotifications([]);
                              localStorage.removeItem('adminNotifications');
                              setUnreadNotifications(0);
                            }}
                          >
                            Hamısını Sil
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {notifications.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Heç bir bildirim yoxdur
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                notification.isRead 
                                  ? 'bg-gray-50 border-gray-200' 
                                  : 'bg-blue-50 border-blue-200 shadow-sm'
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="font-semibold text-gray-900">
                                      {notification.title}
                                    </h4>
                                    {!notification.isRead && (
                                      <Badge className="bg-red-600 text-white text-xs">
                                        Yeni
                                      </Badge>
                                    )}
                                    {notification.priority === 'high' && (
                                      <Badge variant="destructive" className="text-xs">
                                        Vacib
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <p className="text-gray-700 mb-2">
                                    {notification.message}
                                  </p>
                                  
                                  {notification.type === 'new_order' && (
                                    <div className="bg-white rounded p-3 space-y-1 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Sifariş №:</span>
                                        <span className="font-medium">{notification.orderNumber}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Müştəri:</span>
                                        <span className="font-medium">{notification.customerName}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Məbləğ:</span>
                                        <span className="font-medium text-red-600">{notification.orderTotal}</span>
                                      </div>
                                      {notification.discount && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Endirim:</span>
                                          <span className="font-medium text-red-600">{notification.discount}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="text-xs text-gray-500 ml-4">
                                  {new Date(notification.timestamp).toLocaleDateString('az-AZ', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Delivery Tab */}
              {activeTab === "delivery" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">Çatdırılma</CardTitle>
                      <p className="text-gray-600 mt-1">Çatdırılma məlumatlarının idarə edilməsi</p>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-3 text-left font-medium">Sifariş №</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">Metod</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">Status</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">Tracking</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">Tarix</th>
                            </tr>
                          </thead>
                          <tbody>
                            {delivery.map((item) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="border border-gray-200 p-3 font-medium">{item.order_id}</td>
                                <td className="border border-gray-200 p-3 text-sm">{item.method}</td>
                                <td className="border border-gray-200 p-3">
                                  <Badge variant={
                                    item.status === 'delivered' ? 'default' : 
                                    item.status === 'in_transit' ? 'secondary' : 'outline'
                                  }>
                                    {item.status === 'delivered' ? 'Çatdırıldı' : 
                                     item.status === 'in_transit' ? 'Yolda' : 'Hazır'}
                                  </Badge>
                                </td>
                                <td className="border border-gray-200 p-3 text-sm font-mono">{item.tracking}</td>
                                <td className="border border-gray-200 p-3 text-sm">{item.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Marketplaces Tab */}
              {activeTab === "marketplaces" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-bold">Marketplace'lər</CardTitle>
                          <p className="text-gray-600 mt-1">Marketplace inteqrasiyalarının idarə edilməsi</p>
                        </div>
                        <Button variant="default" size="sm">
                          <UserPlus className="w-4 h-4 mr-2" />
                          + Yeni Marketplace
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-3 text-left font-medium">Ad</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">Status</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">Məhsul Sayı</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">Son Sinkronizasiya</th>
                              <th className="border border-gray-200 p-3 text-left font-medium">Əməliyyatlar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {marketplaces.map((marketplace) => (
                              <tr key={marketplace.id} className="hover:bg-gray-50">
                                <td className="border border-gray-200 p-3 font-medium">{marketplace.name}</td>
                                <td className="border border-gray-200 p-3">
                                  <Badge variant={marketplace.status === 'active' ? 'default' : 'secondary'}>
                                    {marketplace.status === 'active' ? 'Aktiv' : 'Deaktiv'}
                                  </Badge>
                                </td>
                                <td className="border border-gray-200 p-3 text-sm">{marketplace.products_count}</td>
                                <td className="border border-gray-200 p-3 text-sm">{marketplace.last_sync}</td>
                                <td className="border border-gray-200 p-3">
                                  <div className="flex items-center space-x-2">
                                    <Button size="sm" variant="outline">
                                      <RefreshCw className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Settings className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Günlük Satış</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics?.sales?.daily || 0} P</div>
                        <p className="text-xs text-muted-foreground">Bu gün</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Həftəlik Satış</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics?.sales?.weekly || 0} P</div>
                        <p className="text-xs text-muted-foreground">Bu həftə</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Aylıq Satış</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics?.sales?.monthly || 0} P</div>
                        <p className="text-xs text-muted-foreground">Bu ay</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Ən Çox Satılan Məhsullar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics?.top_products?.map((product, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{product.name}</span>
                            <Badge variant="secondary">{product.sales} satış</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">Tənzimləmələr</CardTitle>
                      <p className="text-gray-600 mt-1">Sistem tənzimləmələri</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Sayt Adı</Label>
                            <Input defaultValue="Bilal Parts" />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input defaultValue="info@bilal-parts.com" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Sayt Təsviri</Label>
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={3}
                            defaultValue="Professional spare parts supplier"
                          />
                        </div>
                        <Button>Yadda Saxla</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">Təhlükəsizlik</CardTitle>
                      <p className="text-gray-600 mt-1">Təhlükəsizlik tənzimləmələri</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">İki Faktorlu Autentifikasiya</h3>
                            <p className="text-sm text-gray-600">Hesabınızı daha təhlükəsiz edin</p>
                          </div>
                          <Button variant="outline">Aktivləşdir</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Şifrə Dəyişdir</h3>
                            <p className="text-sm text-gray-600">Mövcud şifrənizi yeniləyin</p>
                          </div>
                          <Button variant="outline">Dəyişdir</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

          {/* Messages Tab */}
            {activeTab === "messages" && (
              <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`p-4 border rounded-lg ${!message.is_read ? 'bg-blue-50 border-blue-200' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{message.name}</h3>
                            <span className="text-sm text-gray-600">({message.email})</span>
                            {!message.is_read && (
                              <Badge variant="secondary">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{message.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {!message.is_read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkMessageRead(message.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No messages found</p>
                  )}
                </div>
              </CardContent>
            </Card>
      </div>
            )}
                     </div>
         </div>
       </div>

               {/* Edit User Modal */}
        <Dialog open={editUserModal} onOpenChange={setEditUserModal}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Müştəri Məlumatlarını Düzənlə</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_first_name">Ad</Label>
                  <Input
                    id="edit_first_name"
                    name="first_name"
                    value={editFormData.first_name}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_last_name">Soyad</Label>
                  <Input
                    id="edit_last_name"
                    name="last_name"
                    value={editFormData.last_name}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_email">Email</Label>
                <Input
                  id="edit_email"
                  name="email"
                  type="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_phone">Telefon</Label>
                <Input
                  id="edit_phone"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_company_name">Firma Adı</Label>
                <Input
                  id="edit_company_name"
                  name="company_name"
                  value={editFormData.company_name}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_country">Ölkə</Label>
                  <Input
                    id="edit_country"
                    name="country"
                    value={editFormData.country}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_city">Şəhər</Label>
                  <Input
                    id="edit_city"
                    name="city"
                    value={editFormData.city}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_vat_number">VÖEN (INN)</Label>
                <Input
                  id="edit_vat_number"
                  name="vat_number"
                  value={editFormData.vat_number}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_discount">Endirim %</Label>
                <Input
                  id="edit_discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={editFormData.discount}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-600">Müştəriyə veriləcək endirim faizi (0-100%)</p>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={handleEditUser}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Yadda Saxla
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditUserModal(false)}
                  className="flex-1"
                >
                  Ləğv Et
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

                 {/* Edit Product Modal */}
         <Dialog open={editProductModal} onOpenChange={setEditProductModal}>
           <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle className="text-xl font-bold">
                 {editingProduct ? 'Məhsul Məlumatlarını Düzənlə' : 'Yeni Məhsul Əlavə Et'}
               </DialogTitle>
             </DialogHeader>
             
             <div className="space-y-4 mt-4">
               <div className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="edit_product_name">Məhsul Adı</Label>
                   <Input
                     id="edit_product_name"
                     name="name"
                     value={editProductFormData.name}
                     onChange={handleProductInputChange}
                     className="focus:ring-blue-500 focus:border-blue-500"
                   />
                 </div>
                 
                 {/* Category Section */}
                 <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                   <h3 className="font-medium text-gray-900">Kateqoriya Məlumatları</h3>
                   
                   <div className="space-y-3">
                     <div className="space-y-2">
                       <Label htmlFor="edit_product_category" className="font-medium">Ana Kateqoriya</Label>
                       <Select 
                         value={editProductFormData.category} 
                         onValueChange={handleCategoryChange}
                       >
                         <SelectTrigger>
                           <SelectValue placeholder="Ana kateqoriya seçin" />
                         </SelectTrigger>
                         <SelectContent>
                           {adminCategories.map((cat) => (
                             <SelectItem key={cat.id || cat.name} value={cat.name}>
                               {cat.name}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
                     
                     {/* Subcategory selector - only show if main category is selected */}
                     {editProductFormData.category && (
                       <div className="space-y-2 ml-6 relative">
                         <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                         <div className="absolute -left-5 top-6 w-3 h-0.5 bg-gray-300"></div>
                         <Label htmlFor="edit_product_subcategory" className="font-medium text-gray-700">
                           Alt Kateqoriya
                         </Label>
                         <Select 
                           value={editProductFormData.subcategory} 
                           onValueChange={(value) => setEditProductFormData(prev => ({ ...prev, subcategory: value }))}
                         >
                           <SelectTrigger className="bg-white">
                             <SelectValue placeholder="Alt kateqoriya seçin (istəyə görə)" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="none">
                               <span className="text-gray-500">— Heç biri —</span>
                             </SelectItem>
                             {getSubcategoriesForCategory(editProductFormData.category).map((sub) => (
                               <SelectItem key={sub.id || sub.name} value={sub.name}>
                                 <span className="flex items-center">
                                   <span className="w-3 h-0.5 bg-gray-300 mr-2"></span>
                                   {sub.name}
                                 </span>
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                         <p className="text-xs text-gray-500">
                           "{editProductFormData.category}" kateqoriyasının alt bölmələri
                         </p>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="edit_product_sku">Artikul (SKU)</Label>
                   <Input
                     id="edit_product_sku"
                     name="sku"
                     value={editProductFormData.sku}
                     onChange={handleProductInputChange}
                     className="focus:ring-blue-500 focus:border-blue-500"
                   />
                 </div>
                 
                 <div className="space-y-2">
                   <Label htmlFor="edit_product_catalog">Kataloq №</Label>
                   <Input
                     id="edit_product_catalog"
                     name="catalogNumber"
                     value={editProductFormData.catalogNumber}
                     onChange={handleProductInputChange}
                     className="focus:ring-blue-500 focus:border-blue-500"
                   />
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="edit_product_price">Qiymət (P)</Label>
                   <Input
                     id="edit_product_price"
                     name="price"
                     type="number"
                     min="0"
                     step="0.01"
                     value={editProductFormData.price}
                     onChange={handleProductInputChange}
                     className="focus:ring-blue-500 focus:border-blue-500"
                   />
                 </div>
                 
                 <div className="space-y-2">
                   <Label htmlFor="edit_product_stock">Stok Miqdarı</Label>
                   <Input
                     id="edit_product_stock"
                     name="stock_quantity"
                     type="number"
                     min="0"
                     value={editProductFormData.stock_quantity}
                     onChange={handleProductInputChange}
                     className="focus:ring-blue-500 focus:border-blue-500"
                   />
                 </div>
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="edit_product_images">Məhsul Şəkilləri</Label>
                 <Input
                   id="edit_product_images"
                   name="images"
                   type="file"
                   accept="image/*"
                   multiple
                   onChange={handleImageUpload}
                   className="focus:ring-blue-500 focus:border-blue-500"
                 />
                 
                 {/* Image previews */}
                 {editProductFormData.images.length > 0 && (
                   <div className="mt-2">
                     <div className="flex flex-wrap gap-2">
                       {editProductFormData.images.map((image, index) => (
                         <div key={index} className="relative group">
                           <img 
                             src={image} 
                             alt={`Preview ${index + 1}`} 
                             className="w-20 h-20 object-cover rounded-lg border"
                           />
                           <Button
                             type="button"
                             size="sm"
                             variant="destructive"
                             className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                             onClick={() => handleRemoveImage(index)}
                           >
                             <X className="h-3 w-3" />
                           </Button>
                           <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1 rounded-b-lg">
                             {index === 0 ? 'Ana' : `${index + 1}`}
                           </div>
                         </div>
                       ))}
                     </div>
                     <p className="text-xs text-gray-500 mt-1">
                       {editProductFormData.images.length} şəkil yükləndi. Birinci şəkil ana şəkil olacaq.
                     </p>
                   </div>
                 )}
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="edit_product_description">Təsvir</Label>
                 <textarea
                   id="edit_product_description"
                   name="description"
                   value={editProductFormData.description}
                   onChange={handleProductInputChange}
                   rows={3}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Məhsul haqqında təsvir..."
                 />
               </div>

               {/* Technical Specifications Section */}
               <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                 <div className="flex items-center justify-between">
                   <h3 className="font-medium text-gray-900">Texniki Xüsusiyyətlər</h3>
                   <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     onClick={addSpecification}
                     className="text-blue-600 border-blue-300 hover:bg-blue-50"
                   >
                     <Plus className="w-4 h-4 mr-1" />
                     Əlavə Et
                   </Button>
                 </div>
                 
                 {specifications.length > 0 ? (
                   <div className="space-y-3">
                     {specifications.map((spec, index) => (
                       <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                         <div className="flex-1">
                           <Input
                             placeholder="Xüsusiyyət adı (məs: Voltage)"
                             value={spec.key}
                             onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                             className="mb-2"
                           />
                           <Input
                             placeholder="Dəyər (məs: 12V/24V)"
                             value={spec.value}
                             onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                           />
                         </div>
                         <Button
                           type="button"
                           variant="destructive"
                           size="sm"
                           onClick={() => removeSpecification(index)}
                           className="text-red-600 border-red-300 hover:bg-red-50"
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-6 text-gray-500">
                     <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                     <p className="text-sm">Hələ texniki xüsusiyyət əlavə edilməyib</p>
                     <p className="text-xs">"Əlavə Et" düyməsinə basaraq əlavə edin</p>
                   </div>
                 )}
               </div>
               
               <div className="flex items-center space-x-2">
                 <Checkbox
                   id="edit_product_stock"
                   name="in_stock"
                   checked={editProductFormData.in_stock}
                   onCheckedChange={(checked) => setEditProductFormData(prev => ({ ...prev, in_stock: checked }))}
                 />
                 <Label htmlFor="edit_product_stock">Stokda</Label>
               </div>
               
               <div className="flex space-x-2 pt-4">
                 <Button
                   onClick={handleEditProduct}
                   className="flex-1 bg-blue-600 hover:bg-blue-700"
                 >
                   Yadda Saxla
                 </Button>
                 <Button
                   variant="outline"
                   onClick={() => setEditProductModal(false)}
                   className="flex-1"
                 >
                   Ləğv Et
                 </Button>
               </div>
             </div>
           </DialogContent>
         </Dialog>

         {/* Add Category Modal */}
         <Dialog open={addCategoryModal} onOpenChange={setAddCategoryModal}>
           <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle className="text-xl font-bold">Yeni Kateqoriya Əlavə Et</DialogTitle>
             </DialogHeader>
             
             <div className="space-y-4 mt-4">
               <div className="space-y-2">
                 <Label htmlFor="add_category_name">Kateqoriya Adı</Label>
                 <Input
                   id="add_category_name"
                   name="name"
                   value={categoryFormData.name}
                   onChange={handleCategoryInputChange}
                   className="focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Kateqoriya adını daxil edin"
                 />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="add_category_description">Təsvir</Label>
                 <textarea
                   id="add_category_description"
                   name="description"
                   value={categoryFormData.description}
                   onChange={handleCategoryInputChange}
                   rows={3}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Kateqoriya haqqında təsvir..."
                 />
               </div>
               
                                <div className="space-y-2">
                   <Label htmlFor="add_category_parent">Ana Kateqoriya</Label>
                   <Select 
                     value={categoryFormData.parent_id || "main"} 
                     onValueChange={(value) => setCategoryFormData(prev => ({ ...prev, parent_id: value === "main" ? null : value }))}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Ana kateqoriya seçin (boş buraxın)" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="main">Ana Kateqoriya</SelectItem>
                       {categories.map((cat) => (
                         <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                   <p className="text-sm text-gray-600">
                     "Ana Kateqoriya" seçilsə, yeni ana kateqoriya yaradılacaq. Əgər başqa kateqoriya seçilsə, sub-kateqoriya yaradılacaq.
                   </p>
                 </div>
               
               <div className="flex items-center space-x-2">
                 <Checkbox
                   id="add_category_active"
                   name="is_active"
                   checked={categoryFormData.is_active}
                   onCheckedChange={(checked) => setCategoryFormData(prev => ({ ...prev, is_active: checked }))}
                 />
                 <Label htmlFor="add_category_active">Aktiv</Label>
               </div>
               
               <div className="flex space-x-2 pt-4">
                 <Button
                   onClick={handleAddCategory}
                   className="flex-1 bg-blue-600 hover:bg-blue-700"
                 >
                   Əlavə Et
                 </Button>
                 <Button
                   variant="outline"
                   onClick={() => setAddCategoryModal(false)}
                   className="flex-1"
                 >
                   Ləğv Et
                 </Button>
               </div>
             </div>
           </DialogContent>
         </Dialog>

         {/* Edit Category Modal */}
         <Dialog open={editCategoryModal} onOpenChange={setEditCategoryModal}>
           <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle className="text-xl font-bold">Kateqoriya Məlumatlarını Düzənlə</DialogTitle>
             </DialogHeader>
             
             <div className="space-y-4 mt-4">
               <div className="space-y-2">
                 <Label htmlFor="edit_category_name">Kateqoriya Adı</Label>
                 <Input
                   id="edit_category_name"
                   name="name"
                   value={categoryFormData.name}
                   onChange={handleCategoryInputChange}
                   className="focus:ring-blue-500 focus:border-blue-500"
                 />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="edit_category_description">Təsvir</Label>
                 <textarea
                   id="edit_category_description"
                   name="description"
                   value={categoryFormData.description}
                   onChange={handleCategoryInputChange}
                   rows={3}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 />
               </div>
               
               <div className="flex items-center space-x-2">
                 <Checkbox
                   id="edit_category_active"
                   name="is_active"
                   checked={categoryFormData.is_active}
                   onCheckedChange={(checked) => setCategoryFormData(prev => ({ ...prev, is_active: checked }))}
                 />
                 <Label htmlFor="edit_category_active">Aktiv</Label>
               </div>
               
               <div className="flex space-x-2 pt-4">
                 <Button
                   onClick={handleEditCategory}
                   className="flex-1 bg-blue-600 hover:bg-blue-700"
                 >
                   Yadda Saxla
                 </Button>
                 <Button
                   variant="outline"
                   onClick={() => setEditCategoryModal(false)}
                   className="flex-1"
                 >
                   Ləğv Et
                 </Button>
               </div>
             </div>
           </DialogContent>
         </Dialog>

         {/* Order Details Modal */}
         <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
           <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <ShoppingCart className="h-5 w-5 text-red-600" />
                   <span>Sifariş Detalları - #{selectedOrder?.id}</span>
                 </div>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => setShowOrderModal(false)}
                 >
                   <XCircle className="h-4 w-4" />
                 </Button>
               </DialogTitle>
             </DialogHeader>

             {selectedOrder && (
               <div className="space-y-6">
                 {/* Order Info */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <Card>
                     <CardHeader className="pb-3">
                       <CardTitle className="text-base">Sifariş Məlumatları</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-2 text-sm">
                       <div className="flex justify-between">
                         <span className="text-gray-600">Sifariş №:</span>
                         <span className="font-medium">#{selectedOrder.id}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Tarix:</span>
                         <span className="font-medium">{new Date(selectedOrder.date).toLocaleDateString('az-AZ')}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Müştəri:</span>
                         <span className="font-medium">{selectedOrder.userName}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Email:</span>
                         <span className="font-medium">{selectedOrder.userEmail}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Firma:</span>
                         <span className="font-medium">{selectedOrder.company || '-'}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Status:</span>
                         {selectedOrder.status !== 'delivered' ? (
                           <Select 
                             value={selectedOrder.status} 
                             onValueChange={(value) => {
                               // Update status in all places
                               handleOrderStatusChange(selectedOrder.id, value);
                               
                               // Update selected order for modal
                               const updatedOrder = {...selectedOrder, status: value};
                               setSelectedOrder(updatedOrder);
                             }}
                           >
                             <SelectTrigger className="w-32">
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="pending">Gözləyir</SelectItem>
                               <SelectItem value="confirmed">Təsdiq Et</SelectItem>
                               <SelectItem value="processing">İşlənir</SelectItem>
                               <SelectItem value="shipped">Göndərildi</SelectItem>
                               <SelectItem value="delivered">Çatdırıldı</SelectItem>
                               <SelectItem value="cancelled">Ləğv Et</SelectItem>
                             </SelectContent>
                           </Select>
                         ) : (
                           <Badge className="bg-green-100 text-green-800">
                             Çatdırıldı (Final Status)
                           </Badge>
                         )}
                       </div>
                     </CardContent>
                   </Card>

                   <Card>
                     <CardHeader className="pb-3">
                       <CardTitle className="text-base">Çatdırılma</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-2 text-sm">
                       <div>
                         <span className="text-gray-600">Ünvan:</span>
                         <p className="font-medium">{selectedOrder.shippingAddress}</p>
                       </div>
                       <div>
                         <span className="text-gray-600">Ödəniş metodu:</span>
                         <p className="font-medium">{selectedOrder.paymentMethod}</p>
                       </div>
                       <div>
                         <span className="text-gray-600">VÖEN:</span>
                         <p className="font-medium">{selectedOrder.inn || '-'}</p>
                       </div>
                     </CardContent>
                   </Card>

                   {/* Order Summary Card */}
                   <Card>
                     <CardHeader className="pb-3">
                       <CardTitle className="text-base">Məbləğ</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-2 text-sm">
                       <div className="flex justify-between">
                         <span className="text-gray-600">Subtotal:</span>
                         <span>{formatPrice(selectedOrder.subtotal || selectedOrder.total)}</span>
                       </div>
                       
                       {selectedOrder.discountPercentage > 0 && (
                         <div className="flex justify-between text-red-600">
                           <span>Endirim ({selectedOrder.discountPercentage}%):</span>
                           <span>-{formatPrice(selectedOrder.discountAmount || 0)}</span>
                         </div>
                       )}
                       
                       <div className="flex justify-between font-bold border-t pt-2">
                         <span>Total:</span>
                         <span className="text-red-600">{formatPrice(selectedOrder.total)}</span>
                       </div>
                     </CardContent>
                   </Card>
                 </div>

                 {/* Order Items */}
                 <Card>
                   <CardHeader className="pb-3">
                     <CardTitle className="text-base">Sifariş Məhsulları ({selectedOrder.items.length})</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-2">
                       {selectedOrder.items.map((item, index) => {
                         const originalPrice = item.price;
                         const orderDiscount = selectedOrder.discountPercentage || selectedOrder.userDiscount || 0;
                         const discountAmount = orderDiscount > 0 ? (originalPrice * orderDiscount) / 100 : 0;
                         const discountedPrice = originalPrice - discountAmount;
                         const itemTotal = discountedPrice * item.quantity;
                         
                         return (
                           <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                             <div className="flex-1">
                               <div className="flex items-center justify-between">
                                 <h4 className="font-medium text-sm">{item.name}</h4>
                                 <span className="font-semibold text-sm">{formatPrice(itemTotal)}</span>
                               </div>
                               <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                 <span>SKU: {item.sku || 'N/A'}</span>
                                 <span>Miqdar: {item.quantity}</span>
                                 {orderDiscount > 0 ? (
                                   <div className="flex items-center space-x-1">
                                     <span className="text-red-600 font-medium">{formatPrice(discountedPrice)}</span>
                                     <Badge variant="destructive" className="text-xs px-1 py-0">-{orderDiscount}%</Badge>
                                     <span className="line-through text-gray-400">{formatPrice(originalPrice)}</span>
                                   </div>
                                 ) : (
                                   <span>{formatPrice(originalPrice)} each</span>
                                 )}
                               </div>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </CardContent>
                 </Card>
               </div>
             )}
           </DialogContent>
         </Dialog>

        {/* CSV Import Modal */}
        <Dialog open={csvImportModal} onOpenChange={setCsvImportModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">CSV Məhsul Yükləməsi</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="csv-file" className="text-sm font-medium">
                  CSV Faylı Seçin
                </Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileChange}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Yalnız CSV formatında fayllar qəbul edilir
                </p>
              </div>
              
              {csvFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    Seçilmiş fayl: <strong>{csvFile.name}</strong>
                  </p>
                  <p className="text-xs text-green-600">
                    Ölçü: {(csvFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">CSV Format Nümunəsi:</h4>
                <p className="text-xs text-blue-700 mb-2">
                  CSV faylınız aşağıdakı sütunları ehtiva etməlidir:
                </p>
                <div className="bg-white border rounded p-2 text-xs font-mono">
                  Name,Category,Subcategory,SKU,Catalog Number,Price,Stock Quantity,Description,In Stock
                </div>
                <div className="mt-2 space-y-1 text-xs text-blue-600">
                  <p>• <strong>Name, SKU, Price</strong> - məcburi sahələrdir</p>
                  <p>• <strong>In Stock</strong> - "Yes" və ya "No" olmalıdır</p>
                  <p>• <strong>Price</strong> - rəqəm formatında olmalıdır</p>
                </div>
              </div>

              {csvImportResults && (
                <div className="space-y-3">
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">İmport Nəticəsi:</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-bold text-blue-600">{csvImportResults.summary.totalLines}</p>
                        <p className="text-gray-600">Ümumi</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-green-600">{csvImportResults.summary.successful}</p>
                        <p className="text-gray-600">Uğurlu</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-red-600">{csvImportResults.summary.failed}</p>
                        <p className="text-gray-600">Uğursuz</p>
                      </div>
                    </div>
                  </div>

                  {csvImportResults.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h5 className="font-medium text-red-900 mb-2">Xətalar:</h5>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {csvImportResults.errors.slice(0, 5).map((error, index) => (
                          <p key={index} className="text-xs text-red-700">
                            Sətir {error.line}: {error.error}
                          </p>
                        ))}
                        {csvImportResults.errors.length > 5 && (
                          <p className="text-xs text-red-600 font-medium">
                            ... və {csvImportResults.errors.length - 5} digər xəta
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCsvImportModal(false);
                  setCsvFile(null);
                  setCsvImportResults(null);
                }}
              >
                Ləğv et
              </Button>
              <Button 
                onClick={handleCsvImport}
                disabled={!csvFile || csvImportLoading}
              >
                {csvImportLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Yüklənir...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    İmport Et
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default AdminPage;
