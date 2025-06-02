import React, { useState, useEffect, createContext, useContext } from 'react';
import { FaHome, FaFootballBall, FaBasketballBall, FaTimes, FaFilter,
         FaArrowRight, FaStar, FaShuttleVan } from 'react-icons/fa';
import { GiCricketBat } from 'react-icons/gi';
import './Sidebar.css';

// Create context for filter state
const FilterContext = createContext();

export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [ratings, setRatings] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setFiltersApplied(true);
  };

  const handlePriceChange = (price) => {
    setPriceRange([0, price]);
    setFiltersApplied(true);
  };

  const handleRatingChange = (rating) => {
    setRatings(rating);
    setFiltersApplied(true);
  };

  const handleClearFilters = () => {
    setActiveCategory('All Products');
    setPriceRange([0, 50000]);
    setRatings(0);
    setFiltersApplied(false);
  };

  return (
    <FilterContext.Provider
      value={{
        activeCategory,
        priceRange,
        ratings,
        filtersApplied,
        handleCategoryClick,
        handlePriceChange,
        handleRatingChange,
        handleClearFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

const Sidebar = () => {
  const {
    activeCategory,
    priceRange,
    ratings,
    handleCategoryClick,
    handlePriceChange,
    handleRatingChange,
    handleClearFilters
  } = useFilters();

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = !isOpen ? 'hidden' : 'auto';
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const categories = [
    { name: 'All Products', icon: <FaHome />, color: '#4CAF50' },
    { name: 'Cricket', icon: <GiCricketBat />, color: '#2196F3' },
    { name: 'Football', icon: <FaFootballBall />, color: '#FF9800' },
    { name: 'Basketball', icon: <FaBasketballBall />, color: '#9C27B0' },
    { name: 'Badminton', icon: <FaShuttleVan />, color: '#FF5722' },
  ];

  return (
    <>
      <button 
        className="toggle-button" 
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close filters" : "Open filters"}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes /> : <FaFilter />}
      </button>
      
      {/* Backdrop overlay */}
      <div 
        className={`sidebar-backdrop ${isOpen ? 'visible' : ''}`}
        onClick={toggleSidebar}
        role="presentation"
      />
      
      <div 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        role="complementary"
        aria-label="Filter options"
      >
        <div className="sidebar-header">
          <h2><FaFilter /> Filters</h2>
          <button 
            className="clear-filters" 
            onClick={handleClearFilters}
            tabIndex={0}
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        </div>

        <div className="sidebar-categories">
          <h3>Categories</h3>
          <div className="category-list">
            {categories.map((category) => (
              <div
                key={category.name}
                className={`category-item ${activeCategory === category.name ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.name)}
                style={{ '--category-color': category.color }}
                tabIndex={0}
                role="button"
                aria-pressed={activeCategory === category.name}
                aria-label={`Filter by ${category.name}`}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <FaArrowRight className="category-arrow" />
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-filter">
          <h3>Price Range</h3>
          <div className="price-range">
            <div className="price-values">
              <span>PKR {priceRange[0].toLocaleString()}</span>
              <span>PKR {priceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(parseInt(e.target.value))}
              className="price-slider"
              aria-label="Set maximum price"
              aria-valuemin="0"
              aria-valuemax="50000"
              aria-valuenow={priceRange[1]}
            />
          </div>
        </div>

        <div className="sidebar-filter">
          <h3>Ratings</h3>
          <div className="ratings-filter">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div
                key={rating}
                className={`rating-item ${ratings === rating ? 'active' : ''}`}
                onClick={() => handleRatingChange(rating)}
                tabIndex={0}
                role="button"
                aria-pressed={ratings === rating}
                aria-label={`Filter by ${rating} stars and up`}
              >
                <div className="stars-container">
                  {[...Array(rating)].map((_, index) => (
                    <FaStar key={index} className="star-icon" />
                  ))}
                  {[...Array(5 - rating)].map((_, index) => (
                    <FaStar key={`empty-${index}`} className="star-icon empty" />
                  ))}
                </div>
                <span>& Up</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 