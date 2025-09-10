const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Middleware to verify a user's JWT token.
 * Attaches user data to the request if the token is valid.
 */
const verifyUser = (req, res, next) => {
    // Check for the JWT token in the 'token' cookie or Authorization header
    const token = req.cookies.token;

    if (!token) {
        // No token, user is not authenticated
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the decoded user payload to the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        // Token is invalid or expired
        console.error('JWT verification failed:', err.message);
        return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
    }
};

module.exports = verifyUser;
