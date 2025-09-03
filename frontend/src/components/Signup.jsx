import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';

// Use this for local development
const API_BASE_URL = 'http://localhost:5000/api/auth';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    firmName: '',
    firmAddress: '',
    licenseNumber: '',
  });

  const [otp, setOtp] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [validation, setValidation] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // No longer checking for user from AuthContext to prevent errors
  useEffect(() => {
    // Keeping this section for future redirection logic
  }, [navigate]);

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };
  };

  useEffect(() => {
    const password = formData.password;
    if (password) {
      setValidation(validatePassword(password));
    }
  }, [formData.password]);

  const isStep1Valid = () => {
    const { username, email, phoneNumber, password, confirmPassword } = formData;
    const passwordValidation = validatePassword(password);
    return (
      username.trim() !== '' &&
      email.trim() !== '' &&
      phoneNumber.trim() !== '' &&
      Object.values(passwordValidation).every((isValid) => isValid) &&
      password === confirmPassword
    );
  };

  const isStep2Valid = () => {
    const { firmName, firmAddress, licenseNumber } = formData;
    return (
      firmName.trim() !== '' &&
      firmAddress.trim() !== '' &&
      licenseNumber.trim() !== ''
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!isStep1Valid()) {
      setError('Please fill in all fields correctly.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/send-otp`, {
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data.success) {
        setCurrentStep(2);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        ...formData,
        otp: otp,
      });

      if (response.data.success) {
        setCurrentStep(3);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    if (!isStep2Valid()) {
      setError('Please fill in all firm details.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/register/step2`,
        {
          firmName: formData.firmName,
          firmAddress: formData.firmAddress,
          licenseNumber: formData.licenseNumber,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate('/dashboard');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <form className="space-y-4" onSubmit={handleNext}>
      <div>
        <label className="block text-gray-700 font-bold" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="ex. Jane Doe"
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-bold" htmlFor="email">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="ex. sam@email.com"
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-bold" htmlFor="phoneNumber">
          Phone Number
        </label>
        <div className="flex items-center mt-1">
          <span className="bg-gray-200 px-3 py-2 rounded-l-lg border border-gray-300 border-r-0 text-gray-600">
            +91
          </span>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="10 digits"
            className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-700 font-bold" htmlFor="password">
          Password *
        </label>
        <div className="relative mt-1">
          <input
            type={passwordShown ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a strong password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
          />
          <button
            type="button"
            onClick={() => setPasswordShown(!passwordShown)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
          >
            {passwordShown ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <ul className="text-xs mt-2 space-y-1">
          <li className={`flex items-center ${validation.length ? 'text-green-500' : 'text-gray-500'}`}>
            {validation.length ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
            At least 8 characters
          </li>
          <li className={`flex items-center ${validation.uppercase ? 'text-green-500' : 'text-gray-500'}`}>
            {validation.uppercase ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
            One uppercase letter
          </li>
          <li className={`flex items-center ${validation.lowercase ? 'text-green-500' : 'text-gray-500'}`}>
            {validation.lowercase ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
            One lowercase letter
          </li>
          <li className={`flex items-center ${validation.number ? 'text-green-500' : 'text-gray-500'}`}>
            {validation.number ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
            One number
          </li>
          <li className={`flex items-center ${validation.special ? 'text-green-500' : 'text-gray-500'}`}>
            {validation.special ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
            One special character
          </li>
        </ul>
      </div>
      <div>
        <label className="block text-gray-700 font-bold" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <div className="relative mt-1">
          <input
            type={confirmPasswordShown ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
          />
          <button
            type="button"
            onClick={() => setConfirmPasswordShown(!confirmPasswordShown)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
          >
            {confirmPasswordShown ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
        )}
      </div>
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          required
          className="form-checkbox h-4 w-4 text-teal-600 rounded"
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
          I agree to the Terms and Conditions and Privacy Policy
        </label>
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      <button
        type="submit"
        className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        disabled={loading}
      >
        {loading ? 'Sending OTP...' : 'Next Step'}
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form className="space-y-4" onSubmit={handleVerifyOtp}>
      <div>
        <label className="block text-gray-700 font-bold" htmlFor="otp">
          OTP
        </label>
        <input
          type="text"
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          placeholder="123456"
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
        />
        <p className="text-sm text-gray-500 mt-1">A verification code has been sent to your email.</p>
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      <button
        type="submit"
        className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </form>
  );

  const renderStep3 = () => (
    <form className="space-y-4" onSubmit={handleCompleteRegistration}>
      <div>
        <label className="block text-gray-700 font-bold" htmlFor="firmName">
          Law Firm Name
        </label>
        <input
          type="text"
          name="firmName"
          value={formData.firmName}
          onChange={handleChange}
          required
          placeholder="ex. Jane Doe Law Firm"
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-bold" htmlFor="firmAddress">
          Firm Address
        </label>
        <input
          type="text"
          name="firmAddress"
          value={formData.firmAddress}
          onChange={handleChange}
          required
          placeholder="ex. 123 Main Street, Anytown"
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-bold" htmlFor="licenseNumber">
          License Number
        </label>
        <input
          type="text"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleChange}
          required
          placeholder="ex. 5555"
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
        />
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      <button
        type="submit"
        className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        disabled={loading}
      >
        {loading ? 'Completing...' : 'Complete Registration'}
      </button>
    </form>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-gray-200 p-8 m-4">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-teal-600 transition duration-300">
            &larr; Go Back
          </Link>
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-800">D LAw-Firm</h1>
          </div>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Create Account</h2>
          <p className="text-gray-500">Step {currentStep} of 3: {currentStep === 1 ? 'Personal Information' : currentStep === 2 ? 'Verify OTP' : 'Professional Information'}</p>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default Signup;
