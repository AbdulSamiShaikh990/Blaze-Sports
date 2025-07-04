require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Email of the user to check
const userEmail = 'farhanhussain18122003@gmail.com';

async function checkUserRole() {
  try {
    // Find user by email
    const user = await User.findOne({ email: userEmail.toLowerCase() });
    
    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      process.exit(1);
    }
    
    console.log('User found:');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('User Type:', user.userType);
    console.log('Firebase UID:', user.firebaseUid);
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking user:', error);
    process.exit(1);
  }
}

checkUserRole();
