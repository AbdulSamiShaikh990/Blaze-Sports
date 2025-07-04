/**
 * Script to update product images in the database
 * 
 * This script allows you to update product images that have empty image URLs
 * You can run it with: node updateProductImages.js
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config({ path: '../.env' });

// Default image URLs for each category
const defaultImages = {
  'Cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop',
  'Football': 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1000&auto=format&fit=crop',
  'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109acd27d?q=80&w=1000&auto=format&fit=crop',
  'Badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop'
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function updateProductImages() {
  try {
    // Find products with empty image URLs
    const productsToUpdate = await Product.find({ 
      $or: [
        { image: { $eq: '' } },
        { image: { $eq: null } },
        { image: { $exists: false } }
      ] 
    }).populate('category');

    console.log(`Found ${productsToUpdate.length} products with empty image URLs`);

    if (productsToUpdate.length === 0) {
      console.log('No products need updating');
      process.exit(0);
    }

    // Update each product
    for (const product of productsToUpdate) {
      const categoryName = product.category ? product.category.name : 'default';
      const imageUrl = defaultImages[categoryName] || defaultImages.default;
      
      console.log(`Updating product "${product.name}" with image URL: ${imageUrl}`);
      
      product.image = imageUrl;
      await product.save();
    }

    console.log('All products updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating products:', error);
    process.exit(1);
  }
}

// Run the update function
updateProductImages();
