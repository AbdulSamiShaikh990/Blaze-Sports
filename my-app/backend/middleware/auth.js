const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        // Headers lowercase hotay hain Node.js mein
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // "Bearer tokenstring" se token nikalna
        const token = authHeader.split(' ')[1];

        // Token verify karna with secret, no fallback to hardcoded string
        const secret = process.env.JWT_SECRET;
        const verified = jwt.verify(token, secret);

        // Verified user data ko req object mein daalna taake agla middleware use kar sake
        req.user = verified;

        // Next middleware ya route handler chalu karna
        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }
};

module.exports = auth;
