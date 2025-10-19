import React, { useState, useEffect, useRef } from "react";
import cytoscape from "../../../utils/cytoscapeSetup.js";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";

import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";
import { dfs as dfsCode } from "../../../algorithms/codeExamples.js";

// Remove the Cytoscape extensions registration lines
// cytoscape.use(coseBilkent);
// cytoscape.use(edgehandles);

export default function DFSRecursiveVisualizer() {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();

  // Graph state
  const [numNodes, setNumNodes] = useState(8);
  const [edgeList, setEdgeList] = useState(
    "0-1,0-2,1-3,1-4,2-4,2-5,3-6,4-6,4-7,5-7"
  );
  const [graphType, setGraphType] = useState("undirected");
  const [startNode, setStartNode] = useState("0");

  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(500);

  // UI state
  const [activeRightTab, setActiveRightTab] = useState("stats");
  const [edgeValidationError, setEdgeValidationError] = useState("");
  const [isValidGraph, setIsValidGraph] = useState(false);
  const [currentHighlightedLine, setCurrentHighlightedLine] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error",
    customButtons: null,
  });

  const handleBack = () => {
    setAlertConfig({
      isOpen: true,
      message: "Are you sure you want to leave? Your progress will be lost.",
      type: "warning",
      customButtons: (
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Leave
          </button>
          <button
            onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Stay
          </button>
        </div>
      ),
    });
  };

  // Edge validation
  const validateEdges = (edgeString, nodeCount) => {
    try {
      if (!edgeString.trim()) {
        throw new Error("Please enter some edges");
      }

      const edges = edgeString
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .map(pair => {
          const [fromStr, toStr] = pair.split("-").map(s => s.trim());
          const from = parseInt(fromStr, 10);
          const to = parseInt(toStr, 10);

          if (isNaN(from) || isNaN(to)) {
            throw new Error(`Invalid edge format: "${pair}"`);
          }

          if (from < 0 || to < 0 || from >= nodeCount || to >= nodeCount) {
            throw new Error(
              `Edge "${pair}" contains invalid node indices. Must be between 0 and ${nodeCount - 1}`
            );
          }

          return { from, to };
        });

      setEdgeValidationError("");
      setIsValidGraph(true);

      if (graphType === "undirected") {
        const seen = new Set();
        return edges.filter(e => {
          const key = [Math.min(e.from, e.to), Math.max(e.from, e.to)].join("-");
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
      return edges;

    } catch (error) {
      setEdgeValidationError(error.message);
      setIsValidGraph(false);
      return [];
    }
  };

  // Resize handling
  useEffect(() => {
    const handleResize = () => {
      if (cyInstance.current) {
        cyInstance.current.resize();
        cyInstance.current.fit();
      }
    };

    const debouncedResize = setTimeout(handleResize, 150);
    return () => clearTimeout(debouncedResize);
  }, [isResizing, activeRightTab]);

  useEffect(() => {
    const handleWindowResize = () => {
      if (cyInstance.current) {
        cyInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    handleGenerateGraph();
  }, [graphType]);

  // Recursive DFS step computation
  const computeDFSRecursiveSteps = (nodesCount, edgesArr, start) => {
    // Build adjacency list
    const adj = {};
    for (let i = 0; i < nodesCount; i++) adj[i] = [];
    
    edgesArr.forEach(e => {
      adj[e.from].push(e.to);
      if (graphType === "undirected") {
        adj[e.to].push(e.from);
      }
    });

    const visited = new Set();
    const discovery = {};
    const finish = {};
    const time = { current: 1 };
    const frames = [];
    const callStack = [];
    const treeEdges = [];
    const backEdges = [];

    // Recursive DFS function
    const dfs = (node) => {
      // Entering node
      visited.add(node);
      discovery[node] = time.current++;
      callStack.push(node);
      
      frames.push({
        visited: new Set(visited),
        callStack: [...callStack],
        current: node,
        discovery: { ...discovery },
        finish: { ...finish },
        treeEdges: [...treeEdges],
        backEdges: [...backEdges],
        lineNumber: 2,
        action: `Entering node ${node} (discovery: ${discovery[node]})`
      });

      for (const neighbor of adj[node] || []) {
        if (!visited.has(neighbor)) {
          // Tree edge
          treeEdges.push(`${node}-${neighbor}`);
          
          frames.push({
            visited: new Set(visited),
            callStack: [...callStack],
            current: node,
            discovery: { ...discovery },
            finish: { ...finish },
            treeEdges: [...treeEdges],
            backEdges: [...backEdges],
            lineNumber: 6,
            action: `Found unvisited neighbor ${neighbor} (tree edge)`
          });

          // Recursive call
          frames.push({
            visited: new Set(visited),
            callStack: [...callStack],
            current: node,
            discovery: { ...discovery },
            finish: { ...finish },
            treeEdges: [...treeEdges],
            backEdges: [...backEdges],
            lineNumber: 8,
            action: `Recursing to neighbor ${neighbor}`
          });

          dfs(neighbor);
        } else if (!finish[neighbor]) {
          // Back edge (cycle)
          backEdges.push(`${node}-${neighbor}`);
          
          frames.push({
            visited: new Set(visited),
            callStack: [...callStack],
            current: node,
            discovery: { ...discovery },
            finish: { ...finish },
            treeEdges: [...treeEdges],
            backEdges: [...backEdges],
            lineNumber: 9,
            action: `Found back edge to ${neighbor} (cycle detected)`
          });
        } else {
          frames.push({
            visited: new Set(visited),
            callStack: [...callStack],
            current: node,
            discovery: { ...discovery },
            finish: { ...finish },
            treeEdges: [...treeEdges],
            backEdges: [...backEdges],
            lineNumber: 5,
            action: `Checking neighbor ${neighbor} (already finished)`
          });
        }
      }

      // Exiting node
      finish[node] = time.current++;
      callStack.pop();
      
      frames.push({
        visited: new Set(visited),
        callStack: [...callStack],
        current: callStack.length ? callStack[callStack.length - 1] : null,
        discovery: { ...discovery },
        finish: { ...finish },
        treeEdges: [...treeEdges],
        backEdges: [...backEdges],
        lineNumber: 13,
        action: `Exiting node ${node} (finish: ${finish[node]})`
      });
    };

    // Fix: Ensure start node is parsed as number
    const startNodeNum = parseInt(start);
    callStack.push(startNodeNum);
    frames.push({
      visited: new Set(),
      callStack: [...callStack],
      current: null,
      discovery: {},
      finish: {},
      treeEdges: [],
      backEdges: [],
      lineNumber: 1,
      action: `Starting DFS from node ${start}`
    });

    // Start DFS
    dfs(startNodeNum);

    // Final state
    frames.push({
      visited: new Set(visited),
      callStack: [],
      current: null,
      discovery: { ...discovery },
      finish: { ...finish },
      treeEdges: [...treeEdges],
      backEdges: [...backEdges],
      lineNumber: 14,
      action: "DFS completed"
    });

    setSteps(frames);
    setCurrentStep(0);
    setStarted(false);
  };

  // Generate graph
  const handleGenerateGraph = () => {
    const edges = validateEdges(edgeList, numNodes);
    if (!edges.length || !isValidGraph) return;

    cyInstance.current?.destroy();

    const cy = cytoscape({
      container: cyRef.current,
      elements: {
        nodes: Array.from({ length: numNodes }, (_, i) => ({
          data: { id: `${i}`, label: `${i}` },
        })),
        edges: edges.map((e, idx) => ({
          data: { id: `e${idx}`, source: `${e.from}`, target: `${e.to}` },
        })),
      },
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-color": "#475569",
            "border-width": 3,
            "border-color": "#94a3b8",
            "text-valign": "center",
            "text-halign": "center",
            color: "#ffffff",
            "font-size": "18px",
            "font-weight": "bold",
            width: 50,
            height: 50,
            "text-outline-width": 2,
            "text-outline-color": "#000000",
          },
        },
        {
          selector: "node.visited",
          style: {
            "background-color": "#10b981",
            "border-color": "#34d399",
            "box-shadow": "0 0 20px #10b981",
          },
        },
        {
          selector: "node.current",
          style: {
            "background-color": "#ef4444",
            "border-color": "#f87171",
            width: 60,
            height: 60,
            "box-shadow": "0 0 25px #ef4444",
          },
        },
        {
          selector: "node.inStack",
          style: {
            "background-color": "#3b82f6",
            "border-color": "#60a5fa",
            "box-shadow": "0 0 15px #3b82f6",
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#64748b",
            "curve-style": "bezier",
            "target-arrow-shape": graphType === "directed" ? "triangle" : "triangle",
            "target-arrow-color": "#64748b",
            "arrow-scale": 1.5,
            "source-arrow-shape": graphType === "undirected" ? "triangle" : "none",
            "source-arrow-color": "#64748b",
          },
        },
        {
          selector: "edge.treeEdge",
          style: {
            width: 4,
            "line-color": "#10b981",
            "target-arrow-color": "#10b981",
            "box-shadow": "0 0 10px #10b981",
          },
        },
        {
          selector: "edge.backEdge",
          style: {
            "line-style": "dashed",
            "line-dash-pattern": [5, 5],
            "line-color": "#f59e0b",
            "target-arrow-color": "#f59e0b",
          },
        },
      ],
      layout: {
        name: "cose-bilkent",
        animate: true,
        animationDuration: 800,
        idealEdgeLength: 120,
        nodeOverlap: 30,
      },
      minZoom: 0.3,
      maxZoom: 3,
    });

    cyInstance.current = cy;
    computeDFSRecursiveSteps(numNodes, edges, startNode);
  };

  // Validate edges
  useEffect(() => {
    validateEdges(edgeList, numNodes);
  }, [edgeList, numNodes, graphType]);

  // Update visualization
  useEffect(() => {
    const cy = cyInstance.current;
    if (!cy || !steps.length) return;

    const step = steps[currentStep];
    cy.batch(() => {
      cy.nodes().removeClass("visited inStack current");
      step.visited.forEach(id => cy.$(`#${id}`).addClass("visited"));
      step.callStack.forEach(id => cy.$(`#${id}`).addClass("inStack"));
      if (step.current !== null) cy.$(`#${step.current}`).addClass("current");

      // Highlight tree and back edges
      cy.edges().removeClass("treeEdge backEdge");
      step.treeEdges.forEach(edgeId => {
        const [source, target] = edgeId.split("-");
        cy.edges().filter(e => 
          e.source().id() === source && e.target().id() === target ||
          (graphType === "undirected" && e.source().id() === target && e.target().id() === source)
        ).addClass("treeEdge");
      });
      
      step.backEdges.forEach(edgeId => {
        const [source, target] = edgeId.split("-");
        cy.edges().filter(e => 
          e.source().id() === source && e.target().id() === target ||
          (graphType === "undirected" && e.source().id() === target && e.target().id() === source)
        ).addClass("backEdge");
      });
    });

    setCurrentHighlightedLine(step.lineNumber);
  }, [currentStep, steps]);

  // Animation loop
  useEffect(() => {
    if (!playing) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setPlaying(false);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [playing, currentStep, steps.length, speed]);

  // UI Components
  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveRightTab(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeRightTab === id
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
      blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
      green: "from-green-500/20 to-green-600/20 border-green-500/30",
      yellow: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
      red: "from-red-500/20 to-red-600/20 border-red-500/30",
      purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 backdrop-blur-sm`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${color}-500/20`}>
            <Icon size={20} className={`text-${color}-400`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-2xl font-bold text-white truncate">{value}</div>
            <div className="text-sm text-gray-300">{label}</div>
          </div>
        </div>
      </div>
    );
  };

  // Calculate progress value
  const getProgressValue = () => {
    if (!started || !steps.length) return "Nil";
    return `${Math.round(((currentStep + 1) / steps.length) * 100)}%`;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/20 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-800/80 backdrop-blur-lg border-b border-gray-700/50 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              DFS Recursive Visualizer
            </h1>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-gray-700/50 rounded-lg backdrop-blur-sm">
            <span className="text-sm text-gray-400">Graph Type:</span>
            <span className="text-sm font-semibold text-blue-400 capitalize">
              {graphType}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content with Resizable Panels */}
      <div className="pt-16 h-full">
        <PanelGroup 
          direction="horizontal" 
          onLayout={(sizes) => {
            setIsResizing(false);
            setTimeout(() => {
              if (cyInstance.current) {
                cyInstance.current.resize();
                cyInstance.current.fit();
              }
            }, 100);
          }}
        >
          {/* Left Panel - Settings */}
          <Panel 
            defaultSize={25} 
            minSize={15} 
            maxSize={40}
            onResize={() => setIsResizing(true)}
          >
            <div className="h-full bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-blue-400" />
                  <h2 className="text-lg font-semibold text-gray-200">Graph Settings</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Graph Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Graph Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["undirected", "directed"].map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          // Stop and reset animation if graph type changes during playback
                          if (graphType !== type) {
                          setPlaying(false);
                          setStarted(false);
                          setCurrentStep(0);
                          }
                          setGraphType(type);
                        }}
                        className={`py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${graphType === type
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                          }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Nodes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Number of Nodes
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="20"
                    value={numNodes}
                    onChange={e => setNumNodes(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Edges */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Edges (format: 0-1,1-2,2-3)
                  </label>
                  <textarea
                    rows={3}
                    value={edgeList}
                    onChange={e => setEdgeList(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="0-1,1-2,2-3..."
                  />
                  {edgeValidationError && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                      <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0" />
                      <span className="text-xs text-yellow-300">{edgeValidationError}</span>
                    </div>
                  )}
                </div>

                {/* Start Node */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Start Node
                  </label>
                  <select
                    value={startNode}
                    onChange={e => setStartNode(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Array.from({ length: numNodes }, (_, i) => (
                      <option key={i} value={`${i}`} className="bg-gray-700">
                        Node {i}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateGraph}
                  disabled={!isValidGraph}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg transform ${isValidGraph
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  Generate Graph
                </button>

                {/* Controls Section */}
                <div className="pt-4 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Playback Controls
                  </h3>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      onClick={() => {
                        if (!steps.length) return;
                        setStarted(true);
                        setPlaying(!playing);
                      }}
                      disabled={steps.length === 0}
                      className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-200 shadow-lg text-sm"
                    >
                      {playing ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      onClick={() =>
                        setCurrentStep(
                          Math.min(currentStep + 1, steps.length - 1)
                        )
                      }
                      disabled={currentStep >= steps.length - 1}
                      className="flex items-center justify-center py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-200 shadow-lg text-sm"
                    >
                      <SkipForward size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setPlaying(false);
                        setCurrentStep(0);
                        setStarted(false);
                      }}
                      className="flex items-center justify-center py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-medium transition-all duration-200 shadow-lg text-sm"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-gray-200">
                        Animation Speed
                      </label>
                      <span className="text-sm text-gray-400">{speed}ms</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={2000}
                      step={100}
                      value={speed}
                      onChange={e => setSpeed(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Fast</span>
                      <span>Slow</span>
                    </div>
                  </div>
                </div>

                {/* Recursive DFS Legend */}
                <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30 mt-4">
                  <h4 className="font-semibold text-gray-200 mb-3">
                    DFS Color Legend
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        color: "bg-gray-500",
                        label: "Unvisited nodes",
                        textColor: "text-gray-300",
                      },
                      {
                        color: "bg-blue-500",
                        label: "Nodes in call stack",
                        textColor: "text-blue-300",
                      },
                      {
                        color: "bg-red-500",
                        label: "Current node being processed",
                        textColor: "text-red-300",
                      },
                      {
                        color: "bg-green-500",
                        label: "Visited nodes",
                        textColor: "text-green-300",
                      },
                      {
                        color: "bg-green-500",
                        label: "Tree edges (DFS path)",
                        textColor: "text-green-300",
                      },
                      {
                        color: "bg-yellow-500",
                        label: "Back edges (non-tree)",
                        textColor: "text-yellow-300",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 ${item.color} rounded-full shadow-lg`}
                        ></div>
                        <span className={`text-sm ${item.textColor}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* Left Resize Handle */}
          <PanelResizeHandle 
            className="w-1 bg-gray-700 hover:bg-gray-600 cursor-col-resize transition-colors" 
            onDragging={(isDragging) => {
              setIsResizing(isDragging);
              if (!isDragging && cyInstance.current) {
                setTimeout(() => cyInstance.current.resize(), 50);
              }
            }} 
          />

          {/* Center Canvas Panel */}
          <Panel minSize={40} maxSize={70}>
            <div className="h-full p-4 overflow-hidden">
              <div
                ref={cyRef}
                className="w-full h-full bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl"
                style={{ minWidth: 0, minHeight: 0 }}
              />
            </div>
          </Panel>

          {/* Right Resize Handle */}
          <PanelResizeHandle 
            className="w-1 bg-gray-700 hover:bg-gray-600 cursor-col-resize transition-colors" 
            onDragging={(isDragging) => {
              setIsResizing(isDragging);
              if (!isDragging && cyInstance.current) {
                setTimeout(() => cyInstance.current.resize(), 50);
              }
            }} 
          />

          {/* Right Panel - Statistics & Algorithm */}
          <Panel 
            defaultSize={25} 
            minSize={15} 
            maxSize={45}
            onResize={() => setIsResizing(true)}
          >
            <div className="h-full bg-gray-800/50 backdrop-blur-xl border-l border-gray-700/50 flex flex-col">
              {/* Tab Navigation */}
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex flex-col gap-2">
                  <TabButton
                    id="stats"
                    icon={BarChart3}
                    label="Statistics & Info"
                  />
                  <TabButton
                    id="algorithm"
                    icon={Code2}
                    label="Algorithm Code"
                  />
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeRightTab === "stats" && (
                  <div className="space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <StatCard
                        icon={Target}
                        value={
                          steps[currentStep]
                            ? [...steps[currentStep].visited].length
                            : 0
                        }
                        label="Visited"
                        color="green"
                      />
                      <StatCard
                        icon={Activity}
                        value={
                          steps[currentStep] ? steps[currentStep].callStack.length : 0
                        }
                        label="Call Stack Size"
                        color="blue"
                      />
                      <StatCard
                        icon={Maximize2}
                        value={numNodes}
                        label="Total Nodes"
                        color="yellow"
                      />
                      <StatCard
                        icon={Clock}
                        value={getProgressValue()}
                        label="Progress"
                        color="red"
                      />
                    </div>

                    {/* Step Info */}
                    <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30">
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">
                        Current Step
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Step:</span>
                          <span className="font-mono text-blue-400">
                            {currentStep + 1} / {steps.length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        {steps[currentStep] && (
                          <div className="text-sm text-gray-400 mt-2">
                            {steps[currentStep].action}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Discovery/Finish Times */}
                    <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30">
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">
                        Node Timing Information
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: numNodes }, (_, i) => {
                          const discovery = steps[currentStep]?.discovery[i] || "";
                          const finish = steps[currentStep]?.finish[i] || "";
                          
                          return (
                            <div
                              key={i}
                              className={`flex flex-col items-center justify-center rounded-lg p-2 text-center ${
                                steps[currentStep]?.current == i 
                                  ? "bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30"
                                  : steps[currentStep]?.callStack.includes(i)
                                  ? "bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30"
                                  : steps[currentStep]?.visited.has(i)
                                  ? "bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30"
                                  : "bg-gray-600/50"
                              }`}
                            >
                              <div className="text-gray-300 text-sm font-semibold">Node {i}</div>
                              <div className="flex gap-1 text-xs">
                                {discovery && (
                                  <div className="text-green-400">D: {discovery}</div>
                                )}
                                {finish && (
                                  <div className="text-purple-400">F: {finish}</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Call Stack Visualization */}
                    {steps[currentStep] && (
                      <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30">
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">
                          Call Stack Visualization
                        </h3>
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-400 mb-2">
                            Current stack depth: {steps[currentStep].callStack.length}
                          </div>
                          
                          <div className="flex flex-col-reverse space-y-reverse space-y-1 max-h-60 overflow-y-auto p-2 bg-gray-800/50 rounded-lg">
                            {steps[currentStep].callStack.map((node, index) => (
                              <div 
                                key={index} 
                                className={`p-3 rounded-lg ${
                                  index === steps[currentStep].callStack.length - 1 
                                    ? "bg-gradient-to-r from-red-600/30 to-red-700/30 border border-red-500/30" 
                                    : "bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-500/20"
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${
                                      index === steps[currentStep].callStack.length - 1 
                                        ? "bg-red-500" 
                                        : "bg-blue-500"
                                    }`}></div>
                                    <span className="font-mono font-bold">Node {node}</span>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Depth: {steps[currentStep].callStack.length - index}
                                  </div>
                                </div>
                                
                                {steps[currentStep].discovery[node] && (
                                  <div className="mt-2 text-xs flex justify-between">
                                    <span className="text-green-400">D: {steps[currentStep].discovery[node]}</span>
                                    <span className="text-purple-400">F: {steps[currentStep].finish[node] || "?"}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                            
                            {steps[currentStep].callStack.length === 0 && (
                              <div className="text-center py-4 text-gray-500">
                                Call stack is empty
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeRightTab === "algorithm" && (
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 overflow-hidden">
                      <div className="flex items-center gap-2 p-3 border-b border-gray-600/30">
                        <Code2 size={18} className="text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-200">
                          Recursive DFS Implementation
                        </h3>
                      </div>
                      <div className="relative">
                        <BasicCodeDisplay
                          cppCode={dfsCode.cpp}
                          pythonCode={dfsCode.python}
                          jsCode={dfsCode.javascript}
                          highlightedLine={currentHighlightedLine}
                          className="min-h-[300px]"
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Recursive DFS Properties
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Time Complexity:</span>
                          <span className="font-mono text-green-400">O(V + E)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Space Complexity:</span>
                          <span className="font-mono text-blue-400">O(V)</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          V = vertices, E = edges. Space complexity comes from the call stack depth.
                        </div>
                        <div className="mt-3 text-gray-300">
                          <span className="font-semibold text-purple-300">Tree Edges:</span> 
                          <span> Edges that are part of the DFS tree</span>
                        </div>
                        <div className="text-gray-300">
                          <span className="font-semibold text-yellow-300">Back Edges:</span> 
                          <span> Edges to ancestors in the DFS tree (indicate cycles)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      <Alert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        customButtons={alertConfig.customButtons}
      />
      
      <style jsx>{`
        @keyframes pulse {
          0% { background-color: rgba(245, 158, 11, 0.2); }
          50% { background-color: rgba(245, 158, 11, 0.1); }
          100% { background-color: rgba(245, 158, 11, 0.2); }
        }
      `}</style>
    </div>
  );
}