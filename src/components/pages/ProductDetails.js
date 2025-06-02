import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './ProductDetails.css';
import { 
  FaArrowLeft, FaShoppingCart, FaHeart, FaShareAlt, 
  FaTag, FaCheckCircle, FaExclamationCircle, 
  FaShippingFast, FaAward, FaPercent
} from 'react-icons/fa';

// API base URL
const API_URL = 'http://localhost:5000/api';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useShop();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products/${productId}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ 
        ...product, 
        id: product._id, 
        category: product.category ? product.category.name : 'Uncategorized',
        quantity
      });
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const formatPrice = (price) => {
    return `PKR ${price.toLocaleString()}`;
  };

  const handleGoBack = () => {
    navigate(-1);
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

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <div className="error-container">
          <FaExclamationCircle className="error-icon" />
          <h2>Product Not Found</h2>
          <p>{error || "The product you're looking for doesn't exist or has been removed."}</p>
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <button className="back-button" onClick={handleGoBack}>
          <FaArrowLeft /> Back to Products
        </button>
        
        <div className="product-details-content">
          <div className="product-details-left">
            <div className="product-image-container">
              <img 
                src={getImageUrl(product.image)} 
                alt={product.name} 
                className="product-details-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              {product.featured && <div className="product-badge featured">Featured</div>}
              {!product.featured && product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && 
                <div className="product-badge new">New</div>
              }
            </div>
            
            <div className="product-actions">
              <button className="action-button wishlist">
                <FaHeart /> Add to Wishlist
              </button>
              <button className="action-button share">
                <FaShareAlt /> Share
              </button>
            </div>
          </div>
          
          <div className="product-details-right">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-category">
              Category: <span>{product.category ? product.category.name : 'Uncategorized'}</span>
            </div>
            
            <div className="product-rating">
              {'★'.repeat(Math.floor(product.rating || 0))}
              {'☆'.repeat(5 - Math.floor(product.rating || 0))}
              <span className="rating-value">{product.rating || 0}</span>
              <span className="review-count">({product.reviewCount || 0} reviews)</span>
            </div>
            
            <div className="product-price-container">
              <div className="product-price">{formatPrice(product.price)}</div>
              {product.oldPrice && (
                <>
                  <span className="price-discount">{formatPrice(product.oldPrice)}</span>
                  <span className="price-save">
                    <FaPercent /> Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
            
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'No description available for this product.'}</p>
            </div>
            
            <div className="product-details-info">
              <div className="product-detail-item">
                <FaCheckCircle className="detail-icon in-stock" /> 
                <span>In Stock</span>
              </div>
              
              {product.brand && (
                <div className="product-detail-item">
                  <FaAward className="detail-icon" /> 
                  <span>Brand: {product.brand}</span>
                </div>
              )}
              
              {product.material && (
                <div className="product-detail-item">
                  <FaTag className="detail-icon" /> 
                  <span>Material: {product.material}</span>
                </div>
              )}
              
              {product.size && (
                <div className="product-detail-item">
                  <FaTag className="detail-icon" /> 
                  <span>Size: {product.size}</span>
                </div>
              )}
              
              <div className="product-detail-item">
                <FaShippingFast className="detail-icon" /> 
                <span>Free Shipping</span>
              </div>
            </div>
            
            <div className="product-purchase">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-input-container">
                  <button 
                    className="quantity-btn" 
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    id="quantity" 
                    min="1" 
                    value={quantity} 
                    onChange={handleQuantityChange}
                  />
                  <button 
                    className="quantity-btn" 
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default ProductDetails;
