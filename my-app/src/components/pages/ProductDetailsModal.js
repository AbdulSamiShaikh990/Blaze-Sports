import React from 'react';
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">&times;</button>
        <div className="modal-body">
          <img src={product.image} alt={product.name} className="modal-image" />
          <div className="modal-details">
            <h2>{product.name}</h2>
            <p>{product.description || 'No description available.'}</p>
            <p><strong>Price:</strong> PKR {product.price.toLocaleString()}</p>
            <p><strong>Rating:</strong> {product.rating || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
