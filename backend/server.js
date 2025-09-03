const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { registrationLimiter, generalLimiter, errorHandler } = require('./middleware/security');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Dynamic CORS configuration
const frontendUrl = process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));

// Simple health check routes
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'API is healthy' });
});

// Profile route for session check
app.get('/profile', (req, res) => {
  // This is a placeholder. You'll need to add your actual session/cookie logic here.
  // For now, it will return a generic success message.
  res.status(200).json({ success: true, message: 'Profile route is working' });
});

// Apply security middleware to specific routes
app.use('/api/auth/register/step1', registrationLimiter);
app.use('/api/auth', generalLimiter);

// Main API routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
