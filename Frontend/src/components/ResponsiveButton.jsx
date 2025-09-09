import React from "react";
import { twMerge } from "tailwind-merge";
import { useTheme } from "../context/ThemeContext";

/**
 * ResponsiveButton - A versatile button component with various style options
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.icon - Optional icon component
 * @param {'left' | 'right'} props.iconPosition - Position of the icon (left or right)
 * @param {'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost'} props.variant - Button style variant
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} props.size - Button size
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.type - Button type attribute
 * @returns {React.ReactElement}
 */
const ResponsiveButton = ({
  children,
  onClick,
  className = "",
  icon = null,
  iconPosition = "left",
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  type = "button",
  ...props
}) => {
  const { theme } = useTheme();
  // Base classes
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  
  // Size classes
  const sizeClasses = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };
  
  // Variant classes with theme awareness
  const variantClasses = {
    primary: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25 focus:ring-cyan-500",
    secondary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25 focus:ring-purple-500",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/25 focus:ring-green-500",
    danger: "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-red-500/25 focus:ring-red-500",
    warning: "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg hover:shadow-yellow-500/25 focus:ring-yellow-500",
    info: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 focus:ring-blue-500",
    outline: theme === 'dark' 
      ? "bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white focus:ring-gray-500"
      : "bg-transparent border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 focus:ring-gray-500",
    ghost: theme === 'dark' 
      ? "bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-500"
      : "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-500",
  };
  
  // Loading and disabled classes
  const loadingClass = isLoading ? "opacity-80 cursor-wait" : "";
  const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "hover:transform hover:scale-105 active:scale-95";
  const widthClass = fullWidth ? "w-full" : "";
  
  // Combine all classes
  const buttonClasses = twMerge(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    loadingClass,
    disabledClass,
    widthClass,
    className
  );
  
  // Loading spinner
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      
      {icon && iconPosition === "left" && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === "right" && !isLoading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default ResponsiveButton; 