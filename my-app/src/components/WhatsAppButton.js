import React from 'react';
import { FaWhatsapp, FaRobot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const navigate = useNavigate();

  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number
    const phoneNumber = '923001234567';
    const message = 'Hello! I would like to know more about your products.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAIClick = () => {
    navigate('/ai-recommendation');
  };

  return (
    <div className="floating-buttons" style={{ position: 'fixed', zIndex: 9999, bottom: '20px', right: '20px' }}>
      <button 
        className="floating-button ai-button"
        onClick={handleAIClick}
        aria-label="Get AI Recommendations"
      >
        <FaRobot />
        <span className="button-tooltip">AI Recommendations</span>
      </button>
      <button 
        className="floating-button whatsapp-button"
        onClick={handleWhatsAppClick}
        aria-label="Contact on WhatsApp"
      >
        <FaWhatsapp />
        <span className="button-tooltip">Chat on WhatsApp</span>
      </button>
    </div>
  );
};

export default WhatsAppButton;
