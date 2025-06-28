import React, { useState } from "react";
import {
  Code,
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
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      console.log("Registration data:", formData);
      // Here you would typically send the data to your backend
      alert("Account created successfully!");
    } else {
      alert("Please fill out all fields correctly and agree to the terms.");
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} signup clicked`);
    // Here you would typically implement OAuth login
    alert(`Redirecting to ${provider} authentication...`);
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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Home</span>
        </button>

        {/* Register Form */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AlgoViz
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Create Account
              </h1>
              <p className="text-gray-400">
                Join thousands of algorithm enthusiasts
              </p>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-all duration-300 group backdrop-blur-sm"
              >
                <Chrome className="w-5 h-5 text-red-500" />
                <span className="text-white group-hover:text-purple-400 transition-colors duration-300">
                  Sign up with Google
                </span>
              </button>
              <button
                onClick={() => handleSocialLogin("GitHub")}
                className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-all duration-300 group backdrop-blur-sm"
              >
                <Github className="w-5 h-5 text-white" />
                <span className="text-white group-hover:text-purple-400 transition-colors duration-300">
                  Sign up with GitHub
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/80 text-gray-400 backdrop-blur-sm">
                  Or create with email
                </span>
              </div>
            </div>

            {/* Registration Fields */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Criteria */}
                {formData.password && (
                  <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 backdrop-blur-sm">
                    <p className="text-sm text-gray-300 mb-2">
                      Password must contain:
                    </p>
                    <div className="space-y-1">
                      <CriteriaItem
                        met={passwordCriteria.hasUppercase}
                        text="At least one uppercase letter"
                      />
                      <CriteriaItem
                        met={passwordCriteria.hasLowercase}
                        text="At least one lowercase letter"
                      />
                      <CriteriaItem
                        met={passwordCriteria.hasMinLength}
                        text="At least 8 characters"
                      />
                      <CriteriaItem
                        met={passwordCriteria.hasNumber}
                        text="At least one number"
                      />
                      <CriteriaItem
                        met={passwordCriteria.hasSpecialChar}
                        text="At least one special character"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      Passwords don't match
                    </p>
                  )}
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    handleInputChange("agreeToTerms", e.target.checked)
                  }
                  className="mt-1 w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-300">
                  I agree to the{" "}
                  <a href="#" className="text-purple-400 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-400 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isFormValid()
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/30"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Zap className="w-5 h-5" />
                <span>Create Account</span>
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-purple-400 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
