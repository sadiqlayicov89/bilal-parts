import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockData } from '../data/mockData';
import SupabaseService from '../services/supabaseService';

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load categories from Supabase or use mockData as fallback
  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Try to load from Supabase first
      const supabaseCategories = await SupabaseService.getCategories();
      
      if (supabaseCategories && supabaseCategories.length > 0) {
        // Convert Supabase categories to the format expected by the context
        // Only show main categories (parent_id is null), with their subcategories
        const mainCategories = supabaseCategories.filter(cat => cat.parent_id === null);
        
        const formattedCategories = mainCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
          description: cat.description || '',
          image: cat.image || cat.image_url || '',
          parent_id: cat.parent_id,
          is_active: cat.is_active,
          sort_order: cat.sort_order || 0,
          subcategories: supabaseCategories
            .filter(sub => sub.parent_id === cat.id)
            .map(sub => ({
              id: sub.id,
              name: sub.name,
              slug: sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-')
            }))
        }));
        
        setCategories(formattedCategories);
        console.log('Categories loaded from Supabase in context (main categories only):', formattedCategories);
      } else {
        // Fallback to localStorage
        const savedCategories = localStorage.getItem('adminCategories');
        if (savedCategories) {
          const parsedCategories = JSON.parse(savedCategories);
          setCategories(parsedCategories);
        } else {
          // Use mockData categories as final fallback
          setCategories(mockData.productCategories);
          localStorage.setItem('adminCategories', JSON.stringify(mockData.productCategories));
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      
      // Fallback to localStorage on error
      try {
        const savedCategories = localStorage.getItem('adminCategories');
        if (savedCategories) {
          const parsedCategories = JSON.parse(savedCategories);
          setCategories(parsedCategories);
        } else {
          setCategories(mockData.productCategories);
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
        setCategories(mockData.productCategories);
      }
    } finally {
      setLoading(false);
    }
  };

  // Save categories to localStorage
  const saveCategories = (newCategories) => {
    try {
      localStorage.setItem('adminCategories', JSON.stringify(newCategories));
      setCategories(newCategories);
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  // Add new category
  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: Date.now(), // Simple ID generation
      slug: category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      subcategories: category.subcategories || []
    };
    
    const updatedCategories = [...categories, newCategory];
    saveCategories(updatedCategories);
    return newCategory;
  };

  // Update category
  const updateCategory = (id, updatedCategory) => {
    const updatedCategories = categories.map(cat => 
      cat.id === id ? { ...cat, ...updatedCategory } : cat
    );
    saveCategories(updatedCategories);
  };

  // Delete category
  const deleteCategory = (id) => {
    const updatedCategories = categories.filter(cat => cat.id !== id);
    saveCategories(updatedCategories);
  };

  // Get category by slug
  const getCategoryBySlug = (slug) => {
    return categories.find(cat => cat.slug === slug);
  };

  // Get main categories (without subcategories for display)
  const getMainCategories = () => {
    const mainCategories = categories
      .filter(cat => cat.name && cat.slug) // Filter out categories without name or slug
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        link: `/products/${cat.slug}`
      }));
    return mainCategories;
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const value = {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryBySlug,
    getMainCategories,
    saveCategories,
    loadCategories
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
