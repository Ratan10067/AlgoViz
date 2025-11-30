import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Code, ChevronDown, BookOpen, Cpu, FileText, LogIn, UserPlus, User, LogOut, Home, Sun, Moon, Menu, X, Sparkles, Zap
} from "lucide-react";
import { useAuth } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  const resourcesDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Handle scroll effect for glassmorphism intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target)) {
        setIsResourcesDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsResourcesDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleAuthAction = (path) => {
    setShowAuthModal(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  // Determine text color based on theme, scroll state, and page
  const getTextColor = () => {
    if (theme === 'dark') return 'text-gray-300 hover:text-white';
    if (isHomePage && !scrolled) return 'text-white hover:text-white drop-shadow-md';
    return 'text-gray-600 hover:text-gray-900';
  };

  const getLogoColor = () => {
    if (theme === 'dark') return 'text-white';
    if (isHomePage && !scrolled) return 'text-white';
    return 'text-gray-900';
  };

  const NavLink = ({ icon: Icon, text, onClick, active }) => (
    <button
      onClick={onClick}
      className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${active
        ? theme === 'dark'
          ? 'bg-white/10 text-cyan-400'
          : (isHomePage && !scrolled) ? 'bg-white/20 text-white backdrop-blur-sm shadow-lg shadow-black/10' : 'bg-black/5 text-blue-600'
        : getTextColor()
        } ${theme !== 'dark' && isHomePage && !scrolled ? 'hover:bg-white/10 hover:backdrop-blur-sm' : 'hover:bg-black/5'}`}
    >
      <Icon size={18} className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'animate-pulse' : ''} ${isHomePage && !scrolled && !active ? 'drop-shadow-md' : ''}`} />
      <span className="font-medium">{text}</span>
    </button>
  );

  return (
    <>
      <nav
        className={`fixed w-full z-50 top-0 transition-all duration-500 ${scrolled
          ? theme === 'dark'
            ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-cyan-500/5'
            : 'bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-lg shadow-blue-500/5'
          : 'bg-transparent border-b border-transparent'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${theme === 'dark'
                ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 group-hover:from-cyan-500/30 group-hover:to-blue-500/30'
                : (isHomePage && !scrolled)
                  ? 'bg-white/20 backdrop-blur-md group-hover:bg-white/30 shadow-lg shadow-black/10'
                  : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20'
                }`}>
                <Code className={`w-8 h-8 transition-transform duration-500 group-hover:rotate-12 ${theme === 'dark'
                  ? 'text-cyan-400'
                  : (isHomePage && !scrolled)
                    ? 'text-yellow-300'
                    : 'text-blue-600'
                  }`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-2xl font-bold tracking-tight ${getLogoColor()}`}>
                  Algo<span className={`text-transparent bg-clip-text ${theme === 'dark'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                    : (isHomePage && !scrolled)
                      ? 'bg-gradient-to-r from-yellow-300 to-amber-400'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                    }`}>Viz</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink
                icon={Home}
                text="Home"
                onClick={() => handleNavigation("/")}
                active={location.pathname === "/"}
              />
              <NavLink
                icon={Cpu}
                text="Algorithms"
                onClick={() => handleNavigation("/algorithms")}
                active={location.pathname.includes("/algorithms")}
              />

              {/* Resources Dropdown */}
              <div className="relative" ref={resourcesDropdownRef}>
                <button
                  onClick={() => setIsResourcesDropdownOpen(!isResourcesDropdownOpen)}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition-all duration-300 ${isResourcesDropdownOpen
                    ? theme === 'dark'
                      ? 'bg-white/10 text-white'
                      : (isHomePage && !scrolled) ? 'bg-white/20 text-white backdrop-blur-sm shadow-lg shadow-black/10' : 'bg-black/5 text-gray-900'
                    : getTextColor()
                    } ${theme !== 'dark' && isHomePage && !scrolled ? 'hover:bg-white/10 hover:backdrop-blur-sm' : 'hover:bg-black/5'}`}
                >
                  <BookOpen size={18} className={isHomePage && !scrolled && !isResourcesDropdownOpen ? 'drop-shadow-md' : ''} />
                  <span className="font-medium">Resources</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isResourcesDropdownOpen ? 'rotate-180' : ''} ${isHomePage && !scrolled && !isResourcesDropdownOpen ? 'drop-shadow-md' : ''}`} />
                </button>

                {isResourcesDropdownOpen && (
                  <div className={`absolute top-full left-0 mt-2 w-56 rounded-2xl p-2 shadow-2xl border backdrop-blur-xl transform transition-all duration-300 origin-top-left animate-in fade-in zoom-in-95 ${theme === 'dark'
                    ? 'bg-slate-900/90 border-white/10 shadow-black/50'
                    : 'bg-white/90 border-black/5 shadow-gray-200/50'
                    }`}>
                    {[
                      { path: "/blogs", icon: FileText, label: "Blogs" },
                      { path: "/tutorials", icon: BookOpen, label: "Tutorials" },
                      { path: "/cheatsheet", icon: Code, label: "Cheat Sheet" },
                      { path: "/complexity-guide", icon: Zap, label: "Big O Guide" }
                    ].map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${theme === 'dark'
                          ? 'text-gray-300 hover:bg-white/10 hover:text-cyan-400'
                          : 'text-gray-600 hover:bg-black/5 hover:text-blue-600'
                          }`}
                      >
                        <item.icon size={18} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${theme === 'dark'
                  ? 'bg-white/5 text-yellow-400 hover:bg-white/10 ring-1 ring-white/10'
                  : (isHomePage && !scrolled)
                    ? 'bg-white/20 text-yellow-300 hover:bg-white/30 ring-1 ring-white/30 backdrop-blur-sm shadow-lg shadow-black/10'
                    : 'bg-black/5 text-slate-700 hover:bg-black/10 ring-1 ring-black/5'
                  }`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} className={isHomePage && !scrolled ? 'drop-shadow-md' : ''} />}
              </button>

              <div className={`h-8 w-px mx-2 ${theme === 'dark' || (isHomePage && !scrolled) ? 'bg-white/20' : 'bg-gray-200/20'}`} />

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className={`group relative px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 overflow-hidden ${theme === 'dark' || (isHomePage && !scrolled)
                    ? 'bg-white text-blue-600 hover:shadow-white/25'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-blue-500/25'
                    }`}
                >
                  <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${theme === 'dark' || (isHomePage && !scrolled) ? 'bg-blue-50' : 'bg-white/20'
                    }`} />
                  <span className="relative flex items-center gap-2">
                    Get Started
                    <Sparkles size={16} />
                  </span>
                </button>
              ) : (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className={`flex items-center space-x-3 pl-2 pr-4 py-1.5 rounded-full border transition-all duration-300 ${theme === 'dark'
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/50'
                      : (isHomePage && !scrolled)
                        ? 'bg-white/20 border-white/30 hover:bg-white/30 text-white'
                        : 'bg-black/5 border-black/5 hover:bg-black/10 hover:border-blue-500/50'
                      }`}
                  >
                    <div className="relative">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-offset-2 ring-cyan-500" />
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : (isHomePage && !scrolled) ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-600'
                          }`}>
                          <User size={16} />
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full" />
                    </div>
                    <span className={`font-medium text-sm ${theme === 'dark' ? 'text-gray-200' : (isHomePage && !scrolled) ? 'text-white' : 'text-gray-700'
                      }`}>
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${showUserDropdown ? 'rotate-180' : ''} ${theme === 'dark' || (isHomePage && !scrolled) ? 'text-gray-300' : 'text-gray-400'
                      }`} />
                  </button>

                  {showUserDropdown && (
                    <div className={`absolute right-0 mt-4 w-64 rounded-2xl p-2 shadow-2xl border backdrop-blur-xl transform transition-all duration-300 origin-top-right animate-in fade-in zoom-in-95 ${theme === 'dark'
                      ? 'bg-slate-900/90 border-white/10 shadow-black/50'
                      : 'bg-white/90 border-black/5 shadow-gray-200/50'
                      }`}>
                      <div className={`p-4 mb-2 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Signed in as</p>
                        <p className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
                      </div>

                      <button
                        onClick={() => { setShowUserDropdown(false); navigate("/user-profile"); }}
                        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10 hover:text-cyan-400' : 'text-gray-600 hover:bg-black/5 hover:text-blue-600'
                          }`}
                      >
                        <User size={18} />
                        <span className="font-medium">Profile Settings</span>
                      </button>

                      <div className={`h-px my-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />

                      <button
                        onClick={handleLogout}
                        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-500/10`}
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl ${theme === 'dark'
                  ? 'bg-white/5 text-yellow-400'
                  : (isHomePage && !scrolled) ? 'bg-white/20 text-yellow-300' : 'bg-black/5 text-slate-700'
                  }`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-xl transition-colors ${theme === 'dark'
                  ? 'bg-white/5 text-white hover:bg-white/10'
                  : (isHomePage && !scrolled) ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-black/5 text-gray-900 hover:bg-black/10'
                  }`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full h-[calc(100vh-5rem)] overflow-y-auto backdrop-blur-xl transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95'
            }`}>
            <div className="p-4 space-y-2">
              <div className="space-y-1">
                <button onClick={() => handleNavigation("/")} className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl font-medium ${theme === 'dark' ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'}`}>
                  <Home size={20} />
                  <span>Home</span>
                </button>
                <button onClick={() => handleNavigation("/algorithms")} className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl font-medium ${theme === 'dark' ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'}`}>
                  <Cpu size={20} />
                  <span>Algorithms</span>
                </button>
              </div>

              <div className={`h-px my-4 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />

              <div className="space-y-1">
                <p className={`px-4 text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Resources</p>
                <button onClick={() => handleNavigation("/blogs")} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'}`}>
                  <FileText size={18} />
                  <span>Blogs</span>
                </button>
                <button onClick={() => handleNavigation("/tutorials")} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'}`}>
                  <BookOpen size={18} />
                  <span>Tutorials</span>
                </button>
                <button onClick={() => handleNavigation("/cheatsheet")} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'}`}>
                  <Code size={18} />
                  <span>Cheat Sheet</span>
                </button>
              </div>

              <div className={`h-px my-4 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />

              {!isAuthenticated ? (
                <div className="space-y-3 p-2">
                  <button
                    onClick={() => handleAuthAction("/signin")}
                    className={`w-full py-3 rounded-xl font-bold border ${theme === 'dark' ? 'border-white/20 text-white hover:bg-white/5' : 'border-black/10 text-gray-900 hover:bg-black/5'
                      }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthAction("/register")}
                    className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className={`px-4 py-3 rounded-xl mb-2 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
                    <div className="flex items-center space-x-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-500/20 text-blue-600'}`}>
                          <User size={20} />
                        </div>
                      )}
                      <div>
                        <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate("/user-profile"); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'}`}>
                    <User size={18} />
                    <span>Profile Settings</span>
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-500/10">
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAuthModal(false)}
          />
          <div className={`relative w-full max-w-md transform overflow-hidden rounded-3xl p-8 text-left shadow-2xl transition-all animate-in fade-in zoom-in-95 ${theme === 'dark' ? 'bg-slate-900 border border-white/10' : 'bg-white border border-gray-100'
            }`}>
            <button
              onClick={() => setShowAuthModal(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${theme === 'dark' ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-500 hover:bg-black/5 hover:text-gray-900'
                }`}
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <div className={`inline-flex p-3 rounded-2xl mb-4 ${theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-500/10 text-blue-600'}`}>
                <Sparkles size={32} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Welcome to AlgoViz
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                Join our community to master algorithms
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleAuthAction("/signin")}
                className={`w-full flex items-center justify-center space-x-3 p-4 rounded-xl font-bold transition-all duration-300 group ${theme === 'dark'
                  ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
                  }`}
              >
                <LogIn size={20} className="group-hover:scale-110 transition-transform" />
                <span>Sign In</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${theme === 'dark' ? 'bg-slate-900 text-gray-500' : 'bg-white text-gray-500'}`}>
                    Or
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAuthAction("/register")}
                className="w-full flex items-center justify-center space-x-3 p-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <UserPlus size={20} />
                <span>Create Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
