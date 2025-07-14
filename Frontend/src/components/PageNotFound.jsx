import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";

// All available routes including algorithm visualizers
const routes = [
  { name: "Home", path: "/" },
  { name: "Blogs", path: "/blogs" },
  { name: "Cheat Sheet", path: "/cheatsheet" },
  { name: "About", path: "/about" },
  { name: "Support", path: "/support" },
  // Algorithm pages
  { name: "Algorithm Home", path: "/visualizer" },
  { name: "Bubble Sort", path: "/bubble-sort" },
  { name: "Quick Sort", path: "/quick-sort" },
  { name: "Merge Sort", path: "/merge-sort" },
  { name: "BFS Visualizer", path: "/bfs-visualizer" },
  { name: "DFS Visualizer", path: "/dfs-visualizer" },
  { name: "Dijkstra Visualizer", path: "/dijkstra-visualizer" },
];

export default function PageNotFound() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Update suggestions after typing 2+ characters
  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length >= 2) {
      const matches = routes.filter((r) =>
        r.name.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (path) => {
    navigate(path);
  };

  // On form submit, navigate if exactly one suggestion
  const handleSearch = (e) => {
    e.preventDefault();
    if (suggestions.length === 1) {
      navigate(suggestions[0].path);
    } else if (suggestions.length > 1) {
      // Let user click on suggestion
    } else {
      alert("No matching pages or algorithms found.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center max-w-4xl mx-auto">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center mb-6 mx-auto">
            <AlertTriangle className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-tight">404</h1>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            Oops! We couldn’t find that page.
            Use the search below to jump to an available page or algorithm.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={() => navigate("/")}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition transform duration-200 cursor-pointer flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 hover:scale-105 transition transform duration-200 cursor-pointer flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Search Box with autocomplete */}
        <form onSubmit={handleSearch} className="w-full max-w-md mb-8 relative">
          <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
            <Search className="w-5 h-5 text-gray-400 ml-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search pages or algorithms..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 px-4 py-4 focus:outline-none focus:ring-0 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-4 font-semibold hover:bg-blue-500 hover:scale-105 transition transform duration-200 cursor-pointer"
            >
              Search
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-b-lg max-h-48 overflow-auto z-10">
              {suggestions.map((s) => (
                <li
                  key={s.path}
                  onClick={() => handleSuggestionClick(s.path)}
                  className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {routes.slice(0, 5).map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="text-gray-400 hover:text-white hover:underline cursor-pointer transition transform duration-200"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Code */}
        <div className="text-gray-500 text-sm">Error Code: 404 - Page Not Found</div>
      </div>
    </div>
  );
}
