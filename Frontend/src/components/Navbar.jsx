import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Code, ChevronDown, BookOpen, Cpu, FileText, LogIn, UserPlus, User, LogOut, Home, Sun, Moon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResponsiveButton from "./ResponsiveButton";
import { useAuth } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  const resourcesDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

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
    logout();
    setShowUserDropdown(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className={`w-full z-50 sticky top-0 border-b transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900 border-cyan-500/10' : 'bg-white/95 backdrop-blur-sm border-gray-200 shadow-sm'}`}>
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
          <div className="flex items-center space-x-2">
            <Code className="text-cyan-400" size={32} />
            <span className={`font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AlgoViz</span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <ResponsiveButton
            onClick={() => handleNavigation("/")}
            variant="ghost"
            size="sm"
            icon={<Home size={18} />}
            iconPosition="left"
          >
            Home
          </ResponsiveButton>
          <ResponsiveButton
            onClick={() => handleNavigation("/algorithms")}
            variant="ghost"
            size="sm"
            icon={<Cpu size={18} />}
            iconPosition="left"
          >
            Algorithms
          </ResponsiveButton>
          <div className="relative" ref={resourcesDropdownRef}>
            <button
              onClick={() => setIsResourcesDropdownOpen(!isResourcesDropdownOpen)}
              className={`flex items-center space-x-1 transition-colors duration-300 py-2 cursor-pointer ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <span>Resources</span>
              <ChevronDown size={16} />
            </button>
            {isResourcesDropdownOpen && (
              <div className={`absolute left-0 mt-2 w-48 rounded-lg shadow-xl z-50 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border border-gray-200'}`}>
                <button
                  onClick={() => handleNavigation("/blogs")}
                  className={`flex items-center space-x-2 w-full text-left px-4 py-2 transition-colors cursor-pointer ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  <BookOpen size={16} />
                  <span>Blogs</span>
                </button>
                <button
                  onClick={() => handleNavigation("/tutorials")}
                  className={`flex items-center space-x-2 w-full text-left px-4 py-2 transition-colors cursor-pointer ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  <FileText size={16} />
                  <span>Tutorials</span>
                </button>
                <button
                  onClick={() => handleNavigation("/cheatsheet")}
                  className={`flex items-center space-x-2 w-full text-left px-4 py-2 transition-colors cursor-pointer ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  <Code size={16} />
                  <span>Cheat Sheet</span>
                </button>
                <button
                  onClick={() => handleNavigation("/complexity-guide")}
                  className={`flex items-center space-x-2 w-full text-left px-4 py-2 transition-colors cursor-pointer ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  <Cpu size={16} />
                  <span>Big O Guide</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right side - Theme Toggle + Auth */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle - Icon Only and Responsive */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center shadow-sm ${theme === 'dark' ? 'bg-slate-800 text-yellow-400 border-white/20 hover:bg-slate-700' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:shadow-md'}`}
            aria-label="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="animate-pulse" />
            ) : (
              <Moon size={20} className="animate-pulse" />
            )}
          </button>
          
          {/* Auth Section */}
          {!isAuthenticated ? (
            <ResponsiveButton
              onClick={() => setShowAuthModal(true)}
              variant="primary"
              size="md"
            >
              Get Started
            </ResponsiveButton>
          ) : (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center space-x-2 p-2 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                aria-label="User Menu"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User size={24} className="text-cyan-400" />
                )}
              </button>
              {showUserDropdown && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border border-gray-200'}`}>
                  <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'text-gray-300 border-cyan-500/20' : 'text-gray-700 border-gray-200'}`}>
                    <div className="font-semibold">{user.name}</div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Welcome back!</div>
                  </div>
                  <button
                    onClick={handleProfile}
                    className={`flex items-center space-x-2 w-full text-left px-4 py-2 transition-colors cursor-pointer ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-cyan-600'}`}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 w-full text-left px-4 py-2 transition-colors cursor-pointer ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-cyan-600'}`}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <div className="md:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg focus:outline-none ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg width="24" height="24" fill="none" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t px-4 py-2 space-y-1 ${theme === 'dark' ? 'bg-slate-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <button
            onClick={() => handleNavigation("/")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigation("/algorithms")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
          >
            Algorithms
          </button>
          <button
            onClick={() => handleNavigation("/blogs")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
          >
            Blogs
          </button>
          <button
            onClick={() => handleNavigation("/tutorials")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
          >
            Tutorials
          </button>
          <button
            onClick={() => handleNavigation("/cheatsheet")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
          >
            Cheat Sheet
          </button>
          <button
            onClick={() => handleNavigation("/complexity-guide")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
          >
            Big O Guide
          </button>
          
          {/* Mobile Auth Section */}
          <div className={`border-t pt-2 mt-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleLogin}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${theme === 'dark' ? 'text-cyan-400 hover:bg-gray-700 hover:text-cyan-300' : 'text-cyan-600 hover:bg-gray-200 hover:text-cyan-700'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={handleRegister}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${theme === 'dark' ? 'text-cyan-400 hover:bg-gray-700 hover:text-cyan-300' : 'text-cyan-600 hover:bg-gray-200 hover:text-cyan-700'}`}
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                <div className={`px-3 py-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="font-semibold">{user.name}</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Welcome back!</div>
                </div>
                <button
                  onClick={handleProfile}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && !isAuthenticated && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur p-4"
          aria-modal="true"
          role="dialog"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className={`rounded-2xl shadow-2xl border relative flex flex-col justify-center items-center p-8 max-w-sm w-full ${theme === 'dark' ? 'bg-slate-900 border-cyan-500/30' : 'bg-white border-gray-200'}`}
            onClick={e => e.stopPropagation()}
          >
            <button
              className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              onClick={() => setShowAuthModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>Welcome</div>
            <div className={`mb-6 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Sign in or create an account to continue
            </div>
            <ResponsiveButton
              onClick={handleLogin}
              variant="primary"
              size="lg"
              icon={<LogIn size={18} />}
              iconPosition="left"
              className="mb-3 w-full"
            >
              Sign In
            </ResponsiveButton>
            <ResponsiveButton
              onClick={handleRegister}
              variant="secondary"
              size="lg"
              icon={<UserPlus size={18} />}
              iconPosition="left"
              className="w-full"
            >
              Create Account
            </ResponsiveButton>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
