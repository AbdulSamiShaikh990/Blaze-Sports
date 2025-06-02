import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page" id="contact">
      <div className="contact-container">
        {/* Hero Section */}
        <section className="contact-hero">
          <h1>Contact Us</h1>
          <p>
            Have questions or need assistance? We're here to help! Reach out to us through
            any of our contact channels or fill out the form below.
          </p>
        </section>

        {/* Contact Info Grid */}
        <section className="contact-info-grid">
          <div className="contact-info-card">
            <div className="info-icon">
              <FaPhone />
            </div>
            <h3>Phone</h3>
            <p>+92 300 1234567</p>
            <p>+92 51 1234567</p>
          </div>

          <div className="contact-info-card">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <h3>Email</h3>
            <p>info@blazesports.pk</p>
            <p>support@blazesports.pk</p>
          </div>

          <div className="contact-info-card">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Location</h3>
            <p>F-7 Markaz, Islamabad</p>
            <p>Pakistan</p>
          </div>

          <div className="contact-info-card">
            <div className="info-icon">
              <FaClock />
            </div>
            <h3>Business Hours</h3>
            <p>Monday - Saturday</p>
            <p>10:00 AM - 8:00 PM</p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-form-section">
          <div className="form-content">
            <h2>Send us a Message</h2>
            <p>
              Fill out the form below and we'll get back to you as soon as possible.
              We typically respond within 24 hours.
            </p>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
        <input
          type="text"
                  id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
                  placeholder="Enter your full name"
        />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
        <input
          type="email"
                  id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter message subject"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
        <textarea
                  id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
                  placeholder="Enter your message"
                  rows="5"
        ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
      </form>
          </div>

          <div className="social-connect">
            <h2>Connect With Us</h2>
            <p>
              Follow us on social media for the latest updates, promotions, and sports
              equipment news.
            </p>
            <div className="social-links">
              <a href="#" className="social-link whatsapp">
                <FaWhatsapp />
                <span>WhatsApp</span>
              </a>
              <a href="#" className="social-link facebook">
                <FaFacebook />
                <span>Facebook</span>
              </a>
              <a href="#" className="social-link instagram">
                <FaInstagram />
                <span>Instagram</span>
              </a>
              <a href="#" className="social-link twitter">
                <FaTwitter />
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <h2>Visit Our Store</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.8987695731047!2d73.0478753151018!3d33.72997997978976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd07891725f%3A0x5f8d699e74e05fb9!2sF-7%20Markaz%2C%20Islamabad%2C%20Islamabad%20Capital%20Territory!5e0!3m2!1sen!2s!4v1647689123456!5m2!1sen!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Blaze Sports Location"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;