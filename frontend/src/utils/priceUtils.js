/**
 * Price calculation utilities with user discount support
 */

/**
 * Calculate discounted price based on user's discount percentage
 * @param {number} originalPrice - Original product price
 * @param {number} userDiscount - User's discount percentage (0-100)
 * @returns {number} Discounted price
 */
export const calculateDiscountedPrice = (originalPrice, userDiscount = 0) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  if (!userDiscount || userDiscount <= 0) return originalPrice;
  
  const discountAmount = (originalPrice * userDiscount) / 100;
  return Math.round((originalPrice - discountAmount) * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate discount amount
 * @param {number} originalPrice - Original product price
 * @param {number} userDiscount - User's discount percentage (0-100)
 * @returns {number} Discount amount
 */
export const calculateDiscountAmount = (originalPrice, userDiscount = 0) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  if (!userDiscount || userDiscount <= 0) return 0;
  
  const discountAmount = (originalPrice * userDiscount) / 100;
  return Math.round(discountAmount * 100) / 100;
};

/**
 * Format price for display
 * @param {number} price - Price to format
 * @param {string} currency - Currency symbol (default: ₽)
 * @returns {string} Formatted price
 */
export const formatPrice = (price, currency = '₽') => {
  if (!price || price <= 0) return `0 ${currency}`;
  const numPrice = typeof price === 'number' ? price : parseFloat(price);
  if (isNaN(numPrice)) return `0 ${currency}`;
  return `${numPrice.toFixed(2)} ${currency}`;
};

/**
 * Calculate total cart value with user discount
 * @param {Array} cartItems - Array of cart items
 * @param {number} userDiscount - User's discount percentage (0-100)
 * @returns {Object} Cart totals
 */
export const calculateCartTotals = (cartItems, userDiscount = 0) => {
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  const discountAmount = calculateDiscountAmount(subtotal, userDiscount);
  const total = subtotal - discountAmount;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    discountPercentage: userDiscount,
    total: Math.round(total * 100) / 100
  };
};

/**
 * Get price display info for a product
 * @param {Object} product - Product object
 * @param {number} userDiscount - User's discount percentage (0-100)
 * @returns {Object} Price display information
 */
export const getProductPriceInfo = (product, userDiscount = 0) => {
  const originalPrice = product.price || 0;
  const discountedPrice = calculateDiscountedPrice(originalPrice, userDiscount);
  const hasDiscount = userDiscount > 0 && originalPrice > discountedPrice;
  
  return {
    originalPrice,
    discountedPrice,
    hasDiscount,
    discountPercentage: userDiscount,
    discountAmount: calculateDiscountAmount(originalPrice, userDiscount),
    displayPrice: hasDiscount ? discountedPrice : originalPrice
  };
};
