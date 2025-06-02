import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './Notification.css';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Show toast notification
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
    });
    
    // Show top notification
    setNotification({ 
      show: true, 
      message: `${product.name} successfully added to cart!` 
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <ShopContext.Provider
      value={{
        wishlist,
        cart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getCartTotal,
        getCartItemCount,
        clearCart,
        notification
      }}
    >
      {notification.show && (
        <div className="top-notification">
          <div className="notification-content">
            <span className="notification-icon">✓</span>
            {notification.message}
          </div>
        </div>
      )}
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}; 