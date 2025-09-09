import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { useCategories } from "../contexts/CategoryContext";
import { mockData } from "../data/mockData";

const Footer = () => {
  const navigate = useNavigate();
  const [adminCategories, setAdminCategories] = useState([]);
  
  const aboutLinks = [
    { name: "Message from chairman", link: "/company#messagefromchairman" },
    { name: "Honor", link: "/company#companyhonor" },
    { name: "History", link: "/company#companyhistory" },
    { name: "News", link: "/news" }
  ];

  // Load categories from localStorage (admin panel categories)
  useEffect(() => {
    const loadCategories = () => {
      try {
        const savedCategories = localStorage.getItem('adminCategories');
        if (savedCategories) {
          const parsedCategories = JSON.parse(savedCategories);
          setAdminCategories(parsedCategories);
        } else {
          // Use mockData categories as default
          setAdminCategories(mockData.productCategories);
        }
      } catch (error) {
        console.error('Failed to load categories from localStorage:', error);
        setAdminCategories(mockData.productCategories);
      }
    };

    // Load categories on component mount
    loadCategories();

    // Listen for storage changes (when admin panel updates categories)
    const handleStorageChange = (e) => {
      if (e.key === 'adminCategories') {
        loadCategories();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event (for same-tab updates)
    window.addEventListener('categoriesUpdated', loadCategories);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('categoriesUpdated', loadCategories);
    };
  }, []);

  // Convert admin categories to footer format
  const productLinks = adminCategories.map(category => ({
    name: category.name,
    link: `/products?category=${encodeURIComponent(category.name)}`
  }));

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* About Us */}
          <div>
            <div className="flex items-center mb-4 md:mb-6">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-red-600 rounded mr-2 md:mr-3"></div>
              <h3 className="text-lg md:text-xl font-bold">ABOUT US</h3>
            </div>
            <ul className="space-y-2 md:space-y-3">
              {aboutLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.link}
                    className="text-gray-300 hover:text-white transition-colors text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <div className="flex items-center mb-4 md:mb-6">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-red-600 rounded mr-2 md:mr-3"></div>
              <h3 className="text-lg md:text-xl font-bold">PRODUCTS</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {productLinks.slice(0, 8).map((link, index) => (
                <Link
                  key={index}
                  to={link.link}
                  className="text-gray-300 hover:text-white transition-colors text-xs md:text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {productLinks.slice(8).map((link, index) => (
                <Link
                  key={index}
                  to={link.link}
                  className="text-gray-300 hover:text-white transition-colors text-xs md:text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <div className="flex items-center mb-4 md:mb-6">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-red-600 rounded mr-2 md:mr-3"></div>
              <h3 className="text-lg md:text-xl font-bold">CONTACT US</h3>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div>
                <h4 className="text-base md:text-lg font-semibold text-red-400 mb-2">BILAL-PARTS CO.,LTD</h4>
                <div className="space-y-1 md:space-y-2 text-gray-300 text-sm md:text-base">
                  <p>Email: admin@bilal-parts.com</p>
                  <p>Tel：0086-18520438258</p>
                  <p>Fax：0086-20-3999 3597</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs md:text-sm text-gray-400 mb-2">
                  Subsidiary company：GUANGZHOU PENGZE MACHINERY EQUIPMENT CO.,LTD
                </p>
                <p className="text-xs md:text-sm text-gray-300">
                  Address：No. 999,Asian Games Avenue,Shiqi Town,Panyu District,Guangzhou,China.
                </p>
              </div>

              <Button 
                className="bg-red-600 hover:bg-red-700 text-white mt-3 md:mt-4 text-sm md:text-base w-full sm:w-auto"
                onClick={() => navigate('/contact')}
              >
                more contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Navigation Links */}
            <nav className="flex space-x-6 mb-4 md:mb-0">
              <Link to="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                HOME
              </Link>
              <Link to="/products" className="text-gray-300 hover:text-white text-sm transition-colors">
                PRODUCTS
              </Link>
              <Link to="/company" className="text-gray-300 hover:text-white text-sm transition-colors">
                COMPANY
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">
                CONTACT
              </Link>
            </nav>

            {/* Social Media */}
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-2"
                onClick={() => window.open('https://www.facebook.com/', '_blank')}
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-2"
                onClick={() => window.open('https://twitter.com/', '_blank')}
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-2"
                onClick={() => window.open('https://www.linkedin.com/', '_blank')}
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-2"
                onClick={() => window.open('https://www.youtube.com/', '_blank')}
              >
                <Youtube className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-2"
                onClick={() => window.open('https://www.instagram.com/', '_blank')}
              >
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              Copyright © 2015-2025 广州佛朗斯股份有限公司 All Rights Reserved
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Elements */}
      <div className="fixed bottom-6 right-6 space-y-2 z-40">
        <Button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg"
          onClick={() => navigate('/contact')}
        >
          CONTACT WITH US NOW!
        </Button>
        <Button
          variant="outline"
          className="bg-white text-gray-600 border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-full shadow-lg block text-center"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          TOP
        </Button>
      </div>
    </footer>
  );
};

export default Footer;