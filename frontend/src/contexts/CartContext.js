import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/use-toast';
import { calculateCartTotals, getProductPriceInfo } from '../utils/priceUtils';
import SupabaseService from '../services/supabaseService';

const BACKEND_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
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
    // Only load cart if user is authenticated
    if (isAuthenticated && user?.id) {
      loadCart();
    }
  }, [isAuthenticated, user?.id]);

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
      
      // Check if user is authenticated
      if (!isAuthenticated || !user?.id) {
        console.log('User not authenticated, clearing cart');
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
        return;
      }
      
      // Load cart from Supabase
      const cartItems = await SupabaseService.getCartItems(user.id);
      
      // Transform cart items to match expected format
      const transformedItems = cartItems.map(item => ({
        id: item.id,
        product: {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          images: [], // No images column in products table
          in_stock: item.products.in_stock,
          stock_quantity: item.products.stock_quantity,
          catalogNumber: item.products.catalog_number,
          sku: item.products.sku,
          category: item.products.category,
          description: item.products.description,
          specifications: item.products.specifications
        },
        quantity: item.quantity,
        item_total: item.products.price * item.quantity
      }));
      
      setCartItems(transformedItems);
      setCartCount(transformedItems.reduce((sum, item) => sum + item.quantity, 0));
      
      // Calculate total with discount
      const totals = calculateCartTotalWithDiscount(transformedItems);
      setCartTotal(totals.total);
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
      
      // Add to Supabase cart
      console.log('Adding product to Supabase cart');
      await SupabaseService.addToCart(user.id, productId, quantity);
      
      // Reload cart to get updated data
      await loadCart();
        
      toast({
        title: 'Added to Cart',
        description: 'Item has been added to your cart.',
      });

      return { success: true };
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

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      setLoading(true);
      
      // Update quantity in Supabase
      await SupabaseService.updateCartItem(cartItemId, quantity);
      
      // Reload cart to get updated data
      await loadCart();
      
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

  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      
      // Remove from Supabase
      await SupabaseService.removeFromCart(cartItemId);
      
      // Reload cart to get updated data
      await loadCart();
      
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
      
      // Clear cart in Supabase
      await SupabaseService.clearCart(user.id);
      
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