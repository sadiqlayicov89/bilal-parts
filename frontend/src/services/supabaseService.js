// Supabase service for all database operations
import { supabase } from '../config/supabase';

export class SupabaseService {
  // ====================================
  // PRODUCTS
  // ====================================
  
  static async getProducts(filters = {}) {
    try {
      console.log('SupabaseService: Starting to fetch products...');
      console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
      console.log('Supabase Key exists:', !!process.env.REACT_APP_SUPABASE_ANON_KEY);
      
      // Test with simplest possible query
      let query = supabase
        .from('products')
        .select('*');

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }
      
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      if (filters.featured) {
        query = query.eq('is_featured', true);
      }
      
      if (filters.inStock) {
        query = query.eq('in_stock', true);
      }

      // Sorting
      if (filters.sortBy) {
        const { column, ascending } = filters.sortBy;
        query = query.order(column, { ascending });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories!products_category_id_fkey(name, slug),
          product_images(image_url, alt_text, is_primary, sort_order),
          product_specifications(name, value, unit, sort_order)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  static async createProduct(productData) {
    try {
      console.log('SupabaseService: Creating product with data:', productData);
      
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) {
        console.error('SupabaseService: Product creation error:', error);
        console.error('SupabaseService: Error details:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('SupabaseService: Product created successfully:', data);
      return data;
    } catch (error) {
      console.error('SupabaseService: Error creating product:', error);
      throw error;
    }
  }

  static async updateProduct(id, updates) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // ====================================
  // CATEGORIES
  // ====================================
  
  static async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  static async createCategory(categoryData) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // ====================================
  // CART
  // ====================================
  
  static async getCartItems(userId) {
    try {
      // Check if userId is valid
      if (!userId || userId === 'is.null' || userId === 'null') {
        console.log('Invalid userId provided to getCartItems:', userId);
        return [];
      }
      
      console.log('Fetching cart items for user:', userId);
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products(
            id, name, sku, price, original_price, in_stock,
            stock_quantity, catalog_number, category,
            description, specifications
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cart items:', error);
        throw error;
      }
      
      console.log('Fetched cart items:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('SupabaseService: Error fetching cart items:', error);
      throw error;
    }
  }

  static async addToCart(userId, productId, quantity = 1) {
    try {
      // Check if userId is valid
      if (!userId || userId === 'is.null' || userId === 'null') {
        console.log('Invalid userId provided to addToCart:', userId);
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: userId,
          product_id: productId,
          quantity: quantity
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  static async updateCartItem(userId, productId, quantity) {
    try {
      // Check if userId is valid
      if (!userId || userId === 'is.null' || userId === 'null') {
        console.log('Invalid userId provided to updateCartItem:', userId);
        throw new Error('User not authenticated');
      }
      
      if (quantity <= 0) {
        return await this.removeFromCart(userId, productId);
      }
      
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  static async removeFromCart(userId, productId) {
    try {
      // Check if userId is valid
      if (!userId || userId === 'is.null' || userId === 'null') {
        console.log('Invalid userId provided to removeFromCart:', userId);
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  static async clearCart(userId) {
    try {
      // Check if userId is valid
      if (!userId || userId === 'is.null' || userId === 'null') {
        console.log('Invalid userId provided to clearCart:', userId);
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // ====================================
  // WISHLIST
  // ====================================
  
  static async getWishlistItems(userId) {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          products(
            id, name, sku, price, original_price, in_stock,
            product_images(image_url, alt_text, is_primary)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      throw error;
    }
  }

  static async addToWishlist(userId, productId) {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: userId,
          product_id: productId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  static async removeFromWishlist(userId, productId) {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  // ====================================
  // ORDERS
  // ====================================
  
  static async createOrder(orderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async getOrders(userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(name, sku, product_images(image_url, alt_text, is_primary))
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // ====================================
  // CONTACT & NEWSLETTER
  // ====================================
  
  static async submitContactMessage(messageData) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting contact message:', error);
      throw error;
    }
  }

  static async subscribeNewsletter(email) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }

  // ====================================
  // COMPANY INFO
  // ====================================
  
  static async getCompanyInfo() {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching company info:', error);
      throw error;
    }
  }

  // ====================================
  // USERS
  // ====================================
  
  static async getUsers() {
    try {
      console.log('Fetching users from profiles table...');
      
      // Simple query to get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error fetching from profiles table:', profilesError);
        console.error('Error details:', profilesError.message, profilesError.details, profilesError.hint);
        throw profilesError;
      }
      
      console.log('Fetched profiles:', profiles?.length || 0);
      console.log('Profiles data:', profiles);
      
      return profiles || [];
    } catch (error) {
      console.error('SupabaseService: Error fetching users:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      throw error;
    }
  }

  static async updateUser(userId, userData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('SupabaseService: Error updating user:', error);
      throw error;
    }
  }

  // ====================================
  // ORDERS
  // ====================================
  
  static async getOrders() {
    try {
      console.log('Fetching all orders for admin...');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles(email, first_name, last_name),
          order_items(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      console.log('Fetched orders:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('SupabaseService: Error fetching orders:', error);
      throw error;
    }
  }

  static async updateOrderStatus(orderId, status) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('SupabaseService: Error updating order status:', error);
      throw error;
    }
  }

  // ====================================
  // NOTIFICATIONS
  // ====================================
  
  static async getNotifications(userId = null) {
    try {
      console.log('Fetching notifications for user:', userId);
      
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        // Admin notifications (no user_id)
        query = query.is('user_id', null);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
      
      console.log('Fetched notifications:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('SupabaseService: Error fetching notifications:', error);
      throw error;
    }
  }

  static async createNotification(notificationData) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('SupabaseService: Error creating notification:', error);
      throw error;
    }
  }

  static async markNotificationAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('SupabaseService: Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllNotificationsAsRead(userId = null) {
    try {
      let query = supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() });
      
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.is('user_id', null);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('SupabaseService: Error marking all notifications as read:', error);
      throw error;
    }
  }

  static async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('SupabaseService: Error deleting notification:', error);
      throw error;
    }
  }

  // ====================================
  // CART OPERATIONS
  // ====================================

  static async addToCart(userId, productId, quantity = 1) {
    try {
      // Check if item already exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingItem) {
        // Update existing item quantity
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id);
        
        if (updateError) throw updateError;
      } else {
        // Add new item to cart
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity: quantity
          });
        
        if (insertError) throw insertError;
      }

      return { success: true };
    } catch (error) {
      console.error('SupabaseService: Error adding to cart:', error);
      throw error;
    }
  }

  static async updateCartItem(cartItemId, quantity) {
    try {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return await this.removeFromCart(cartItemId);
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartItemId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('SupabaseService: Error updating cart item:', error);
      throw error;
    }
  }

  static async removeFromCart(cartItemId) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('SupabaseService: Error removing from cart:', error);
      throw error;
    }
  }

  static async clearCart(userId) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('SupabaseService: Error clearing cart:', error);
      throw error;
    }
  }
}

export default SupabaseService;
