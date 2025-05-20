const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: {
      values: ['customer', 'admin'],
      message: 'User type must be either customer or admin'
    },
    default: 'customer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  validateBeforeSave: true // Ensures validation before saving
});

// Ensure email index is properly set
userSchema.index({ email: 1 }, { unique: true, sparse: true });

// Pre-save middleware to ensure data is properly formatted
userSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.isModified('name')) {
    this.name = this.name.trim();
  }
  if (this.isModified('userType')) {
    this.userType = this.userType.trim().toLowerCase();
  }
  next();
});

// Create the model
const User = mongoose.model('User', userSchema);

// Drop any existing indexes that might conflict
User.collection.dropIndexes()
  .then(() => {
    console.log('All indexes dropped successfully');
    // Recreate the email index
    return User.collection.createIndex({ email: 1 }, { unique: true });
  })
  .then(() => {
    console.log('Email index created successfully');
  })
  .catch(err => {
    console.error('Error managing indexes:', err);
  });

module.exports = User; 