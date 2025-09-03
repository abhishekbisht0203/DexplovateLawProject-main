const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { errorHandler } = require('./middleware/security');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// ✅ Fix CORS
app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true
}));

// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Law Firm Backend is healthy' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// ✅ Add profile route (demo)
app.get('/api/profile', (req, res) => {
  res.json({
    username: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210"
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Law Firm Backend Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
