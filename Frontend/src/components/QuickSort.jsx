import React, { useState, useEffect } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import BasicCodeDisplay from "./BasicCodeDisplay";
import { quickSort as quickSortCode } from "../algorithms/codeExamples";

export default function QuickSortVisualizer() {
  const navigate = useNavigate();

  const [dataType, setDataType] = useState('number');
  const [sortDirection, setSortDirection] = useState('ascending');
  
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
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error",
    customButtons: null,
  });

  const handleBack = () => {
    setAlertConfig({
      isOpen: true,
      message: "Are you sure you want to leave? Your progress will be lost.",
      type: "warning",
      customButtons: (
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Leave
          </button>
          <button
            onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Stay
          </button>
        </div>
      ),
    });
  };

  // Generate random array
  const generateRandomArray = (size) => {
    if (dataType === 'number') {
      return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    } else {
      const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 
                    'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine',
                    'orange', 'pear', 'quince', 'raspberry', 'strawberry', 'tangerine'];
      return Array.from({ length: size }, () => {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
      });
    }
  };

  // Validate array input
  const validateArray = (arrayString) => {
    try {
      if (!arrayString.trim()) {
        throw new Error("Please enter some values");
      }

      const values = arrayString
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      if (values.length < 2) {
        throw new Error("Array must have at least 2 elements");
      }

      if (values.length > 30) {
        throw new Error("Array cannot have more than 30 elements");
      }

      if (dataType === 'number') {
        const numbers = values.map(num => {
          const parsed = parseInt(num, 10);
          if (isNaN(parsed)) {
            throw new Error(`"${num}" is not a valid number`);
          }
          if (parsed < 1 || parsed > 999) {
            throw new Error(`Numbers must be between 1 and 999`);
          }
          return parsed;
        });
        setArrayValidationError("");
        setIsValidArray(true);
        return numbers;
      } else {
        setArrayValidationError("");
        setIsValidArray(true);
        return values;
      }
        
    } catch (error) {
      setArrayValidationError(error.message);
      setIsValidArray(false);
      return [];
    }
  };

  // Compute quick sort steps
  const computeQuickSortSteps = (inputArray) => {
    const arr = [...inputArray];
    const frames = [];
    let comparisons = 0;
    let swaps = 0;
    let stack = [{ low: 0, high: arr.length - 1 }];

    frames.push({
      array: [...arr],
      pivot: -1,
      comparing: [],
      swapping: [],
      partition: [],
      sorted: [],
      low: -1,
      high: -1,
      i: -1,
      j: -1,
      action: "Initialize Quick Sort",
      comparisons,
      swaps,
    });

    while (stack.length) {
      const { low, high } = stack.pop();
      
      if (low < high) {
        frames.push({
          array: [...arr],
          pivot: high,
          comparing: [],
          swapping: [],
          partition: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
          sorted: [],
          low,
          high,
          i: -1,
          j: low,
          action: `Partitioning from ${low} to ${high}`,
          comparisons,
          swaps,
        });

        const pivotValue = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
          comparisons++;
          
          let shouldCompare;
          if (sortDirection === 'ascending') {
            shouldCompare = dataType === 'number' 
              ? arr[j] < pivotValue
              : arr[j].localeCompare(pivotValue) < 0;
          } else {
            shouldCompare = dataType === 'number' 
              ? arr[j] > pivotValue
              : arr[j].localeCompare(pivotValue) > 0;
          }

          frames.push({
            array: [...arr],
            pivot: high,
            comparing: [j, high],
            swapping: [],
            partition: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
            sorted: [],
            low,
            high,
            i,
            j,
            action: `Compare ${arr[j]} and pivot ${pivotValue}`,
            comparisons,
            swaps,
          });

          if (shouldCompare) {
            i++;
            swaps++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            
            frames.push({
              array: [...arr],
              pivot: high,
              comparing: [],
              swapping: [i, j],
              partition: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
              sorted: [],
              low,
              high,
              i,
              j,
              action: `Swap ${arr[j]} and ${arr[i]}`,
              comparisons,
              swaps,
            });
          }
        }

        swaps++;
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        const pivotIndex = i + 1;
        
        frames.push({
          array: [...arr],
          pivot: pivotIndex,
          comparing: [],
          swapping: [pivotIndex, high],
          partition: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
          sorted: [pivotIndex],
          low,
          high,
          i,
          j: high,
          action: `Place pivot at position ${pivotIndex}`,
          comparisons,
          swaps,
        });

        stack.push({ low: pivotIndex + 1, high });
        stack.push({ low, high: pivotIndex - 1 });
      } else if (low === high) {
        frames.push({
          array: [...arr],
          pivot: low,
          comparing: [],
          swapping: [],
          partition: [],
          sorted: [low],
          low: -1,
          high: -1,
          i: -1,
          j: -1,
          action: `Element ${arr[low]} is in sorted position`,
          comparisons,
          swaps,
        });
      }
    }

    frames.push({
      array: [...arr],
      pivot: -1,
      comparing: [],
      swapping: [],
      partition: [],
      sorted: Array.from({ length: arr.length }, (_, idx) => idx),
      low: -1,
      high: -1,
      i: -1,
      j: -1,
      action: "Sorting complete!",
      comparisons,
      swaps,
    });

    setSteps(frames);
    setCurrentStep(0);
    setStarted(false);
  };

  // Generate array
  const handleGenerateArray = () => {
    let array;
    
    if (useRandomArray) {
      array = generateRandomArray(arraySize);
      setCustomArray(array.join(","));
    } else {
      array = validateArray(customArray);
    }
    
    if (array.length === 0 || !isValidArray) return;

    setCurrentArray(array);
    computeQuickSortSteps(array);
  };

  // Validate array on change
  useEffect(() => {
    if (!useRandomArray) {
      validateArray(customArray);
    } else {
      setIsValidArray(true);
      setArrayValidationError("");
    }
  }, [customArray, useRandomArray, dataType]);

  // Animation loop
  useEffect(() => {
    if (!playing) return;
    
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setPlaying(false);
      }
    }, speed);
    
    return () => clearTimeout(timer);
  }, [playing, currentStep, steps.length, speed]);

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
      blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
      green: "from-green-500/20 to-green-600/20 border-green-500/30",
      yellow: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
      red: "from-red-500/20 to-red-600/20 border-red-500/30",
      purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 backdrop-blur-sm`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${color}-500/20`}>
            <Icon size={20} className={`text-${color}-400`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-2xl font-bold text-white truncate">{value}</div>
            <div className="text-sm text-gray-300">{label}</div>
          </div>
        </div>
      </div>
    );
  };

  // Array visualization component
  const ArrayVisualization = () => {
    if (!steps.length || !steps[currentStep]) return null;

    const step = steps[currentStep];
    const maxValue = Math.max(
      ...step.array.map(val => 
        typeof val === 'number' ? val : val.length
      ),
      1
    );
    const isStringArray = typeof step.array[0] === 'string';

    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="flex items-end gap-2 max-w-full overflow-x-auto">
          {step.array.map((value, index) => {
            let barColor = "bg-gray-400";
            let textColor = "text-gray-200";
            let extraClasses = "";
            let barWidth = "min-w-[40px]";

            if (step.sorted.includes(index)) {
              barColor = "bg-green-500";
              textColor = "text-green-100";
              extraClasses = "shadow-lg shadow-green-500/30";
            } else if (step.comparing.includes(index)) {
              barColor = "bg-yellow-500";
              textColor = "text-yellow-100";
              extraClasses = "shadow-lg shadow-yellow-500/30 scale-110";
            } else if (step.swapping.includes(index)) {
              barColor = "bg-red-500";
              textColor = "text-red-100";
              extraClasses = "shadow-lg shadow-red-500/30 scale-110";
            } else if (index === step.pivot) {
              barColor = "bg-purple-500";
              textColor = "text-purple-100";
              extraClasses = "shadow-lg shadow-purple-500/30";
            } else if (step.partition.includes(index)) {
              barColor = "bg-blue-400";
              textColor = "text-blue-100";
            }

            if (isStringArray) barWidth = "min-w-[60px]";

            const height = Math.max(
              ((isStringArray ? value.length : value) / maxValue) * 300, 
              30
            );

            return (
              <div
                key={index}
                className="flex flex-col items-center transition-all duration-300"
              >
                <div
                  className={`${barColor} ${extraClasses} rounded-t-lg transition-all duration-300 flex items-end justify-center pb-2 ${barWidth}`}
                  style={{ height: `${height}px` }}
                >
                  <span className={`${textColor} text-sm font-bold truncate px-1 max-w-full`}>
                    {value}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1 font-mono">
                  {index}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-800/80 backdrop-blur-lg border-b border-gray-700/50 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Quick Sort Algorithm Visualizer
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 h-full">
        <PanelGroup direction="horizontal">
          {/* Left Panel - Settings */}
          <Panel defaultSize={25} minSize={15} maxSize={40}>
            <div className="h-full bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-purple-400" />
                  <h2 className="text-lg font-semibold text-gray-200">Array Settings</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Data Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Data Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'number', label: "Numbers" },
                      { value: 'string', label: "Strings" }
                    ].map(type => (
                      <button
                        key={type.label}
                        onClick={() => setDataType(type.value)}
                        className={`py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                          dataType === type.value
                            ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Direction */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Sort Direction
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSortDirection('ascending')}
                      className={`py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                        sortDirection === 'ascending'
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                      }`}
                    >
                      Ascending
                    </button>
                    <button
                      onClick={() => setSortDirection('descending')}
                      className={`py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                        sortDirection === 'descending'
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                      }`}
                    >
                      Descending
                    </button>
                  </div>
                </div>

                {/* Array Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Array Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: false, label: "Custom" },
                      { value: true, label: "Random" }
                    ].map(type => (
                      <button
                        key={type.label}
                        onClick={() => setUseRandomArray(type.value)}
                        className={`py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                          useRandomArray === type.value
                            ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Array Size (for random) */}
                {useRandomArray && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Array Size
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="30"
                      value={arraySize}
                      onChange={e => setArraySize(parseInt(e.target.value) || 2)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                )}

                {/* Custom Array Input */}
                {!useRandomArray && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Array Elements (comma-separated)
                    </label>
                    <textarea
                      rows={3}
                      value={customArray}
                      onChange={e => setCustomArray(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white font-mono text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder={dataType === 'number' ? "64,34,25,12,22,11,90" : "apple,banana,cherry,date"}
                    />
                    {arrayValidationError && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                        <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0" />
                        <span className="text-xs text-yellow-300">{arrayValidationError}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerateArray}
                  disabled={!isValidArray}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg transform ${
                    isValidArray
                      ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 text-white"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {useRandomArray ? (
                    <div className="flex items-center justify-center gap-2">
                      <Shuffle size={18} />
                      Generate Random Array
                    </div>
                  ) : (
                    "Generate Array"
                  )}
                </button>

                {/* Controls Section */}
                <div className="pt-4 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Playback Controls
                  </h3>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      onClick={() => {
                        if (!steps.length) return;
                        setStarted(true);
                        setPlaying(!playing);
                      }}
                      disabled={steps.length === 0}
                      className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-200 shadow-lg text-sm"
                    >
                      {playing ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      onClick={() =>
                        setCurrentStep(
                          Math.min(currentStep + 1, steps.length - 1)
                        )
                      }
                      disabled={currentStep >= steps.length - 1}
                      className="flex items-center justify-center py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-200 shadow-lg text-sm"
                    >
                      <SkipForward size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setPlaying(false);
                        setCurrentStep(0);
                        setStarted(false);
                      }}
                      className="flex items-center justify-center py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-medium transition-all duration-200 shadow-lg text-sm"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-gray-200">
                        Animation Speed
                      </label>
                      <span className="text-sm text-gray-400">{speed}ms</span>
                    </div>
                    <input
                      type="range"
                      min={200}
                      max={2000}
                      step={100}
                      value={speed}
                      onChange={e => setSpeed(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Fast</span>
                      <span>Slow</span>
                    </div>
                  </div>
                </div>
                
                {/* Color Legend */}
                <div className="pt-4 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">
                    Color Legend
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                      <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                      <span className="text-sm text-yellow-300">Yellow highlight: Comparison operation</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                      <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                      <span className="text-sm text-red-300">Red highlight: Swap operation</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                      <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                      <span className="text-sm text-green-300">Green bars: Sorted elements</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl">
                      <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                      <span className="text-sm text-purple-300">Purple bar: Pivot element</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                      <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                      <span className="text-sm text-blue-300">Blue bars: Current partition</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600 cursor-col-resize transition-colors" />

          {/* Center Visualization */}
          <Panel minSize={40}>
            <div className="h-full bg-gray-800/30 backdrop-blur-sm">
              <ArrayVisualization />
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600 cursor-col-resize transition-colors" />

          {/* Right Panel */}
          <Panel defaultSize={25} minSize={15} maxSize={40}>
            <div className="h-full bg-gray-800/50 backdrop-blur-xl border-l border-gray-700/50 flex flex-col">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex flex-col gap-2">
                  <TabButton id="stats" icon={BarChart3} label="Statistics & Info" />
                  <TabButton id="algorithm" icon={Code2} label="Algorithm Code" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeRightTab === "stats" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <StatCard
                        icon={Target}
                        value={steps[currentStep]?.comparisons || 0}
                        label="Comparisons"
                        color="blue"
                      />
                      <StatCard
                        icon={Activity}
                        value={steps[currentStep]?.swaps || 0}
                        label="Swaps"
                        color="red"
                      />
                      <StatCard
                        icon={Maximize2}
                        value={currentArray.length}
                        label="Array Size"
                        color="yellow"
                      />
                      <StatCard
                        icon={Clock}
                        value={steps.length > 0 ? `${Math.round(((currentStep + 1) / steps.length) * 100)}%` : "0%"}
                        label="Progress"
                        color="green"
                      />
                    </div>

                    {/* Step Info */}
                    <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30">
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">Current Step</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Step:</span>
                          <span className="font-mono text-purple-400">
                            {currentStep + 1} / {steps.length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        {steps[currentStep] && (
                          <div className="text-sm text-gray-400 mt-2">
                            {steps[currentStep].action}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Partition Information */}
                    {steps[currentStep] && (
                      <div className="space-y-3">
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-blue-400">
                              Current Partition
                            </span>
                          </div>
                          <span className="font-mono text-blue-300 text-sm">
                            {steps[currentStep].low >= 0 
                              ? `Indices ${steps[currentStep].low} to ${steps[currentStep].high}` 
                              : "None"}
                          </span>
                        </div>

                        <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-purple-400">
                              Pivot Element
                            </span>
                          </div>
                          <span className="font-mono text-purple-300 text-sm">
                            {steps[currentStep].pivot >= 0 
                              ? `Index ${steps[currentStep].pivot}: ${steps[currentStep].array[steps[currentStep].pivot]}`
                              : "None"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeRightTab === "algorithm" && (
                  <div className="space-y-4 h-full flex flex-col">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 overflow-hidden flex-1 flex flex-col">
                      <div className="flex items-center gap-2 p-3 border-b border-gray-600/30">
                        <Code2 size={18} className="text-purple-400" />
                        <h3 className="text-lg font-semibold text-gray-200">
                          Quick Sort Implementation
                        </h3>
                      </div>
                      
                      <div className="flex-1 overflow-auto">
                        <BasicCodeDisplay
                          cppCode={quickSortCode.cpp}
                          pythonCode={quickSortCode.python}
                          jsCode={quickSortCode.javascript}
                          highlightedLine={currentHighlightedLine}
                          className="h-full"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 p-4">
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">
                        Algorithm Explanation
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>
                            <span className="font-semibold">Line 2-8:</span> QuickSort function recursively sorts partitions
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>
                            <span className="font-semibold">Line 10-23:</span> Partition function selects pivot and partitions array
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>
                            <span className="font-semibold">Line 14:</span> Pivot is chosen as last element
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>
                            <span className="font-semibold">Line 16-21:</span> Elements are compared to pivot and swapped if needed
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>
                            <span className="font-semibold">Line 24:</span> Pivot is placed in correct position
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      <Alert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        customButtons={alertConfig.customButtons}
      />
    </div>
  );
}