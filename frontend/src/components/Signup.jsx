// src/components/Signup.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
    phoneNumber: "",
    firmName: "",
    firmAddress: "",
    licenseNumber: "",
    agreeTerms: false,
  });
  const [validationErrors, setValidationErrors] = useState({});

  const API_BASE_URL = "http://localhost:5000/api/auth";

  useEffect(() => {
    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    };

    const debouncedCheck = debounce(async (name, value) => {
      if (!value) return;

      let endpoint = '';
      if (name === 'email') endpoint = 'check-email';
      else if (name === 'firmName') endpoint = 'check-firm-name';
      else if (name === 'licenseNumber') endpoint = 'check-license';
      
      if (!endpoint) return;

      try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [name]: value }),
        });
        const data = await response.json();
        setValidationErrors((prev) => ({
          ...prev,
          [name]: data.available ? "" : data.message,
        }));
      } catch (error) {
        console.error(`Error checking ${name}:`, error);
      }
    }, 500);

    debouncedCheck('email', formData.email);
    debouncedCheck('firmName', formData.firmName);
    debouncedCheck('licenseNumber', formData.licenseNumber);
  }, [formData.email, formData.firmName, formData.licenseNumber]);

  useEffect(() => {
    const password = formData.password;
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidation(validation);
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (formData.phoneNumber.length !== 10 || !/^\d+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    if (formData.password !== formData.rePassword) {
      errors.rePassword = "Passwords do not match";
    }
    const allPasswordRequirementsMet = Object.values(passwordValidation).every((req) => req);
    if (!allPasswordRequirementsMet) {
      errors.password = "Password must meet all requirements";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register/step1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCurrentStep(2);
      } else {
        setValidationErrors(data.errors || { general: data.message });
      }
    } catch (error) {
      console.error("Registration Step 1 Error:", error);
      setValidationErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = {};
    if (!formData.firmName) errors.firmName = "Firm name is required";
    if (!formData.firmAddress) errors.firmAddress = "Firm address is required";
    if (!formData.licenseNumber) errors.licenseNumber = "License number is required";
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register/step2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firmName: formData.firmName,
          firmAddress: formData.firmAddress,
          licenseNumber: formData.licenseNumber,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentStep(3);
      } else {
        setValidationErrors(data.errors || { general: data.message });
      }
    } catch (error) {
      console.error("Registration Step 2 Error:", error);
      setValidationErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    console.log("Registration complete, redirecting to dashboard...");
  };

  const prevStep = () => {
    if (currentStep === 2) setCurrentStep(1);
  };

  const inputBase =
    "w-full px-4 py-2.5 rounded-md border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
  const labelBase = "text-sm font-medium text-gray-700";
  const errorText = "text-sm text-red-600 mt-1";

  const CardHeader = ({ title, subtitle }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between text-gray-600 mb-4">
        <button
          type="button"
          onClick={() => (currentStep === 1 ? window.history.back() : prevStep())}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">{currentStep === 1 ? "Back" : "Go Back"}</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gray-800 text-white flex items-center justify-center font-bold">
            D
          </div>
          <span className="font-semibold text-gray-800">LaW‑Firm</span>
        </div>
        <div className="w-8" />
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 text-center">{title}</h1>
      {subtitle && (
        <p className="text-sm text-gray-500 text-center mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );

  const renderStep1 = () => (
    <form onSubmit={handleStep1Submit}>
      <CardHeader title="Create Account" subtitle="Step 1 of 2: Personal information" />
      <div className="space-y-4">
        <div>
          <label className={labelBase}>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="ex: Jane Doe"
            className={inputBase}
            required
          />
        </div>
        <div>
          <label className={labelBase}>Email <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ex: sam@email.com"
              className={`${inputBase} pr-9`}
              required
            />
            {validationErrors.email && (
              <AlertCircle className="h-5 w-5 text-red-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
            )}
          </div>
          {validationErrors.email && <p className={errorText}>{validationErrors.email}</p>}
        </div>
        <div>
          <label className={labelBase}>Phone Number</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm">
              +91
            </span>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="10 digits"
              maxLength={10}
              className={`${inputBase} rounded-l-none`}
              required
            />
          </div>
          {validationErrors.phoneNumber && <p className={errorText}>{validationErrors.phoneNumber}</p>}
        </div>
        <div>
          <label className={labelBase}>Password <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              className={`${inputBase} pr-10`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {formData.password && (
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              <li className={`flex items-center gap-1 ${passwordValidation.length ? "text-emerald-600" : ""}`}>
                {passwordValidation.length ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                At least 8 characters
              </li>
              <li className={`flex items-center gap-1 ${passwordValidation.uppercase ? "text-emerald-600" : ""}`}>
                {passwordValidation.uppercase ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                One uppercase letter
              </li>
              <li className={`flex items-center gap-1 ${passwordValidation.lowercase ? "text-emerald-600" : ""}`}>
                {passwordValidation.lowercase ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                One lowercase letter
              </li>
              <li className={`flex items-center gap-1 ${passwordValidation.number ? "text-emerald-600" : ""}`}>
                {passwordValidation.number ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                One number
              </li>
              <li className={`flex items-center gap-1 ${passwordValidation.special ? "text-emerald-600" : ""}`}>
                {passwordValidation.special ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                One special character
              </li>
            </ul>
          )}
          {validationErrors.password && <p className={errorText}>{validationErrors.password}</p>}
        </div>
        <div>
          <label className={labelBase}>Confirm Password</label>
          <div className="relative">
            <input
              type={showRePassword ? "text" : "password"}
              name="rePassword"
              value={formData.rePassword}
              onChange={handleInputChange}
              placeholder="Re-enter your password"
              className={`${inputBase} pr-10`}
              required
            />
            <button
              type="button"
              onClick={() => setShowRePassword((s) => !s)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showRePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {validationErrors.rePassword && <p className={errorText}>{validationErrors.rePassword}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            required
          />
          <label htmlFor="agreeTerms" className="text-sm text-gray-600">
            I agree to the Terms and Conditions and Privacy Policy
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading || !formData.agreeTerms}
          className="w-full rounded-md bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-semibold py-2.5 transition-colors flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          {isLoading ? "Verifying..." : "Create Account"}
        </button>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleStep2Submit}>
      <CardHeader title="Create Account" subtitle="Step 2 of 2: Professional information" />
      <div className="space-y-4">
        <div>
          <label className={labelBase}>Law Firm Name</label>
          <div className="relative">
            <input
              type="text"
              name="firmName"
              value={formData.firmName}
              onChange={handleInputChange}
              placeholder="Enter your law firm name"
              className={`${inputBase} pr-9`}
              required
            />
            {validationErrors.firmName && (
              <AlertCircle className="h-5 w-5 text-red-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
            )}
          </div>
          {validationErrors.firmName && <p className={errorText}>{validationErrors.firmName}</p>}
        </div>
        <div>
          <label className={labelBase}>Firm Address</label>
          <textarea
            name="firmAddress"
            value={formData.firmAddress}
            onChange={handleInputChange}
            placeholder="Enter complete firm address"
            rows={4}
            className={`${inputBase} resize-none`}
            required
          />
        </div>
        <div>
          <label className={labelBase}>License Number</label>
          <div className="relative">
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              placeholder="Enter license number"
              className={`${inputBase} pr-9`}
              required
            />
            {validationErrors.licenseNumber && (
              <AlertCircle className="h-5 w-5 text-red-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
            )}
          </div>
          {validationErrors.licenseNumber && <p className={errorText}>{validationErrors.licenseNumber}</p>}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={isLoading}
            className="flex-1 rounded-md border border-gray-300 bg-white text-gray-700 py-2.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Go Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            {isLoading ? "Completing..." : "Complete Registration"}
          </button>
        </div>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <div>
      <CardHeader title="Registration Complete" />
      <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 flex items-center gap-2">
        <CheckCircle className="h-5 w-5" />
        <p className="text-sm">Your law firm has been successfully registered.</p>
      </div>
      <button
        onClick={handleFinalSubmit}
        className="mt-6 w-full rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5"
      >
        Go to Dashboard
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-gray-200 p-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default Signup;