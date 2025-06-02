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

// Email of the user you want to make admin
const userEmail = 'farhanhussain18122003@gmail.com'; // User's correct email from Firebase

async function setAdminUser() {
  try {
    // Find user by email
    const user = await User.findOne({ email: userEmail.toLowerCase() });
    
    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      process.exit(1);
    }
    
    // Update user type to admin
    user.userType = 'admin';
    await user.save();
    
    console.log(`User ${userEmail} has been set as admin`);
    process.exit(0);
  } catch (error) {
    console.error('Error setting admin user:', error);
    process.exit(1);
  }
}

setAdminUser();
