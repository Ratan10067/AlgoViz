import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Search, Calculator, TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const InterpolationSearch = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [array, setArray] = useState([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150]);
  const [searchTarget, setSearchTarget] = useState(70);
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
    let current = Math.floor(Math.random() * 10) + 5; // Start from 5-15
    
    for (let i = 0; i < size; i++) {
      newArray.push(current);
      current += Math.floor(Math.random() * 15) + 5; // Add 5-20 for uniform distribution
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
      
      // Sort the array for interpolation search to work correctly
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

  const interpolationSearch = () => {
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
      pos: -1,
      description: `Starting Interpolation Search for ${searchTarget} in range [${left}, ${right}]`,
      comparisons: 0,
      highlighting: [],
      action: 'initialize',
      interpolationFormula: null
    });

    while (left <= right && searchTarget >= array[left] && searchTarget <= array[right]) {
      // If the subarray has only one element
      if (left === right) {
        comparisons++;
        if (array[left] === searchTarget) {
          steps.push({
            type: 'found',
            array: [...array],
            target: searchTarget,
            left,
            right,
            pos: left,
            foundIndex: left,
            description: `Target ${searchTarget} found at index ${left}!`,
            comparisons,
            highlighting: [left],
            action: 'found',
            interpolationFormula: null
          });
          return steps;
        } else {
          steps.push({
            type: 'not_found',
            array: [...array],
            target: searchTarget,
            left,
            right,
            pos: -1,
            description: `Target ${searchTarget} not found. Single element ${array[left]} ≠ ${searchTarget}`,
            comparisons,
            highlighting: [left],
            action: 'not_found_single',
            interpolationFormula: null
          });
          return steps;
        }
      }

      // Calculate the position using interpolation formula
      const pos = left + Math.floor(
        ((searchTarget - array[left]) * (right - left)) / (array[right] - array[left])
      );

      const formula = {
        left,
        right,
        target: searchTarget,
        leftValue: array[left],
        rightValue: array[right],
        calculatedPos: pos,
        formula: `pos = ${left} + floor(((${searchTarget} - ${array[left]}) * (${right} - ${left})) / (${array[right]} - ${array[left]}))`
      };

      steps.push({
        type: 'interpolate',
        array: [...array],
        target: searchTarget,
        left,
        right,
        pos,
        description: `Interpolating position: estimated index ${pos} for value ${searchTarget}`,
        comparisons,
        highlighting: [pos],
        action: 'calculate_position',
        interpolationFormula: formula
      });

      // Check if we found the target
      comparisons++;
      if (array[pos] === searchTarget) {
        steps.push({
          type: 'found',
          array: [...array],
          target: searchTarget,
          left,
          right,
          pos,
          foundIndex: pos,
          description: `Target ${searchTarget} found at index ${pos}!`,
          comparisons,
          highlighting: [pos],
          action: 'found',
          interpolationFormula: formula
        });
        return steps;
      }

      // Decide which side to search
      if (array[pos] < searchTarget) {
        steps.push({
          type: 'search',
          array: [...array],
          target: searchTarget,
          left,
          right,
          pos,
          description: `${array[pos]} < ${searchTarget}, searching right half [${pos + 1}, ${right}]`,
          comparisons,
          highlighting: [pos],
          action: 'search_right',
          interpolationFormula: formula
        });
        left = pos + 1;
      } else {
        steps.push({
          type: 'search',
          array: [...array],
          target: searchTarget,
          left,
          right,
          pos,
          description: `${array[pos]} > ${searchTarget}, searching left half [${left}, ${pos - 1}]`,
          comparisons,
          highlighting: [pos],
          action: 'search_left',
          interpolationFormula: formula
        });
        right = pos - 1;
      }
    }

    // Target not found
    steps.push({
      type: 'not_found',
      array: [...array],
      target: searchTarget,
      left,
      right,
      pos: -1,
      description: `Target ${searchTarget} not found in the array`,
      comparisons,
      highlighting: [],
      action: 'not_found',
      interpolationFormula: null
    });

    return steps;
  };

  const startSearch = () => {
    const searchSteps = interpolationSearch();
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
      case 'calculate_position':
        setCurrentHighlightedLine(9);
        break;
      case 'found':
        setCurrentHighlightedLine(13);
        break;
      case 'search_right':
        setCurrentHighlightedLine(17);
        break;
      case 'search_left':
        setCurrentHighlightedLine(19);
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
    pos: -1,
    description: "Click 'Start Search' to begin Interpolation Search",
    highlighting: [],
    comparisons: 0,
    found: false,
    action: 'ready',
    interpolationFormula: null
  };

  const interpolationSearchCode = `function interpolationSearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right && target >= arr[left] && target <= arr[right]) {
    if (left === right) {
      return arr[left] === target ? left : -1;
    }
    
    // Interpolation formula
    let pos = left + Math.floor(
      ((target - arr[left]) * (right - left)) / 
      (arr[right] - arr[left])
    );
    
    if (arr[pos] === target) return pos;
    
    if (arr[pos] < target) {
      left = pos + 1;
    } else {
      right = pos - 1;
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
      const isPos = currentStepData.pos === index;
      const isInRange = index >= currentStepData.left && index <= currentStepData.right;
      const isFound = currentStepData.foundIndex === index;
      
      // Draw cell background
      if (isFound) {
        ctx.fillStyle = '#22c55e'; // Green for found
      } else if (isPos) {
        ctx.fillStyle = '#8b5cf6'; // Purple for interpolated position
      } else if (isInRange) {
        ctx.fillStyle = '#475569'; // Dark gray for current search range
      } else {
        ctx.fillStyle = '#334155'; // Light gray for excluded
      }
      
      ctx.fillRect(x, arrayY, cellWidth, cellHeight);
      
      // Draw cell border
      ctx.strokeStyle = isHighlighted || isPos || isFound ? '#ffffff' : '#64748b';
      ctx.lineWidth = isHighlighted || isPos || isFound ? 2 : 1;
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

    // Draw interpolated position indicator
    if (currentStepData.pos >= 0 && currentStepData.pos < array.length) {
      const posX = startX + currentStepData.pos * cellWidth + cellWidth / 2;
      
      // Draw position arrow
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(posX, arrayY - 35);
      ctx.lineTo(posX, arrayY - 5);
      ctx.stroke();
      
      // Draw arrow head
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.moveTo(posX, arrayY - 5);
      ctx.lineTo(posX - 5, arrayY - 15);
      ctx.lineTo(posX + 5, arrayY - 15);
      ctx.closePath();
      ctx.fill();
      
      // Draw position label
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Interpolated', posX, arrayY - 40);
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
          <div className="bg-cyan-600 p-2 rounded-lg">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Interpolation Search</h1>
            <p className="text-gray-400 text-sm">
              Time: O(log log n) | Space: O(1) | Requires sorted, uniformly distributed array
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
                <label className="block text-sm font-medium mb-2">Custom Array (sorted, uniform)</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customArray}
                    onChange={(e) => setCustomArray(e.target.value)}
                    className="w-full p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., 10,20,30,40,50,60"
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

              {/* Interpolation Formula Display */}
              {currentStepData.interpolationFormula && (
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center space-x-2">
                    <Calculator className="w-4 h-4" />
                    <span>Interpolation Formula</span>
                  </h3>
                  <div className="text-xs font-mono text-cyan-300 break-all leading-relaxed">
                    {currentStepData.interpolationFormula.formula}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Result: Index {currentStepData.interpolationFormula.calculatedPos}
                  </div>
                </div>
              )}

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
                    <span>Interpolated Position</span>
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
                <h2 className="text-xl font-semibold mb-2">Interpolation Search Visualization</h2>
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
                  <div className="text-2xl font-bold text-purple-400">{currentStepData.pos >= 0 ? currentStepData.pos : 'N/A'}</div>
                  <div className="text-sm text-gray-400">Interpolated Pos</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {currentStepData.left >= 0 && currentStepData.right >= 0 ? 
                      `${currentStepData.right - currentStepData.left + 1}` : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-400">Range Size</div>
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
                      className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
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
                  code={interpolationSearchCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Interpolation Search</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Interpolation search improves upon binary search by estimating the position 
                      of the target value based on the distribution of values in the array.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Interpolation Formula:</h4>
                    <div className="bg-slate-700 rounded p-3 text-xs font-mono text-cyan-300">
                      pos = left + ((target - arr[left]) * (right - left)) / (arr[right] - arr[left])
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Algorithm Steps:</h4>
                    <ol className="text-sm space-y-1 text-gray-300">
                      <li>1. Calculate interpolated position using formula</li>
                      <li>2. Check if target equals arr[pos]</li>
                      <li>3. If target &lt; arr[pos]: search left half</li>
                      <li>4. If target &gt; arr[pos]: search right half</li>
                      <li>5. Repeat until found or range exhausted</li>
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
                        <span className="text-yellow-400 font-mono">O(log log n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Worst Case:</span>
                        <span className="text-red-400 font-mono">O(n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space:</span>
                        <span className="text-blue-400 font-mono">O(1)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Requirements:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Array must be sorted</li>
                      <li>• Values should be uniformly distributed</li>
                      <li>• Works best with numerical data</li>
                      <li>• Poor performance on non-uniform data</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Use Cases:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Large, uniformly distributed datasets</li>
                      <li>• Phone book searching</li>
                      <li>• Dictionary lookups</li>
                      <li>• Database index searching</li>
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

export default InterpolationSearch;
