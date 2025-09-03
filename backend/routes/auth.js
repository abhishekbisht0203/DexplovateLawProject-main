const express = require('express');
const { User } = require('../models/User'); // Ensure your User model is correct
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); // <-- Added for sending emails
const {
  validateRegistrationStep1,
  validateRegistrationStep2,
} = require('../middleware/validation');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// In-memory store for OTPs, for demonstration purposes only.
// In a production app, use a database like Redis.
const otpStore = {};

// ------------------ JWT Middleware ------------------ //
const verifyUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No active session found',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Session invalid or expired',
    });
  }
};

// ------------------ LOGIN ------------------ //
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.getUserByEmail(email.toLowerCase());
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firmName: user.firm_details?.firm_name || null,
        registrationComplete:
          user.firm_details?.registration_status === 'completed',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res
      .status(500)
      .json({ success: false, message: 'An error occurred during login' });
  }
});

// ------------------ PROFILE ------------------ //
router.get('/profile', verifyUser, async (req, res) => {
  try {
    const user = await User.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password_hash, ...userProfile } = user;

    res.json({
      success: true,
      data: { user: userProfile },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error fetching user profile' });
  }
});

// ------------------ SEND OTP ------------------ //
router.post('/send-otp', validateRegistrationStep1, async (req, res) => {
  try {
    const { email } = req.body;

    // Check for existing email and phone number
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    // You'll need to configure a transporter with your email service credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'harishsinghbisht0203@gmail.com', // <-- Updated email
        pass: 'vqqt otjx dkdb tcdh', // <-- Updated with your App Password
      },
    });

    const mailOptions = {
      from: 'harishsinghbisht0203@gmail.com', // Sender address
      to: email, // Recipient address
      subject: 'Your OTP for D Law-Firm Account', // Email subject
      text: `Your One-Time Password (OTP) is: ${otp}. This code is valid for 5 minutes.`, // Plain text body
      html: `<p>Your One-Time Password (OTP) is: <b>${otp}</b></p><p>This code is valid for 5 minutes.</p>`, // HTML body
    };

    await transporter.sendMail(mailOptions);

    console.log(`Sending OTP to ${email}`);

    res.json({
      success: true,
      message: 'OTP sent successfully. Check your email.',
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error sending OTP' });
  }
});

// ------------------ VERIFY OTP AND REGISTER USER ------------------ //
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, ...userData } = req.body;

    if (!otpStore[email] || otpStore[email] !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const user = await User.createUser({
      ...userData,
      email,
      email_verified: true,
    });

    delete otpStore[email];

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'User registered and OTP verified successfully. Continue with firm details.',
      data: {
        token,
        userId: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phone_number,
      },
    });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ success: false, message: 'Error during OTP verification' });
  }
});

// ------------------ STEP 2 REGISTER ------------------ //
router.post(
  '/register/step2',
  verifyUser,
  validateRegistrationStep2,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { firmName, firmAddress, licenseNumber } = req.body;

      const firmNameExists = await User.firmNameExists(firmName, userId);
      if (firmNameExists) {
        return res.status(409).json({
          success: false,
          message: 'Firm name already registered',
        });
      }

      const licenseExists = await User.licenseNumberExists(
        licenseNumber,
        userId
      );
      if (licenseExists) {
        return res.status(409).json({
          success: false,
          message: 'License number already registered',
        });
      }

      const updatedUser = await User.completeFirmRegistration(userId, {
        firmName,
        firmAddress,
        licenseNumber,
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.json({
        success: true,
        message: 'Firm registration completed successfully!',
        data: {
          firmName: updatedUser.firm_details.firm_name,
          registrationStatus: updatedUser.firm_details.registration_status,
        },
      });
    } catch (error) {
      console.error('Step2 Registration Error:', error);
      res
        .status(500)
        .json({ success: false, message: 'Error during firm registration' });
    }
  }
);

// ------------------ AVAILABILITY CHECKERS ------------------ //
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const exists = await User.emailExists(email);
    res.json({
      success: true,
      available: !exists,
    });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ success: false, message: 'Error checking email' });
  }
});

router.post('/check-firm-name', async (req, res) => {
  try {
    const { firmName } = req.body;
    if (!firmName) return res.status(400).json({ success: false, message: 'Firm name required' });

    const exists = await User.firmNameExists(firmName);
    res.json({
      success: true,
      available: !exists,
    });
  } catch (error) {
    console.error('Check firm error:', error);
    res.status(500).json({ success: false, message: 'Error checking firm name' });
  }
});

router.post('/check-license', async (req, res) => {
  try {
    const { licenseNumber } = req.body;
    if (!licenseNumber) return res.status(400).json({ success: false, message: 'License required' });

    const exists = await User.licenseNumberExists(licenseNumber);
    res.json({
      success: true,
      available: !exists,
    });
  } catch (error) {
    console.error('Check license error:', error);
    res.status(500).json({ success: false, message: 'Error checking license' });
  }
});

module.exports = router;
