import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Github,
  Chrome,
  ArrowLeft,
  Check,
  X,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ResponsiveButton from "./ResponsiveButton";
import { useAuth } from "../context/UserContext";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated, setToken } = useAuth();
  
  const [passwordCriteria, setPasswordCriteria] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasMinLength: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePassword = (password) => {
    const criteria = {
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasMinLength: password.length >= 8,
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordCriteria(criteria);
    return criteria;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");

    if (field === "password") {
      validatePassword(value);
    }
  };

  const isPasswordValid = () => {
    return (
      passwordCriteria.hasUppercase &&
      passwordCriteria.hasLowercase &&
      passwordCriteria.hasMinLength &&
      passwordCriteria.hasNumber &&
      passwordCriteria.hasSpecialChar
    );
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      isPasswordValid() &&
      formData.password === formData.confirmPassword &&
      formData.agreeToTerms
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError("Please fill all fields correctly");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post(
        "http://localhost:3000/users/register",
        formData
      );
      
      if (response.status === 201) {
        // Set the user data in auth context
        const { user: userData, token } = response.data;
        setUser(userData);
        setToken(token);
        setIsAuthenticated(true);
        
        // Store in session storage
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("user", JSON.stringify(userData));
        
        // Navigate to home page
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} signup clicked`);
  };

  const CriteriaItem = ({ met, text }) => (
    <div
      className={`flex items-center space-x-2 transition-all duration-300 ${
        met ? "text-green-400" : "text-gray-500"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
          met ? "bg-green-500 scale-110" : "bg-gray-700"
        }`}
      >
        {met ? (
          <Check className="w-2.5 h-2.5 text-white" />
        ) : (
          <X className="w-2.5 h-2.5 text-gray-400" />
        )}
      </div>
      <span
        className={`text-sm transition-all duration-300 ${
          met ? "font-medium" : ""
        }`}
      >
        {text}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated circles */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Back button */}
        <ResponsiveButton
          onClick={() => navigate("/")}
          className="mb-8"
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          iconPosition="left"
        >
          Back to Home
        </ResponsiveButton>

        {/* Main card */}
        <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Card header */}
          <div className="relative h-24 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden">
              {/* Header decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-white relative z-10">Create Your Account</h1>
          </div>

          {/* Card body */}
          <div className="p-6">
            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Registration form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field */}
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formData.password
                        ? isPasswordValid()
                          ? "border-green-500/50 focus:ring-green-500/50 focus:border-green-500/50"
                          : "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                        : "border-gray-600/50 focus:ring-purple-500/50 focus:border-purple-500/50"
                    }`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password criteria */}
                {formData.password && (
                  <div className="mt-3 p-3 bg-gray-800/50 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <CriteriaItem
                      met={passwordCriteria.hasMinLength}
                      text="At least 8 characters"
                    />
                    <CriteriaItem
                      met={passwordCriteria.hasUppercase}
                      text="One uppercase letter"
                    />
                    <CriteriaItem
                      met={passwordCriteria.hasLowercase}
                      text="One lowercase letter"
                    />
                    <CriteriaItem
                      met={passwordCriteria.hasNumber}
                      text="One number"
                    />
                    <CriteriaItem
                      met={passwordCriteria.hasSpecialChar}
                      text="One special character"
                    />
                  </div>
                )}
              </div>

              {/* Confirm Password field */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formData.confirmPassword
                        ? formData.password === formData.confirmPassword
                          ? "border-green-500/50 focus:ring-green-500/50 focus:border-green-500/50"
                          : "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                        : "border-gray-600/50 focus:ring-purple-500/50 focus:border-purple-500/50"
                    }`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password match indicator */}
                {formData.confirmPassword && (
                  <div className="mt-1 ml-1">
                    {formData.password === formData.confirmPassword ? (
                      <p className="text-xs text-green-400 flex items-center">
                        <Check className="w-3 h-3 mr-1" /> Passwords match
                      </p>
                    ) : (
                      <p className="text-xs text-red-400 flex items-center">
                        <X className="w-3 h-3 mr-1" /> Passwords don't match
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Terms and conditions */}
              <div className="flex items-start space-x-3 mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500/50"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                    required
                  />
                </div>
                <label htmlFor="terms" className="text-sm text-gray-300">
                  I agree to the{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-300">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-300">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Sign up button */}
              <ResponsiveButton
                type="submit"
                variant="secondary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                icon={<UserPlus className="w-5 h-5" />}
                iconPosition="left"
                disabled={!isFormValid()}
              >
                Create Account
              </ResponsiveButton>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800/40 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-4">
              <ResponsiveButton
                onClick={() => handleSocialLogin("Google")}
                variant="outline"
                size="md"
                icon={<Chrome className="w-5 h-5 text-red-400" />}
                iconPosition="left"
              >
                Google
              </ResponsiveButton>
              
              <ResponsiveButton
                onClick={() => handleSocialLogin("GitHub")}
                variant="outline"
                size="md"
                icon={<Github className="w-5 h-5 text-white" />}
                iconPosition="left"
              >
                GitHub
              </ResponsiveButton>
            </div>
          </div>

          {/* Card footer */}
          <div className="p-6 bg-gray-900/50 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Add CSS for grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default SignUp;
