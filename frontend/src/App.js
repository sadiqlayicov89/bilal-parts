import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { OrderProvider } from "./contexts/OrderContext";
import { Toaster } from "./components/ui/toaster";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CompanyPage from "./pages/CompanyPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import AdminPage from "./pages/AdminPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import MyOrdersPage from "./pages/MyOrdersPage";

function App() {
  return (
    <div className="App">
      <SupabaseAuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CategoryProvider>
              <OrderProvider>
                <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:productId" element={<ProductDetailPage />} />
                <Route path="/company" element={<CompanyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/profile" element={<ProfileSettingsPage />} />
                <Route path="/orders" element={<MyOrdersPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
              <Toaster />
                </BrowserRouter>
              </OrderProvider>
            </CategoryProvider>
          </WishlistProvider>
        </CartProvider>
      </SupabaseAuthProvider>
    </div>
  );
}

export default App;