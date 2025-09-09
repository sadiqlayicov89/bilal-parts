// Supabase service for all database operations
import { supabase } from '../config/supabase';

export class SupabaseService {
  // ====================================
  // PRODUCTS
  // ====================================
  
  static async getProducts(filters = {}) {
    try {
      // First try simple query without joins
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

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
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
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
      const { data, error } = await supabase
        .from('cart_items')
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
      console.error('Error fetching cart items:', error);
      throw error;
    }
  }

  static async addToCart(userId, productId, quantity = 1) {
    try {
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
}

export default SupabaseService;
