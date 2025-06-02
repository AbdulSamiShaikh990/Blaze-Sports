import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaBoxOpen, FaInfoCircle, FaPhone, FaShoppingCart, FaSearch, FaMoon, FaSun, FaRobot, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Header.css";
import logo from "../components/images/blaze-logo.jpg"; // Adjust path if needed
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const { currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Fetch all products when component mounts
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setAllProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // If API fails, use empty array
        setAllProducts([]);
      }
    };
    
    fetchAllProducts();
  }, []);

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
        <div className="search-container">
          <div className="search" style={{ width: '180px' }}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim() !== '') {
                  // Search through all products
                  const query = e.target.value.toLowerCase();
                  const results = allProducts.filter(product => 
                    product.name.toLowerCase().includes(query) || 
                    (product.category && product.category.name.toLowerCase().includes(query))
                  );
                  // Limit to top 5 results for dropdown
                  setSearchResults(results.slice(0, 5));
                  setShowResults(true);
                } else {
                  setSearchResults([]);
                  setShowResults(false);
                }
              }}
              onFocus={() => {
                if (searchQuery.trim() !== '' && searchResults.length > 0) {
                  setShowResults(true);
                }
              }}
              onBlur={() => {
                // Delay hiding results to allow clicking on them
                setTimeout(() => setShowResults(false), 200);
              }}
              onKeyPress={(e) => {
                // Navigate to products page on Enter key
                if (e.key === 'Enter' && searchQuery.trim() !== '') {
                  // If there's exactly one search result, go directly to that product
                  if (searchResults.length === 1) {
                    navigate(`/products/${searchResults[0]._id}`);
                  } else {
                    // Otherwise go to products page with search query
                    navigate('/products', { state: { searchQuery } });
                  }
                  setSearchQuery('');
                  setShowResults(false);
                }
              }}
            />
            <button onClick={() => {
              if (searchQuery.trim() !== '') {
                // If there's exactly one search result, go directly to that product
                if (searchResults.length === 1) {
                  navigate(`/products/${searchResults[0]._id}`);
                } else {
                  // Otherwise go to products page with search query
                  navigate('/products', { state: { searchQuery } });
                }
                setSearchQuery('');
                setShowResults(false);
              }
            }}>
              <FaSearch />
            </button>
          </div>
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(product => (
                <div 
                  key={product._id} 
                  className="search-result-item"
                  onClick={() => {
                    // Navigate directly to the product details page
                    navigate(`/products/${product._id}`);
                    setSearchQuery('');
                    setShowResults(false);
                  }}
                >
                  <div className="result-name">{product.name}</div>
                  <div className="result-category">
                    {product.category ? product.category.name : 'Uncategorized'}
                  </div>
                  <div className="result-price">PKR {product.price?.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* AI Button */}
        <button 
          className="ai-button" 
          onClick={() => navigate('/ai-recommendation')} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '8px 16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}
        >
          <FaRobot style={{ fontSize: '1.1rem' }} />
          <span>AI</span>
        </button>

        {/* Theme Toggle Button */}
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {currentUser ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-button" 
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
              >
                <FaUserCircle />
                <span>{currentUser.email?.split('@')[0]}</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <button onClick={() => navigate('/profile')}>
                    Profile
                  </button>
                  <button onClick={() => navigate('/orders')}>
                    My Orders
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        await logout();
                        navigate('/');
                      } catch (error) {
                        console.error('Error logging out:', error);
                      }
                    }}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={() => navigate("/firebase-auth")}>
              Login
            </button>
          )}
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