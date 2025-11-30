import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import ErrorBoundary from "./ErrorBoundary";

// Centralized CodeMirror component to avoid multiple instances of @codemirror/state
const CodeMirrorWrapper = ({
  value,
  height = "100%",
  editable = false,
  highlightedLine = null,
  customTheme = {},
  language = "javascript",
}) => {
  // Get the appropriate language extension based on selection
  const languageExtension = useMemo(() => {
    switch (language.toLowerCase()) {
      case "python":
        return python();
      case "cpp":
      case "c++":
        return cpp();
      case "javascript":
      case "js":
      default:
        return javascript({ jsx: true });
    }
  }, [language]);

  const baseTheme = useMemo(() => ({
    "&": {
      fontFamily: '"Fira Code", monospace',
      fontSize: "14px",
      backgroundColor: "transparent",
      height: height
    },
    ".cm-content": {
      padding: "10px 0"
    },
    ".cm-line": {
      padding: "0 16px"
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(99, 102, 241, 0.2)"
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(99, 102, 241, 0.3)"
    }
  }), [height]);

  // Merge base theme with custom theme
  const mergedTheme = useMemo(() => ({
    ...baseTheme,
    ...customTheme,
    ...(highlightedLine ? {
      [`&.cm-editor.cm-focused .cm-line:nth-child(${highlightedLine})`]: {
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        borderLeft: "4px solid #f59e0b",
        paddingLeft: "12px",
        animation: "pulse 2s infinite",
      }
    } : {})
  }), [baseTheme, customTheme, highlightedLine]);

  // Memoize extensions to avoid recreating them on each render
  const extensions = useMemo(() => [
    languageExtension,
    EditorView.lineWrapping,
    EditorView.theme(mergedTheme)
  ], [languageExtension, mergedTheme]);

  return (
    <ErrorBoundary>
      <CodeMirror
        value={value}
        height={height}
        extensions={extensions}
        theme={oneDark}
        editable={editable}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
        }}
      />
    </ErrorBoundary>
  );
};

export default CodeMirrorWrapper; 