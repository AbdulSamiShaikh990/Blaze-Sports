import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useShop();

  useEffect(() => {
    // Fetch product data based on productId
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', productId);

        // First try to fetch from the specific product endpoint
        let response = await fetch(`http://localhost:5000/api/products/${productId}`);

        // If that fails, try to fetch all products and find the one we need
        if (!response.ok) {
          console.log('Specific product endpoint failed, trying to fetch all products');
          response = await fetch('http://localhost:5000/api/products');

          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }

          const allProducts = await response.json();
          const foundProduct = allProducts.find(p => p._id === productId);

          if (!foundProduct) {
            throw new Error('Product not found in the list');
          }

          console.log('Found product data:', foundProduct);
          console.log('Found product image path:', foundProduct.image);
          setProduct(foundProduct);
          return;
        }

        const data = await response.json();
        console.log('Product data received:', data);
        console.log('Product image path:', data.image);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      ...product,
      id: product._id,
      quantity: quantity,
      category: product.category ? product.category.name : 'Uncategorized'
    });
    toast.success(`${product.name} added to cart!`);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  // Format price with commas
  const formatPrice = (price) => {
    return `PKR ${price.toLocaleString()}`;
  };

  // We don't need a separate function for this - we'll use the same approach as SimpleProducts.js directly

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="back-to-products">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-breadcrumb">
          <Link to="/">Home</Link> /
          <Link to="/products">Products</Link> /
          <span>{product.name}</span>
        </div>

        <div className="product-details-content">
          <div className="product-image-container">
            {product.featured && <div className="product-badge featured">Featured</div>}
            {product.isNew && <div className="product-badge new">New</div>}
            {/* Display product image from database - using exact same approach as SimpleProducts.js */}
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
            <h1 className="product-title">{product.name}</h1>

            <div className="product-meta">
              <div className="product-rating">
                {'★'.repeat(Math.floor(product.rating || 0))}
                {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                <span className="rating-value">{product.rating || 0}</span>
              </div>

              <div className="product-category">
                Category: <span>{product.category ? product.category.name : 'Uncategorized'}</span>
              </div>
            </div>

            <div className="product-price">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="old-price">{formatPrice(product.oldPrice)}</span>
              )}
            </div>

            <div className="product-tabs">
              <div className="tab-buttons">
                <button
                  className={activeTab === 'description' ? 'active' : ''}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={activeTab === 'details' ? 'active' : ''}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button
                  className={activeTab === 'reviews' ? 'active' : ''}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'description' && (
                  <div className="tab-description">
                    <p>{product.description || 'No description available.'}</p>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="tab-details">
                    <ul>
                      <li><strong>Brand:</strong> {product.brand || 'Blaze Sports'}</li>
                      <li><strong>SKU:</strong> {product._id?.substring(0, 8) || 'N/A'}</li>
                      <li><strong>Availability:</strong> <span className="in-stock">In Stock</span></li>
                      <li><strong>Category:</strong> {product.category ? product.category.name : 'Uncategorized'}</li>
                      {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                        <li key={key}><strong>{key}:</strong> {value}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="tab-reviews">
                    <h3>Customer Reviews</h3>
                    {product.reviews && product.reviews.length > 0 ? (
                      <div className="reviews-list">
                        {/* Map through reviews here */}
                        <p>Reviews coming soon</p>
                      </div>
                    ) : (
                      <p>No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <button onClick={decrementQuantity}><i className='bx bx-minus'></i></button>
                <span>{quantity}</span>
                <button onClick={incrementQuantity}><i className='bx bx-plus'></i></button>
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <i className='bx bx-cart-add'></i> Add to Cart
              </button>
            </div>

            <div className="product-share">
              <span>Share:</span>
              <div className="social-icons">
                <a href="#" className="social-icon"><i className='bx bxl-facebook'></i></a>
                <a href="#" className="social-icon"><i className='bx bxl-twitter'></i></a>
                <a href="#" className="social-icon"><i className='bx bxl-instagram'></i></a>
                <a href="#" className="social-icon"><i className='bx bxl-pinterest'></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
