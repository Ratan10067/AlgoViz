import React, { useState, useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
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
  ArrowLeft,
  Maximize2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";

// Register Cytoscape extensions
cytoscape.use(coseBilkent);

export default function DijkstraVisualizer() {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);
  const navigate = useNavigate();
  const [numNodes, setNumNodes] = useState(5);
  const [edgeList, setEdgeList] = useState(
    "0-1:4,0-2:1,1-3:1,2-1:2,2-3:5,3-4:3"
  );
  const [startNode, setStartNode] = useState("0");
  const [endNode, setEndNode] = useState("4");
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
        <div className="flex space-x-4 justify-center">
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

  // Parse edges into from/to/weight
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
          const [nodes, weightStr] = pair.split(":");
          const [from, to] = nodes.split("-").map((x) => {
            const num = parseInt(x.trim());
            if (isNaN(num)) {
              throw new Error(`Invalid number format in edge: ${pair}`);
            }
            return num;
          });

          const weight = parseFloat(weightStr);
          if (isNaN(weight)) {
            throw new Error(`Invalid weight format in edge: ${pair}`);
          }

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

          return { from, to, weight };
        });

      return edges;
    } catch (error) {
      showAlert(error.message);
      return null;
    }
  };

  // Compute Dijkstra's steps
  const computeDijkstraSteps = (nodesCount, edgesArr, start, end) => {
    // Build adjacency list
    const adj = {};
    for (let i = 0; i < nodesCount; i++) adj[i] = [];
    edgesArr.forEach((e) => adj[e.from].push({ node: e.to, weight: e.weight }));

    // Initialize distances
    const distances = {};
    const previous = {};
    const visited = new Set();
    const unvisited = new Set();

    for (let i = 0; i < nodesCount; i++) {
      distances[i] = i === start ? 0 : Infinity;
      previous[i] = null;
      unvisited.add(i);
    }

    const steps = [];

    // Initial state
    steps.push({
      current: null,
      visited: new Set(),
      distances: { ...distances },
      previous: { ...previous },
      queue: Array.from(unvisited).sort((a, b) => distances[a] - distances[b]),
      path: [],
      description:
        "Initialization - All nodes set to distance ∞ except start node (0)",
    });

    while (unvisited.size > 0) {
      // Find node with smallest distance
      let current = null;
      let smallestDistance = Infinity;

      unvisited.forEach((node) => {
        if (distances[node] < smallestDistance) {
          smallestDistance = distances[node];
          current = node;
        }
      });

      if (current === null || distances[current] === Infinity) {
        break; // No more reachable nodes
      }

      // Mark as visited
      unvisited.delete(current);
      visited.add(current);

      steps.push({
        current,
        visited: new Set(visited),
        distances: { ...distances },
        previous: { ...previous },
        queue: Array.from(unvisited).sort(
          (a, b) => distances[a] - distances[b]
        ),
        path: [],
        description: `Visiting node ${current} (current distance: ${distances[current]})`,
      });

      // Check if we've reached the end node
      if (current === end) {
        // Reconstruct path
        const path = [];
        let node = end;
        while (node !== null) {
          path.unshift(node);
          node = previous[node];
        }

        steps.push({
          current,
          visited: new Set(visited),
          distances: { ...distances },
          previous: { ...previous },
          queue: Array.from(unvisited).sort(
            (a, b) => distances[a] - distances[b]
          ),
          path: [...path],
          description: `Found shortest path to node ${end} with distance ${distances[end]}`,
        });

        break;
      }

      // Update neighbors
      adj[current].forEach(({ node: neighbor, weight }) => {
        if (!visited.has(neighbor)) {
          const alt = distances[current] + weight;
          if (alt < distances[neighbor]) {
            distances[neighbor] = alt;
            previous[neighbor] = current;

            steps.push({
              current,
              visited: new Set(visited),
              distances: { ...distances },
              previous: { ...previous },
              queue: Array.from(unvisited).sort(
                (a, b) => distances[a] - distances[b]
              ),
              path: [],
              description: `Updating node ${neighbor} (new distance: ${alt})`,
            });
          }
        }
      });
    }

    // Final state
    steps.push({
      current: null,
      visited: new Set(visited),
      distances: { ...distances },
      previous: { ...previous },
      queue: [],
      path: [],
      description: "Algorithm complete",
    });

    setSteps(steps);
    setCurrentStep(0);
  };

  // Initialize Cytoscape graph
  const initializeGraph = () => {
    if (!cyRef.current) return;

    const validEdges = parseEdges();
    if (validEdges === null) return;

    if (validEdges.length === 0) {
      showAlert("Please add valid edges in the format: 0-1:4,1-2:2,2-3:5");
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
            distance: i === parseInt(startNode) ? "0" : "∞",
            number: i.toString(),
          },
        })),
        edges: validEdges.map((e, idx) => ({
          data: {
            id: `e${idx}`,
            source: e.from.toString(),
            target: e.to.toString(),
            weight: e.weight,
          },
        })),
      },
      style: [
        {
          selector: "node",
          style: {
            label: "data(number)",
            "text-valign": "center",
            "text-halign": "center",
            "text-valign": "center",
            "text-halign": "center",
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
            width: 60,
            height: 60,
            "box-shadow": "0 0 25px #ef4444",
          },
        },
        {
          selector: "node.path",
          style: {
            "background-color": "#f59e0b",
            "border-color": "#fbbf24",
            "box-shadow": "0 0 20px #f59e0b",
          },
        },
        {
          selector: "node::after",
          style: {
            color: "#fbbf24",
            "text-valign": "bottom",
            "text-margin-y": 10,
            "font-size": "14px",
            "font-weight": "bold",
            "text-outline-color": "#000",
            "text-outline-width": "2px",
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#64748b",
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#64748b",
            "arrow-scale": 1.5,
            label: "data(weight)",
            "text-outline-color": "#000",
            "text-outline-width": "2px",
            color: "#ffffff",
            "font-size": "14px",
            "font-weight": "bold",
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
        {
          selector: "edge.path",
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
    computeDijkstraSteps(
      numNodes,
      validEdges,
      parseInt(startNode),
      parseInt(endNode)
    );
  };

  // Update viz per step
  useEffect(() => {
    const cy = cyInstance.current;
    if (!cy || !steps.length) return;
    const s = steps[currentStep];

    cy.batch(() => {
      // Reset all styles
      cy.nodes().removeClass("visited current path");
      cy.edges().removeClass("highlighted path");

      // Apply current step styles
      s.visited.forEach((id) => cy.$(`#${id}`).addClass("visited"));
      if (s.current !== null) cy.$(`#${s.current}`).addClass("current");

      // Update node distances
      cy.nodes().forEach((n) => {
        const dist = s.distances[n.id()];
        n.data("distance", dist === Infinity ? "∞" : dist.toString());
      });

      // Highlight path if exists
      if (s.path.length > 0) {
        s.path.forEach((nodeId) => cy.$(`#${nodeId}`).addClass("path"));

        // Highlight edges in path
        for (let i = 0; i < s.path.length - 1; i++) {
          const source = s.path[i];
          const target = s.path[i + 1];
          cy.$(`edge[source="${source}"][target="${target}"]`).addClass("path");
          cy.$(`edge[source="${target}"][target="${source}"]`).addClass("path");
        }
      }

      // Highlight edges from current node
      if (s.current !== null) {
        cy.$(
          `edge[source="${s.current}"], edge[target="${s.current}"]`
        ).addClass("highlighted");
      }
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
              Dijkstra's Algorithm Visualizer
            </h1>
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
                  Edges (format: 0-1:4,1-2:2,2-3:5)
                </label>
                <textarea
                  rows={4}
                  value={edgeList}
                  onChange={(e) => setEdgeList(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="0-1:4,1-2:2,2-3:5..."
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

              {/* End Node */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200">
                  Target Node
                </label>
                <select
                  value={endNode}
                  onChange={(e) => setEndNode(e.target.value)}
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
                    Dijkstra's Implementation
                  </h3>
                </div>
                <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
                  {`function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const unvisited = new Set();
  
  // Initialize distances
  for (const node in graph) {
    distances[node] = node === start ? 0 : Infinity;
    previous[node] = null;
    unvisited.add(node);
  }

  while (unvisited.size > 0) {
    // Find node with smallest distance
    let current = null;
    let smallestDistance = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < smallestDistance) {
        smallestDistance = distances[node];
        current = node;
      }
    }

    if (current === null || distances[current] === Infinity) break;

    // Mark as visited
    unvisited.delete(current);
    visited.add(current);

    // Check if we've reached the end node
    if (current === end) break;

    // Update neighbors
    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor.node)) {
        const alt = distances[current] + neighbor.weight;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          previous[neighbor.node] = current;
        }
      }
    }
  }

  // Reconstruct path
  const path = [];
  let node = end;
  while (node !== null) {
    path.unshift(node);
    node = previous[node];
  }

  return {
    distance: distances[end],
    path: path.length > 1 ? path : null
  };
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
                      color: "bg-green-500",
                      label: "Visited nodes",
                      textColor: "text-green-300",
                    },
                    {
                      color: "bg-red-500",
                      label: "Current node being processed",
                      textColor: "text-red-300",
                    },
                    {
                      color: "bg-yellow-500",
                      label: "Nodes in shortest path",
                      textColor: "text-yellow-300",
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
                    <span className="font-mono text-green-400">O(V²)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">With Priority Queue:</span>
                    <span className="font-mono text-blue-400">
                      O(E + V log V)
                    </span>
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
      <div className="w-80 bg-gray-800/50 backdrop-blur-xl border-l border-gray-700/50 flex flex-col mt-16 overflow-y-auto">
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
              value={steps[currentStep]?.visited?.size || 0}
              label="Visited"
              color="green"
            />
            <StatCard
              icon={Activity}
              value={steps[currentStep]?.queue?.length || 0}
              label="Unvisited"
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
                Math.round(((currentStep + 1) / (steps.length || 1)) * 100) || 0
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
                  {currentStep + 1} / {steps.length || 1}
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentStep + 1) / (steps.length || 1)) * 100
                    }%`,
                  }}
                />
              </div>
              {steps[currentStep]?.description && (
                <div className="text-sm text-gray-300 mt-2">
                  {steps[currentStep].description}
                </div>
              )}
            </div>
          </div>

          {/* Distance Array */}
          <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Distance Array
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: numNodes }, (_, i) => {
                const dist = steps[currentStep]?.distances?.[i] ?? Infinity;
                return (
                  <div
                    key={i}
                    className={`flex justify-between rounded-lg px-3 py-2 ${
                      i === parseInt(startNode)
                        ? "bg-blue-500/20"
                        : i === parseInt(endNode)
                        ? "bg-purple-500/20"
                        : "bg-gray-600/50"
                    }`}
                  >
                    <span className="text-gray-300 font-mono">{i}:</span>
                    <span className="text-yellow-400 font-mono font-bold">
                      {dist === Infinity ? "∞" : dist}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Path Info */}
          {steps[currentStep]?.path?.length > 0 && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-semibold text-yellow-400">
                  Shortest Path Found
                </span>
              </div>
              <div className="font-mono text-yellow-300">
                {steps[currentStep].path.join(" → ")}
              </div>
              <div className="mt-2 text-sm">
                Total distance:{" "}
                <span className="font-bold">
                  {steps[currentStep].distances[endNode]}
                </span>
              </div>
            </div>
          )}

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
                  {steps[currentStep].visited?.size
                    ? [...steps[currentStep].visited].join(", ")
                    : "None"}
                </span>
              </div>

              {steps[currentStep].queue?.length > 0 && (
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-blue-400">
                      Unvisited Nodes
                    </span>
                  </div>
                  <span className="font-mono text-blue-300">
                    {steps[currentStep].queue.join(", ")}
                  </span>
                </div>
              )}

              {steps[currentStep].current !== null && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-red-400">
                      Current Node
                    </span>
                  </div>
                  <span className="font-mono text-red-300">
                    {steps[currentStep].current}
                  </span>
                </div>
              )}
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
