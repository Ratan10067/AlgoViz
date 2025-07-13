import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Github,
  Chrome,
  ArrowLeft,
  LogIn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ResponsiveButton from "./ResponsiveButton";
import { useAuth } from "../context/UserContext";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated, setToken } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Sending login request with data:", formData);
      const response = await axios.post(
        "http://localhost:3000/users/login",
        formData
      );
      
      console.log("Login response:", response);
      
      if (response.status === 200) {
        // Set the user data in auth context
        const { user: userData, token } = response.data;
        console.log("User data from response:", userData);
        console.log("Token from response:", token);
        
        setUser(userData);
        setToken(token);
        setIsAuthenticated(true);
        
        // Store in appropriate storage based on remember me
        const storage = formData.rememberMe ? localStorage : sessionStorage;
        storage.setItem("authToken", token);
        storage.setItem("user", JSON.stringify(userData));
        
        console.log("Authentication successful, navigating to home");
        // Navigate to home page
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      setError(error.response?.data?.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Handle social login
    console.log(`${provider} login clicked`);
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
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
          <div className="relative h-24 bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden">
              {/* Header decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-white relative z-10">Welcome Back</h1>
          </div>

          {/* Card body */}
          <div className="p-6">
            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
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
                    className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
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
              </div>

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/50"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      handleInputChange("rememberMe", e.target.checked)
                    }
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Sign in button */}
              <ResponsiveButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                icon={<LogIn className="w-5 h-5" />}
                iconPosition="left"
              >
                Sign In
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
              Don't have an account?{" "}
              <button
                onClick={handleSignUp}
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign up now
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
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SignIn;
