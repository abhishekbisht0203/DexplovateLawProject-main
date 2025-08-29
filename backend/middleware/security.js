const rateLimit = require('express-rate-limit');

// Rate limiting for registration endpoints
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 registration requests per windowMs
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for general API endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  // Database connection errors
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed'
    });
  }

  // PostgreSQL unique constraint violations
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Data already exists'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};

module.exports = {
  registrationLimiter,
  generalLimiter,
  errorHandler
};