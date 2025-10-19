import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  GitBranch, Hash, Type, Zap, ArrowRight, ArrowDown, FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const LCS = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Input state
  const [string1, setString1] = useState("ABCDGH");
  const [string2, setString2] = useState("AEDFHR");
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(800);
  
  // Algorithm state
  const [dpTable, setDpTable] = useState([]);
  const [lcsLength, setLcsLength] = useState(0);
  const [lcsString, setLcsString] = useState("");
  
  // UI state
  const [activeRightTab, setActiveRightTab] = useState("stats");
  const [currentHighlightedLine, setCurrentHighlightedLine] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error",
    customButtons: null,
  });

  const handleBack = () => {
    setAlertConfig({
      isOpen: true,
      message: "Are you sure you want to go back? Any unsaved progress will be lost.",
      type: "warning",
      customButtons: [
        {
          label: "Stay",
          onClick: () => setAlertConfig({ isOpen: false }),
          variant: "secondary"
        },
        {
          label: "Go Back",
          onClick: () => {
            setAlertConfig({ isOpen: false });
            navigate("/");
          },
          variant: "destructive"
        }
      ]
    });
  };

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setPlaying(false);
    setStarted(false);
    setDpTable([]);
    setLcsLength(0);
    setLcsString("");
    setCurrentHighlightedLine(null);
  };

  const generateLCSSteps = () => {
    const m = string1.length;
    const n = string2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    const steps = [];

    steps.push({
      type: 'initialization',
      description: `Initializing DP table for strings "${string1}" and "${string2}"`,
      dp: dp.map(row => [...row]),
      currentI: -1,
      currentJ: -1,
      comparing: null,
      action: 'initialize',
      lcsLength: 0
    });

    // Fill the DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = string1[i - 1];
        const char2 = string2[j - 1];
        
        if (char1 === char2) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          steps.push({
            type: 'match',
            description: `Characters match: ${char1} = ${char2}, dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`,
            dp: dp.map(row => [...row]),
            currentI: i,
            currentJ: j,
            comparing: [char1, char2],
            action: 'match',
            lcsLength: dp[i][j]
          });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          steps.push({
            type: 'nomatch',
            description: `Characters don't match: ${char1} ≠ ${char2}, dp[${i}][${j}] = max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`,
            dp: dp.map(row => [...row]),
            currentI: i,
            currentJ: j,
            comparing: [char1, char2],
            action: 'no_match',
            lcsLength: dp[i][j]
          });
        }
      }
    }

    // Backtrack to find LCS string
    let lcs = "";
    let i = m, j = n;
    const backtrackSteps = [];

    while (i > 0 && j > 0) {
      if (string1[i - 1] === string2[j - 1]) {
        lcs = string1[i - 1] + lcs;
        backtrackSteps.push({
          type: 'backtrack_match',
          description: `Backtrack: Found matching character '${string1[i - 1]}' at position [${i}][${j}]`,
          dp: dp.map(row => [...row]),
          currentI: i,
          currentJ: j,
          lcsString: lcs,
          action: 'backtrack_match'
        });
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        backtrackSteps.push({
          type: 'backtrack_up',
          description: `Backtrack: Moving up from [${i}][${j}] to [${i-1}][${j}]`,
          dp: dp.map(row => [...row]),
          currentI: i,
          currentJ: j,
          lcsString: lcs,
          action: 'backtrack_up'
        });
        i--;
      } else {
        backtrackSteps.push({
          type: 'backtrack_left',
          description: `Backtrack: Moving left from [${i}][${j}] to [${i}][${j-1}]`,
          dp: dp.map(row => [...row]),
          currentI: i,
          currentJ: j,
          lcsString: lcs,
          action: 'backtrack_left'
        });
        j--;
      }
    }

    steps.push({
      type: 'table_complete',
      description: `DP table complete. LCS length: ${dp[m][n]}. Starting backtrack...`,
      dp: dp.map(row => [...row]),
      currentI: m,
      currentJ: n,
      lcsLength: dp[m][n],
      action: 'table_complete'
    });

    steps.push(...backtrackSteps);

    steps.push({
      type: 'complete',
      description: `LCS found: "${lcs}" with length ${lcs.length}`,
      dp: dp.map(row => [...row]),
      currentI: 0,
      currentJ: 0,
      lcsString: lcs,
      lcsLength: lcs.length,
      action: 'complete'
    });

    return steps;
  };

  const startLCS = () => {
    if (!string1 || !string2) return;
    
    const lcsSteps = generateLCSSteps();
    setSteps(lcsSteps);
    setCurrentStep(0);
    setStarted(true);
    setPlaying(true);
  };

  const pauseResume = () => {
    setPlaying(!playing);
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const reset = () => {
    setString1("ABCDGH");
    setString2("AEDFHR");
    resetVisualization();
  };

  // Auto-play effect
  useEffect(() => {
    let interval;
    if (playing && started && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1100 - speed);
    }
    return () => clearInterval(interval);
  }, [playing, started, currentStep, steps.length, speed]);

  const currentStepData = steps[currentStep] || {
    description: "Enter two strings and click 'Find LCS'",
    dp: [],
    currentI: -1,
    currentJ: -1,
    comparing: null,
    lcsLength: 0,
    lcsString: "",
    action: 'ready'
  };

  // Canvas drawing effect
  useEffect(() => {
    if (!canvasRef.current || !currentStepData.dp.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cellSize = 40;
    const startX = 100;
    const startY = 100;
    const m = string1.length;
    const n = string2.length;

    // Draw grid
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    
    // Draw table structure
    for (let i = 0; i <= m + 1; i++) {
      for (let j = 0; j <= n + 1; j++) {
        const x = startX + j * cellSize;
        const y = startY + i * cellSize;
        
        // Cell background
        let fillColor = '#334155';
        if (i === currentStepData.currentI && j === currentStepData.currentJ) {
          fillColor = '#8b5cf6'; // Current cell
        } else if (i === 0 || j === 0) {
          fillColor = '#475569'; // Header cells
        }
        
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }

    // Draw string1 characters (vertical header)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < string1.length; i++) {
      const x = startX + cellSize / 2;
      const y = startY + (i + 2) * cellSize + cellSize / 2;
      ctx.fillText(string1[i], x, y);
    }

    // Draw string2 characters (horizontal header)
    for (let j = 0; j < string2.length; j++) {
      const x = startX + (j + 2) * cellSize + cellSize / 2;
      const y = startY + cellSize + cellSize / 2;
      ctx.fillText(string2[j], x, y);
    }

    // Draw DP values
    ctx.font = 'bold 14px monospace';
    for (let i = 0; i <= m; i++) {
      for (let j = 0; j <= n; j++) {
        const x = startX + (j + 1) * cellSize + cellSize / 2;
        const y = startY + (i + 1) * cellSize + cellSize / 2;
        const value = currentStepData.dp[i] ? currentStepData.dp[i][j] : 0;
        
        // Highlight current cell value
        if (i === currentStepData.currentI - 1 && j === currentStepData.currentJ - 1) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = '#e2e8f0';
        }
        
        ctx.fillText(value.toString(), x, y);
      }
    }

    // Draw comparison arrows and characters
    if (currentStepData.comparing) {
      const [char1, char2] = currentStepData.comparing;
      const i = currentStepData.currentI;
      const j = currentStepData.currentJ;
      
      // Highlight comparing characters
      ctx.fillStyle = currentStepData.action === 'match' ? '#22c55e' : '#ef4444';
      ctx.font = 'bold 18px monospace';
      
      // Character from string1
      const char1X = startX + cellSize / 2;
      const char1Y = startY + (i + 1) * cellSize + cellSize / 2;
      ctx.fillText(char1, char1X, char1Y);
      
      // Character from string2
      const char2X = startX + (j + 1) * cellSize + cellSize / 2;
      const char2Y = startY + cellSize + cellSize / 2;
      ctx.fillText(char2, char2X, char2Y);
    }

    // Draw LCS string if available
    if (currentStepData.lcsString) {
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'left';
      const lcsY = startY + (m + 3) * cellSize;
      ctx.fillText(`LCS: "${currentStepData.lcsString}"`, startX, lcsY);
    }

    // Draw current operation info
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    const infoY = startY - 40;
    
    if (currentStepData.comparing) {
      const [char1, char2] = currentStepData.comparing;
      const comparison = currentStepData.action === 'match' ? '=' : '≠';
      ctx.fillText(`Comparing: ${char1} ${comparison} ${char2}`, startX, infoY);
    }

  }, [currentStepData, string1, string2]);

  const lcsCode = `function longestCommonSubsequence(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  
  // Create DP table
  const dp = Array(m + 1).fill(null)
    .map(() => Array(n + 1).fill(0));
  
  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        // Characters match
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // Characters don't match
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // Backtrack to find LCS string
  let lcs = "";
  let i = m, j = n;
  
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcs = str1[i - 1] + lcs;
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return { length: dp[m][n], sequence: lcs };
}`;

  const exampleStrings = [
    ["ABCDGH", "AEDFHR"],
    ["AGGTAB", "GXTXAYB"],
    ["ABCDEF", "FBDAMN"],
    ["DYNAMIC", "PROGRAMMING"],
    ["HELLO", "WORLD"]
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <Alert {...alertConfig} />
      
      {/* Header */}
      <div className="bg-slate-800 border-b border-purple-500 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Longest Common Subsequence</h1>
            <p className="text-gray-400 text-sm">
              Time: O(mn) | Space: O(mn) | Dynamic Programming
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* String Inputs */}
              <div>
                <label className="block text-sm font-medium mb-2">String 1</label>
                <input
                  type="text"
                  value={string1}
                  onChange={(e) => {
                    setString1(e.target.value.toUpperCase());
                    resetVisualization();
                  }}
                  className="w-full p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none font-mono"
                  placeholder="Enter first string..."
                  disabled={playing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">String 2</label>
                <input
                  type="text"
                  value={string2}
                  onChange={(e) => {
                    setString2(e.target.value.toUpperCase());
                    resetVisualization();
                  }}
                  className="w-full p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none font-mono"
                  placeholder="Enter second string..."
                  disabled={playing}
                />
              </div>

              {/* Example Pairs */}
              <div>
                <label className="block text-sm font-medium mb-2">Example Pairs</label>
                <div className="space-y-2">
                  {exampleStrings.map(([str1, str2], index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setString1(str1);
                        setString2(str2);
                        resetVisualization();
                      }}
                      disabled={playing}
                      className="w-full text-left p-2 bg-slate-700 rounded text-xs hover:bg-slate-600 disabled:opacity-50 transition-colors font-mono"
                    >
                      "{str1}" & "{str2}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={startLCS}
                  disabled={playing || !string1 || !string2}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Hash className="w-4 h-4" />
                  <span>Find LCS</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={pauseResume}
                    disabled={!started}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{playing ? 'Pause' : 'Resume'}</span>
                  </button>
                  
                  <button
                    onClick={stepForward}
                    disabled={!started || currentStep >= steps.length - 1}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>Step</span>
                  </button>
                </div>

                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Speed Control */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Speed: {Math.round((speed / 1000) * 100)}%
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Results */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Results</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">LCS Length:</span>
                    <span className="text-green-400 font-mono">{currentStepData.lcsLength || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">LCS String:</span>
                    <span className="text-blue-400 font-mono">
                      "{currentStepData.lcsString || ''}"
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Input Lengths:</span>
                    <span className="text-gray-300 font-mono">{string1.length} × {string2.length}</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Current Cell</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Characters Match</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Characters Don't Match</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-600 rounded border border-gray-500"></div>
                    <span>Header/Empty Cell</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* Middle Panel - Visualization */}
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full bg-slate-900 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-5xl">
              {/* Description */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">LCS Dynamic Programming Table</h2>
                <p className="text-gray-400">{currentStepData.description}</p>
              </div>

              {/* Canvas Visualization */}
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-700 rounded-lg bg-slate-800/50"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>

              {/* Progress */}
              {started && (
                <div className="mt-8">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{currentStep + 1} / {steps.length}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>

        {/* Right Panel - Code & Info */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-l border-purple-500">
            {/* Tabs */}
            <div className="flex border-b border-slate-600">
              <button
                onClick={() => setActiveRightTab("code")}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeRightTab === "code"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Code2 className="w-4 h-4 inline mr-2" />
                Code
              </button>
              <button
                onClick={() => setActiveRightTab("info")}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeRightTab === "info"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Info
              </button>
            </div>

            <div className="p-6 h-full overflow-y-auto">
              {activeRightTab === "code" ? (
                <BasicCodeDisplay
                  code={lcsCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Longest Common Subsequence</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      The LCS problem finds the longest subsequence common to two sequences. 
                      A subsequence maintains relative order but need not be contiguous.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Algorithm Steps:</h4>
                    <ol className="text-sm space-y-1 text-gray-300 list-decimal list-inside">
                      <li>Create a DP table of size (m+1) × (n+1)</li>
                      <li>Initialize first row and column with 0</li>
                      <li>For each cell, if characters match: dp[i][j] = dp[i-1][j-1] + 1</li>
                      <li>If not: dp[i][j] = max(dp[i-1][j], dp[i][j-1])</li>
                      <li>Backtrack to construct the LCS string</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Complexity Analysis:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-yellow-400 font-mono">O(m × n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space:</span>
                        <span className="text-red-400 font-mono">O(m × n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space Optimized:</span>
                        <span className="text-blue-400 font-mono">O(min(m, n))</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      m, n = lengths of input strings
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Properties:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Subsequence vs Substring: order preserved, not contiguous</li>
                      <li>• Optimal substructure: LCS(i,j) depends on LCS(i-1,j-1)</li>
                      <li>• Overlapping subproblems: same subproblems solved multiple times</li>
                      <li>• Bottom-up approach builds solution incrementally</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Applications:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Diff tools (file comparison)</li>
                      <li>• DNA sequence analysis</li>
                      <li>• Version control systems</li>
                      <li>• Data compression</li>
                      <li>• Text similarity measurement</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Variations:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Longest Common Substring (must be contiguous)</li>
                      <li>• Longest Increasing Subsequence</li>
                      <li>• Multiple sequence LCS</li>
                      <li>• Weighted LCS</li>
                    </ul>
                  </div>

                  {started && (
                    <div>
                      <h4 className="font-medium mb-2">Current Execution:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Action:</span>
                          <span className="text-white font-mono capitalize">{currentStepData.action?.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Position:</span>
                          <span className="text-purple-400 font-mono">
                            [{currentStepData.currentI}][{currentStepData.currentJ}]
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">LCS Length:</span>
                          <span className="text-green-400 font-mono">{currentStepData.lcsLength || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default LCS;
