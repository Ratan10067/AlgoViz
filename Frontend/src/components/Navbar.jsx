import React, { useState, useRef, useEffect } from "react";
import { Code, User, LogIn, UserPlus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    setIsDropdownOpen(false);
    navigate("/signin");
  };

  const handleRegister = () => {
    setIsDropdownOpen(false);
    navigate("/register");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const handleLogoClick = () => {
    navigate("/");
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

      <div className="relative z-50" ref={dropdownRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 focus:outline-none"
        >
          <User className="w-6 h-6 text-gray-300" />
        </button>

        {isDropdownOpen && (
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
    </nav>
  );
};

export default Navbar;
