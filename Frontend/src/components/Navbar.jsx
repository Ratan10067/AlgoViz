import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Code, ChevronDown, BookOpen, Cpu, FileText, LogIn, UserPlus, User, LogOut, Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResponsiveButton from "./ResponsiveButton";
import { useAuth } from "../context/UserContext";

const Navbar = () => {
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
    <nav className="w-full bg-slate-900 border-b border-cyan-500/10 z-50 sticky top-0">
      {/* Increased navbar height with py-4 instead of py-3 */}
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Original Logo and Title - Restored */}
        <div
          className="flex items-center"
          onClick={handleLogoClick}
        >
          {/* Logo with original styling */}
          <div className="flex items-center space-x-2">
            <Code className="text-cyan-400" size={32} />
            <span className="text-white font-bold text-2xl">AlgoViz</span>
          </div>
        </div>
        
        {/* Centered Navigation Items */}
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
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-300 py-2 cursor-pointer"
            >
              <span>Resources</span>
              <ChevronDown size={16} />
            </button>
            {isResourcesDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl z-50">
                <button
                  onClick={() => handleNavigation("/blogs")}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                >
                  <BookOpen size={16} />
                  <span>Blogs</span>
                </button>
                <button
                  onClick={() => handleNavigation("/tutorials")}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                >
                  <FileText size={16} />
                  <span>Tutorials</span>
                </button>
                <button
                  onClick={() => handleNavigation("/cheatsheet")}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                >
                  <Code size={16} />
                  <span>Cheat Sheet</span>
                </button>
                <button
                  onClick={() => handleNavigation("/complexity-guide")}
                  className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                >
                  <Cpu size={16} />
                  <span>Big O Guide</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Authentication Section */}
        <div className="flex items-center">
          {!isAuthenticated ? (
            <ResponsiveButton
              onClick={() => setShowAuthModal(true)}
              variant="primary"
              size="md"
              className="ml-4"
            >
              Get Started
            </ResponsiveButton>
          ) : (
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
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User size={24} className="text-cyan-400" />
                )}
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl z-50">
                  <div className="px-4 py-2 text-gray-300 border-b border-cyan-500/20">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs text-gray-400">Welcome back!</div>
                  </div>
                  <button
                    onClick={handleProfile}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center" ref={mobileMenuRef}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
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
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 px-4 py-2 space-y-2">
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
            <>
              <button
                onClick={handleLogin}
                className="block w-full text-left px-4 py-2 text-cyan-400 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
              >
                Sign In
              </button>
              <button
                onClick={handleRegister}
                className="block w-full text-left px-4 py-2 text-cyan-400 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              <div className="px-4 py-2 text-gray-300 border-b border-cyan-500/20">
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-gray-400">Welcome back!</div>
              </div>
              <button
                onClick={handleProfile}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
      
      {/* Square Auth Modal */}
      {showAuthModal && !isAuthenticated && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur p-4"
          aria-modal="true"
          role="dialog"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="bg-slate-900 rounded-2xl shadow-2xl border border-cyan-500/30 relative flex flex-col justify-center items-center"
            style={{
              width: '320px',
              height: '320px',
              padding: '32px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              aspectRatio: '1/1'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="text-2xl font-bold text-cyan-400 mb-2">Welcome</div>
            <div className="text-gray-300 mb-6 text-center">
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