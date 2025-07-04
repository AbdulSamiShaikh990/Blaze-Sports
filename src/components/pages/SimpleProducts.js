import React, { useState, useEffect } from 'react';
import { useFilters } from '../Sidebar';
import { useShop } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductsSection.css';
import './SimpleProductsSidebar.css';
import axios from 'axios';
import { 
  FaSearch, FaShoppingCart, FaHome, FaBasketballBall, FaChevronDown, FaTable,
  FaFilter, FaTimes, FaArrowRight, FaStar
} from 'react-icons/fa';
import { GiCricketBat, GiSoccerBall } from 'react-icons/gi';

// API base URL
const API_URL = 'http://localhost:5000/api';

const SimpleProducts = ({ initialSearchQuery = '', initialCategory = '', fromChatbot = false }) => {
  const { addToCart } = useShop();
  const { ratings, filtersApplied } = useFilters();
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  // Modal state removed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // We don't need these effects anymore since the sidebar is always visible
  
  // Define categories with icons
  const categories = [
    { name: 'All Products', icon: <FaHome /> },
    { name: 'Cricket', icon: <GiCricketBat /> },
    { name: 'Badminton', icon: <FaTable /> },
    { name: 'Basketball', icon: <FaBasketballBall /> },
    { name: 'Football', icon: <GiSoccerBall /> },
  ];
  
  // Get sub-categories for a selected category
  const getSubCategories = (categoryName) => {
    if (categoryName === 'All Products') {
      return [];
    }
    
    // All sports have the same consistent sub-categories
    return ['Gear', 'Apparel'];
  };

  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch all products from the API (not just featured ones)
        const response = await axios.get(`${API_URL}/products`);
        
        // Add default rating if not present
        const productsWithRatings = response.data.map(product => ({
          ...product,
          rating: product.rating || 4.5 // Default rating if not available
        }));
        
        setProducts(productsWithRatings);
        setError(null);

        // Modal functionality removed
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        // Set empty array if there's an error
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Set initial search query and category when they change
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
    
    // Set the selected category if provided
    if (initialCategory) {
      // Find the matching category from our categories array
      const categoryExists = categories.some(cat => cat.name === initialCategory);
      if (categoryExists) {
        setSelectedCategory(initialCategory);
      }
    }
  }, [initialSearchQuery, initialCategory]);

  // Filter products based on user selections
  useEffect(() => {
    let results = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'All Products') {
      results = results.filter(product => 
        product.category && product.category.name === selectedCategory
      );
      
      // Sub-category filter
      if (selectedSubCategory) {
        results = results.filter(product => 
          product.subCategory === selectedSubCategory
        );
      }
    }

    // Price filter
    if (priceRange && priceRange.length === 2) {
      results = results.filter(product => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    // Rating filter
    if (ratings > 0) {
      results = results.filter(product => product.rating >= ratings);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(query) || 
        (product.category && product.category.name.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(results);
  }, [products, selectedCategory, selectedSubCategory, priceRange, ratings, searchQuery]);

  const handleAddToCart = (product) => {
    addToCart({ 
      ...product, 
      id: product._id, 
      category: product.category ? product.category.name : 'Uncategorized'
    });
    toast.success(`${product.name} added to cart!`);
  };

  const formatPrice = (price) => {
    return `PKR ${price.toLocaleString()}`;
  };

  const navigateToProductDetails = (product) => {
    navigate(`/products/${product._id}`);
  };

  // Function to handle different image URL formats
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-image.jpg';
    
    // If it's a relative path starting with /uploads, prepend the backend URL
    if (imageUrl.startsWith('/uploads')) {
      return `http://localhost:5000${imageUrl}`;
    }
    
    // If it's an absolute URL (http or https), use it directly
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // For other cases, just return the URL as is
    return imageUrl;
  };

  return (
    <div className="products-container">
      {/* Mobile sidebar toggle button */}
      <button 
        className="products-toggle-button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle filter sidebar"
      >
        {isSidebarOpen ? <FaTimes /> : <FaFilter />}
      </button>

      {/* Backdrop for mobile */}
      <div 
        className={`products-sidebar-backdrop ${isSidebarOpen ? 'visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar Component */}
      <div 
        className={`products-sidebar ${isSidebarOpen ? 'open' : ''}`}
        role="complementary"
        aria-label="Filter options"
      >
        <div className="products-sidebar-header">
          <h2><FaFilter /> Categories</h2>
        </div>

        <div className="products-sidebar-categories">
          <h3>Sports Categories</h3>
          <div className="products-category-list">
            {categories.map((category) => (
              <div key={category.name}>
                <div
                  className={`products-category-item ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category.name === selectedCategory ? 'All Products' : category.name);
                    setSelectedSubCategory(null);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedCategory === category.name}
                  aria-label={`Filter by ${category.name}`}
                >
                  <span className="products-category-icon">{category.icon}</span>
                  <span className="products-category-name">{category.name}</span>
                  {category.name !== 'All Products' && (
                    <FaChevronDown className="products-category-arrow" />
                  )}
                </div>
                
                {/* Subcategories - only show when this category is selected */}
                {category.name !== 'All Products' && selectedCategory === category.name && (
                  <div className="products-subcategory-list">
                    <div 
                      className={`products-subcategory-item ${selectedSubCategory === null && selectedCategory === category.name ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setSelectedSubCategory(null);
                      }}
                    >
                      All {category.name}
                    </div>
                    {getSubCategories(category.name).map((subCat) => (
                      <div
                        key={subCat}
                        className={`products-subcategory-item ${selectedSubCategory === subCat && selectedCategory === category.name ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setSelectedSubCategory(subCat);
                        }}
                      >
                        {subCat}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="products-sidebar-filter">
          <h3>Price Range</h3>
          <div className="products-price-range">
            <div className="products-price-values">
              <span>PKR {minPrice.toLocaleString()}</span>
              <span>PKR {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              value={minPrice}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value <= maxPrice) {
                  setMinPrice(value);
                  setPriceRange([value, maxPrice]);
                }
              }}
              className="products-price-slider"
              aria-label="Set minimum price"
              aria-valuemin="0"
              aria-valuemax="10000"
              aria-valuenow={minPrice}
            />
            <input
              type="range"
              min="0"
              max="10000"
              value={maxPrice}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= minPrice) {
                  setMaxPrice(value);
                  setPriceRange([minPrice, value]);
                }
              }}
              className="products-price-slider"
              aria-label="Set maximum price"
              aria-valuemin="0"
              aria-valuemax="10000"
              aria-valuenow={maxPrice}
            />
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="products-content">
        <div className="products-header">
          <h1>Our Products</h1>
          <p>Discover premium quality sports equipment for your game</p>
        </div>
        
        <div className="products-tools">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Category tabs removed as requested */}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : searchQuery && filteredProducts.length === 0 ? (
        <div className="no-products-message">
          <p>No products found matching "{searchQuery}". Try a different search term or browse our categories.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card" onClick={() => navigateToProductDetails(product)} style={{ cursor: 'pointer' }}>
                {product.featured && <div className="product-badge featured">Featured</div>}
                {!product.featured && product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && 
                  <div className="product-badge new">New</div>
                }
                

                
                <div className="product-image">
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                
                <div className="product-info">
                  <div className="product-content">
                    <h3 className="product-title">{product.name}</h3>
                    
                    <p className="product-description">
                      {product.description ? 
                        (product.description.length > 60 ? 
                          `${product.description.substring(0, 60)}...` : 
                          product.description) : 
                        'No description available'}
                    </p>
                    
                    <div className="product-price-middle">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                  
                  <div className="product-bottom">
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <FaShoppingCart className="cart-icon" /> ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products-message">
              <p>No products match your current filters.</p>
            </div>
          )}
        </div>
      )}
      {/* Product details modal removed */}
      <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default SimpleProducts;
