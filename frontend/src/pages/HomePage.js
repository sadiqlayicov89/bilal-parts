import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CompanyHighlights from "../components/CompanyHighlights";
import ProductCategories from "../components/ProductCategories";
import HotProducts from "../components/HotProducts";
import CompanyProfile from "../components/CompanyProfile";
import NewsSection from "../components/NewsSection";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CompanyHighlights />
      <ProductCategories />
      <HotProducts />
      <CompanyProfile />
      <NewsSection />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default HomePage;