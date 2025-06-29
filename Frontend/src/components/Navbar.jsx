import React, { useState, useRef, useEffect } from "react";
import {
  Code,
  User,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  BookOpen,
  Cpu,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userDropdownRef = useRef(null);
  const resourcesDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  // Simulate navigation - replace with your actual navigation logic
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        resourcesDropdownRef.current &&
        !resourcesDropdownRef.current.contains(event.target)
      ) {
        setIsResourcesDropdownOpen(false);
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

  const handleLogin = () => {
    setIsUserDropdownOpen(false);
    navigate("/signin");
  };

  const handleRegister = () => {
    setIsUserDropdownOpen(false);
    navigate("/register");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserDropdownOpen(false);
  };

  const handleProfile = () => {
    setIsUserDropdownOpen(false);
    navigate("/profile");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsResourcesDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="relative z-50 container mx-auto px-6 py-4 flex justify-between items-center">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={handleLogoClick}
      >
        <Code className="w-8 h-8 text-cyan-400" />
        <span className="text-2xl font-bold text-white">AlgoViz</span>
      </div>

      {/* Right Side Navigation Items */}
      <div className="hidden md:flex items-center space-x-6">
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

      {/* Mobile Menu Button and User Icon */}
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
        {/* User Icon for Mobile */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsUserDropdownOpen(!isUserDropdownOpen);
          }}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 focus:outline-none"
        >
          <User className="w-6 h-6 text-gray-300" />
        </button>
      </div>

      {/* User Dropdown - Desktop Only */}
      <div className="hidden md:block relative z-50" ref={userDropdownRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsUserDropdownOpen(!isUserDropdownOpen);
          }}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 focus:outline-none"
        >
          <User className="w-6 h-6 text-gray-300" />
        </button>

        {isUserDropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-[1000]"
            onClick={(e) => e.stopPropagation()}
          >
            {!isLoggedIn ? (
              <>
                <button
                  onClick={handleLogin}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 w-full text-left"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={handleRegister}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 w-full text-left"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </>
            ) : (
              <>
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-sm text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-white">
                    user@example.com
                  </p>
                </div>
                <button
                  onClick={handleProfile}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 w-full text-left"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        )}
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
          </div>
        </div>
      )}

      {/* Mobile User Dropdown */}
      {isUserDropdownOpen && (
        <div className="md:hidden absolute top-full right-6 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-[1000]">
          {!isLoggedIn ? (
            <>
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 w-full text-left"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                onClick={handleRegister}
                className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 w-full text-left"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </button>
            </>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-gray-700">
                <p className="text-sm text-gray-400">Signed in as</p>
                <p className="text-sm font-medium text-white">
                  user@example.com
                </p>
              </div>
              <button
                onClick={handleProfile}
                className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 w-full text-left"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
