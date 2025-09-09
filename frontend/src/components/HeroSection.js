import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const slides = [
    {
      title: "INDUSTRY LEADER IN FORKLIFT PARTS SOLUTIONS",
      subtitle: "STOCK CODE: 02499. HK",
      description: "LISTED ON THE MAIN BOARD OF THE HKEX",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
      buttonText: "CONTACT"
    },
    {
      title: "PREMIUM FORKLIFT PARTS & ACCESSORIES",
      subtitle: "Over 3,000,000 parts in stock",
      description: "Fast delivery worldwide with quality guarantee",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop",
      buttonText: "EXPLORE"
    },
    {
      title: "21 YEARS OF INDUSTRY EXPERIENCE",
      subtitle: "Trusted by customers globally",
      description: "Professional technical support and comprehensive service",
      image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=1200&h=600&fit=crop",
      buttonText: "LEARN MORE"
    },
    {
      title: "WORLDWIDE DISTRIBUTION NETWORK",
      subtitle: "150+ countries and regions",
      description: "Local support with global reach",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop",
      buttonText: "CONTACT"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <h2 className="text-xs md:text-sm font-medium mb-2 tracking-wide">
                    {slide.subtitle}
                  </h2>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-lg lg:text-xl mb-6 md:mb-8 opacity-90">
                    {slide.description}
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-2 md:py-3 text-sm md:text-lg font-medium"
                    onClick={() => {
                      if (slide.buttonText === "CONTACT") {
                        navigate('/contact');
                      } else if (slide.buttonText === "EXPLORE") {
                        navigate('/products');
                      } else if (slide.buttonText === "LEARN MORE") {
                        navigate('/company');
                      }
                    }}
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="lg"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 z-20"
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>
      
      <Button
        variant="ghost"
        size="lg"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 z-20"
      >
        <ChevronRight className="w-8 h-8" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-red-600" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>

      {/* Contact Button (Fixed Position) */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30">
        <Button
          className="bg-red-600 hover:bg-red-700 text-white px-2 py-8 rounded-l-lg rounded-r-none"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          onClick={() => navigate('/contact')}
        >
          CONTACT
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;