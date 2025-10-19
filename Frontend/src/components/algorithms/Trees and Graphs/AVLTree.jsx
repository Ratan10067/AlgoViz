import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Plus, Minus, Search, Eye, RotateCcw as RotateLeft, RotateCw as RotateRight, TreePine
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

// AVL Tree Node class
class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.x = 0;
    this.y = 0;
  }
}

// AVL Tree class with visualization support
class AVLTreeClass {
  constructor() {
    this.root = null;
    this.steps = [];
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  updateHeight(node) {
    if (node) {
      node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }
  }

  rotateLeft(y) {
    const x = y.right;
    const T2 = x.left;

    // Perform rotation
    x.left = y;
    y.right = T2;

    // Update heights
    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  rotateRight(x) {
    const y = x.left;
    const T2 = y.right;

    // Perform rotation
    y.right = x;
    x.left = T2;

    // Update heights
    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  insert(node, value, steps) {
    // Standard BST insertion
    if (!node) {
      const newNode = new AVLNode(value);
      steps.push({
        type: 'insert',
        value,
        description: `Created new node with value ${value}`,
        tree: this.cloneTree(this.root),
        highlighting: [value],
        action: 'create'
      });
      return newNode;
    }

    if (value < node.value) {
      steps.push({
        type: 'insert',
        value,
        description: `${value} < ${node.value}, going left`,
        tree: this.cloneTree(this.root),
        highlighting: [node.value],
        action: 'compare'
      });
      node.left = this.insert(node.left, value, steps);
    } else if (value > node.value) {
      steps.push({
        type: 'insert',
        value,
        description: `${value} > ${node.value}, going right`,
        tree: this.cloneTree(this.root),
        highlighting: [node.value],
        action: 'compare'
      });
      node.right = this.insert(node.right, value, steps);
    } else {
      // Duplicate value
      return node;
    }

    // Update height
    this.updateHeight(node);

    // Get balance factor
    const balance = this.getBalance(node);

    steps.push({
      type: 'insert',
      value,
      description: `Node ${node.value}: height=${node.height}, balance=${balance}`,
      tree: this.cloneTree(this.root),
      highlighting: [node.value],
      action: 'balance_check'
    });

    // Perform rotations if needed
    if (balance > 1 && value < node.left.value) {
      // Left Left Case
      steps.push({
        type: 'insert',
        value,
        description: `Left-Left imbalance at ${node.value}, performing right rotation`,
        tree: this.cloneTree(this.root),
        highlighting: [node.value],
        action: 'rotate_right'
      });
      return this.rotateRight(node);
    }

    if (balance < -1 && value > node.right.value) {
      // Right Right Case
      steps.push({
        type: 'insert',
        value,
        description: `Right-Right imbalance at ${node.value}, performing left rotation`,
        tree: this.cloneTree(this.root),
        highlighting: [node.value],
        action: 'rotate_left'
      });
      return this.rotateLeft(node);
    }

    if (balance > 1 && value > node.left.value) {
      // Left Right Case
      steps.push({
        type: 'insert',
        value,
        description: `Left-Right imbalance at ${node.value}, performing left-right rotation`,
        tree: this.cloneTree(this.root),
        highlighting: [node.value],
        action: 'rotate_left_right'
      });
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balance < -1 && value < node.right.value) {
      // Right Left Case
      steps.push({
        type: 'insert',
        value,
        description: `Right-Left imbalance at ${node.value}, performing right-left rotation`,
        tree: this.cloneTree(this.root),
        highlighting: [node.value],
        action: 'rotate_right_left'
      });
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  insertValue(value) {
    const steps = [];
    steps.push({
      type: 'insert',
      value,
      description: `Starting insertion of ${value}`,
      tree: this.cloneTree(this.root),
      highlighting: [],
      action: 'start'
    });

    this.root = this.insert(this.root, value, steps);
    
    steps.push({
      type: 'insert',
      value,
      description: `Successfully inserted ${value}`,
      tree: this.cloneTree(this.root),
      highlighting: [value],
      action: 'complete'
    });

    return steps;
  }

  cloneTree(node) {
    if (!node) return null;
    const cloned = new AVLNode(node.value);
    cloned.height = node.height;
    cloned.left = this.cloneTree(node.left);
    cloned.right = this.cloneTree(node.right);
    return cloned;
  }

  calculatePositions(node, x = 0, y = 0, level = 0, offset = 100) {
    if (!node) return;
    
    node.x = x;
    node.y = y;
    
    const nextOffset = offset / 2;
    if (node.left) {
      this.calculatePositions(node.left, x - offset, y + 80, level + 1, nextOffset);
    }
    if (node.right) {
      this.calculatePositions(node.right, x + offset, y + 80, level + 1, nextOffset);
    }
  }
}

const AVLTree = () => {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  
  // Tree state
  const [avlTree] = useState(() => new AVLTreeClass());
  const [insertValue, setInsertValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  
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
    setCurrentHighlightedLine(null);
  };

  const handleInsert = () => {
    const value = parseInt(insertValue);
    if (isNaN(value)) return;
    
    const insertSteps = avlTree.insertValue(value);
    setSteps(insertSteps);
    setCurrentStep(0);
    setStarted(true);
    setPlaying(true);
    setInsertValue("");
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
    avlTree.root = null;
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
    tree: avlTree.root,
    highlighting: [],
    description: "AVL Tree - Self-balancing Binary Search Tree",
    action: 'ready'
  };

  // Calculate positions for current tree
  useEffect(() => {
    if (currentStepData.tree) {
      avlTree.calculatePositions(currentStepData.tree);
    }
  }, [currentStepData.tree, avlTree]);

  const avlTreeCode = `class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

function insert(node, value) {
  // 1. BST insertion
  if (!node) return new AVLNode(value);
  
  if (value < node.value)
    node.left = insert(node.left, value);
  else if (value > node.value)
    node.right = insert(node.right, value);
  else return node;
  
  // 2. Update height
  node.height = 1 + Math.max(
    getHeight(node.left),
    getHeight(node.right)
  );
  
  // 3. Get balance factor
  const balance = getBalance(node);
  
  // 4. Perform rotations if unbalanced
  if (balance > 1 && value < node.left.value)
    return rotateRight(node);
  
  if (balance < -1 && value > node.right.value)
    return rotateLeft(node);
  
  if (balance > 1 && value > node.left.value) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }
  
  if (balance < -1 && value < node.right.value) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }
  
  return node;
}`;

  const renderTree = (node, parentX = null, parentY = null) => {
    if (!node) return null;

    const isHighlighted = currentStepData.highlighting.includes(node.value);
    const balance = avlTree.getBalance(node);

    return (
      <g key={node.value}>
        {/* Draw edge to parent */}
        {parentX !== null && parentY !== null && (
          <line
            x1={parentX}
            y1={parentY}
            x2={node.x}
            y2={node.y}
            stroke="#64748b"
            strokeWidth="2"
          />
        )}
        
        {/* Draw node */}
        <circle
          cx={node.x}
          cy={node.y}
          r="25"
          fill={isHighlighted ? "#8b5cf6" : "#334155"}
          stroke={isHighlighted ? "#a855f7" : "#64748b"}
          strokeWidth="2"
          className="transition-all duration-300"
        />
        
        {/* Node value */}
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          className="text-sm font-bold fill-white"
        >
          {node.value}
        </text>
        
        {/* Height and balance factor */}
        <text
          x={node.x}
          y={node.y - 35}
          textAnchor="middle"
          className="text-xs fill-gray-400"
        >
          h:{node.height} b:{balance}
        </text>
        
        {/* Recursively render children */}
        {node.left && renderTree(node.left, node.x, node.y)}
        {node.right && renderTree(node.right, node.x, node.y)}
      </g>
    );
  };

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
            <TreePine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AVL Tree</h1>
            <p className="text-gray-400 text-sm">
              Time: O(log n) | Space: O(n) | Self-balancing BST
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Insert Value */}
              <div>
                <label className="block text-sm font-medium mb-2">Insert Value</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={insertValue}
                    onChange={(e) => setInsertValue(e.target.value)}
                    className="flex-1 p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Enter number..."
                    onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                  />
                  <button
                    onClick={handleInsert}
                    disabled={!insertValue || playing}
                    className="px-4 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Insert */}
              <div>
                <label className="block text-sm font-medium mb-2">Quick Insert</label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 25, 30, 40, 50, 60, 70, 80].map(value => (
                    <button
                      key={value}
                      onClick={() => {
                        setInsertValue(value.toString());
                        setTimeout(() => handleInsert(), 100);
                      }}
                      disabled={playing}
                      className="py-2 px-3 bg-slate-700 rounded text-sm hover:bg-slate-600 disabled:opacity-50 transition-colors"
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
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
                  <span>Clear Tree</span>
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

              {/* Tree Statistics */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Tree Stats</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Height:</span>
                    <span className="text-blue-400 font-mono">
                      {currentStepData.tree ? avlTree.getHeight(currentStepData.tree) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Root Balance:</span>
                    <span className="text-purple-400 font-mono">
                      {currentStepData.tree ? avlTree.getBalance(currentStepData.tree) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Action:</span>
                    <span className={`font-mono text-xs ${
                      currentStepData.action === 'complete' ? 'text-green-400' :
                      currentStepData.action === 'rotate_left' || currentStepData.action === 'rotate_right' ? 'text-yellow-400' :
                      'text-gray-400'
                    }`}>
                      {currentStepData.action.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Current/Highlighted Node</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-600 rounded-full border border-gray-500"></div>
                    <span>Regular Node</span>
                  </div>
                  <div className="text-gray-400">
                    h: height | b: balance factor
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* Middle Panel - Tree Visualization */}
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full bg-slate-900 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-4xl">
              {/* Description */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">AVL Tree Visualization</h2>
                <p className="text-gray-400">{currentStepData.description}</p>
              </div>

              {/* SVG Tree Visualization */}
              <div className="flex justify-center">
                <svg
                  ref={svgRef}
                  width="800"
                  height="500"
                  viewBox="-400 -50 800 500"
                  className="border border-gray-700 rounded-lg bg-slate-800/50"
                >
                  {currentStepData.tree && renderTree(currentStepData.tree)}
                  {!currentStepData.tree && (
                    <text
                      x="0"
                      y="200"
                      textAnchor="middle"
                      className="text-lg fill-gray-500"
                    >
                      Tree is empty - Insert some values to get started!
                    </text>
                  )}
                </svg>
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
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
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
                <Eye className="w-4 h-4 inline mr-2" />
                Info
              </button>
            </div>

            <div className="p-6 h-full overflow-y-auto">
              {activeRightTab === "code" ? (
                <BasicCodeDisplay
                  code={avlTreeCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">AVL Tree</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      AVL Tree is a self-balancing binary search tree where the difference 
                      between heights of left and right subtrees cannot be more than one.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Balance Factor:</h4>
                    <p className="text-gray-300 text-sm">
                      Balance Factor = Height(Left) - Height(Right)
                    </p>
                    <ul className="text-sm space-y-1 text-gray-300 mt-2">
                      <li>• BF = 0: Perfectly balanced</li>
                      <li>• BF = 1: Left-heavy</li>
                      <li>• BF = -1: Right-heavy</li>
                      <li>• |BF| &gt; 1: Requires rebalancing</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Rotations:</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>
                        <strong className="text-yellow-400">Left-Left:</strong> Right rotation
                      </div>
                      <div>
                        <strong className="text-yellow-400">Right-Right:</strong> Left rotation
                      </div>
                      <div>
                        <strong className="text-yellow-400">Left-Right:</strong> Left then right
                      </div>
                      <div>
                        <strong className="text-yellow-400">Right-Left:</strong> Right then left
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Complexity:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Search:</span>
                        <span className="text-green-400 font-mono">O(log n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Insert:</span>
                        <span className="text-yellow-400 font-mono">O(log n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Delete:</span>
                        <span className="text-red-400 font-mono">O(log n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space:</span>
                        <span className="text-blue-400 font-mono">O(n)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Advantages:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Guaranteed O(log n) operations</li>
                      <li>• Self-balancing</li>
                      <li>• Better worst-case than BST</li>
                      <li>• Height is always O(log n)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Use Cases:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Database indexing</li>
                      <li>• Memory management</li>
                      <li>• Priority queues</li>
                      <li>• Windows registry</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default AVLTree;