import React, { useState, useMemo } from "react";
import CodeMirrorWrapper from "./CodeMirrorWrapper";
import { ChevronDown } from "lucide-react";
import ErrorBoundary from "./ErrorBoundary";

const CodeDisplay = ({
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
  const language = useMemo(() => selectedLanguage, [selectedLanguage]);

  return (
    <ErrorBoundary>
      <div className={`${className}`}>
        {/* Language selector dropdown */}
        <div className="flex justify-end mb-2">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              <span>{languageOptions.find(lang => lang.id === selectedLanguage)?.name || "Language"}</span>
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
          <CodeMirrorWrapper
            value={code}
            language={language}
            highlightedLine={highlightedLine}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CodeDisplay; 