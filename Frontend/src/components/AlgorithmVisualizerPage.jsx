import React, { useState, useEffect } from "react";
import {
  Play,
  Code,
  Settings,
  BarChart3,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Info,
  X,
  Clock,
  Pause,
  SkipForward,
  RotateCcw,
  Home,
  Volume2,
  VolumeX,
  Copy,
  Monitor,
} from "lucide-react";

const AlgorithmVisualizerPage = ({ algorithm }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(5);
  const [arraySize, setArraySize] = useState(20);
  const [inputArray, setInputArray] = useState("64, 34, 25, 12, 22, 11, 90");
  const [currentArray, setCurrentArray] = useState([
    64, 34, 25, 12, 22, 11, 90,
  ]);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [activeIndices, setActiveIndices] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [sortingSteps, setSortingSteps] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentCodeLine, setCurrentCodeLine] = useState(0);

  let intervalRef = null;

  // Default algorithm if none provided
  const defaultAlgorithm = {
    id: "bubble-sort",
    name: "Bubble Sort",
    difficulty: "Easy",
    time: "O(n²)",
    space: "O(1)",
    description:
      "A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
  };

  const selectedAlgorithm = algorithm || defaultAlgorithm;

  const tutorialSteps = [
    {
      title: "Welcome to Algorithm Visualizer!",
      content:
        "This is your interactive learning environment. Let's take a quick tour of the features.",
      position: "center",
    },
    {
      title: "Input & Controls",
      content:
        "On the left side, you'll find input controls, settings, and algorithm parameters. Customize your data here.",
      position: "left",
    },
    {
      title: "Code Display",
      content:
        "The right side shows the algorithm's code with syntax highlighting. Watch it execute step by step.",
      position: "right",
    },
    {
      title: "Visualization Area",
      content:
        "The center area displays the algorithm in action with beautiful animations and real-time updates.",
      position: "center",
    },
    {
      title: "Ready to Learn!",
      content:
        "You're all set! Start exploring algorithms and watch them come to life. Happy learning!",
      position: "center",
    },
  ];

  // Bubble Sort Algorithm Implementation
  const bubbleSort = (arr) => {
    const steps = [];
    const array = [...arr];
    const n = array.length;
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          sorted: [],
          comparisons,
          swaps,
          codeLine: 2,
        });

        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          swaps++;
          steps.push({
            array: [...array],
            comparing: [j, j + 1],
            swapped: [j, j + 1],
            sorted: [],
            comparisons,
            swaps,
            codeLine: 3,
          });
        }
      }
      steps.push({
        array: [...array],
        comparing: [],
        sorted: Array.from({ length: n - i }, (_, idx) => n - 1 - idx),
        comparisons,
        swaps,
        codeLine: 1,
      });
    }

    steps.push({
      array: [...array],
      comparing: [],
      sorted: Array.from({ length: n }, (_, idx) => idx),
      comparisons,
      swaps,
      codeLine: 0,
      completed: true,
    });

    return steps;
  };

  const bubbleSortCode = `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`;

  useEffect(() => {
    // Parse input array when it changes
    try {
      const parsedArray = inputArray
        .split(",")
        .map((num) => parseInt(num.trim()))
        .filter((num) => !isNaN(num));
      if (parsedArray.length > 0) {
        setCurrentArray(parsedArray);
        setSortingSteps([]);
        setCurrentStep(0);
        setComparisons(0);
        setSwaps(0);
        setIsCompleted(false);
      }
    } catch (error) {
      console.error("Invalid array input");
    }
  }, [inputArray]);

  useEffect(() => {
    if (isPlaying && !isPaused && sortingSteps.length > 0) {
      intervalRef = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= sortingSteps.length - 1) {
            setIsPlaying(false);
            setIsCompleted(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1100 - animationSpeed * 100);
    } else {
      clearInterval(intervalRef);
    }

    return () => clearInterval(intervalRef);
  }, [isPlaying, isPaused, animationSpeed, sortingSteps.length]);

  useEffect(() => {
    if (sortingSteps.length > 0 && currentStep < sortingSteps.length) {
      const step = sortingSteps[currentStep];
      setCurrentArray(step.array);
      setActiveIndices(step.comparing || []);
      setComparisons(step.comparisons);
      setSwaps(step.swaps);
      setCurrentCodeLine(step.codeLine);
    }
  }, [currentStep, sortingSteps]);

  const handlePlay = () => {
    if (sortingSteps.length === 0) {
      const steps = bubbleSort(currentArray);
      setSortingSteps(steps);
      setCurrentStep(0);
    }
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
    setSortingSteps([]);
    setComparisons(0);
    setSwaps(0);
    setIsCompleted(false);
    setActiveIndices([]);
    setCurrentCodeLine(0);
    try {
      const parsedArray = inputArray
        .split(",")
        .map((num) => parseInt(num.trim()))
        .filter((num) => !isNaN(num));
      if (parsedArray.length > 0) {
        setCurrentArray(parsedArray);
      }
    } catch (error) {
      console.error("Invalid array input");
    }
  };

  const handleStepForward = () => {
    if (sortingSteps.length === 0) {
      const steps = bubbleSort(currentArray);
      setSortingSteps(steps);
    }
    if (currentStep < sortingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 100) + 1
    );
    setInputArray(newArray.join(", "));
  };

  const getBarColor = (index) => {
    if (isCompleted) return "bg-green-500";
    if (activeIndices.includes(index)) return "bg-red-500";
    if (
      sortingSteps.length > 0 &&
      sortingSteps[currentStep]?.sorted?.includes(index)
    ) {
      return "bg-green-500";
    }
    return "bg-blue-500";
  };

  const maxValue = Math.max(...currentArray);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md mx-4 border border-purple-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-purple-300">
                {tutorialSteps[tutorialStep].title}
              </h3>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {tutorialSteps[tutorialStep].content}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === tutorialStep ? "bg-purple-500" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <div className="space-x-3">
                {tutorialStep > 0 && (
                  <button
                    onClick={() => setTutorialStep(tutorialStep - 1)}
                    className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Previous
                  </button>
                )}
                {tutorialStep < tutorialSteps.length - 1 ? (
                  <button
                    onClick={() => setTutorialStep(tutorialStep + 1)}
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition-colors"
                  >
                    Start Learning!
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-800 border-b border-purple-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-600 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{selectedAlgorithm.name}</h1>
              <p className="text-gray-400 text-sm">
                Difficulty: {selectedAlgorithm.difficulty} | Time:{" "}
                {selectedAlgorithm.time}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              {isAudioEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setShowTutorial(true)}
              className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Left Sidebar - Controls */}
        <div className="w-80 bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Input Array */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Input Array
              </label>
              <textarea
                value={inputArray}
                onChange={(e) => setInputArray(e.target.value)}
                className="w-full p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                rows="3"
                placeholder="Enter numbers separated by commas"
              />
            </div>

            {/* Array Size for Random Generation */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Array Size: {arraySize}
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
              <button
                onClick={generateRandomArray}
                className="w-full mt-2 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
              >
                Generate Random Array
              </button>
            </div>

            {/* Animation Speed */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Animation Speed: {animationSpeed}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-2">
                <button
                  onClick={handlePlay}
                  disabled={isPlaying && !isPaused}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5" />
                  <span>Play</span>
                </button>
                <button
                  onClick={handlePause}
                  disabled={!isPlaying}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-yellow-600 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleStepForward}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                  <span>Step</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-slate-700 rounded-lg p-4 space-y-2">
              <h3 className="font-medium mb-3">Statistics</h3>
              <div className="flex justify-between">
                <span className="text-gray-400">Comparisons:</span>
                <span className="text-yellow-400 font-mono">{comparisons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Swaps:</span>
                <span className="text-green-400 font-mono">{swaps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Array Size:</span>
                <span className="text-blue-400 font-mono">
                  {currentArray.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Progress:</span>
                <span className="text-purple-400 font-mono">
                  {sortingSteps.length > 0
                    ? Math.round(
                        (currentStep / (sortingSteps.length - 1)) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium mb-3">Algorithm Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Complexity:</span>
                  <span className="text-red-400 font-mono">
                    {selectedAlgorithm.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Space Complexity:</span>
                  <span className="text-blue-400 font-mono">
                    {selectedAlgorithm.space}
                  </span>
                </div>
                <p className="text-gray-300 text-xs mt-3 leading-relaxed">
                  {selectedAlgorithm.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Visualization Area */}
          <div className="flex-1 p-8 flex items-end justify-center">
            <div className="flex items-end space-x-2 max-w-4xl">
              {currentArray.map((value, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 transition-all duration-300"
                >
                  <div
                    className={`w-8 rounded-t-lg transition-all duration-300 ${getBarColor(
                      index
                    )} ${
                      activeIndices.includes(index)
                        ? "ring-4 ring-yellow-400 ring-opacity-50"
                        : ""
                    }`}
                    style={{
                      height: `${(value / maxValue) * 300}px`,
                      minHeight: "20px",
                    }}
                  />
                  <span className="text-xs font-mono text-gray-300">
                    {value}
                  </span>
                  <span className="text-xs text-gray-500">{index}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-slate-800 border-t border-purple-500 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isCompleted && (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Sorting Complete!</span>
                </div>
              )}
              {isPlaying && !isPaused && (
                <div className="flex items-center space-x-2 text-blue-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span>Running...</span>
                </div>
              )}
              {isPaused && (
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Pause className="w-4 h-4" />
                  <span>Paused</span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-400">
              Step {currentStep + 1} of {sortingSteps.length || 1}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Code */}
        <div className="w-80 bg-slate-800 border-l border-purple-500 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span>Source Code</span>
            </h3>
            <button
              onClick={() => navigator.clipboard.writeText(bubbleSortCode)}
              className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <pre className="bg-slate-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
            {bubbleSortCode.split("\n").map((line, index) => (
              <div
                key={index}
                className={`${
                  currentCodeLine === index
                    ? "bg-purple-500 bg-opacity-20 border-l-4 border-purple-500 pl-2"
                    : ""
                } transition-all duration-300`}
              >
                <span className="text-gray-500 mr-4">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span
                  className={
                    line.includes("function")
                      ? "text-blue-400"
                      : line.includes("for") || line.includes("if")
                      ? "text-purple-400"
                      : line.includes("arr")
                      ? "text-green-400"
                      : "text-gray-300"
                  }
                >
                  {line}
                </span>
              </div>
            ))}
          </pre>
          <div className="mt-6 bg-slate-700 rounded-lg p-4">
            <h4 className="font-medium mb-3">How it works:</h4>
            <ol className="text-sm space-y-2 text-gray-300">
              <li className="flex">
                <span className="text-purple-400 mr-2">1.</span>
                Compare adjacent elements in the array
              </li>
              <li className="flex">
                <span className="text-purple-400 mr-2">2.</span>
                Swap them if they are in wrong order
              </li>
              <li className="flex">
                <span className="text-purple-400 mr-2">3.</span>
                Repeat until no more swaps needed
              </li>
              <li className="flex">
                <span className="text-purple-400 mr-2">4.</span>
                Largest elements "bubble" to the end
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizerPage;
