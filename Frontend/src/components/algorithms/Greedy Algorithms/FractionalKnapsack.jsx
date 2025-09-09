import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Package, Scale, TrendingUp, DollarSign, Weight, Plus, Minus, XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const FractionalKnapsack = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Items state
  const [items, setItems] = useState([
    { id: 1, name: "Item 1", weight: 20, value: 100 },
    { id: 2, name: "Item 2", weight: 30, value: 120 },
    { id: 3, name: "Item 3", weight: 10, value: 60 },
    { id: 4, name: "Item 4", weight: 15, value: 75 },
    { id: 5, name: "Item 5", weight: 25, value: 80 }
  ]);
  
  const [capacity, setCapacity] = useState(50);
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(700);
  
  // Algorithm state
  const [sortedItems, setSortedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [remainingCapacity, setRemainingCapacity] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [ratios, setRatios] = useState([]);
  
  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", weight: "", value: "" });
  
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
    setSortedItems([]);
    setSelectedItems([]);
    setCurrentItem(null);
    setRemainingCapacity(capacity);
    setTotalValue(0);
    setRatios([]);
    setCurrentHighlightedLine(null);
  };

  const addItem = () => {
    if (!newItem.name || !newItem.weight || !newItem.value) {
      setAlertConfig({
        isOpen: true,
        message: "Please fill in all fields for the new item.",
        type: "error"
      });
      return;
    }

    const weight = parseFloat(newItem.weight);
    const value = parseFloat(newItem.value);

    if (weight <= 0 || value <= 0) {
      setAlertConfig({
        isOpen: true,
        message: "Weight and value must be positive numbers.",
        type: "error"
      });
      return;
    }

    const newId = Math.max(...items.map(i => i.id)) + 1;
    const item = {
      id: newId,
      name: newItem.name,
      weight,
      value
    };

    setItems([...items, item]);
    setNewItem({ name: "", weight: "", value: "" });
    resetVisualization();
  };

  const removeItem = (id) => {
    setItems(items.filter(i => i.id !== id));
    resetVisualization();
  };

  const generateFractionalKnapsackSteps = () => {
    if (items.length === 0 || capacity <= 0) return [];

    const steps = [];
    
    // Step 1: Calculate value-to-weight ratios
    const itemsWithRatios = items.map(item => ({
      ...item,
      ratio: item.value / item.weight
    }));
    
    steps.push({
      type: 'calculate_ratios',
      description: 'Calculate value-to-weight ratio for each item',
      items: [...items],
      ratios: itemsWithRatios.map(item => ({ id: item.id, ratio: item.ratio })),
      sorted: [],
      selected: [],
      current: null,
      remaining: capacity,
      totalValue: 0,
      action: 'calculate_ratios',
      explanation: 'For each item, calculate ratio = value / weight. This determines the "efficiency" of each item.',
      highlightedLine: 2
    });

    // Step 2: Sort by ratio
    const sorted = [...itemsWithRatios].sort((a, b) => b.ratio - a.ratio);
    
    steps.push({
      type: 'sort_by_ratio',
      description: 'Sorted items by value-to-weight ratio (descending)',
      items: [...items],
      ratios: itemsWithRatios.map(item => ({ id: item.id, ratio: item.ratio })),
      sorted: [...sorted],
      selected: [],
      current: null,
      remaining: capacity,
      totalValue: 0,
      action: 'sort_by_ratio',
      explanation: 'Sort items in descending order of their value-to-weight ratios. Greedy choice: always pick the most efficient item first.',
      highlightedLine: 5
    });

    // Step 3: Process items one by one
    const selected = [];
    let remaining = capacity;
    let total = 0;

    for (let i = 0; i < sorted.length && remaining > 0; i++) {
      const item = sorted[i];
      
      // Consider current item
      steps.push({
        type: 'consider_item',
        description: `Considering ${item.name} (ratio: ${item.ratio.toFixed(2)})`,
        items: [...items],
        ratios: itemsWithRatios.map(item => ({ id: item.id, ratio: item.ratio })),
        sorted: [...sorted],
        selected: [...selected],
        current: item,
        remaining,
        totalValue: total,
        action: 'consider_item',
        explanation: `Examining ${item.name}: weight=${item.weight}, value=${item.value}, ratio=${item.ratio.toFixed(2)}`,
        highlightedLine: 9
      });

      if (item.weight <= remaining) {
        // Take the whole item
        selected.push({
          ...item,
          fraction: 1,
          takenWeight: item.weight,
          takenValue: item.value
        });
        remaining -= item.weight;
        total += item.value;
        
        steps.push({
          type: 'take_whole',
          description: `Took entire ${item.name} (weight: ${item.weight}, value: ${item.value})`,
          items: [...items],
          ratios: itemsWithRatios.map(item => ({ id: item.id, ratio: item.ratio })),
          sorted: [...sorted],
          selected: [...selected],
          current: item,
          remaining,
          totalValue: total,
          action: 'take_whole_item',
          explanation: `Item fits completely. Add full item to knapsack.`,
          highlightedLine: 12
        });
      } else if (remaining > 0) {
        // Take fraction of the item
        const fraction = remaining / item.weight;
        const takenValue = item.value * fraction;
        
        selected.push({
          ...item,
          fraction,
          takenWeight: remaining,
          takenValue
        });
        total += takenValue;
        
        steps.push({
          type: 'take_fraction',
          description: `Took ${(fraction * 100).toFixed(1)}% of ${item.name} (weight: ${remaining.toFixed(1)}, value: ${takenValue.toFixed(1)})`,
          items: [...items],
          ratios: itemsWithRatios.map(item => ({ id: item.id, ratio: item.ratio })),
          sorted: [...sorted],
          selected: [...selected],
          current: item,
          remaining: 0,
          totalValue: total,
          action: 'take_fraction',
          explanation: `Item doesn't fit completely. Take fraction = remaining_capacity / item_weight = ${remaining.toFixed(1)} / ${item.weight} = ${fraction.toFixed(3)}`,
          highlightedLine: 15
        });
        
        remaining = 0;
      }
    }

    // Final result
    steps.push({
      type: 'complete',
      description: `Knapsack filled! Total value: ${total.toFixed(2)}`,
      items: [...items],
      ratios: itemsWithRatios.map(item => ({ id: item.id, ratio: item.ratio })),
      sorted: [...sorted],
      selected: [...selected],
      current: null,
      remaining,
      totalValue: total,
      action: 'complete',
      explanation: `Optimal solution achieved using greedy approach. Maximum value obtained: ${total.toFixed(2)}`,
      highlightedLine: 22
    });

    return steps;
  };

  const startFractionalKnapsack = () => {
    if (items.length === 0) {
      setAlertConfig({
        isOpen: true,
        message: "Please add some items first.",
        type: "error"
      });
      return;
    }

    if (capacity <= 0) {
      setAlertConfig({
        isOpen: true,
        message: "Please set a valid knapsack capacity.",
        type: "error"
      });
      return;
    }
    
    const knapsackSteps = generateFractionalKnapsackSteps();
    setSteps(knapsackSteps);
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
    setItems([
      { id: 1, name: "Item 1", weight: 20, value: 100 },
      { id: 2, name: "Item 2", weight: 30, value: 120 },
      { id: 3, name: "Item 3", weight: 10, value: 60 },
      { id: 4, name: "Item 4", weight: 15, value: 75 },
      { id: 5, name: "Item 5", weight: 25, value: 80 }
    ]);
    setCapacity(50);
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
    description: "Set up items and click 'Start Knapsack' to begin",
    items: items,
    ratios: [],
    sorted: [],
    selected: [],
    current: null,
    remaining: capacity,
    totalValue: 0,
    action: 'ready',
    explanation: '',
    highlightedLine: null
  };

  // Update state based on current step
  useEffect(() => {
    if (currentStepData) {
      setSortedItems(currentStepData.sorted || []);
      setSelectedItems(currentStepData.selected || []);
      setCurrentItem(currentStepData.current);
      setRemainingCapacity(currentStepData.remaining || capacity);
      setTotalValue(currentStepData.totalValue || 0);
      setRatios(currentStepData.ratios || []);
      setCurrentHighlightedLine(currentStepData.highlightedLine);
    }
  }, [currentStepData, capacity]);

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

    // Draw knapsack visualization
    drawKnapsackVisualization(ctx, currentStepData);

  }, [currentStepData]);

  const drawKnapsackVisualization = (ctx, stepData) => {
    if (!stepData.items || stepData.items.length === 0) return;

    const items = stepData.items;
    const ratios = stepData.ratios || [];
    const sorted = stepData.sorted || [];
    const selected = stepData.selected || [];
    const current = stepData.current;
    
    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Fractional Knapsack Problem', canvas.width / 2, 30);
    
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(stepData.action.replace('_', ' ').toUpperCase(), canvas.width / 2, 55);

    // Draw knapsack representation
    const knapsackX = 50;
    const knapsackY = 100;
    const knapsackWidth = 200;
    const knapsackHeight = 300;
    
    // Knapsack outline
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.strokeRect(knapsackX, knapsackY, knapsackWidth, knapsackHeight);
    
    // Knapsack fill based on capacity used
    const usedCapacity = capacity - stepData.remaining;
    const fillHeight = (usedCapacity / capacity) * knapsackHeight;
    
    ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.fillRect(knapsackX, knapsackY + knapsackHeight - fillHeight, knapsackWidth, fillHeight);
    
    // Capacity labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Knapsack', knapsackX + knapsackWidth / 2, knapsackY - 10);
    
    ctx.font = '12px sans-serif';
    ctx.fillText(`Capacity: ${capacity}`, knapsackX + knapsackWidth / 2, knapsackY + knapsackHeight + 20);
    ctx.fillText(`Used: ${usedCapacity.toFixed(1)}`, knapsackX + knapsackWidth / 2, knapsackY + knapsackHeight + 35);
    ctx.fillText(`Remaining: ${stepData.remaining.toFixed(1)}`, knapsackX + knapsackWidth / 2, knapsackY + knapsackHeight + 50);
    
    // Draw selected items in knapsack
    let stackY = knapsackY + knapsackHeight - 10;
    selected.forEach((item, index) => {
      const itemHeight = (item.takenWeight / capacity) * knapsackHeight;
      stackY -= itemHeight;
      
      // Item color based on fraction
      const alpha = item.fraction;
      ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
      ctx.fillRect(knapsackX + 5, stackY, knapsackWidth - 10, itemHeight);
      
      // Item label
      if (itemHeight > 15) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        const label = item.fraction === 1 ? item.name : `${item.name} (${(item.fraction * 100).toFixed(0)}%)`;
        ctx.fillText(label, knapsackX + knapsackWidth / 2, stackY + itemHeight / 2 + 3);
      }
    });

    // Draw items table
    const tableX = 300;
    const tableY = 100;
    const cellWidth = 80;
    const cellHeight = 30;
    
    // Table headers
    const headers = ['Item', 'Weight', 'Value', 'Ratio', 'Status'];
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

    // Display items (original order)
    const displayItems = stepData.action === 'sort_by_ratio' || sorted.length > 0 ? sorted : items;
    
    displayItems.forEach((item, index) => {
      const y = tableY + (index + 1) * cellHeight;
      const ratio = ratios.find(r => r.id === item.id)?.ratio || (item.value / item.weight);
      
      // Row background
      let bgColor = '#334155';
      if (current && current.id === item.id) {
        bgColor = '#fbbf24'; // Current item
      } else if (selected.some(s => s.id === item.id)) {
        bgColor = '#22c55e'; // Selected item
      }
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(tableX, y, cellWidth * 5, cellHeight);
      
      // Cell borders
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = '#64748b';
        ctx.strokeRect(tableX + i * cellWidth, y, cellWidth, cellHeight);
      }
      
      // Cell content
      ctx.fillStyle = current && current.id === item.id ? '#1e293b' : '#ffffff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      
      // Item name
      ctx.fillText(item.name, tableX + cellWidth / 2, y + 20);
      
      // Weight
      ctx.fillText(item.weight.toString(), tableX + cellWidth * 1.5, y + 20);
      
      // Value
      ctx.fillText(item.value.toString(), tableX + cellWidth * 2.5, y + 20);
      
      // Ratio
      ctx.fillText(ratio.toFixed(2), tableX + cellWidth * 3.5, y + 20);
      
      // Status
      const selectedItem = selected.find(s => s.id === item.id);
      let status = 'Available';
      if (selectedItem) {
        status = selectedItem.fraction === 1 ? 'Full' : `${(selectedItem.fraction * 100).toFixed(0)}%`;
      } else if (current && current.id === item.id) {
        status = 'Considering';
      }
      ctx.fillText(status, tableX + cellWidth * 4.5, y + 20);
    });

    // Draw algorithm stats
    const statsX = 300;
    const statsY = tableY + (displayItems.length + 2) * cellHeight + 30;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Algorithm Statistics:', statsX, statsY);
    
    const stats = [
      `Total Items: ${items.length}`,
      `Items Selected: ${selected.length}`,
      `Total Value: ${stepData.totalValue.toFixed(2)}`,
      `Capacity Used: ${(capacity - stepData.remaining).toFixed(1)} / ${capacity}`,
      `Efficiency: ${capacity > 0 ? ((stepData.totalValue / capacity).toFixed(2)) : '0'} value/weight`
    ];
    
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#94a3b8';
    stats.forEach((stat, index) => {
      ctx.fillText(stat, statsX, statsY + 25 + index * 18);
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

  const fractionalKnapsackCode = `function fractionalKnapsack(items, capacity) {
  // Calculate value-to-weight ratio for each item
  const itemsWithRatio = items.map(item => ({
    ...item,
    ratio: item.value / item.weight
  }));
  
  // Sort by ratio in descending order (greedy choice)
  itemsWithRatio.sort((a, b) => b.ratio - a.ratio);
  
  let totalValue = 0;
  let remainingCapacity = capacity;
  const selectedItems = [];
  
  // Process items in order of efficiency
  for (const item of itemsWithRatio) {
    if (remainingCapacity === 0) break;
    
    if (item.weight <= remainingCapacity) {
      // Take the whole item
      selectedItems.push({
        ...item,
        fraction: 1,
        takenWeight: item.weight,
        takenValue: item.value
      });
      totalValue += item.value;
      remainingCapacity -= item.weight;
    } else {
      // Take fraction of the item
      const fraction = remainingCapacity / item.weight;
      const takenValue = item.value * fraction;
      
      selectedItems.push({
        ...item,
        fraction,
        takenWeight: remainingCapacity,
        takenValue
      });
      totalValue += takenValue;
      remainingCapacity = 0;
    }
  }
  
  return {
    totalValue,
    selectedItems,
    efficiency: totalValue / capacity
  };
}

// Detailed version with step tracking
function fractionalKnapsackDetailed(items, capacity) {
  console.log('Fractional Knapsack Problem');
  console.log('Items:', items);
  console.log('Capacity:', capacity);
  
  // Step 1: Calculate ratios
  const itemsWithRatio = items.map(item => {
    const ratio = item.value / item.weight;
    console.log(\`\${item.name}: value/weight = \${item.value}/\${item.weight} = \${ratio.toFixed(2)}\`);
    return { ...item, ratio };
  });
  
  // Step 2: Sort by ratio
  itemsWithRatio.sort((a, b) => b.ratio - a.ratio);
  console.log('Sorted by ratio:', itemsWithRatio.map(i => i.name));
  
  let totalValue = 0;
  let remainingCapacity = capacity;
  const selectedItems = [];
  
  // Step 3: Greedy selection
  for (const item of itemsWithRatio) {
    if (remainingCapacity === 0) break;
    
    console.log(\`\\nConsidering \${item.name}:\`);
    console.log(\`  Weight: \${item.weight}, Value: \${item.value}, Ratio: \${item.ratio.toFixed(2)}\`);
    console.log(\`  Remaining capacity: \${remainingCapacity}\`);
    
    if (item.weight <= remainingCapacity) {
      // Take whole item
      selectedItems.push({
        ...item,
        fraction: 1,
        takenWeight: item.weight,
        takenValue: item.value
      });
      totalValue += item.value;
      remainingCapacity -= item.weight;
      
      console.log(\`  → Taking entire item (value: \${item.value})\`);
    } else {
      // Take fraction
      const fraction = remainingCapacity / item.weight;
      const takenValue = item.value * fraction;
      
      selectedItems.push({
        ...item,
        fraction,
        takenWeight: remainingCapacity,
        takenValue
      });
      totalValue += takenValue;
      
      console.log(\`  → Taking \${(fraction * 100).toFixed(1)}% of item (value: \${takenValue.toFixed(2)})\`);
      remainingCapacity = 0;
    }
    
    console.log(\`  Total value so far: \${totalValue.toFixed(2)}\`);
  }
  
  console.log(\`\\nFinal result:\`);
  console.log(\`Total value: \${totalValue.toFixed(2)}\`);
  console.log(\`Items selected:\`, selectedItems);
  
  return { totalValue, selectedItems };
}

// Comparison with 0/1 Knapsack (Dynamic Programming)
function knapsack01(items, capacity) {
  const n = items.length;
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (items[i-1].weight <= w) {
        dp[i][w] = Math.max(
          dp[i-1][w],
          dp[i-1][w - items[i-1].weight] + items[i-1].value
        );
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  
  return dp[n][capacity];
}

// Usage example:
const items = [
  { name: 'Item1', weight: 20, value: 100 },
  { name: 'Item2', weight: 30, value: 120 },
  { name: 'Item3', weight: 10, value: 60 }
];

const capacity = 50;

console.log('Fractional Knapsack:');
const fractionalResult = fractionalKnapsack(items, capacity);
console.log('Max value:', fractionalResult.totalValue);

console.log('\\n0/1 Knapsack:');
const binaryResult = knapsack01(items, capacity);
console.log('Max value:', binaryResult);

// Note: Fractional knapsack typically gives higher value
// because we can take fractions of items`;

  const presets = [
    {
      name: "Small Example",
      items: [
        { id: 1, name: "A", weight: 10, value: 60 },
        { id: 2, name: "B", weight: 20, value: 100 },
        { id: 3, name: "C", weight: 30, value: 120 }
      ],
      capacity: 50
    },
    {
      name: "Classic Problem",
      items: [
        { id: 1, name: "Gold", weight: 10, value: 100 },
        { id: 2, name: "Silver", weight: 20, value: 80 },
        { id: 3, name: "Platinum", weight: 15, value: 90 },
        { id: 4, name: "Diamond", weight: 5, value: 60 }
      ],
      capacity: 30
    },
    {
      name: "Efficiency Test",
      items: [
        { id: 1, name: "High Ratio", weight: 5, value: 50 },
        { id: 2, name: "Medium Ratio", weight: 10, value: 80 },
        { id: 3, name: "Low Ratio", weight: 20, value: 60 },
        { id: 4, name: "Very High", weight: 3, value: 45 }
      ],
      capacity: 25
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
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Fractional Knapsack</h1>
            <p className="text-gray-400 text-sm">
              Time: O(n log n) | Space: O(1) | Greedy Algorithm
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Capacity Setting */}
              <div>
                <label className="block text-sm font-medium mb-2">Knapsack Capacity</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => {
                    setCapacity(Math.max(0, parseInt(e.target.value) || 0));
                    resetVisualization();
                  }}
                  disabled={playing}
                  className="w-full p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  min="1"
                />
              </div>

              {/* Item Management */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Items</h3>
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
                      type="text"
                      placeholder="Item name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="w-full p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Weight"
                        value={newItem.weight}
                        onChange={(e) => setNewItem({...newItem, weight: e.target.value})}
                        className="p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                        min="0.1"
                        step="0.1"
                      />
                      <input
                        type="number"
                        placeholder="Value"
                        value={newItem.value}
                        onChange={(e) => setNewItem({...newItem, value: e.target.value})}
                        className="p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                        min="0.1"
                        step="0.1"
                      />
                    </div>
                    <button
                      onClick={addItem}
                      className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-500 transition-colors text-sm"
                    >
                      Add Item
                    </button>
                  </div>
                )}

                <div className="max-h-40 overflow-y-auto space-y-2">
                  {items.map((item) => {
                    const ratio = item.value / item.weight;
                    return (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-slate-700 rounded text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-400">
                            W:{item.weight} V:{item.value} R:{ratio.toFixed(2)}
                          </div>
                        </div>
                        {editMode && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
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
                        setItems(preset.items);
                        setCapacity(preset.capacity);
                        resetVisualization();
                        setEditMode(false);
                      }}
                      disabled={playing}
                      className="w-full text-left p-2 bg-slate-700 rounded text-sm hover:bg-slate-600 disabled:opacity-50 transition-colors"
                    >
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-400">
                        {preset.items.length} items, capacity {preset.capacity}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={startFractionalKnapsack}
                  disabled={playing || items.length === 0 || capacity <= 0}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>Start Knapsack</span>
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
                    <span className="text-gray-400">Total Items:</span>
                    <span className="text-blue-400 font-mono">{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capacity:</span>
                    <span className="text-green-400 font-mono">{capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Used Weight:</span>
                    <span className="text-yellow-400 font-mono">
                      {(capacity - remainingCapacity).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Value:</span>
                    <span className="text-purple-400 font-mono">{totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Efficiency:</span>
                    <span className="text-red-400 font-mono">
                      {capacity > 0 ? (totalValue / capacity).toFixed(2) : '0'} value/weight
                    </span>
                  </div>
                </div>
              </div>

              {/* Algorithm Steps */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Algorithm Steps</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Calculate value/weight ratios</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Sort by efficiency (ratio)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Take items greedily</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Take fractions if needed</span>
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
                <h2 className="text-xl font-semibold mb-2">Fractional Knapsack Visualization</h2>
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
                  code={fractionalKnapsackCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Fractional Knapsack</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      A greedy algorithm for the knapsack problem where items can be broken 
                      into fractions. Unlike the 0/1 knapsack, we can take partial items to 
                      maximize value within weight capacity.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Greedy Strategy:</h4>
                    <ol className="text-sm space-y-1 text-gray-300 list-decimal list-inside">
                      <li>Calculate value/weight ratio for each item</li>
                      <li>Sort items by ratio in descending order</li>
                      <li>For each item in sorted order:</li>
                      <li className="ml-4">• If item fits completely, take it all</li>
                      <li className="ml-4">• If only part fits, take the fraction</li>
                      <li className="ml-4">• If no space left, stop</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Why Greedy Works:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-green-400 font-mono text-xs mb-1">Optimal Substructure:</div>
                        <div className="text-gray-300 text-xs">
                          Taking the most efficient item first is always optimal
                        </div>
                      </div>
                      <div className="bg-slate-700 rounded p-2">
                        <div className="text-blue-400 font-mono text-xs mb-1">Fractional Property:</div>
                        <div className="text-gray-300 text-xs">
                          Can take any fraction, so efficiency determines value
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Complexity Analysis:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-yellow-400 font-mono">O(n log n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space:</span>
                        <span className="text-green-400 font-mono">O(1)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sorting:</span>
                        <span className="text-blue-400 font-mono">O(n log n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Selection:</span>
                        <span className="text-purple-400 font-mono">O(n)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Fractional vs 0/1 Knapsack:</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="bg-green-900/30 rounded p-2">
                        <div className="text-green-400 font-mono text-xs mb-1">Fractional:</div>
                        <div className="text-xs">Greedy O(n log n), always optimal</div>
                      </div>
                      <div className="bg-blue-900/30 rounded p-2">
                        <div className="text-blue-400 font-mono text-xs mb-1">0/1 Knapsack:</div>
                        <div className="text-xs">Dynamic Programming O(nW), discrete items</div>
                      </div>
                      <div className="bg-yellow-900/30 rounded p-2">
                        <div className="text-yellow-400 font-mono text-xs mb-1">Key Difference:</div>
                        <div className="text-xs">Fractional allows partial items, 0/1 doesn't</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Applications:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Resource allocation with divisible resources</li>
                      <li>• Portfolio optimization</li>
                      <li>• Cutting stock problems</li>
                      <li>• Budget allocation</li>
                      <li>• Data compression algorithms</li>
                      <li>• Chemical mixture problems</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Example Calculation:</h4>
                    <div className="bg-slate-700 rounded p-3 text-xs">
                      <div className="text-gray-300 mb-2">Items: A(w=10,v=60), B(w=20,v=100), C(w=30,v=120)</div>
                      <div className="space-y-1 text-gray-400">
                        <div>Ratios: A=6.0, B=5.0, C=4.0</div>
                        <div>Sorted: A, B, C</div>
                        <div>Capacity=50: Take A(10), B(20), C(20/30) = 2/3</div>
                        <div className="text-green-400">Value = 60 + 100 + 80 = 240</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Related Problems:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Continuous knapsack</li>
                      <li>• Unbounded knapsack</li>
                      <li>• Multiple knapsack</li>
                      <li>• Bin packing problem</li>
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
                          <span className="text-gray-400">Current Item:</span>
                          <span className="text-blue-400 font-mono">
                            {currentItem ? currentItem.name : 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Items Selected:</span>
                          <span className="text-green-400 font-mono">{selectedItems.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Remaining Capacity:</span>
                          <span className="text-yellow-400 font-mono">{remainingCapacity.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Value:</span>
                          <span className="text-purple-400 font-mono">{totalValue.toFixed(2)}</span>
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

export default FractionalKnapsack;
