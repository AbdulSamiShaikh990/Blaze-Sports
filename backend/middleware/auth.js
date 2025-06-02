const admin = require('../config/firebaseAdmin');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // Extract token from header
        const token = authHeader.split(' ')[1];

        // Verify Firebase token
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Get user from MongoDB using Firebase UID
        const user = await User.findOne({ firebaseUid: decodedToken.uid });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found in database' });
        }
        
        // Add user data to request object
        req.user = {
            id: user._id,
            email: user.email,
            userType: user.userType,
            firebaseUid: decodedToken.uid
        };
        
        // Continue to next middleware
        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }
};

module.exports = auth;
