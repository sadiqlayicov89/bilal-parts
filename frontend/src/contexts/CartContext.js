import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/use-toast';
import { mockData } from '../data/mockData';
import { calculateCartTotals, getProductPriceInfo } from '../utils/priceUtils';
import SupabaseService from '../services/supabaseService';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user, userDiscount } = useAuth();
  const { toast } = useToast();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    }
  }, [isAuthenticated]);

  // Load cart on page refresh/load
  useEffect(() => {
    // Səhifə yükləndikdə localStorage-dan cart məlumatlarını yüklə
    const savedCart = localStorage.getItem('mock-cart');
    if (savedCart && isAuthenticated) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && parsedCart.items.length > 0) {
          setCartItems(parsedCart.items);
          setCartCount(parsedCart.total_items || 0);
          setCartTotal(parsedCart.total_amount || 0);
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []); // Empty dependency array - runs only once on mount

  // Calculate cart totals with user discount
  const calculateCartTotalWithDiscount = (items) => {
    const cartItemsForCalculation = items.map(item => ({
      price: item.product ? item.product.price : item.price,
      quantity: item.quantity
    }));
    
    return calculateCartTotals(cartItemsForCalculation, userDiscount);
  };

  const loadCart = async () => {
    try {
      setLoading(true);
      
      // Use localStorage for development
      const savedCart = localStorage.getItem('mock-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        
        // Convert old data structure to new structure
        const normalizedItems = (parsedCart.items || []).map(item => {
          if (item.product) {
            return {
              ...item,
              item_total: item.product.price * item.quantity
            };
          }
          
          // Old structure: {product_id, name, price, quantity}
          // Convert to new structure: {id, product: {...}, quantity, item_total}
          const fullProduct = mockData.products.find(p => p.id === (item.product_id || item.id));
          return {
            id: item.product_id || item.id,
            product: {
              id: item.product_id || item.id,
              name: item.name,
              price: item.price,
              images: fullProduct?.image ? [fullProduct.image] : [],
              in_stock: fullProduct?.in_stock !== undefined ? fullProduct.in_stock : true,
              stock_quantity: fullProduct?.stock_quantity || 0,
              catalogNumber: fullProduct?.catalogNumber,
              sku: fullProduct?.sku,
              category: fullProduct?.category,
              subcategory: fullProduct?.subcategory,
              description: fullProduct?.description,
              specifications: fullProduct?.specifications
            },
            quantity: item.quantity,
            item_total: item.price * item.quantity
          };
        });
        
        setCartItems(normalizedItems);
        setCartCount(normalizedItems.reduce((sum, item) => sum + item.quantity, 0));
        const totals = calculateCartTotalWithDiscount(normalizedItems);
        setCartTotal(totals.total);
        
        // Save normalized data to localStorage
        localStorage.setItem('mock-cart', JSON.stringify({
          items: normalizedItems,
          total_items: normalizedItems.reduce((sum, item) => sum + item.quantity, 0),
          total_amount: normalizedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        }));
      } else {
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to your cart.',
        variant: 'destructive'
      });
      return { success: false };
    }

    try {
      setLoading(true);
      
      // Try backend API first
      try {
        const response = await axios.post(`${API}/cart/add`, {
          productId,
          quantity
        });
        
        // Reload cart to get updated data
        await loadCart();
        
        toast({
          title: 'Added to Cart',
          description: response.data.message || 'Item has been added to your cart.',
        });

        return { success: true };
      } catch (apiError) {
        // Fallback to localStorage for development
        console.log('Backend API not available, using localStorage cart');
        
        const product = mockData.products.find(p => p.id === productId);
        if (!product) {
          throw new Error('Product not found');
        }
        
        // Get current cart
        const currentCart = JSON.parse(localStorage.getItem('mock-cart') || '{"items": [], "total_items": 0, "total_amount": 0}');
        
        // Check if product already exists in cart
        const existingItem = currentCart.items.find(item => item.id === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.item_total = existingItem.product.price * existingItem.quantity;
        } else {
          currentCart.items.push({
            id: productId,
            product: {
              id: productId,
              name: product.name,
              price: product.price,
              images: product.image ? [product.image] : [],
              in_stock: product.in_stock !== undefined ? product.in_stock : true,
              stock_quantity: product.stock_quantity || 0,
              catalogNumber: product.catalogNumber,
              sku: product.sku,
              category: product.category,
              subcategory: product.subcategory,
              description: product.description,
              specifications: product.specifications
            },
            quantity: quantity,
            item_total: product.price * quantity
          });
        }
        
        // Update totals
        currentCart.total_items = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
        currentCart.total_amount = currentCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        // Save to localStorage
        localStorage.setItem('mock-cart', JSON.stringify(currentCart));
        
        // Update state
        setCartItems(currentCart.items);
        setCartCount(currentCart.total_items);
        setCartTotal(currentCart.total_amount);
        
        toast({
          title: 'Added to Cart',
          description: 'Item has been added to your cart.',
        });

        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add item to cart';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      
      // Mock data ile çalış - backend olmadan
      const currentCart = JSON.parse(localStorage.getItem('mock-cart') || '{"items": [], "total_items": 0, "total_amount": 0}');
      
      // Ürün miktarını güncelle
      const item = currentCart.items.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
        item.item_total = item.product.price * quantity;
        
        // Toplamları güncelle
        currentCart.total_items = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
        // İndirimli toplam hesapla
        const discountedTotal = calculateCartTotal(currentCart.items);
        
        // LocalStorage'a kaydet
        localStorage.setItem('mock-cart', JSON.stringify(currentCart));
        
        // State'i güncelle
        setCartItems(currentCart.items);
        setCartCount(currentCart.total_items);
        setCartTotal(discountedTotal);
      }
      
      toast({
        title: 'Cart Updated',
        description: 'Item quantity has been updated.',
      });

      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to update cart';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      
      // Mock data ile çalış - backend olmadan
      const currentCart = JSON.parse(localStorage.getItem('mock-cart') || '{"items": [], "total_items": 0, "total_amount": 0}');
      
      // Ürünü cart'tan çıkar
      currentCart.items = currentCart.items.filter(item => item.id !== productId);
      
      // Toplamları güncelle
      currentCart.total_items = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
      // İndirimli toplam hesapla
      const discountedTotal = calculateCartTotal(currentCart.items);
      
      // LocalStorage'a kaydet
      localStorage.setItem('mock-cart', JSON.stringify(currentCart));
      
      // State'i güncelle
      setCartItems(currentCart.items);
      setCartCount(currentCart.total_items);
      setCartTotal(discountedTotal);
      
      toast({
        title: 'Removed from Cart',
        description: 'Item has been removed from your cart.',
      });

      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to remove item';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      
      // Mock data ile çalış - backend olmadan
      localStorage.removeItem('mock-cart');
      
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      
      toast({
        title: 'Cart Cleared',
        description: 'All items have been removed from your cart.',
      });

      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to clear cart';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getCartCount = async () => {
    if (!isAuthenticated) return 0;
    
    try {
      // Mock data ile çalış - backend olmadan
      const savedCart = localStorage.getItem('mock-cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        return cartData.total_items || 0;
      }
      return 0;
    } catch (error) {
      console.error('Failed to get cart count:', error);
      return 0;
    }
  };

  // Get detailed cart totals with discount breakdown
  const getCartTotals = () => {
    if (!cartItems || cartItems.length === 0) {
      return {
        subtotal: 0,
        discountAmount: 0,
        discountPercentage: 0,
        total: 0,
        hasDiscount: false
      };
    }
    
    const totals = calculateCartTotalWithDiscount(cartItems);
    return {
      ...totals,
      hasDiscount: totals.discountPercentage > 0 && totals.discountAmount > 0
    };
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    getCartCount,
    getCartTotals, // Add detailed totals function
    userDiscount, // Add user discount to context
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};