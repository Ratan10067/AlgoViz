import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import SimpleCodeBlock from "./SimpleCodeBlock";

const SimpleCodeDisplay = ({
  cppCode,
  pythonCode,
  jsCode,
  highlightedLine = null,
  className = "",
}) => {
  // Ensure code values are strings
  const sanitizedCppCode = cppCode ? String(cppCode) : "";
  const sanitizedPythonCode = pythonCode ? String(pythonCode) : "";
  const sanitizedJsCode = jsCode ? String(jsCode) : "";

  return (
    <ErrorBoundary>
      <div className={`relative ${className}`}>
        <SimpleCodeBlock
          cppCode={sanitizedCppCode}
          pythonCode={sanitizedPythonCode}
          jsCode={sanitizedJsCode}
          highlightedLine={highlightedLine}
        />
      </div>
    </ErrorBoundary>
  );
};

export default SimpleCodeDisplay; 