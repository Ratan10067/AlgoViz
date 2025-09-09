import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";

import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  TrendingUp, Plus, Minus
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";
import { fibonacci as fibonacciCode } from "../../../algorithms/codeExamples.js";

export default function Fibonacci() {
  const navigate = useNavigate();
  
  // Fibonacci state
  const [n, setN] = useState(10);
  const [fibMethod, setFibMethod] = useState('iterative'); // iterative, recursive, dp
  
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
            navigate("/visualizer");
          },
          variant: "destructive"
        }
      ]
    });
  };

  // Fibonacci Algorithms Implementation
  const computeFibonacciSteps = (n, method) => {
    const steps = [];
    let operations = 0;

    if (method === 'iterative') {
      steps.push({
        method: 'iterative',
        n,
        sequence: [],
        currentI: -1,
        a: 0,
        b: 1,
        operations,
        codeLine: 1,
        description: `Computing Fibonacci(${n}) using iterative approach`
      });

      if (n === 0) {
        steps.push({
          method: 'iterative',
          n,
          sequence: [0],
          currentI: 0,
          a: 0,
          b: 1,
          operations: operations + 1,
          codeLine: 2,
          description: `Base case: F(0) = 0`
        });
        return steps;
      }

      if (n === 1) {
        steps.push({
          method: 'iterative',
          n,
          sequence: [0, 1],
          currentI: 1,
          a: 0,
          b: 1,
          operations: operations + 1,
          codeLine: 3,
          description: `Base case: F(1) = 1`
        });
        return steps;
      }

      let a = 0, b = 1;
      const sequence = [0, 1];
      
      for (let i = 2; i <= n; i++) {
        operations++;
        const temp = a + b;
        
        steps.push({
          method: 'iterative',
          n,
          sequence: [...sequence],
          currentI: i,
          a,
          b,
          temp,
          operations,
          codeLine: 5,
          description: `Step ${i}: F(${i}) = F(${i-1}) + F(${i-2}) = ${b} + ${a} = ${temp}`
        });

        sequence.push(temp);
        a = b;
        b = temp;

        steps.push({
          method: 'iterative',
          n,
          sequence: [...sequence],
          currentI: i,
          a,
          b,
          operations,
          codeLine: 6,
          description: `Updated: a = ${a}, b = ${b}, sequence = [${sequence.join(', ')}]`
        });
      }

    } else if (method === 'recursive') {
      const callStack = [];
      const memo = {};

      const fibRecursive = (num, depth = 0) => {
        operations++;
        
        callStack.push({ n: num, depth, status: 'calling' });
        steps.push({
          method: 'recursive',
          n,
          currentCall: num,
          callStack: [...callStack],
          operations,
          codeLine: num <= 1 ? 2 : 4,
          description: `Calling fib(${num}) ${depth === 0 ? '(initial call)' : `at depth ${depth}`}`
        });

        if (num <= 1) {
          callStack[callStack.length - 1].result = num;
          callStack[callStack.length - 1].status = 'returning';
          
          steps.push({
            method: 'recursive',
            n,
            currentCall: num,
            callStack: [...callStack],
            result: num,
            operations,
            codeLine: 2,
            description: `Base case: fib(${num}) = ${num}`
          });
          
          callStack.pop();
          return num;
        }

        const left = fibRecursive(num - 1, depth + 1);
        const right = fibRecursive(num - 2, depth + 1);
        const result = left + right;

        callStack[callStack.length - 1].result = result;
        callStack[callStack.length - 1].status = 'returning';
        
        steps.push({
          method: 'recursive',
          n,
          currentCall: num,
          callStack: [...callStack],
          result,
          left,
          right,
          operations,
          codeLine: 4,
          description: `fib(${num}) = fib(${num-1}) + fib(${num-2}) = ${left} + ${right} = ${result}`
        });

        callStack.pop();
        return result;
      };

      fibRecursive(n);

    } else if (method === 'dp') {
      const dp = new Array(n + 1).fill(0);
      
      steps.push({
        method: 'dp',
        n,
        dp: [...dp],
        currentI: -1,
        operations,
        codeLine: 1,
        description: `Computing Fibonacci(${n}) using Dynamic Programming. Initialize DP array.`
      });

      if (n >= 0) {
        dp[0] = 0;
        operations++;
        steps.push({
          method: 'dp',
          n,
          dp: [...dp],
          currentI: 0,
          operations,
          codeLine: 2,
          description: `Base case: dp[0] = 0`
        });
      }

      if (n >= 1) {
        dp[1] = 1;
        operations++;
        steps.push({
          method: 'dp',
          n,
          dp: [...dp],
          currentI: 1,
          operations,
          codeLine: 3,
          description: `Base case: dp[1] = 1`
        });
      }

      for (let i = 2; i <= n; i++) {
        operations++;
        dp[i] = dp[i-1] + dp[i-2];
        
        steps.push({
          method: 'dp',
          n,
          dp: [...dp],
          currentI: i,
          operations,
          codeLine: 5,
          description: `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`
        });
      }
    }

    // Final step
    steps.push({
      method,
      n,
      operations,
      codeLine: method === 'iterative' ? 7 : method === 'recursive' ? 5 : 6,
      description: `Fibonacci(${n}) computed successfully using ${method} method! Result: ${steps[steps.length - 1]?.result || steps[steps.length - 1]?.sequence?.[n] || steps[steps.length - 1]?.dp?.[n]}`
    });

    return steps;
  };

  // Start computation
  const handleStartComputation = () => {
    if (n < 0 || n > 20) {
      return;
    }

    const fibSteps = computeFibonacciSteps(n, fibMethod);
    setSteps(fibSteps);
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
                  <TrendingUp className="text-yellow-400" size={28} />
                  Fibonacci Sequence Visualizer
                </h1>
                <p className="text-gray-400 text-sm">
                  Explore iterative, recursive, and dynamic programming approaches • Various time complexities
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
                {/* Configuration */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings size={18} />
                    Configuration
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        N Value: {n}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={n}
                        onChange={(e) => setN(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Calculate the {n}th Fibonacci number
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Algorithm Method
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: 'iterative', name: 'Iterative', desc: 'O(n) time' },
                          { id: 'recursive', name: 'Recursive', desc: 'O(2^n) time' },
                          { id: 'dp', name: 'Dynamic Programming', desc: 'O(n) time' }
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setFibMethod(method.id)}
                            className={`p-3 rounded-lg text-left transition-colors ${
                              fibMethod === method.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            <div className="font-medium">{method.name}</div>
                            <div className="text-xs opacity-75">{method.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleStartComputation}
                      disabled={n < 0 || n > 20}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                      <Play size={18} />
                      Start Computation
                    </button>
                  </div>
                </div>

                {/* Controls */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Play size={18} />
                    Animation Controls
                  </h3>
                  
                  <div className="space-y-4">
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
                {/* Method indicator */}
                {currentStepData && (
                  <div className="mb-4">
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        currentStepData.method === 'iterative' ? 'bg-blue-600/20 text-blue-400' :
                        currentStepData.method === 'recursive' ? 'bg-red-600/20 text-red-400' :
                        'bg-green-600/20 text-green-400'
                      }`}>
                        {currentStepData.method.charAt(0).toUpperCase() + currentStepData.method.slice(1)} Method
                      </div>
                      <div className="text-sm text-gray-400">
                        Computing F({n})
                      </div>
                    </div>
                  </div>
                )}

                {/* Visualization Area */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-4xl">
                    {/* Iterative Method Visualization */}
                    {fibMethod === 'iterative' && currentStepData?.sequence && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-white mb-4">Fibonacci Sequence</h3>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {currentStepData.sequence.map((num, index) => (
                              <div
                                key={index}
                                className={`
                                  w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm border-2 transition-all duration-500
                                  ${index === currentStepData.currentI
                                    ? "bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-400 shadow-lg shadow-yellow-500/25 transform scale-110"
                                    : index < currentStepData.currentI
                                    ? "bg-gradient-to-br from-green-500 to-green-600 border-green-400"
                                    : "bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500"
                                  }
                                `}
                              >
                                {num}
                              </div>
                            ))}
                          </div>
                          {currentStepData.temp !== undefined && (
                            <div className="mt-4 text-center">
                              <div className="text-gray-300 text-sm">Computing:</div>
                              <div className="text-white text-lg font-mono">
                                {currentStepData.b} + {currentStepData.a} = {currentStepData.temp}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Recursive Method Visualization */}
                    {fibMethod === 'recursive' && currentStepData?.callStack && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-white mb-4">Recursive Call Stack</h3>
                          <div className="space-y-2">
                            {currentStepData.callStack.map((call, index) => (
                              <div
                                key={index}
                                className={`
                                  p-3 rounded-lg border transition-all duration-300
                                  ${call.status === 'calling'
                                    ? "bg-blue-600/20 border-blue-400 text-blue-300"
                                    : "bg-green-600/20 border-green-400 text-green-300"
                                  }
                                `}
                                style={{ marginLeft: `${call.depth * 20}px` }}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-mono">fib({call.n})</span>
                                  {call.result !== undefined && (
                                    <span className="font-bold">→ {call.result}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dynamic Programming Visualization */}
                    {fibMethod === 'dp' && currentStepData?.dp && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-white mb-4">DP Array</h3>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {currentStepData.dp.map((num, index) => (
                              <div key={index} className="text-center">
                                <div className="text-xs text-gray-400 mb-1">dp[{index}]</div>
                                <div
                                  className={`
                                    w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm border-2 transition-all duration-500
                                    ${index === currentStepData.currentI
                                      ? "bg-gradient-to-br from-purple-500 to-purple-600 border-purple-400 shadow-lg shadow-purple-500/25 transform scale-110"
                                      : index < currentStepData.currentI || (currentStepData.currentI === -1 && index <= 1)
                                      ? "bg-gradient-to-br from-green-500 to-green-600 border-green-400"
                                      : num === 0
                                      ? "bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500"
                                      : "bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600"
                                    }
                                  `}
                                >
                                  {num}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step Description */}
                {currentStepData?.description && (
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-600/20 rounded-lg">
                        <TrendingUp size={18} className="text-yellow-400" />
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
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300"
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
                      icon={Target}
                      value={n}
                      label="N Value"
                      color="blue"
                    />
                    <StatCard
                      icon={Activity}
                      value={currentStepData?.operations || 0}
                      label="Operations"
                      color="green"
                    />
                    <StatCard
                      icon={Clock}
                      value={steps.length > 0 ? `${currentStep + 1}/${steps.length}` : "0/0"}
                      label="Steps"
                      color="purple"
                    />
                    <StatCard
                      icon={TrendingUp}
                      value={fibMethod.charAt(0).toUpperCase() + fibMethod.slice(1)}
                      label="Method"
                      color="orange"
                    />

                    {/* Algorithm Info */}
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">Algorithm Info</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time Complexity:</span>
                          <span className="text-white font-mono">
                            {fibMethod === 'iterative' ? 'O(n)' : 
                             fibMethod === 'recursive' ? 'O(2^n)' : 'O(n)'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Space Complexity:</span>
                          <span className="text-white font-mono">
                            {fibMethod === 'iterative' ? 'O(1)' : 
                             fibMethod === 'recursive' ? 'O(n)' : 'O(n)'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white">Dynamic Programming</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Efficiency:</span>
                          <span className="text-white">
                            {fibMethod === 'recursive' ? 'Poor' : 'Good'}
                          </span>
                        </div>
                      </div>

                      {/* Method comparison */}
                      <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                        <h4 className="text-sm font-semibold text-white mb-2">Method Comparison:</h4>
                        <div className="space-y-1 text-xs text-gray-300">
                          <div><strong>Iterative:</strong> Fast, O(n), bottom-up</div>
                          <div><strong>Recursive:</strong> Slow, O(2^n), top-down</div>
                          <div><strong>DP:</strong> Fast, O(n), memoization</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Code Tab */}
                {activeRightTab === "code" && (
                  <BasicCodeDisplay
                    code={fibonacciCode}
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
