// backend/middleware/validation.js

// ✅ Step 1 validation: username, email, phone, password
const validateRegistrationStep1 = (req, res, next) => {
  const { username, email, phoneNumber, password } = req.body;

  if (!username || !email || !phoneNumber || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields (username, email, phoneNumber, password) are required in Step 1"
    });
  }

  next();
};

// ✅ Step 2 validation: firmName, firmAddress, licenseNumber
const validateRegistrationStep2 = (req, res, next) => {
  const { firmName, firmAddress, licenseNumber } = req.body;

  if (!firmName || !firmAddress || !licenseNumber) {
    return res.status(400).json({
      success: false,
      message: "All fields (firmName, firmAddress, licenseNumber) are required in Step 2"
    });
  }

  next();
};

// ✅ Export both so they can be used in routes/auth.js
module.exports = {
  validateRegistrationStep1,
  validateRegistrationStep2
};
