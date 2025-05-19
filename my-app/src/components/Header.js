import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaBoxOpen, FaInfoCircle, FaPhone, FaShoppingCart, FaSearch, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import "./Header.css";
import logo from "../components/images/blaze-logo.jpg"; // Adjust path if needed

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { cartItems } = useCart();

  const handleNavigation = (sectionId) => {
    switch (sectionId) {
      case 'products':
        navigate('/products');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'contact':
        navigate('/contact');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <header className="header">
      {/* Logo Section */}
      <div className="logo">
        <img 
          src={logo} 
          alt="Blaze Sports Logo" 
          className="logo-img" 
          onClick={() => handleNavigation()} 
          style={{ cursor: 'pointer' }} 
        />
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <ul>
          <li>
            <button onClick={() => handleNavigation()}>
              <FaHome className="icon" /> Home
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("products")}>
              <FaBoxOpen className="icon" /> Products
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("about")}>
              <FaInfoCircle className="icon" /> About Us
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("contact")}>
              <FaPhone className="icon" /> Contact
            </button>
          </li>
        </ul>
      </nav>

      {/* Actions Section */}
      <div className="actions">
        {/* Search Box */}
        <div className="search">
          <input type="text" placeholder="Search for products..." />
          <button>
            <FaSearch />
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate("/new-login")}>
            Login
          </button>
        </div>

        {/* Cart Button with Navigation */}
        <div className="cart">
          <button onClick={() => navigate('/cart')} aria-label="View shopping cart">
            <FaShoppingCart />
            <span>View Cart</span>
            {cartItems && cartItems.length > 0 && (
              <span className="cart-badge" aria-label={`${cartItems.length} items in cart`}>
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;