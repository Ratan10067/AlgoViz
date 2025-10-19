// ...existing code...
// Removed duplicate default export
import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";

import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  BarChart, ArrowUp, ArrowDown
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";
import { heapSort as heapSortCode } from "../../../algorithms/codeExamples.js";

export default function HeapSort() {
  const navigate = useNavigate();
  
  // Array state
  const [arraySize, setArraySize] = useState(12);
  const [customArray, setCustomArray] = useState("64,34,25,12,22,11,90,88,76,50,77,13");
  const [currentArray, setCurrentArray] = useState([]);
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
  const [sortDirection, setSortDirection] = useState('ascending');
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
            navigate("/visualizer");
          },
          variant: "destructive"
        }
      ]
    });
  };

  // Validate array input
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
      
      return { isValid: true, array: numbers };
    } catch (error) {
      return { isValid: false, error: "Invalid array format. Use comma-separated numbers." };
    }
  };

  // Generate random array
  const generateRandomArray = (size) => {
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 100) + 1);
    }
    return arr;
  };

  // Heap Sort Algorithm Implementation
  const computeHeapSortSteps = (inputArray, direction) => {
    const steps = [];
    const arr = [...inputArray];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    const heapify = (arr, n, i, phase, steps) => {
      const isMaxHeap = direction === 'ascending';
      let largest = i;
      let left = 2 * i + 1;
      let right = 2 * i + 2;

      // Check left child
      if (left < n) {
        comparisons++;
        steps.push({
          array: [...arr],
          comparing: [largest, left],
          heapSize: n,
          phase,
          comparisons,
          swaps,
          codeLine: 7,
          description: `Comparing parent arr[${largest}] = ${arr[largest]} with left child arr[${left}] = ${arr[left]}`
        });

        if ((isMaxHeap && arr[left] > arr[largest]) || (!isMaxHeap && arr[left] < arr[largest])) {
          largest = left;
        }
      }

      // Check right child
      if (right < n) {
        comparisons++;
        steps.push({
          array: [...arr],
          comparing: [largest, right],
          heapSize: n,
          phase,
          comparisons,
          swaps,
          codeLine: 11,
          description: `Comparing current largest arr[${largest}] = ${arr[largest]} with right child arr[${right}] = ${arr[right]}`
        });

        if ((isMaxHeap && arr[right] > arr[largest]) || (!isMaxHeap && arr[right] < arr[largest])) {
          largest = right;
        }
      }

      // If largest is not root
      if (largest !== i) {
        steps.push({
          array: [...arr],
          swapping: [i, largest],
          heapSize: n,
          phase,
          comparisons,
          swaps,
          codeLine: 15,
          description: `Swapping arr[${i}] = ${arr[i]} with arr[${largest}] = ${arr[largest]} to maintain heap property`
        });

        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        swaps++;

        steps.push({
          array: [...arr],
          swapped: [i, largest],
          heapSize: n,
          phase,
          comparisons,
          swaps,
          codeLine: 16,
          description: `Swapped! Now arr[${i}] = ${arr[i]} and arr[${largest}] = ${arr[largest]}`
        });

        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest, phase, steps);
      }
    };

    // Initial step
    steps.push({
      array: [...arr],
      comparing: [],
      heapSize: n,
      phase: "building",
      comparisons,
      swaps,
      codeLine: 1,
      description: `Starting Heap Sort with ${direction} order. First, build a ${direction === 'ascending' ? 'max' : 'min'} heap.`
    });

    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      steps.push({
        array: [...arr],
        highlighting: [i],
        heapSize: n,
        phase: "building",
        comparisons,
        swaps,
        codeLine: 3,
        description: `Building heap: Heapifying subtree rooted at index ${i}`
      });
      heapify(arr, n, i, "building", steps);
    }

    steps.push({
      array: [...arr],
      comparing: [],
      heapSize: n,
      phase: "built",
      comparisons,
      swaps,
      codeLine: 4,
      description: `Heap construction complete! Now extracting elements one by one.`
    });

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end
      steps.push({
        array: [...arr],
        swapping: [0, i],
        heapSize: i + 1,
        phase: "sorting",
        comparisons,
        swaps,
        codeLine: 6,
        description: `Moving largest element arr[0] = ${arr[0]} to sorted position at index ${i}`
      });

      [arr[0], arr[i]] = [arr[i], arr[0]];
      swaps++;

      steps.push({
        array: [...arr],
        swapped: [0, i],
        sorted: Array.from({ length: n - i }, (_, idx) => n - 1 - idx),
        heapSize: i,
        phase: "sorting",
        comparisons,
        swaps,
        codeLine: 7,
        description: `Swapped! Element ${arr[i]} is now in its final sorted position`
      });

      // Call heapify on the reduced heap
      steps.push({
        array: [...arr],
        highlighting: [0],
        sorted: Array.from({ length: n - i }, (_, idx) => n - 1 - idx),
        heapSize: i,
        phase: "sorting",
        comparisons,
        swaps,
        codeLine: 8,
        description: `Heapifying root element to maintain heap property in remaining ${i} elements`
      });

      heapify(arr, i, 0, "sorting", steps);
    }

    // Final step
    steps.push({
      array: [...arr],
      comparing: [],
      sorted: Array.from({ length: n }, (_, idx) => idx),
      heapSize: 0,
      phase: "completed",
      comparisons,
      swaps,
      codeLine: 9,
      description: `Heap Sort completed! Array is now sorted in ${direction} order.`
    });

    return steps;
  };

  // Handle array generation
  const handleGenerateArray = () => {
    if (useRandomArray) {
      const newArray = generateRandomArray(arraySize);
      setCurrentArray(newArray);
      setCustomArray(newArray.join(','));
    } else {
      const validation = validateArray(customArray);
      if (validation.isValid) {
        setCurrentArray(validation.array);
        setArrayValidationError("");
        setIsValidArray(true);
      }
    }
    setSteps([]);
    setCurrentStep(0);
    setStarted(false);
    setPlaying(false);
  };

  // Start sorting
  const handleStartSort = () => {
    if (!isValidArray || currentArray.length === 0) {
      setArrayValidationError("Please generate a valid array first");
      return;
    }

    const sortSteps = computeHeapSortSteps(currentArray, sortDirection);
    setSteps(sortSteps);
    setCurrentStep(0);
    setStarted(true);
    setPlaying(false);
  };

  // Animation controls
  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);
  const handleReset = () => {
    setCurrentStep(0);
    setPlaying(false);
    setCurrentHighlightedLine(null);
  };
  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Validate array on change
  useEffect(() => {
    if (!useRandomArray) {
      const validation = validateArray(customArray);
      setIsValidArray(validation.isValid);
      setArrayValidationError(validation.error || "");
      if (validation.isValid) {
        setCurrentArray(validation.array);
      }
    }
  }, [customArray, useRandomArray]);

  // Animation loop
  useEffect(() => {
    let interval;
    if (playing && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [playing, currentStep, steps.length, speed]);

  // Update highlighted code line
  useEffect(() => {
    if (steps[currentStep]) {
      setCurrentHighlightedLine(steps[currentStep].codeLine);
    }
  }, [currentStep, steps]);

  // UI Components
  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveRightTab(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
        activeRightTab === id
          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105"
          : "text-gray-300 hover:text-white hover:bg-gray-700/50"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const StatCard = ({ icon: Icon, value, label, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500/10 to-blue-600/10 border-blue-500/20",
      green: "from-green-500/10 to-green-600/10 border-green-500/20",
      purple: "from-purple-500/10 to-purple-600/10 border-purple-500/20",
      orange: "from-orange-500/10 to-orange-600/10 border-orange-500/20",
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 backdrop-blur-sm`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Icon size={20} className="text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-gray-300">{label}</div>
          </div>
        </div>
      </div>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Alert
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ isOpen: false })}
        message={alertConfig.message}
        type={alertConfig.type}
        customButtons={alertConfig.customButtons}
      />

      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-gray-300 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <BarChart className="text-orange-400" size={28} />
                  Heap Sort Visualizer
                </h1>
                <p className="text-gray-400 text-sm">
                  Comparison-based sorting using binary heap • O(n log n) time complexity
                </p>
              </div>
            </div>
          </div>
        </div>

        <PanelGroup direction="horizontal" className="flex-1">
          {/* Left Panel - Controls */}
          <Panel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full bg-gray-800/30 backdrop-blur-sm border-r border-gray-700 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Array Configuration */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings size={18} />
                    Array Configuration
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="randomArray"
                        checked={useRandomArray}
                        onChange={(e) => setUseRandomArray(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="randomArray" className="text-sm text-gray-300">
                        Use Random Array
                      </label>
                    </div>

                    {useRandomArray ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Array Size: {arraySize}
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          value={arraySize}
                          onChange={(e) => setArraySize(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Custom Array (comma-separated)
                        </label>
                        <textarea
                          value={customArray}
                          onChange={(e) => setCustomArray(e.target.value)}
                          placeholder="64,34,25,12,22,11,90"
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                          rows="3"
                        />
                        {arrayValidationError && (
                          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                            <AlertTriangle size={16} />
                            {arrayValidationError}
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sort Direction
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSortDirection('ascending')}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            sortDirection === 'ascending'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          <ArrowUp size={16} />
                          Ascending
                        </button>
                        <button
                          onClick={() => setSortDirection('descending')}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            sortDirection === 'descending'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          <ArrowDown size={16} />
                          Descending
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateArray}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Shuffle size={18} />
                      Generate Array
                    </button>
                  </div>
                </div>

                {/* Sort Controls */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Play size={18} />
                    Sort Controls
                  </h3>
                  
                  <div className="space-y-4">
                    <button
                      onClick={handleStartSort}
                      disabled={!isValidArray}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                      <BarChart size={18} />
                      Start Heap Sort
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={playing ? handlePause : handlePlay}
                        disabled={!started || steps.length === 0}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                      >
                        {playing ? <Pause size={16} /> : <Play size={16} />}
                        {playing ? "Pause" : "Play"}
                      </button>
                      
                      <button
                        onClick={handleStepForward}
                        disabled={!started || currentStep >= steps.length - 1}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                      >
                        <SkipForward size={16} />
                        Step
                      </button>
                    </div>

                    <button
                      onClick={handleReset}
                      disabled={!started}
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                      <RotateCcw size={16} />
                      Reset
                    </button>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Animation Speed: {speed}ms
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={speed}
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-600 transition-colors" />

          {/* Middle Panel - Visualization */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-gray-900/50 backdrop-blur-sm p-6 overflow-hidden">
              <div className="h-full flex flex-col">
                {/* Phase Indicator */}
                {currentStepData && (
                  <div className="mb-4">
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        currentStepData.phase === 'building' ? 'bg-yellow-600/20 text-yellow-400' :
                        currentStepData.phase === 'built' ? 'bg-blue-600/20 text-blue-400' :
                        currentStepData.phase === 'sorting' ? 'bg-purple-600/20 text-purple-400' :
                        'bg-green-600/20 text-green-400'
                      }`}>
                        {currentStepData.phase === 'building' ? 'Building Heap' :
                         currentStepData.phase === 'built' ? 'Heap Built' :
                         currentStepData.phase === 'sorting' ? 'Sorting' : 'Completed'}
                      </div>
                      {currentStepData.heapSize > 0 && (
                        <div className="text-sm text-gray-400">
                          Heap Size: {currentStepData.heapSize}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Array Visualization */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="max-w-full overflow-x-auto">
                    <div className="flex gap-2 p-4">
                      {currentArray.map((value, index) => {
                        const isComparing = currentStepData?.comparing?.includes(index);
                        const isSwapping = currentStepData?.swapping?.includes(index);
                        const isSwapped = currentStepData?.swapped?.includes(index);
                        const isHighlighting = currentStepData?.highlighting?.includes(index);
                        const isSorted = currentStepData?.sorted?.includes(index);
                        const isInHeap = currentStepData ? index < (currentStepData.heapSize || currentArray.length) : true;

                        return (
                          <div
                            key={index}
                            className={`
                              relative flex flex-col items-center min-w-[60px] transition-all duration-500
                              ${isSwapping || isSwapped
                                ? "transform scale-110" 
                                : isComparing || isHighlighting
                                ? "transform scale-105"
                                : ""
                              }
                            `}
                          >
                            {/* Index */}
                            <div className="text-xs text-gray-400 mb-2">{index}</div>
                            
                            {/* Array Element */}
                            <div
                              className={`
                                w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm border-2 transition-all duration-500
                                ${isSorted
                                  ? "bg-gradient-to-br from-green-500 to-green-600 border-green-400 shadow-lg shadow-green-500/25"
                                  : isSwapping
                                  ? "bg-gradient-to-br from-red-500 to-red-600 border-red-400 shadow-lg shadow-red-500/25"
                                  : isSwapped
                                  ? "bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-400 shadow-lg shadow-yellow-500/25"
                                  : isComparing
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 shadow-lg shadow-blue-500/25"
                                  : isHighlighting
                                  ? "bg-gradient-to-br from-purple-500 to-purple-600 border-purple-400 shadow-lg shadow-purple-500/25"
                                  : isInHeap
                                  ? "bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500"
                                  : "bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 opacity-50"
                                }
                              `}
                              style={{
                                height: `${Math.max(40, (value / Math.max(...currentArray)) * 60)}px`
                              }}
                            >
                              {value}
                            </div>

                            {/* Heap property indicators */}
                            {isInHeap && !isSorted && (
                              <div className="absolute -bottom-6 text-xs text-orange-400">
                                {index === 0 && "Root"}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Step Description */}
                {currentStepData?.description && (
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-600/20 rounded-lg">
                        <BarChart size={18} className="text-orange-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-300">
                          Step {currentStep + 1} of {steps.length}
                        </div>
                        <div className="text-white font-medium">
                          {currentStepData.description}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {steps.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-600 transition-colors" />

          {/* Right Panel - Stats and Code */}
          <Panel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full bg-gray-800/30 backdrop-blur-sm border-l border-gray-700 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Tab Navigation */}
                <div className="flex gap-2">
                  <TabButton id="stats" icon={BarChart3} label="Stats" />
                  <TabButton id="code" icon={Code2} label="Code" />
                </div>

                {/* Stats Tab */}
                {activeRightTab === "stats" && (
                  <div className="space-y-4">
                    <StatCard
                      icon={Activity}
                      value={currentStepData?.comparisons || 0}
                      label="Comparisons"
                      color="blue"
                    />
                    <StatCard
                      icon={Target}
                      value={currentStepData?.swaps || 0}
                      label="Swaps"
                      color="green"
                    />
                    <StatCard
                      icon={Clock}
                      value={steps.length > 0 ? `${currentStep + 1}/${steps.length}` : "0/0"}
                      label="Steps"
                      color="purple"
                    />
                    <StatCard
                      icon={BarChart}
                      value={currentArray.length}
                      label="Array Size"
                      color="orange"
                    />

                    {/* Algorithm Info */}
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">Algorithm Info</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time Complexity:</span>
                          <span className="text-white font-mono">O(n log n)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Space Complexity:</span>
                          <span className="text-white font-mono">O(1)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white">Comparison Sort</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Stable:</span>
                          <span className="text-white">No</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">In-place:</span>
                          <span className="text-white">Yes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Code Tab */}
                {activeRightTab === "code" && (
                  <BasicCodeDisplay
                    code={heapSortCode}
                    language="cpp"
                    highlightedLine={currentHighlightedLine}
                  />
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
