import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import ErrorBoundary from "./ErrorBoundary";

const BasicCodeDisplay = ({
  cppCode,
  pythonCode,
  jsCode,
  highlightedLine = null,
  className = "",
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languageOptions = [
    { id: "cpp", name: "C++" },
    { id: "python", name: "Python" },
    { id: "javascript", name: "JavaScript" },
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
        <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-900 font-mono text-sm text-white">
          <div className="p-4 overflow-x-auto">
            {codeLines.map((line, index) => {
              // Apply very simple syntax highlighting
              const lineWithHighlighting = applyBasicHighlighting(line, selectedLanguage);
              
              return (
                <div 
                  key={index} 
                  className={`${highlightedLine === index + 1 ? 'bg-green-900/30 border-l-4 border-green-500 pl-2' : ''} whitespace-pre`}
                >
                  <span className="inline-block w-8 mr-2 text-gray-500 select-none text-right">{index + 1}</span>
                  {lineWithHighlighting}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Very basic syntax highlighting function
function applyBasicHighlighting(line, language) {
  // Split the line into parts that we can color differently
  const parts = [];
  
  // Handle comments
  if (line.includes('//')) {
    const commentIndex = line.indexOf('//');
    const code = line.substring(0, commentIndex);
    const comment = line.substring(commentIndex);
    
    if (code) parts.push(<span key="code">{code}</span>);
    parts.push(<span key="comment" className="text-gray-500">{comment}</span>);
    
    return parts;
  }
  
  // If no special highlighting, just return the line
  return line;
}

export default BasicCodeDisplay; 