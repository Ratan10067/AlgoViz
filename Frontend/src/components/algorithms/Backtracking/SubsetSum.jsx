import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Grid3X3, Calculator, Plus, Minus, Hash, Equal, Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const subsetSumCode = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

class SubsetSum {
private:
    vector<int> numbers;
    vector<vector<int>> solutions;
    vector<int> currentSubset;
    int targetSum;
    
public:
    bool findSubsetSum(vector<int>& arr, int target) {        // Line 11
        numbers = arr;
        targetSum = target;
        solutions.clear();
        currentSubset.clear();
        
        return backtrack(0, 0);                              // Line 17
    }
    
    bool backtrack(int index, int currentSum) {             // Line 20
        // Base case: if current sum equals target
        if (currentSum == targetSum) {                       // Line 22
            solutions.push_back(currentSubset);             // Line 23
            return true;                                     // Line 24
        }
        
        // Base case: if sum exceeds target or no more elements
        if (currentSum > targetSum || index >= numbers.size()) {  // Line 28
            return false;                                    // Line 29
        }
        
        // Include current element
        currentSubset.push_back(numbers[index]);             // Line 33
        if (backtrack(index + 1, currentSum + numbers[index])) {  // Line 34
            return true;                                     // Line 35
        }
        
        // Backtrack: remove current element
        currentSubset.pop_back();                            // Line 39
        
        // Exclude current element
        if (backtrack(index + 1, currentSum)) {             // Line 42
            return true;                                     // Line 43
        }
        
        return false;                                        // Line 46
    }
    
    vector<vector<int>> getAllSolutions() {                 // Line 49
        return solutions;                                    // Line 50
    }
};`,

  python: `class SubsetSum:
    def __init__(self):
        self.numbers = []
        self.solutions = []
        self.current_subset = []
        self.target_sum = 0
    
    def find_subset_sum(self, arr, target):                 # Line 8
        self.numbers = arr
        self.target_sum = target
        self.solutions = []
        self.current_subset = []
        
        return self.backtrack(0, 0)                         # Line 14
    
    def backtrack(self, index, current_sum):               # Line 16
        # Base case: if current sum equals target
        if current_sum == self.target_sum:                 # Line 18
            self.solutions.append(self.current_subset[:])  # Line 19
            return True                                    # Line 20
        
        # Base case: if sum exceeds target or no more elements
        if current_sum > self.target_sum or index >= len(self.numbers):  # Line 23
            return False                                   # Line 24
        
        # Include current element
        self.current_subset.append(self.numbers[index])   # Line 27
        if self.backtrack(index + 1, current_sum + self.numbers[index]):  # Line 28
            return True                                    # Line 29
        
        # Backtrack: remove current element
        self.current_subset.pop()                          # Line 32
        
        # Exclude current element
        if self.backtrack(index + 1, current_sum):        # Line 35
            return True                                    # Line 36
        
        return False                                       # Line 38
    
    def get_all_solutions(self):                          # Line 40
        return self.solutions                             # Line 41`,

  javascript: `class SubsetSum {
    constructor() {
        this.numbers = [];
        this.solutions = [];
        this.currentSubset = [];
        this.targetSum = 0;
    }
    
    findSubsetSum(arr, target) {                          // Line 10
        this.numbers = arr;
        this.targetSum = target;
        this.solutions = [];
        this.currentSubset = [];
        
        return this.backtrack(0, 0);                      // Line 16
    }
    
    backtrack(index, currentSum) {                        // Line 19
        // Base case: if current sum equals target
        if (currentSum === this.targetSum) {              // Line 21
            this.solutions.push([...this.currentSubset]); // Line 22
            return true;                                  // Line 23
        }
        
        // Base case: if sum exceeds target or no more elements
        if (currentSum > this.targetSum || index >= this.numbers.length) {  // Line 27
            return false;                                 // Line 28
        }
        
        // Include current element
        this.currentSubset.push(this.numbers[index]);     // Line 32
        if (this.backtrack(index + 1, currentSum + this.numbers[index])) {  // Line 33
            return true;                                  // Line 34
        }
        
        // Backtrack: remove current element
        this.currentSubset.pop();                         // Line 38
        
        // Exclude current element
        if (this.backtrack(index + 1, currentSum)) {      // Line 41
            return true;                                  // Line 42
        }
        
        return false;                                     // Line 45
    }
    
    getAllSolutions() {                                   // Line 48
        return this.solutions;                            // Line 49
    }
}`
};

// Sample datasets
const sampleDatasets = {
  small: {
    numbers: [3, 34, 4, 12, 5, 2],
    target: 9,
    name: "Small Set"
  },
  medium: {
    numbers: [1, 3, 5, 7, 9, 11, 13, 15],
    target: 21,
    name: "Medium Set"
  },
  large: {
    numbers: [2, 3, 7, 8, 10, 15, 20, 25, 30, 35],
    target: 45,
    name: "Large Set"
  },
  challenging: {
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    target: 55,
    name: "Sum of All"
  }
};

export default function SubsetSumVisualizer() {
  const navigate = useNavigate();
  
  // Algorithm state
  const [numbers, setNumbers] = useState(sampleDatasets.small.numbers);
  const [targetSum, setTargetSum] = useState(sampleDatasets.small.target);
  const [selectedDataset, setSelectedDataset] = useState('small');
  const [currentSubset, setCurrentSubset] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentSum, setCurrentSum] = useState(0);
  const [solutions, setSolutions] = useState([]);
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [attempts, setAttempts] = useState(0);
  const [backtracks, setBacktracks] = useState(0);
  
  // UI state
  const [activeRightTab, setActiveRightTab] = useState("stats");
  const [currentHighlightedLine, setCurrentHighlightedLine] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "info",
    customButtons: null,
  });

  // Initialize dataset
  useEffect(() => {
    const dataset = sampleDatasets[selectedDataset];
    setNumbers(dataset.numbers);
    setTargetSum(dataset.target);
    resetVisualization();
  }, [selectedDataset]);

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setPlaying(false);
    setStarted(false);
    setCurrentIndex(-1);
    setCurrentSum(0);
    setCurrentSubset([]);
    setSolutions([]);
    setAttempts(0);
    setBacktracks(0);
    setCurrentHighlightedLine(null);
  };

  // Subset sum solving algorithm
  const solveSubsetSum = () => {
    const newSteps = [];
    const foundSolutions = [];
    const currentPath = [];
    let attemptCount = 0;
    let backtrackCount = 0;

    const backtrack = (index, sum) => {
      attemptCount++;

      newSteps.push({
        type: 'exploring',
        index,
        sum,
        subset: [...currentPath],
        description: `Exploring index ${index} with current sum ${sum}`,
        action: 'explore_index',
        explanation: `At index ${index}, current sum is ${sum}. Considering element ${numbers[index] || 'none'}.`,
        currentLine: 20,
        attempts: attemptCount,
        backtracks: backtrackCount,
        solutions: foundSolutions.length
      });

      // Base case: target sum reached
      if (sum === targetSum) {
        foundSolutions.push([...currentPath]);
        newSteps.push({
          type: 'solution_found',
          index,
          sum,
          subset: [...currentPath],
          description: `Solution found! Subset: [${currentPath.join(', ')}] = ${targetSum}`,
          action: 'solution_found',
          explanation: `Target sum ${targetSum} achieved with subset [${currentPath.join(', ')}].`,
          currentLine: 22,
          attempts: attemptCount,
          backtracks: backtrackCount,
          solutions: foundSolutions.length
        });
        return true;
      }

      // Base case: sum exceeds target or no more elements
      if (sum > targetSum || index >= numbers.length) {
        newSteps.push({
          type: 'invalid_path',
          index,
          sum,
          subset: [...currentPath],
          description: sum > targetSum ? 
            `Sum ${sum} exceeds target ${targetSum}` : 
            `Reached end of array without finding solution`,
          action: 'invalid_path',
          explanation: sum > targetSum ? 
            `Current sum ${sum} is greater than target ${targetSum}. This path is invalid.` :
            `Reached end of numbers array. No more elements to consider.`,
          currentLine: 28,
          attempts: attemptCount,
          backtracks: backtrackCount,
          solutions: foundSolutions.length
        });
        return false;
      }

      // Include current element
      const currentNumber = numbers[index];
      currentPath.push(currentNumber);
      
      newSteps.push({
        type: 'include',
        index,
        sum,
        newSum: sum + currentNumber,
        number: currentNumber,
        subset: [...currentPath],
        description: `Including ${currentNumber}: new sum = ${sum + currentNumber}`,
        action: 'include_element',
        explanation: `Adding element ${currentNumber} to subset. New sum becomes ${sum + currentNumber}.`,
        currentLine: 33,
        attempts: attemptCount,
        backtracks: backtrackCount,
        solutions: foundSolutions.length
      });

      if (backtrack(index + 1, sum + currentNumber)) {
        return true;
      }

      // Backtrack: remove current element
      currentPath.pop();
      backtrackCount++;

      newSteps.push({
        type: 'backtrack_include',
        index,
        sum,
        number: currentNumber,
        subset: [...currentPath],
        description: `Backtracking: removing ${currentNumber} from subset`,
        action: 'backtrack_include',
        explanation: `Including ${currentNumber} didn't lead to solution. Removing it and trying exclusion.`,
        currentLine: 39,
        attempts: attemptCount,
        backtracks: backtrackCount,
        solutions: foundSolutions.length
      });

      // Exclude current element
      newSteps.push({
        type: 'exclude',
        index,
        sum,
        number: currentNumber,
        subset: [...currentPath],
        description: `Excluding ${currentNumber}: keeping sum = ${sum}`,
        action: 'exclude_element',
        explanation: `Skipping element ${currentNumber}. Sum remains ${sum}.`,
        currentLine: 42,
        attempts: attemptCount,
        backtracks: backtrackCount,
        solutions: foundSolutions.length
      });

      if (backtrack(index + 1, sum)) {
        return true;
      }

      return false;
    };

    newSteps.push({
      type: 'initialization',
      index: 0,
      sum: 0,
      subset: [],
      description: `Starting subset sum search for target ${targetSum}`,
      action: 'initialize',
      explanation: `Beginning search for subset that sums to ${targetSum} using backtracking algorithm.`,
      currentLine: 11,
      attempts: 0,
      backtracks: 0,
      solutions: 0
    });

    const solutionExists = backtrack(0, 0);

    if (!solutionExists && foundSolutions.length === 0) {
      newSteps.push({
        type: 'no_solution',
        index: -1,
        sum: 0,
        subset: [],
        description: `No subset found that sums to ${targetSum}`,
        action: 'no_solution',
        explanation: `Exhausted all possibilities. No subset of given numbers sums to ${targetSum}.`,
        currentLine: -1,
        attempts: attemptCount,
        backtracks: backtrackCount,
        solutions: 0
      });
    }

    setSteps(newSteps);
    setSolutions(foundSolutions);
    setAttempts(attemptCount);
    setBacktracks(backtrackCount);
    setCurrentStep(0);
    setStarted(true);
  };

  // Animation control
  useEffect(() => {
    let interval;
    if (playing && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= steps.length - 1) {
            setPlaying(false);
          }
          return next;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [playing, currentStep, steps.length, speed]);

  // Update visualization based on current step
  useEffect(() => {
    if (steps[currentStep]) {
      const currentStepData = steps[currentStep];
      setCurrentIndex(currentStepData.index);
      setCurrentSum(currentStepData.sum);
      setCurrentSubset(currentStepData.subset);
      setCurrentHighlightedLine(currentStepData.currentLine);
      setAttempts(currentStepData.attempts);
      setBacktracks(currentStepData.backtracks);
    }
  }, [currentStep, steps]);

  const getNumberClass = (index) => {
    const isCurrentIndex = currentIndex === index;
    const isInSubset = currentSubset.includes(numbers[index]);
    const currentStepData = steps[currentStep];
    
    let baseClass = "p-4 rounded-xl border-2 font-mono text-lg font-bold transition-all duration-500";
    
    if (isCurrentIndex && currentStepData) {
      switch (currentStepData.type) {
        case 'exploring':
          baseClass += " border-blue-400 bg-blue-100 text-blue-800 ring-4 ring-blue-300";
          break;
        case 'include':
          baseClass += " border-green-400 bg-green-100 text-green-800 ring-4 ring-green-300";
          break;
        case 'exclude':
          baseClass += " border-gray-400 bg-gray-100 text-gray-600 ring-4 ring-gray-300";
          break;
        case 'backtrack_include':
          baseClass += " border-orange-400 bg-orange-100 text-orange-800 ring-4 ring-orange-300";
          break;
        default:
          baseClass += " border-indigo-400 bg-indigo-100 text-indigo-800 ring-2 ring-indigo-300";
      }
    } else if (isInSubset) {
      baseClass += " border-green-500 bg-green-200 text-green-900";
    } else {
      baseClass += " border-gray-300 bg-white text-gray-700 hover:border-gray-400";
    }
    
    return baseClass;
  };

  const loadDataset = (datasetKey) => {
    setSelectedDataset(datasetKey);
  };

  const generateRandomDataset = () => {
    const size = Math.floor(Math.random() * 6) + 5; // 5-10 numbers
    const newNumbers = [];
    for (let i = 0; i < size; i++) {
      newNumbers.push(Math.floor(Math.random() * 20) + 1); // 1-20
    }
    const randomTarget = Math.floor(Math.random() * 30) + 10; // 10-40
    
    setNumbers(newNumbers);
    setTargetSum(randomTarget);
    setSelectedDataset('custom');
    resetVisualization();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all duration-200"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Home</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <Calculator size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Subset Sum</h1>
                <p className="text-sm text-gray-400">Backtracking Algorithm Visualization</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-700/50 px-4 py-2 rounded-xl">
              <span className="text-sm text-gray-300">
                Time: O(2^n) | Space: O(n) | Backtracking
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Resizable Panels */}
      <div className="pt-16 h-screen">
        <PanelGroup 
          direction="horizontal" 
          onLayout={(sizes) => {
            setIsResizing(false);
          }}
        >
          {/* Left Panel - Settings */}
          <Panel 
            defaultSize={25} 
            minSize={20} 
            maxSize={40}
            onResize={() => setIsResizing(true)}
          >
            <div className="h-full bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-indigo-400" />
                  <h2 className="text-lg font-semibold text-gray-200">Algorithm Settings</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Dataset Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Select Dataset
                  </label>
                  <div className="space-y-2">
                    {Object.entries(sampleDatasets).map(([key, dataset]) => (
                      <button
                        key={key}
                        onClick={() => loadDataset(key)}
                        className={`w-full py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                          selectedDataset === key
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                        }`}
                      >
                        {dataset.name}
                      </button>
                    ))}
                    <button
                      onClick={generateRandomDataset}
                      className="w-full py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 flex items-center justify-center gap-2"
                    >
                      <Shuffle size={16} />
                      Generate Random
                    </button>
                  </div>
                </div>

                {/* Current Dataset Info */}
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">
                    Current Dataset
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-400">Numbers: </span>
                      <span className="text-gray-300 font-mono">
                        [{numbers.join(', ')}]
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Target Sum: </span>
                      <span className="text-yellow-400 font-mono text-lg">
                        {targetSum}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Array Size: </span>
                      <span className="text-gray-300 font-mono">
                        {numbers.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="pt-4 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Solver Controls
                  </h3>

                  <button
                    onClick={solveSubsetSum}
                    disabled={playing}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-200 shadow-lg mb-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Calculator size={18} />
                      Find Subset
                    </div>
                  </button>

                  {steps.length > 0 && (
                    <>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <button
                          onClick={() => setPlaying(!playing)}
                          disabled={currentStep >= steps.length - 1}
                          className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-200 shadow-lg text-sm"
                        >
                          {playing ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button
                          onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
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
                          onChange={e => setSpeed(parseInt(e.target.value))}
                          className="w-full accent-indigo-500"
                        />
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-semibold text-gray-200">
                            Step Progress
                          </label>
                          <span className="text-sm text-gray-400">
                            {currentStep + 1} / {steps.length}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={steps.length - 1}
                          value={currentStep}
                          onChange={e => setCurrentStep(parseInt(e.target.value))}
                          className="w-full accent-indigo-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Algorithm Info */}
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-200 mb-3">
                    Algorithm Overview
                  </h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      Find a subset of numbers that sum to the target value. For each 
                      element, we decide to either include it or exclude it.
                    </p>
                    <p>
                      Uses backtracking to explore all possible combinations efficiently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200" />

          {/* Middle Panel - Visualization */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-gray-900/50 backdrop-blur-xl flex flex-col">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package size={20} className="text-indigo-400" />
                    <h2 className="text-lg font-semibold text-gray-200">
                      Numbers Array
                    </h2>
                  </div>
                  {steps[currentStep] && (
                    <div className="text-sm text-gray-400">
                      {steps[currentStep].description}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="bg-gray-800/30 p-6 rounded-2xl shadow-2xl w-full max-w-4xl">
                  {/* Target Sum Display */}
                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-400 mb-2">Target Sum</div>
                    <div className="text-4xl font-bold text-yellow-400 font-mono bg-gray-800/50 rounded-xl py-4 px-6 inline-block">
                      {targetSum}
                    </div>
                  </div>

                  {/* Current Sum Display */}
                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-400 mb-2">Current Sum</div>
                    <div className={`text-3xl font-bold font-mono bg-gray-800/50 rounded-xl py-3 px-6 inline-block transition-colors duration-300 ${
                      currentSum === targetSum ? 'text-green-400 bg-green-900/30' : 
                      currentSum > targetSum ? 'text-red-400 bg-red-900/30' : 'text-blue-400'
                    }`}>
                      {currentSum}
                    </div>
                  </div>

                  {/* Numbers Grid */}
                  <div className="grid gap-4 justify-center" style={{
                    gridTemplateColumns: `repeat(${Math.min(numbers.length, 6)}, 1fr)`
                  }}>
                    {numbers.map((number, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="text-xs text-gray-400 mb-2">Index {index}</div>
                        <div className={getNumberClass(index)}>
                          {number}
                        </div>
                        {currentIndex === index && (
                          <div className="mt-2 text-xs text-center">
                            <div className="text-indigo-400 font-semibold">Current</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Current Subset Display */}
                  <div className="mt-8 text-center">
                    <div className="text-sm text-gray-400 mb-3">Current Subset</div>
                    <div className="bg-gray-800/50 rounded-xl py-4 px-6 min-h-[60px] flex items-center justify-center">
                      {currentSubset.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-mono text-green-400">
                            [{currentSubset.join(', ')}]
                          </span>
                          <Equal size={20} className="text-gray-400" />
                          <span className="text-lg font-mono text-blue-400">{currentSum}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Empty subset</span>
                      )}
                    </div>
                  </div>

                  {/* Solutions Display */}
                  {solutions.length > 0 && (
                    <div className="mt-6 text-center">
                      <div className="text-sm text-gray-400 mb-3">
                        Solutions Found ({solutions.length})
                      </div>
                      <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-4">
                        {solutions.map((solution, index) => (
                          <div key={index} className="text-green-400 font-mono mb-2">
                            [{solution.join(', ')}] = {targetSum}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-xs max-w-md">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded"></div>
                    <span className="text-gray-300">Current Index</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 border-2 border-green-500 rounded"></div>
                    <span className="text-gray-300">In Subset</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100 border-2 border-orange-400 rounded"></div>
                    <span className="text-gray-300">Backtracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 border-2 border-gray-400 rounded"></div>
                    <span className="text-gray-300">Excluded</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200" />

          {/* Right Panel - Stats and Code */}
          <Panel defaultSize={25} minSize={20} maxSize={40}>
            <div className="h-full bg-gray-800/50 backdrop-blur-xl border-l border-gray-700/50 flex flex-col">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveRightTab("stats")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                      activeRightTab === "stats"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} />
                      Stats
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveRightTab("algorithm")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                      activeRightTab === "algorithm"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Code2 size={16} />
                      Code
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeRightTab === "stats" && (
                  <div className="space-y-4">
                    {/* Current Step Info */}
                    {steps[currentStep] && (
                      <div className="bg-gray-700/30 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">
                          Current Step
                        </h3>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-400">Action: </span>
                            <span className="text-indigo-400 font-medium">
                              {steps[currentStep].action}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Explanation: </span>
                            <span className="text-gray-300">
                              {steps[currentStep].explanation}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Index: </span>
                            <span className="text-gray-300 font-mono">
                              {steps[currentStep].index >= 0 ? steps[currentStep].index : 'N/A'}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Current Sum: </span>
                            <span className="text-gray-300 font-mono">
                              {steps[currentStep].sum}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Statistics */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-200">
                        Statistics
                      </h3>
                      
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-blue-400">
                            Attempts
                          </span>
                        </div>
                        <span className="font-mono text-blue-300 text-lg">
                          {attempts}
                        </span>
                      </div>

                      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-yellow-400">
                            Backtracks
                          </span>
                        </div>
                        <span className="font-mono text-yellow-300 text-lg">
                          {backtracks}
                        </span>
                      </div>

                      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-green-400">
                            Solutions Found
                          </span>
                        </div>
                        <span className="font-mono text-green-300 text-lg">
                          {solutions.length}
                        </span>
                      </div>

                      <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-purple-400">
                            Current Step
                          </span>
                        </div>
                        <span className="font-mono text-purple-300 text-lg">
                          {currentStep + 1} / {steps.length}
                        </span>
                      </div>

                      <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-indigo-400">
                            Array Size
                          </span>
                        </div>
                        <span className="font-mono text-indigo-300 text-lg">
                          {numbers.length}
                        </span>
                      </div>
                    </div>

                    {/* Algorithm Strategy */}
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-2">
                        Algorithm Strategy
                      </h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>1. For each element, try including it</div>
                        <div>2. If sum exceeds target, backtrack</div>
                        <div>3. If sum equals target, solution found</div>
                        <div>4. Try excluding the element</div>
                        <div>5. Recursively solve subproblems</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeRightTab === "algorithm" && (
                  <div className="space-y-4">
                    <div className="bg-gray-700/30 rounded-xl border border-gray-600/30 overflow-hidden">
                      <div className="flex items-center gap-2 p-3 border-b border-gray-600/30">
                        <Code2 size={18} className="text-indigo-400" />
                        <h3 className="text-lg font-semibold text-gray-200">
                          Subset Sum Implementation
                        </h3>
                      </div>
                      <div className="relative">
                        <BasicCodeDisplay
                          cppCode={subsetSumCode.cpp}
                          pythonCode={subsetSumCode.python}
                          jsCode={subsetSumCode.javascript}
                          highlightedLine={currentHighlightedLine}
                          className="min-h-[300px]"
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Algorithm Complexity
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Time Complexity:</span>
                          <span className="font-mono text-red-400">O(2^n)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Space Complexity:</span>
                          <span className="font-mono text-blue-400">O(n)</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          n = number of elements in array
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Key Concepts
                      </h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div>
                          <span className="text-indigo-400 font-semibold">Binary Choice:</span>
                          <span className="ml-2">
                            For each element, we have two choices: include or exclude.
                          </span>
                        </div>
                        <div>
                          <span className="text-indigo-400 font-semibold">Pruning:</span>
                          <span className="ml-2">
                            Stop exploring when sum exceeds target or array ends.
                          </span>
                        </div>
                        <div>
                          <span className="text-indigo-400 font-semibold">Backtracking:</span>
                          <span className="ml-2">
                            Undo choices and try alternatives when paths fail.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Applications
                      </h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div>• Partition problems</div>
                        <div>• Knapsack variant problems</div>
                        <div>• Resource allocation</div>
                        <div>• Combination sum problems</div>
                        <div>• Dynamic programming optimization</div>
                      </div>
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
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        customButtons={alertConfig.customButtons}
      />
    </div>
  );
}
