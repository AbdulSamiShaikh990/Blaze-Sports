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
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    // Removed unique: true from here to avoid duplicate index definition
  },
  firebaseUid: {
    type: String,
    sparse: true,
    index: true
  },
  password: {
    type: String,
    required: function() {
      // Password is only required if there's no firebaseUid (for non-Firebase auth)
      return !this.firebaseUid;
    },
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

// Handle indexes in a more robust way
const setupIndexes = async () => {
  try {
    // First, try to drop all indexes
    await User.collection.dropIndexes();
    console.log('All indexes dropped successfully');
    
    // Then try to create the email index with a custom name to avoid conflicts
    await User.collection.createIndex(
      { email: 1 }, 
      { 
        unique: true, 
        background: true,
        name: 'email_unique_index' // Custom name to avoid auto-generated name conflicts
      }
    );
    console.log('Email index created successfully');
  } catch (err) {
    // If there's an error with index management, log it but don't crash the app
    console.error('Error managing indexes:', err);
    
    // If the error is about index conflicts, try a different approach
    if (err.code === 86) { // IndexKeySpecsConflict
      try {
        // Try to drop just the specific index
        await User.collection.dropIndex('email_1');
        console.log('Dropped conflicting email index');
        
        // Then recreate it
        await User.collection.createIndex(
          { email: 1 }, 
          { 
            unique: true, 
            background: true,
            name: 'email_unique_index'
          }
        );
        console.log('Email index recreated successfully');
      } catch (innerErr) {
        console.error('Failed to resolve index conflict:', innerErr);
      }
    }
  }
};

// Run the index setup
setupIndexes();

module.exports = User; 