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
import Alert from "./Alert";
import ConfirmDialog from "./ConfirmDialog";
import { useNavigate } from "react-router-dom";
const BFSVisualizer = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const resizeLeftRef = useRef(null);
  const resizeRightRef = useRef(null);
  const navigate = useNavigate();
  // Panel sizing
  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [rightPanelWidth, setRightPanelWidth] = useState(384);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error",
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  // Graph type and input modals
  const [showGraphTypeModal, setShowGraphTypeModal] = useState(false);
  const [showGraphInput, setShowGraphInput] = useState(false);
  const [graphType, setGraphType] = useState("undirected"); // 'directed' or 'undirected'
  const [numNodes, setNumNodes] = useState(8);
  const [edgeList, setEdgeList] = useState(
    "0-1, 0-2, 1-3, 1-4, 2-4, 2-5, 3-6, 4-6, 4-7, 5-7"
  );

  // Initialize graph
  useEffect(() => {
    initializeGraph();
  }, []);

  // Smooth resize handlers with requestAnimationFrame
  useEffect(() => {
    let animationId;

    const handleMouseMove = (e) => {
      if (isResizingLeft || isResizingRight) {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        animationId = requestAnimationFrame(() => {
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
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isResizingLeft, isResizingRight]);

  const showAlert = (message, type = "error") => {
    setAlertConfig({
      isOpen: true,
      message,
      type,
    });
  };

  const closeAlert = () => {
    setAlertConfig({
      ...alertConfig,
      isOpen: false,
    });
  };
  const handleBackClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmNavigation = () => {
    navigate("/"); // Navigate to home page
  };

  const handleCancelNavigation = () => {
    setShowConfirmDialog(false);
  };
  const generateNodePositions = (numNodes) => {
    const positions = [];
    const centerX = 400;
    const centerY = 300;
    const radius = Math.min(200, 50 + numNodes * 15);

    if (numNodes === 1) {
      positions.push({ id: 0, x: centerX, y: centerY, label: "0" });
    } else {
      for (let i = 0; i < numNodes; i++) {
        const angle = (2 * Math.PI * i) / numNodes - Math.PI / 2; // Start from top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions.push({
          id: i,
          x: Math.round(x),
          y: Math.round(y),
          label: i.toString(),
        });
      }
    }

    return positions;
  };

  const parseEdgeList = (edgeString) => {
    try {
      const edges = [];
      const edgePairs = edgeString.split(",").map((e) => e.trim());

      if (edgePairs.some((edge) => !edge.includes("-"))) {
        showAlert("Invalid edge format. Use format: 0-1, 1-2, etc.");
        return [];
      }

      for (const edge of edgePairs) {
        const [from, to] = edge.split("-").map((n) => parseInt(n.trim()));
        if (!isNaN(from) && !isNaN(to)) {
          edges.push({ from, to });
          // For undirected graphs, add the reverse edge
          if (graphType === "undirected") {
            edges.push({ from: to, to: from });
          }
        }
      }

      return edges;
    } catch (error) {
      showAlert("Error parsing edges. Please check your input format.");
      return [];
    }
  };

  const initializeGraph = () => {
    const sampleNodes = generateNodePositions(8);
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
    generateBFSSteps(sampleNodes, sampleEdges, 0);
  };

  const generateBFSSteps = (graphNodes, graphEdges, start) => {
    const steps = [];
    const visited = new Set();
    const queue = [start];
    const adjacencyList = {};
    const distances = {};

    // Initialize distances and adjacency list
    graphNodes.forEach((node) => {
      adjacencyList[node.id] = [];
      distances[node.id] = node.id === start ? 0 : Infinity;
    });

    graphEdges.forEach((edge) => {
      if (!adjacencyList[edge.from].includes(edge.to)) {
        adjacencyList[edge.from].push(edge.to);
      }
    });

    // Step 1: Initialize
    steps.push({
      queue: [...queue],
      visited: new Set(),
      current: null,
      distances: { ...distances },
      action: `Initialize: Add start node ${start} to queue with distance 0`,
      codeLine: 1,
      phase: "initialize",
    });

    let stepCount = 0;
    while (queue.length > 0 && stepCount < 50) {
      // Safety limit
      stepCount++;

      // Step 2: Check queue condition
      steps.push({
        queue: [...queue],
        visited: new Set(visited),
        current: null,
        distances: { ...distances },
        action: `Check: Queue is not empty (length: ${queue.length})`,
        codeLine: 2,
        phase: "check",
      });

      const current = queue.shift();

      // Step 3: Dequeue current node
      steps.push({
        queue: [...queue],
        visited: new Set(visited),
        current: current,
        distances: { ...distances },
        action: `Dequeue: Remove node ${current} from front of queue`,
        codeLine: 3,
        phase: "dequeue",
      });

      if (!visited.has(current)) {
        // Step 4: Mark as visited
        visited.add(current);
        steps.push({
          queue: [...queue],
          visited: new Set(visited),
          current: current,
          distances: { ...distances },
          action: `Visit: Mark node ${current} as visited (distance: ${distances[current]})`,
          codeLine: 4,
          phase: "visit",
        });

        // Step 5: Get neighbors
        const unvisitedNeighbors = adjacencyList[current].filter(
          (neighbor) => !visited.has(neighbor) && !queue.includes(neighbor)
        );

        if (unvisitedNeighbors.length > 0) {
          // Step 6: Process neighbors
          unvisitedNeighbors.forEach((neighbor) => {
            queue.push(neighbor);
            if (distances[neighbor] === Infinity) {
              distances[neighbor] = distances[current] + 1;
            }
          });

          steps.push({
            queue: [...queue],
            visited: new Set(visited),
            current: current,
            distances: { ...distances },
            action: `Enqueue: Add neighbors [${unvisitedNeighbors.join(
              ", "
            )}] to queue`,
            codeLine: 5,
            phase: "enqueue",
          });
        } else {
          steps.push({
            queue: [...queue],
            visited: new Set(visited),
            current: current,
            distances: { ...distances },
            action: `No unvisited neighbors for node ${current}`,
            codeLine: 5,
            phase: "no_neighbors",
          });
        }
      }
    }

    // Final step
    steps.push({
      queue: [],
      visited: new Set(visited),
      current: null,
      distances: { ...distances },
      action: "BFS traversal complete - queue is empty",
      codeLine: 6,
      phase: "complete",
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

    // Draw edges first
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;

    // Filter edges to only show one direction for undirected graphs
    const uniqueEdges =
      graphType === "undirected"
        ? edges.filter(
            (edge, index, self) =>
              index ===
              self.findIndex(
                (e) =>
                  (e.from === edge.from && e.to === edge.to) ||
                  (e.from === edge.to && e.to === edge.from)
              )
          )
        : edges;

    uniqueEdges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (fromNode && toNode) {
        // Draw the line
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        // For directed graphs, draw an arrowhead
        if (graphType === "directed") {
          const headLength = 15;
          const angle = Math.atan2(
            toNode.y - fromNode.y,
            toNode.x - fromNode.x
          );

          // Arrowhead lines
          ctx.beginPath();
          ctx.moveTo(toNode.x, toNode.y);
          ctx.lineTo(
            toNode.x - headLength * Math.cos(angle - Math.PI / 6),
            toNode.y - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(toNode.x, toNode.y);
          ctx.lineTo(
            toNode.x - headLength * Math.cos(angle + Math.PI / 6),
            toNode.y - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const isVisited = currentStepData.visited.has(node.id);
      const isCurrent = currentStepData.current === node.id;
      const isInQueue = currentStepData.queue.includes(node.id);
      const distance = currentStepData.distances[node.id] || 0;

      // Node circle with enhanced styling
      ctx.beginPath();
      ctx.arc(node.x, node.y, 28, 0, 2 * Math.PI);

      if (isCurrent) {
        ctx.fillStyle = "#ef4444"; // Red for current node
        ctx.strokeStyle = "#fca5a5";
        ctx.lineWidth = 4;
        // Add pulsing effect for current node
        const pulseRadius = 28 + Math.sin(Date.now() / 200) * 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, 2 * Math.PI);
      } else if (isVisited) {
        ctx.fillStyle = "#10b981"; // Green for visited
        ctx.strokeStyle = "#6ee7b7";
        ctx.lineWidth = 3;
      } else if (isInQueue) {
        ctx.fillStyle = "#3b82f6"; // Blue for queued
        ctx.strokeStyle = "#93c5fd";
        ctx.lineWidth = 3;
      } else {
        ctx.fillStyle = "#4b5563"; // Gray for unvisited
        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 2;
      }

      ctx.fill();
      ctx.stroke();

      // Node label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);

      // Distance label
      if (distance !== Infinity && distance !== undefined) {
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 12px Arial";
        ctx.fillText(`d:${distance}`, node.x, node.y + 45);
      }
    });
  }, [nodes, edges, currentStep, bfsSteps, graphType]);

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
      }, 1100 - animationSpeed * 100); // More responsive speed control
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

  const handleGraphInput = () => {
    try {
      // Validate number of nodes
      if (numNodes < 1 || numNodes > 20) {
        showAlert("Number of nodes must be between 1 and 20");
        return;
      }

      // Parse edges
      const parsedEdges = parseEdgeList(edgeList);

      // Validate edges
      const invalidEdges = parsedEdges.filter(
        (edge) =>
          edge.from >= numNodes ||
          edge.to >= numNodes ||
          edge.from < 0 ||
          edge.to < 0 ||
          edge.from === edge.to
      );

      if (invalidEdges.length > 0) {
        showAlert(
          `Invalid edges found. Node IDs must be between 0 and ${
            numNodes - 1
          }, and nodes cannot connect to themselves.`
        );
        return;
      }

      // Generate node positions
      const newNodes = generateNodePositions(numNodes);

      setNodes(newNodes);
      setEdges(parsedEdges);
      setStartNode(0);
      setStatistics((prev) => ({ ...prev, totalNodes: numNodes }));
      generateBFSSteps(newNodes, parsedEdges, 0);
      setShowGraphInput(false);
      reset();
      showAlert("Graph created successfully!", "success");
    } catch (error) {
      showAlert("Error parsing graph input. Please check your format.");
    }
  };

  const exportGraph = () => {
    const data = {
      nodes: nodes.length,
      edges: edges.map((e) => `${e.from}-${e.to}`).join(", "),
      type: graphType,
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
      
      // Process neighbors
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
    return step.codeLine || 0;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Graph Type Selection Modal */}
      {showGraphTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Graph Type</h2>
              <button
                onClick={() => setShowGraphTypeModal(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-gray-300 mb-4">
                Choose whether your graph edges should be directed or undirected
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setGraphType("undirected");
                    setShowGraphTypeModal(false);
                    setShowGraphInput(true);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    graphType === "undirected"
                      ? "border-green-500 bg-green-500 bg-opacity-10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-medium">Undirected</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Edges go both ways
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setGraphType("directed");
                    setShowGraphTypeModal(false);
                    setShowGraphInput(true);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    graphType === "directed"
                      ? "border-blue-500 bg-blue-500 bg-opacity-10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-medium">Directed</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Edges have direction
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Graph Input Modal */}
      {showGraphInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Custom Graph</h2>
              <button
                onClick={() => setShowGraphInput(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Graph Type:</span>
                <span className="font-medium">
                  {graphType === "directed" ? (
                    <span className="text-blue-400">Directed</span>
                  ) : (
                    <span className="text-green-400">Undirected</span>
                  )}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Nodes (1-20)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numNodes}
                  onChange={(e) => setNumNodes(parseInt(e.target.value) || 1)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Nodes will be numbered 0 to {numNodes - 1}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Edge List (format: 0-1, 1-2, 2-3)
                </label>
                <textarea
                  value={edgeList}
                  onChange={(e) => setEdgeList(e.target.value)}
                  placeholder="0-1, 0-2, 1-3, 1-4, 2-4, 2-5"
                  className="w-full h-24 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm font-mono"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Separate edges with commas. Use format: from-to (e.g., 0-1,
                  2-3)
                </div>
              </div>

              <div className="bg-gray-700 rounded p-3 text-sm">
                <h4 className="font-semibold mb-2">Example:</h4>
                <div className="space-y-1 text-xs text-gray-300">
                  <p>
                    <strong>Nodes:</strong> 5
                  </p>
                  <p>
                    <strong>Edges:</strong> 0-1, 1-2, 2-3, 3-4, 0-4
                  </p>
                  <p>This creates a pentagon with 5 nodes (0,1,2,3,4)</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleGraphInput}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium"
                >
                  Create Graph
                </button>
                <button
                  onClick={() => setShowGraphInput(false)}
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
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Enhanced BFS Visualizer</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Graph:</span>
              <span className="font-mono">
                {graphType === "directed" ? (
                  <span className="text-blue-400">Directed</span>
                ) : (
                  <span className="text-green-400">Undirected</span>
                )}
              </span>
            </div>
            <button
              onClick={() => setShowGraphTypeModal(true)}
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
          className="bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto relative transition-all duration-75"
          style={{ width: `${leftPanelWidth}px` }}
        >
          {/* Resize Handle */}
          <div
            ref={resizeLeftRef}
            className="absolute right-0 top-0 bottom-0 w-2 bg-transparent hover:bg-gray-600 cursor-col-resize flex items-center justify-center transition-colors duration-150"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizingLeft(true);
            }}
          >
            <div className="w-1 h-8 bg-gray-500 rounded-full opacity-50 hover:opacity-100 transition-opacity"></div>
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
                  className="w-full accent-blue-600"
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
                className="border border-gray-700 rounded-lg bg-gray-800 shadow-xl"
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
          className="bg-gray-800 border-l border-gray-700 flex flex-col relative transition-all duration-75"
          style={{ width: `${rightPanelWidth}px` }}
        >
          {/* Resize Handle */}
          <div
            ref={resizeRightRef}
            className="absolute left-0 top-0 bottom-0 w-2 bg-transparent hover:bg-gray-600 cursor-col-resize flex items-center justify-center transition-colors duration-150"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizingRight(true);
            }}
          >
            <div className="w-1 h-8 bg-gray-500 rounded-full opacity-50 hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Source Code
            </h3>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <pre className="text-sm font-mono bg-gray-900 rounded-lg p-4">
              <code className="text-gray-300">
                {bfsCode.split("\n").map((line, index) => (
                  <div
                    key={index}
                    className={`leading-6 ${
                      getCurrentCodeLine() === index + 1
                        ? "bg-cyan-500 bg-opacity-20 text-cyan-300 border-l-2 border-cyan-400 pl-2 -ml-2"
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
                <span>Check if queue is not empty</span>
              </div>
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                    getCurrentCodeLine() === 3 ? "bg-cyan-400" : "bg-gray-600"
                  }`}
                ></div>
                <span>Dequeue the front node from the queue</span>
              </div>
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                    getCurrentCodeLine() === 4 ? "bg-cyan-400" : "bg-gray-600"
                  }`}
                ></div>
                <span>Mark node as visited and process its neighbors</span>
              </div>
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                    getCurrentCodeLine() === 5 ? "bg-cyan-400" : "bg-gray-600"
                  }`}
                ></div>
                <span>
                  Enqueue unvisited neighbors and update their distances
                </span>
              </div>
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                    getCurrentCodeLine() === 6 ? "bg-cyan-400" : "bg-gray-600"
                  }`}
                ></div>
                <span>Complete when queue is empty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Alert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={closeAlert}
      />
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Leave Page?"
        message="Are you sure you want to leave? Any unsaved changes will be lost."
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
      />
    </div>
  );
};

export default BFSVisualizer;
