import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { mockData } from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";
import { getProductPriceInfo, formatPrice } from "../utils/priceUtils";
import SupabaseService from "../services/supabaseService";

const HotProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userDiscount } = useAuth();
  
  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const supabaseProducts = await SupabaseService.getProducts();
        
        if (supabaseProducts && supabaseProducts.length > 0) {
          // Get first 6 products from Supabase
          const formattedProducts = supabaseProducts.slice(0, 6).map(product => ({
            name: product.name,
            code: product.sku,
            image: product.product_images && product.product_images.length > 0 
              ? product.product_images[0].image_url 
              : 'https://images.unsplash.com/photo-1581093458791-9d42e30754c4?w=300&h=200&fit=crop',
            images: product.product_images ? product.product_images.map(img => img.image_url) : [],
            price: parseFloat(product.price) || 0,
            originalPrice: parseFloat(product.original_price) || parseFloat(product.price) || 0,
            id: product.id,
            category: product.categories?.name || 'Unknown',
            in_stock: product.in_stock,
            stock_quantity: product.stock_quantity || 0
          }));
          setProducts(formattedProducts);
        } else {
          // Fallback to localStorage or mockData
          const savedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
          const sourceProducts = savedProducts.length > 0 ? savedProducts : mockData.products;
          
          const formattedProducts = sourceProducts.slice(0, 6).map(product => ({
            name: product.name,
            code: product.sku,
            image: product.images && product.images.length > 0 ? product.images[0] : product.image,
            images: product.images || (product.image ? [product.image] : []),
            price: product.price,
            originalPrice: product.originalPrice,
            id: product.id
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to localStorage or mockData
        const savedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        const sourceProducts = savedProducts.length > 0 ? savedProducts : mockData.products;
        
        const formattedProducts = sourceProducts.slice(0, 6).map(product => ({
          name: product.name,
          code: product.sku,
          image: product.images && product.images.length > 0 ? product.images[0] : product.image,
          images: product.images || (product.image ? [product.image] : []),
          price: product.price,
          originalPrice: product.originalPrice,
          id: product.id
        }));
        setProducts(formattedProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (products.length - 5));
    }, 4000);
    return () => clearInterval(timer);
  }, [products.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (products.length - 5));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (products.length - 5)) % (products.length - 5));
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
              HOT PRODUCTS
            </h2>
            <p className="text-lg text-gray-600">
              Loading products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
            HOT PRODUCTS
          </h2>
        </div>

        <div className="relative">
          {/* Products Carousel */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 20}%)` }}
            >
              {products.map((product, index) => (
                <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 flex-shrink-0 px-2">
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <div 
                        className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundImage: `url(${product.image})` }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 text-sm leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        SKU: {product.code}
                      </p>
                      {product.catalogNumber && (
                        <p className="text-xs text-gray-500 mb-2 font-medium">
                          Catalog: {product.catalogNumber}
                        </p>
                      )}
                      
                      {/* Price */}
                      <div className="mb-3">
                        {(() => {
                          const priceInfo = getProductPriceInfo(product, userDiscount);
                          
                          if (priceInfo.hasDiscount) {
                            return (
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-bold text-red-600">
                                    {formatPrice(priceInfo.discountedPrice)}
                                  </span>
                                  <Badge variant="destructive" className="text-xs">
                                    -{userDiscount}%
                                  </Badge>
                                </div>
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(priceInfo.originalPrice)}
                                </span>
                              </div>
                            );
                          }
                          
                          return (
                            <span className="text-lg font-bold text-red-600">
                              {formatPrice(priceInfo.displayPrice)}
                            </span>
                          );
                        })()}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="lg"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl text-red-600 hover:text-red-700"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl text-red-600 hover:text-red-700"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: products.length - 5 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-red-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Button 
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8"
            onClick={() => navigate('/products')}
          >
            MORE PRODUCTS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HotProducts;