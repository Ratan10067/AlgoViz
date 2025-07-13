import React, { useState, useRef, useEffect } from "react";
import { Maximize2, WrapText } from "lucide-react";
import ErrorBoundary from "./ErrorBoundary";
import SimpleCodeBlock from "./SimpleCodeBlock";

const BasicCodeDisplay = ({
  cppCode,
  pythonCode,
  jsCode,
  highlightedLine = null,
  className = "",
}) => {
  // state for fullscreen
  const [isFullScreen, setIsFullScreen] = useState(false);
  // state for line‐wrapping
  const [isWrapped, setIsWrapped] = useState(false);

  const fullScreenRef = useRef(null);

  // Fullscreen change listener
  useEffect(() => {
    function handleFullScreenChange() {
      setIsFullScreen(
        document.fullscreenElement === fullScreenRef.current
      );
    }
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener(
        "fullscreenchange",
        handleFullScreenChange
      );
  }, []);

  // Toggle fullscreen on/off
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      fullScreenRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Escape key exits fullscreen
  useEffect(() => {
    if (!isFullScreen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullScreen]);

  // Toggle line wrapping
  const toggleWrap = () => {
    setIsWrapped((prev) => !prev);
  };

  // sanitize incoming code props
  const sanitizedCppCode = cppCode ? String(cppCode) : "";
  const sanitizedPythonCode = pythonCode ? String(pythonCode) : "";
  const sanitizedJsCode = jsCode ? String(jsCode) : "";

  return (
    <ErrorBoundary>
      <div
        ref={fullScreenRef}
        className={`relative bg-black ${
          isFullScreen
            ? "fixed inset-0 z-50 flex flex-col h-screen w-screen"
            : "w-full h-full"
        }`}
        style={{ minHeight: 0 }}
      >
        {/* BOTH buttons in one corner, side-by-side */}
        <div className="absolute top-2 right-2 z-10 flex space-x-2">
          {/* Wrap toggle */}
          <button
            className="p-2 bg-gray-800/80 rounded hover:bg-gray-700 text-white"
            onClick={toggleWrap}
            title={isWrapped ? "Disable Line Wrap" : "Enable Line Wrap"}
          >
            <WrapText size={18} />
          </button>

          {/* Fullscreen toggle */}
          <button
            className="p-2 bg-gray-800/80 rounded hover:bg-gray-700 text-white"
            onClick={toggleFullScreen}
            title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
          >
            <Maximize2 size={18} />
          </button>
        </div>

        <div className="flex-1 flex flex-col h-full min-h-0">
          <SimpleCodeBlock
            cppCode={sanitizedCppCode}
            pythonCode={sanitizedPythonCode}
            jsCode={sanitizedJsCode}
            highlightedLine={highlightedLine}
            className={`w-full h-full min-h-0 text-lg ${className}`}
            isFullScreen={isFullScreen}
            isWrapped={isWrapped}
            onToggleFullScreen={toggleFullScreen}
            onToggleWrap={toggleWrap}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default BasicCodeDisplay;
