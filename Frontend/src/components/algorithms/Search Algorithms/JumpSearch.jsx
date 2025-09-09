import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Search, Zap, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const JumpSearch = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [array, setArray] = useState([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31]);
  const [searchTarget, setSearchTarget] = useState(15);
  const [customArray, setCustomArray] = useState("");
  const [customTarget, setCustomTarget] = useState("");
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(800);
  
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
    setCurrentHighlightedLine(null);
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 8) + 12; // 12-20 elements
    const newArray = [];
    let current = Math.floor(Math.random() * 5) + 1; // Start from 1-5
    
    for (let i = 0; i < size; i++) {
      newArray.push(current);
      current += Math.floor(Math.random() * 3) + 1; // Add 1-3 for closer spacing
    }
    
    setArray(newArray);
    setSearchTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    resetVisualization();
  };

  const applyCustomArray = () => {
    try {
      const newArray = customArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      if (newArray.length === 0) {
        setAlertConfig({
          isOpen: true,
          message: "Please enter valid numbers separated by commas.",
          type: "error",
        });
        return;
      }
      
      // Sort the array for jump search to work correctly
      newArray.sort((a, b) => a - b);
      setArray(newArray);
      setCustomArray("");
      resetVisualization();
    } catch (error) {
      setAlertConfig({
        isOpen: true,
        message: "Invalid array format. Please enter numbers separated by commas.",
        type: "error",
      });
    }
  };

  const applyCustomTarget = () => {
    const target = parseInt(customTarget);
    if (isNaN(target)) {
      setAlertConfig({
        isOpen: true,
        message: "Please enter a valid number.",
        type: "error",
      });
      return;
    }
    setSearchTarget(target);
    setCustomTarget("");
    resetVisualization();
  };

  const jumpSearch = () => {
    const steps = [];
    const n = array.length;
    let jumpSize = Math.floor(Math.sqrt(n));
    let prev = 0;
    let comparisons = 0;

    steps.push({
      type: 'start',
      array: [...array],
      target: searchTarget,
      jumpSize,
      prev: 0,
      current: -1,
      description: `Starting Jump Search for ${searchTarget}. Jump size: √${n} = ${jumpSize}`,
      comparisons: 0,
      highlighting: [],
      action: 'initialize',
      phase: 'jumping'
    });

    // Jump phase - find the block where target might be
    while (array[Math.min(jumpSize, n) - 1] < searchTarget) {
      steps.push({
        type: 'jump',
        array: [...array],
        target: searchTarget,
        jumpSize,
        prev,
        current: Math.min(jumpSize, n) - 1,
        description: `Checking position ${Math.min(jumpSize, n) - 1}: ${array[Math.min(jumpSize, n) - 1]} < ${searchTarget}, jumping forward`,
        comparisons: ++comparisons,
        highlighting: [Math.min(jumpSize, n) - 1],
        action: 'jump_forward',
        phase: 'jumping'
      });

      prev = jumpSize;
      jumpSize += Math.floor(Math.sqrt(n));

      if (prev >= n) {
        steps.push({
          type: 'not_found',
          array: [...array],
          target: searchTarget,
          jumpSize: Math.floor(Math.sqrt(n)),
          prev,
          current: -1,
          description: `Reached end of array. Target ${searchTarget} not found.`,
          comparisons,
          highlighting: [],
          action: 'not_found',
          phase: 'complete'
        });
        return steps;
      }
    }

    // Found the block, now perform linear search
    const blockEnd = Math.min(jumpSize, n) - 1;
    steps.push({
      type: 'block_found',
      array: [...array],
      target: searchTarget,
      jumpSize: Math.floor(Math.sqrt(n)),
      prev,
      current: blockEnd,
      description: `Found potential block: ${array[blockEnd]} ≥ ${searchTarget}. Linear searching in range [${prev}, ${blockEnd}]`,
      comparisons: ++comparisons,
      highlighting: [blockEnd],
      action: 'block_found',
      phase: 'linear_search'
    });

    // Linear search phase
    for (let i = prev; i < Math.min(jumpSize, n); i++) {
      comparisons++;
      
      if (array[i] === searchTarget) {
        steps.push({
          type: 'found',
          array: [...array],
          target: searchTarget,
          jumpSize: Math.floor(Math.sqrt(n)),
          prev,
          current: i,
          foundIndex: i,
          description: `Target ${searchTarget} found at index ${i}!`,
          comparisons,
          highlighting: [i],
          action: 'found',
          phase: 'complete'
        });
        return steps;
      } else if (array[i] > searchTarget) {
        steps.push({
          type: 'not_found',
          array: [...array],
          target: searchTarget,
          jumpSize: Math.floor(Math.sqrt(n)),
          prev,
          current: i,
          description: `${array[i]} > ${searchTarget}. Target not found in array.`,
          comparisons,
          highlighting: [i],
          action: 'not_found',
          phase: 'complete'
        });
        return steps;
      } else {
        steps.push({
          type: 'linear_search',
          array: [...array],
          target: searchTarget,
          jumpSize: Math.floor(Math.sqrt(n)),
          prev,
          current: i,
          description: `Linear search: checking index ${i}, ${array[i]} ≠ ${searchTarget}`,
          comparisons,
          highlighting: [i],
          action: 'linear_check',
          phase: 'linear_search'
        });
      }
    }

    // If we reach here, target was not found
    steps.push({
      type: 'not_found',
      array: [...array],
      target: searchTarget,
      jumpSize: Math.floor(Math.sqrt(n)),
      prev,
      current: -1,
      description: `Completed linear search in block. Target ${searchTarget} not found.`,
      comparisons,
      highlighting: [],
      action: 'not_found',
      phase: 'complete'
    });

    return steps;
  };

  const startSearch = () => {
    const searchSteps = jumpSearch();
    setSteps(searchSteps);
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

  // Update highlighted line based on current step
  useEffect(() => {
    if (!steps[currentStep]) return;
    
    const step = steps[currentStep];
    switch (step.action) {
      case 'initialize':
        setCurrentHighlightedLine(2);
        break;
      case 'jump_forward':
        setCurrentHighlightedLine(6);
        break;
      case 'block_found':
        setCurrentHighlightedLine(14);
        break;
      case 'linear_check':
        setCurrentHighlightedLine(17);
        break;
      case 'found':
        setCurrentHighlightedLine(18);
        break;
      default:
        setCurrentHighlightedLine(null);
    }
  }, [currentStep, steps]);

  const currentStepData = steps[currentStep] || {
    array: array,
    target: searchTarget,
    jumpSize: Math.floor(Math.sqrt(array.length)),
    prev: 0,
    current: -1,
    description: "Click 'Start Search' to begin Jump Search",
    highlighting: [],
    comparisons: 0,
    found: false,
    action: 'ready',
    phase: 'ready'
  };

  const jumpSearchCode = `function jumpSearch(arr, target) {
  const n = arr.length;
  const jumpSize = Math.floor(Math.sqrt(n));
  let prev = 0;
  
  // Jump to find the block
  while (arr[Math.min(jumpSize, n) - 1] < target) {
    prev = jumpSize;
    jumpSize += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  
  // Linear search in the identified block
  for (let i = prev; i < Math.min(jumpSize, n); i++) {
    if (arr[i] === target) return i;
    if (arr[i] > target) break;
  }
  
  return -1; // Not found
}`;

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw array
    const cellWidth = Math.min(45, (rect.width - 40) / array.length);
    const cellHeight = 40;
    const startX = (rect.width - array.length * cellWidth) / 2;
    const arrayY = rect.height / 2 - cellHeight / 2;

    array.forEach((value, index) => {
      const x = startX + index * cellWidth;
      const isHighlighted = currentStepData.highlighting.includes(index);
      const isCurrent = currentStepData.current === index;
      const isInSearchBlock = currentStepData.phase === 'linear_search' && 
                              index >= currentStepData.prev && 
                              index < Math.min(currentStepData.prev + currentStepData.jumpSize, array.length);
      const isFound = currentStepData.foundIndex === index;
      const isJumpPosition = index % currentStepData.jumpSize === currentStepData.jumpSize - 1;
      
      // Draw cell background
      if (isFound) {
        ctx.fillStyle = '#22c55e'; // Green for found
      } else if (isCurrent) {
        ctx.fillStyle = '#8b5cf6'; // Purple for current position
      } else if (isInSearchBlock) {
        ctx.fillStyle = '#475569'; // Dark gray for search block
      } else if (isJumpPosition && currentStepData.phase === 'jumping') {
        ctx.fillStyle = '#f59e0b'; // Orange for jump positions
      } else {
        ctx.fillStyle = '#334155'; // Light gray for others
      }
      
      ctx.fillRect(x, arrayY, cellWidth, cellHeight);
      
      // Draw cell border
      ctx.strokeStyle = isHighlighted || isCurrent || isFound ? '#ffffff' : '#64748b';
      ctx.lineWidth = isHighlighted || isCurrent || isFound ? 2 : 1;
      ctx.strokeRect(x, arrayY, cellWidth, cellHeight);
      
      // Draw value
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.min(14, cellWidth * 0.3)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toString(), x + cellWidth / 2, arrayY + cellHeight / 2);
      
      // Draw index
      ctx.fillStyle = '#9ca3af';
      ctx.font = `${Math.min(10, cellWidth * 0.2)}px monospace`;
      ctx.fillText(index.toString(), x + cellWidth / 2, arrayY + cellHeight + 15);
    });

    // Draw jump size indicators
    if (currentStepData.phase === 'jumping') {
      for (let i = currentStepData.jumpSize - 1; i < array.length; i += currentStepData.jumpSize) {
        const x = startX + i * cellWidth + cellWidth / 2;
        
        // Draw jump arrow
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, arrayY - 20);
        ctx.lineTo(x, arrayY - 5);
        ctx.stroke();
        
        // Draw arrow head
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(x, arrayY - 5);
        ctx.lineTo(x - 4, arrayY - 12);
        ctx.lineTo(x + 4, arrayY - 12);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw search block indicator
    if (currentStepData.phase === 'linear_search' && currentStepData.prev >= 0) {
      const blockStart = startX + currentStepData.prev * cellWidth;
      const blockEnd = startX + Math.min(currentStepData.prev + currentStepData.jumpSize, array.length) * cellWidth;
      
      // Draw block bracket
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Left bracket
      ctx.moveTo(blockStart, arrayY - 10);
      ctx.lineTo(blockStart, arrayY - 25);
      ctx.lineTo(blockStart + 10, arrayY - 25);
      // Right bracket
      ctx.moveTo(blockEnd, arrayY - 10);
      ctx.lineTo(blockEnd, arrayY - 25);
      ctx.lineTo(blockEnd - 10, arrayY - 25);
      ctx.stroke();
      
      // Draw block label
      const midX = (blockStart + blockEnd) / 2;
      ctx.fillStyle = '#06b6d4';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Search Block', midX, arrayY - 30);
    }

    // Draw target indicator
    ctx.fillStyle = '#ef4444';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Target: ${currentStepData.target}`, 10, 25);

    // Draw jump size
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`Jump Size: ${currentStepData.jumpSize}`, 10, 45);

    // Draw comparisons counter
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(`Comparisons: ${currentStepData.comparisons || 0}`, 10, 65);

  }, [currentStepData, array]);

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
          <div className="bg-yellow-600 p-2 rounded-lg">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Jump Search</h1>
            <p className="text-gray-400 text-sm">
              Time: O(√n) | Space: O(1) | Requires sorted array
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Search Target */}
              <div>
                <label className="block text-sm font-medium mb-2">Search Target</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value)}
                    className="flex-1 p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder={`Current: ${searchTarget}`}
                  />
                  <button
                    onClick={applyCustomTarget}
                    disabled={!customTarget}
                    className="px-4 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Target className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Custom Array */}
              <div>
                <label className="block text-sm font-medium mb-2">Custom Array (sorted)</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customArray}
                    onChange={(e) => setCustomArray(e.target.value)}
                    className="w-full p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., 1,3,5,7,9,11,13"
                  />
                  <button
                    onClick={applyCustomArray}
                    disabled={!customArray}
                    className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Apply Array
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={generateRandomArray}
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Random Array</span>
                </button>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={startSearch}
                  disabled={playing || steps.length > 0}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Start Search</span>
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

              {/* Algorithm Info */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Algorithm Info</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Array Size:</span>
                    <span className="text-white font-mono">{array.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Jump Size:</span>
                    <span className="text-yellow-400 font-mono">√{array.length} = {currentStepData.jumpSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phase:</span>
                    <span className={`font-mono text-xs ${
                      currentStepData.phase === 'jumping' ? 'text-orange-400' :
                      currentStepData.phase === 'linear_search' ? 'text-blue-400' :
                      currentStepData.phase === 'complete' ? 'text-green-400' :
                      'text-gray-400'
                    }`}>
                      {currentStepData.phase.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Array Display */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Current Array</h3>
                <div className="text-xs font-mono text-gray-300 break-all">
                  [{array.join(', ')}]
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Target: {searchTarget}
                </div>
              </div>

              {/* Legend */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Current Position</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>Jump Positions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-600 rounded"></div>
                    <span>Search Block</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Found</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* Middle Panel - Visualization */}
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full bg-slate-900 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-4xl">
              {/* Description */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">Jump Search Visualization</h2>
                <p className="text-gray-400">{currentStepData.description}</p>
              </div>

              {/* Canvas */}
              <div className="flex justify-center mb-8">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-700 rounded-lg bg-slate-800/50"
                  style={{ width: '100%', height: '280px' }}
                />
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{currentStepData.comparisons || 0}</div>
                  <div className="text-sm text-gray-400">Comparisons</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{currentStepData.jumpSize}</div>
                  <div className="text-sm text-gray-400">Jump Size</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{currentStepData.current >= 0 ? currentStepData.current : 'N/A'}</div>
                  <div className="text-sm text-gray-400">Current Index</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className={`text-2xl font-bold ${currentStepData.foundIndex !== undefined ? 'text-green-400' : 'text-gray-400'}`}>
                    {currentStepData.foundIndex !== undefined ? 'FOUND' : 'SEARCHING'}
                  </div>
                  <div className="text-sm text-gray-400">Status</div>
                </div>
              </div>

              {/* Progress */}
              {started && (
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{currentStep + 1} / {steps.length}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
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
                onClick={() => setActiveRightTab("stats")}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeRightTab === "stats"
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
                  code={jumpSearchCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Jump Search</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Jump search combines the efficiency of binary search with the simplicity 
                      of linear search by skipping elements in fixed steps of √n.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Algorithm Steps:</h4>
                    <ol className="text-sm space-y-1 text-gray-300">
                      <li>1. Calculate jump size as √n</li>
                      <li>2. Jump through array in steps of √n</li>
                      <li>3. Find the block where target might exist</li>
                      <li>4. Perform linear search in that block</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Optimal Jump Size:</h4>
                    <div className="bg-slate-700 rounded p-3 text-sm text-cyan-300">
                      Jump Size = √n
                      <br />
                      <span className="text-gray-400">
                        This minimizes the total number of comparisons
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Complexity Analysis:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Best Case:</span>
                        <span className="text-green-400 font-mono">O(1)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average Case:</span>
                        <span className="text-yellow-400 font-mono">O(√n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Worst Case:</span>
                        <span className="text-red-400 font-mono">O(√n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space:</span>
                        <span className="text-blue-400 font-mono">O(1)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Advantages:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Better than linear search: O(√n) vs O(n)</li>
                      <li>• Simpler than binary search</li>
                      <li>• Works well for uniformly distributed data</li>
                      <li>• Good cache performance</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Use Cases:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• When binary search overhead is too much</li>
                      <li>• Systems with limited memory</li>
                      <li>• When simplicity is preferred</li>
                      <li>• Large sorted datasets</li>
                    </ul>
                  </div>

                  {started && (
                    <div>
                      <h4 className="font-medium mb-2">Current Execution:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Target:</span>
                          <span className="text-white font-mono">{currentStepData.target}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Jump Size:</span>
                          <span className="text-yellow-400 font-mono">{currentStepData.jumpSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Comparisons:</span>
                          <span className="text-blue-400 font-mono">{currentStepData.comparisons || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Phase:</span>
                          <span className={`font-mono text-xs ${
                            currentStepData.phase === 'jumping' ? 'text-orange-400' :
                            currentStepData.phase === 'linear_search' ? 'text-blue-400' :
                            'text-green-400'
                          }`}>
                            {currentStepData.phase.replace('_', ' ')}
                          </span>
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

export default JumpSearch;
