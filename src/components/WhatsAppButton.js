import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppButton.css';

const WhatsAppButton = () => {

  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number
    const phoneNumber = '923001234567';
    const message = 'Hello! I would like to know more about your products.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };



  // Use useEffect to ensure buttons follow scroll
  React.useEffect(() => {
    const handleScroll = () => {
      // This forces a re-render on scroll
      const scrollButtons = document.querySelector('.floating-buttons');
      if (scrollButtons) {
        scrollButtons.style.bottom = '20px';
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      className="floating-buttons" 
      style={{
        position: 'fixed',
        zIndex: 9999,
        bottom: '20px',
        right: '20px',
        transition: 'all 0.2s ease',
        willChange: 'transform',
      }}
    >

      <button 
        className="floating-button whatsapp-button"
        onClick={handleWhatsAppClick}
        aria-label="Contact on WhatsApp"
        style={{
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          margin: '5px 0',
        }}
      >
        <FaWhatsapp />
        <span className="button-tooltip">Chat on WhatsApp</span>
      </button>
    </div>
  );
};

export default WhatsAppButton;
