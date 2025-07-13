import React, { useState, useRef, useEffect } from "react";
import {
  Code,
  ChevronDown,
  BookOpen,
  Cpu,
  FileText,
  LogIn,
  UserPlus,
  User,
  LogOut,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResponsiveButton from "./ResponsiveButton";
import { useAuth } from "../context/UserContext";

const Navbar = () => {
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Use the auth context instead of local state
  const { user, isAuthenticated, logout } = useAuth();

  const resourcesDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        resourcesDropdownRef.current &&
        !resourcesDropdownRef.current.contains(event.target)
      ) {
        setIsResourcesDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsResourcesDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setShowAuthModal(false);
    navigate("/signin");
  };

  const handleRegister = () => {
    setShowAuthModal(false);
    navigate("/register");
  };

  const handleProfile = () => {
    setShowUserDropdown(false);
    setIsMobileMenuOpen(false);
    navigate("/user-profile");
  };

  const handleLogout = () => {
    // Use the logout function from auth context
    logout();
    setShowUserDropdown(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  // Simulate login - replace this with your actual login logic
  const simulateLogin = () => {
    // setIsLoggedIn(true); // This line is removed as per the new_code
    setShowAuthModal(false);
  };

  return (
    <nav className="relative z-50 container mx-auto px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <button
        className="flex items-center space-x-2 cursor-pointer"
        onClick={handleLogoClick}
      >
        <Code className="w-8 h-8 text-cyan-400" />
        <span className="text-2xl font-bold text-white">AlgoViz</span>
      </button>

      {/* Centered Navigation Items */}
      <div className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2">
        {/* Home Link */}
        <ResponsiveButton
          onClick={() => handleNavigation("/")}
          variant="ghost"
          size="sm"
          icon={<Home className="w-4 h-4" />}
          iconPosition="left"
        >
          Home
        </ResponsiveButton>

        {/* Algorithms Link */}
        <ResponsiveButton
          onClick={() => handleNavigation("/algorithms")}
          variant="ghost"
          size="sm"
          icon={<Cpu className="w-4 h-4" />}
          iconPosition="left"
        >
          Algorithms
        </ResponsiveButton>

        {/* Resources Dropdown */}
        <div className="relative" ref={resourcesDropdownRef}>
          <button
            onClick={() => setIsResourcesDropdownOpen(!isResourcesDropdownOpen)}
            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-300 py-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Resources</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {isResourcesDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-[1000]">
              <button
                onClick={() => handleNavigation("/blogs")}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Blogs</span>
              </button>
              <button
                onClick={() => handleNavigation("/tutorials")}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Tutorials</span>
              </button>
              <button
                onClick={() => handleNavigation("/cheatsheet")}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
              >
                <Code className="w-4 h-4" />
                <span>Cheat Sheet</span>
              </button>
              <button
                onClick={() => handleNavigation("/complexity-guide")}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                <span>Big O Guide</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Section */}
      <div className="flex items-center">
        {!isAuthenticated ? (
          // Show Get Started button when not logged in
          <ResponsiveButton
            onClick={() => setShowAuthModal(true)}
            variant="primary"
            size="md"
            className="ml-4"
          >
            Get Started
          </ResponsiveButton>
        ) : (
          // Show user dropdown when logged in
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="ml-4 flex items-center space-x-2 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300"
              aria-label="User Menu"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-cyan-400"
                />
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-gray-700">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
              )}
              <ChevronDown className="w-4 h-4 text-gray-300" />
            </button>

            {showUserDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-[1000]">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">Welcome back!</p>
                </div>
                <button
                  onClick={handleProfile}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auth Modal - Only for Sign In/Register */}
      {showAuthModal && !isAuthenticated && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
          onClick={() => setShowAuthModal(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-slate-900 rounded-2xl p-8 max-w-xs w-full shadow-2xl border border-cyan-500/30 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-slate-400 hover:text-red-400"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Welcome</h2>
              <p className="text-slate-400 mt-1">
                Sign in or create an account to continue
              </p>
            </div>
            <div className="space-y-4">
              <ResponsiveButton
                onClick={handleLogin}
                variant="primary"
                fullWidth
                size="lg"
                icon={<LogIn className="w-5 h-5" />}
                iconPosition="left"
              >
                Sign In
              </ResponsiveButton>
              <ResponsiveButton
                onClick={handleRegister}
                variant="outline"
                fullWidth
                size="lg"
                icon={<UserPlus className="w-5 h-5" />}
                iconPosition="left"
              >
                Create Account
              </ResponsiveButton>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-full left-0 right-0 bg-gray-800 mt-2 py-2 px-4 rounded-lg shadow-xl border border-gray-700 md:hidden z-50"
        >
          <button
            onClick={() => handleNavigation("/")}
            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
          >
            Home
          </button>
          <button
            onClick={() => handleNavigation("/algorithms")}
            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
          >
            Algorithms
          </button>
          <button
            onClick={() => handleNavigation("/blogs")}
            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
          >
            Blogs
          </button>
          <button
            onClick={() => handleNavigation("/tutorials")}
            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
          >
            Tutorials
          </button>
          <button
            onClick={() => handleNavigation("/cheatsheet")}
            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
          >
            Cheat Sheet
          </button>
          <button
            onClick={() => handleNavigation("/complexity-guide")}
            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
          >
            Big O Guide
          </button>
          {!isAuthenticated ? (
            <div className="mt-4 space-y-2">
              <button
                onClick={handleLogin}
                className="block w-full text-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleRegister}
                className="block w-full text-center px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="mt-4 border-t border-gray-700 pt-4">
              <div className="flex items-center px-4 py-2">
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-cyan-400 mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">Welcome back!</p>
                </div>
              </div>
              <button
                onClick={handleProfile}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-red-400 transition-colors rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;