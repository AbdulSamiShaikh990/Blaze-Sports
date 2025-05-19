import React, { useState, useEffect } from 'react';
import { useFilters } from '../Sidebar';
import { useShop } from '../../context/ShopContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../FeaturedProducts.css';
import ProductDetailsModal from './ProductDetailsModal';

const sampleProducts = [
  {
    _id: '1',
    name: 'Basketball',
    image: '/products/basketball.jpg',
    price: 2500,
    rating: 4.5,
    category: { name: 'Sports' },
    description: 'High quality basketball for indoor and outdoor use.'
  },
  {
    _id: '2',
    name: 'Tennis Racket',
    image: '/products/tennisracket.jpg',
    price: 4500,
    rating: 4.0,
    category: { name: 'Sports' },
    description: 'Lightweight tennis racket with excellent grip.'
  },
  {
    _id: '3',
    name: 'Football',
    image: '/products/football.jpeg',
    price: 3000,
    rating: 4.7,
    category: { name: 'Sports' },
    description: 'Durable football suitable for all weather conditions.'
  }
];

const FeaturedProducts = () => {
  const { addToCart } = useShop();
  const { activeCategory, priceRange, ratings, filtersApplied } = useFilters();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    addToCart({ ...product, id: product._id, category: product.category.name });
    toast.success(`${product.name} added to cart!`);
  };

  const formatPrice = (price) => {
    return `PKR ${price.toLocaleString()}`;
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
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
            <div key={product._id} className="product-card" onClick={() => openModal(product)} style={{ cursor: 'pointer' }}>
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
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
      {isModalOpen && <ProductDetailsModal product={selectedProduct} onClose={closeModal} />}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default FeaturedProducts;
