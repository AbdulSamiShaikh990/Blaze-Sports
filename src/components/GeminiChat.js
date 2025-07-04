import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from 'react-router-dom';
import './GeminiChat.css';
import { FaRobot, FaUser, FaPaperPlane, FaTimes } from 'react-icons/fa';

const GeminiChat = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today? Ask me anything about Blaze Sports products or website navigation.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get the API key from environment variables
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Function to check if the user input contains navigation requests and extract category information
  const checkForNavigation = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Define available product categories
    const availableCategories = {
      'cricket': 'Cricket',
      'badminton': 'Badminton',
      'tennis': 'Tennis',
      'football': 'Football',
      'soccer': 'Football' // Alternative name for football
    };
    
    // Check for product requests with or without explicit navigation words
    let categoryFound = null;
    let priceFilter = null;
    
    // Check if any category is mentioned in the input
    Object.keys(availableCategories).forEach(category => {
      if (input.includes(category)) {
        categoryFound = availableCategories[category];
      }
    });
    
    // Check for price range requests
    if (input.includes('under 3000') || input.includes('less than 3000') || input.includes('below 3000')) {
      priceFilter = 'under3000';
    } else if (input.includes('low price') || input.includes('cheap') || input.includes('affordable') || input.includes('budget')) {
      priceFilter = 'low';
    } else if (input.includes('high price') || input.includes('expensive') || input.includes('premium') || input.includes('high end')) {
      priceFilter = 'high';
    }
    
    // If a category is found with price filter
    if (categoryFound && priceFilter) {
      return `/products?category=${categoryFound}&price=${priceFilter}`;
    }
    
    // If only a category is found
    if (categoryFound) {
      return `/products?category=${categoryFound}`;
    }
    
    // If only price filter is found
    if (priceFilter) {
      return `/products?price=${priceFilter}`;
    }
    
    // Check for general product requests
    if (
      (input.includes('show') || input.includes('see') || input.includes('view') || 
       input.includes('go to') || input.includes('display') || input.includes('find')) && 
      (input.includes('product') || input.includes('items') || input.includes('equipment'))
    ) {
      return '/products';
    }
    
    // Check for other page navigation
    if (input.includes('home') || input.includes('homepage')) {
      return '/';
    } else if (input.includes('about')) {
      return '/about';
    } else if (input.includes('contact')) {
      return '/contact';
    } else if (input.includes('recommendation') || input.includes('ai recommendation')) {
      return '/ai-recommendation';
    } else if (input.includes('cart') || input.includes('shopping cart')) {
      return '/cart';
    }
    
    return null; // No navigation request detected
  };

  const generateResponse = async (userInput) => {
    try {
      setIsLoading(true);
      
      // Check if the user wants to navigate to a specific section
      const navigationPath = checkForNavigation(userInput);
      
      console.log('Generating response with API key:', API_KEY);
      
      // Initialize the Gemini API with the latest version
      const genAI = new GoogleGenerativeAI(API_KEY);
      console.log('GenAI initialized');
      
      // Use the latest Gemini 1.5 Flash model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log('Model selected: gemini-1.5-flash');

      // Extract category and price information if present in the navigation path
      let categoryInfo = '';
      let priceInfo = '';
      
      // Handle category parameter
      if (navigationPath && navigationPath.includes('category=')) {
        let category;
        if (navigationPath.includes('&')) {
          // If there are multiple parameters
          category = navigationPath.split('category=')[1].split('&')[0];
        } else {
          category = navigationPath.split('category=')[1];
        }
        
        categoryInfo = `
        The user is asking about ${category} products. We have a variety of ${category} equipment including:
        - For Cricket: bats, balls, pads, gloves, helmets, and complete kits
        - For Badminton: rackets, shuttlecocks, nets, shoes, and accessories
        - For Tennis: rackets, balls, strings, shoes, and accessories
        - For Football: balls, shoes, shin guards, jerseys, and goalkeeper gear
        `;
      }
      
      // Handle price parameter
      if (navigationPath && navigationPath.includes('price=')) {
        const priceRange = navigationPath.split('price=')[1].split('&')[0];
        
        if (priceRange === 'under3000') {
          priceInfo = `
          The user is specifically looking for products under Rs. 3,000. Only show products that are priced below Rs. 3,000. Highlight the exact price of each suggested product and emphasize that all suggestions are under the requested budget.
          `;
        } else if (priceRange === 'low') {
          priceInfo = `
          The user is looking for affordable/low-price products. Suggest budget-friendly options in our catalog that offer good value for money. Price range typically under Rs. 5,000.
          `;
        } else if (priceRange === 'high') {
          priceInfo = `
          The user is looking for premium/high-price products. Suggest our high-end professional equipment that offers superior quality and performance. Price range typically above Rs. 10,000.
          `;
        }
      }

      // Create context about the website for better responses
      const prompt = `
        You are a helpful assistant for Blaze Sports, a sports equipment store in Pakistan.
        The website has the following sections:
        - Home page with featured products
        - Products page with categories: Cricket, Badminton, Tennis, and Football
        - About Us page
        - Contact page
        - AI Recommendation system for personalized sports gear
        - Shopping cart and checkout
        ${categoryInfo}
        ${priceInfo}
        
        Help users navigate the site, find products, and answer questions about sports equipment.
        Be friendly, helpful, and concise.
        
        IMPORTANT: Do not use markdown formatting like ** for bold text in your responses. Use plain text only.
        If the user is asking about products we don't have, politely inform them that we currently only offer Cricket, Badminton, Tennis, and Football equipment.

        User query: ${userInput}
        ${navigationPath ? 'I will navigate the user to the requested page after this response.' : ''}
      `;

      // Use the generateContent method with the prompt
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      
      // If navigation is requested, handle it with a direct approach
      if (navigationPath) {
        // Force scroll to top immediately
        window.scrollTo(0, 0);
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        // Close the chat immediately
        setIsOpen(false);
        
        // Use a very short timeout before navigation to ensure scroll happens first
        setTimeout(() => {
          // Parse the navigation path to extract parameters
          let path = navigationPath;
          let category = null;
          let priceRange = null;
          
          // Extract query parameters
          if (navigationPath.includes('?')) {
            const [basePath, queryString] = navigationPath.split('?');
            path = basePath;
            
            // Parse query parameters
            const params = queryString.split('&');
            params.forEach(param => {
              const [key, value] = param.split('=');
              if (key === 'category') {
                category = value;
              } else if (key === 'price') {
                priceRange = value;
              }
            });
            
            // Store parameters in sessionStorage
            if (category) {
              sessionStorage.setItem('blaze_category', category);
            }
            if (priceRange) {
              sessionStorage.setItem('blaze_price_range', priceRange);
            }
            sessionStorage.setItem('blaze_from_chatbot', 'true');
            
            // Navigate to the base path
            navigate(path);
          } else {
            // Regular navigation for other pages
            navigate(navigationPath);
          }
          
          // Force scroll again after navigation
          setTimeout(() => {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
          }, 100);
        }, 100); // Very short delay
        
        // Customize response based on navigation parameters
        let navigationMessage = "\n\nNavigating you to the requested page...";
        
        if (navigationPath.includes('?')) {
          // Extract parameters for the message
          let category = null;
          let priceRange = null;
          
          if (navigationPath.includes('category=')) {
            // Extract category, handling the case where there might be additional parameters
            const categoryPart = navigationPath.split('category=')[1];
            category = categoryPart.includes('&') ? categoryPart.split('&')[0] : categoryPart;
          }
          
          if (navigationPath.includes('price=')) {
            // Extract price range, handling the case where there might be additional parameters
            const pricePart = navigationPath.split('price=')[1];
            priceRange = pricePart.includes('&') ? pricePart.split('&')[0] : pricePart;
          }
          
          // Build a descriptive message
          if (category && priceRange) {
            let priceDescription = '';
            if (priceRange === 'low') priceDescription = 'affordable';
            else if (priceRange === 'high') priceDescription = 'premium';
            else if (priceRange === 'under3000') priceDescription = 'under Rs. 3,000';
            
            navigationMessage = `\n\nTaking you to our ${priceDescription} ${category} products...`;
          } else if (category) {
            navigationMessage = `\n\nTaking you to our ${category} products...`;
          } else if (priceRange) {
            let priceDescription = '';
            if (priceRange === 'low') priceDescription = 'affordable';
            else if (priceRange === 'high') priceDescription = 'premium';
            else if (priceRange === 'under3000') priceDescription = 'under Rs. 3,000';
            
            navigationMessage = `\n\nTaking you to our ${priceDescription} products...`;
          }
        }
        
        return response + navigationMessage;
      }
      
      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      return "Sorry, I'm having trouble connecting to the server. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    
    // Clear input
    setInput('');
    setIsLoading(true);
    
    // Generate response
    generateResponse(userInput)
      .then(response => {
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error in chat response:', error);
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again." }]);
        setIsLoading(false);
      });
  };

  // Function to format message content (remove markdown formatting)
  const formatMessageContent = (content) => {
    // Replace ** with empty string to remove bold formatting
    return content.replace(/\*\*/g, '');
  };

  return (
    <div className="gemini-chat-container">
      {!isOpen ? (
        <button className="chat-button" onClick={toggleChat}>
          <FaRobot /> Chatbot
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <h3><FaRobot /> Blaze Sports Assistant</h3>
            <button className="close-button" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-icon">
                  {message.role === 'user' ? <FaUser /> : <FaRobot />}
                </div>
                <div className="message-content">
                  {formatMessageContent(message.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant-message">
                <div className="message-icon">
                  <FaRobot />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your question here..."
              ref={inputRef}
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GeminiChat;
