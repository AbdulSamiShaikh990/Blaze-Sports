import React, { useState, useEffect } from 'react';
import { useFilters } from '../Sidebar';
import { useShop } from '../../context/ShopContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../FeaturedProducts.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// API base URL
const API_URL = 'http://localhost:5000/api';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useShop();
  const { activeCategory, priceRange, ratings, filtersApplied } = useFilters();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch featured products from the API
        const response = await axios.get(`${API_URL}/products/featured`);
        
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
    if (activeCategory && activeCategory !== 'All Products') {
      results = results.filter(product => 
        product.category && product.category.name === activeCategory
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
  }, [products, activeCategory, priceRange, ratings, searchQuery]);

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

  const viewProductDetails = (product) => {
    console.log('Navigating to product details from featured products:', product);
    navigate(`/products/${product._id}`);
  };

  return (
    <div className="featured-products">
      <div className="featured-products-header">
        <h2>Featured Products</h2>
        <p>Discover our premium selection of sports equipment</p>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <div className="slider-container">
          {filteredProducts.length > 0 ? (
            <Slider
              dots={false}
              infinite={true}
              speed={8000}
              slidesToShow={4}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={0}
              pauseOnHover={true}
              cssEase={'linear'}
              swipe={true}
              arrows={false}
              centerMode={true}
              centerPadding="0px"
              className="continuous-slider products-slider"
              responsive={[
                {
                  breakpoint: 1200,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 900,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                  }
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]}
            >
              {filteredProducts.map((product) => (
                <div key={product._id} className="slider-item">
                  <div className="product-card" onClick={(e) => viewProductDetails(product)} style={{ cursor: 'pointer' }}>
                    <div className="product-image">
                      <img 
                        src={product.image && product.image.startsWith('/uploads') ? `http://localhost:5000${product.image}` : product.image} 
                        alt={product.name} 
                        onError={(e) => {
                          console.log('Image failed to load:', product.image);
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
                      </div>
                      <div>
                        <span className="product-price">{formatPrice(product.price)}</span>
                        <button
                          className="add-to-cart-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          Add to Cart
                        </button>
                        <button className="product-action-btn view-btn" onClick={(e) => {
                          e.stopPropagation();
                          viewProductDetails(product);
                        }}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="no-products-message">
              <p>No products match your current filters.</p>
            </div>
          )}
        </div>
      )}
      {/* Product details now shown on a separate page */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default FeaturedProducts;

