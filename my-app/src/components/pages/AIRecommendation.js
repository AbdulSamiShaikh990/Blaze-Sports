import React, { useState } from 'react';
import { FaRunning, FaFootballBall, FaBasketballBall, FaVolleyballBall, FaTableTennis, FaTshirt, FaShoePrints, FaTshirt as FaShirt, FaArrowLeft } from 'react-icons/fa';
import { GiCricketBat, GiBoxingGlove, GiTennisRacket, GiSoccerBall } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import './AIRecommendation.css';

const AIRecommendation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    favoriteSport: '',
    favoriteColor: '',
    skinTone: '',
    outfitStyle: '',
    skillLevel: '',
    height: '',
    climate: '',
    favoriteTeam: '',
    playingPosition: ''
  });

  const [step, setStep] = useState(1);
  const [recommendations, setRecommendations] = useState(null);

  const sportsOptions = [
    { id: 'cricket', name: 'Cricket', icon: <GiCricketBat /> },
    { id: 'football', name: 'Football', icon: <GiSoccerBall /> },
    { id: 'basketball', name: 'Basketball', icon: <FaBasketballBall /> },
    { id: 'tennis', name: 'Tennis', icon: <GiTennisRacket /> }
  ];

  const colorOptions = [
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'white', name: 'White', color: '#FFFFFF' },
    { id: 'red', name: 'Red', color: '#FF0000' },
    { id: 'blue', name: 'Blue', color: '#0000FF' },
    { id: 'green', name: 'Green', color: '#008000' },
    { id: 'yellow', name: 'Yellow', color: '#FFFF00' },
    { id: 'purple', name: 'Purple', color: '#800080' },
    { id: 'orange', name: 'Orange', color: '#FFA500' }
  ];

  const sportsPositions = {
    cricket: [
      { value: 'batsman', label: 'Batsman' },
      { value: 'bowler', label: 'Bowler' },
      { value: 'all-rounder', label: 'All Rounder' },
      { value: 'wicket-keeper', label: 'Wicket Keeper' }
    ],
    football: [
      { value: 'goalkeeper', label: 'Goalkeeper' },
      { value: 'defender', label: 'Defender' },
      { value: 'midfielder', label: 'Midfielder' },
      { value: 'forward', label: 'Forward' }
    ],
    basketball: [
      { value: 'point-guard', label: 'Point Guard' },
      { value: 'shooting-guard', label: 'Shooting Guard' },
      { value: 'small-forward', label: 'Small Forward' },
      { value: 'power-forward', label: 'Power Forward' },
      { value: 'center', label: 'Center' }
    ],
    tennis: [
      { value: 'singles', label: 'Singles Player' },
      { value: 'doubles', label: 'Doubles Player' }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorSelect = (colorId) => {
    setFormData(prev => ({
      ...prev,
      favoriteColor: colorId
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const recommendedProducts = generateRecommendations(formData);
    setRecommendations({ products: recommendedProducts });
    setStep(3);
  };

  const generateRecommendations = (data) => {
    const recommendations = [];
    
    // Base recommendations on sport
    switch(data.favoriteSport) {
      case 'cricket':
        recommendations.push({
          id: 1,
          name: "Professional Cricket Jersey",
          price: 2500,
          image: "path_to_cricket_jersey",
          reason: `Perfect for ${data.skillLevel} level players. ${data.climate === 'hot' ? 'Made with breathable fabric for hot weather.' : 'Suitable for your climate.'}`,
          category: "Cricket Wear"
        });
        break;
      case 'football':
        recommendations.push({
          id: 2,
          name: "Football Team Jersey",
          price: 3000,
          image: "path_to_football_jersey",
          reason: `Ideal for ${data.playingPosition || 'your position'}. ${data.climate === 'hot' ? 'Lightweight and breathable.' : 'Comfortable for your climate.'}`,
          category: "Football Wear"
        });
        break;
      case 'basketball':
        recommendations.push({
          id: 3,
          name: "Basketball Performance Jersey",
          price: 2800,
          image: "path_to_basketball_jersey",
          reason: `Designed for ${data.skillLevel} players. ${data.climate === 'hot' ? 'Quick-dry fabric for hot weather.' : 'Suitable for your climate.'}`,
          category: "Basketball Wear"
        });
        break;
      case 'tennis':
        recommendations.push({
          id: 4,
          name: "Tennis Performance Shirt",
          price: 2200,
          image: "path_to_tennis_shirt",
          reason: `Perfect for ${data.skillLevel} players. ${data.climate === 'hot' ? 'UV protection and breathable.' : 'Comfortable for your climate.'}`,
          category: "Tennis Wear"
        });
        break;
    }

    // Add matching accessories
    recommendations.push({
      id: 5,
      name: "Sports Cap",
      price: 800,
      image: "path_to_cap",
      reason: `Matches your ${data.favoriteColor} preference and provides sun protection.`,
      category: "Accessories"
    });

    // Add shoes based on sport
    recommendations.push({
      id: 6,
      name: `${data.favoriteSport.charAt(0).toUpperCase() + data.favoriteSport.slice(1)} Shoes`,
      price: 5000,
      image: "path_to_shoes",
      reason: `Professional ${data.favoriteSport} shoes suitable for ${data.skillLevel} players.`,
      category: "Footwear"
    });

    return recommendations;
  };

  const renderBackButton = () => (
    <button className="back-to-home" onClick={() => navigate('/')}>
      <FaArrowLeft /> Back to Home
    </button>
  );

  const renderPositionOptions = () => {
    if (!formData.favoriteSport) return null;
    
    const positions = sportsPositions[formData.favoriteSport] || [];
    return (
      <div className="form-group">
        <label>Playing Position</label>
        <select 
          name="playingPosition" 
          value={formData.playingPosition} 
          onChange={handleInputChange}
          required
        >
          <option value="">Select position</option>
          {positions.map(pos => (
            <option key={pos.value} value={pos.value}>{pos.label}</option>
          ))}
        </select>
      </div>
    );
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="form-step">
            {renderBackButton()}
            <h2>Tell us about yourself</h2>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Your age"
                required
              />
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="Your height in centimeters"
              />
            </div>
            <div className="form-group">
              <label>Skin Tone</label>
              <select name="skinTone" value={formData.skinTone} onChange={handleInputChange} required>
                <option value="">Select skin tone</option>
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="button-group">
              <button className="back-btn" onClick={() => navigate('/')}>Back</button>
              <button className="next-btn" onClick={() => setStep(2)}>Next</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-step">
            {renderBackButton()}
            <h2>Your Sports Preferences</h2>
            <div className="sports-grid">
              {sportsOptions.map(sport => (
                <div
                  key={sport.id}
                  className={`sport-option ${formData.favoriteSport === sport.id ? 'selected' : ''}`}
                  onClick={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      favoriteSport: sport.id,
                      playingPosition: '' // Reset position when sport changes
                    }));
                  }}
                >
                  <span className="sport-icon">{sport.icon}</span>
                  <span className="sport-name">{sport.name}</span>
                </div>
              ))}
            </div>
            <div className="form-group">
              <label>Skill Level</label>
              <select name="skillLevel" value={formData.skillLevel} onChange={handleInputChange} required>
                <option value="">Select skill level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="pro">Professional</option>
              </select>
            </div>
            {renderPositionOptions()}
            <div className="form-group">
              <label>Preferred Climate</label>
              <select name="climate" value={formData.climate} onChange={handleInputChange} required>
                <option value="">Select climate</option>
                <option value="hot">Hot</option>
                <option value="cold">Cold</option>
                <option value="moderate">Moderate</option>
              </select>
            </div>
            <div className="form-group">
              <label>Favorite Team/Player (optional)</label>
              <input
                type="text"
                name="favoriteTeam"
                value={formData.favoriteTeam}
                onChange={handleInputChange}
                placeholder="Enter your favorite team or player"
              />
            </div>
            <div className="button-group">
              <button className="back-btn" onClick={() => setStep(1)}>Back</button>
              <button className="next-btn" onClick={() => setStep(3)}>Next</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-step">
            {renderBackButton()}
            <h2>Style Preferences</h2>
            <div className="form-group">
              <label>Favorite Color</label>
              <div className="color-grid">
                {colorOptions.map(color => (
                  <div
                    key={color.id}
                    className={`color-option ${formData.favoriteColor === color.id ? 'selected' : ''}`}
                    onClick={() => handleColorSelect(color.id)}
                    style={{ backgroundColor: color.color }}
                  >
                    <span className="color-name">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Preferred Outfit Style</label>
              <select name="outfitStyle" value={formData.outfitStyle} onChange={handleInputChange} required>
                <option value="">Select style</option>
                <option value="slim">Slim Fit</option>
                <option value="regular">Regular Fit</option>
                <option value="loose">Loose Fit</option>
              </select>
            </div>
            <div className="button-group">
              <button className="back-btn" onClick={() => setStep(2)}>Back</button>
              <button className="submit-btn" onClick={handleSubmit}>Get Recommendations</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="recommendations">
            {renderBackButton()}
            <h2>Your Personalized Recommendations</h2>
            {recommendations && (
              <div className="recommended-products">
                {recommendations.products.map(product => (
                  <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p className="category">{product.category}</p>
                    <p className="price">PKR {product.price.toLocaleString()}</p>
                    <p className="reason">{product.reason}</p>
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                ))}
              </div>
            )}
            <button className="restart-btn" onClick={() => {
              setStep(1);
              setFormData({
                gender: '',
                age: '',
                favoriteSport: '',
                favoriteColor: '',
                skinTone: '',
                outfitStyle: '',
                skillLevel: '',
                height: '',
                climate: '',
                favoriteTeam: '',
                playingPosition: ''
              });
              setRecommendations(null);
            }}>
              Start Over
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ai-recommendation-page">
      <div className="ai-container">
        <div className="ai-header">
          <h1>AI Sports Gear Recommender</h1>
          <p>Let us help you find the perfect sports gear based on your preferences</p>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default AIRecommendation; 