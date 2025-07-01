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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  // This would typically come from your auth context/state management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  });

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
    // Handle logout logic here (clear tokens, reset state, etc.)
    setIsLoggedIn(false);
    setUser(null);
    setShowUserDropdown(false);
    setIsMobileMenuOpen(false);
    // Optionally redirect to home
    navigate("/");
  };

  // Simulate login - replace this with your actual login logic
  const simulateLogin = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  return (
    <nav className="relative z-50 container mx-auto px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={handleLogoClick}
      >
        <Code className="w-8 h-8 text-cyan-400" />
        <span className="text-2xl font-bold text-white">AlgoViz</span>
      </div>

      {/* Centered Navigation Items */}
      <div className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2">
        {/* Home Link */}
        <button
          onClick={() => handleNavigation("/")}
          className="text-gray-300 hover:text-white transition-colors duration-300 py-2 cursor-pointer"
        >
          Home
        </button>

        {/* Algorithms Link */}
        <button
          onClick={() => handleNavigation("/algorithms")}
          className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-300 py-2 cursor-pointer"
        >
          <Cpu className="w-4 h-4" />
          <span>Algorithms</span>
        </button>

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
        {!isLoggedIn ? (
          // Show Get Started button when not logged in
          <button
            onClick={() => setShowAuthModal(true)}
            className="ml-4 px-6 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl hover:from-cyan-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 active:scale-95"
            aria-label="Get Started"
          >
            Get Started
          </button>
        ) : (
          // Show user dropdown when logged in
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="ml-4 flex items-center space-x-2 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300"
              aria-label="User Menu"
            >
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border-2 border-cyan-400"
              />
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
      {showAuthModal && !isLoggedIn && (
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
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">
              Welcome to AlgoViz
            </h2>
            <div className="flex flex-col space-y-4">
              <button
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold hover:from-cyan-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2"
                onClick={handleLogin}
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
              <button
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center gap-2"
                onClick={handleRegister}
              >
                <UserPlus className="w-5 h-5" />
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center space-x-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-300 hover:text-white p-1"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 z-[1000]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 space-y-4">
            <button
              onClick={() => handleNavigation("/")}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 py-2"
            >
              Home
            </button>

            <button
              onClick={() => handleNavigation("/algorithms")}
              className="flex items-center space-x-2 w-full text-left text-gray-300 hover:text-white transition-colors duration-300 py-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Algorithms</span>
            </button>

            <div className="border-t border-gray-700 pt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                Resources
              </p>
              <button
                onClick={() => handleNavigation("/blogs")}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded"
              >
                <FileText className="w-4 h-4" />
                <span>Blogs</span>
              </button>
              <button
                onClick={() => handleNavigation("/tutorials")}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded"
              >
                <BookOpen className="w-4 h-4" />
                <span>Tutorials</span>
              </button>
              <button
                onClick={() => handleNavigation("/cheatsheet")}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded"
              >
                <Code className="w-4 h-4" />
                <span>Cheat Sheet</span>
              </button>
              <button
                onClick={() => handleNavigation("/complexity-guide")}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded"
              >
                <Cpu className="w-4 h-4" />
                <span>Big O Guide</span>
              </button>
            </div>

            {/* Mobile Authentication Section */}
            <div className="border-t border-gray-700 pt-4">
              {!isLoggedIn ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl hover:from-cyan-700 hover:to-teal-700 transition-all duration-300 shadow-lg"
                  aria-label="Get Started"
                >
                  Get Started
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full border-2 border-cyan-400"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400">Welcome back!</p>
                    </div>
                  </div>
                  <button
                    onClick={handleProfile}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-red-400 transition-colors rounded"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
