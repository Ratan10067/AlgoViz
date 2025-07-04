import React from "react";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  const handleGoHome = () => {
    // Navigate to home page
    console.log("Navigate to home");
  };

  const handleGoBack = () => {
    // Go back in browser history
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center max-w-4xl mx-auto">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center mb-6 mx-auto">
            <AlertTriangle className="w-12 h-12 text-gray-400" />
          </div>

          {/* Large 404 Text */}
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-tight">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            Sorry, the page you are looking for doesn't exist or has been moved.
            Please check the URL or return to the homepage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={handleGoHome}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </button>

          <button
            onClick={handleGoBack}
            className="bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Search Box */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <Search className="w-5 h-5 text-gray-400 ml-4" />
            <input
              type="text"
              placeholder="Search for pages..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-inset"
            />
            <button className="bg-gray-700 text-white px-6 py-4 font-semibold hover:bg-gray-600 transition-colors duration-200">
              Search
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline">
              Home
            </button>
            <button className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline">
              About
            </button>
            <button className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline">
              Services
            </button>
            <button className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline">
              Contact
            </button>
            <button className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline">
              Blog
            </button>
          </div>
        </div>

        {/* Error Code */}
        <div className="text-gray-500 text-sm">
          Error Code: 404 - Page Not Found
        </div>
      </div>
    </div>
  );
}
