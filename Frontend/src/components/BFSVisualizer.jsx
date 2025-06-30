import React, { useState, useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import edgehandles from "cytoscape-edgehandles";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Settings,
  BarChart3,
  Code2,
  Zap,
  Activity,
  Target,
  Clock,
  Upload,
  Download,
  Maximize2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";

// Register Cytoscape extensions
cytoscape.use(coseBilkent);
cytoscape.use(edgehandles);

export default function EnhancedBFSVisualizer() {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);
  const navigate = useNavigate();
  const [numNodes, setNumNodes] = useState(8);
  const [edgeList, setEdgeList] = useState(
    "0-1,0-2,1-3,1-4,2-4,2-5,3-6,4-6,4-7,5-7"
  );
  const [graphType, setGraphType] = useState("undirected");
  const [startNode, setStartNode] = useState("0");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [activeTab, setActiveTab] = useState("settings");
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error",
  });

  const handleBack = () => {
    setAlertConfig({
      isOpen: true,
      message: "Are you sure you want to leave? Your progress will be lost.",
      type: "warning",
      customButtons: (
        <div className="flex space-x-4 justify-center ">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Leave
          </button>
          <button
            onClick={closeAlert}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Stay
          </button>
        </div>
      ),
    });
  };

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

  // Parse edges into from/to
  const parseEdges = () => {
    try {
      if (!edgeList.trim()) {
        return [];
      }

      const edges = edgeList
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((pair) => {
          const [from, to] = pair.split("-").map((x) => {
            const num = parseInt(x.trim());
            if (isNaN(num)) {
              throw new Error(`Invalid number format in edge: ${pair}`);
            }
            return num;
          });

          if (from === undefined || to === undefined) {
            throw new Error(`Invalid edge format: ${pair}`);
          }

          if (from >= numNodes || to >= numNodes || from < 0 || to < 0) {
            throw new Error(
              `Edge ${from}-${to} contains invalid node indices. Must be between 0 and ${
                numNodes - 1
              }`
            );
          }

          return { from, to };
        });

      const finalEdges = edges.flatMap((edge) => {
        if (graphType === "undirected") {
          return [edge];
        }
        return [edge];
      });

      return finalEdges;
    } catch (error) {
      showAlert(error.message);
      return null; // Return null to indicate error
    }
  };

  // Compute BFS steps
  const computeBFSSteps = (nodesCount, edgesArr, start) => {
    const adj = {};
    for (let i = 0; i < nodesCount; i++) adj[i] = [];
    edgesArr.forEach((e) => adj[e.from].push(e.to));
    const visited = new Set();
    const queue = [start];
    const dist = { [start]: 0 };
    const out = [];
    out.push({
      visited: new Set(),
      queue: [...queue],
      current: null,
      distances: { ...dist },
    });
    while (queue.length) {
      const cur = queue.shift();
      out.push({
        visited: new Set(visited),
        queue: [...queue],
        current: cur,
        distances: { ...dist },
      });
      if (!visited.has(cur)) {
        visited.add(cur);
        adj[cur].forEach((nbr) => {
          if (!visited.has(nbr) && !queue.includes(nbr)) {
            dist[nbr] = dist[cur] + 1;
            queue.push(nbr);
          }
        });
        out.push({
          visited: new Set(visited),
          queue: [...queue],
          current: cur,
          distances: { ...dist },
        });
      }
    }
    out.push({
      visited: new Set(visited),
      queue: [],
      current: null,
      distances: { ...dist },
    });
    setSteps(out);
    setCurrentStep(0);
  };

  // Initialize Cytoscape graph
  const initializeGraph = () => {
    if (!cyRef.current) return;

    const validEdges = parseEdges();
    if (validEdges === null) return; // Validation failed

    if (validEdges.length === 0) {
      showAlert("Please add valid edges in the format: 0-1,1-2,2-3");
      return;
    }

    cyInstance.current?.destroy();

    const cy = cytoscape({
      container: cyRef.current,
      elements: {
        nodes: Array.from({ length: numNodes }, (_, i) => ({
          data: {
            id: i.toString(),
            label: i.toString(),
            number: i.toString(),
            distance: "∞",
          },
        })),
        edges: validEdges.map((e, idx) => ({
          data: {
            id: `e${idx}`,
            source: e.from.toString(),
            target: e.to.toString(),
          },
        })),
      },
      style: [
        {
          selector: "node",
          style: {
            label: "data(number)", // ← show the index
            "text-valign": "center", // ← center vertically
            "text-halign": "center", // ← center horizontally
            "text-margin-y": 0,
            "background-color": "#475569",
            "border-width": 3,
            "border-color": "#94a3b8",
            "text-valign": "center",
            "text-halign": "center",
            color: "#ffffff",
            "font-size": "16px",
            "font-weight": "bold",
            width: 25,
            height: 25,
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
            width: 55,
            height: 55,
            "box-shadow": "0 0 25px #ef4444",
          },
        },
        {
          selector: "node.queued",
          style: {
            "background-color": "#3b82f6",
            "border-color": "#60a5fa",
            "box-shadow": "0 0 15px #3b82f6",
          },
        },
        {
          selector: "node::after",
          style: {
            color: "#fbbf24",
            "text-valign": "bottom",
            "text-margin-y": 15,
            "font-size": "14px",
            "font-weight": "bold",
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#64748b",
            "curve-style": "bezier",
            "target-arrow-shape":
              graphType === "directed" ? "triangle" : "none",
            "target-arrow-color": "#64748b",
            "arrow-scale": 1.5,
          },
        },
        {
          selector: "edge.highlighted",
          style: {
            width: 5,
            "line-color": "#f59e0b",
            "target-arrow-color": "#f59e0b",
            "box-shadow": "0 0 10px #f59e0b",
          },
        },
      ],
      layout: {
        name: "cose-bilkent",
        animate: true,
        animationDuration: 800,
        idealEdgeLength: 100,
        nodeOverlap: 20,
      },
      minZoom: 0.3,
      maxZoom: 3,
    });

    cyInstance.current = cy;
    computeBFSSteps(numNodes, validEdges, parseInt(startNode));
  };

  // Update viz per step
  useEffect(() => {
    const cy = cyInstance.current;
    if (!cy || !steps.length) return;
    const s = steps[currentStep];
    cy.batch(() => {
      cy.nodes().removeClass("visited queued current");
      s.visited.forEach((id) => cy.$(`#${id}`).addClass("visited"));
      s.queue.forEach((id) => cy.$(`#${id}`).addClass("queued"));
      if (s.current !== null) cy.$(`#${s.current}`).addClass("current");
      cy.nodes().forEach((n) => n.data("distance", s.distances[n.id()] ?? "∞"));
      cy.edges().removeClass("highlighted");
      if (s.current !== null)
        cy.$(
          `edge[source="${s.current}"], edge[target="${s.current}"]`
        ).addClass("highlighted");
    });
  }, [currentStep, steps]);

  // Animation
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (currentStep < steps.length - 1) setCurrentStep((cs) => cs + 1);
      else setPlaying(false);
    }, speed);
    return () => clearTimeout(t);
  }, [playing, currentStep, steps, speed]);

  const handleGenerateGraph = () => {
    initializeGraph();
  };

  const TabButton = ({ id, icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
        isActive
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
    };

    return (
      <div
        className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 backdrop-blur-sm`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${color}-500/20`}>
            <Icon size={20} className={`text-${color}-400`} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-gray-300">{label}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/20 text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gray-800/80 backdrop-blur-lg border-b border-gray-700/50 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-2">
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
              BFS Algorithm Visualizer
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

      {/* Left Sidebar - Settings and Algorithm */}
      <div className="w-96 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col mt-16">
        {/* Tab Navigation */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex flex-col gap-2">
            <TabButton
              id="settings"
              icon={Settings}
              label="Graph Settings"
              isActive={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
            <TabButton
              id="algorithm"
              icon={Code2}
              label="Algorithm Code"
              isActive={activeTab === "algorithm"}
              onClick={() => setActiveTab("algorithm")}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Graph Type */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  Graph Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGraphType("undirected")}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                      graphType === "undirected"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                  >
                    Undirected
                  </button>
                  <button
                    onClick={() => setGraphType("directed")}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                      graphType === "directed"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                  >
                    Directed
                  </button>
                </div>
              </div>

              {/* Number of Nodes */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200">
                  Number of Nodes
                </label>
                <input
                  type="text"
                  value={numNodes}
                  onChange={(e) => setNumNodes(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Edges */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200">
                  Edges (format: 0-1,1-2,2-3)
                </label>
                <textarea
                  rows={4}
                  value={edgeList}
                  onChange={(e) => setEdgeList(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="0-1,1-2,2-3..."
                />
              </div>

              {/* Start Node */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200">
                  Start Node
                </label>
                <select
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl font-semibold transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                Generate Graph
              </button>

              {/* Controls Section */}
              <div className="pt-6 border-t border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  Playback Controls
                </h3>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => setPlaying(!playing)}
                    disabled={steps.length === 0}
                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-200 shadow-lg"
                  >
                    {playing ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    onClick={() =>
                      setCurrentStep(
                        Math.min(currentStep + 1, steps.length - 1)
                      )
                    }
                    disabled={currentStep >= steps.length - 1}
                    className="flex items-center justify-center py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-200 shadow-lg"
                  >
                    <SkipForward size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setPlaying(false);
                      setCurrentStep(0);
                    }}
                    className="flex items-center justify-center py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-medium transition-all duration-200 shadow-lg"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>

                <div className="space-y-3">
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
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Fast</span>
                    <span>Slow</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "algorithm" && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 size={20} className="text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-200">
                    BFS Implementation
                  </h3>
                </div>
                <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                  {`function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const distances = { [start]: 0 };

  while (queue.length > 0) {
    const current = queue.shift();

    if (!visited.has(current)) {
      visited.add(current);

      for (const neighbor of graph[current]) {
        if (!visited.has(neighbor) && 
            !queue.includes(neighbor)) {
          queue.push(neighbor);
          distances[neighbor] = distances[current] + 1;
        }
      }
    }
  }

  return distances;
}`}
                </pre>
              </div>

              <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30">
                <h4 className="font-semibold text-gray-200 mb-4">
                  Color Legend
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      color: "bg-gray-500",
                      label: "Unvisited nodes",
                      textColor: "text-gray-300",
                    },
                    {
                      color: "bg-blue-500",
                      label: "Nodes in queue",
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
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 ${item.color} rounded-full shadow-lg`}
                      ></div>
                      <span className={`text-sm ${item.textColor}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-gray-200 mb-3">
                  Algorithm Complexity
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
                  <div className="text-xs text-gray-400 mt-3">
                    V = number of vertices, E = number of edges
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 p-6 mt-16">
        <div
          ref={cyRef}
          className="w-full h-full bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl"
        />
      </div>

      {/* Right Sidebar - Statistics & Info */}
      <div className="w-90 bg-gray-800/50 backdrop-blur-xl border-l border-gray-700/50 flex flex-col mt-16 overflow-y-auto">
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 size={18} />
            Statistics & Info
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={Target}
              value={
                steps[currentStep] ? [...steps[currentStep].visited].length : 0
              }
              label="Visited"
              color="green"
            />
            <StatCard
              icon={Activity}
              value={steps[currentStep] ? steps[currentStep].queue.length : 0}
              label="In Queue"
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
              value={`${
                Math.round(((currentStep + 1) / steps.length) * 100) || 0
              }%`}
              label="Progress"
              color="red"
            />
          </div>

          {/* Step Info */}
          <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Current Step
            </h3>
            <div className="space-y-3">
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
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Distance Array */}
          <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Distance Array
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: numNodes }, (_, i) => {
                const distance = steps[currentStep]?.distances[i] ?? "∞";
                return (
                  <div
                    key={i}
                    className="flex justify-between bg-gray-600/50 rounded-lg px-3 py-2"
                  >
                    <span className="text-gray-300 font-mono">{i}:</span>
                    <span className="text-yellow-400 font-mono font-bold">
                      {distance}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current State */}
          {steps[currentStep] && (
            <div className="space-y-4">
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-green-400">
                    Visited Nodes
                  </span>
                </div>
                <span className="font-mono text-green-300">
                  {[...steps[currentStep].visited].join(", ") || "None"}
                </span>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-400">
                    Queue
                  </span>
                </div>
                <span className="font-mono text-blue-300">
                  {steps[currentStep].queue.join(", ") || "Empty"}
                </span>
              </div>

              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-red-400">
                    Current Node
                  </span>
                </div>
                <span className="font-mono text-red-300">
                  {steps[currentStep].current || "None"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Alert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={closeAlert}
        customButtons={alertConfig.customButtons}
      />
    </div>
  );
}
