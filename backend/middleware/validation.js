// Registration validation middleware

// Step 1: Basic user details
const validateRegistrationStep1 = (req, res, next) => {
    const { username, email, phoneNumber, password, rePassword } = req.body;
    const errors = {};

    // Username validation: Checks for existence and minimum length.
    if (!username || username.trim().length < 3) {
        errors.username = 'Username must be at least 3 characters long';
    }

    // Email validation: Uses a regular expression to check for a valid format.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
        errors.email = 'Please provide a valid email address';
    }

    // Phone number validation: Checks for exactly 10 digits.
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber.trim())) {
        errors.phoneNumber = 'Please provide a valid 10-digit phone number';
    }

    // Password validation: Checks for length, uppercase, lowercase, number, and special character.
    const passwordErrors = [];
    if (!password || password.length < 8) passwordErrors.push('at least 8 characters long');
    if (!/[A-Z]/.test(password)) passwordErrors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) passwordErrors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) passwordErrors.push('one number');
    if (!/[!@#$%^&*]/.test(password)) passwordErrors.push('one special character (!@#$%^&*)');

    if (passwordErrors.length > 0) {
        errors.password = `Password must contain ${passwordErrors.join(', ')}`;
    }

    // Password confirmation: This is the key check. It confirms if the two password fields match.
    // If they do not match, it adds the "Passwords do not match" error.
    if (password !== rePassword) {
        errors.rePassword = 'Passwords do not match';
    }

    // If any errors were found, the middleware stops the request and sends a 400 response.
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    // If there are no errors, the `next()` function is called to continue to the next middleware or route handler.
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
