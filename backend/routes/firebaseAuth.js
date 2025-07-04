const express = require('express');
const router = express.Router();
const User = require('../models/User');
const admin = require('../config/firebaseAdmin');

// Register a new user with Firebase Auth
router.post('/register', async (req, res) => {
  try {
    const { name, email, firebaseUid, userType = 'customer' } = req.body;

    // Validate required fields
    if (!name || !email || !firebaseUid) {
      return res.status(400).json({ 
        error: 'All fields are required',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          firebaseUid: !firebaseUid ? 'Firebase UID is required' : null
        }
      });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      // If user exists but doesn't have a Firebase UID, update it
      if (!existingUser.firebaseUid) {
        existingUser.firebaseUid = firebaseUid;
        await existingUser.save();
        
        return res.status(200).json({
          message: 'User updated with Firebase UID',
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            userType: existingUser.userType
          }
        });
      }
      
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user in MongoDB
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      firebaseUid,
      userType: userType.toLowerCase().trim()
    });

    // Save user to database
    const savedUser = await newUser.save();
    
    // Return success response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        userType: savedUser.userType
      }
    });
    
  } catch (error) {
    console.error('Firebase register error:', error);
    res.status(500).json({ 
      error: 'Server error during registration',
      details: error.message
    });
  }
});

// Login with Firebase (verify token and get/create user in MongoDB)
router.post('/login', async (req, res) => {
  try {
    const { email, firebaseUid } = req.body;

    // Validate required fields
    if (!email || !firebaseUid) {
      return res.status(400).json({ error: 'Email and Firebase UID are required' });
    }

    // Find user by email
    let user = await User.findOne({ email: email.toLowerCase() });
    
    // If user doesn't exist, create one
    if (!user) {
      // Get user info from Firebase
      const firebaseUser = await admin.auth().getUser(firebaseUid);
      
      user = new User({
        name: firebaseUser.displayName || email.split('@')[0],
        email: email.toLowerCase(),
        firebaseUid,
        userType: 'customer' // Default to customer
      });
      
      await user.save();
    } 
    // If user exists but doesn't have Firebase UID, update it
    else if (!user.firebaseUid) {
      user.firebaseUid = firebaseUid;
      await user.save();
    }

    // Return user data
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
    
  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(500).json({ 
      error: 'Server error during login',
      details: error.message
    });
  }
});

// Google login/signup
router.post('/google-login', async (req, res) => {
  try {
    const { name, email, firebaseUid } = req.body;

    // Validate required fields
    if (!email || !firebaseUid) {
      return res.status(400).json({ error: 'Email and Firebase UID are required' });
    }

    // Find user by email
    let user = await User.findOne({ email: email.toLowerCase() });
    
    // If user doesn't exist, create one
    if (!user) {
      user = new User({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        firebaseUid,
        userType: 'customer' // Default to customer
      });
      
      await user.save();
    } 
    // If user exists but doesn't have Firebase UID, update it
    else if (!user.firebaseUid) {
      user.firebaseUid = firebaseUid;
      if (name) user.name = name;
      await user.save();
    }

    // Return user data
    res.json({
      message: 'Google login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
    
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ 
      error: 'Server error during Google login',
      details: error.message
    });
  }
});

// Verify token and get user data
router.get('/verify-token', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }
    
    // Extract token from header
    const token = authHeader.split(' ')[1];
    
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Get user from MongoDB
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }
    
    // Return user data
    res.json({
      message: 'Token verified',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      error: 'Invalid token',
      details: error.message
    });
  }
});

module.exports = router;
