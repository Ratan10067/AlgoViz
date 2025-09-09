import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  GitBranch, Calculator, Grid3X3, Zap, Plus, X, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const MatrixChainMult = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Input state - array of matrix dimensions
  const [matrices, setMatrices] = useState([
    { rows: 1, cols: 5, name: 'A' },
    { rows: 5, cols: 4, name: 'B' },
    { rows: 4, cols: 6, name: 'C' },
    { rows: 6, cols: 2, name: 'D' }
  ]);
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(800);
  
  // Algorithm state
  const [dpTable, setDpTable] = useState([]);
  const [splitTable, setSplitTable] = useState([]);
  const [minCost, setMinCost] = useState(0);
  const [optimalParentheses, setOptimalParentheses] = useState("");
  
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
    setSplitTable([]);
    setMinCost(0);
    setOptimalParentheses("");
    setCurrentHighlightedLine(null);
  };

  const addMatrix = () => {
    const lastMatrix = matrices[matrices.length - 1];
    const newName = String.fromCharCode(65 + matrices.length); // A, B, C, D, ...
    setMatrices([...matrices, { 
      rows: lastMatrix.cols, 
      cols: Math.floor(Math.random() * 8) + 2, 
      name: newName 
    }]);
    resetVisualization();
  };

  const removeMatrix = (index) => {
    if (matrices.length <= 2) return;
    const newMatrices = matrices.filter((_, i) => i !== index);
    // Update names
    const updatedMatrices = newMatrices.map((matrix, i) => ({
      ...matrix,
      name: String.fromCharCode(65 + i)
    }));
    setMatrices(updatedMatrices);
    resetVisualization();
  };

  const updateMatrix = (index, field, value) => {
    const newMatrices = [...matrices];
    const numValue = parseInt(value) || 1;
    newMatrices[index][field] = Math.max(1, Math.min(20, numValue));
    
    // Ensure matrix multiplication compatibility
    if (field === 'cols' && index < matrices.length - 1) {
      newMatrices[index + 1].rows = newMatrices[index].cols;
    }
    if (field === 'rows' && index > 0) {
      newMatrices[index - 1].cols = newMatrices[index].rows;
    }
    
    setMatrices(newMatrices);
    resetVisualization();
  };

  const generateMatrixChainSteps = () => {
    const n = matrices.length;
    if (n < 2) return [];

    // Convert matrices to dimensions array
    const dims = [matrices[0].rows];
    matrices.forEach(matrix => dims.push(matrix.cols));
    
    const dp = Array(n).fill(null).map(() => Array(n).fill(0));
    const split = Array(n).fill(null).map(() => Array(n).fill(0));
    const steps = [];

    // Initialize single matrices (no cost)
    steps.push({
      type: 'initialization',
      description: `Initializing DP table for ${n} matrices. Single matrices have 0 multiplication cost.`,
      dp: dp.map(row => [...row]),
      split: split.map(row => [...row]),
      currentI: -1,
      currentJ: -1,
      currentK: -1,
      chainLength: 1,
      cost: 0,
      explanation: 'Single matrices require no multiplication operations',
      action: 'initialize'
    });

    // Fill DP table for chains of increasing length
    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        dp[i][j] = Infinity;
        
        for (let k = i; k < j; k++) {
          const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
          
          steps.push({
            type: 'calculation',
            description: `Chain length ${len}: Computing cost for ${matrices.slice(i, j+1).map(m => m.name).join('')} with split at ${matrices[k].name}|${matrices[k+1].name}`,
            dp: dp.map(row => [...row]),
            split: split.map(row => [...row]),
            currentI: i,
            currentJ: j,
            currentK: k,
            chainLength: len,
            cost: cost,
            explanation: `Cost = left_cost + right_cost + scalar_mult = ${dp[i][k]} + ${dp[k+1][j]} + ${dims[i] * dims[k+1] * dims[j+1]}`,
            action: 'calculate',
            leftCost: dp[i][k],
            rightCost: dp[k + 1][j],
            scalarCost: dims[i] * dims[k + 1] * dims[j + 1],
            dimensions: `${dims[i]}×${dims[k+1]} × ${dims[k+1]}×${dims[j+1]} = ${dims[i]}×${dims[j+1]}`
          });
          
          if (cost < dp[i][j]) {
            dp[i][j] = cost;
            split[i][j] = k;
            
            steps.push({
              type: 'update',
              description: `New minimum found! Updated dp[${i}][${j}] = ${cost}, split at position ${k}`,
              dp: dp.map(row => [...row]),
              split: split.map(row => [...row]),
              currentI: i,
              currentJ: j,
              currentK: k,
              chainLength: len,
              cost: cost,
              explanation: `This split gives the minimum cost for this subchain`,
              action: 'update',
              isMinimum: true
            });
          }
        }
      }
    }

    // Generate optimal parenthesization
    const getParentheses = (split, i, j) => {
      if (i === j) {
        return matrices[i].name;
      }
      const k = split[i][j];
      return `(${getParentheses(split, i, k)} × ${getParentheses(split, k + 1, j)})`;
    };

    const finalParentheses = getParentheses(split, 0, n - 1);

    steps.push({
      type: 'complete',
      description: `Algorithm complete! Minimum cost: ${dp[0][n-1]} scalar multiplications`,
      dp: dp.map(row => [...row]),
      split: split.map(row => [...row]),
      currentI: 0,
      currentJ: n - 1,
      currentK: -1,
      chainLength: n,
      cost: dp[0][n - 1],
      explanation: `Optimal parenthesization: ${finalParentheses}`,
      action: 'complete',
      parentheses: finalParentheses,
      totalCost: dp[0][n - 1]
    });

    return steps;
  };

  const startMatrixChain = () => {
    if (matrices.length < 2) return;
    
    // Validate matrix dimensions for multiplication
    for (let i = 0; i < matrices.length - 1; i++) {
      if (matrices[i].cols !== matrices[i + 1].rows) {
        setAlertConfig({
          isOpen: true,
          message: `Matrix ${matrices[i].name} (${matrices[i].rows}×${matrices[i].cols}) cannot be multiplied with Matrix ${matrices[i+1].name} (${matrices[i+1].rows}×${matrices[i+1].cols}). Columns of first matrix must equal rows of second matrix.`,
          type: "error"
        });
        return;
      }
    }
    
    const chainSteps = generateMatrixChainSteps();
    setSteps(chainSteps);
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
    setMatrices([
      { rows: 1, cols: 5, name: 'A' },
      { rows: 5, cols: 4, name: 'B' },
      { rows: 4, cols: 6, name: 'C' },
      { rows: 6, cols: 2, name: 'D' }
    ]);
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
    description: "Add matrices and click 'Find Optimal Multiplication Order'",
    dp: [],
    split: [],
    currentI: -1,
    currentJ: -1,
    currentK: -1,
    chainLength: 0,
    cost: 0,
    action: 'ready',
    explanation: ''
  };

  // Canvas drawing effect
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 900;
    canvas.height = 700;
    
    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (!currentStepData.dp.length) {
      // Draw matrices overview
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Matrix Chain Multiplication', canvas.width / 2, 40);
      
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Add matrices and start the algorithm to see the DP table visualization', canvas.width / 2, 70);
      
      // Draw matrix chain
      const matrixWidth = 80;
      const matrixHeight = 60;
      const spacing = 20;
      const startX = (canvas.width - (matrices.length * matrixWidth + (matrices.length - 1) * spacing)) / 2;
      const startY = 150;
      
      matrices.forEach((matrix, index) => {
        const x = startX + index * (matrixWidth + spacing);
        const y = startY;
        
        // Matrix rectangle
        ctx.fillStyle = '#334155';
        ctx.fillRect(x, y, matrixWidth, matrixHeight);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, matrixWidth, matrixHeight);
        
        // Matrix name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(matrix.name, x + matrixWidth / 2, y + 25);
        
        // Matrix dimensions
        ctx.font = '12px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`${matrix.rows}×${matrix.cols}`, x + matrixWidth / 2, y + 45);
        
        // Multiplication symbol
        if (index < matrices.length - 1) {
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText('×', x + matrixWidth + spacing / 2, y + matrixHeight / 2 + 5);
        }
      });
      
      return;
    }
    
    const n = matrices.length;
    const cellSize = 50;
    const startX = 50;
    const startY = 100;

    // Draw DP table
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const x = startX + j * cellSize;
        const y = startY + i * cellSize;
        
        // Cell background
        let fillColor = '#334155';
        if (i === currentStepData.currentI && j === currentStepData.currentJ) {
          fillColor = '#8b5cf6'; // Current cell
        } else if (i > j) {
          fillColor = '#1e293b'; // Unused cells
        } else if (i === j) {
          fillColor = '#22c55e'; // Diagonal (single matrices)
        }
        
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        // Cell value
        if (i <= j) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const value = currentStepData.dp[i] ? currentStepData.dp[i][j] : 0;
          ctx.fillText(value === Infinity ? '∞' : value.toString(), x + cellSize / 2, y + cellSize / 2);
        }
      }
    }

    // Draw matrix labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    
    // Row labels
    for (let i = 0; i < n; i++) {
      const matrixName = matrices[i].name;
      ctx.fillText(matrixName, startX - 20, startY + i * cellSize + cellSize / 2);
    }
    
    // Column labels
    for (let j = 0; j < n; j++) {
      const matrixName = matrices[j].name;
      ctx.fillText(matrixName, startX + j * cellSize + cellSize / 2, startY - 20);
    }

    // Draw split information
    if (currentStepData.currentK >= 0) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'left';
      const infoX = startX + n * cellSize + 30;
      const infoY = startY + 20;
      
      ctx.fillText(`Current Split: ${matrices[currentStepData.currentK].name}|${matrices[currentStepData.currentK + 1].name}`, infoX, infoY);
      ctx.fillText(`Chain: ${matrices.slice(currentStepData.currentI, currentStepData.currentJ + 1).map(m => m.name).join('')}`, infoX, infoY + 25);
      
      if (currentStepData.dimensions) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px monospace';
        ctx.fillText(`Dimensions: ${currentStepData.dimensions}`, infoX, infoY + 50);
      }
      
      if (currentStepData.leftCost !== undefined) {
        ctx.fillStyle = '#22c55e';
        ctx.fillText(`Left Cost: ${currentStepData.leftCost}`, infoX, infoY + 75);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText(`Right Cost: ${currentStepData.rightCost}`, infoX, infoY + 95);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`Scalar Cost: ${currentStepData.scalarCost}`, infoX, infoY + 115);
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`Total Cost: ${currentStepData.cost}`, infoX, infoY + 135);
      }
    }

    // Draw legend
    const legendX = startX;
    const legendY = startY + n * cellSize + 40;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Legend:', legendX, legendY);
    
    const legendItems = [
      { color: '#22c55e', label: 'Single Matrix (cost = 0)' },
      { color: '#8b5cf6', label: 'Current Cell' },
      { color: '#334155', label: 'Computed Cell' },
      { color: '#1e293b', label: 'Unused Cell' }
    ];
    
    legendItems.forEach((item, index) => {
      const y = legendY + 25 + index * 20;
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, y - 8, 15, 15);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.fillText(item.label, legendX + 25, y);
    });

    // Draw algorithm info
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    const algoY = legendY + 120;
    
    ctx.fillText(`Chain Length: ${currentStepData.chainLength}`, legendX, algoY);
    ctx.fillText(`Current Cost: ${currentStepData.cost === Infinity ? '∞' : currentStepData.cost}`, legendX, algoY + 20);
    
    if (currentStepData.parentheses) {
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`Optimal: ${currentStepData.parentheses}`, legendX, algoY + 50);
    }

    // Draw explanation
    if (currentStepData.explanation) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      const maxWidth = 400;
      const lines = currentStepData.explanation.match(/.{1,50}/g) || [currentStepData.explanation];
      lines.forEach((line, index) => {
        ctx.fillText(line, startX, startY - 60 + index * 15);
      });
    }

  }, [currentStepData, matrices]);

  const matrixChainCode = `function matrixChainOrder(matrices) {
  const n = matrices.length;
  // dimensions[i] = rows of matrix i, dimensions[i+1] = cols of matrix i
  const dimensions = [matrices[0].rows];
  matrices.forEach(m => dimensions.push(m.cols));
  
  // dp[i][j] = minimum cost to multiply matrices from i to j
  const dp = Array(n).fill(null).map(() => Array(n).fill(0));
  // split[i][j] = optimal split point for chain i to j
  const split = Array(n).fill(null).map(() => Array(n).fill(0));
  
  // Fill table for chains of increasing length
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      
      // Try all possible split points
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k+1][j] + 
                    dimensions[i] * dimensions[k+1] * dimensions[j+1];
        
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          split[i][j] = k;
        }
      }
    }
  }
  
  return {
    minCost: dp[0][n-1],
    parentheses: getParentheses(split, 0, n-1)
  };
}

function getParentheses(split, i, j) {
  if (i === j) {
    return \`M\${i}\`;
  }
  const k = split[i][j];
  return \`(\${getParentheses(split, i, k)} × \${getParentheses(split, k+1, j)})\`;
}

// Cost calculation for scalar multiplication:
// To multiply A(p×q) and B(q×r): cost = p × q × r
// For chain A₁A₂...Aₙ: find optimal way to parenthesize
// 
// Example: A(1×5) × B(5×4) × C(4×6) × D(6×2)
// Different parenthesizations:
// ((AB)C)D: (1×5×4) + (1×4×6) + (1×6×2) = 20 + 24 + 12 = 56
// (A(BC))D: (5×4×6) + (1×5×6) + (1×6×2) = 120 + 30 + 12 = 162
// A((BC)D): (4×6×2) + (5×4×2) + (1×5×2) = 48 + 40 + 10 = 98
// A(B(CD)): (6×2×4) + (5×6×4) + (1×5×4) = 48 + 120 + 20 = 188
// (AB)(CD): (1×5×4) + (6×2×4) + (1×4×2) = 20 + 48 + 8 = 76`;

  const exampleSets = [
    [
      { rows: 1, cols: 5, name: 'A' },
      { rows: 5, cols: 4, name: 'B' },
      { rows: 4, cols: 6, name: 'C' },
      { rows: 6, cols: 2, name: 'D' }
    ],
    [
      { rows: 10, cols: 20, name: 'A' },
      { rows: 20, cols: 30, name: 'B' },
      { rows: 30, cols: 40, name: 'C' }
    ],
    [
      { rows: 2, cols: 3, name: 'A' },
      { rows: 3, cols: 6, name: 'B' },
      { rows: 6, cols: 4, name: 'C' },
      { rows: 4, cols: 5, name: 'D' },
      { rows: 5, cols: 2, name: 'E' }
    ]
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
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Matrix Chain Multiplication</h1>
            <p className="text-gray-400 text-sm">
              Time: O(n³) | Space: O(n²) | Dynamic Programming
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Matrix Management */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium">Matrix Chain</label>
                  <button
                    onClick={addMatrix}
                    disabled={playing || matrices.length >= 8}
                    className="flex items-center space-x-1 px-2 py-1 bg-green-600 rounded text-xs hover:bg-green-500 disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {matrices.map((matrix, index) => (
                    <div key={index} className="bg-slate-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm">{matrix.name}</span>
                        <button
                          onClick={() => removeMatrix(index)}
                          disabled={playing || matrices.length <= 2}
                          className="text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <input
                          type="number"
                          value={matrix.rows}
                          onChange={(e) => updateMatrix(index, 'rows', e.target.value)}
                          disabled={playing}
                          className="w-full p-1 bg-slate-600 rounded text-xs text-center border border-gray-600 focus:border-purple-500 focus:outline-none"
                          min="1"
                          max="20"
                        />
                        <X className="w-3 h-3 text-gray-400 justify-self-center" />
                        <input
                          type="number"
                          value={matrix.cols}
                          onChange={(e) => updateMatrix(index, 'cols', e.target.value)}
                          disabled={playing}
                          className="w-full p-1 bg-slate-600 rounded text-xs text-center border border-gray-600 focus:border-purple-500 focus:outline-none"
                          min="1"
                          max="20"
                        />
                      </div>
                      {index < matrices.length - 1 && (
                        <div className="text-center mt-2">
                          <span className="text-yellow-400 font-bold">×</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Sets */}
              <div>
                <label className="block text-sm font-medium mb-2">Example Sets</label>
                <div className="space-y-2">
                  {exampleSets.map((set, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setMatrices(set.map(m => ({ ...m })));
                        resetVisualization();
                      }}
                      disabled={playing}
                      className="w-full text-left p-2 bg-slate-700 rounded text-xs hover:bg-slate-600 disabled:opacity-50 transition-colors"
                    >
                      {set.map(m => `${m.name}(${m.rows}×${m.cols})`).join(' × ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={startMatrixChain}
                  disabled={playing || matrices.length < 2}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Find Optimal Order</span>
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
                    <span className="text-gray-400">Min Cost:</span>
                    <span className="text-green-400 font-mono">{currentStepData.totalCost || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Matrices:</span>
                    <span className="text-blue-400 font-mono">{matrices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Chain Length:</span>
                    <span className="text-purple-400 font-mono">{currentStepData.chainLength || 0}</span>
                  </div>
                  {currentStepData.parentheses && (
                    <div className="mt-2 pt-2 border-t border-slate-600">
                      <span className="text-gray-400 text-xs">Optimal Parentheses:</span>
                      <div className="text-green-400 font-mono text-xs mt-1 break-all">
                        {currentStepData.parentheses}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Matrix Info */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Matrix Chain Info</h3>
                <div className="space-y-1 text-xs">
                  {matrices.map((matrix, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-400">{matrix.name}:</span>
                      <span className="text-gray-300 font-mono">{matrix.rows}×{matrix.cols}</span>
                    </div>
                  ))}
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
                <h2 className="text-xl font-semibold mb-2">Matrix Chain Multiplication DP Table</h2>
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
                  code={matrixChainCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Matrix Chain Multiplication</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Find the optimal way to parenthesize a chain of matrix multiplications 
                      to minimize the number of scalar multiplications required.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Algorithm Steps:</h4>
                    <ol className="text-sm space-y-1 text-gray-300 list-decimal list-inside">
                      <li>Create n×n DP table where dp[i][j] = min cost for chain i to j</li>
                      <li>Initialize diagonal to 0 (single matrices have no cost)</li>
                      <li>Fill table for increasing chain lengths (2 to n)</li>
                      <li>For each chain, try all possible split points</li>
                      <li>Choose split that minimizes total cost</li>
                      <li>Reconstruct optimal parenthesization</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Cost Calculation:</h4>
                    <div className="bg-slate-700 rounded p-3 text-sm">
                      <div className="text-gray-300 mb-2">
                        For matrices A(p×q) and B(q×r):
                      </div>
                      <div className="text-yellow-400 font-mono">
                        Cost = p × q × r
                      </div>
                      <div className="text-gray-400 text-xs mt-2">
                        Total cost = left_cost + right_cost + scalar_multiplications
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Complexity Analysis:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-yellow-400 font-mono">O(n³)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space:</span>
                        <span className="text-red-400 font-mono">O(n²)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subproblems:</span>
                        <span className="text-blue-400 font-mono">O(n²)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      n = number of matrices in chain
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Applications:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Computer graphics (3D transformations)</li>
                      <li>• Machine learning (neural networks)</li>
                      <li>• Scientific computing</li>
                      <li>• Computer vision algorithms</li>
                      <li>• Image processing pipelines</li>
                      <li>• Mathematical optimization</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Example Calculation:</h4>
                    <div className="bg-slate-700 rounded p-3 text-xs">
                      <div className="text-gray-300 mb-2">
                        Chain: A(1×5) × B(5×4) × C(4×6) × D(6×2)
                      </div>
                      <div className="space-y-1 text-gray-400">
                        <div>((AB)C)D: 20 + 24 + 12 = 56</div>
                        <div>(A(BC))D: 120 + 30 + 12 = 162</div>
                        <div>A((BC)D): 48 + 40 + 10 = 98</div>
                        <div>(AB)(CD): 20 + 48 + 8 = 76</div>
                      </div>
                      <div className="text-green-400 mt-2 font-bold">
                        Optimal: ((AB)C)D = 56
                      </div>
                    </div>
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
                          <span className="text-gray-400">Chain Length:</span>
                          <span className="text-purple-400 font-mono">{currentStepData.chainLength}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Cost:</span>
                          <span className="text-green-400 font-mono">
                            {currentStepData.cost === Infinity ? '∞' : currentStepData.cost}
                          </span>
                        </div>
                        {currentStepData.currentK >= 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Split Point:</span>
                            <span className="text-yellow-400 font-mono">
                              {matrices[currentStepData.currentK]?.name}|{matrices[currentStepData.currentK + 1]?.name}
                            </span>
                          </div>
                        )}
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

export default MatrixChainMult;
