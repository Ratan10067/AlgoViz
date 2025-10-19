import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Coins, DollarSign, TrendingDown, Calculator, Plus, Minus, XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const CoinChangeGreedy = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Coins and target state
  const [denominations, setDenominations] = useState([25, 10, 5, 1]);
  const [targetAmount, setTargetAmount] = useState(67);
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(700);
  
  // Algorithm state
  const [usedCoins, setUsedCoins] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [currentDenomination, setCurrentDenomination] = useState(null);
  const [totalCoins, setTotalCoins] = useState(0);
  const [isOptimal, setIsOptimal] = useState(true);
  
  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [newDenomination, setNewDenomination] = useState("");
  
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
    setUsedCoins([]);
    setRemainingAmount(targetAmount);
    setCurrentDenomination(null);
    setTotalCoins(0);
    setIsOptimal(true);
    setCurrentHighlightedLine(null);
  };

  const addDenomination = () => {
    const value = parseInt(newDenomination);
    if (!value || value <= 0) {
      setAlertConfig({
        isOpen: true,
        message: "Please enter a valid positive denomination.",
        type: "error"
      });
      return;
    }

    if (denominations.includes(value)) {
      setAlertConfig({
        isOpen: true,
        message: "This denomination already exists.",
        type: "error"
      });
      return;
    }

    const newDenoms = [...denominations, value].sort((a, b) => b - a);
    setDenominations(newDenoms);
    setNewDenomination("");
    resetVisualization();
  };

  const removeDenomination = (value) => {
    if (denominations.length <= 1) {
      setAlertConfig({
        isOpen: true,
        message: "At least one denomination is required.",
        type: "error"
      });
      return;
    }
    
    setDenominations(denominations.filter(d => d !== value));
    resetVisualization();
  };

  // Check if greedy gives optimal solution
  const checkOptimality = (denoms, amount) => {
    // For standard coin systems (like US coins), greedy is optimal
    // For others, we'd need to compare with DP solution
    const standardSets = [
      [25, 10, 5, 1],
      [100, 50, 25, 10, 5, 1],
      [20, 10, 5, 1],
      [50, 25, 10, 5, 1]
    ];
    
    const sortedDenoms = [...denoms].sort((a, b) => b - a);
    const isStandard = standardSets.some(set => 
      set.length === sortedDenoms.length && 
      set.every((val, i) => val === sortedDenoms[i])
    );
    
    return isStandard;
  };

  const generateCoinChangeSteps = () => {
    if (denominations.length === 0 || targetAmount <= 0) return [];

    const steps = [];
    const sortedDenoms = [...denominations].sort((a, b) => b - a);
    const optimal = checkOptimality(denominations, targetAmount);
    
    // Step 1: Initialize
    steps.push({
      type: 'initialize',
      description: `Making change for amount ${targetAmount}`,
      denominations: [...sortedDenoms],
      usedCoins: [],
      remaining: targetAmount,
      current: null,
      totalCoins: 0,
      isOptimal: optimal,
      action: 'initialize',
      explanation: `Greedy Coin Change: ${optimal ? 'This denomination set gives optimal results' : 'Warning: This set may not always give optimal results'}`,
      highlightedLine: 1
    });

    // Step 2: Show sorted denominations
    steps.push({
      type: 'sort',
      description: 'Using denominations in descending order',
      denominations: [...sortedDenoms],
      usedCoins: [],
      remaining: targetAmount,
      current: null,
      totalCoins: 0,
      isOptimal: optimal,
      action: 'sort_denominations',
      explanation: 'Process denominations from largest to smallest (greedy choice)',
      highlightedLine: 4
    });

    // Step 3: Process each denomination
    const usedCoins = [];
    let remaining = targetAmount;
    let totalCoins = 0;

    for (const denom of sortedDenoms) {
      if (remaining === 0) break;
      
      // Consider current denomination
      steps.push({
        type: 'consider',
        description: `Considering denomination ${denom}`,
        denominations: [...sortedDenoms],
        usedCoins: [...usedCoins],
        remaining,
        current: denom,
        totalCoins,
        isOptimal: optimal,
        action: 'consider_denomination',
        explanation: `Check how many coins of value ${denom} we can use`,
        highlightedLine: 7
      });

      const coinsNeeded = Math.floor(remaining / denom);
      
      if (coinsNeeded > 0) {
        // Use coins of this denomination
        for (let i = 0; i < coinsNeeded; i++) {
          usedCoins.push(denom);
        }
        remaining -= coinsNeeded * denom;
        totalCoins += coinsNeeded;
        
        steps.push({
          type: 'use_coins',
          description: `Used ${coinsNeeded} coin(s) of value ${denom}`,
          denominations: [...sortedDenoms],
          usedCoins: [...usedCoins],
          remaining,
          current: denom,
          totalCoins,
          isOptimal: optimal,
          action: 'use_coins',
          explanation: `Take ${coinsNeeded} coins of ${denom}. Remaining amount: ${remaining}`,
          highlightedLine: 9,
          coinsUsed: coinsNeeded
        });
      } else {
        // Skip this denomination
        steps.push({
          type: 'skip',
          description: `Skipped denomination ${denom} (too large)`,
          denominations: [...sortedDenoms],
          usedCoins: [...usedCoins],
          remaining,
          current: denom,
          totalCoins,
          isOptimal: optimal,
          action: 'skip_denomination',
          explanation: `Denomination ${denom} is larger than remaining amount ${remaining}`,
          highlightedLine: 8
        });
      }
    }

    // Final result
    if (remaining === 0) {
      steps.push({
        type: 'complete',
        description: `Change made successfully! Used ${totalCoins} coins total`,
        denominations: [...sortedDenoms],
        usedCoins: [...usedCoins],
        remaining,
        current: null,
        totalCoins,
        isOptimal: optimal,
        action: 'complete',
        explanation: `Solution found: ${totalCoins} coins needed to make change for ${targetAmount}`,
        highlightedLine: 13
      });
    } else {
      steps.push({
        type: 'impossible',
        description: `Cannot make exact change! Remaining: ${remaining}`,
        denominations: [...sortedDenoms],
        usedCoins: [...usedCoins],
        remaining,
        current: null,
        totalCoins,
        isOptimal: optimal,
        action: 'impossible',
        explanation: `No combination of available denominations can make exact change`,
        highlightedLine: 11
      });
    }

    return steps;
  };

  const startCoinChange = () => {
    if (denominations.length === 0) {
      setAlertConfig({
        isOpen: true,
        message: "Please add at least one denomination.",
        type: "error"
      });
      return;
    }

    if (targetAmount <= 0) {
      setAlertConfig({
        isOpen: true,
        message: "Please enter a valid target amount.",
        type: "error"
      });
      return;
    }
    
    const coinSteps = generateCoinChangeSteps();
    setSteps(coinSteps);
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
    setDenominations([25, 10, 5, 1]);
    setTargetAmount(67);
    resetVisualization();
    setEditMode(false);
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
    description: "Set denominations and target amount, then click 'Start Change Making'",
    denominations: denominations.sort((a, b) => b - a),
    usedCoins: [],
    remaining: targetAmount,
    current: null,
    totalCoins: 0,
    isOptimal: checkOptimality(denominations, targetAmount),
    action: 'ready',
    explanation: '',
    highlightedLine: null
  };

  // Update state based on current step
  useEffect(() => {
    if (currentStepData) {
      setUsedCoins(currentStepData.usedCoins || []);
      setRemainingAmount(currentStepData.remaining || targetAmount);
      setCurrentDenomination(currentStepData.current);
      setTotalCoins(currentStepData.totalCoins || 0);
      setIsOptimal(currentStepData.isOptimal !== undefined ? currentStepData.isOptimal : true);
      setCurrentHighlightedLine(currentStepData.highlightedLine);
    }
  }, [currentStepData, targetAmount]);

  // Canvas drawing effect
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 900;
    canvas.height = 700;
    
    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw coin change visualization
    drawCoinChangeVisualization(ctx, currentStepData);

  }, [currentStepData]);

  const drawCoinChangeVisualization = (ctx, stepData) => {
    const denominations = stepData.denominations || [];
    const usedCoins = stepData.usedCoins || [];
    const current = stepData.current;
    
    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Greedy Coin Change Algorithm', canvas.width / 2, 30);
    
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(stepData.action.replace('_', ' ').toUpperCase(), canvas.width / 2, 55);

    // Draw optimality warning
    if (!stepData.isOptimal) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('⚠️ Warning: This denomination set may not always give optimal results', canvas.width / 2, 75);
    }

    // Draw denominations
    const denomY = 120;
    const denomSpacing = 100;
    const startX = 50;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Available Denominations:', startX, denomY - 20);
    
    denominations.forEach((denom, index) => {
      const x = startX + index * denomSpacing;
      const y = denomY;
      const radius = 30;
      
      // Coin circle
      let fillColor = '#64748b';
      let strokeColor = '#94a3b8';
      
      if (current === denom) {
        fillColor = '#fbbf24';
        strokeColor = '#f59e0b';
      } else if (usedCoins.includes(denom)) {
        fillColor = '#22c55e';
        strokeColor = '#16a34a';
      }
      
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Denomination value
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(denom.toString(), x + radius, y + radius + 5);
      
      // Count of coins used
      const coinCount = usedCoins.filter(c => c === denom).length;
      if (coinCount > 0) {
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`×${coinCount}`, x + radius, y + radius * 2 + 20);
      }
    });

    // Draw target amount and remaining
    const amountY = denomY + 120;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Target Amount: ${targetAmount}`, startX, amountY);
    ctx.fillText(`Remaining: ${stepData.remaining}`, startX, amountY + 25);
    ctx.fillText(`Total Coins Used: ${stepData.totalCoins}`, startX, amountY + 50);

    // Draw used coins visualization
    if (usedCoins.length > 0) {
      let coinsY = amountY + 100;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Coins Used:', startX, coinsY - 10);
      
      // Group coins by denomination
      const coinGroups = {};
      usedCoins.forEach(coin => {
        coinGroups[coin] = (coinGroups[coin] || 0) + 1;
      });
      
      let currentX = startX;
      Object.entries(coinGroups).forEach(([denom, count]) => {
        for (let i = 0; i < count; i++) {
          const radius = 15;
          
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(currentX + radius, coinsY + radius, radius, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.strokeStyle = '#16a34a';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(denom.toString(), currentX + radius, coinsY + radius + 3);
          
          currentX += radius * 2 + 5;
          
          // Wrap to next line if needed
          if (currentX > canvas.width - 50) {
            currentX = startX;
            coinsY += 40;
          }
        }
      });
    }

    // Draw algorithm steps table
    const tableY = 450;
    const tableX = 50;
    const cellWidth = 120;
    const cellHeight = 30;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Algorithm Steps:', tableX, tableY - 20);
    
    // Table headers
    const headers = ['Denomination', 'Coins Used', 'Amount Used', 'Remaining'];
    ctx.fillStyle = '#475569';
    headers.forEach((header, i) => {
      ctx.fillRect(tableX + i * cellWidth, tableY, cellWidth, cellHeight);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(tableX + i * cellWidth, tableY, cellWidth, cellHeight);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(header, tableX + i * cellWidth + cellWidth / 2, tableY + 20);
    });

    // Table rows for processed denominations
    let processedAmount = 0;
    denominations.forEach((denom, index) => {
      const coinsUsed = usedCoins.filter(c => c === denom).length;
      const amountUsed = coinsUsed * denom;
      processedAmount += amountUsed;
      const remaining = targetAmount - processedAmount;
      
      if (coinsUsed > 0 || current === denom) {
        const y = tableY + (index + 1) * cellHeight;
        
        // Row background
        let bgColor = '#334155';
        if (current === denom) {
          bgColor = '#fbbf24';
        } else if (coinsUsed > 0) {
          bgColor = '#22c55e';
        }
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(tableX, y, cellWidth * 4, cellHeight);
        
        // Cell borders
        for (let i = 0; i < 4; i++) {
          ctx.strokeStyle = '#64748b';
          ctx.strokeRect(tableX + i * cellWidth, y, cellWidth, cellHeight);
        }
        
        // Cell content
        ctx.fillStyle = current === denom ? '#1e293b' : '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        
        ctx.fillText(denom.toString(), tableX + cellWidth / 2, y + 20);
        ctx.fillText(coinsUsed.toString(), tableX + cellWidth * 1.5, y + 20);
        ctx.fillText(amountUsed.toString(), tableX + cellWidth * 2.5, y + 20);
        ctx.fillText(Math.max(0, remaining).toString(), tableX + cellWidth * 3.5, y + 20);
      }
    });

    // Draw explanation
    if (stepData.explanation) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      const maxWidth = canvas.width - 40;
      const lines = wrapText(ctx, stepData.explanation, maxWidth);
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height - 60 + index * 15);
      });
    }
  };

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const coinChangeGreedyCode = `function coinChangeGreedy(denominations, amount) {
  // Sort denominations in descending order (greedy choice)
  const sortedCoins = denominations.sort((a, b) => b - a);
  
  const result = [];
  let remaining = amount;
  
  // Process each denomination from largest to smallest
  for (const coin of sortedCoins) {
    // Calculate how many coins of this denomination we can use
    const count = Math.floor(remaining / coin);
    
    if (count > 0) {
      // Use 'count' coins of this denomination
      for (let i = 0; i < count; i++) {
        result.push(coin);
      }
      remaining -= count * coin;
    }
    
    // If no remaining amount, we're done
    if (remaining === 0) break;
  }
  
  // Check if we made exact change
  if (remaining === 0) {
    return {
      coins: result,
      totalCoins: result.length,
      possible: true
    };
  } else {
    return {
      coins: [],
      totalCoins: -1,
      possible: false,
      remaining
    };
  }
}

// Enhanced version with step tracking
function coinChangeGreedyDetailed(denominations, amount) {
  console.log(\`Making change for \${amount} using greedy algorithm\`);
  console.log('Available denominations:', denominations);
  
  const sortedCoins = denominations.sort((a, b) => b - a);
  console.log('Sorted denominations (desc):', sortedCoins);
  
  const result = [];
  let remaining = amount;
  let totalCoins = 0;
  
  for (const coin of sortedCoins) {
    const count = Math.floor(remaining / coin);
    
    console.log(\`\\nDenomination \${coin}:\`);
    console.log(\`  Remaining amount: \${remaining}\`);
    console.log(\`  Coins needed: \${count}\`);
    
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        result.push(coin);
      }
      remaining -= count * coin;
      totalCoins += count;
      
      console.log(\`  → Used \${count} coins of \${coin}\`);
      console.log(\`  → Amount after: \${remaining}\`);
    } else {
      console.log(\`  → Skipped (coin too large)\`);
    }
    
    if (remaining === 0) {
      console.log('  → Exact change achieved!');
      break;
    }
  }
  
  console.log(\`\\nResult:\`);
  if (remaining === 0) {
    console.log(\`Success! Used \${totalCoins} coins:\`, result);
  } else {
    console.log(\`Failed! Cannot make exact change. Remaining: \${remaining}\`);
  }
  
  return { coins: result, totalCoins, remaining };
}

// Compare with Dynamic Programming solution
function coinChangeDP(denominations, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  const parent = new Array(amount + 1).fill(-1);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of denominations) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        parent[i] = coin;
      }
    }
  }
  
  if (dp[amount] === Infinity) {
    return { coins: [], totalCoins: -1, possible: false };
  }
  
  // Reconstruct solution
  const coins = [];
  let current = amount;
  while (current > 0) {
    const coin = parent[current];
    coins.push(coin);
    current -= coin;
  }
  
  return { coins, totalCoins: coins.length, possible: true };
}

// When is greedy optimal?
function isGreedyOptimal(denominations) {
  // Greedy is optimal for canonical coin systems
  // Examples: [1, 5, 10, 25], [1, 5, 10, 25, 50, 100]
  
  // Quick check for common systems
  const canonical = [
    [1, 5, 10, 25],
    [1, 5, 10, 25, 50, 100],
    [1, 2, 5, 10, 20, 50, 100],
    [1, 10, 25] // Not canonical!
  ];
  
  const sorted = [...denominations].sort((a, b) => a - b);
  
  // Must include 1 for exact change guarantee
  if (!sorted.includes(1)) return false;
  
  // For full verification, would need to test against DP
  // for all amounts up to a certain limit
  return true; // Simplified
}

// Usage examples:
console.log('=== Standard US Coins ===');
const usCoins = [25, 10, 5, 1];
const amount1 = 67;
const greedy1 = coinChangeGreedy(usCoins, amount1);
const dp1 = coinChangeDP(usCoins, amount1);
console.log('Greedy result:', greedy1);
console.log('DP result:', dp1);
console.log('Same result?', greedy1.totalCoins === dp1.totalCoins);

console.log('\\n=== Non-canonical system ===');
const nonCanonical = [10, 6, 1];
const amount2 = 12;
const greedy2 = coinChangeGreedy(nonCanonical, amount2);
const dp2 = coinChangeDP(nonCanonical, amount2);
console.log('Greedy result:', greedy2); // [10, 1, 1] = 3 coins
console.log('DP result:', dp2);         // [6, 6] = 2 coins (optimal)
console.log('Greedy optimal?', greedy2.totalCoins === dp2.totalCoins);

// Time Complexity: O(n) where n is number of denominations
// Space Complexity: O(1) not counting output array
// Note: Greedy is fast but not always optimal!`;

  const presets = [
    {
      name: "US Coins",
      denominations: [25, 10, 5, 1],
      amount: 67
    },
    {
      name: "Euro Coins",
      denominations: [200, 100, 50, 20, 10, 5, 2, 1],
      amount: 187
    },
    {
      name: "Non-optimal Example",
      denominations: [10, 6, 1],
      amount: 12
    },
    {
      name: "Binary System",
      denominations: [16, 8, 4, 2, 1],
      amount: 23
    }
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
          <div className="bg-purple-600 p-2 rounded-lg">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Coin Change (Greedy)</h1>
            <p className="text-gray-400 text-sm">
              Time: O(n) | Space: O(1) | Greedy Algorithm
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Target Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Target Amount</label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => {
                    setTargetAmount(Math.max(0, parseInt(e.target.value) || 0));
                    resetVisualization();
                  }}
                  disabled={playing}
                  className="w-full p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  min="1"
                />
              </div>

              {/* Denominations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Denominations</h3>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="p-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    {editMode ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
                
                {editMode && (
                  <div className="bg-slate-700 rounded-lg p-4 mb-4 space-y-3">
                    <input
                      type="number"
                      placeholder="New denomination"
                      value={newDenomination}
                      onChange={(e) => setNewDenomination(e.target.value)}
                      className="w-full p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={addDenomination}
                      className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-500 transition-colors text-sm"
                    >
                      Add Denomination
                    </button>
                  </div>
                )}

                <div className="max-h-32 overflow-y-auto space-y-2">
                  {denominations.sort((a, b) => b - a).map((denom) => (
                    <div key={denom} className="flex items-center justify-between p-2 bg-slate-700 rounded text-sm">
                      <span className="font-mono">{denom}</span>
                      {editMode && (
                        <button
                          onClick={() => removeDenomination(denom)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Optimality Check */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-2">Optimality Check</h3>
                <div className={`text-sm p-2 rounded ${isOptimal ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                  {isOptimal ? 
                    '✅ This denomination set likely gives optimal results' : 
                    '⚠️ This set may not always give optimal results'}
                </div>
              </div>

              {/* Presets */}
              <div>
                <label className="block text-sm font-medium mb-2">Example Sets</label>
                <div className="space-y-2">
                  {presets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDenominations(preset.denominations);
                        setTargetAmount(preset.amount);
                        resetVisualization();
                        setEditMode(false);
                      }}
                      disabled={playing}
                      className="w-full text-left p-2 bg-slate-700 rounded text-sm hover:bg-slate-600 disabled:opacity-50 transition-colors"
                    >
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-400">
                        Amount: {preset.amount}, Denoms: {preset.denominations.join(', ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={startCoinChange}
                  disabled={playing || denominations.length === 0 || targetAmount <= 0}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Coins className="w-4 h-4" />
                  <span>Start Change Making</span>
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
                    <span className="text-gray-400">Target:</span>
                    <span className="text-blue-400 font-mono">{targetAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Remaining:</span>
                    <span className="text-yellow-400 font-mono">{remainingAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Coins:</span>
                    <span className="text-green-400 font-mono">{totalCoins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Success:</span>
                    <span className={`font-mono ${remainingAmount === 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {remainingAmount === 0 ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {usedCoins.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-600">
                      <div className="text-xs text-gray-400 mb-1">Coins Used:</div>
                      <div className="text-xs font-mono text-green-400">
                        {usedCoins.join(', ')}
                      </div>
                    </div>
                  )}
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
                <h2 className="text-xl font-semibold mb-2">Greedy Coin Change Visualization</h2>
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
                  code={coinChangeGreedyCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Greedy Coin Change</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Make change for a given amount using the minimum number of coins. 
                      The greedy approach always uses the largest denomination possible first.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Greedy Strategy:</h4>
                    <ol className="text-sm space-y-1 text-gray-300 list-decimal list-inside">
                      <li>Sort denominations in descending order</li>
                      <li>For each denomination:</li>
                      <li className="ml-4">• Use as many coins as possible</li>
                      <li className="ml-4">• Update remaining amount</li>
                      <li className="ml-4">• Continue with next denomination</li>
                      <li>Stop when remaining amount is 0</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">When Greedy is Optimal:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-green-900/30 rounded p-2">
                        <div className="text-green-400 font-mono text-xs mb-1">Canonical Systems:</div>
                        <div className="text-gray-300 text-xs">
                          US coins [1,5,10,25], Euro coins, Binary powers [1,2,4,8,16]
                        </div>
                      </div>
                      <div className="bg-red-900/30 rounded p-2">
                        <div className="text-red-400 font-mono text-xs mb-1">Non-canonical:</div>
                        <div className="text-gray-300 text-xs">
                          [1,6,10] for amount 12: Greedy gives [10,1,1], optimal is [6,6]
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Complexity Analysis:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-yellow-400 font-mono">O(n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space:</span>
                        <span className="text-green-400 font-mono">O(1)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">vs DP:</span>
                        <span className="text-red-400 font-mono">O(amount × n)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      n = number of denominations
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Greedy vs Dynamic Programming:</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="bg-green-900/30 rounded p-2">
                        <div className="text-green-400 font-mono text-xs mb-1">Greedy Pros:</div>
                        <div className="text-xs">Fast O(n), simple implementation, memory efficient</div>
                      </div>
                      <div className="bg-red-900/30 rounded p-2">
                        <div className="text-red-400 font-mono text-xs mb-1">Greedy Cons:</div>
                        <div className="text-xs">Not always optimal, depends on coin system</div>
                      </div>
                      <div className="bg-blue-900/30 rounded p-2">
                        <div className="text-blue-400 font-mono text-xs mb-1">DP:</div>
                        <div className="text-xs">Always optimal but O(amount × n) time/space</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Real-world Applications:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Cash register systems</li>
                      <li>• Vending machines</li>
                      <li>• Currency exchange</li>
                      <li>• ATM cash dispensing</li>
                      <li>• Point-of-sale systems</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Example Comparison:</h4>
                    <div className="bg-slate-700 rounded p-3 text-xs">
                      <div className="text-gray-300 mb-2">Coins: [10, 6, 1], Amount: 12</div>
                      <div className="space-y-1 text-gray-400">
                        <div className="text-red-400">Greedy: 10 + 1 + 1 = 3 coins</div>
                        <div className="text-green-400">Optimal: 6 + 6 = 2 coins</div>
                        <div className="text-yellow-400">Greedy fails because 10 is "too greedy"</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Practical Considerations:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Most real coin systems are canonical</li>
                      <li>• Greedy is preferred for speed</li>
                      <li>• Use DP when optimality is crucial</li>
                      <li>• Test with small amounts to verify</li>
                    </ul>
                  </div>

                  {started && (
                    <div>
                      <h4 className="font-medium mb-2">Current State:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Action:</span>
                          <span className="text-white font-mono capitalize">
                            {currentStepData.action?.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Coin:</span>
                          <span className="text-blue-400 font-mono">
                            {currentDenomination || 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Remaining:</span>
                          <span className="text-yellow-400 font-mono">{remainingAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Coins Used:</span>
                          <span className="text-green-400 font-mono">{totalCoins}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Optimal:</span>
                          <span className={`font-mono ${isOptimal ? 'text-green-400' : 'text-yellow-400'}`}>
                            {isOptimal ? 'Likely' : 'Unknown'}
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

export default CoinChangeGreedy;
