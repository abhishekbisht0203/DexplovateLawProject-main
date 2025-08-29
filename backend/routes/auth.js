const express = require('express');
const User = require('../models/User'); 
const { validateRegistrationStep1, validateRegistrationStep2 } = require('../middleware/validation');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Middleware to verify JWT token from Authorization header or cookie
const verifyUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
};

// ------------------ AUTH ROUTES ------------------ //

// Step 1: Register user with personal information
router.post('/register/step1', validateRegistrationStep1, async (req, res) => {
    try {
        const userData = {
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password
        };

        const user = await User.createUser(userData);

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please complete your firm information.',
            data: {
                userId: user.id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phone_number,
                emailVerified: user.email_verified
            }
        });
    } catch (error) {
        console.error('Registration Step 1 Error:', error);

        if (error.message === 'Email already registered') {
            return res.status(409).json({
                success: false,
                message: 'Email already registered',
                errors: [{ field: 'email', message: 'This email is already registered' }]
            });
        }

        if (error.message === 'Phone number already registered') {
            return res.status(409).json({
                success: false,
                message: 'Phone number already registered',
                errors: [{ field: 'phoneNumber', message: 'This phone number is already registered' }]
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
});

// Step 2: Complete registration with firm information
router.post('/register/step2', validateRegistrationStep2, async (req, res) => {
    try {
        const { userId } = req.body;
        const firmData = {
            firmName: req.body.firmName,
            firmAddress: req.body.firmAddress,
            licenseNumber: req.body.licenseNumber
        };

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required to complete registration'
            });
        }

        const firm = await User.completeFirmRegistration(userId, firmData);

        res.status(201).json({
            success: true,
            message: 'Law firm registration completed successfully!',
            data: {
                firmId: firm.id,
                firmName: firm.firm_name,
                registrationStatus: firm.registration_status
            }
        });
    } catch (error) {
        console.error('Registration Step 2 Error:', error);

        if (error.message === 'Firm name already registered') {
            return res.status(409).json({
                success: false,
                message: 'Firm name already registered',
                errors: [{ field: 'firmName', message: 'This firm name is already registered' }]
            });
        }

        if (error.message === 'License number already registered') {
            return res.status(409).json({
                success: false,
                message: 'License number already registered',
                errors: [{ field: 'licenseNumber', message: 'This license number is already registered' }]
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during firm registration'
        });
    }
});

// Check email availability
router.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const exists = await User.emailExists(email);
        
        res.json({
            success: true,
            available: !exists,
            message: exists ? 'Email already registered' : 'Email available'
        });
    } catch (error) {
        console.error('Check email error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking email availability'
        });
    }
});

// Check firm name availability
router.post('/check-firm-name', async (req, res) => {
    try {
        const { firmName } = req.body;
        
        if (!firmName) {
            return res.status(400).json({
                success: false,
                message: 'Firm name is required'
            });
        }

        const exists = await User.firmNameExists(firmName);
        
        res.json({
            success: true,
            available: !exists,
            message: exists ? 'Firm name already registered' : 'Firm name available'
        });
    } catch (error) {
        console.error('Check firm name error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking firm name availability'
        });
    }
});

// Check license number availability
router.post('/check-license', async (req, res) => {
    try {
        const { licenseNumber } = req.body;
        
        if (!licenseNumber) {
            return res.status(400).json({
                success: false,
                message: 'License number is required'
            });
        }

        const exists = await User.licenseNumberExists(licenseNumber);
        
        res.json({
            success: true,
            available: !exists,
            message: exists ? 'License number already registered' : 'License number available'
        });
    } catch (error) {
        console.error('Check license number error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking license number availability'
        });
    }
});

// ------------------ PROFILE ROUTES ------------------ //

// Profile by ID (optional usage)
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.getUserById(userId); 

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { password_hash, ...userProfile } = user;
        
        res.json({
            success: true,
            data: userProfile
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving user profile'
        });
    }
});

// ✅ New: Logged-in user profile (matches frontend call)
router.get('/profile', verifyUser, async (req, res) => {
  console.log('Fetching profile for user ID:', req.user.id);
    try {
        const user = await User.getUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { password_hash, ...userProfile } = user;

        res.json({
            success: true,
            user: userProfile
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving profile'
        });
    }
});

module.exports = router;
