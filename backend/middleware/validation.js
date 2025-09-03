// Registration validation middleware

// Step 1: Basic user details
const validateRegistrationStep1 = (req, res, next) => {
    let { username, email, phoneNumber, password, confirmPassword } = req.body;
    const errors = {};

    // Trim inputs
    username = username?.trim();
    email = email?.trim();
    phoneNumber = phoneNumber?.trim();

    // Username validation
    if (!username || username.length < 3) {
        errors.username = 'Username must be at least 3 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.email = 'Please provide a valid email address';
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
        errors.phoneNumber = 'Please provide a valid 10-digit phone number';
    }

    // Password validation
    const passwordErrors = [];
    if (!password || password.length < 8) {
        passwordErrors.push('at least 8 characters long');
    } else {
        if (!/[A-Z]/.test(password)) passwordErrors.push('one uppercase letter');
        if (!/[a-z]/.test(password)) passwordErrors.push('one lowercase letter');
        if (!/[0-9]/.test(password)) passwordErrors.push('one number');
        if (!/[!@#$%^&*]/.test(password)) passwordErrors.push('one special character (!@#$%^&*)');
    }
    if (passwordErrors.length > 0) {
        errors.password = `Password must contain ${passwordErrors.join(', ')}`;
    }

    // Confirm password
    if (!confirmPassword) {
        console.log(password)
        errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    // Return errors if any
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

// Step 2: Firm details validation
const validateRegistrationStep2 = (req, res, next) => {
    const { firmName, firmAddress, licenseNumber } = req.body;
    const errors = {};

    // Firm name validation
    if (!firmName || firmName.trim().length < 3) {
        errors.firmName = 'Firm name must be at least 3 characters long';
    }

    // Firm address validation
    if (!firmAddress || firmAddress.trim().length < 10) {
        errors.firmAddress = 'Please provide a complete firm address (at least 10 characters)';
    }

    // License number validation
    if (!licenseNumber || licenseNumber.trim().length < 5) {
        errors.licenseNumber = 'Please provide a valid license number (min 5 characters)';
    }

    // If any errors exist, the middleware returns a 400 response.
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    // If no errors, the request proceeds.
    next();
};

module.exports = {
    validateRegistrationStep1,
    validateRegistrationStep2
};