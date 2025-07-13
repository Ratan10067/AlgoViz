import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import ErrorBoundary from "./ErrorBoundary";
import Prism from 'prismjs';
// First load the core
import 'prismjs/components/prism-core';
// Then load the markup language
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-clike';
// Then load specific languages that depend on core and markup
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
// Then load the theme
import 'prismjs/themes/prism-tomorrow.css';

const SimpleCodeDisplay = ({
  cppCode,
  pythonCode,
  jsCode,
  highlightedLine = null,
  className = "",
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");

  const languageOptions = [
    { id: "cpp", name: "C++", prismLanguage: "cpp" },
    { id: "python", name: "Python", prismLanguage: "python" },
    { id: "javascript", name: "JavaScript", prismLanguage: "javascript" },
  ];

  // Get the appropriate code based on selection
  const getCode = () => {
    switch (selectedLanguage) {
      case "cpp":
        return cppCode;
      case "python":
        return pythonCode;
      case "javascript":
        return jsCode;
      default:
        return cppCode;
    }
  };

  const code = getCode();
  const currentLanguageOption = languageOptions.find(lang => lang.id === selectedLanguage);
  
  // Split the code into lines for line highlighting
  const codeLines = code.split('\n');

  // Manual syntax highlighting without using Prism directly
  useEffect(() => {
    // Make sure Prism is available
    if (window.Prism) {
      try {
        // Force Prism to highlight the code
        setTimeout(() => {
          Prism.highlightAll();
        }, 0);
      } catch (error) {
        console.error("Error during Prism highlighting:", error);
      }
    }
  }, [selectedLanguage, code]);

  return (
    <ErrorBoundary>
      <div className={`relative ${className}`}>
        {/* Language selector dropdown */}
        <div className="flex justify-end mb-2">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              <span>{currentLanguageOption?.name || "Language"}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                {languageOptions.map(language => (
                  <button
                    key={language.id}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors duration-200 ${
                      selectedLanguage === language.id ? "text-cyan-400" : "text-white"
                    }`}
                    onClick={() => {
                      setSelectedLanguage(language.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {language.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code display */}
        <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
          <pre className="p-4 overflow-x-auto">
            <code className={`language-${currentLanguageOption?.prismLanguage || 'javascript'}`}>
              {codeLines.map((line, index) => (
                <div 
                  key={index} 
                  className={`${highlightedLine === index + 1 ? 'bg-green-900/30 border-l-4 border-green-500 pl-2' : ''}`}
                >
                  <span className="inline-block w-8 mr-2 text-gray-500 select-none text-right">{index + 1}</span>
                  <span>{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SimpleCodeDisplay; 