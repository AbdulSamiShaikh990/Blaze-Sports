const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get featured products
router.get('/featured', async (req, res) => {
    try {
        const products = await Product.find({ featured: true }).populate('category');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get products by category
router.get('/category/:categoryId', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.categoryId }).populate('category');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get products by category and subcategory
router.get('/filter', async (req, res) => {
    try {
        const { categoryId, subCategory } = req.query;
        let query = {};
        
        // Add category filter if provided
        if (categoryId) {
            query.category = categoryId;
        }
        
        // Add subcategory filter if provided
        if (subCategory) {
            query.subCategory = subCategory;
        }
        
        const products = await Product.find(query).populate('category');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get available sub-categories for a specific category
router.get('/subcategories/:categoryName', async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        let subCategories = [];
        
        // All sports have the same consistent sub-categories
        if (categoryName && categoryName !== 'All Products') {
            subCategories = ['Gear', 'Apparel'];
        }
        
        res.json(subCategories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new product (temporarily removed auth for testing)
// Handle both JSON and form data
router.post('/', upload.single('image'), async (req, res) => {
    try {
        console.log('Received product data:', req.body);
        
        // Ensure image path is properly formatted for frontend access
        let imagePath = '';
        if (req.file) {
            imagePath = '/uploads/' + req.file.filename;
        } else if (req.body.image) {
            // If image URL is provided directly in the request
            imagePath = req.body.image;
        }

        const product = new Product({
            name: req.body.name,
            description: req.body.description || 'No description provided',
            price: req.body.price,
            category: req.body.category,
            subCategory: req.body.subCategory || 'Gear',
            image: imagePath,
            stock: req.body.stock || 0,
            featured: req.body.featured === 'true' || req.body.featured === true || false
        });
        
        console.log('Created product object:', product);

        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error saving product:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update a product (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.category = req.body.category || product.category;
        product.subCategory = req.body.subCategory !== undefined ? req.body.subCategory : product.subCategory;
        product.stock = req.body.stock || product.stock;
        product.featured = req.body.featured === 'true' || req.body.featured === true || product.featured;

        if (req.file) {
            // Delete old image file if exists
            if (product.image && product.image.startsWith('/uploads/')) {
                const oldImagePath = path.join('public', product.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            product.image = '/uploads/' + req.file.filename;
        } else if (req.body.image && req.body.image !== product.image) {
            // If image URL is provided directly in the request
            product.image = req.body.image;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a product (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Delete image file if exists
        if (product.image) {
            const imagePath = path.join('public', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await product.remove();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
