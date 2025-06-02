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
    setStep(4); // Changed from 3 to 4 to show the recommendations page
  };

  const generateRecommendations = (data) => {
    const recommendations = [];

  const productImages = {
      cricket: {
        jersey: process.env.PUBLIC_URL + '/Product_Images/cricket_jersey.jpeg',
        bat: process.env.PUBLIC_URL + '/Product_Images/bat.jpeg',
        gloves: process.env.PUBLIC_URL + '/Product_Images/cricket gloves.jpeg',
        helmet: process.env.PUBLIC_URL + '/Product_Images/helmet.jpeg',
        kit: process.env.PUBLIC_URL + '/Product_Images/cricket kit.jpeg',
        pakistanKit: process.env.PUBLIC_URL + '/Product_Images/jersey_pakistan.jpeg',
        wickets: process.env.PUBLIC_URL + '/Product_Images/wickets.jpeg',
        shoes: process.env.PUBLIC_URL + '/Product_Images/cricket_shoes.jpeg',
        cap: process.env.PUBLIC_URL + '/Product_Images/cricket_cap.jpeg',
        battingPads: process.env.PUBLIC_URL + '/Product_Images/batting_pads_men.jpeg',
        battingPadsWomen: process.env.PUBLIC_URL + '/Product_Images/batting_pads_women.jpeg',
        armGuard: process.env.PUBLIC_URL + '/Product_Images/arm_guard.jpeg',
        batGrip: process.env.PUBLIC_URL + '/Product_Images/bat_grip.jpeg',
        batsmanGloves: process.env.PUBLIC_URL + '/Product_Images/batsman_gloves.jpeg',
        thermalUnderlayerMen: process.env.PUBLIC_URL + '/Product_Images/men_thermal_underlayer.jpeg',
        thermalUnderlayerWomen: process.env.PUBLIC_URL + '/Product_Images/women_thermal_underlayer.jpeg',
        fanJersey: process.env.PUBLIC_URL + '/Product_Images/fan_jersey_cricket.jpeg'
      },
      football: {
        ball: process.env.PUBLIC_URL + '/Product_Images/football.jpeg',
        shoes: process.env.PUBLIC_URL + '/Product_Images/shoes.jpeg',
        jersey: process.env.PUBLIC_URL + '/Product_Images/football_jersey.jpeg',
        socks: process.env.PUBLIC_URL + '/Product_Images/football_socks.jpeg',
        shinGuardsMen: process.env.PUBLIC_URL + '/Product_Images/shin_guards_men.jpeg',
        shinGuardsWomen: process.env.PUBLIC_URL + '/Product_Images/shin_guards_women.jpeg',
        fanJersey: process.env.PUBLIC_URL + '/Product_Images/football_fan_jersey.jpeg'
      },
      basketball: {
        ball: process.env.PUBLIC_URL + '/Product_Images/basketball.jpeg',
        shoes: process.env.PUBLIC_URL + '/Product_Images/basketball_shoes.jpeg',
        jersey: process.env.PUBLIC_URL + '/Product_Images/basketball_jersey.jpeg',
        fanJersey: process.env.PUBLIC_URL + '/Product_Images/basketball_fan_jersey.jpeg'
      },
      tennis: {
        racket: process.env.PUBLIC_URL + '/Product_Images/tennis_racket.jpeg',
        shoes: process.env.PUBLIC_URL + '/Product_Images/tennis_shoes.jpeg',
        ball: process.env.PUBLIC_URL + '/Product_Images/tennis_ball.jpeg',
        fanJersey: process.env.PUBLIC_URL + '/Product_Images/tennis_fan_jersey.jpeg'
      },
      badminton: {
        racket: process.env.PUBLIC_URL + '/Product_Images/racket.jpeg',
        shuttleCock: process.env.PUBLIC_URL + '/Product_Images/shuttle cok.jpg',
        shoes: process.env.PUBLIC_URL + '/Product_Images/badminton_shoes.jpeg',
        kitBag: process.env.PUBLIC_URL + '/Product_Images/badminton_kit_bag.jpeg',
        fanJersey: process.env.PUBLIC_URL + '/Product_Images/badminton_fan_jersey.jpeg'
      },
      generic: {
        gloves: process.env.PUBLIC_URL + '/Product_Images/gloves.jpeg',
        waterBottle: process.env.PUBLIC_URL + '/Product_Images/waterbottle.jpeg',
        airPump: process.env.PUBLIC_URL + '/Product_Images/airpump.jpeg'
      }
    };

    const getHeightCategory = (gender, height) => {
      if (!height) return gender === 'male' ? 'medium' : 'medium';

      if (gender === 'male') {
        if (height < 165) return 'short';
        if (height >= 165 && height < 175) return 'medium';
        if (height >= 175 && height < 185) return 'tall';
        return 'veryTall';
      } else { // female
        if (height < 155) return 'short';
        if (height >= 155 && height < 165) return 'medium';
        if (height >= 165 && height < 175) return 'tall';
        return 'veryTall';
      }
    };

    const getAgeCategory = (age) => {
      if (!age) return 'adult';
      if (age < 18) return 'youth';
      if (age >= 18 && age < 40) return 'adult';
      return 'senior';
    };

    const heightCategory = getHeightCategory(data.gender, parseInt(data.height));
    const ageCategory = getAgeCategory(parseInt(data.age));

    const sizeRecommendation = {
      male: {
        short: { size: 'S', description: 'Small size recommended based on your height' },
        medium: { size: 'M', description: 'Medium size recommended based on your height' },
        tall: { size: 'L', description: 'Large size recommended based on your height' },
        veryTall: { size: 'XL', description: 'Extra Large size recommended based on your height' }
      },
      female: {
        short: { size: 'S', description: 'Small size recommended based on your height' },
        medium: { size: 'M', description: 'Medium size recommended based on your height' },
        tall: { size: 'L', description: 'Large size recommended based on your height' },
        veryTall: { size: 'XL', description: 'Extra Large size recommended based on your height' }
      }
    };

    const ageAdjustments = {
      youth: 'Youth sizing recommended for better fit',
      adult: 'Standard adult sizing',
      senior: 'Comfort-focused fit recommended'
    };

    const styleDescriptions = {
      slim: 'Slim fit design for a modern athletic look',
      regular: 'Classic fit for comfort and mobility',
      loose: 'Loose fit for maximum freedom of movement'
    };

    const climateRecommendations = {
      hot: 'Breathable, moisture-wicking fabric ideal for hot weather',
      cold: 'Thermal protection to keep you warm in cold conditions',
      moderate: 'All-season fabric suitable for moderate weather'
    };

    const skinToneColors = {
      light: ['blue', 'navy', 'purple', 'green', 'black'],
      medium: ['red', 'orange', 'green', 'blue', 'purple'],
      dark: ['yellow', 'orange', 'red', 'white', 'bright green']
    };

    const recommendedColors = data.skinTone ? skinToneColors[data.skinTone] || [] : [];
    const colorRecommendation = recommendedColors.length > 0 ? 
      `Colors like ${recommendedColors.slice(0, 3).join(', ')} complement your skin tone well` : '';

    switch(data.favoriteSport) {
      case 'cricket':
        recommendations.push({
          id: 1,
          name: `${data.gender === 'female' ? 'Women\'s ' : ''}${data.skillLevel === 'pro' ? 'Professional' : data.skillLevel === 'intermediate' ? 'Intermediate' : 'Beginner'} Cricket Jersey`,
          price: data.skillLevel === 'pro' ? 3500 : data.skillLevel === 'intermediate' ? 2800 : 2200,
          image: data.favoriteTeam?.toLowerCase().includes('pakistan') ? productImages.cricket.pakistanKit : productImages.cricket.jersey,
          reason: `Perfect for ${data.skillLevel} level ${data.gender} players. ${data.climate ? climateRecommendations[data.climate] : ''}. ${sizeRecommendation[data.gender][heightCategory].description}. ${ageAdjustments[ageCategory]}. ${data.outfitStyle ? styleDescriptions[data.outfitStyle] : ''}`,
          category: "Cricket Apparel",
          size: sizeRecommendation[data.gender][heightCategory].size
        });

        recommendations.push({
          id: 2,
          name: `${data.skillLevel === 'pro' ? 'Professional' : data.skillLevel === 'intermediate' ? 'Intermediate' : 'Beginner'} Cricket Bat`,
          price: data.skillLevel === 'pro' ? 8000 : data.skillLevel === 'intermediate' ? 5000 : 3000,
          image: productImages.cricket.bat,
          reason: `${data.skillLevel === 'pro' ? 'Premium' : data.skillLevel === 'intermediate' ? 'High-quality' : 'Entry-level'} cricket bat perfect for your ${data.skillLevel} skill level. ${data.favoriteTeam ? `Inspired by equipment used by ${data.favoriteTeam} players.` : ''}`,
          category: "Cricket Equipment"
        });

        recommendations.push({
          id: 3,
          name: `${data.gender === 'female' ? 'Women\'s ' : ''}Cricket Gloves`,
          price: data.skillLevel === 'pro' ? 2500 : data.skillLevel === 'intermediate' ? 1800 : 1200,
          image: productImages.cricket.gloves,
          reason: `${data.skillLevel === 'pro' ? 'Professional' : data.skillLevel === 'intermediate' ? 'Enhanced protection' : 'Basic protection'} gloves suitable for ${data.gender === 'female' ? 'women' : 'men'}. ${data.playingPosition === 'batsman' ? 'Extra padding for batsmen.' : data.playingPosition === 'wicket-keeper' ? 'Specialized for wicket keepers.' : ''}`,
          category: "Cricket Accessories"
        });

        if (data.playingPosition === 'batsman' || data.playingPosition === 'all-rounder') {
          recommendations.push({
            id: 4,
            name: "Cricket Helmet",
            price: data.skillLevel === 'pro' ? 4500 : data.skillLevel === 'intermediate' ? 3500 : 2500,
            image: productImages.cricket.helmet,
            reason: `Essential protection for ${data.playingPosition}. Meets professional safety standards.`,
            category: "Cricket Protection"
          });
        }

        if (data.skillLevel === 'beginner') {
          recommendations.push({
            id: 5,
            name: "Beginner Cricket Kit",
            price: 7500,
            image: productImages.cricket.kit,
            reason: `Complete starter kit perfect for beginners. Includes everything you need to start playing cricket.`,
            category: "Cricket Equipment"
          });
        }
        
        // Add thermal underlayer based on gender and climate
        if (data.climate === 'cold') {
          recommendations.push({
            id: 6,
            name: `${data.gender === 'female' ? 'Women\'s' : 'Men\'s'} Thermal Underlayer`,
            price: 2200,
            image: data.gender === 'female' ? productImages.cricket.thermalUnderlayerWomen : productImages.cricket.thermalUnderlayerMen,
            reason: `Essential thermal protection for cold weather cricket. Keeps you warm while maintaining mobility.`,
            category: "Cricket Apparel",
            size: sizeRecommendation[data.gender][heightCategory].size
          });
        }
        break;

      case 'football':
        recommendations.push({
          id: 1,
          name: `${data.gender === 'female' ? 'Women\'s ' : ''}${data.skillLevel === 'pro' ? 'Professional' : data.skillLevel === 'intermediate' ? 'Performance' : 'Standard'} Football Jersey`,
          price: data.skillLevel === 'pro' ? 3500 : data.skillLevel === 'intermediate' ? 2800 : 2200,
          image: productImages.football.jersey,
          reason: `Ideal for ${data.playingPosition || 'your position'}. ${data.climate ? climateRecommendations[data.climate] : ''}. ${sizeRecommendation[data.gender][heightCategory].description}. ${ageAdjustments[ageCategory]}. ${data.outfitStyle ? styleDescriptions[data.outfitStyle] : ''}`,
          category: "Football Apparel",
          size: sizeRecommendation[data.gender][heightCategory].size
        });

        recommendations.push({
          id: 2,
          name: `${data.skillLevel === 'pro' ? 'Professional' : data.skillLevel === 'intermediate' ? 'Match' : 'Training'} Football`,
          price: data.skillLevel === 'pro' ? 4500 : data.skillLevel === 'intermediate' ? 3000 : 1800,
          image: productImages.football.ball,
          reason: `${data.skillLevel === 'pro' ? 'Official match ball' : data.skillLevel === 'intermediate' ? 'High-quality match ball' : 'Durable training ball'} suitable for your ${data.skillLevel} level.`,
          category: "Football Equipment"
        });

        recommendations.push({
          id: 3,
          name: `${data.gender === 'female' ? 'Women\'s ' : ''}${data.skillLevel === 'pro' ? 'Professional' : data.skillLevel === 'intermediate' ? 'Performance' : 'Basic'} Football Shoes`,
          price: data.skillLevel === 'pro' ? 7500 : data.skillLevel === 'intermediate' ? 5000 : 3000,
          image: productImages.football.shoes,
          reason: `${data.skillLevel === 'pro' ? 'Top-tier' : data.skillLevel === 'intermediate' ? 'Enhanced grip and support' : 'Comfortable entry-level'} football shoes. ${data.playingPosition === 'goalkeeper' ? 'Specialized for goalkeepers.' : data.playingPosition === 'defender' ? 'Extra durability for defenders.' : data.playingPosition === 'midfielder' ? 'Balanced for midfielders.' : data.playingPosition === 'forward' ? 'Lightweight for forwards.' : ''}`,
          category: "Football Footwear",
          size: sizeRecommendation[data.gender][heightCategory].size
        });

        recommendations.push({
          id: 4,
          name: `${data.gender === 'female' ? 'Women\'s ' : ''}Football Shin Guards`,
          price: data.skillLevel === 'pro' ? 2500 : data.skillLevel === 'intermediate' ? 1800 : 1200,
          image: data.gender === 'female' ? productImages.football.shinGuardsWomen : productImages.football.shinGuardsMen,
          reason: `Essential protection for all football players. ${data.skillLevel === 'pro' ? 'Professional grade protection.' : data.skillLevel === 'intermediate' ? 'Enhanced protection for regular players.' : 'Basic protection for beginners.'}`,
          category: "Football Protection"
        });

        if (data.favoriteTeam) {
          recommendations.push({
            id: 5,
            name: `${data.favoriteTeam} Fan Jersey`,
            price: 4500,
            image: data.gender === 'female' ? productImages.cricket.thermalUnderlayerWomen : productImages.cricket.thermalUnderlayerMen,
            reason: `Show support for your favorite team with this official ${data.favoriteTeam} jersey.`,
            category: "Team Merchandise"
          });
        }
        break;

      case 'basketball':
        recommendations.push({
          id: 1,
          name: `${data.gender === 'female' ? 'Women\'s ' : ''}${data.skillLevel === 'pro' ? 'Professional' : data.skillLevel === 'intermediate' ? 'Performance' : 'Basic'} Basketball Jersey`,
          price: data.skillLevel === 'pro' ? 3200 : data.skillLevel === 'intermediate' ? 2600 : 2000,
          image: productImages.basketball.jersey,
          reason: `Designed for ${data.skillLevel} players. ${data.climate ? climateRecommendations[data.climate] : ''}. ${sizeRecommendation[data.gender][heightCategory].description}. ${ageAdjustments[ageCategory]}. ${data.outfitStyle ? styleDescriptions[data.outfitStyle] : ''}`,
          category: "Basketball Apparel",
          size: sizeRecommendation[data.gender][heightCategory].size
        });

        recommendations.push({
          id: 2,
          name: `${data.skillLevel === 'pro' ? 'Professional' : data.skillLevel === 'intermediate' ? 'Match' : 'Training'} Basketball`,
          price: data.skillLevel === 'pro' ? 4000 : data.skillLevel === 'intermediate' ? 2800 : 1600,
          image: productImages.basketball.ball,
          reason: `${data.skillLevel === 'pro' ? 'Official match ball' : data.skillLevel === 'intermediate' ? 'High-quality match ball' : 'Durable training ball'} suitable for your ${data.skillLevel} level.`,
          category: "Basketball Equipment"
        });

        recommendations.push({
          id: 3,
          name: `${data.gender === 'female' ? 'Women\'s ' : ''}${data.skillLevel === 'pro' ? 'Professional' : data.skillLevel === 'intermediate' ? 'Performance' : 'Basic'} Basketball Shoes`,
          price: data.skillLevel === 'pro' ? 8000 : data.skillLevel === 'intermediate' ? 5500 : 3500,
          image: productImages.basketball.shoes,
          reason: `${data.skillLevel === 'pro' ? 'Top-tier' : data.skillLevel === 'intermediate' ? 'Enhanced grip and support' : 'Comfortable entry-level'} basketball shoes. ${data.playingPosition === 'point-guard' ? 'Lightweight for point guards.' : data.playingPosition === 'shooting-guard' ? 'Balanced for shooting guards.' : data.playingPosition === 'small-forward' ? 'Versatile for small forwards.' : data.playingPosition === 'power-forward' ? 'Extra support for power forwards.' : data.playingPosition === 'center' ? 'Maximum stability for centers.' : ''}`,
          category: "Basketball Footwear",
          size: sizeRecommendation[data.gender][heightCategory].size
        });

        recommendations.push({
          id: 4,
          name: "Basketball Wristbands",
          price: 800,
          image: productImages.generic.gloves,
          reason: `Sweat-absorbing wristbands for basketball players. ${data.favoriteColor ? `Available in your preferred ${data.favoriteColor} color.` : ''}`,
          category: "Basketball Accessories"
        });

        if (data.favoriteTeam) {
          recommendations.push({
            id: 5,
            name: `${data.favoriteTeam} Fan Jersey`,
            price: 4500,
            image: data.gender === 'female' ? productImages.cricket.thermalUnderlayerWomen : productImages.cricket.thermalUnderlayerMen,
            reason: `Show support for your favorite team with this official ${data.favoriteTeam} jersey.`,
            category: "Team Merchandise"
          });
        }
        break;

      case 'tennis':
        recommendations.push({
          id: 1,
          name: `${data.gender === 'female' ? 'Women\'s ' : ''}${data.skillLevel === 'pro' ? 'Professional' : data.skillLevel === 'intermediate' ? 'Performance' : 'Basic'} Tennis ${data.gender === 'female' ? 'Top' : 'Shirt'}`,
          price: data.skillLevel === 'pro' ? 3000 : data.skillLevel === 'intermediate' ? 2400 : 1800,
          image: productImages.tennis.racket,
          reason: `Perfect for ${data.skillLevel} players. ${data.climate ? climateRecommendations[data.climate] : ''}. ${sizeRecommendation[data.gender][heightCategory].description}. ${ageAdjustments[ageCategory]}. ${data.outfitStyle ? styleDescriptions[data.outfitStyle] : ''}`,
          category: "Tennis Apparel",
          size: sizeRecommendation[data.gender][heightCategory].size
        });

        recommendations.push({
          id: 2,
          name: `${data.skillLevel === 'pro' ? 'Professional' : data.skillLevel === 'intermediate' ? 'Performance' : 'Beginner'} Tennis Racket`,
          price: data.skillLevel === 'pro' ? 12000 : data.skillLevel === 'intermediate' ? 7000 : 3500,
          image: productImages.tennis.racket,
          reason: `${data.skillLevel === 'pro' ? 'Tournament-grade' : data.skillLevel === 'intermediate' ? 'High-quality' : 'Entry-level'} tennis racket suitable for your ${data.skillLevel} level. ${data.playingPosition === 'singles' ? 'Optimized for singles play.' : data.playingPosition === 'doubles' ? 'Balanced for doubles play.' : ''}`,
          category: "Tennis Equipment"
        });

        recommendations.push({
          id: 3,
          name: `${data.gender === 'female' ? 'Women\'s ' : ''}${data.skillLevel === 'pro' ? 'Professional' : data.skillLevel === 'intermediate' ? 'Performance' : 'Basic'} Tennis Shoes`,
          price: data.skillLevel === 'pro' ? 7000 : data.skillLevel === 'intermediate' ? 5000 : 3000,
          image: productImages.tennis.shoes,
          reason: `${data.skillLevel === 'pro' ? 'Top-tier' : data.skillLevel === 'intermediate' ? 'Enhanced grip and support' : 'Comfortable entry-level'} tennis shoes with excellent court grip.`,
          category: "Tennis Footwear",
          size: sizeRecommendation[data.gender][heightCategory].size
        });

        recommendations.push({
          id: 4,
          name: `Tennis Balls (${data.skillLevel === 'pro' ? '12' : data.skillLevel === 'intermediate' ? '6' : '3'}-pack)`,
          price: data.skillLevel === 'pro' ? 2400 : data.skillLevel === 'intermediate' ? 1200 : 600,
          image: productImages.tennis.ball,
          reason: `${data.skillLevel === 'pro' ? 'Tournament-grade' : data.skillLevel === 'intermediate' ? 'Match-quality' : 'Practice'} tennis balls.`,
          category: "Tennis Equipment"
        });

        if (data.favoriteTeam) {
          recommendations.push({
            id: 5,
            name: `${data.favoriteTeam} Signature ${data.gender === 'female' ? 'Women\'s ' : ''}Tennis Racket`,
            price: 15000,
            image: productImages.tennis.racket,
            reason: `Play with the same racket specifications as your favorite player, ${data.favoriteTeam}.`,
            category: "Player Merchandise"
          });
        }
        break;
    }

    if (data.climate === 'hot') {
      recommendations.push({
        id: recommendations.length + 1,
        name: `Sports Cap`,
        price: 1200,
        image: productImages.generic.image2,
        reason: `Provides sun protection for hot weather. ${data.favoriteColor ? `Available in your preferred ${data.favoriteColor} color.` : ''} ${colorRecommendation}`,
        category: "Accessories"
      });
    } else if (data.climate === 'cold') {
      recommendations.push({
        id: recommendations.length + 1,
        name: `Thermal Underlayer`,
        price: 2500,
        image: data.gender === 'female' ? productImages.cricket.thermalUnderlayerWomen : productImages.cricket.thermalUnderlayerMen,
        reason: `Keeps you warm during cold weather sports activities. ${data.favoriteColor ? `Available in your preferred ${data.favoriteColor} color.` : ''} ${colorRecommendation}`,
        category: "Accessories"
      });
    }

    if (!recommendations.some(item => item.category.includes('Footwear'))) {
      recommendations.push({
        id: recommendations.length + 1,
        name: `${data.gender === 'female' ? 'Women\'s ' : ''}${data.favoriteSport.charAt(0).toUpperCase() + data.favoriteSport.slice(1)} Shoes`,
        price: data.skillLevel === 'pro' ? 7000 : data.skillLevel === 'intermediate' ? 5000 : 3000,
        image: productImages.cricket.shoes,
        reason: `Professional ${data.favoriteSport} shoes suitable for ${data.skillLevel} players. ${sizeRecommendation[data.gender][heightCategory].description}`,
        category: "Footwear",
        size: sizeRecommendation[data.gender][heightCategory].size
      });
    }

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
                    <div className="product-image-container">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        onError={(e) => {
                          console.error(`Image not found for: ${product.name}`);
                          e.target.onerror = null;
                          e.target.classList.add('image-error');
                          const errorMsg = document.createElement('div');
                          errorMsg.className = 'image-error-message';
                          errorMsg.textContent = 'Image not available';
                          e.target.parentNode.appendChild(errorMsg);
                        }}
                      />
                    </div>
                    <h3>{product.name}</h3>
                    <p className="category">{product.category}</p>
                    <p className="price">PKR {product.price.toLocaleString()}</p>
                    <p className="reason">{product.reason}</p>
                    {/* Size information removed for consistent button layout */}
                    <button className="add-to-cart-btn">ADD TO CART</button>
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