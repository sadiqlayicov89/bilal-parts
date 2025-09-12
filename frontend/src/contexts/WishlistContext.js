import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/use-toast';
import mockData from '../data/mockData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Wishlist-i təmizlə və yenidən yüklə
      localStorage.removeItem('mock-wishlist');
      loadWishlist();
    } else {
      // Clear wishlist when user logs out
      setWishlistItems([]);
      setWishlistCount(0);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      
      // Mock data ile çalış - backend olmadan
      const savedWishlist = localStorage.getItem('mock-wishlist');
      if (savedWishlist) {
        const wishlistData = JSON.parse(savedWishlist);
        // console.log('Loaded wishlist data:', wishlistData); // Commented out to reduce console spam
        
        // Köhnə data strukturunu yeni strukturə çevir
        const normalizedWishlist = wishlistData.map(item => {
          // Əgər item.product yoxdursa, köhnə struktur deməkdir
          if (!item.product) {
            // console.log('Converting old wishlist item:', item); // Commented out to reduce console spam
            // MockData-dan product məlumatlarını tap
            const product = mockData.products.find(p => p.id === item.id || p.id === item.product_id);
            
            if (product) {
              return {
                id: item.id || item.product_id,
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  category: product.category,
                  image: product.image,
                  images: product.image ? [product.image] : [],
                  in_stock: product.in_stock !== undefined ? product.in_stock : true
                }
              };
            } else {
              // Product tapılmadısa, fallback yarat
              return {
                id: item.id || item.product_id,
                product: {
                  id: item.id || item.product_id,
                  name: item.name || `Product ${item.id || item.product_id}`,
                  price: item.price || 0,
                  category: item.category || 'General',
                  image: item.image || '/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyN0g0MFYzOEgyNFYyN1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMyIDIwQzMyIDIwIDMyIDIwIDMyIDIwQzMyIDIwIDMyIDIwIDMyIDIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K',
                  images: item.image ? [item.image] : [],
                  in_stock: item.in_stock !== undefined ? item.in_stock : true
                }
              };
            }
          }
          
          // Əgər item.product varsa, yeni struktur deməkdir
          return item;
        });
        
        // console.log('Normalized wishlist data:', normalizedWishlist); // Commented out to reduce console spam
        setWishlistItems(normalizedWishlist);
        setWishlistCount(normalizedWishlist.length);
        
        // Normalized data-nı localStorage-a kaydet
        localStorage.setItem('mock-wishlist', JSON.stringify(normalizedWishlist));
      } else {
        // console.log('No saved wishlist found'); // Commented out to reduce console spam
        setWishlistItems([]);
        setWishlistCount(0);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      setWishlistItems([]);
      setWishlistCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to your wishlist.',
        variant: 'destructive'
      });
      return { success: false };
    }

    try {
      setLoading(true);
      
      // Mock data ile çalış - backend olmadan
      // Real product data-nı mockData-dan al
      const product = mockData.products.find(p => p.id === productId);
      
      if (!product) {
        // Eğer mockData'da bulunamazsa, basit bir product objesi oluştur
        const fallbackProduct = {
          id: productId,
          name: `Product ${productId}`,
          price: 99.99,
          category: 'General'
        };
        
        // Mevcut wishlist'i al
        const currentWishlist = JSON.parse(localStorage.getItem('mock-wishlist') || '[]');
        
        // Ürün zaten wishlist'te var mı kontrol et
        const existingItem = currentWishlist.find(item => item.id === productId);
        
        if (existingItem) {
          toast({
            title: 'Already in Wishlist',
            description: 'This item is already in your wishlist.',
          });
          return { success: false, error: 'Item already in wishlist' };
        }
        
        // Yeni ürünü ekle - product objesi olarak
        currentWishlist.push({
          id: productId,
          product: {
            id: productId,
            name: fallbackProduct.name,
            price: fallbackProduct.price,
            category: fallbackProduct.category,
            images: [],
            in_stock: true
          }
        });
        
        // LocalStorage'a kaydet
        localStorage.setItem('mock-wishlist', JSON.stringify(currentWishlist));
        
        // State'i güncelle
        setWishlistItems(currentWishlist);
        setWishlistCount(currentWishlist.length);
        
        toast({
          title: 'Added to Wishlist',
          description: 'Item has been added to your wishlist.',
        });

        return { success: true };
      }
      
      // Mevcut wishlist'i al
      const currentWishlist = JSON.parse(localStorage.getItem('mock-wishlist') || '[]');
      
      // Ürün zaten wishlist'te var mı kontrol et
      const existingItem = currentWishlist.find(item => item.id === productId);
      
      if (existingItem) {
        toast({
          title: 'Already in Wishlist',
          description: 'This item is already in your wishlist.',
        });
        return { success: false, error: 'Item already in wishlist' };
      }
      
      // Yeni ürünü ekle - product objesi olarak
      currentWishlist.push({
        id: productId,
        product: {
          id: productId,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image,
          images: product.image ? [product.image] : [],
          in_stock: product.in_stock !== undefined ? product.in_stock : true
        }
      });
      
      // LocalStorage'a kaydet
      localStorage.setItem('mock-wishlist', JSON.stringify(currentWishlist));
      
              // State'i güncelle
        // console.log('Updated wishlist data:', currentWishlist); // Commented out to reduce console spam
        setWishlistItems(currentWishlist);
        setWishlistCount(currentWishlist.length);
      
      toast({
        title: 'Added to Wishlist',
        description: 'Item has been added to your wishlist.',
      });

      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to add item to wishlist';
      
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

  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      
      // Mock data ile çalış - backend olmadan
      const currentWishlist = JSON.parse(localStorage.getItem('mock-wishlist') || '[]');
      
      // Ürünü wishlist'ten çıkar
      const updatedWishlist = currentWishlist.filter(item => item.id !== productId);
      
      // LocalStorage'a kaydet
      localStorage.setItem('mock-wishlist', JSON.stringify(updatedWishlist));
      
      // State'i güncelle
      setWishlistItems(updatedWishlist);
      setWishlistCount(updatedWishlist.length);
      
      toast({
        title: 'Removed from Wishlist',
        description: 'Item has been removed from your wishlist.',
      });

      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to remove item from wishlist';
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

  const toggleWishlist = async (productId) => {
    const isInWishlist = await checkInWishlist(productId);
    
    if (isInWishlist) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const checkInWishlist = async (productId) => {
    if (!isAuthenticated) return false;
    
    try {
      // Mock data ile çalış - backend olmadan
      const currentWishlist = JSON.parse(localStorage.getItem('mock-wishlist') || '[]');
      const isInWishlist = currentWishlist.some(item => item.id === productId);
      // console.log(`Checking wishlist for product ${productId}: ${isInWishlist}`); // Commented out to reduce console spam
      return isInWishlist;
    } catch (error) {
      console.error('Failed to check wishlist:', error);
      return false;
    }
  };

  const clearWishlist = async () => {
    try {
      setLoading(true);
      
      // Mock data ile çalış - backend olmadan
      localStorage.removeItem('mock-wishlist');
      
      setWishlistItems([]);
      setWishlistCount(0);
      
      toast({
        title: 'Wishlist Cleared',
        description: 'All items have been removed from your wishlist.',
      });

      return { success: true };
    } catch (error) {
      const message = error.message || 'Failed to clear wishlist';
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

  const getWishlistCount = async () => {
    if (!isAuthenticated) return 0;
    
    try {
      // Mock data ile çalış - backend olmadan
      const savedWishlist = localStorage.getItem('mock-wishlist');
      if (savedWishlist) {
        const wishlistData = JSON.parse(savedWishlist);
        return wishlistData.length || 0;
      }
      return 0;
    } catch (error) {
      console.error('Failed to get wishlist count:', error);
      return 0;
    }
  };

  const value = {
    wishlistItems,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    checkInWishlist,
    clearWishlist,
    loadWishlist,
    getWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};