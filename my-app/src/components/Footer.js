import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, 
         FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCreditCard,
         FaTruck, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-features">
          <div className="feature-item">
            <FaTruck className="feature-icon" />
            <div className="feature-text">
              <h4>Free Shipping</h4>
              <p>On orders over PKR 5000</p>
            </div>
          </div>
          <div className="feature-item">
            <FaCreditCard className="feature-icon" />
            <div className="feature-text">
              <h4>Secure Payment</h4>
              <p>100% secure payments</p>
            </div>
          </div>
          <div className="feature-item">
            <FaShieldAlt className="feature-icon" />
            <div className="feature-text">
              <h4>Quality Guarantee</h4>
              <p>Original products only</p>
            </div>
          </div>
          <div className="feature-item">
            <FaHeadset className="feature-icon" />
            <div className="feature-text">
              <h4>24/7 Support</h4>
              <p>Dedicated support</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-section">
          <h3>About Blaze Sports</h3>
          <p>Your premier destination for quality sports equipment and accessories. We provide authentic products with exceptional service.</p>
          <div className="contact-info">
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>123 Sports Street, Lahore, Pakistan</span>
            </div>
            <div className="contact-item">
              <FaPhoneAlt />
              <span>+92 300 1234567</span>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <span>info@blazesports.com</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/returns">Returns Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Categories</h3>
          <ul className="footer-links">
            <li><Link to="/category/cricket">Cricket</Link></li>
            <li><Link to="/category/football">Football</Link></li>
            <li><Link to="/category/basketball">Basketball</Link></li>
            <li><Link to="/category/tennis">Tennis</Link></li>
            <li><Link to="/category/running">Running</Link></li>
            <li><Link to="/category/boxing">Boxing</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </div>
          <div className="social-links">
            <a href="#" className="social-link"><FaFacebookF /></a>
            <a href="#" className="social-link"><FaTwitter /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
            <a href="#" className="social-link"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          <p>&copy; 2024 Blaze Sports. All rights reserved.</p>
        </div>
        <div className="payment-methods">
          <img src="/images/payment-methods.png" alt="Accepted payment methods" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;