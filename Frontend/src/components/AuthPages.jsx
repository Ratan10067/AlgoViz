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
const AuthPages = () => {
  const [currentPage, setCurrentPage] = useState("signin"); // 'signin' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [passwordCriteria, setPasswordCriteria] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasMinLength: false,
  });

  const validatePassword = (password) => {
    const criteria = {
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasMinLength: password.length >= 8,
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
      passwordCriteria.hasMinLength
    );
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

  const SignInPage = () => (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        {/* Sign In Form */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Code className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-white">AlgoViz</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all duration-300 group">
              <Chrome className="w-5 h-5 text-red-500" />
              <span className="text-white group-hover:text-cyan-400 transition-colors duration-300">
                Continue with Google
              </span>
            </button>
            <button className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all duration-300 group">
              <Github className="w-5 h-5 text-white" />
              <span className="text-white group-hover:text-cyan-400 transition-colors duration-300">
                Continue with GitHub
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
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
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
              >
                Forgot password?
              </a>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                // Handle sign in logic here
                console.log("Sign in clicked");
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 group"
            >
              <span>Sign In</span>
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => setCurrentPage("register")}
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const RegisterPage = () => (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage("home")}
          className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        {/* Register Form */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Code className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-white">AlgoViz</span>
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
            <button className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all duration-300 group">
              <Chrome className="w-5 h-5 text-red-500" />
              <span className="text-white group-hover:text-cyan-400 transition-colors duration-300">
                Sign up with Google
              </span>
            </button>
            <button className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all duration-300 group">
              <Github className="w-5 h-5 text-white" />
              <span className="text-white group-hover:text-cyan-400 transition-colors duration-300">
                Sign up with GitHub
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">
                Or create with email
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
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
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
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
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
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
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
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
                    Passwords do not match
                  </p>
                )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-700 rounded focus:ring-cyan-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-300">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </span>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                if (
                  isPasswordValid() &&
                  formData.password === formData.confirmPassword
                ) {
                  // Handle registration logic here
                  console.log("Registration clicked");
                }
              }}
              disabled={
                !isPasswordValid() ||
                formData.password !== formData.confirmPassword
              }
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Create Account</span>
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => setCurrentPage("signin")}
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Code className="w-12 h-12 text-cyan-400" />
          <span className="text-4xl font-bold text-white">AlgoViz</span>
        </div>
        <h1 className="text-2xl text-white mb-8">
          Choose an option to continue
        </h1>
        <div className="space-y-4">
          <button
            onClick={() => setCurrentPage("signin")}
            className="block w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
          >
            View Sign In Page
          </button>
          <button
            onClick={() => setCurrentPage("register")}
            className="block w-full px-8 py-4 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-all duration-300"
          >
            View Register Page
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {currentPage === "home" && <HomePage />}
      {currentPage === "signin" && <SignInPage />}
      {currentPage === "register" && <RegisterPage />}
    </>
  );
};

export default AuthPages;
