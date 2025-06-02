const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product');
        if (!cart) {
            return res.json({ items: [], total: 0 });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: []
            });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        // Calculate total
        cart.total = cart.items.reduce((total, item) => {
            return total + (item.quantity * product.price);
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
        
        // Recalculate total
        const products = await Product.find({ _id: { $in: cart.items.map(item => item.product) } });
        cart.total = cart.items.reduce((total, item) => {
            const product = products.find(p => p._id.toString() === item.product.toString());
            return total + (item.quantity * product.price);
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 