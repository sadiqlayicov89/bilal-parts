import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useCategories } from "../contexts/CategoryContext";
import { mockData } from "../data/mockData";

const ProductCategories = () => {
  const { categories: contextCategories, loading } = useCategories();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (contextCategories && contextCategories.length > 0) {
      setCategories(contextCategories);
    } else {
      setCategories(mockData.productCategories);
    }
  }, [contextCategories]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* All Categories Grid - Equal Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <div 
                  className="h-64 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${category.image || category.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-6 py-3 text-center font-bold text-lg rounded-lg shadow-lg transform group-hover:scale-105 transition-all duration-300">
                      {category.name.toUpperCase()}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{category.name}</h3>
                    <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                      <Button 
                        variant="ghost" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        View Products <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;