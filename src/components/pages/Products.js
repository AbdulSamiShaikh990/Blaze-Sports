import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SimpleProducts from './SimpleProducts';

const Products = () => {
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';
  const productId = location.state?.productId || null;
  const openModal = location.state?.openModal || false;
  
  // Check for category in sessionStorage (from chatbot)
  const storedCategory = sessionStorage.getItem('blaze_category') || '';
  const storedFromChatbot = sessionStorage.getItem('blaze_from_chatbot') === 'true';
  
  // Use location state as fallback
  const category = storedCategory || location.state?.category || '';
  const fromChatbot = storedFromChatbot || location.state?.fromChatbot || false;
  
  // Force scroll to top when component mounts
  useEffect(() => {
    // Always force scroll to top on mount
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    
    // Clear sessionStorage after use
    if (storedCategory || storedFromChatbot) {
      setTimeout(() => {
        sessionStorage.removeItem('blaze_category');
        sessionStorage.removeItem('blaze_from_chatbot');
      }, 500);
    }
    
    // Add a delayed scroll for reliability
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100);
  }, [storedCategory, storedFromChatbot]);
  
  // Get category from URL query parameters if not in state
  const queryParams = new URLSearchParams(window.location.search);
  const queryCategory = queryParams.get('category') || '';
  const finalCategory = category || queryCategory;
  
  // Set page title based on category
  let pageTitle = 'Our Products';
  if (searchQuery) {
    pageTitle = `Search Results for "${searchQuery}"`;
  } else if (finalCategory) {
    pageTitle = `${finalCategory} Products`;
  }
  
  return (
    <div className="products-page">
      <h1>{pageTitle}</h1>
      <SimpleProducts 
        initialSearchQuery={searchQuery} 
        initialProductId={productId}
        initialOpenModal={openModal}
        initialCategory={finalCategory}
        fromChatbot={fromChatbot}
      />
    </div>
  );
};

export default Products;
