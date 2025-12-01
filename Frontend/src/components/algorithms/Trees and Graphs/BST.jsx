import React, { useState, useEffect, useRef } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Settings,
  BarChart3,
  Code2,
  Activity,
  Target,
  Clock,
  Maximize2,
  ArrowLeft,
  AlertTriangle,
  Shuffle,
  GitBranch,
  Plus,
  Minus,
  Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";
import { bst as bstCode } from "../../../algorithms/codeExamples.js";

export default function BSTVisualizer() {
  const navigate = useNavigate();

  // BST state
  const [initialValues, setInitialValues] = useState("50,30,70,20,40,60,80");
  const [currentTree, setCurrentTree] = useState(null);
  const [operation, setOperation] = useState("insert"); // insert, delete, search
  const [operationValue, setOperationValue] = useState(25);

  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(800);

  // UI state
  const [activeRightTab, setActiveRightTab] = useState("stats");
  const [treeValidationError, setTreeValidationError] = useState("");
  const [isValidTree, setIsValidTree] = useState(false);
  const [currentHighlightedLine, setCurrentHighlightedLine] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error",
    customButtons: null,
  });

  const canvasRef = useRef(null);

  // Tree Node Class
  class TreeNode {
    constructor(val) {
      this.val = val;
      this.left = null;
      this.right = null;
      this.x = 0;
      this.y = 0;
    }
  }

  const handleBack = () => {
    setAlertConfig({
      isOpen: true,
      message:
        "Are you sure you want to go back? Any unsaved progress will be lost.",
      type: "warning",
      customButtons: (
        <div className="flex gap-3 justify-center">
          <button
            onClick={() =>
              setAlertConfig((prev) => ({ ...prev, isOpen: false }))
            }
            className="px-6 py-3 bg-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:bg-gray-600 shadow-lg"
          >
            Stay
          </button>
          <button
            onClick={() => {
              setAlertConfig((prev) => ({ ...prev, isOpen: false }));
              setTimeout(() => navigate("/"), 100);
            }}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Go Back
          </button>
        </div>
      ),
    });
  };

  // Build BST from array
  const buildBSTFromArray = (values) => {
    let root = null;

    const insert = (node, val) => {
      if (!node) return new TreeNode(val);

      if (val < node.val) {
        node.left = insert(node.left, val);
      } else if (val > node.val) {
        node.right = insert(node.right, val);
      }
      return node;
    };

    for (const val of values) {
      root = insert(root, val);
    }

    return root;
  };

  // Calculate tree positions for visualization
  const calculateTreePositions = (root) => {
    if (!root) return;

    const getTreeWidth = (node) => {
      if (!node) return 0;
      return 1 + getTreeWidth(node.left) + getTreeWidth(node.right);
    };

    const assignPositions = (node, x, y, spacing) => {
      if (!node) return;

      node.x = x;
      node.y = y;

      if (node.left) {
        assignPositions(node.left, x - spacing, y + 80, spacing * 0.7);
      }
      if (node.right) {
        assignPositions(node.right, x + spacing, y + 80, spacing * 0.7);
      }
    };

    const width = getTreeWidth(root) * 60;
    assignPositions(root, 400, 50, width / 4);
  };

  // BST Operations with step tracking
  const insertWithSteps = (root, val) => {
    const steps = [];
    let comparisons = 0;

    steps.push({
      operation: "insert",
      value: val,
      currentNode: null,
      path: [],
      comparisons,
      codeLine: 1,
      description: `Starting insertion of ${val} into BST`,
    });

    const insertRecursive = (node, path = []) => {
      if (!node) {
        steps.push({
          operation: "insert",
          value: val,
          currentNode: null,
          path: [...path],
          newNode: val,
          comparisons,
          codeLine: 2,
          description: `Found empty spot, inserting ${val}`,
        });
        return new TreeNode(val);
      }

      path.push(node.val);
      comparisons++;

      steps.push({
        operation: "insert",
        value: val,
        currentNode: node.val,
        path: [...path],
        comparisons,
        codeLine: val < node.val ? 4 : 6,
        description: `Comparing ${val} with ${node.val}: ${val} ${
          val < node.val ? "<" : ">"
        } ${node.val}, go ${val < node.val ? "left" : "right"}`,
      });

      if (val < node.val) {
        node.left = insertRecursive(node.left, [...path]);
      } else if (val > node.val) {
        node.right = insertRecursive(node.right, [...path]);
      } else {
        steps.push({
          operation: "insert",
          value: val,
          currentNode: node.val,
          path: [...path],
          comparisons,
          codeLine: 8,
          description: `Value ${val} already exists in BST`,
        });
      }
      return node;
    };

    const newRoot = insertRecursive(root);
    return { newRoot, steps };
  };

  const searchWithSteps = (root, val) => {
    const steps = [];
    let comparisons = 0;

    steps.push({
      operation: "search",
      value: val,
      currentNode: null,
      path: [],
      comparisons,
      codeLine: 1,
      description: `Starting search for ${val} in BST`,
    });

    const searchRecursive = (node, path = []) => {
      if (!node) {
        steps.push({
          operation: "search",
          value: val,
          currentNode: null,
          path: [...path],
          found: false,
          comparisons,
          codeLine: 2,
          description: `Reached null node, ${val} not found in BST`,
        });
        return false;
      }

      path.push(node.val);
      comparisons++;

      steps.push({
        operation: "search",
        value: val,
        currentNode: node.val,
        path: [...path],
        comparisons,
        codeLine: 3,
        description: `Comparing ${val} with ${node.val}`,
      });

      if (val === node.val) {
        steps.push({
          operation: "search",
          value: val,
          currentNode: node.val,
          path: [...path],
          found: true,
          comparisons,
          codeLine: 4,
          description: `Found ${val} at current node!`,
        });
        return true;
      } else if (val < node.val) {
        steps.push({
          operation: "search",
          value: val,
          currentNode: node.val,
          path: [...path],
          comparisons,
          codeLine: 5,
          description: `${val} < ${node.val}, searching left subtree`,
        });
        return searchRecursive(node.left, [...path]);
      } else {
        steps.push({
          operation: "search",
          value: val,
          currentNode: node.val,
          path: [...path],
          comparisons,
          codeLine: 7,
          description: `${val} > ${node.val}, searching right subtree`,
        });
        return searchRecursive(node.right, [...path]);
      }
    };

    const found = searchRecursive(root);
    return { found, steps };
  };

  // Validate tree input
  const validateTree = (treeString) => {
    try {
      const numbers = treeString.split(",").map((num) => {
        const parsed = parseInt(num.trim());
        if (isNaN(parsed)) throw new Error("Invalid number");
        return parsed;
      });

      if (numbers.length < 1) {
        return { isValid: false, error: "Tree must have at least 1 node" };
      }

      if (numbers.length > 15) {
        return { isValid: false, error: "Tree size cannot exceed 15 nodes" };
      }

      // Remove duplicates for BST
      const uniqueNumbers = [...new Set(numbers)];

      return { isValid: true, values: uniqueNumbers };
    } catch (error) {
      return {
        isValid: false,
        error: "Invalid tree format. Use comma-separated numbers.",
      };
    }
  };

  // Handle tree generation
  const handleGenerateTree = () => {
    const validation = validateTree(initialValues);
    if (validation.isValid) {
      const tree = buildBSTFromArray(validation.values);
      calculateTreePositions(tree);
      setCurrentTree(tree);
      setTreeValidationError("");
      setIsValidTree(true);
    }
    setSteps([]);
    setCurrentStep(0);
    setStarted(false);
    setPlaying(false);
  };

  // Start operation
  const handleStartOperation = () => {
    if (!isValidTree || !currentTree) {
      setTreeValidationError("Please generate a valid tree first");
      return;
    }

    let operationSteps = [];

    if (operation === "insert") {
      const result = insertWithSteps(currentTree, operationValue);
      operationSteps = result.steps;
      setCurrentTree(result.newRoot);
      calculateTreePositions(result.newRoot);
    } else if (operation === "search") {
      const result = searchWithSteps(currentTree, operationValue);
      operationSteps = result.steps;
    }

    setSteps(operationSteps);
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

  // Validate tree on change
  useEffect(() => {
    const validation = validateTree(initialValues);
    setIsValidTree(validation.isValid);
    setTreeValidationError(validation.error || "");
    if (validation.isValid) {
      const tree = buildBSTFromArray(validation.values);
      calculateTreePositions(tree);
      setCurrentTree(tree);
    }
  }, [initialValues]);

  // Animation loop
  useEffect(() => {
    let interval;
    if (playing && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
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

  // Draw tree on canvas
  useEffect(() => {
    if (!canvasRef.current || !currentTree) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentStepData = steps[currentStep];

    const drawTree = (node) => {
      if (!node) return;

      const isCurrentNode = currentStepData?.currentNode === node.val;
      const isInPath = currentStepData?.path?.includes(node.val);
      const isNewNode = currentStepData?.newNode === node.val;

      // Draw edges first
      if (node.left) {
        ctx.strokeStyle = "#4B5563";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.left.x, node.left.y);
        ctx.stroke();
        drawTree(node.left);
      }

      if (node.right) {
        ctx.strokeStyle = "#4B5563";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.right.x, node.right.y);
        ctx.stroke();
        drawTree(node.right);
      }

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);

      if (isCurrentNode) {
        ctx.fillStyle = "#EF4444"; // Red for current
        ctx.strokeStyle = "#DC2626";
      } else if (isNewNode) {
        ctx.fillStyle = "#10B981"; // Green for new
        ctx.strokeStyle = "#059669";
      } else if (isInPath) {
        ctx.fillStyle = "#F59E0B"; // Yellow for path
        ctx.strokeStyle = "#D97706";
      } else {
        ctx.fillStyle = "#6B7280"; // Gray for others
        ctx.strokeStyle = "#4B5563";
      }

      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      // Draw node value
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.val.toString(), node.x, node.y);
    };

    drawTree(currentTree);
  }, [currentTree, currentStep, steps]);

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
      <div
        className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 backdrop-blur-sm`}
      >
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
                  <GitBranch className="text-blue-400" size={28} />
                  Binary Search Tree Visualizer
                </h1>
                <p className="text-gray-400 text-sm">
                  Interactive BST operations: Insert, Search, Delete • O(log n)
                  average time
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
                {/* Tree Configuration */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings size={18} />
                    Tree Configuration
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Initial Values (comma-separated)
                      </label>
                      <textarea
                        value={initialValues}
                        onChange={(e) => setInitialValues(e.target.value)}
                        placeholder="50,30,70,20,40,60,80"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                        rows="3"
                      />
                      {treeValidationError && (
                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                          <AlertTriangle size={16} />
                          {treeValidationError}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleGenerateTree}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Shuffle size={18} />
                      Generate BST
                    </button>
                  </div>
                </div>

                {/* Operation Controls */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Play size={18} />
                    BST Operations
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Operation Type
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: "insert", name: "Insert", icon: Plus },
                          { id: "search", name: "Search", icon: Search },
                        ].map((op) => (
                          <button
                            key={op.id}
                            onClick={() => setOperation(op.id)}
                            className={`p-3 rounded-lg text-left transition-colors flex items-center gap-2 ${
                              operation === op.id
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                          >
                            <op.icon size={16} />
                            {op.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Value
                      </label>
                      <input
                        type="number"
                        value={operationValue}
                        onChange={(e) =>
                          setOperationValue(parseInt(e.target.value) || 0)
                        }
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>

                    <button
                      onClick={handleStartOperation}
                      disabled={!isValidTree}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                      <GitBranch size={18} />
                      Start{" "}
                      {operation.charAt(0).toUpperCase() + operation.slice(1)}
                    </button>

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
                {/* BST Visualization Canvas */}
                <div className="flex-1 relative">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full border border-gray-700 rounded-lg bg-gray-800/30"
                  />

                  {/* Legend */}
                  <div className="absolute top-4 right-4 bg-gray-800/90 rounded-lg p-3 border border-gray-600">
                    <div className="text-sm text-gray-300 mb-2">Legend:</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="text-gray-300">Current Node</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-300">Path Traversed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-gray-300">New/Found Node</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-300">Other Nodes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step Description */}
                {currentStepData?.description && (
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600/20 rounded-lg">
                        <GitBranch size={18} className="text-blue-400" />
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
                      <span>
                        {Math.round(((currentStep + 1) / steps.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((currentStep + 1) / steps.length) * 100}%`,
                        }}
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
                      icon={GitBranch}
                      value={
                        operation.charAt(0).toUpperCase() + operation.slice(1)
                      }
                      label="Operation"
                      color="blue"
                    />
                    <StatCard
                      icon={Target}
                      value={operationValue}
                      label="Target Value"
                      color="green"
                    />
                    <StatCard
                      icon={Activity}
                      value={currentStepData?.comparisons || 0}
                      label="Comparisons"
                      color="purple"
                    />
                    <StatCard
                      icon={Clock}
                      value={
                        steps.length > 0
                          ? `${currentStep + 1}/${steps.length}`
                          : "0/0"
                      }
                      label="Steps"
                      color="orange"
                    />

                    {/* Algorithm Info */}
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Algorithm Info
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Average Time:</span>
                          <span className="text-white font-mono">O(log n)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Worst Time:</span>
                          <span className="text-white font-mono">O(n)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Space Complexity:
                          </span>
                          <span className="text-white font-mono">O(log n)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white">Binary Tree</span>
                        </div>
                      </div>

                      {/* BST Properties */}
                      <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                        <h4 className="text-sm font-semibold text-white mb-2">
                          BST Properties:
                        </h4>
                        <div className="space-y-1 text-xs text-gray-300">
                          <div>• Left subtree values &lt; root</div>
                          <div>• Right subtree values &gt; root</div>
                          <div>• Inorder traversal gives sorted order</div>
                          <div>• Efficient search, insert, delete</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Code Tab */}
                {activeRightTab === "code" && (
                  <BasicCodeDisplay
                    code={bstCode}
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

  // Helper function to count nodes
  function countNodes(node) {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  }
}
