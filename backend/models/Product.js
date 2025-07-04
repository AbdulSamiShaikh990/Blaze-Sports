const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory: {
        type: String,
        enum: [
            // Consistent sub-categories for all sports
            'Gear',    // Equipment, balls, rackets, bats, etc.
            'Apparel', // Jerseys, shirts, shorts, shoes, etc.
            
            null // For products without a sub-category
        ]
    },
    image: {
        type: String
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema); 