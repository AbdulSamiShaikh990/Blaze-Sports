const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    
    const { name, email, password, userType } = req.body;

    // Validate required fields
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ 
        error: 'All fields are required',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          userType: !userType ? 'User type is required' : null
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Validate userType
    if (!['customer', 'admin'].includes(userType.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid user type. Must be either customer or admin' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      userType: userType.toLowerCase().trim()
    });

    // Save user to database
    try {
      const savedUser = await newUser.save();
      console.log('User saved successfully:', savedUser.email);
      
      // Return success response without password
      const userResponse = {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        userType: savedUser.userType,
        createdAt: savedUser.createdAt
      };

      // Generate JWT token
      const token = jwt.sign(
        { id: savedUser._id, email: savedUser.email, userType: savedUser.userType },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({
        message: 'User created successfully',
        user: userResponse,
        token
      });
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      
      if (saveError.code === 11000) {
        return res.status(400).json({ 
          error: 'Email already exists',
          details: 'A user with this email address already exists'
        });
      }
      
      return res.status(500).json({ 
        error: 'Error creating user',
        details: saveError.message
      });
    }

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      error: 'Server error during signup',
      details: error.message
    });
  }
});

// Login route with JWT token generation
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return user data + token
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
