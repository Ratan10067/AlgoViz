import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Search, TrendingUp, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const ExponentialSearch = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [array, setArray] = useState([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]);
  const [searchTarget, setSearchTarget] = useState(16);
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
    const size = Math.floor(Math.random() * 8) + 8; // 8-15 elements
    const newArray = [];
    let current = Math.floor(Math.random() * 5) + 1; // Start from 1-5
    
    for (let i = 0; i < size; i++) {
      newArray.push(current);
      current += Math.floor(Math.random() * 5) + 1; // Add 1-5
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
      
      // Sort the array for binary search to work correctly
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

  // Binary Search helper function
  const binarySearch = (arr, left, right, target, steps, stepOffset) => {
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        type: 'binary_search',
        array: [...arr],
        left,
        right,
        mid,
        target,
        description: `Binary search: checking middle element at index ${mid} (value: ${arr[mid]})`,
        found: false,
        comparisons: stepOffset + (steps.filter(s => s.type === 'binary_search').length) + 1,
        highlighting: [mid],
        action: 'compare_mid'
      });

      if (arr[mid] === target) {
        steps.push({
          type: 'binary_search',
          array: [...arr],
          left,
          right,
          mid,
          target,
          description: `Target ${target} found at index ${mid}!`,
          found: true,
          foundIndex: mid,
          comparisons: stepOffset + (steps.filter(s => s.type === 'binary_search').length),
          highlighting: [mid],
          action: 'found'
        });
        return mid;
      } else if (arr[mid] < target) {
        steps.push({
          type: 'binary_search',
          array: [...arr],
          left,
          right,
          mid,
          target,
          description: `${arr[mid]} < ${target}, searching right half`,
          found: false,
          comparisons: stepOffset + (steps.filter(s => s.type === 'binary_search').length),
          highlighting: [mid],
          action: 'go_right'
        });
        left = mid + 1;
      } else {
        steps.push({
          type: 'binary_search',
          array: [...arr],
          left,
          right,
          mid,
          target,
          description: `${arr[mid]} > ${target}, searching left half`,
          found: false,
          comparisons: stepOffset + (steps.filter(s => s.type === 'binary_search').length),
          highlighting: [mid],
          action: 'go_left'
        });
        right = mid - 1;
      }
    }

    steps.push({
      type: 'binary_search',
      array: [...arr],
      left,
      right,
      mid: -1,
      target,
      description: `Target ${target} not found in range [${left}, ${right}]`,
      found: false,
      comparisons: stepOffset + (steps.filter(s => s.type === 'binary_search').length),
      highlighting: [],
      action: 'not_found'
    });
    return -1;
  };

  const exponentialSearch = () => {
    const steps = [];
    let comparisons = 0;

    steps.push({
      type: 'start',
      array: [...array],
      target: searchTarget,
      description: `Starting Exponential Search for ${searchTarget}`,
      bound: -1,
      comparisons: 0,
      highlighting: [],
      action: 'initialize'
    });

    // Check if first element is the target
    if (array[0] === searchTarget) {
      steps.push({
        type: 'found_first',
        array: [...array],
        target: searchTarget,
        description: `Target ${searchTarget} found at index 0!`,
        bound: 0,
        found: true,
        foundIndex: 0,
        comparisons: 1,
        highlighting: [0],
        action: 'found'
      });
      return steps;
    }

    steps.push({
      type: 'check_first',
      array: [...array],
      target: searchTarget,
      description: `Checking first element: ${array[0]} ≠ ${searchTarget}`,
      bound: 0,
      comparisons: 1,
      highlighting: [0],
      action: 'compare_first'
    });

    // Find the range for binary search by exponentially increasing bound
    let bound = 1;
    comparisons = 1;

    while (bound < array.length && array[bound] < searchTarget) {
      steps.push({
        type: 'find_bound',
        array: [...array],
        target: searchTarget,
        description: `Checking bound ${bound}: ${array[bound]} < ${searchTarget}, doubling bound`,
        bound,
        comparisons: ++comparisons,
        highlighting: [bound],
        action: 'expand_bound'
      });
      bound *= 2;
    }

    // Final bound check
    if (bound < array.length) {
      steps.push({
        type: 'find_bound',
        array: [...array],
        target: searchTarget,
        description: `Found bound ${bound}: ${array[bound]} ≥ ${searchTarget}`,
        bound,
        comparisons: ++comparisons,
        highlighting: [bound],
        action: 'bound_found'
      });
    } else {
      steps.push({
        type: 'find_bound',
        array: [...array],
        target: searchTarget,
        description: `Bound ${bound} exceeds array length, using array end`,
        bound: array.length - 1,
        comparisons,
        highlighting: [array.length - 1],
        action: 'bound_adjusted'
      });
      bound = array.length - 1;
    }

    // Perform binary search in the found range
    const left = Math.floor(bound / 2);
    const right = Math.min(bound, array.length - 1);

    steps.push({
      type: 'binary_search_start',
      array: [...array],
      target: searchTarget,
      left,
      right,
      description: `Performing binary search in range [${left}, ${right}]`,
      comparisons,
      highlighting: [],
      action: 'start_binary_search'
    });

    // Perform binary search
    const result = binarySearch(array, left, right, searchTarget, steps, comparisons);

    if (result === -1) {
      steps.push({
        type: 'complete',
        array: [...array],
        target: searchTarget,
        description: `Search complete: ${searchTarget} not found in array`,
        found: false,
        comparisons: steps.filter(s => s.comparisons !== undefined).slice(-1)[0]?.comparisons || comparisons,
        highlighting: [],
        action: 'not_found'
      });
    } else {
      steps.push({
        type: 'complete',
        array: [...array],
        target: searchTarget,
        description: `Search complete: ${searchTarget} found at index ${result}`,
        found: true,
        foundIndex: result,
        comparisons: steps.filter(s => s.comparisons !== undefined).slice(-1)[0]?.comparisons || comparisons,
        highlighting: [result],
        action: 'found'
      });
    }

    return steps;
  };

  const startSearch = () => {
    const searchSteps = exponentialSearch();
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
        setCurrentHighlightedLine(1);
        break;
      case 'compare_first':
        setCurrentHighlightedLine(3);
        break;
      case 'expand_bound':
        setCurrentHighlightedLine(7);
        break;
      case 'bound_found':
        setCurrentHighlightedLine(8);
        break;
      case 'start_binary_search':
        setCurrentHighlightedLine(14);
        break;
      case 'compare_mid':
        setCurrentHighlightedLine(18);
        break;
      case 'found':
        setCurrentHighlightedLine(20);
        break;
      default:
        setCurrentHighlightedLine(null);
    }
  }, [currentStep, steps]);

  const currentStepData = steps[currentStep] || {
    array: array,
    target: searchTarget,
    description: "Click 'Start Search' to begin Exponential Search",
    highlighting: [],
    bound: -1,
    comparisons: 0,
    found: false,
    action: 'ready'
  };

  const exponentialSearchCode = `function exponentialSearch(arr, target) {
  // If target is at first position
  if (arr[0] === target) return 0;
  
  // Find range for binary search
  let bound = 1;
  while (bound < arr.length && arr[bound] < target) {
    bound *= 2;  // Double the bound
  }
  
  // Perform binary search in found range
  let left = bound / 2;
  let right = Math.min(bound, arr.length - 1);
  
  // Binary search implementation
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
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
    const cellWidth = Math.min(50, (rect.width - 40) / array.length);
    const cellHeight = 40;
    const startX = (rect.width - array.length * cellWidth) / 2;
    const arrayY = rect.height / 2 - cellHeight / 2;

    array.forEach((value, index) => {
      const x = startX + index * cellWidth;
      const isHighlighted = currentStepData.highlighting.includes(index);
      const isBound = currentStepData.bound === index;
      const isFound = currentStepData.found && currentStepData.foundIndex === index;
      
      // Draw cell background
      if (isFound) {
        ctx.fillStyle = '#22c55e'; // Green for found
      } else if (isHighlighted) {
        ctx.fillStyle = '#8b5cf6'; // Purple for current
      } else if (isBound) {
        ctx.fillStyle = '#f59e0b'; // Orange for bound
      } else {
        ctx.fillStyle = '#334155'; // Default gray
      }
      
      ctx.fillRect(x, arrayY, cellWidth, cellHeight);
      
      // Draw cell border
      ctx.strokeStyle = isHighlighted || isBound || isFound ? '#ffffff' : '#64748b';
      ctx.lineWidth = isHighlighted || isBound || isFound ? 2 : 1;
      ctx.strokeRect(x, arrayY, cellWidth, cellHeight);
      
      // Draw value
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.min(16, cellWidth * 0.3)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toString(), x + cellWidth / 2, arrayY + cellHeight / 2);
      
      // Draw index
      ctx.fillStyle = '#9ca3af';
      ctx.font = `${Math.min(12, cellWidth * 0.2)}px monospace`;
      ctx.fillText(index.toString(), x + cellWidth / 2, arrayY + cellHeight + 15);
    });

    // Draw bound indicator
    if (currentStepData.bound >= 0 && currentStepData.bound < array.length) {
      const boundX = startX + currentStepData.bound * cellWidth + cellWidth / 2;
      
      // Draw bound arrow
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(boundX, arrayY - 20);
      ctx.lineTo(boundX, arrayY - 5);
      ctx.stroke();
      
      // Draw arrow head
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(boundX, arrayY - 5);
      ctx.lineTo(boundX - 5, arrayY - 15);
      ctx.lineTo(boundX + 5, arrayY - 15);
      ctx.closePath();
      ctx.fill();
      
      // Draw bound label
      ctx.fillStyle = '#f59e0b';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Bound', boundX, arrayY - 25);
    }

    // Draw target indicator
    ctx.fillStyle = '#ef4444';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Target: ${currentStepData.target}`, 10, 25);

    // Draw comparisons counter
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(`Comparisons: ${currentStepData.comparisons || 0}`, 10, 45);

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
          <div className="bg-orange-600 p-2 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Exponential Search</h1>
            <p className="text-gray-400 text-sm">
              Time: O(log n) | Space: O(1) | Requires sorted array
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
                    placeholder="e.g., 1,3,5,7,9,11"
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

              {/* Current Array Display */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Current Array</span>
                </h3>
                <div className="text-xs font-mono text-gray-300 break-all">
                  [{array.join(', ')}]
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Length: {array.length} | Target: {searchTarget}
                </div>
              </div>

              {/* Legend */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Current Element</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>Bound</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Found</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-600 rounded border border-gray-500"></div>
                    <span>Unvisited</span>
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
                <h2 className="text-xl font-semibold mb-2">Exponential Search Visualization</h2>
                <p className="text-gray-400">{currentStepData.description}</p>
              </div>

              {/* Canvas */}
              <div className="flex justify-center mb-8">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-700 rounded-lg bg-slate-800/50"
                  style={{ width: '100%', height: '200px' }}
                />
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{currentStepData.comparisons || 0}</div>
                  <div className="text-sm text-gray-400">Comparisons</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{currentStepData.bound >= 0 ? currentStepData.bound : 'N/A'}</div>
                  <div className="text-sm text-gray-400">Current Bound</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className={`text-2xl font-bold ${currentStepData.found ? 'text-green-400' : 'text-gray-400'}`}>
                    {currentStepData.found ? 'FOUND' : 'SEARCHING'}
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
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
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
                  code={exponentialSearchCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Exponential Search</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Exponential search works by finding a range where the target might exist 
                      by doubling the search bound, then performing binary search within that range.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Algorithm Steps:</h4>
                    <ol className="text-sm space-y-1 text-gray-300">
                      <li>1. Check if target is at index 0</li>
                      <li>2. Find range by doubling bound until arr[bound] ≥ target</li>
                      <li>3. Binary search in range [bound/2, bound]</li>
                    </ol>
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
                        <span className="text-yellow-400 font-mono">O(log n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Worst Case:</span>
                        <span className="text-red-400 font-mono">O(log n)</span>
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
                      <li>• Better than binary search for unbounded arrays</li>
                      <li>• Efficient when target is close to beginning</li>
                      <li>• Works with infinite/very large datasets</li>
                      <li>• Constant space complexity</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Use Cases:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Searching in unbounded/infinite arrays</li>
                      <li>• When array size is unknown</li>
                      <li>• Searching in very large sorted datasets</li>
                      <li>• When target is likely near the beginning</li>
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
                          <span className="text-gray-400">Array Size:</span>
                          <span className="text-white font-mono">{array.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Comparisons:</span>
                          <span className="text-blue-400 font-mono">{currentStepData.comparisons || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className={`font-mono ${currentStepData.found ? 'text-green-400' : 'text-yellow-400'}`}>
                            {currentStepData.found ? 'Found' : 'Searching'}
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

export default ExponentialSearch;
