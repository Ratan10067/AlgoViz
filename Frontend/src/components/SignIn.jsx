// import React, { useState } from "react";
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   Github,
//   Chrome,
//   ArrowLeft,
//   LogIn,
//   Code,
//   Sparkles,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/UserContext";

// const SignIn = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false,
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { setUser, setIsAuthenticated, setToken } = useAuth();

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await axios.post(
//         "http://localhost:4000/users/login",
//         formData
//       );

//       if (response.status === 200) {
//         const { user, token } = response.data;
//         setUser(user);
//         setToken(token);
//         setIsAuthenticated(true);
//         console.log("yes iufjbhvlie ",user);
//         const storage = formData.rememberMe ? localStorage : sessionStorage;
//         storage.setItem("authToken", token);
//         // storage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("userId", user._id);
//         navigate("/");
//       }
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Invalid credentials. Please check your email and password."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSocialLogin = (provider) => {
//     console.log(`${provider} login clicked`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
//         <div
//           className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
//           style={{ animationDelay: "1s" }}
//         ></div>
//         <div
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"
//           style={{ animationDelay: "2s" }}
//         ></div>
//       </div>

//       {/* Back button */}
//       <button
//         onClick={() => navigate("/")}
//         className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white transition-all duration-300 border border-white/20 hover:border-white/30 group z-20"
//       >
//         <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
//         <span>Back to Home</span>
//       </button>

//       <div className="w-full max-w-6xl relative z-10 grid md:grid-cols-2 gap-8 items-center">
//         {/* Left Side - Branding */}
//         <div className="hidden md:flex flex-col justify-center space-y-6 px-8">
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg">
//               <Code className="w-10 h-10 text-white" />
//             </div>
//             <span className="text-5xl font-black text-white">
//               Algo
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
//                 Viz
//               </span>
//             </span>
//           </div>

//           <h2 className="text-4xl font-bold text-white leading-tight">
//             Welcome Back to Your
//             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
//               Learning Journey
//             </span>
//           </h2>

//           <p className="text-lg text-slate-300 leading-relaxed">
//             Continue mastering algorithms through interactive visualizations and
//             hands-on practice.
//           </p>

//           <div className="flex items-center gap-4 pt-4">
//             <div className="flex -space-x-2">
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-slate-900 flex items-center justify-center text-white font-bold"
//                 >
//                   {i}
//                 </div>
//               ))}
//             </div>
//             <div className="text-slate-300">
//               <p className="font-semibold">10,000+ Active Learners</p>
//               <p className="text-sm text-slate-400">Join the community today</p>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Login Form */}
//         <div className="w-full">
//           <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
//             {/* Form Header */}
//             <div className="relative p-8 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-b border-white/10">
//               <div className="flex items-center gap-3 mb-2">
//                 <Sparkles className="w-6 h-6 text-cyan-400" />
//                 <h1 className="text-3xl font-bold text-white">Sign In</h1>
//               </div>
//               <p className="text-slate-300">
//                 Access your personalized learning dashboard
//               </p>
//             </div>

//             {/* Form Body */}
//             <div className="p-8">
//               {error && (
//                 <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2">
//                   <div className="w-2 h-2 bg-red-400 rounded-full"></div>
//                   {error}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Email field */}
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block text-sm font-semibold text-white mb-2"
//                   >
//                     Email Address
//                   </label>
//                   <div className="relative group">
//                     <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
//                     <input
//                       type="email"
//                       id="email"
//                       className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
//                       placeholder="your@email.com"
//                       value={formData.email}
//                       onChange={(e) =>
//                         handleInputChange("email", e.target.value)
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Password field */}
//                 <div>
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-semibold text-white mb-2"
//                   >
//                     Password
//                   </label>
//                   <div className="relative group">
//                     <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       id="password"
//                       className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
//                       placeholder="••••••••"
//                       value={formData.password}
//                       onChange={(e) =>
//                         handleInputChange("password", e.target.value)
//                       }
//                       required
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Remember me and forgot password */}
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center gap-2">
//                     <input
//                       id="remember-me"
//                       type="checkbox"
//                       className="w-4 h-4 rounded border-white/30 bg-white/10 text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-0"
//                       checked={formData.rememberMe}
//                       onChange={(e) =>
//                         handleInputChange("rememberMe", e.target.checked)
//                       }
//                     />
//                     <label htmlFor="remember-me" className="text-slate-300">
//                       Remember me
//                     </label>
//                   </div>
//                   <a
//                     href="#"
//                     className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
//                   >
//                     Forgot password?
//                   </a>
//                 </div>

//                 {/* Sign in button */}
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
//                   ) : (
//                     <>
//                       <LogIn className="w-5 h-5" />
//                       <span>Sign In</span>
//                     </>
//                   )}
//                 </button>
//               </form>

//               {/* Divider */}
//               <div className="relative my-8">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-white/20"></div>
//                 </div>
//                 <div className="relative flex justify-center">
//                   <span className="px-4 bg-slate-900/50 text-slate-400 text-sm">
//                     Or continue with
//                   </span>
//                 </div>
//               </div>

//               {/* Social login buttons */}
//               <div className="grid grid-cols-2 gap-4">
//                 <button
//                   onClick={() => handleSocialLogin("Google")}
//                   className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300 hover:scale-105"
//                 >
//                   <Chrome className="w-5 h-5" />
//                   <span className="font-semibold">Google</span>
//                 </button>

//                 <button
//                   onClick={() => handleSocialLogin("GitHub")}
//                   className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300 hover:scale-105"
//                 >
//                   <Github className="w-5 h-5" />
//                   <span className="font-semibold">GitHub</span>
//                 </button>
//               </div>

//               {/* Sign up link */}
//               <div className="mt-8 text-center">
//                 <p className="text-slate-300">
//                   Don't have an account?{" "}
//                   <button
//                     onClick={() => navigate("/register")}
//                     className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all"
//                   >
//                     Sign up now
//                   </button>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;

import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Loader2,
  EyeIcon,
  EyeOff,
  ArrowLeft,
  Book,
  Sparkles,
  Brain,
  Star,
  Atom,
} from "lucide-react";
import { AuthContext } from "../context/UserContext";
import { useGoogleLogin } from "@react-oauth/google";
import ChatBot from "./ChatBot";
export default function UserSignIn() {
  const API_BASE_URL = "http://localhost:4000/users";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    github: false,
  });
  const [modal, setModal] = useState({
    open: false,
    success: false,
    message: "",
  });
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/users/login",
        credentials
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id);
        setModal({
          open: true,
          success: true,
          message: "Welcome back! Redirecting to quiz section...",
          icon: "🎉", // Changed from email icon to celebration
        });
        setIsAuthenticated(true);
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setModal({ open: true, success: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/users/forgot-password",
        { email: forgotPasswordEmail }
      );
      if (response.status === 200) {
        setModal({
          open: true,
          success: true,
          message: "Check your inbox! We've sent a password reset link.",
        });
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          setModal({ open: false, success: false, message: "" });
          setShowForgotPassword(false);
          setForgotPasswordEmail("");
        }, 3000);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to send reset email. Please try again.";
      setModal({ open: true, success: false, message: msg });
    } finally {
      setForgotPasswordLoading(false);
    }
  };
  // const googleLogin = useGoogleLogin({
  //   onSuccess: handleGoogleSuccess,
  //   onError: handleGoogleError,
  //   flow: "auth-code", // Changed to auth-code for better security
  //   scope: "email profile",
  // });

  // Google OAuth Success Handler
  async function handleGoogleSuccess(codeResponse) {
    setSocialLoading((prev) => ({ ...prev, google: true }));

    try {
      // Send the authorization code to your backend
      const response = await axios.post(`${API_BASE_URL}/google-auth`, {
        code: codeResponse.code,
      });

      if (response.data.token) {
        // Store authentication data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        setIsAuthenticated(true);

        setModal({
          open: true,
          success: true,
          message: "Google signup successful! Redirecting...",
        });

        setTimeout(() => navigate("/quiz"), 2000);
      }
    } catch (error) {
      console.error("Google OAuth Error:", error);
      setModal({
        open: true,
        success: false,
        message:
          error.response?.data?.message ||
          "Google signup failed. Please try again.",
      });
    } finally {
      setSocialLoading((prev) => ({ ...prev, google: false }));
    }
  }

  // Google OAuth Error Handler
  function handleGoogleError(error) {
    console.error("Google OAuth Error:", error);
    setModal({
      open: true,
      success: false,
      message: "Google signup was cancelled or failed. Please try again.",
    });
  }

  const handleGoogleSignIn = () => {
    googleLogin();
  };

  const closeModal = () =>
    setModal({ open: false, success: false, message: "" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f37] to-[#2c3250] flex items-center justify-center p-4 md:p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl transform rotate-12 opacity-20" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-orange-500/20 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-20" />
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex border border-white/20"
      >
        {/* Left Panel - Interactive Animation */}
        <div className="w-1/2 hidden lg:flex items-center justify-center p-12 relative bg-gradient-to-br from-[#1a1f37]/50 to-[#2c3250]/50">
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-full h-full">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400/20 rounded-full"
                  animate={{
                    x: [0, Math.random() * 400 - 200],
                    y: [0, Math.random() * 400 - 200],
                    scale: [1, Math.random() * 0.5 + 0.5],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Central animated element */}
          <div className="relative z-10">
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative w-72 h-72" // Increased size for better spacing
            >
              {/* Orbital rings with gradient */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(45deg, rgba(234, 179, 8, 0.2), rgba(234, 88, 12, 0.2))",
                  border: "4px solid transparent",
                  backgroundClip: "padding-box",
                }}
                // animate={{ rotate: 360 }}
                // transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-12 rounded-full"
                style={{
                  background:
                    "linear-gradient(-45deg, rgba(234, 179, 8, 0.15), rgba(234, 88, 12, 0.15))",
                  border: "4px solid transparent",
                  backgroundClip: "padding-box",
                }}
                />

              {/* Central brain icon with enhanced gradient */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-orange-600 p-8 rounded-full shadow-lg shadow-orange-500/30">
                  <Brain className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              {/* Orbiting icons with calculated positions */}
              {[
                { Icon: Book, color: "from-blue-400 to-blue-500", delay: 0 },
                {
                  Icon: Star,
                  color: "from-purple-400 to-purple-500",
                  delay: 2,
                },
                {
                  Icon: Sparkles,
                  color: "from-yellow-400 to-yellow-500",
                  delay: 4,
                },
                { Icon: Atom, color: "from-green-400 to-green-500", delay: 6 },
              ].map(({ Icon, color, delay }, index) => {
                const angle = (index * Math.PI * 2) / 4; // Evenly space icons
                const radius = 120; // Distance from center
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={index}
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "50%",
                      x: x,
                      y: y,
                    }}
                  >
                    <motion.div
                      className={`bg-gradient-to-r ${color} p-3 rounded-xl shadow-lg backdrop-blur-sm`}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Enhanced welcome text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12 space-y-3"
            >
              <div className="inline-block p-1 px-3 rounded-full bg-yellow-400/10 border border-yellow-400/20">
                <span className="text-yellow-400 text-sm">Welcome Back</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                AlgoViz Learning
              </h3>
              <p className="text-gray-400 text-sm max-w-[250px] mx-auto">
                Your journey to knowledge continues here
              </p>
            </motion.div>
          </div>
        </div>
        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <AnimatePresence mode="wait">
            {!showForgotPassword ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-300 mb-8">
                  Continue your learning journey with BrainQuest
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div className="relative group">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 
                                   group-focus-within:text-yellow-400 transition-colors"
                      size={20}
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 
                               rounded-xl text-white placeholder-gray-400 focus:outline-none 
                               focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 
                               transition-all"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative group">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 
                                   group-focus-within:text-yellow-400 transition-colors"
                      size={20}
                    />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 
                               rounded-xl text-white placeholder-gray-400 focus:outline-none 
                               focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 
                               transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                               hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <EyeIcon size={20} />
                      )}
                    </button>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 
                             to-orange-500 text-[#1a1f37] font-semibold flex items-center 
                             justify-center space-x-2 hover:shadow-lg hover:shadow-yellow-500/25 
                             transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                  <div className="flex-1 border-t border-white/20"></div>
                  <span className="px-4 text-gray-400 text-sm">OR</span>
                  <div className="flex-1 border-t border-white/20"></div>
                </div>

                {/* Google Sign In Button */}
                <div className="space-y-4">
                  <motion.button
                    onClick={handleGoogleSignIn}
                    disabled={socialLoading.google || socialLoading.github}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 
                                 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center 
                                 space-x-3 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {socialLoading.google ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        <span>Signing up with Google...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    Don't have an account?{" "}
                    <NavLink
                      to="/register"
                      className="text-yellow-400 hover:text-yellow-300 
                                                   transition-colors"
                    >
                      Sign Up
                    </NavLink>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors mb-4 cursor-pointer"
                  >
                    <ArrowLeft size={20} />
                    <span>Back to Sign In</span>
                  </button>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-gray-300">
                    Enter your email address and we'll send you a reset link
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-6">
                  {/* Email Input */}
                  <div className="relative group">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 
                                   group-focus-within:text-yellow-400 transition-colors"
                      size={20}
                    />
                    <input
                      name="forgotPasswordEmail"
                      type="email"
                      required
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 
                               rounded-xl text-white placeholder-gray-400 focus:outline-none 
                               focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 
                               transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 
                             to-orange-500 text-[#1a1f37] font-semibold flex items-center 
                             justify-center space-x-2 hover:shadow-lg hover:shadow-yellow-500/25 
                             transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {forgotPasswordLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Sending Reset Link...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-6 border border-green-600"
            >
              <div className="text-6xl mb-3 flex justify-center">
                {modal.success ? "🎉" : "⚠️"}
              </div>

              <p className="text-gray-300 text-center mb-6 px-2">
                {modal.message}
              </p>

              {!modal.success && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-medium hover:shadow-lg hover:shadow-green-600/30 transition-all cursor-pointer"
                >
                  Try Again
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ChatBot />
    </div>
  );
}
