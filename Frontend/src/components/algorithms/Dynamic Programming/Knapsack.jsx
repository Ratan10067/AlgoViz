import { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaRedo, FaPlus, FaTrash } from 'react-icons/fa';
import { knapsack } from '../../../algorithms/codeExamples.js';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import Alert from "../../Alert";
import BasicCodeDisplay from "../../BasicCodeDisplay";

const KnapsackVisualizer = () => {
  const [items, setItems] = useState([
    { weight: 10, value: 60, name: 'Item 1' },
    { weight: 20, value: 100, name: 'Item 2' },
    { weight: 30, value: 120, name: 'Item 3' }
  ]);
  const [capacity, setCapacity] = useState(50);
  const [newItem, setNewItem] = useState({ weight: '', value: '', name: '' });
  const [dp, setDp] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [highlightedLines, setHighlightedLines] = useState([]);

  // Solve knapsack problem step by step
  const solveKnapsack = () => {
    const n = items.length;
    const W = capacity;
    const newDp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));
    const newSteps = [];

    // Fill the DP table
    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= W; w++) {
        const weight = items[i - 1].weight;
        const value = items[i - 1].value;

        if (weight <= w) {
          const includeValue = value + newDp[i - 1][w - weight];
          const excludeValue = newDp[i - 1][w];
          
          if (includeValue > excludeValue) {
            newDp[i][w] = includeValue;
            newSteps.push({
              description: `Including ${items[i - 1].name} (w=${weight}, v=${value}) at capacity ${w}`,
              i,
              w,
              value: includeValue,
              line: 5
            });
          } else {
            newDp[i][w] = excludeValue;
            newSteps.push({
              description: `Excluding ${items[i - 1].name} at capacity ${w}`,
              i,
              w,
              value: excludeValue,
              line: 7
            });
          }
        } else {
          newDp[i][w] = newDp[i - 1][w];
          newSteps.push({
            description: `${items[i - 1].name} too heavy (w=${weight}) for capacity ${w}`,
            i,
            w,
            value: newDp[i][w],
            line: 8
          });
        }
      }
    }

    // Backtrack to find selected items
    const selected = [];
    let i = n;
    let w = W;
    
    while (i > 0 && w > 0) {
      if (newDp[i][w] !== newDp[i - 1][w]) {
        selected.push(items[i - 1]);
        w -= items[i - 1].weight;
      }
      i--;
    }

    setDp(newDp);
    setSelectedItems(selected);
    setSteps(newSteps);
    setCurrentStep(0);
  };

  // Add new item
  const addItem = () => {
    if (newItem.weight && newItem.value && newItem.name) {
      setItems([...items, {
        weight: parseInt(newItem.weight),
        value: parseInt(newItem.value),
        name: newItem.name
      }]);
      setNewItem({ weight: '', value: '', name: '' });
    }
  };

  // Remove item
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Animation controls
  const playAnimation = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (steps[currentStep]) {
      setHighlightedLines([steps[currentStep].line]);
    }
  }, [currentStep, steps]);

  // Render DP table
  const renderDPTable = () => {
    if (dp.length === 0) return null;

    const currentStepData = steps[currentStep];
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Dynamic Programming Table</h3>
        <div className="overflow-auto max-h-96">
          <table className="border border-gray-600 text-sm">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 p-2">Items \\ Weight</th>
                {Array.from({ length: capacity + 1 }, (_, i) => (
                  <th key={i} className="border border-gray-600 p-2 min-w-12">{i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dp.map((row, i) => (
                <tr key={i} className={i === 0 ? 'bg-gray-700' : ''}>
                  <td className="border border-gray-600 p-2 font-semibold bg-gray-700">
                    {i === 0 ? '∅' : items[i - 1].name}
                  </td>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`border border-gray-600 p-2 text-center ${
                        currentStepData && currentStepData.i === i && currentStepData.w === j
                          ? 'bg-blue-600 text-white'
                          : cell > 0 ? 'bg-green-900' : ''
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PanelGroup direction="horizontal" className="min-h-screen">
        {/* Visualization Panel */}
        <Panel defaultSize={60} minSize={40}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                0/1 Knapsack Problem
              </h1>
              <p className="text-gray-400 mt-2">Dynamic programming solution to maximize value within weight constraint</p>
            </div>

            {/* Controls */}
            <div className="p-6 border-b border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Capacity Control */}
                <div>
                  <label className="block text-sm font-medium mb-2">Knapsack Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                    className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none w-24"
                  />
                </div>

                {/* Add Item */}
                <div>
                  <label className="block text-sm font-medium mb-2">Add Item</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none flex-1"
                      placeholder="Name"
                    />
                    <input
                      type="number"
                      value={newItem.weight}
                      onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
                      className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none w-20"
                      placeholder="Weight"
                    />
                    <input
                      type="number"
                      value={newItem.value}
                      onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                      className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none w-20"
                      placeholder="Value"
                    />
                    <button
                      onClick={addItem}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <FaPlus size={14} />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={solveKnapsack}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Solve Knapsack
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={isPlaying ? () => setIsPlaying(false) : playAnimation}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FaStepForward size={14} />
                    Step
                  </button>
                  <button
                    onClick={resetAnimation}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FaRedo size={14} />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Available Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      selectedItems.some(selected => selected.name === item.name)
                        ? 'border-green-500 bg-green-900/30'
                        : 'border-gray-600 bg-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-400">Weight: {item.weight}</p>
                        <p className="text-sm text-gray-400">Value: {item.value}</p>
                        <p className="text-sm text-purple-400">
                          Ratio: {(item.value / item.weight).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visualization */}
            <div className="flex-1 p-6 overflow-auto">
              {/* Solution Summary */}
              {selectedItems.length > 0 && (
                <div className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Optimal Solution</h3>
                  <p className="text-gray-300">
                    Maximum Value: <span className="font-bold text-green-400">
                      {selectedItems.reduce((sum, item) => sum + item.value, 0)}
                    </span>
                  </p>
                  <p className="text-gray-300">
                    Total Weight: <span className="font-bold text-blue-400">
                      {selectedItems.reduce((sum, item) => sum + item.weight, 0)} / {capacity}
                    </span>
                  </p>
                  <p className="text-gray-300 mt-2">
                    Selected Items: {selectedItems.map(item => item.name).join(', ')}
                  </p>
                </div>
              )}

              {/* DP Table */}
              {renderDPTable()}
            </div>

            {/* Step Description */}
            {steps[currentStep] && (
              <div className="p-6 border-t border-gray-700 bg-gray-800/50">
                <div className="text-lg font-semibold text-blue-400">
                  Step {currentStep + 1}: {steps[currentStep].description}
                </div>
              </div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-600 transition-colors" />

        {/* Code Panel */}
        <Panel defaultSize={40} minSize={30}>
          <div className="h-full flex flex-col">
            {/* Language Selector */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex gap-2">
                {['javascript', 'python', 'cpp'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Display */}
            <div className="flex-1 p-4 overflow-auto">
              <pre className="text-sm">
                <code className="text-gray-300">
                  {knapsack[selectedLanguage]?.split('\n').map((line, index) => (
                    <div
                      key={index}
                      className={`${
                        highlightedLines.includes(index + 1)
                          ? 'bg-blue-600/30 border-l-4 border-blue-500'
                          : ''
                      } px-2 py-1`}
                    >
                      <span className="text-gray-500 mr-4">{index + 1}</span>
                      {line}
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Complexity Information */}
            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Knapsack Complexity</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <div><strong>Time:</strong> O(n × W)</div>
                <div><strong>Space:</strong> O(n × W)</div>
                <div><strong>n:</strong> Number of items</div>
                <div><strong>W:</strong> Knapsack capacity</div>
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default KnapsackVisualizer;
