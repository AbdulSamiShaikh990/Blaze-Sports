const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ 
            message: 'Failed to fetch categories',
            error: err.message 
        });
    }
});

// Create a new category (admin only)
router.post('/', auth, async (req, res) => {
    // Input validation
    if (!req.body.name || !req.body.description) {
        return res.status(400).json({ 
            message: 'Name and description are required' 
        });
    }

    // Check if category name already exists
    try {
        const existingCategory = await Category.findOne({ name: req.body.name });
        if (existingCategory) {
            return res.status(400).json({ 
                message: 'Category with this name already exists' 
            });
        }

        const category = new Category({
            name: req.body.name,
            description: req.body.description
        });

        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        console.error('Error creating category:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error',
                error: err.message 
            });
        }
        res.status(500).json({ 
            message: 'Failed to create category',
            error: err.message 
        });
    }
});

module.exports = router; 