import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Plus, GitBranch, TreePine, List, ArrowDown, ArrowUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

// Binary Tree Node class
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
  }
}

// Binary Tree class with traversal support
class BinaryTreeClass {
  constructor() {
    this.root = null;
  }

  insert(value) {
    this.root = this.insertNode(this.root, value);
  }

  insertNode(node, value) {
    if (!node) {
      return new TreeNode(value);
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    }

    return node;
  }

  inorderTraversal(steps = []) {
    const result = [];
    const stack = [];
    
    steps.push({
      type: 'start',
      description: 'Starting In-order Traversal (Left → Root → Right)',
      currentNode: null,
      stack: [],
      result: [],
      action: 'initialize'
    });

    this.inorderHelper(this.root, steps, result, stack);
    
    steps.push({
      type: 'complete',
      description: `In-order traversal complete: [${result.join(', ')}]`,
      currentNode: null,
      stack: [],
      result: [...result],
      action: 'complete'
    });

    return steps;
  }

  inorderHelper(node, steps, result, stack) {
    if (!node) return;

    // Go left
    if (node.left) {
      steps.push({
        type: 'traverse',
        description: `Visiting ${node.value}, going left to ${node.left.value}`,
        currentNode: node.value,
        stack: [...stack, node.value],
        result: [...result],
        action: 'go_left',
        nextNode: node.left.value
      });
      stack.push(node.value);
      this.inorderHelper(node.left, steps, result, stack);
      stack.pop();
    }

    // Process current node
    result.push(node.value);
    steps.push({
      type: 'visit',
      description: `Processing node ${node.value} (added to result)`,
      currentNode: node.value,
      stack: [...stack],
      result: [...result],
      action: 'process',
      processed: node.value
    });

    // Go right
    if (node.right) {
      steps.push({
        type: 'traverse',
        description: `From ${node.value}, going right to ${node.right.value}`,
        currentNode: node.value,
        stack: [...stack],
        result: [...result],
        action: 'go_right',
        nextNode: node.right.value
      });
      this.inorderHelper(node.right, steps, result, stack);
    }
  }

  preorderTraversal(steps = []) {
    const result = [];
    
    steps.push({
      type: 'start',
      description: 'Starting Pre-order Traversal (Root → Left → Right)',
      currentNode: null,
      stack: [],
      result: [],
      action: 'initialize'
    });

    this.preorderHelper(this.root, steps, result);
    
    steps.push({
      type: 'complete',
      description: `Pre-order traversal complete: [${result.join(', ')}]`,
      currentNode: null,
      stack: [],
      result: [...result],
      action: 'complete'
    });

    return steps;
  }

  preorderHelper(node, steps, result) {
    if (!node) return;

    // Process current node first
    result.push(node.value);
    steps.push({
      type: 'visit',
      description: `Processing node ${node.value} (added to result)`,
      currentNode: node.value,
      stack: [],
      result: [...result],
      action: 'process',
      processed: node.value
    });

    // Go left
    if (node.left) {
      steps.push({
        type: 'traverse',
        description: `From ${node.value}, going left to ${node.left.value}`,
        currentNode: node.value,
        stack: [],
        result: [...result],
        action: 'go_left',
        nextNode: node.left.value
      });
      this.preorderHelper(node.left, steps, result);
    }

    // Go right
    if (node.right) {
      steps.push({
        type: 'traverse',
        description: `From ${node.value}, going right to ${node.right.value}`,
        currentNode: node.value,
        stack: [],
        result: [...result],
        action: 'go_right',
        nextNode: node.right.value
      });
      this.preorderHelper(node.right, steps, result);
    }
  }

  postorderTraversal(steps = []) {
    const result = [];
    
    steps.push({
      type: 'start',
      description: 'Starting Post-order Traversal (Left → Right → Root)',
      currentNode: null,
      stack: [],
      result: [],
      action: 'initialize'
    });

    this.postorderHelper(this.root, steps, result);
    
    steps.push({
      type: 'complete',
      description: `Post-order traversal complete: [${result.join(', ')}]`,
      currentNode: null,
      stack: [],
      result: [...result],
      action: 'complete'
    });

    return steps;
  }

  postorderHelper(node, steps, result) {
    if (!node) return;

    // Go left
    if (node.left) {
      steps.push({
        type: 'traverse',
        description: `Visiting ${node.value}, going left to ${node.left.value}`,
        currentNode: node.value,
        stack: [],
        result: [...result],
        action: 'go_left',
        nextNode: node.left.value
      });
      this.postorderHelper(node.left, steps, result);
    }

    // Go right
    if (node.right) {
      steps.push({
        type: 'traverse',
        description: `From ${node.value}, going right to ${node.right.value}`,
        currentNode: node.value,
        stack: [],
        result: [...result],
        action: 'go_right',
        nextNode: node.right.value
      });
      this.postorderHelper(node.right, steps, result);
    }

    // Process current node last
    result.push(node.value);
    steps.push({
      type: 'visit',
      description: `Processing node ${node.value} (added to result)`,
      currentNode: node.value,
      stack: [],
      result: [...result],
      action: 'process',
      processed: node.value
    });
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

  cloneTree(node) {
    if (!node) return null;
    const cloned = new TreeNode(node.value);
    cloned.left = this.cloneTree(node.left);
    cloned.right = this.cloneTree(node.right);
    return cloned;
  }
}

const TreeTraversal = () => {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  
  // Tree state
  const [binaryTree] = useState(() => {
    const tree = new BinaryTreeClass();
    // Initialize with a sample tree
    [50, 30, 70, 20, 40, 60, 80].forEach(val => tree.insert(val));
    return tree;
  });
  
  const [insertValue, setInsertValue] = useState("");
  const [traversalType, setTraversalType] = useState("inorder");
  
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
    
    binaryTree.insert(value);
    setInsertValue("");
    resetVisualization();
  };

  const startTraversal = () => {
    let traversalSteps = [];
    
    switch (traversalType) {
      case 'inorder':
        traversalSteps = binaryTree.inorderTraversal();
        break;
      case 'preorder':
        traversalSteps = binaryTree.preorderTraversal();
        break;
      case 'postorder':
        traversalSteps = binaryTree.postorderTraversal();
        break;
      default:
        return;
    }
    
    setSteps(traversalSteps);
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
    binaryTree.root = null;
    // Re-initialize with sample tree
    [50, 30, 70, 20, 40, 60, 80].forEach(val => binaryTree.insert(val));
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
    description: "Choose a traversal type and click 'Start Traversal'",
    currentNode: null,
    result: [],
    action: 'ready'
  };

  // Calculate positions for tree visualization
  useEffect(() => {
    if (binaryTree.root) {
      binaryTree.calculatePositions(binaryTree.root);
    }
  }, [binaryTree.root]);

  const traversalCodes = {
    inorder: `function inorderTraversal(node, result = []) {
  if (!node) return result;
  
  // Traverse left subtree
  inorderTraversal(node.left, result);
  
  // Visit root
  result.push(node.value);
  
  // Traverse right subtree
  inorderTraversal(node.right, result);
  
  return result;
}`,
    preorder: `function preorderTraversal(node, result = []) {
  if (!node) return result;
  
  // Visit root first
  result.push(node.value);
  
  // Traverse left subtree
  preorderTraversal(node.left, result);
  
  // Traverse right subtree
  preorderTraversal(node.right, result);
  
  return result;
}`,
    postorder: `function postorderTraversal(node, result = []) {
  if (!node) return result;
  
  // Traverse left subtree
  postorderTraversal(node.left, result);
  
  // Traverse right subtree
  postorderTraversal(node.right, result);
  
  // Visit root last
  result.push(node.value);
  
  return result;
}`
  };

  const renderTree = (node, parentX = null, parentY = null) => {
    if (!node) return null;

    const isCurrentNode = currentStepData.currentNode === node.value;
    const isProcessed = currentStepData.result.includes(node.value);
    const isNextNode = currentStepData.nextNode === node.value;

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
          fill={
            isProcessed ? "#22c55e" :
            isCurrentNode ? "#8b5cf6" :
            isNextNode ? "#f59e0b" :
            "#334155"
          }
          stroke={
            isCurrentNode || isNextNode ? "#ffffff" :
            isProcessed ? "#16a34a" :
            "#64748b"
          }
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
        
        {/* Process order number */}
        {isProcessed && (
          <text
            x={node.x}
            y={node.y - 35}
            textAnchor="middle"
            className="text-xs fill-green-400 font-bold"
          >
            {currentStepData.result.indexOf(node.value) + 1}
          </text>
        )}
        
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
          <div className="bg-green-600 p-2 rounded-lg">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Tree Traversal</h1>
            <p className="text-gray-400 text-sm">
              Time: O(n) | Space: O(h) | Inorder, Preorder, Postorder
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Traversal Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Traversal Type</label>
                <select
                  value={traversalType}
                  onChange={(e) => {
                    setTraversalType(e.target.value);
                    resetVisualization();
                  }}
                  className="w-full p-3 bg-slate-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  <option value="inorder">In-order (L→R→R)</option>
                  <option value="preorder">Pre-order (R→L→R)</option>
                  <option value="postorder">Post-order (L→R→R)</option>
                </select>
              </div>

              {/* Insert Value */}
              <div>
                <label className="block text-sm font-medium mb-2">Insert Node</label>
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
                  {[10, 25, 35, 45, 65, 75, 85, 90, 95].map(value => (
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
                <button
                  onClick={startTraversal}
                  disabled={playing || !binaryTree.root}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <TreePine className="w-4 h-4" />
                  <span>Start Traversal</span>
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
                  <span>Reset Tree</span>
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

              {/* Traversal Result */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center space-x-2">
                  <List className="w-4 h-4" />
                  <span>Traversal Result</span>
                </h3>
                <div className="text-sm font-mono text-green-400">
                  [{currentStepData.result.join(', ')}]
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {currentStepData.result.length} nodes processed
                </div>
              </div>

              {/* Legend */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Current Node</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Next Node</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Processed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-600 rounded-full border border-gray-500"></div>
                    <span>Unvisited</span>
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
                <h2 className="text-xl font-semibold mb-2">
                  {traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal
                </h2>
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
                  {binaryTree.root && renderTree(binaryTree.root)}
                  {!binaryTree.root && (
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
                  code={traversalCodes[traversalType]}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tree Traversal</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Tree traversal algorithms visit each node in a tree exactly once 
                      in a systematic way.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Traversal Types:</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong className="text-blue-400">In-order (LNR):</strong>
                        <p className="text-gray-300 ml-2">Left → Node → Right</p>
                        <p className="text-gray-400 ml-2 text-xs">Gives sorted order for BST</p>
                      </div>
                      <div>
                        <strong className="text-green-400">Pre-order (NLR):</strong>
                        <p className="text-gray-300 ml-2">Node → Left → Right</p>
                        <p className="text-gray-400 ml-2 text-xs">Good for copying tree structure</p>
                      </div>
                      <div>
                        <strong className="text-orange-400">Post-order (LRN):</strong>
                        <p className="text-gray-300 ml-2">Left → Right → Node</p>
                        <p className="text-gray-400 ml-2 text-xs">Good for deleting tree</p>
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
                        <span className="text-gray-400">Space (Recursion):</span>
                        <span className="text-red-400 font-mono">O(h)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Space (Iterative):</span>
                        <span className="text-blue-400 font-mono">O(h)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      h = height of tree (log n for balanced, n for skewed)
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Use Cases:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• <strong>In-order:</strong> BST sorting, expression evaluation</li>
                      <li>• <strong>Pre-order:</strong> Tree copying, prefix notation</li>
                      <li>• <strong>Post-order:</strong> Tree deletion, postfix notation</li>
                      <li>• <strong>All:</strong> Tree serialization, searching</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Implementation Notes:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Recursive approach is most intuitive</li>
                      <li>• Iterative uses explicit stack</li>
                      <li>• In-order of BST gives sorted sequence</li>
                      <li>• All have same time complexity O(n)</li>
                    </ul>
                  </div>

                  {started && (
                    <div>
                      <h4 className="font-medium mb-2">Current Execution:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white font-mono capitalize">{traversalType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Nodes Visited:</span>
                          <span className="text-green-400 font-mono">{currentStepData.result.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Node:</span>
                          <span className="text-purple-400 font-mono">{currentStepData.currentNode || 'None'}</span>
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

export default TreeTraversal;