import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ product, onClose }) => {
  const { addToCart } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animation effect when modal opens
    setIsVisible(true);
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  if (!product) return null;
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };
  
  const handleAddToCart = () => {
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
  
  // Get image URL with proper path
  const getImageUrl = (image) => {
    if (!image) return '/placeholder-image.jpg';
    return image.startsWith('/uploads') ? `http://localhost:5000${image}` : image;
  };
  
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className={`modal-content ${isVisible ? 'modal-visible' : ''}`} 
        onClick={e => e.stopPropagation()}
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <button className="modal-close" onClick={handleClose} aria-label="Close modal">
          <i className='bx bx-x'></i>
        </button>
        
        <div className="modal-body">
          <div className="modal-image-container">
            <div className="modal-badge">{product.featured ? 'Featured' : 'New'}</div>
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name} 
              className="modal-image" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
          
          <div className="modal-details">
            <h2 className="product-title">{product.name}</h2>
            
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
                    </ul>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
