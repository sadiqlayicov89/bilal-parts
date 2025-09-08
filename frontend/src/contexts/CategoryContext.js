import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockData } from '../data/mockData';

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

  // Load categories from localStorage or use mockData as fallback
  const loadCategories = () => {
    try {
      const savedCategories = localStorage.getItem('adminCategories');
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
      } else {
        // Use mockData categories as default
        setCategories(mockData.productCategories);
        // Save to localStorage for consistency
        localStorage.setItem('adminCategories', JSON.stringify(mockData.productCategories));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories(mockData.productCategories);
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
