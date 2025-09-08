import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { mockData } from "../data/mockData";

const ProductCategories = () => {
  const categories = mockData.productCategories;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Main Product Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {categories.slice(0, 3).map((category, index) => (
            <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <div 
                  className="h-64 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${category.image})` }}
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

        {/* Secondary Products Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {categories.slice(3).map((category, index) => (
            <Card key={index} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div 
                  className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300 relative"
                  style={{ backgroundImage: `url(${category.image})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-4 py-2 text-center font-bold text-sm rounded-lg shadow-lg transform group-hover:scale-105 transition-all duration-300">
                      {category.name.toUpperCase()}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{category.name}</h3>
                    <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        View Products <ArrowRight className="w-3 h-3 ml-1" />
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