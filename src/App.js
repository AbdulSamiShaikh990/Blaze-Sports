import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import GeminiChat from "./components/GeminiChat"; 
import NewLoginPage from './components/pages/NewLoginPage';
import ForgotPassword from "./components/pages/ForgotPassword"; 
import Home from "./components/pages/Home";
import Cart from "./components/pages/Cart"; 
import AIRecommendation from "./components/pages/AIRecommendation";
import AdminDashboard from "./components/admin/AdminDashboard";
import Users from "./components/admin/Users";
import AdminProducts from "./components/admin/Products";
import Categories from "./components/admin/Categories";
import ProtectedRoute from "./components/ProtectedRoute";

import Products from "./components/pages/Products";
import ProductDetails from "./components/pages/ProductDetails";
import AboutUs from "./components/pages/AboutUs";
import Contact from "./components/pages/Contact";
import FirebaseAuth from "./components/pages/FirebaseAuth";

import { ThemeProvider } from "./context/ThemeContext";
import { ShopProvider } from "./context/ShopContext";
import { AuthProvider } from "./context/AuthContext";
import 'boxicons/css/boxicons.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { FilterProvider } from './components/Sidebar';
import { CartProvider } from './context/CartContext';

// Floating Elements Component
const FloatingElements = () => (
  <div className="floating-elements">
    <div className="floating-element"></div>
    <div className="floating-element"></div>
    <div className="floating-element"></div>
  </div>
);

// Animated Route Component
const AnimatedRoute = ({ children }) => {
  const location = useLocation();
  return (
    <div className="page-transition" key={location.pathname}>
      {children}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ShopProvider>
            <FilterProvider>
            <Router>
              <div className="App">
                <FloatingElements />
                <ConditionalHeader />
                <Routes>
                  <Route path="/new-login" element={<NewLoginPage />} />
                  <Route path="/firebase-auth" element={<FirebaseAuth />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Protected Customer Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:productId" element={<ProductDetails />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <Cart />
                    </ProtectedRoute>
                  } />
                <Route path="/ai-recommendation" element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <AIRecommendation />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Users />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/products" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminProducts />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/categories" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Categories />
                    </ProtectedRoute>
                  } />
                </Routes>
                <ConditionalFooter />
                <WhatsAppButton />
                <GeminiChat />
              </div>
            </Router>
            </FilterProvider>
          </ShopProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Header should be hidden on these pages
function ConditionalHeader() {
  const location = useLocation();
  const hiddenPages = ["/cart", "/login", "/signup", "/forgot-password", "/new-login", "/firebase-auth", "/ai-recommendation"];
  // Hide header on all admin routes
  if (hiddenPages.includes(location.pathname) || location.pathname.startsWith("/admin")) {
    return null;
  }
  return <Header />;
}

// Footer should be hidden on these pages
function ConditionalFooter() {
  const location = useLocation();
  const hiddenPages = ["/cart", "/login", "/signup", "/forgot-password", "/new-login", "/firebase-auth", "/ai-recommendation"];
  if (hiddenPages.includes(location.pathname)) {
    return null;
  }
  return <Footer />;
}

export default App;