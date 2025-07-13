import React, { useState, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, Decoration, ViewPlugin } from "@codemirror/view";
import { ChevronDown } from "lucide-react";

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

  // Get the appropriate language extension based on selection
  const getExtension = () => {
    switch (selectedLanguage) {
      case "cpp":
        return cpp();
      case "python":
        return python();
      case "javascript":
        return javascript();
      default:
        return cpp();
    }
  };

  const code = getCode();
  const languageExtension = useMemo(() => getExtension(), [selectedLanguage]);

  // Create extensions with useMemo to avoid recreation on each render
  const extensions = useMemo(() => {
    const baseExtensions = [
      languageExtension,
      EditorView.editable.of(false),
      EditorView.lineWrapping,
      EditorView.theme({
        ".cm-activeLine": { backgroundColor: "transparent" },
        ".cm-highlightedLine": {
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          borderLeft: "3px solid #4CAF50",
        }
      })
    ];

    // Only add highlighting if we have a line to highlight
    if (highlightedLine !== null) {
      const highlightPlugin = ViewPlugin.fromClass(class {
        decorations;
        
        constructor(view) {
          this.decorations = this.getDecorations(view);
        }
        
        update(update) {
          this.decorations = this.getDecorations(update.view);
        }
        
        getDecorations(view) {
          const decorations = [];
          try {
            if (highlightedLine !== null && highlightedLine > 0) {
              const line = view.state.doc.line(highlightedLine);
              decorations.push(Decoration.line({
                class: "cm-highlightedLine"
              }).range(line.from));
            }
          } catch (e) {
            console.log("Error highlighting line:", e);
          }
          return Decoration.set(decorations);
        }
      }, {
        decorations: v => v.decorations
      });
      
      baseExtensions.push(highlightPlugin);
    }
    
    return baseExtensions;
  }, [languageExtension, highlightedLine]);

  return (
    <div className={`relative ${className}`}>
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

      {/* Code editor */}
      <CodeMirror
        value={code}
        height="100%"
        theme={oneDark}
        extensions={extensions}
        className="rounded-lg overflow-hidden border border-gray-700"
      />
    </div>
  );
};

export default CodeDisplay; 