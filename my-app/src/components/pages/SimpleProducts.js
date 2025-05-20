import React, { useState, useEffect } from 'react';
import { useFilters } from '../Sidebar';
import { useShop } from '../../context/ShopContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductsSection.css';
import ProductDetailsModal from './ProductDetailsModal';
import axios from 'axios';
import { 
  FaSearch, FaShoppingCart, FaHome, FaFootballBall, FaBasketballBall, 
  FaShuttleVan, FaHeart, FaEye, FaShareAlt, FaTag, FaCheckCircle, 
  FaExclamationCircle, FaTimesCircle, FaShippingFast, FaAward, FaPercent
} from 'react-icons/fa';
import { GiCricketBat } from 'react-icons/gi';

// API base URL
const API_URL = 'http://localhost:5000/api';

const SimpleProducts = () => {
  const { addToCart } = useShop();
  const { ratings, filtersApplied } = useFilters();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  
  // Define categories with icons
  const categories = [
    { name: 'All Products', icon: <FaHome /> },
    { name: 'Cricket', icon: <GiCricketBat /> },
    { name: 'Football', icon: <FaFootballBall /> },
    { name: 'Basketball', icon: <FaBasketballBall /> },
    { name: 'Badminton', icon: <FaShuttleVan /> },
  ];

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

  // Filter products based on user selections
  useEffect(() => {
    let results = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'All Products') {
      results = results.filter(product => 
        product.category && product.category.name === selectedCategory
      );
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
  }, [products, selectedCategory, priceRange, ratings, searchQuery]);

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

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="products-container">
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
      
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`category-tab ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>
      
      <div className="price-filter-container slim">
        <div className="price-filter-header">
          <h3 className="filter-title">Price Range: </h3>
          <div className="price-range-display">
            <span>PKR {minPrice.toLocaleString()}</span>
            <span>-</span>
            <span>PKR {maxPrice.toLocaleString()}</span>
          </div>
        </div>
        <div className="price-slider">
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
            className="price-range-slider min-slider"
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
            className="price-range-slider max-slider"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card" onClick={() => openModal(product)}>
                {product.featured && <div className="product-badge featured">Featured</div>}
                {!product.featured && product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && 
                  <div className="product-badge new">New</div>
                }
                
                <div className="product-quick-actions">
                  <button className="quick-action-btn" onClick={(e) => { e.stopPropagation(); toast.info('Added to wishlist!'); }}>
                    <FaHeart />
                  </button>
                  <button className="quick-action-btn" onClick={(e) => { e.stopPropagation(); openModal(product); }}>
                    <FaEye />
                  </button>
                  <button className="quick-action-btn" onClick={(e) => { e.stopPropagation(); toast.info('Share link copied!'); }}>
                    <FaShareAlt />
                  </button>
                </div>
                
                <div className="product-image">
                  <img 
                    src={product.image?.startsWith('/uploads') ? `http://localhost:5000${product.image}` : product.image} 
                    alt={product.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                
                <div className="product-info">
                  <div>
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-rating">
                      {'★'.repeat(Math.floor(product.rating || 0))}
                      {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                      <span className="rating-value">{product.rating || 0}</span>
                    </div>
                    
                    <p className="product-description">
                      {product.description ? 
                        (product.description.length > 60 ? 
                          `${product.description.substring(0, 60)}...` : 
                          product.description) : 
                        'No description available'}
                    </p>
                    
                    <div className="product-details">
                      {product.brand && (
                        <span className="product-detail-item">
                          <FaAward /> {product.brand}
                        </span>
                      )}
                      {product.material && (
                        <span className="product-detail-item">
                          <FaTag /> {product.material}
                        </span>
                      )}
                      {product.size && (
                        <span className="product-detail-item">
                          <FaTag /> Size: {product.size}
                        </span>
                      )}
                      <span className="product-detail-item">
                        <FaShippingFast /> Free Shipping
                      </span>
                    </div>
                    
                    <div className="product-stock in-stock">
                      <FaCheckCircle /> In Stock
                    </div>
                    
                    <div className="product-tags">
                      <span className="product-tag">Premium</span>
                      <span className="product-tag">Official</span>
                      {product.category && <span className="product-tag">{product.category.name}</span>}
                    </div>
                  </div>
                  
                  <div className="product-bottom">
                    <div className="product-price">
                      {formatPrice(product.price)}
                      {product.oldPrice && (
                        <>
                          <span className="price-discount">{formatPrice(product.oldPrice)}</span>
                          <span className="price-save">-{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>
                        </>
                      )}
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <FaShoppingCart className="cart-icon" /> Add to Cart
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
      {isModalOpen && <ProductDetailsModal product={selectedProduct} onClose={closeModal} />}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default SimpleProducts;
