import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Search, Divide, Split
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const TernarySearch = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [array, setArray] = useState([1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43]);
  const [searchTarget, setSearchTarget] = useState(22);
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
      
      // Sort the array for ternary search to work correctly
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

  const ternarySearch = () => {
    const steps = [];
    let left = 0;
    let right = array.length - 1;
    let comparisons = 0;

    steps.push({
      type: 'start',
      array: [...array],
      target: searchTarget,
      left,
      right,
      mid1: -1,
      mid2: -1,
      description: `Starting Ternary Search for ${searchTarget} in range [${left}, ${right}]`,
      comparisons: 0,
      highlighting: [],
      action: 'initialize'
    });

    while (left <= right) {
      // Calculate two midpoints that divide the array into three parts
      const mid1 = left + Math.floor((right - left) / 3);
      const mid2 = right - Math.floor((right - left) / 3);

      steps.push({
        type: 'divide',
        array: [...array],
        target: searchTarget,
        left,
        right,
        mid1,
        mid2,
        description: `Dividing range [${left}, ${right}] into three parts: [${left}, ${mid1}], [${mid1}, ${mid2}], [${mid2}, ${right}]`,
        comparisons,
        highlighting: [mid1, mid2],
        action: 'calculate_mids'
      });

      // Check if target is at mid1
      comparisons++;
      if (array[mid1] === searchTarget) {
        steps.push({
          type: 'found',
          array: [...array],
          target: searchTarget,
          left,
          right,
          mid1,
          mid2,
          foundIndex: mid1,
          description: `Target ${searchTarget} found at index ${mid1}!`,
          comparisons,
          highlighting: [mid1],
          action: 'found_mid1'
        });
        return steps;
      }

      // Check if target is at mid2
      comparisons++;
      if (array[mid2] === searchTarget) {
        steps.push({
          type: 'found',
          array: [...array],
          target: searchTarget,
          left,
          right,
          mid1,
          mid2,
          foundIndex: mid2,
          description: `Target ${searchTarget} found at index ${mid2}!`,
          comparisons,
          highlighting: [mid2],
          action: 'found_mid2'
        });
        return steps;
      }

      // Determine which third to search next
      if (searchTarget < array[mid1]) {
        // Target is in the first third
        steps.push({
          type: 'search',
          array: [...array],
          target: searchTarget,
          left,
          right,
          mid1,
          mid2,
          description: `${searchTarget} < ${array[mid1]}, searching left third [${left}, ${mid1 - 1}]`,
          comparisons,
          highlighting: [mid1],
          action: 'search_left'
        });
        right = mid1 - 1;
      } else if (searchTarget > array[mid2]) {
        // Target is in the third third
        steps.push({
          type: 'search',
          array: [...array],
          target: searchTarget,
          left,
          right,
          mid1,
          mid2,
          description: `${searchTarget} > ${array[mid2]}, searching right third [${mid2 + 1}, ${right}]`,
          comparisons,
          highlighting: [mid2],
          action: 'search_right'
        });
        left = mid2 + 1;
      } else {
        // Target is in the middle third
        steps.push({
          type: 'search',
          array: [...array],
          target: searchTarget,
          left,
          right,
          mid1,
          mid2,
          description: `${array[mid1]} < ${searchTarget} < ${array[mid2]}, searching middle third [${mid1 + 1}, ${mid2 - 1}]`,
          comparisons,
          highlighting: [mid1, mid2],
          action: 'search_middle'
        });
        left = mid1 + 1;
        right = mid2 - 1;
      }
    }

    // Target not found
    steps.push({
      type: 'not_found',
      array: [...array],
      target: searchTarget,
      left,
      right,
      mid1: -1,
      mid2: -1,
      description: `Target ${searchTarget} not found in the array`,
      comparisons,
      highlighting: [],
      action: 'not_found'
    });

    return steps;
  };

  const startSearch = () => {
    const searchSteps = ternarySearch();
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
      case 'calculate_mids':
        setCurrentHighlightedLine(5);
        break;
      case 'found_mid1':
      case 'found_mid2':
        setCurrentHighlightedLine(10);
        break;
      case 'search_left':
        setCurrentHighlightedLine(17);
        break;
      case 'search_right':
        setCurrentHighlightedLine(20);
        break;
      case 'search_middle':
        setCurrentHighlightedLine(14);
        break;
      default:
        setCurrentHighlightedLine(null);
    }
  }, [currentStep, steps]);

  const currentStepData = steps[currentStep] || {
    array: array,
    target: searchTarget,
    left: 0,
    right: array.length - 1,
    mid1: -1,
    mid2: -1,
    description: "Click 'Start Search' to begin Ternary Search",
    highlighting: [],
    comparisons: 0,
    found: false,
    action: 'ready'
  };

  const ternarySearchCode = `function ternarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // Calculate two midpoints
    let mid1 = left + Math.floor((right - left) / 3);
    let mid2 = right - Math.floor((right - left) / 3);
    
    // Check if target is found
    if (arr[mid1] === target) return mid1;
    if (arr[mid2] === target) return mid2;
    
    // Decide which third to search
    if (target < arr[mid1]) {
      // Search left third
      right = mid1 - 1;
    } else if (target > arr[mid2]) {
      // Search right third
      left = mid2 + 1;
    } else {
      // Search middle third
      left = mid1 + 1;
      right = mid2 - 1;
    }
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
      const isMid1 = currentStepData.mid1 === index;
      const isMid2 = currentStepData.mid2 === index;
      const isInRange = index >= currentStepData.left && index <= currentStepData.right;
      const isFound = currentStepData.foundIndex === index;
      
      // Draw cell background
      if (isFound) {
        ctx.fillStyle = '#22c55e'; // Green for found
      } else if (isMid1) {
        ctx.fillStyle = '#8b5cf6'; // Purple for mid1
      } else if (isMid2) {
        ctx.fillStyle = '#f59e0b'; // Orange for mid2
      } else if (isInRange) {
        ctx.fillStyle = '#475569'; // Dark gray for current search range
      } else {
        ctx.fillStyle = '#334155'; // Light gray for excluded
      }
      
      ctx.fillRect(x, arrayY, cellWidth, cellHeight);
      
      // Draw cell border
      ctx.strokeStyle = isHighlighted || isMid1 || isMid2 || isFound ? '#ffffff' : '#64748b';
      ctx.lineWidth = isHighlighted || isMid1 || isMid2 || isFound ? 2 : 1;
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

    // Draw range indicators
    if (currentStepData.left >= 0 && currentStepData.right >= 0) {
      const leftX = startX + currentStepData.left * cellWidth;
      const rightX = startX + (currentStepData.right + 1) * cellWidth;
      
      // Draw range bracket
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Left bracket
      ctx.moveTo(leftX, arrayY - 10);
      ctx.lineTo(leftX, arrayY - 20);
      ctx.lineTo(leftX + 10, arrayY - 20);
      // Right bracket
      ctx.moveTo(rightX, arrayY - 10);
      ctx.lineTo(rightX, arrayY - 20);
      ctx.lineTo(rightX - 10, arrayY - 20);
      ctx.stroke();
      
      // Draw range label
      const midX = (leftX + rightX) / 2;
      ctx.fillStyle = '#06b6d4';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`[${currentStepData.left}, ${currentStepData.right}]`, midX, arrayY - 25);
    }

    // Draw mid1 indicator
    if (currentStepData.mid1 >= 0 && currentStepData.mid1 < array.length) {
      const mid1X = startX + currentStepData.mid1 * cellWidth + cellWidth / 2;
      
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('mid1', mid1X, arrayY + cellHeight + 30);
    }

    // Draw mid2 indicator
    if (currentStepData.mid2 >= 0 && currentStepData.mid2 < array.length) {
      const mid2X = startX + currentStepData.mid2 * cellWidth + cellWidth / 2;
      
      ctx.fillStyle = '#f59e0b';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('mid2', mid2X, arrayY + cellHeight + 30);
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
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Split className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Ternary Search</h1>
            <p className="text-gray-400 text-sm">
              Time: O(log₃ n) | Space: O(1) | Requires sorted array
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
                    placeholder="e.g., 1,5,9,13,17,21"
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
                    <span>Mid1</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>Mid2</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Found</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-600 rounded"></div>
                    <span>Search Range</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-700 rounded border border-gray-500"></div>
                    <span>Excluded</span>
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
                <h2 className="text-xl font-semibold mb-2">Ternary Search Visualization</h2>
                <p className="text-gray-400">{currentStepData.description}</p>
              </div>

              {/* Canvas */}
              <div className="flex justify-center mb-8">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-700 rounded-lg bg-slate-800/50"
                  style={{ width: '100%', height: '250px' }}
                />
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{currentStepData.comparisons || 0}</div>
                  <div className="text-sm text-gray-400">Comparisons</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{currentStepData.mid1 >= 0 ? currentStepData.mid1 : 'N/A'}</div>
                  <div className="text-sm text-gray-400">Mid1</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">{currentStepData.mid2 >= 0 ? currentStepData.mid2 : 'N/A'}</div>
                  <div className="text-sm text-gray-400">Mid2</div>
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
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
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
                  code={ternarySearchCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Ternary Search</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Ternary search divides the search space into three equal parts using two midpoints, 
                      then eliminates two-thirds of the remaining elements in each step.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Algorithm Steps:</h4>
                    <ol className="text-sm space-y-1 text-gray-300">
                      <li>1. Calculate two midpoints: mid1 and mid2</li>
                      <li>2. Check if target equals mid1 or mid2</li>
                      <li>3. If target &lt; mid1: search left third</li>
                      <li>4. If target &gt; mid2: search right third</li>
                      <li>5. Otherwise: search middle third</li>
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
                        <span className="text-yellow-400 font-mono">O(log₃ n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Worst Case:</span>
                        <span className="text-red-400 font-mono">O(log₃ n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space:</span>
                        <span className="text-blue-400 font-mono">O(1)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">vs Binary Search:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• More comparisons per iteration (2 vs 1)</li>
                      <li>• Fewer iterations (log₃ n vs log₂ n)</li>
                      <li>• Theoretical advantage not always practical</li>
                      <li>• Binary search often faster in practice</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Use Cases:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• When comparisons are expensive</li>
                      <li>• Theoretical computer science studies</li>
                      <li>• Optimization problems</li>
                      <li>• Mathematical analysis</li>
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
                          <span className="text-gray-400">Range:</span>
                          <span className="text-cyan-400 font-mono">[{currentStepData.left}, {currentStepData.right}]</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Comparisons:</span>
                          <span className="text-blue-400 font-mono">{currentStepData.comparisons || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className={`font-mono ${currentStepData.foundIndex !== undefined ? 'text-green-400' : 'text-yellow-400'}`}>
                            {currentStepData.foundIndex !== undefined ? 'Found' : 'Searching'}
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

export default TernarySearch;
