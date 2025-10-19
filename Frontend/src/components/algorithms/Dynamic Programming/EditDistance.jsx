import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  GitBranch, Edit3, FileText, Type, Zap, ArrowRight, ArrowDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const EditDistance = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Input state
  const [string1, setString1] = useState("SUNDAY");
  const [string2, setString2] = useState("SATURDAY");
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(800);
  
  // Algorithm state
  const [dpTable, setDpTable] = useState([]);
  const [editDistance, setEditDistance] = useState(0);
  const [operations, setOperations] = useState([]);
  
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
    setEditDistance(0);
    setOperations([]);
    setCurrentHighlightedLine(null);
  };

  const generateEditDistanceSteps = () => {
    const m = string1.length;
    const n = string2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    const steps = [];

    // Initialize base cases
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    steps.push({
      type: 'initialization',
      description: `Initializing DP table for strings "${string1}" and "${string2}"`,
      dp: dp.map(row => [...row]),
      currentI: -1,
      currentJ: -1,
      operation: null,
      action: 'initialize',
      editDistance: 0,
      explanation: 'Base cases: converting empty string to any string requires insertions'
    });

    // Fill the DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = string1[i - 1];
        const char2 = string2[j - 1];
        
        if (char1 === char2) {
          dp[i][j] = dp[i - 1][j - 1];
          steps.push({
            type: 'match',
            description: `Characters match: ${char1} = ${char2}, no operation needed. dp[${i}][${j}] = dp[${i-1}][${j-1}] = ${dp[i][j]}`,
            dp: dp.map(row => [...row]),
            currentI: i,
            currentJ: j,
            operation: 'match',
            action: 'match',
            editDistance: dp[i][j],
            explanation: `Characters match, inherit previous result`,
            char1: char1,
            char2: char2
          });
        } else {
          const insert = dp[i][j - 1] + 1;      // Insert char2
          const delete_ = dp[i - 1][j] + 1;     // Delete char1
          const replace = dp[i - 1][j - 1] + 1; // Replace char1 with char2
          
          const minCost = Math.min(insert, delete_, replace);
          dp[i][j] = minCost;
          
          let operation = '';
          if (minCost === replace) {
            operation = 'replace';
          } else if (minCost === insert) {
            operation = 'insert';
          } else {
            operation = 'delete';
          }
          
          steps.push({
            type: 'operation',
            description: `Characters don't match: ${char1} ≠ ${char2}. Operations: Insert(${insert}), Delete(${delete_}), Replace(${replace}). Choose ${operation} with cost ${minCost}`,
            dp: dp.map(row => [...row]),
            currentI: i,
            currentJ: j,
            operation: operation,
            action: 'operation',
            editDistance: dp[i][j],
            explanation: `Choose minimum cost operation`,
            char1: char1,
            char2: char2,
            costs: { insert, delete: delete_, replace }
          });
        }
      }
    }

    // Backtrack to find operations
    const operationsList = [];
    let i = m, j = n;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && string1[i - 1] === string2[j - 1]) {
        operationsList.unshift({ type: 'match', char: string1[i - 1], pos: i - 1 });
        i--;
        j--;
      } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
        operationsList.unshift({ 
          type: 'replace', 
          from: string1[i - 1], 
          to: string2[j - 1], 
          pos: i - 1 
        });
        i--;
        j--;
      } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
        operationsList.unshift({ 
          type: 'delete', 
          char: string1[i - 1], 
          pos: i - 1 
        });
        i--;
      } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
        operationsList.unshift({ 
          type: 'insert', 
          char: string2[j - 1], 
          pos: i 
        });
        j--;
      }
    }

    steps.push({
      type: 'complete',
      description: `Edit distance: ${dp[m][n]}. Required operations: ${operationsList.length - operationsList.filter(op => op.type === 'match').length}`,
      dp: dp.map(row => [...row]),
      currentI: m,
      currentJ: n,
      operation: 'complete',
      action: 'complete',
      editDistance: dp[m][n],
      operations: operationsList,
      explanation: 'Algorithm complete! Backtracked to find operation sequence.'
    });

    return steps;
  };

  const startEditDistance = () => {
    if (!string1 || !string2) return;
    
    const editDistanceSteps = generateEditDistanceSteps();
    setSteps(editDistanceSteps);
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
    setString1("SUNDAY");
    setString2("SATURDAY");
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
    description: "Enter two strings and click 'Calculate Edit Distance'",
    dp: [],
    currentI: -1,
    currentJ: -1,
    operation: null,
    editDistance: 0,
    operations: [],
    action: 'ready',
    explanation: ''
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
    const startX = 80;
    const startY = 80;
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
      
      // Highlight if current character
      if (i === currentStepData.currentI - 1) {
        ctx.fillStyle = '#8b5cf6';
      } else {
        ctx.fillStyle = '#ffffff';
      }
      
      ctx.fillText(string1[i], x, y);
    }

    // Draw string2 characters (horizontal header)
    for (let j = 0; j < string2.length; j++) {
      const x = startX + (j + 2) * cellSize + cellSize / 2;
      const y = startY + cellSize + cellSize / 2;
      
      // Highlight if current character
      if (j === currentStepData.currentJ - 1) {
        ctx.fillStyle = '#8b5cf6';
      } else {
        ctx.fillStyle = '#ffffff';
      }
      
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

    // Draw operation info
    if (currentStepData.operation && currentStepData.char1 && currentStepData.char2) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'left';
      const infoY = startY + (m + 3) * cellSize;
      
      const operationColor = {
        'match': '#22c55e',
        'replace': '#f59e0b',
        'insert': '#3b82f6',
        'delete': '#ef4444'
      };
      
      ctx.fillStyle = operationColor[currentStepData.operation] || '#ffffff';
      
      let operationText = '';
      switch (currentStepData.operation) {
        case 'match':
          operationText = `Match: '${currentStepData.char1}' = '${currentStepData.char2}'`;
          break;
        case 'replace':
          operationText = `Replace: '${currentStepData.char1}' → '${currentStepData.char2}'`;
          break;
        case 'insert':
          operationText = `Insert: '${currentStepData.char2}'`;
          break;
        case 'delete':
          operationText = `Delete: '${currentStepData.char1}'`;
          break;
      }
      
      ctx.fillText(operationText, startX, infoY);
    }

    // Draw costs if available
    if (currentStepData.costs) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.textAlign = 'left';
      const costsY = startY + (m + 4) * cellSize;
      
      ctx.fillText(
        `Costs: Insert(${currentStepData.costs.insert}) Delete(${currentStepData.costs.delete}) Replace(${currentStepData.costs.replace})`,
        startX,
        costsY
      );
    }

    // Draw operations sequence if available
    if (currentStepData.operations && currentStepData.operations.length > 0) {
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      const opsY = startY + (m + 5) * cellSize;
      
      ctx.fillText('Operations Sequence:', startX, opsY);
      
      const nonMatchOps = currentStepData.operations.filter(op => op.type !== 'match');
      nonMatchOps.forEach((op, index) => {
        const opY = opsY + 25 + index * 20;
        ctx.font = '12px monospace';
        ctx.fillStyle = '#e2e8f0';
        
        let opText = '';
        switch (op.type) {
          case 'replace':
            opText = `${index + 1}. Replace '${op.from}' with '${op.to}'`;
            break;
          case 'insert':
            opText = `${index + 1}. Insert '${op.char}'`;
            break;
          case 'delete':
            opText = `${index + 1}. Delete '${op.char}'`;
            break;
        }
        
        ctx.fillText(opText, startX, opY);
      });
    }

    // Draw explanation
    if (currentStepData.explanation) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(currentStepData.explanation, startX, startY - 20);
    }

  }, [currentStepData, string1, string2]);

  const editDistanceCode = `function editDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  
  // Create DP table
  const dp = Array(m + 1).fill(null)
    .map(() => Array(n + 1).fill(0));
  
  // Initialize base cases
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i; // Delete all characters from str1
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j; // Insert all characters of str2
  }
  
  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        // Characters match, no operation needed
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // Characters don't match, try all operations
        const insert = dp[i][j - 1] + 1;      // Insert
        const delete_ = dp[i - 1][j] + 1;     // Delete
        const replace = dp[i - 1][j - 1] + 1; // Replace
        
        dp[i][j] = Math.min(insert, delete_, replace);
      }
    }
  }
  
  return dp[m][n];
}

// To get the actual operations:
function getEditOperations(str1, str2) {
  // ... (build DP table same as above)
  
  // Backtrack to find operations
  const operations = [];
  let i = m, j = n;
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && str1[i-1] === str2[j-1]) {
      i--; j--; // Match, no operation
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i-1][j-1] + 1) {
      operations.unshift(\`Replace '\${str1[i-1]}' with '\${str2[j-1]}'\`);
      i--; j--;
    } else if (i > 0 && dp[i][j] === dp[i-1][j] + 1) {
      operations.unshift(\`Delete '\${str1[i-1]}'\`);
      i--;
    } else {
      operations.unshift(\`Insert '\${str2[j-1]}'\`);
      j--;
    }
  }
  
  return operations;
}`;

  const exampleStrings = [
    ["SUNDAY", "SATURDAY"],
    ["KITTEN", "SITTING"],
    ["INTENTION", "EXECUTION"],
    ["DISTANCE", "EDITING"],
    ["HELLO", "YELLOW"]
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
          <div className="bg-orange-600 p-2 rounded-lg">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Edit Distance (Levenshtein)</h1>
            <p className="text-gray-400 text-sm">
              Time: O(m×n) | Space: O(m×n) | Dynamic Programming
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
                      "{str1}" → "{str2}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={startEditDistance}
                  disabled={playing || !string1 || !string2}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Calculate Edit Distance</span>
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
                    <span className="text-gray-400">Edit Distance:</span>
                    <span className="text-green-400 font-mono">{currentStepData.editDistance || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Operations:</span>
                    <span className="text-blue-400 font-mono">
                      {currentStepData.operations ? 
                        currentStepData.operations.filter(op => op.type !== 'match').length : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">String Lengths:</span>
                    <span className="text-gray-300 font-mono">{string1.length} × {string2.length}</span>
                  </div>
                </div>
              </div>

              {/* Operation Colors */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Operation Colors</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Match (no cost)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Replace (cost: 1)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Insert (cost: 1)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Delete (cost: 1)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Current Cell</span>
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
                <h2 className="text-xl font-semibold mb-2">Edit Distance DP Table</h2>
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
                  code={editDistanceCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Edit Distance (Levenshtein)</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      The minimum number of single-character edits (insertions, deletions, 
                      or substitutions) required to transform one string into another.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Algorithm Steps:</h4>
                    <ol className="text-sm space-y-1 text-gray-300 list-decimal list-inside">
                      <li>Create (m+1) × (n+1) DP table</li>
                      <li>Initialize base cases: dp[i][0] = i, dp[0][j] = j</li>
                      <li>For each cell, if characters match: dp[i][j] = dp[i-1][j-1]</li>
                      <li>If not: dp[i][j] = 1 + min(insert, delete, replace)</li>
                      <li>Result is dp[m][n]</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Operations:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-400">Match:</span>
                        <span className="text-gray-300">dp[i-1][j-1] (cost: 0)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-400">Replace:</span>
                        <span className="text-gray-300">dp[i-1][j-1] + 1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-400">Insert:</span>
                        <span className="text-gray-300">dp[i][j-1] + 1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-400">Delete:</span>
                        <span className="text-gray-300">dp[i-1][j] + 1</span>
                      </div>
                    </div>
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
                    <h4 className="font-medium mb-2">Applications:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Spell checkers and autocorrect</li>
                      <li>• DNA sequence alignment</li>
                      <li>• Plagiarism detection</li>
                      <li>• Data deduplication</li>
                      <li>• Version control systems</li>
                      <li>• Speech recognition</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Variations:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Weighted edit distance (different operation costs)</li>
                      <li>• Restricted edit distance (limited operations)</li>
                      <li>• Damerau-Levenshtein (includes transposition)</li>
                      <li>• Longest Common Subsequence (LCS)</li>
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
                          <span className="text-gray-400">Edit Distance:</span>
                          <span className="text-green-400 font-mono">{currentStepData.editDistance || 0}</span>
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

export default EditDistance;
