import React from 'react';
import { useLocation } from 'react-router-dom';
import SimpleProducts from './SimpleProducts';

const Products = () => {
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';
  const productId = location.state?.productId || null;
  const openModal = location.state?.openModal || false;
  
  return (
    <div className="products-page">
      <h1>{searchQuery ? `Search Results for "${searchQuery}"` : 'Our Products'}</h1>
      <SimpleProducts 
        initialSearchQuery={searchQuery} 
        initialProductId={productId}
        initialOpenModal={openModal}
      />
    </div>
  );
};

export default Products;
