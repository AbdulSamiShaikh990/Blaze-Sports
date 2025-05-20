import React from 'react';
import { FaUsers, FaHandshake, FaLightbulb, FaHeart, FaEnvelope, FaTrophy, FaMedal, FaStar, FaCrown, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us" id="about">
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1>About Blaze Sports</h1>
          <p>
            We are passionate about delivering exceptional sports equipment and gear to athletes
            of all levels. Our journey began with a simple idea: to create a sports shopping
            experience that combines quality, performance, and innovation.
          </p>
        </section>

        {/* Founders Section */}
        <section className="founders-section">
          <h2>Our Founders</h2>
          <div className="founders-grid">
            <div className="founder-card">
              <div className="founder-icon-wrapper">
                <FaCrown className="founder-icon" />
              </div>
              <div className="founder-info">
                <h3>Syed Farhan</h3>
                <p className="founder-title">Co-Founder & CEO</p>
                <p className="founder-description">
                  A visionary leader with a passion for sports and innovation. Syed Farhan
                  brings his expertise in business development and customer experience to
                  make Blaze Sports a leading name in sports equipment.
                </p>
              </div>
            </div>
            <div className="founder-card">
              <div className="founder-icon-wrapper">
                <FaRocket className="founder-icon" />
              </div>
              <div className="founder-info">
                <h3>Abdul Sami</h3>
                <p className="founder-title">Co-Founder & CTO</p>
                <p className="founder-description">
                  A tech innovator with deep knowledge in sports technology. Abdul Sami
                  leads our technical initiatives and ensures we stay at the forefront of
                  sports equipment innovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              To empower athletes with the best sports equipment and gear, providing them with
              the tools they need to excel in their chosen sports. We believe in quality,
              performance, and innovation in every product we offer.
            </p>
            <p>
              At Blaze Sports, we're not just selling equipment; we're supporting athletes
              in their journey to greatness, whether they're just starting out or competing
              at the highest level.
            </p>
          </div>
          <div className="mission-image">
            <img
              src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Our Mission"
            />
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <FaTrophy />
              </div>
              <h3>Excellence</h3>
              <p>
                We strive for excellence in everything we do, from product quality to customer
                service, ensuring athletes get the best equipment for their performance.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaHandshake />
              </div>
              <h3>Integrity</h3>
              <p>
                We maintain the highest standards of honesty and transparency in all our
                business dealings and customer interactions.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaLightbulb />
              </div>
              <h3>Innovation</h3>
              <p>
                We constantly innovate to bring the latest sports technology and equipment
                to our customers, helping them stay ahead of the game.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaMedal />
              </div>
              <h3>Quality</h3>
              <p>
                We are committed to delivering the highest quality sports equipment,
                ensuring durability, performance, and value for every athlete.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <h2>Get in Touch</h2>
          <p>
            Have questions about our products or need assistance? We'd love to hear from you.
            Contact us today and we'll get back to you as soon as possible.
          </p>
          <Link to="/contact" className="contact-btn">
            <FaEnvelope />
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
