import React, { useState } from 'react';
import { FaShoppingCart, FaStar, FaHeart, FaSearch, FaFilter, FaCheck } from 'react-icons/fa';
import { useShop } from '../context/ShopContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FeaturedProducts.css';

const sampleProducts = [
  {
    id: 1,
    name: "Professional Cricket Bat",
    price: 2499,
    rating: 4.8,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1614632537423-1d4e2f5a3c4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=90",
    category: "Cricket",
    description: "Premium English willow cricket bat for professional players",
    stock: 15,
    discount: 10,
    features: ["Premium English Willow", "Pro Handle Grip", "Lightweight Design"]
  },
  {
    id: 2,
    name: "Football Jersey Set",
    price: 1999,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=90",
    category: "Football",
    description: "Comfortable and stylish football jersey with shorts",
    stock: 25,
    discount: 5,
    features: ["Breathable Fabric", "Team Logo", "Custom Name Option"]
  },
  {
    id: 3,
    name: "Tennis Racket Pro",
    price: 3999,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=90",
    category: "Tennis",
    description: "Professional tennis racket with advanced technology",
    stock: 8,
    discount: 15,
    features: ["Carbon Fiber Frame", "Pro Grip", "Shock Absorption"]
  },
  {
    id: 4,
    name: "Basketball Shoes",
    price: 4999,
    rating: 4.7,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Basketball",
    description: "High-performance basketball shoes with superior grip",
    stock: 12,
    discount: 20,
    features: ["Anti-Slip Sole", "Ankle Support", "Breathable Mesh"]
  },
  {
    id: 5,
    name: "Badminton Set",
    price: 1499,
    rating: 4.5,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1613918431703-aa508cf7f94e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Badminton",
    description: "Complete badminton set with rackets and shuttlecocks",
    stock: 30,
    discount: 0,
    features: ["2 Rackets", "3 Shuttlecocks", "Carrying Case"]
  },
  {
    id: 6,
    name: "Swimming Goggles",
    price: 999,
    rating: 4.4,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Swimming",
    description: "Anti-fog swimming goggles with UV protection",
    stock: 20,
    discount: 8,
    features: ["UV Protection", "Anti-Fog", "Adjustable Strap"]
  }
];

const FeaturedProducts = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, cart } = useShop();
  const [addedToCart, setAddedToCart] = useState({});

  const categories = ['all', ...new Set(sampleProducts.map(product => product.category.toLowerCase()))];

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart({ ...addedToCart, [product.id]: true });
    
    // Show success notification
    toast.success('Added to cart!', {
      position: "top-right",
      autoClose: 200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Reset the added state after animation
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [product.id]: false });
    }, 200);
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist', {
        position: "top-right",
        autoClose: 200,
      });
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!', {
        position: "top-right",
        autoClose: 200,
      });
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };

  return (
    <section id="products" className="featured-products">
      <div className="section-header">
        <h2>Featured Products</h2>
        <p>Discover our collection of premium sports equipment</p>
      </div>

      <div className="products-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <FaFilter className="filter-icon" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="product-card"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              {product.discount > 0 && (
                <div className="discount-badge">
                  {product.discount}% OFF
                </div>
              )}
              <div className={`product-overlay ${hoveredProduct === product.id ? 'show' : ''}`}>
                <button 
                  className={`add-to-cart ${addedToCart[product.id] ? 'added' : ''}`}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {addedToCart[product.id] ? (
                    <>
                      <FaCheck /> Added
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Add to Cart
                    </>
                  )}
                </button>
                <button 
                  className={`wishlist ${isInWishlist(product.id) ? 'active' : ''}`}
                  onClick={() => handleWishlistToggle(product)}
                >
                  <FaHeart />
                </button>
              </div>
            </div>
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-features">
                {product.features.map((feature, index) => (
                  <span key={index} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>

              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, index) => (
                    <FaStar 
                      key={index} 
                      className={index < Math.floor(product.rating) ? 'filled' : ''}
                    />
                  ))}
                </div>
                <span className="reviews">({product.reviews} reviews)</span>
              </div>
              <div className="product-price">
                {product.discount > 0 ? (
                  <>
                    <span className="original-price">₹{product.price.toLocaleString()}</span>
                    <span className="price">₹{calculateDiscountedPrice(product.price, product.discount).toLocaleString()}</span>
                  </>
                ) : (
                  <span className="price">₹{product.price.toLocaleString()}</span>
                )}
              </div>
              <div className="stock-info">
                {product.stock > 0 ? (
                  <span className="in-stock">In Stock ({product.stock})</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </section>
  );
};

export default FeaturedProducts;
