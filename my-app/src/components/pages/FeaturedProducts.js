import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { useFilters } from '../Sidebar';
import { useShopContext } from '../../context/ShopContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const { addToCart } = useShopContext();
  const { activeCategory, priceRange, ratings, filtersApplied } = useFilters();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products'); // Changed from '/products/featured' to '/products'
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = [...products];

    // Category filter
    if (activeCategory && activeCategory !== 'All Products') {
      results = results.filter(product => product.category.name === activeCategory);
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
        product.category.name.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(results);
  }, [products, activeCategory, priceRange, ratings, searchQuery]);

  const handleAddToCart = (product) => {
    addToCart(product._id);
    toast.success(`${product.name} added to cart!`);
  };

  const formatPrice = (price) => {
    return `PKR ${price.toLocaleString()}`;
  };

  return (
    <div className="featured-products">
      <div className="featured-products-header">
        <h2>Featured Products</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <div className="product-info">
                <span className="product-price">{formatPrice(product.price)}</span>
                <div className="product-rating">
                  {'★'.repeat(Math.floor(product.rating || 0))}
                  {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                  <span className="rating-value">{product.rating || 0}</span>
                </div>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <div className="no-products-message">
            <p>No products match your current filters.</p>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default FeaturedProducts;
