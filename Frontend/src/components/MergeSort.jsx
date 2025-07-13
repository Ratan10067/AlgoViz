import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle, ArrowDown, ArrowUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import BasicCodeDisplay from "./BasicCodeDisplay";
import { mergeSort as mergeSortCode } from "../algorithms/codeExamples";

export default function MergeSortVisualizer() {
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
  
  // Features state
  const [sortDirection, setSortDirection] = useState('ascending');
  const [dataType, setDataType] = useState('number');
  
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

  // Recursive step computation for merge sort
  const computeRecursiveMergeSortSteps = (arr) => {
    const frames = [];
    let comparisons = 0;
    let merges = 0;
    let stepCount = 0;
    
    // Recursive function to capture steps
    const mergeSortRecursive = (arr, depth = 0, path = []) => {
      if (arr.length <= 1) {
        frames.push({
          array: [...arr],
          depth,
          path,
          action: `Base case reached: [${arr.join(', ')}]`,
          comparisons,
          merges,
          step: stepCount++,
          state: 'base'
        });
        return arr;
      }
      
      const mid = Math.floor(arr.length / 2);
      const left = arr.slice(0, mid);
      const right = arr.slice(mid);
      
      // Push division step
      frames.push({
        array: [...arr],
        left: [...left],
        right: [...right],
        depth,
        path,
        action: `Dividing array at index ${mid}`,
        comparisons,
        merges,
        step: stepCount++,
        state: 'divide'
      });
      
      // Process left subtree
      const leftPath = [...path, 'left'];
      const sortedLeft = mergeSortRecursive(left, depth + 1, leftPath);
      
      // Process right subtree
      const rightPath = [...path, 'right'];
      const sortedRight = mergeSortRecursive(right, depth + 1, rightPath);
      
      // Merge step
      const merged = [];
      let i = 0, j = 0;
      
      while (i < sortedLeft.length && j < sortedRight.length) {
        comparisons++;
        
        let shouldTakeLeft;
        if (sortDirection === 'ascending') {
          shouldTakeLeft = dataType === 'number' 
            ? sortedLeft[i] <= sortedRight[j]
            : sortedLeft[i].localeCompare(sortedRight[j]) <= 0;
        } else {
          shouldTakeLeft = dataType === 'number' 
            ? sortedLeft[i] >= sortedRight[j]
            : sortedLeft[i].localeCompare(sortedRight[j]) >= 0;
        }
        
        frames.push({
          array: [...arr],
          left: [...sortedLeft],
          right: [...sortedRight],
          comparing: [sortedLeft[i], sortedRight[j]],
          depth,
          path,
          action: `Comparing ${sortedLeft[i]} and ${sortedRight[j]}`,
          comparisons,
          merges,
          step: stepCount++,
          state: 'comparing'
        });
        
        if (shouldTakeLeft) {
          merged.push(sortedLeft[i]);
          i++;
        } else {
          merged.push(sortedRight[j]);
          j++;
        }
        
        frames.push({
          array: [...arr],
          left: [...sortedLeft],
          right: [...sortedRight],
          merged: [...merged],
          depth,
          path,
          action: `Placed ${merged[merged.length - 1]} in merged array`,
          comparisons,
          merges,
          step: stepCount++,
          state: 'merging'
        });
      }
      
      // Add remaining elements
      while (i < sortedLeft.length) {
        merged.push(sortedLeft[i]);
        frames.push({
          array: [...arr],
          left: [...sortedLeft],
          right: [...sortedRight],
          merged: [...merged],
          depth,
          path,
          action: `Added remaining element: ${sortedLeft[i]}`,
          comparisons,
          merges,
          step: stepCount++,
          state: 'merging'
        });
        i++;
      }
      
      while (j < sortedRight.length) {
        merged.push(sortedRight[j]);
        frames.push({
          array: [...arr],
          left: [...sortedLeft],
          right: [...sortedRight],
          merged: [...merged],
          depth,
          path,
          action: `Added remaining element: ${sortedRight[j]}`,
          comparisons,
          merges,
          step: stepCount++,
          state: 'merging'
        });
        j++;
      }
      
      merges++;
      frames.push({
        array: [...merged],
        left: [...sortedLeft],
        right: [...sortedRight],
        merged: [...merged],
        depth,
        path,
        action: `Merged completed: [${merged.join(', ')}]`,
        comparisons,
        merges,
        step: stepCount++,
        state: 'merged'
      });
      
      return merged;
    };
    
    // Initial frame
    frames.push({
      array: [...arr],
      depth: 0,
      path: ['root'],
      action: "Starting Merge Sort",
      comparisons,
      merges,
      step: stepCount++,
      state: 'start'
    });
    
    // Start recursive process
    mergeSortRecursive(arr);
    
    // Final frame
    frames.push({
      array: [...arr],
      depth: 0,
      path: ['root'],
      action: "Sorting complete!",
      comparisons,
      merges,
      step: stepCount++,
      state: 'complete'
    });
    
    return frames;
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
    const steps = computeRecursiveMergeSortSteps(array);
    setSteps(steps);
    setCurrentStep(0);
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
      teal: "from-teal-500/20 to-teal-600/20 border-teal-500/30",
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

  // Tree visualization component
  const TreeVisualization = () => {
    if (!steps.length || !steps[currentStep]) return null;

    const step = steps[currentStep];
    
    const renderNode = (content, depth, isLeaf = false) => {
      const depthColors = [
        "bg-blue-500",
        "bg-purple-500",
        "bg-teal-500",
        "bg-pink-500",
        "bg-orange-500",
        "bg-indigo-500",
      ];
      
      const colorClass = depthColors[depth % depthColors.length] || "bg-gray-500";
      
      return (
        <div className={`${colorClass} p-3 rounded-lg shadow-lg text-white flex items-center justify-center transition-all duration-300 ${isLeaf ? 'w-12 h-12' : 'min-w-[80px] min-h-[60px]'}`}>
          <span className="text-xs font-semibold truncate px-1">{content}</span>
        </div>
      );
    };

    const renderTreeLevel = (depth, maxDepth) => {
      if (depth > maxDepth) return null;
      
      return (
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {renderNode(`Depth ${depth}`, depth)}
          </div>
          
          <div className="flex space-x-8">
            {renderTreeLevel(depth + 1, maxDepth)}
            {renderTreeLevel(depth + 1, maxDepth)}
          </div>
        </div>
      );
    };

    const renderRecursiveTree = () => {
      const currentDepth = step.depth || 0;
      const maxDepth = Math.min(5, Math.floor(Math.log2(currentArray.length)) + 1);
      
      return (
        <div className="flex flex-col items-center w-full h-full overflow-auto p-4">
          {/* Current step info */}
          <div className="mb-4 p-3 bg-gray-700/50 rounded-lg backdrop-blur-sm">
            <div className="text-sm text-center text-white font-mono">
              {step.action}
            </div>
          </div>
          
          {/* Tree structure */}
          <div className="flex flex-col items-center">
            {/* Root node */}
            <div className="mb-4">
              {renderNode(step.array.join(', '), 0)}
            </div>
            
            {/* Arrows to children */}
            {step.depth !== undefined && step.depth < maxDepth && (
              <div className="flex justify-center space-x-16 mb-4">
                <ArrowDown className="text-blue-400" size={24} />
                <ArrowDown className="text-purple-400" size={24} />
              </div>
            )}
            
            {/* Child nodes */}
            {step.depth !== undefined && step.depth < maxDepth && (
              <div className="flex space-x-16">
                {step.left && (
                  <div className="flex flex-col items-center">
                    {renderNode(step.left.join(', '), step.depth + 1)}
                    {step.depth + 1 < maxDepth && (
                      <ArrowDown className="text-blue-400 mt-2" size={24} />
                    )}
                  </div>
                )}
                
                {step.right && (
                  <div className="flex flex-col items-center">
                    {renderNode(step.right.join(', '), step.depth + 1)}
                    {step.depth + 1 < maxDepth && (
                      <ArrowDown className="text-purple-400 mt-2" size={24} />
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Grandchild nodes */}
            {step.depth !== undefined && step.depth + 1 < maxDepth && (
              <div className="flex space-x-32 mt-4">
                {step.left && step.left.length > 1 && (
                  <>
                    <div className="flex flex-col items-center">
                      {renderNode(step.left.slice(0, Math.floor(step.left.length/2)).join(', '), step.depth + 2, true)}
                    </div>
                    <div className="flex flex-col items-center">
                      {renderNode(step.left.slice(Math.floor(step.left.length/2)).join(', '), step.depth + 2, true)}
                    </div>
                  </>
                )}
                
                {step.right && step.right.length > 1 && (
                  <>
                    <div className="flex flex-col items-center">
                      {renderNode(step.right.slice(0, Math.floor(step.right.length/2)).join(', '), step.depth + 2, true)}
                    </div>
                    <div className="flex flex-col items-center">
                      {renderNode(step.right.slice(Math.floor(step.right.length/2)).join(', '), step.depth + 2, true)}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Merged result */}
          {step.merged && (
            <div className="mt-8 p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl backdrop-blur-sm">
              <div className="text-sm font-semibold text-green-300 mb-2">Merged Result</div>
              <div className="text-white font-mono">
                {step.merged.join(', ')}
              </div>
            </div>
          )}
        </div>
      );
    };

    return renderRecursiveTree();
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
              Merge Sort Visualizer
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
                    Recursion Depth Legend
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                      <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                      <span className="text-sm text-blue-300">Depth 0: Root</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl">
                      <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                      <span className="text-sm text-purple-300">Depth 1: First split</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-teal-500/20 border border-teal-500/30 rounded-xl">
                      <div className="w-4 h-4 bg-teal-500 rounded-sm"></div>
                      <span className="text-sm text-teal-300">Depth 2: Second split</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-pink-500/20 border border-pink-500/30 rounded-xl">
                      <div className="w-4 h-4 bg-pink-500 rounded-sm"></div>
                      <span className="text-sm text-pink-300">Leaf nodes: Base case</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600 cursor-col-resize transition-colors" />

          {/* Center Visualization */}
          <Panel minSize={40}>
            <div className="h-full bg-gray-800/30 backdrop-blur-sm overflow-auto">
              <TreeVisualization />
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
                        value={steps[currentStep]?.merges || 0}
                        label="Merges"
                        color="teal"
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

                    {/* Current State */}
                    {steps[currentStep] && (
                      <div className="space-y-3">
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-blue-400">
                              Recursion Depth
                            </span>
                          </div>
                          <span className="font-mono text-blue-300 text-sm">
                            {steps[currentStep].depth}
                          </span>
                        </div>

                        {steps[currentStep].left && (
                          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <span className="text-sm font-semibold text-purple-400">
                                Left Subarray
                              </span>
                            </div>
                            <span className="font-mono text-purple-300 text-sm">
                              {steps[currentStep].left.join(', ')}
                            </span>
                          </div>
                        )}

                        {steps[currentStep].right && (
                          <div className="bg-teal-500/20 border border-teal-500/30 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                              <span className="text-sm font-semibold text-teal-400">
                                Right Subarray
                              </span>
                            </div>
                            <span className="font-mono text-teal-300 text-sm">
                              {steps[currentStep].right.join(', ')}
                            </span>
                          </div>
                        )}

                        {steps[currentStep].merged && (
                          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-semibold text-green-400">
                                Merged Result
                              </span>
                            </div>
                            <span className="font-mono text-green-300 text-sm">
                              {steps[currentStep].merged.join(', ')}
                            </span>
                          </div>
                        )}
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
                          Recursive Merge Sort Implementation
                        </h3>
                      </div>
                      
                      <div className="flex-1 overflow-auto">
                        <BasicCodeDisplay
                          cppCode={mergeSortCode.cpp}
                          pythonCode={mergeSortCode.python}
                          jsCode={mergeSortCode.javascript}
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
                            <span className="font-semibold">Recursive Division:</span> The array is repeatedly divided into halves until single elements are reached
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>
                            <span className="font-semibold">Base Case:</span> Arrays of length 1 are inherently sorted
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>
                            <span className="font-semibold">Merging:</span> Sorted subarrays are combined by comparing elements and building a sorted result
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>
                            <span className="font-semibold">Time Complexity:</span> O(n log n) in all cases due to the divide-and-conquer approach
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