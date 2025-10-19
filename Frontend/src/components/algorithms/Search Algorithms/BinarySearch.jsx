import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Search, Eye, ChevronLeft, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const BinarySearch = () => {
  const navigate = useNavigate();
  
  // Array and search state
  const [arraySize, setArraySize] = useState(10);
  const [customArray, setCustomArray] = useState("11,12,22,25,34,50,64,76,88,90");
  const [currentArray, setCurrentArray] = useState([]);
  const [target, setTarget] = useState(34);
  const [useRandomArray, setUseRandomArray] = useState(false);
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(800);
  
  // UI state
  const [activeRightTab, setActiveRightTab] = useState("stats");
  const [arrayValidationError, setArrayValidationError] = useState("");
  const [isValidArray, setIsValidArray] = useState(false);
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

  // Validate and sort array input
  const validateArray = (arrayString) => {
    try {
      const numbers = arrayString.split(',').map(num => {
        const parsed = parseInt(num.trim());
        if (isNaN(parsed)) throw new Error("Invalid number");
        return parsed;
      });
      
      if (numbers.length < 2) {
        return { isValid: false, error: "Array must have at least 2 elements" };
      }
      
      if (numbers.length > 50) {
        return { isValid: false, error: "Array size cannot exceed 50 elements" };
      }
      
      // Sort the array for binary search
      const sortedArray = [...numbers].sort((a, b) => a - b);
      
      return { isValid: true, array: sortedArray };
    } catch (error) {
      return { isValid: false, error: "Invalid array format. Use comma-separated numbers." };
    }
  };

  // Generate random sorted array
  const generateRandomArray = (size) => {
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 100) + 1);
    }
    return arr.sort((a, b) => a - b);
  };

  // Binary Search Algorithm
  const binarySearchAlgorithm = (array, target) => {
    const steps = [];
    let left = 0;
    let right = array.length - 1;
    let comparisons = 0;
    
    // Initial state
    steps.push({
      array: [...array],
      left,
      right,
      mid: -1,
      target,
      found: false,
      foundIndex: -1,
      comparisons: 0,
      line: 0,
      description: "Starting Binary Search on sorted array..."
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      comparisons++;

      // Show mid calculation
      steps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        found: false,
        foundIndex: -1,
        comparisons,
        line: 1,
        description: `Calculating mid: (${left} + ${right}) / 2 = ${mid}`
      });

      // Compare with target
      steps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        found: false,
        foundIndex: -1,
        comparisons,
        line: 2,
        description: `Comparing arr[${mid}] = ${array[mid]} with target ${target}`
      });

      if (array[mid] === target) {
        // Found the target
        steps.push({
          array: [...array],
          left,
          right,
          mid,
          target,
          found: true,
          foundIndex: mid,
          comparisons,
          line: 3,
          description: `Found target ${target} at index ${mid}!`
        });
        return steps;
      } else if (array[mid] < target) {
        // Search right half
        left = mid + 1;
        steps.push({
          array: [...array],
          left,
          right,
          mid,
          target,
          found: false,
          foundIndex: -1,
          comparisons,
          line: 4,
          description: `${array[mid]} < ${target}, search right half. New left = ${left}`
        });
      } else {
        // Search left half
        right = mid - 1;
        steps.push({
          array: [...array],
          left,
          right,
          mid,
          target,
          found: false,
          foundIndex: -1,
          comparisons,
          line: 5,
          description: `${array[mid]} > ${target}, search left half. New right = ${right}`
        });
      }
    }

    // Target not found
    steps.push({
      array: [...array],
      left,
      right,
      mid: -1,
      target,
      found: false,
      foundIndex: -1,
      comparisons,
      line: 6,
      description: `Target ${target} not found in array`
    });

    return steps;
  };

  // Initialize array
  useEffect(() => {
    if (useRandomArray) {
      const newArray = generateRandomArray(arraySize);
      setCurrentArray(newArray);
      setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    } else {
      const validation = validateArray(customArray);
      if (validation.isValid) {
        setCurrentArray(validation.array);
        setIsValidArray(true);
        setArrayValidationError("");
      } else {
        setIsValidArray(false);
        setArrayValidationError(validation.error);
      }
    }
    resetVisualization();
  }, [customArray, arraySize, useRandomArray]);

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setPlaying(false);
    setStarted(false);
    setCurrentHighlightedLine(null);
  };

  const startSearch = () => {
    if (!isValidArray && !useRandomArray) return;
    
    const searchSteps = binarySearchAlgorithm(currentArray, target);
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

  // Update highlighted line
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      setCurrentHighlightedLine(steps[currentStep].line);
    }
  }, [currentStep, steps]);

  const currentStepData = steps[currentStep] || {
    array: currentArray,
    left: 0,
    right: currentArray.length - 1,
    mid: -1,
    target,
    found: false,
    foundIndex: -1,
    comparisons: 0,
    description: "Click 'Start Search' to begin"
  };

  const binarySearchCode = `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found at index mid
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  return -1; // Not found
}`;

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
          <div className="bg-purple-600 p-2 rounded-lg">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Binary Search</h1>
            <p className="text-gray-400 text-sm">
              Time: O(log n) | Space: O(1) | Divide and conquer search
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Array Input */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Array Input</label>
                  <button
                    onClick={() => setUseRandomArray(!useRandomArray)}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      useRandomArray 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                    }`}
                  >
                    Random
                  </button>
                </div>
                
                {useRandomArray ? (
                  <div>
                    <label className="block text-sm mb-2">Array Size: {arraySize}</label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={arraySize}
                      onChange={(e) => setArraySize(parseInt(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={customArray}
                      onChange={(e) => setCustomArray(e.target.value)}
                      className="w-full p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none resize-none text-sm"
                      rows="3"
                      placeholder="Enter comma-separated numbers (will be sorted automatically)..."
                    />
                    {arrayValidationError && (
                      <p className="text-red-400 text-xs mt-1">{arrayValidationError}</p>
                    )}
                    <p className="text-yellow-400 text-xs mt-1">
                      ⚠️ Array will be sorted automatically for binary search
                    </p>
                  </div>
                )}
              </div>

              {/* Target */}
              <div>
                <label className="block text-sm font-medium mb-2">Target Value</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={startSearch}
                  disabled={(!isValidArray && !useRandomArray) || playing}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Play className="w-5 h-5" />
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

              {/* Statistics */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Statistics</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target:</span>
                    <span className="text-blue-400 font-mono">{target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Comparisons:</span>
                    <span className="text-yellow-400 font-mono">{currentStepData.comparisons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Left Bound:</span>
                    <span className="text-green-400 font-mono">{currentStepData.left}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Right Bound:</span>
                    <span className="text-red-400 font-mono">{currentStepData.right}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mid Index:</span>
                    <span className="text-purple-400 font-mono">
                      {currentStepData.mid >= 0 ? currentStepData.mid : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`font-mono ${
                      currentStepData.found ? 'text-green-400' : 
                      currentStepData.mid >= 0 ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {currentStepData.found ? 'Found' : 
                       currentStepData.mid >= 0 ? 'Searching' : 'Ready'}
                    </span>
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
                <h2 className="text-xl font-semibold mb-2">Binary Search Visualization</h2>
                <p className="text-gray-400">{currentStepData.description}</p>
              </div>

              {/* Search Range Indicators */}
              {started && currentStepData.left <= currentStepData.right && (
                <div className="flex justify-center items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <ChevronLeft className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">Left: {currentStepData.left}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm">
                      Mid: {currentStepData.mid >= 0 ? currentStepData.mid : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400 text-sm">Right: {currentStepData.right}</span>
                    <ChevronRight className="w-4 h-4 text-red-400" />
                  </div>
                </div>
              )}

              {/* Array Visualization */}
              <div className="flex justify-center items-end space-x-1 mb-8 overflow-x-auto px-4">
                {currentStepData.array.map((value, index) => {
                  const isInRange = index >= currentStepData.left && index <= currentStepData.right;
                  const isMid = index === currentStepData.mid;
                  const isFound = index === currentStepData.foundIndex && currentStepData.found;
                  const isTarget = value === target;
                  
                  return (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div
                        className={`
                          w-12 h-12 rounded-lg flex items-center justify-center font-mono text-sm font-bold
                          transition-all duration-500 transform relative
                          ${isMid 
                            ? 'bg-purple-500 text-white scale-125 ring-4 ring-purple-300 ring-opacity-50 z-20' 
                            : isFound
                            ? 'bg-green-500 text-white scale-110 ring-4 ring-green-300 ring-opacity-50 z-10'
                            : isInRange && started
                            ? isTarget
                              ? 'bg-blue-500 text-white scale-105'
                              : 'bg-slate-600 text-gray-300'
                            : started
                            ? 'bg-slate-700 text-gray-500 opacity-50'
                            : isTarget
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-600 text-gray-300'
                          }
                        `}
                      >
                        {value}
                        {/* Range indicators */}
                        {started && (
                          <>
                            {index === currentStepData.left && (
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                <div className="text-green-400 text-xs font-bold">L</div>
                              </div>
                            )}
                            {index === currentStepData.right && (
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                <div className="text-red-400 text-xs font-bold">R</div>
                              </div>
                            )}
                            {isMid && (
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                <div className="text-purple-400 text-xs font-bold">M</div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{index}</span>
                    </div>
                  );
                })}
              </div>

              {/* Target Indicator */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-lg">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Target:</span>
                  <span className="font-mono text-blue-400 font-bold">{target}</span>
                </div>
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
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
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
                <Eye className="w-4 h-4 inline mr-2" />
                Info
              </button>
            </div>

            <div className="p-6 h-full overflow-y-auto">
              {activeRightTab === "code" ? (
                <BasicCodeDisplay
                  code={binarySearchCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Binary Search</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Binary search is an efficient algorithm for finding an item from a sorted list 
                      by repeatedly dividing the search interval in half.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">How it works:</h4>
                    <ol className="text-sm space-y-1 text-gray-300">
                      <li className="flex">
                        <span className="text-purple-400 mr-2">1.</span>
                        Compare target with middle element
                      </li>
                      <li className="flex">
                        <span className="text-purple-400 mr-2">2.</span>
                        If equal, return middle index
                      </li>
                      <li className="flex">
                        <span className="text-purple-400 mr-2">3.</span>
                        If target is smaller, search left half
                      </li>
                      <li className="flex">
                        <span className="text-purple-400 mr-2">4.</span>
                        If target is larger, search right half
                      </li>
                      <li className="flex">
                        <span className="text-purple-400 mr-2">5.</span>
                        Repeat until found or bounds cross
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Complexity:</h4>
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
                    <h4 className="font-medium mb-2">Prerequisites:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Array must be sorted</li>
                      <li>• Random access to elements</li>
                      <li>• Comparable elements</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Use Cases:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Large sorted datasets</li>
                      <li>• Dictionary/phone book lookup</li>
                      <li>• Database indexing</li>
                      <li>• Finding insertion point</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default BinarySearch;
