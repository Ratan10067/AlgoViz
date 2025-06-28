import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Code,
  Info,
  ArrowLeft,
  FastForward,
  GripVertical,
  Plus,
  Minus,
  Download,
  Upload,
  X,
} from "lucide-react";

const BFSVisualizer = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const resizeLeftRef = useRef(null);
  const resizeRightRef = useRef(null);

  // Panel sizing
  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [rightPanelWidth, setRightPanelWidth] = useState(384);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  // Graph state
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(5);
  const [startNode, setStartNode] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [bfsSteps, setBfsSteps] = useState([]);
  const [distances, setDistances] = useState({});
  const [statistics, setStatistics] = useState({
    nodesVisited: 0,
    queueOperations: 0,
    totalNodes: 0,
    progress: 0,
  });

  // Custom input modal
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customNodes, setCustomNodes] = useState("");
  const [customEdges, setCustomEdges] = useState("");

  // Initialize graph
  useEffect(() => {
    initializeGraph();
  }, []);

  // Resize handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingLeft) {
        const newWidth = Math.max(250, Math.min(500, e.clientX));
        setLeftPanelWidth(newWidth);
      }
      if (isResizingRight) {
        const newWidth = Math.max(
          300,
          Math.min(600, window.innerWidth - e.clientX)
        );
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  const initializeGraph = () => {
    // Create a sample graph with circular nodes
    const sampleNodes = [
      { id: 0, x: 400, y: 200, label: "A" },
      { id: 1, x: 300, y: 300, label: "B" },
      { id: 2, x: 500, y: 300, label: "C" },
      { id: 3, x: 200, y: 400, label: "D" },
      { id: 4, x: 400, y: 400, label: "E" },
      { id: 5, x: 600, y: 400, label: "F" },
      { id: 6, x: 300, y: 500, label: "G" },
      { id: 7, x: 500, y: 500, label: "H" },
    ];

    const sampleEdges = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
      { from: 4, to: 6 },
      { from: 4, to: 7 },
      { from: 5, to: 7 },
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setStatistics((prev) => ({ ...prev, totalNodes: sampleNodes.length }));
    generateBFSSteps(sampleNodes, sampleEdges, startNode);
  };

  const generateBFSSteps = (graphNodes, graphEdges, start) => {
    const steps = [];
    const visited = new Set();
    const queue = [start];
    const adjacencyList = {};
    const distances = {};

    // Initialize distances
    graphNodes.forEach((node) => {
      adjacencyList[node.id] = [];
      distances[node.id] = node.id === start ? 0 : Infinity;
    });

    graphEdges.forEach((edge) => {
      adjacencyList[edge.from].push(edge.to);
      adjacencyList[edge.to].push(edge.from);
    });

    steps.push({
      queue: [...queue],
      visited: new Set(),
      current: null,
      distances: { ...distances },
      action: "Initialize queue with start node, distance 0",
      code: 1,
    });

    while (queue.length > 0) {
      const current = queue.shift();

      if (!visited.has(current)) {
        visited.add(current);

        steps.push({
          queue: [...queue],
          visited: new Set(visited),
          current: current,
          distances: { ...distances },
          action: `Visit node ${graphNodes[current].label} at distance ${distances[current]}`,
          code: 2,
        });

        // Add neighbors to queue and update distances
        const neighbors = adjacencyList[current].filter(
          (neighbor) => !visited.has(neighbor)
        );

        neighbors.forEach((neighbor) => {
          if (!queue.includes(neighbor)) {
            queue.push(neighbor);
            if (distances[neighbor] === Infinity) {
              distances[neighbor] = distances[current] + 1;
            }
          }
        });

        if (neighbors.length > 0) {
          steps.push({
            queue: [...queue],
            visited: new Set(visited),
            current: current,
            distances: { ...distances },
            action: `Add neighbors of ${graphNodes[current].label} to queue, update distances`,
            code: 3,
          });
        }
      }
    }

    steps.push({
      queue: [],
      visited: new Set(visited),
      current: null,
      distances: { ...distances },
      action: "BFS traversal complete",
      code: 4,
    });

    setBfsSteps(steps);
    setDistances(distances);
  };

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentStepData = bfsSteps[currentStep] || {
      visited: new Set(),
      current: null,
      queue: [],
      distances: {},
    };

    // Draw edges
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const isVisited = currentStepData.visited.has(node.id);
      const isCurrent = currentStepData.current === node.id;
      const isInQueue = currentStepData.queue.includes(node.id);
      const distance = currentStepData.distances[node.id] || 0;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);

      if (isCurrent) {
        ctx.fillStyle = "#ef4444"; // Red for current node
        ctx.strokeStyle = "#fca5a5";
        ctx.lineWidth = 3;
      } else if (isVisited) {
        ctx.fillStyle = "#10b981"; // Green for visited
        ctx.strokeStyle = "#6ee7b7";
        ctx.lineWidth = 2;
      } else if (isInQueue) {
        ctx.fillStyle = "#3b82f6"; // Blue for queued
        ctx.strokeStyle = "#93c5fd";
        ctx.lineWidth = 2;
      } else {
        ctx.fillStyle = "#4b5563"; // Gray for unvisited
        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 1;
      }

      ctx.fill();
      ctx.stroke();

      // Node label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);

      // Distance label
      if (distance !== Infinity && distance !== undefined) {
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 12px Arial";
        ctx.fillText(`d:${distance}`, node.x, node.y + 40);
      }
    });
  }, [nodes, edges, currentStep, bfsSteps]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const play = () => {
    if (currentStep >= bfsSteps.length - 1) {
      reset();
      return;
    }
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setStatistics((prev) => ({
      ...prev,
      nodesVisited: 0,
      queueOperations: 0,
      progress: 0,
    }));
  };

  const stepForward = () => {
    if (currentStep < bfsSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (currentStep < bfsSteps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1000 / animationSpeed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, animationSpeed, bfsSteps.length]);

  // Update statistics
  useEffect(() => {
    if (bfsSteps[currentStep]) {
      const step = bfsSteps[currentStep];
      setStatistics((prev) => ({
        ...prev,
        nodesVisited: step.visited.size,
        queueOperations: currentStep,
        progress: Math.round((currentStep / (bfsSteps.length - 1)) * 100),
      }));
    }
  }, [currentStep, bfsSteps]);

  const handleCustomInput = () => {
    try {
      const parsedNodes = JSON.parse(customNodes);
      const parsedEdges = JSON.parse(customEdges);

      // Validate input
      if (!Array.isArray(parsedNodes) || !Array.isArray(parsedEdges)) {
        throw new Error("Invalid format");
      }

      setNodes(parsedNodes);
      setEdges(parsedEdges);
      setStartNode(parsedNodes[0]?.id || 0);
      setStatistics((prev) => ({ ...prev, totalNodes: parsedNodes.length }));
      generateBFSSteps(parsedNodes, parsedEdges, parsedNodes[0]?.id || 0);
      setShowCustomInput(false);
      reset();
    } catch (error) {
      alert("Invalid input format. Please check your JSON syntax.");
    }
  };

  const exportGraph = () => {
    const data = {
      nodes: nodes,
      edges: edges,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "graph.json";
    a.click();
  };

  const bfsCode = `function bfs(graph, startNode) {
  const visited = new Set();
  const queue = [startNode];
  const distances = { [startNode]: 0 };
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (!visited.has(current)) {
      visited.add(current);
      console.log('Visiting:', current, 'Distance:', distances[current]);
      
      // Add unvisited neighbors to queue
      for (let neighbor of graph[current]) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);
          distances[neighbor] = distances[current] + 1;
        }
      }
    }
  }
  return distances;
}`;

  const getCurrentCodeLine = () => {
    const step = bfsSteps[currentStep];
    if (!step) return 0;
    return step.code || 0;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Custom Input Modal */}
      {showCustomInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Custom Graph Input</h2>
              <button
                onClick={() => setShowCustomInput(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nodes (JSON Array)
                </label>
                <textarea
                  value={customNodes}
                  onChange={(e) => setCustomNodes(e.target.value)}
                  placeholder='[{"id": 0, "x": 400, "y": 200, "label": "A"}, {"id": 1, "x": 300, "y": 300, "label": "B"}]'
                  className="w-full h-32 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Edges (JSON Array)
                </label>
                <textarea
                  value={customEdges}
                  onChange={(e) => setCustomEdges(e.target.value)}
                  placeholder='[{"from": 0, "to": 1}, {"from": 1, "to": 2}]'
                  className="w-full h-24 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm font-mono"
                />
              </div>

              <div className="bg-gray-700 rounded p-3 text-sm">
                <h4 className="font-semibold mb-2">Example Format:</h4>
                <div className="space-y-1 text-xs text-gray-300">
                  <p>
                    <strong>Nodes:</strong> Each node needs id, x, y
                    coordinates, and label
                  </p>
                  <p>
                    <strong>Edges:</strong> Each edge needs from and to node IDs
                  </p>
                  <p>
                    <strong>Coordinates:</strong> Canvas is 800x600, so keep x:
                    50-750, y: 50-550
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCustomInput}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium"
                >
                  Apply Graph
                </button>
                <button
                  onClick={() => setShowCustomInput(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Enhanced BFS Visualizer</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCustomInput(true)}
              className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Custom Graph
            </button>
            <button
              onClick={exportGraph}
              className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Complexity:</span>
              <span className="text-cyan-400 font-mono">O(V + E)</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Controls */}
        <div
          ref={leftPanelRef}
          className="bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto relative"
          style={{ width: `${leftPanelWidth}px` }}
        >
          {/* Resize Handle */}
          <div
            ref={resizeLeftRef}
            className="absolute right-0 top-0 bottom-0 w-1 bg-gray-600 hover:bg-gray-500 cursor-col-resize"
            onMouseDown={() => setIsResizingLeft(true)}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
              <GripVertical className="w-3 h-3 text-gray-400" />
            </div>
          </div>

          {/* Graph Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Graph Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Node
                </label>
                <select
                  value={startNode}
                  onChange={(e) => {
                    const newStart = parseInt(e.target.value);
                    setStartNode(newStart);
                    generateBFSSteps(nodes, edges, newStart);
                    reset();
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      Node {node.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Animation Speed: {animationSpeed}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Controls</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={isPlaying ? pause : play}
                className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                  isPlaying
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                onClick={stepForward}
                disabled={currentStep >= bfsSteps.length - 1}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
              >
                <FastForward className="w-4 h-4 mr-2" />
                Step
              </button>

              <button
                onClick={reset}
                className="flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all col-span-2"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Nodes Visited:</span>
                <span className="text-green-400 font-mono">
                  {statistics.nodesVisited}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Queue Operations:</span>
                <span className="text-blue-400 font-mono">
                  {statistics.queueOperations}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Nodes:</span>
                <span className="text-white font-mono">
                  {statistics.totalNodes}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Progress:</span>
                <span className="text-cyan-400 font-mono">
                  {statistics.progress}%
                </span>
              </div>
            </div>
          </div>

          {/* Distance Array */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Distance Array</h3>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {nodes.map((node) => {
                  const currentDist =
                    bfsSteps[currentStep]?.distances?.[node.id];
                  return (
                    <div key={node.id} className="flex justify-between">
                      <span className="text-gray-300">{node.label}:</span>
                      <span className="text-yellow-400 font-mono">
                        {currentDist === Infinity ? "∞" : currentDist ?? "∞"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Step Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Current Step
            </h3>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                {bfsSteps[currentStep]?.action ||
                  "Ready to start BFS traversal"}
              </p>
              <div className="mt-3">
                <div className="text-xs text-gray-400 mb-1">Queue:</div>
                <div className="flex flex-wrap gap-1">
                  {(bfsSteps[currentStep]?.queue || []).map((nodeId, index) => (
                    <span
                      key={index}
                      className="bg-blue-600 px-2 py-1 rounded text-xs"
                    >
                      {nodes[nodeId]?.label}
                    </span>
                  ))}
                  {(!bfsSteps[currentStep]?.queue ||
                    bfsSteps[currentStep].queue.length === 0) && (
                    <span className="text-gray-500 text-xs">Empty</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-600 rounded-full border border-gray-400"></div>
                <span>Unvisited</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-600 rounded-full border border-blue-400"></div>
                <span>In Queue</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-600 rounded-full border border-red-400"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-600 rounded-full border border-green-400"></div>
                <span>Visited</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span>Distance Label</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Visualization */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-gray-900 flex items-center justify-center p-8">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-gray-700 rounded-lg bg-gray-800"
              />
              <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-300">
                  Step {currentStep + 1} of {bfsSteps.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code */}
        <div
          ref={rightPanelRef}
          className="bg-gray-800 border-l border-gray-700 flex flex-col relative"
          style={{ width: `${rightPanelWidth}px` }}
        >
          {/* Resize Handle */}
          <div
            ref={resizeRightRef}
            className="absolute left-0 top-0 bottom-0 w-1 bg-gray-600 hover:bg-gray-500 cursor-col-resize"
            onMouseDown={() => setIsResizingRight(true)}
          >
            <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <GripVertical className="w-3 h-3 text-gray-400" />
            </div>
          </div>

          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Source Code
            </h3>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <pre className="text-sm font-mono">
              <code className="text-gray-300">
                {bfsCode.split("\n").map((line, index) => (
                  <div
                    key={index}
                    className={`leading-6 ${
                      getCurrentCodeLine() === index + 1
                        ? "bg-cyan-500 bg-opacity-20 text-cyan-300"
                        : ""
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </code>
            </pre>
          </div>

          <div className="p-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Algorithm Steps</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                    getCurrentCodeLine() === 1 ? "bg-cyan-400" : "bg-gray-600"
                  }`}
                ></div>
                <span>
                  Initialize queue with start node and set its distance to 0
                </span>
              </div>
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                    getCurrentCodeLine() === 2 ? "bg-cyan-400" : "bg-gray-600"
                  }`}
                ></div>
                <span>Dequeue node and mark as visited</span>
              </div>
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                    getCurrentCodeLine() === 3 ? "bg-cyan-400" : "bg-gray-600"
                  }`}
                ></div>
                <span>
                  Enqueue unvisited neighbors and update their distances
                </span>
              </div>
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                    getCurrentCodeLine() === 4 ? "bg-cyan-400" : "bg-gray-600"
                  }`}
                ></div>
                <span>Repeat until queue is empty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BFSVisualizer;
