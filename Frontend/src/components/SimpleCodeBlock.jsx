import React, { useState, useRef } from "react";
import { ChevronDown, Code, FileCode, Terminal } from "lucide-react";
import ErrorBoundary from "./ErrorBoundary";

const SimpleCodeBlock = ({
  cppCode,
  pythonCode,
  jsCode,
  highlightedLine = null,
  className = "",
  // these come from BasicCodeDisplay now:
  isWrapped,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const codeContainerRef = useRef(null);

  const languageOptions = [
    { id: "cpp", name: "C++", icon: <FileCode size={14} className="text-blue-400" /> },
    { id: "python", name: "Python", icon: <Terminal size={14} className="text-green-400" /> },
    { id: "javascript", name: "JavaScript", icon: <Code size={14} className="text-yellow-400" /> },
  ];

  // Choose and sanitize code
  const getCode = () => {
    let result;
    switch (selectedLanguage) {
      case "cpp":      result = cppCode;     break;
      case "python":   result = pythonCode;  break;
      case "javascript": result = jsCode;    break;
      default:         result = cppCode;
    }
    return result ? String(result) : "";
  };
  const code = getCode();
  const currentLanguageOption = languageOptions.find(l => l.id === selectedLanguage);
  const codeLines = code.split("\n");

  // Enhanced syntax highlighting function - VS Code Dark+ inspired with more vibrant colors
  const applyCodeHighlighting = (line) => {
    if (!line) return line;
    
    // Handle different parts of the code
    let result = [];
    let currentIndex = 0;
    let keyCounter = 0;
    
    // Keywords for different languages with categorization for different color schemes
    const keywords = {
      cpp: {
        control: ['for', 'while', 'if', 'else', 'switch', 'case', 'break', 'continue', 'return', 'do'],
        types: ['int', 'void', 'char', 'bool', 'float', 'double', 'long', 'unsigned', 'signed', 'const', 'auto'],
        structures: ['class', 'struct', 'enum', 'union', 'namespace', 'template', 'typedef'],
        stl: ['vector', 'map', 'set', 'unordered_map', 'unordered_set', 'pair', 'queue', 'stack', 'list', 'deque'],
        preprocessor: ['include', 'define', 'ifdef', 'ifndef', 'endif', 'pragma'],
        values: ['true', 'false', 'nullptr', 'NULL', 'this'],
        operators: ['new', 'delete', 'sizeof', 'static_cast', 'dynamic_cast', 'const_cast', 'reinterpret_cast']
      },
      python: {
        control: ['for', 'while', 'if', 'else', 'elif', 'return', 'break', 'continue', 'try', 'except', 'finally', 'with', 'as', 'assert', 'raise'],
        definitions: ['def', 'class', 'lambda', 'global', 'nonlocal'],
        modules: ['import', 'from', 'as'],
        values: ['None', 'True', 'False', 'self'],
        operators: ['in', 'is', 'not', 'and', 'or', 'pass', 'yield', 'del']
      },
      javascript: {
        control: ['for', 'while', 'if', 'else', 'switch', 'case', 'break', 'continue', 'return', 'try', 'catch', 'finally'],
        declarations: ['const', 'let', 'var', 'function', 'class', 'extends', 'static', 'constructor'],
        modules: ['import', 'export', 'default', 'from', 'as'],
        values: ['null', 'undefined', 'true', 'false', 'NaN', 'Infinity', 'this', 'super'],
        async: ['async', 'await', 'Promise', 'then', 'catch'],
        operators: ['typeof', 'instanceof', 'new', 'delete', 'in', 'of']
      }
    };
    
    const languageKeywords = keywords[selectedLanguage] || keywords.javascript;
    
    // Comments
    if (line.includes('//')) {
      const commentIndex = line.indexOf('//');
      if (commentIndex > 0) {
        result.push(<span key={keyCounter++}>{line.substring(0, commentIndex)}</span>);
      }
      result.push(<span key={keyCounter++} className="text-emerald-400/70 italic">{line.substring(commentIndex)}</span>);
      return result;
    }
    
    // Python comments
    if (selectedLanguage === 'python' && line.includes('#')) {
      const commentIndex = line.indexOf('#');
      if (commentIndex > 0) {
        result.push(<span key={keyCounter++}>{line.substring(0, commentIndex)}</span>);
      }
      result.push(<span key={keyCounter++} className="text-emerald-400/70 italic">{line.substring(commentIndex)}</span>);
      return result;
    }
    
    // String literals
    const stringRegex = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g;
    let stringMatch;
    let lastIndex = 0;
    
    while ((stringMatch = stringRegex.exec(line)) !== null) {
      // Add text before the string
      if (stringMatch.index > lastIndex) {
        const beforeText = line.substring(lastIndex, stringMatch.index);
        result.push(processKeywords(beforeText, languageKeywords, keyCounter++));
      }
      
      // Add the string with highlighting - more vibrant amber
      result.push(<span key={keyCounter++} className="text-amber-300">{stringMatch[0]}</span>);
      
      lastIndex = stringMatch.index + stringMatch[0].length;
    }
    
    // Add remaining text after all strings
    if (lastIndex < line.length) {
      const remainingText = line.substring(lastIndex);
      result.push(processKeywords(remainingText, languageKeywords, keyCounter++));
    }
    
    return result.length > 0 ? result : line;
  };
  
  // Process keywords in a text segment with enhanced color scheme
  const processKeywords = (text, languageKeywords, key) => {
    // Numbers with enhanced cyan color
    const numberRegex = /\b\d+(\.\d+)?\b/g;
    let parts = [];
    let lastIdx = 0;
    let match;
    
    // Replace numbers with highlighted spans
    while ((match = numberRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(text.substring(lastIdx, match.index));
      }
      parts.push(<span key={`num-${key}-${match.index}`} className="text-cyan-300 font-medium">{match[0]}</span>);
      lastIdx = match.index + match[0].length;
    }
    
    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }
    
    // Function calls - match function names followed by parentheses
    const processedWithFunctions = parts.map((part, i) => {
      if (typeof part !== 'string') return part;
      
      const functionRegex = /\b([a-zA-Z_]\w*)\s*\(/g;
      let functionParts = [];
      let lastFuncIdx = 0;
      let funcMatch;
      
      while ((funcMatch = functionRegex.exec(part)) !== null) {
        if (funcMatch.index > lastFuncIdx) {
          functionParts.push(part.substring(lastFuncIdx, funcMatch.index));
        }
        
        // Add function name with vibrant color, but keep the parenthesis normal
        functionParts.push(
          <span key={`func-${key}-${i}-${funcMatch.index}`} className="text-yellow-300 font-medium">
            {funcMatch[1]}
          </span>
        );
        functionParts.push("(");
        
        lastFuncIdx = funcMatch.index + funcMatch[0].length;
      }
      
      if (lastFuncIdx < part.length) {
        functionParts.push(part.substring(lastFuncIdx));
      }
      
      return functionParts.length > 1 ? functionParts : part;
    }).flat();
    
    // Now process keywords in each text part with different colors based on category
    const processedParts = processedWithFunctions.map((part, i) => {
      if (typeof part !== 'string') return part;
      
      let result = part;
      
      // Process each category with different colors
      if (languageKeywords.control) {
        result = processKeywordCategory(result, languageKeywords.control, "text-pink-400 font-medium", `ctrl-${key}-${i}`);
      }
      
      if (languageKeywords.types) {
        result = processKeywordCategory(result, languageKeywords.types, "text-blue-400 font-medium", `type-${key}-${i}`);
      }
      
      if (languageKeywords.structures) {
        result = processKeywordCategory(result, languageKeywords.structures, "text-purple-400 font-medium", `struct-${key}-${i}`);
      }
      
      if (languageKeywords.stl) {
        result = processKeywordCategory(result, languageKeywords.stl, "text-blue-300 font-medium", `stl-${key}-${i}`);
      }
      
      if (languageKeywords.preprocessor) {
        result = processKeywordCategory(result, languageKeywords.preprocessor, "text-teal-400 font-medium", `preproc-${key}-${i}`);
      }
      
      if (languageKeywords.values) {
        result = processKeywordCategory(result, languageKeywords.values, "text-orange-400 font-medium", `val-${key}-${i}`);
      }
      
      if (languageKeywords.operators) {
        result = processKeywordCategory(result, languageKeywords.operators, "text-fuchsia-400 font-medium", `op-${key}-${i}`);
      }
      
      if (languageKeywords.declarations) {
        result = processKeywordCategory(result, languageKeywords.declarations, "text-blue-400 font-medium", `decl-${key}-${i}`);
      }
      
      if (languageKeywords.modules) {
        result = processKeywordCategory(result, languageKeywords.modules, "text-teal-400 font-medium", `mod-${key}-${i}`);
      }
      
      if (languageKeywords.definitions) {
        result = processKeywordCategory(result, languageKeywords.definitions, "text-blue-400 font-medium", `def-${key}-${i}`);
      }
      
      if (languageKeywords.async) {
        result = processKeywordCategory(result, languageKeywords.async, "text-purple-300 font-medium", `async-${key}-${i}`);
      }
      
      return <React.Fragment key={`part-${key}-${i}`}>{result}</React.Fragment>;
    });
    
    return <>{processedParts}</>;
  };
  
  // Helper function to process a category of keywords with a specific color
  const processKeywordCategory = (text, keywords, colorClass, keyPrefix) => {
    if (typeof text !== 'string') return text;
    
    let result = text;
    keywords.forEach((keyword, idx) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      if (typeof result === 'string') {
        result = result.split(regex).reduce((acc, curr, i, arr) => {
          if (i === arr.length - 1) return [...acc, curr];
          return [
            ...acc,
            curr,
            <span key={`${keyPrefix}-${idx}-${i}`} className={colorClass}>{keyword}</span>
          ];
        }, []);
      }
    });
    
    return result;
  };

  // Handle line wrapping toggle
  const toggleLineWrapping = () => {
    setIsWrapped(!isWrapped);
  };

  return (
    <ErrorBoundary>
      <div 
        className={`relative ${className} h-full min-h-0`}
        ref={codeContainerRef}
      >
        {/* Toolbar: language selector only */}
        <div className="flex items-center justify-between mb-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-lg p-2 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Language:</span>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-md hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-600"
              >
                {currentLanguageOption?.icon}
                <span className="font-medium">{currentLanguageOption?.name}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-1 w-40 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-600 rounded-md shadow-lg z-20 overflow-hidden">
                  {languageOptions.map((lang, idx) => (
                    <button
                      key={lang.id}
                      className={`flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                        idx < languageOptions.length - 1 ? "border-b border-gray-700" : ""
                      } ${
                        selectedLanguage === lang.id
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700/50"
                      }`}
                      onClick={() => {
                        setSelectedLanguage(lang.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {lang.icon}
                      <span>{lang.name}</span>
                      {selectedLanguage === lang.id && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code display */}
        <div className="rounded-lg overflow-hidden border border-gray-700 bg-[#1E1E1E] font-mono text-sm text-white h-full">
          <div
            className="h-full overflow-y-auto"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#4B5563 #1F2937" }}
          >
            <div className={`p-4 ${isWrapped ? "" : "overflow-x-auto"} min-w-full`}>
              {codeLines.map((line, index) => {
                const highlighted = highlightedLine === index + 1;
                const content = applyCodeHighlighting(line);
                return (
                  <div
                    key={index}
                    className={`flex ${
                      highlighted
                        ? "bg-blue-900/30 border-l-4 border-blue-500"
                        : "border-l-4 border-transparent"
                    } ${isWrapped ? "whitespace-pre-wrap break-all" : "whitespace-pre"}`}
                  >
                    <span className="inline-block w-8 mr-2 text-gray-500 select-none text-right flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="flex-grow">{content}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SimpleCodeBlock;