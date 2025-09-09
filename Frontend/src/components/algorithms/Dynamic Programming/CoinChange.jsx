import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  GitBranch, Coins, DollarSign, Plus, Minus, Calculator
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const CoinChange = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Input state
  const [coins, setCoins] = useState([1, 3, 4]);
  const [amount, setAmount] = useState(6);
  const [newCoin, setNewCoin] = useState("");
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(800);
  
  // Algorithm state
  const [dpArray, setDpArray] = useState([]);
  const [minCoins, setMinCoins] = useState(0);
  const [coinCombination, setCoinCombination] = useState([]);
  
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
    setDpArray([]);
    setMinCoins(0);
    setCoinCombination([]);
    setCurrentHighlightedLine(null);
  };

  const addCoin = () => {
    const coin = parseInt(newCoin);
    if (!isNaN(coin) && coin > 0 && !coins.includes(coin)) {
      setCoins([...coins, coin].sort((a, b) => a - b));
      setNewCoin("");
      resetVisualization();
    }
  };

  const removeCoin = (coinToRemove) => {
    setCoins(coins.filter(c => c !== coinToRemove));
    resetVisualization();
  };

  const generateCoinChangeSteps = () => {
    const dp = Array(amount + 1).fill(Infinity);
    const parent = Array(amount + 1).fill(-1);
    dp[0] = 0;
    const steps = [];

    steps.push({
      type: 'initialization',
      description: `Initializing DP array for amount ${amount} with coins [${coins.join(', ')}]`,
      dp: [...dp],
      currentAmount: -1,
      currentCoin: -1,
      action: 'initialize',
      minCoins: 0,
      explanation: 'dp[0] = 0 (0 coins needed for amount 0), all others = ∞'
    });

    // Fill the DP array
    for (let i = 1; i <= amount; i++) {
      for (let j = 0; j < coins.length; j++) {
        const coin = coins[j];
        
        if (coin <= i) {
          const prevValue = dp[i];
          const newValue = dp[i - coin] + 1;
          
          steps.push({
            type: 'checking',
            description: `Checking coin ${coin} for amount ${i}: dp[${i}] = min(${prevValue === Infinity ? '∞' : prevValue}, dp[${i - coin}] + 1) = min(${prevValue === Infinity ? '∞' : prevValue}, ${dp[i - coin] === Infinity ? '∞' : dp[i - coin]} + 1)`,
            dp: [...dp],
            currentAmount: i,
            currentCoin: coin,
            action: 'checking',
            prevValue: prevValue,
            newValue: newValue,
            explanation: `Can we improve dp[${i}] using coin ${coin}?`
          });

          if (dp[i - coin] !== Infinity && dp[i - coin] + 1 < dp[i]) {
            dp[i] = dp[i - coin] + 1;
            parent[i] = coin;
            
            steps.push({
              type: 'update',
              description: `Updated! dp[${i}] = ${dp[i]} (using coin ${coin})`,
              dp: [...dp],
              currentAmount: i,
              currentCoin: coin,
              action: 'update',
              minCoins: dp[i],
              explanation: `Found better solution for amount ${i}`
            });
          } else {
            steps.push({
              type: 'no_update',
              description: `No improvement for amount ${i} with coin ${coin}`,
              dp: [...dp],
              currentAmount: i,
              currentCoin: coin,
              action: 'no_update',
              explanation: `Current solution is better or coin can't be used`
            });
          }
        } else {
          steps.push({
            type: 'skip',
            description: `Skipping coin ${coin} for amount ${i} (coin > amount)`,
            dp: [...dp],
            currentAmount: i,
            currentCoin: coin,
            action: 'skip',
            explanation: `Coin ${coin} is larger than amount ${i}`
          });
        }
      }
    }

    // Reconstruct the solution
    const result = [];
    let curr = amount;
    while (curr > 0 && parent[curr] !== -1) {
      result.push(parent[curr]);
      curr -= parent[curr];
    }

    steps.push({
      type: 'complete',
      description: dp[amount] === Infinity 
        ? `No solution possible for amount ${amount}`
        : `Minimum coins needed: ${dp[amount]}. Combination: [${result.join(', ')}]`,
      dp: [...dp],
      currentAmount: amount,
      currentCoin: -1,
      action: 'complete',
      minCoins: dp[amount] === Infinity ? -1 : dp[amount],
      coinCombination: result,
      explanation: 'Algorithm complete!'
    });

    return steps;
  };

  const startCoinChange = () => {
    if (coins.length === 0 || amount <= 0) return;
    
    const coinChangeSteps = generateCoinChangeSteps();
    setSteps(coinChangeSteps);
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
    setCoins([1, 3, 4]);
    setAmount(6);
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

  const currentStepData = steps[currentStep] || {
    description: "Set coins and amount, then click 'Find Minimum Coins'",
    dp: [],
    currentAmount: -1,
    currentCoin: -1,
    minCoins: 0,
    coinCombination: [],
    action: 'ready',
    explanation: ''
  };

  // Canvas drawing effect
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (!currentStepData.dp.length) return;

    const cellWidth = 60;
    const cellHeight = 40;
    const startX = 50;
    const startY = 150;

    // Draw DP array
    for (let i = 0; i <= amount; i++) {
      const x = startX + i * cellWidth;
      const y = startY;
      
      // Cell background
      let fillColor = '#334155';
      if (i === currentStepData.currentAmount) {
        fillColor = '#8b5cf6'; // Current amount
      } else if (i === 0) {
        fillColor = '#22c55e'; // Base case
      }
      
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, cellWidth, cellHeight);
      
      // Cell border
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cellWidth, cellHeight);
      
      // Amount label (top)
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(), x + cellWidth/2, y - 10);
      
      // DP value
      const value = currentStepData.dp[i];
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        value === Infinity ? '∞' : value.toString(), 
        x + cellWidth/2, 
        y + cellHeight/2
      );
    }

    // Draw coins
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Available Coins:', startX, 100);
    
    coins.forEach((coin, index) => {
      const coinX = startX + 150 + index * 80;
      const coinY = 80;
      
      // Highlight current coin
      if (coin === currentStepData.currentCoin) {
        ctx.fillStyle = '#8b5cf6';
      } else {
        ctx.fillStyle = '#059669';
      }
      
      ctx.beginPath();
      ctx.arc(coinX, coinY, 25, 0, 2 * Math.PI);
      ctx.fill();
      
      // Coin value
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(coin.toString(), coinX, coinY);
    });

    // Draw current operation info
    if (currentStepData.action !== 'ready') {
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(currentStepData.explanation, startX, startY + 80);
    }

    // Draw solution if available
    if (currentStepData.coinCombination && currentStepData.coinCombination.length > 0) {
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'left';
      const solutionY = startY + 120;
      ctx.fillText(`Solution: [${currentStepData.coinCombination.join(', ')}]`, startX, solutionY);
      
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Total: ${currentStepData.coinCombination.length} coins`, startX, solutionY + 25);
    }

    // Draw calculation details
    if (currentStepData.action === 'checking' && currentStepData.prevValue !== undefined) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '16px monospace';
      ctx.textAlign = 'left';
      const calcY = startY + 200;
      
      const prev = currentStepData.prevValue === Infinity ? '∞' : currentStepData.prevValue;
      const newVal = currentStepData.newValue === Infinity ? '∞' : currentStepData.newValue;
      
      ctx.fillText(`Calculation: min(${prev}, ${newVal})`, startX, calcY);
    }

    // Draw legend
    const legendY = startY + 280;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Legend:', startX, legendY);
    
    // Legend items
    const legendItems = [
      { color: '#8b5cf6', text: 'Current Amount' },
      { color: '#22c55e', text: 'Base Case (0)' },
      { color: '#334155', text: 'Normal Cell' },
      { color: '#8b5cf6', text: 'Current Coin' }
    ];
    
    legendItems.forEach((item, index) => {
      const legendItemY = legendY + 20 + index * 20;
      ctx.fillStyle = item.color;
      ctx.fillRect(startX, legendItemY - 8, 15, 12);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(item.text, startX + 25, legendItemY);
    });

  }, [currentStepData, coins, amount]);

  const coinChangeCode = `function coinChange(coins, amount) {
  // Initialize DP array
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Base case: 0 coins for amount 0
  
  // Fill DP array
  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (coin <= i) {
        // Check if using this coin gives better result
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  // Return result
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// To get the actual coin combination:
function coinChangeWithPath(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  const parent = new Array(amount + 1).fill(-1);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        parent[i] = coin; // Track which coin was used
      }
    }
  }
  
  // Reconstruct path
  const result = [];
  let curr = amount;
  while (curr > 0 && parent[curr] !== -1) {
    result.push(parent[curr]);
    curr -= parent[curr];
  }
  
  return dp[amount] === Infinity ? [] : result;
}`;

  const exampleCases = [
    { coins: [1, 3, 4], amount: 6 },
    { coins: [2, 3, 5], amount: 9 },
    { coins: [1, 5, 10, 25], amount: 30 },
    { coins: [2, 5, 10], amount: 18 },
    { coins: [1, 4, 6, 8], amount: 11 }
  ];

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
          <div className="bg-yellow-600 p-2 rounded-lg">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Coin Change</h1>
            <p className="text-gray-400 text-sm">
              Time: O(amount × coins) | Space: O(amount) | Dynamic Programming
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Target Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(parseInt(e.target.value) || 0);
                    resetVisualization();
                  }}
                  className="w-full p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none font-mono"
                  placeholder="Enter amount..."
                  min="0"
                  disabled={playing}
                />
              </div>

              {/* Coins Management */}
              <div>
                <label className="block text-sm font-medium mb-2">Coin Denominations</label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="number"
                    value={newCoin}
                    onChange={(e) => setNewCoin(e.target.value)}
                    className="flex-1 p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none font-mono"
                    placeholder="Add coin..."
                    min="1"
                    disabled={playing}
                    onKeyDown={(e) => e.key === 'Enter' && addCoin()}
                  />
                  <button
                    onClick={addCoin}
                    disabled={!newCoin || playing}
                    className="px-4 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {coins.map(coin => (
                    <div
                      key={coin}
                      className="flex items-center space-x-2 bg-slate-700 rounded-lg px-3 py-2"
                    >
                      <span className="font-mono">{coin}</span>
                      <button
                        onClick={() => removeCoin(coin)}
                        disabled={playing}
                        className="text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Cases */}
              <div>
                <label className="block text-sm font-medium mb-2">Example Cases</label>
                <div className="space-y-2">
                  {exampleCases.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCoins([...example.coins]);
                        setAmount(example.amount);
                        resetVisualization();
                      }}
                      disabled={playing}
                      className="w-full text-left p-2 bg-slate-700 rounded text-xs hover:bg-slate-600 disabled:opacity-50 transition-colors font-mono"
                    >
                      Coins: [{example.coins.join(', ')}], Amount: {example.amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={startCoinChange}
                  disabled={playing || coins.length === 0 || amount <= 0}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Find Minimum Coins</span>
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

              {/* Results */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Results</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Coins:</span>
                    <span className="text-green-400 font-mono">
                      {currentStepData.minCoins === -1 ? 'Impossible' : (currentStepData.minCoins || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Combination:</span>
                    <span className="text-blue-400 font-mono">
                      [{currentStepData.coinCombination?.join(', ') || ''}]
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target Amount:</span>
                    <span className="text-gray-300 font-mono">{amount}</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Current Amount/Coin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Base Case (amount 0)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-600 rounded border border-gray-500"></div>
                    <span>Normal Cell</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs">∞</span>
                    <span>Impossible amount</span>
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
                <h2 className="text-xl font-semibold mb-2">Coin Change Dynamic Programming</h2>
                <p className="text-gray-400">{currentStepData.description}</p>
              </div>

              {/* Canvas Visualization */}
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-700 rounded-lg bg-slate-800/50"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
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
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
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
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Info
              </button>
            </div>

            <div className="p-6 h-full overflow-y-auto">
              {activeRightTab === "code" ? (
                <BasicCodeDisplay
                  code={coinChangeCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Coin Change Problem</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Find the minimum number of coins needed to make a given amount. 
                      This is a classic optimization problem solved using dynamic programming.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Algorithm Steps:</h4>
                    <ol className="text-sm space-y-1 text-gray-300 list-decimal list-inside">
                      <li>Initialize DP array with ∞, dp[0] = 0</li>
                      <li>For each amount from 1 to target</li>
                      <li>Try each coin denomination</li>
                      <li>If coin ≤ amount, update: dp[i] = min(dp[i], dp[i-coin] + 1)</li>
                      <li>Result is dp[amount], or -1 if impossible</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Complexity Analysis:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-yellow-400 font-mono">O(amount × coins)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space:</span>
                        <span className="text-red-400 font-mono">O(amount)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">With Path:</span>
                        <span className="text-blue-400 font-mono">O(amount)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      amount = target amount, coins = number of coin types
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Properties:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Optimal substructure: optimal solution contains optimal subsolutions</li>
                      <li>• Overlapping subproblems: same amounts computed multiple times</li>
                      <li>• Greedy doesn't always work (e.g., coins [1,3,4], amount 6)</li>
                      <li>• Bottom-up approach builds solutions incrementally</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Applications:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Currency exchange optimization</li>
                      <li>• Resource allocation problems</li>
                      <li>• Making change at stores</li>
                      <li>• Inventory management</li>
                      <li>• Payment processing systems</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Variations:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Coin Change II (count ways to make amount)</li>
                      <li>• Unbounded knapsack variant</li>
                      <li>• With limited coin quantities</li>
                      <li>• Maximum coins for given amount</li>
                    </ul>
                  </div>

                  {started && (
                    <div>
                      <h4 className="font-medium mb-2">Current Execution:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Action:</span>
                          <span className="text-white font-mono capitalize">{currentStepData.action?.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount:</span>
                          <span className="text-purple-400 font-mono">{currentStepData.currentAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Coin:</span>
                          <span className="text-yellow-400 font-mono">{currentStepData.currentCoin}</span>
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

export default CoinChange;
