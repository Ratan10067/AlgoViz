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
  Code,
  Sparkles,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
        const { user: userData, token } = response.data;
        setUser(userData);
        setToken(token);
        setIsAuthenticated(true);

        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("user", JSON.stringify(userData));

        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} signup clicked`);
  };

  const CriteriaItem = ({ met, text }) => (
    <div className={`flex items-center gap-2 transition-all duration-300 ${met ? "text-emerald-400" : "text-slate-400"}`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${met ? "bg-emerald-500 scale-110" : "bg-white/10"}`}>
        {met ? (
          <Check className="w-3 h-3 text-white" />
        ) : (
          <X className="w-3 h-3 text-slate-500" />
        )}
      </div>
      <span className={`text-sm ${met ? "font-semibold" : ""}`}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white transition-all duration-300 border border-white/20 hover:border-white/30 group z-20"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Home</span>
      </button>

      <div className="w-full max-w-6xl relative z-10 grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center space-y-6 px-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg">
              <Code className="w-10 h-10 text-white" />
            </div>
            <span className="text-5xl font-black text-white">
              Algo<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Viz</span>
            </span>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight">
            Start Your Journey to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              Algorithm Mastery
            </span>
          </h2>

          <p className="text-lg text-slate-300 leading-relaxed">
            Join thousands of learners mastering data structures and algorithms through interactive visualizations.
          </p>

          <div className="space-y-4 pt-4">
            {[
              { icon: Shield, text: "100% Free Forever" },
              { icon: Sparkles, text: "Interactive Visualizations" },
              { icon: Check, text: "Track Your Progress" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Form Header */}
            <div className="relative p-8 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-b border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <h1 className="text-3xl font-bold text-white">Create Account</h1>
              </div>
              <p className="text-slate-300">Begin your algorithm learning adventure</p>
            </div>

            {/* Form Body */}
            <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      id="name"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="email"
                      id="email"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`w-full pl-12 pr-12 py-3.5 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-300 ${formData.password
                          ? isPasswordValid()
                            ? "border-emerald-500/50 focus:ring-emerald-500/50 focus:border-emerald-500"
                            : "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                          : "border-white/20 focus:ring-cyan-500/50 focus:border-cyan-500"
                        }`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password criteria */}
                  {formData.password && (
                    <div className="mt-3 p-4 bg-white/5 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <CriteriaItem met={passwordCriteria.hasMinLength} text="8+ characters" />
                      <CriteriaItem met={passwordCriteria.hasUppercase} text="Uppercase letter" />
                      <CriteriaItem met={passwordCriteria.hasLowercase} text="Lowercase letter" />
                      <CriteriaItem met={passwordCriteria.hasNumber} text="Number" />
                      <CriteriaItem met={passwordCriteria.hasSpecialChar} text="Special character" />
                    </div>
                  )}
                </div>

                {/* Confirm Password field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-2">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className={`w-full pl-12 pr-12 py-3.5 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-300 ${formData.confirmPassword
                          ? formData.password === formData.confirmPassword
                            ? "border-emerald-500/50 focus:ring-emerald-500/50 focus:border-emerald-500"
                            : "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                          : "border-white/20 focus:ring-cyan-500/50 focus:border-cyan-500"
                        }`}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password match indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-2">
                      {formData.password === formData.confirmPassword ? (
                        <p className="text-sm text-emerald-400 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Passwords match
                        </p>
                      ) : (
                        <p className="text-sm text-red-400 flex items-center gap-1">
                          <X className="w-4 h-4" /> Passwords don't match
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Terms and conditions */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    id="terms"
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-0"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-slate-300 leading-relaxed">
                    I agree to the{" "}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Sign up button */}
                <button
                  type="submit"
                  disabled={!isFormValid() || isLoading}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-slate-900/50 text-slate-400 text-sm">Or continue with</span>
                </div>
              </div>

              {/* Social login buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSocialLogin("Google")}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300 hover:scale-105"
                >
                  <Chrome className="w-5 h-5" />
                  <span className="font-semibold">Google</span>
                </button>

                <button
                  onClick={() => handleSocialLogin("GitHub")}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300 hover:scale-105"
                >
                  <Github className="w-5 h-5" />
                  <span className="font-semibold">GitHub</span>
                </button>
              </div>

              {/* Sign in link */}
              <div className="mt-8 text-center">
                <p className="text-slate-300">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/signin")}
                    className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
