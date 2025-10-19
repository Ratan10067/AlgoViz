import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  GitBranch, RouteIcon, MapPin, Zap, Navigation
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const hamiltonianPathCode = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

class HamiltonianPath {
private:
    vector<vector<int>> graph;
    vector<int> path;
    vector<bool> visited;
    int numVertices;
    
    bool findPath(int vertex, int pathLength) {                   // Line 10
        // Add current vertex to path
        path[pathLength] = vertex;                                // Line 12
        visited[vertex] = true;                                   // Line 13
        
        // Base case: path includes all vertices
        if (pathLength == numVertices - 1) {                      // Line 16
            return true;                                          // Line 17
        }
        
        // Try all adjacent vertices
        for (int nextVertex = 0; nextVertex < numVertices; nextVertex++) {  // Line 21
            if (graph[vertex][nextVertex] && !visited[nextVertex]) {         // Line 22
                if (findPath(nextVertex, pathLength + 1)) {       // Line 23
                    return true;                                  // Line 24
                }
            }
        }
        
        // Backtrack: remove vertex from path
        visited[vertex] = false;                                  // Line 30
        return false;                                             // Line 31
    }
    
public:
    bool solveHamiltonian(vector<vector<int>>& adjMatrix) {       // Line 35
        graph = adjMatrix;
        numVertices = graph.size();
        path.resize(numVertices);
        visited.assign(numVertices, false);
        
        // Try starting from each vertex
        for (int start = 0; start < numVertices; start++) {       // Line 42
            if (findPath(start, 0)) {                            // Line 43
                return true;                                     // Line 44
            }
        }
        
        return false; // No Hamiltonian path found               // Line 48
    }
    
    vector<int> getPath() {                                      // Line 51
        return path;                                             // Line 52
    }
};`,

  python: `class HamiltonianPath:
    def __init__(self):
        self.graph = []
        self.path = []
        self.visited = []
        self.num_vertices = 0
    
    def find_path(self, vertex, path_length):                    # Line 8
        # Add current vertex to path
        self.path[path_length] = vertex                          # Line 10
        self.visited[vertex] = True                              # Line 11
        
        # Base case: path includes all vertices
        if path_length == self.num_vertices - 1:                 # Line 14
            return True                                          # Line 15
        
        # Try all adjacent vertices
        for next_vertex in range(self.num_vertices):             # Line 18
            if (self.graph[vertex][next_vertex] and              # Line 19
                not self.visited[next_vertex]):                  # Line 20
                if self.find_path(next_vertex, path_length + 1): # Line 21
                    return True                                  # Line 22
        
        # Backtrack: remove vertex from path
        self.visited[vertex] = False                             # Line 25
        return False                                             # Line 26
    
    def solve_hamiltonian(self, adj_matrix):                     # Line 28
        self.graph = adj_matrix
        self.num_vertices = len(adj_matrix)
        self.path = [0] * self.num_vertices
        self.visited = [False] * self.num_vertices
        
        # Try starting from each vertex
        for start in range(self.num_vertices):                   # Line 35
            if self.find_path(start, 0):                         # Line 36
                return True                                      # Line 37
        
        return False  # No Hamiltonian path found               # Line 40
    
    def get_path(self):                                          # Line 42
        return self.path                                         # Line 43`,

  javascript: `class HamiltonianPath {
    constructor() {
        this.graph = [];
        this.path = [];
        this.visited = [];
        this.numVertices = 0;
    }
    
    findPath(vertex, pathLength) {                               // Line 9
        // Add current vertex to path
        this.path[pathLength] = vertex;                          // Line 11
        this.visited[vertex] = true;                             // Line 12
        
        // Base case: path includes all vertices
        if (pathLength === this.numVertices - 1) {               // Line 15
            return true;                                         // Line 16
        }
        
        // Try all adjacent vertices
        for (let nextVertex = 0; nextVertex < this.numVertices; nextVertex++) {  // Line 20
            if (this.graph[vertex][nextVertex] && !this.visited[nextVertex]) {   // Line 21
                if (this.findPath(nextVertex, pathLength + 1)) { // Line 22
                    return true;                                 // Line 23
                }
            }
        }
        
        // Backtrack: remove vertex from path
        this.visited[vertex] = false;                            // Line 28
        return false;                                            // Line 29
    }
    
    solveHamiltonian(adjMatrix) {                               // Line 32
        this.graph = adjMatrix;
        this.numVertices = adjMatrix.length;
        this.path = new Array(this.numVertices);
        this.visited = new Array(this.numVertices).fill(false);
        
        // Try starting from each vertex
        for (let start = 0; start < this.numVertices; start++) { // Line 39
            if (this.findPath(start, 0)) {                      // Line 40
                return true;                                    // Line 41
            }
        }
        
        return false; // No Hamiltonian path found              // Line 45
    }
    
    getPath() {                                                 // Line 48
        return this.path;                                       // Line 49
    }
}`
};

// Sample graphs for Hamiltonian path
const sampleGraphs = {
  simple: {
    name: "Simple Path",
    vertices: 4,
    edges: [[0,1], [1,2], [2,3]],
    hasPath: true
  },
  cycle: {
    name: "Cycle Graph",
    vertices: 5,
    edges: [[0,1], [1,2], [2,3], [3,4], [4,0]],
    hasPath: true
  },
  complete: {
    name: "Complete K4",
    vertices: 4,
    edges: [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]],
    hasPath: true
  },
  complex: {
    name: "Complex Graph",
    vertices: 6,
    edges: [[0,1], [0,2], [1,3], [2,3], [3,4], [4,5]],
    hasPath: true
  },
  noPath: {
    name: "No Path Graph",
    vertices: 5,
    edges: [[0,1], [2,3], [4,0]],
    hasPath: false
  }
};

export default function HamiltonianPathVisualizer() {
  const navigate = useNavigate();
  
  // Graph state
  const [graph, setGraph] = useState([]);
  const [numVertices, setNumVertices] = useState(4);
  const [selectedGraph, setSelectedGraph] = useState('simple');
  const [currentPath, setCurrentPath] = useState([]);
  const [visited, setVisited] = useState([]);
  const [currentVertex, setCurrentVertex] = useState(-1);
  const [vertexPositions, setVertexPositions] = useState([]);
  
  // Algorithm state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [attempts, setAttempts] = useState(0);
  const [backtracks, setBacktracks] = useState(0);
  const [pathFound, setPathFound] = useState(false);
  const [startVertex, setStartVertex] = useState(0);
  
  // UI state
  const [activeRightTab, setActiveRightTab] = useState("stats");
  const [currentHighlightedLine, setCurrentHighlightedLine] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "info",
    customButtons: null,
  });

  // Initialize graph
  useEffect(() => {
    const graphData = sampleGraphs[selectedGraph];
    setNumVertices(graphData.vertices);
    initializeGraph(graphData);
    resetVisualization();
  }, [selectedGraph]);

  const initializeGraph = (graphData) => {
    const adjMatrix = Array(graphData.vertices).fill().map(() => Array(graphData.vertices).fill(0));
    
    // Build adjacency matrix
    graphData.edges.forEach(([u, v]) => {
      adjMatrix[u][v] = 1;
      adjMatrix[v][u] = 1;
    });
    
    setGraph(adjMatrix);
    
    // Generate vertex positions in a circle
    const positions = [];
    const centerX = 300;
    const centerY = 200;
    const radius = 120;
    
    for (let i = 0; i < graphData.vertices; i++) {
      const angle = (2 * Math.PI * i) / graphData.vertices;
      positions.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }
    
    setVertexPositions(positions);
    setCurrentPath([]);
    setVisited(new Array(graphData.vertices).fill(false));
  };

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setPlaying(false);
    setStarted(false);
    setCurrentVertex(-1);
    setCurrentPath([]);
    setVisited(new Array(numVertices).fill(false));
    setAttempts(0);
    setBacktracks(0);
    setPathFound(false);
    setCurrentHighlightedLine(null);
  };

  // Hamiltonian path algorithm
  const solveHamiltonianPath = () => {
    const newSteps = [];
    const path = new Array(numVertices);
    const visitedArray = new Array(numVertices).fill(false);
    let attemptCount = 0;
    let backtrackCount = 0;
    let foundPath = false;

    const findPath = (vertex, pathLength) => {
      attemptCount++;

      newSteps.push({
        type: 'exploring_vertex',
        vertex,
        path: [...path.slice(0, pathLength + 1)],
        visited: [...visitedArray],
        pathLength,
        description: `Exploring vertex ${vertex} at position ${pathLength}`,
        action: 'explore_vertex',
        explanation: `Adding vertex ${vertex} to position ${pathLength} in the path.`,
        currentLine: 12,
        attempts: attemptCount,
        backtracks: backtrackCount
      });

      // Add current vertex to path
      path[pathLength] = vertex;
      visitedArray[vertex] = true;

      newSteps.push({
        type: 'vertex_added',
        vertex,
        path: [...path.slice(0, pathLength + 1)],
        visited: [...visitedArray],
        pathLength,
        description: `Added vertex ${vertex} to path`,
        action: 'add_vertex',
        explanation: `Vertex ${vertex} successfully added to path at position ${pathLength}.`,
        currentLine: 13,
        attempts: attemptCount,
        backtracks: backtrackCount
      });

      // Base case: path includes all vertices
      if (pathLength === numVertices - 1) {
        newSteps.push({
          type: 'solution_found',
          vertex,
          path: [...path],
          visited: [...visitedArray],
          pathLength,
          description: 'Hamiltonian path found!',
          action: 'solution_found',
          explanation: `Found a path that visits all ${numVertices} vertices exactly once.`,
          currentLine: 16,
          attempts: attemptCount,
          backtracks: backtrackCount
        });
        return true;
      }

      // Try all adjacent vertices
      for (let nextVertex = 0; nextVertex < numVertices; nextVertex++) {
        if (graph[vertex][nextVertex] && !visitedArray[nextVertex]) {
          newSteps.push({
            type: 'trying_edge',
            vertex,
            nextVertex,
            path: [...path.slice(0, pathLength + 1)],
            visited: [...visitedArray],
            pathLength,
            description: `Trying edge from ${vertex} to ${nextVertex}`,
            action: 'try_edge',
            explanation: `Checking if we can extend path from vertex ${vertex} to vertex ${nextVertex}.`,
            currentLine: 22,
            attempts: attemptCount,
            backtracks: backtrackCount
          });

          if (findPath(nextVertex, pathLength + 1)) {
            return true;
          }
        }
      }

      // Backtrack: remove vertex from path
      visitedArray[vertex] = false;
      backtrackCount++;
      
      newSteps.push({
        type: 'backtrack',
        vertex,
        path: [...path.slice(0, pathLength)],
        visited: [...visitedArray],
        pathLength: pathLength - 1,
        description: `Backtracking from vertex ${vertex}`,
        action: 'backtrack',
        explanation: `No valid path from vertex ${vertex}. Removing from path and trying alternatives.`,
        currentLine: 30,
        attempts: attemptCount,
        backtracks: backtrackCount
      });

      return false;
    };

    newSteps.push({
      type: 'initialization',
      vertex: startVertex,
      path: [],
      visited: [...visitedArray],
      pathLength: 0,
      description: `Starting Hamiltonian path search from vertex ${startVertex}`,
      action: 'initialize',
      explanation: `Beginning search for a path that visits all vertices exactly once, starting from vertex ${startVertex}.`,
      currentLine: 43,
      attempts: 0,
      backtracks: 0
    });

    foundPath = findPath(startVertex, 0);

    if (!foundPath) {
      newSteps.push({
        type: 'no_solution',
        vertex: -1,
        path: [],
        visited: [...visitedArray],
        pathLength: 0,
        description: `No Hamiltonian path found starting from vertex ${startVertex}`,
        action: 'no_solution',
        explanation: `Exhausted all possibilities from vertex ${startVertex}. Try a different starting vertex.`,
        currentLine: -1,
        attempts: attemptCount,
        backtracks: backtrackCount
      });
    }

    setSteps(newSteps);
    setAttempts(attemptCount);
    setBacktracks(backtrackCount);
    setPathFound(foundPath);
    setCurrentStep(0);
    setStarted(true);
  };

  // Animation control
  useEffect(() => {
    let interval;
    if (playing && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= steps.length - 1) {
            setPlaying(false);
          }
          return next;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [playing, currentStep, steps.length, speed]);

  // Update visualization based on current step
  useEffect(() => {
    if (steps[currentStep]) {
      const currentStepData = steps[currentStep];
      setCurrentVertex(currentStepData.vertex);
      setCurrentPath(currentStepData.path || []);
      setVisited(currentStepData.visited || []);
      setCurrentHighlightedLine(currentStepData.currentLine);
      setAttempts(currentStepData.attempts);
      setBacktracks(currentStepData.backtracks);
    }
  }, [currentStep, steps]);

  const getVertexClass = (vertex) => {
    const isCurrentVertex = currentVertex === vertex;
    const isInPath = currentPath.includes(vertex);
    const isVisited = visited[vertex];
    const currentStepData = steps[currentStep];
    
    let baseClass = "absolute rounded-full border-4 font-bold text-white flex items-center justify-center transition-all duration-500 text-lg w-12 h-12";
    
    if (isInPath) {
      baseClass += " bg-gradient-to-r from-green-500 to-green-600 border-green-700";
    } else if (isVisited) {
      baseClass += " bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-700";
    } else {
      baseClass += " bg-gray-400 border-gray-600 text-gray-800";
    }
    
    if (isCurrentVertex && currentStepData) {
      switch (currentStepData.type) {
        case 'exploring_vertex':
          baseClass += " ring-4 ring-blue-400";
          break;
        case 'vertex_added':
          baseClass += " ring-4 ring-green-400";
          break;
        case 'trying_edge':
          baseClass += " ring-4 ring-purple-400";
          break;
        case 'backtrack':
          baseClass += " ring-4 ring-red-400";
          break;
        default:
          baseClass += " ring-2 ring-indigo-300";
      }
    }
    
    return baseClass;
  };

  const getVertexStyle = (vertex) => {
    const position = vertexPositions[vertex];
    
    return {
      left: `${position?.x - 24}px`,
      top: `${position?.y - 24}px`
    };
  };

  const getEdgeClass = (from, to) => {
    const fromIndex = currentPath.indexOf(from);
    const toIndex = currentPath.indexOf(to);
    
    if (fromIndex >= 0 && toIndex >= 0 && Math.abs(fromIndex - toIndex) === 1) {
      return "stroke-green-500 stroke-[4px]";
    }
    
    const currentStepData = steps[currentStep];
    if (currentStepData?.type === 'trying_edge' && 
        currentStepData.vertex === from && currentStepData.nextVertex === to) {
      return "stroke-purple-500 stroke-[4px] animate-pulse";
    }
    
    return "stroke-gray-400 stroke-[2px]";
  };

  const loadGraph = (graphKey) => {
    setSelectedGraph(graphKey);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all duration-200"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Home</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <Navigation size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Hamiltonian Path</h1>
                <p className="text-sm text-gray-400">Backtracking Algorithm Visualization</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-700/50 px-4 py-2 rounded-xl">
              <span className="text-sm text-gray-300">
                Time: O(n!) | Space: O(n) | Backtracking
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Resizable Panels */}
      <div className="pt-16 h-screen">
        <PanelGroup 
          direction="horizontal" 
          onLayout={(sizes) => {
            setIsResizing(false);
          }}
        >
          {/* Left Panel - Settings */}
          <Panel 
            defaultSize={25} 
            minSize={20} 
            maxSize={40}
            onResize={() => setIsResizing(true)}
          >
            <div className="h-full bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-indigo-400" />
                  <h2 className="text-lg font-semibold text-gray-200">Graph Settings</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Graph Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Select Graph
                  </label>
                  <div className="space-y-2">
                    {Object.entries(sampleGraphs).map(([key, graphData]) => (
                      <button
                        key={key}
                        onClick={() => loadGraph(key)}
                        className={`w-full py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                          selectedGraph === key
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                        }`}
                      >
                        {graphData.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Graph Info */}
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">
                    Current Graph
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-400">Vertices: </span>
                      <span className="text-gray-300 font-mono">{numVertices}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Edges: </span>
                      <span className="text-gray-300 font-mono">
                        {sampleGraphs[selectedGraph].edges.length}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Has Path: </span>
                      <span className={`font-mono ${sampleGraphs[selectedGraph].hasPath ? 'text-green-400' : 'text-red-400'}`}>
                        {sampleGraphs[selectedGraph].hasPath ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Start Vertex Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Start Vertex: {startVertex}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={numVertices - 1}
                    value={startVertex}
                    onChange={e => setStartVertex(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="mt-2 flex justify-between text-xs text-gray-400">
                    <span>0</span>
                    <span>{numVertices - 1}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="pt-4 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Solver Controls
                  </h3>

                  <button
                    onClick={solveHamiltonianPath}
                    disabled={playing}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-200 shadow-lg mb-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Navigation size={18} />
                      Find Path
                    </div>
                  </button>

                  {steps.length > 0 && (
                    <>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <button
                          onClick={() => setPlaying(!playing)}
                          disabled={currentStep >= steps.length - 1}
                          className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-200 shadow-lg text-sm"
                        >
                          {playing ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button
                          onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
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
                          min={200}
                          max={2000}
                          step={100}
                          value={speed}
                          onChange={e => setSpeed(parseInt(e.target.value))}
                          className="w-full accent-indigo-500"
                        />
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-semibold text-gray-200">
                            Step Progress
                          </label>
                          <span className="text-sm text-gray-400">
                            {currentStep + 1} / {steps.length}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={steps.length - 1}
                          value={currentStep}
                          onChange={e => setCurrentStep(parseInt(e.target.value))}
                          className="w-full accent-indigo-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Algorithm Info */}
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-200 mb-3">
                    Algorithm Overview
                  </h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      Find a path that visits each vertex exactly once in a graph.
                    </p>
                    <p>
                      Uses backtracking to explore all possible paths systematically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200" />

          {/* Middle Panel - Visualization */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-gray-900/50 backdrop-blur-xl flex flex-col">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GitBranch size={20} className="text-indigo-400" />
                    <h2 className="text-lg font-semibold text-gray-200">
                      Path Visualization
                    </h2>
                  </div>
                  {steps[currentStep] && (
                    <div className="text-sm text-gray-400">
                      {steps[currentStep].description}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-8">
                <div className="bg-gray-800/30 p-6 rounded-2xl shadow-2xl relative" style={{ width: '600px', height: '400px' }}>
                  {/* Draw edges */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                    {sampleGraphs[selectedGraph].edges.map(([u, v], index) => {
                      const pos1 = vertexPositions[u];
                      const pos2 = vertexPositions[v];
                      if (!pos1 || !pos2) return null;
                      
                      return (
                        <line
                          key={index}
                          x1={pos1.x}
                          y1={pos1.y}
                          x2={pos2.x}
                          y2={pos2.y}
                          className={getEdgeClass(u, v)}
                        />
                      );
                    })}
                  </svg>

                  {/* Draw vertices */}
                  {vertexPositions.map((position, vertex) => (
                    <div
                      key={vertex}
                      className={getVertexClass(vertex)}
                      style={getVertexStyle(vertex)}
                    >
                      {vertex}
                    </div>
                  ))}

                  {/* Path info */}
                  <div className="absolute bottom-4 left-4 bg-gray-800/70 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-2">Current Path:</div>
                    <div className="text-xs text-gray-400">
                      {currentPath.length > 0 ? currentPath.join(' → ') : 'No path yet'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Length: {currentPath.length} / {numVertices}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 bg-gray-800/70 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-2">Legend:</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-300">In Path</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-300">Visited</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-300">Unvisited</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200" />

          {/* Right Panel - Stats and Code */}
          <Panel defaultSize={25} minSize={20} maxSize={40}>
            <div className="h-full bg-gray-800/50 backdrop-blur-xl border-l border-gray-700/50 flex flex-col">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveRightTab("stats")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                      activeRightTab === "stats"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} />
                      Stats
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveRightTab("algorithm")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                      activeRightTab === "algorithm"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Code2 size={16} />
                      Code
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeRightTab === "stats" && (
                  <div className="space-y-4">
                    {/* Current Step Info */}
                    {steps[currentStep] && (
                      <div className="bg-gray-700/30 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">
                          Current Step
                        </h3>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-400">Action: </span>
                            <span className="text-indigo-400 font-medium">
                              {steps[currentStep].action}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Explanation: </span>
                            <span className="text-gray-300">
                              {steps[currentStep].explanation}
                            </span>
                          </div>
                          {steps[currentStep].vertex >= 0 && (
                            <div className="text-sm">
                              <span className="text-gray-400">Current Vertex: </span>
                              <span className="text-gray-300 font-mono">
                                {steps[currentStep].vertex}
                              </span>
                            </div>
                          )}
                          {steps[currentStep].pathLength >= 0 && (
                            <div className="text-sm">
                              <span className="text-gray-400">Path Length: </span>
                              <span className="text-gray-300 font-mono">
                                {steps[currentStep].pathLength + 1}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Statistics */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-200">
                        Statistics
                      </h3>
                      
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-blue-400">
                            Attempts
                          </span>
                        </div>
                        <span className="font-mono text-blue-300 text-lg">
                          {attempts}
                        </span>
                      </div>

                      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-yellow-400">
                            Backtracks
                          </span>
                        </div>
                        <span className="font-mono text-yellow-300 text-lg">
                          {backtracks}
                        </span>
                      </div>

                      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-green-400">
                            Path Found
                          </span>
                        </div>
                        <span className="font-mono text-green-300 text-lg">
                          {pathFound ? 'Yes' : 'No'}
                        </span>
                      </div>

                      <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-purple-400">
                            Current Step
                          </span>
                        </div>
                        <span className="font-mono text-purple-300 text-lg">
                          {currentStep + 1} / {steps.length}
                        </span>
                      </div>

                      <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-indigo-400">
                            Path Progress
                          </span>
                        </div>
                        <span className="font-mono text-indigo-300 text-lg">
                          {currentPath.length} / {numVertices}
                        </span>
                      </div>
                    </div>

                    {/* Algorithm Properties */}
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-2">
                        Hamiltonian Path Rules
                      </h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>• Visit each vertex exactly once</div>
                        <div>• Path must be connected</div>
                        <div>• No vertex can be revisited</div>
                        <div>• Backtrack when no valid moves</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeRightTab === "algorithm" && (
                  <div className="space-y-4">
                    <div className="bg-gray-700/30 rounded-xl border border-gray-600/30 overflow-hidden">
                      <div className="flex items-center gap-2 p-3 border-b border-gray-600/30">
                        <Code2 size={18} className="text-indigo-400" />
                        <h3 className="text-lg font-semibold text-gray-200">
                          Hamiltonian Path Implementation
                        </h3>
                      </div>
                      <div className="relative">
                        <BasicCodeDisplay
                          cppCode={hamiltonianPathCode.cpp}
                          pythonCode={hamiltonianPathCode.python}
                          jsCode={hamiltonianPathCode.javascript}
                          highlightedLine={currentHighlightedLine}
                          className="min-h-[300px]"
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Algorithm Complexity
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Time Complexity:</span>
                          <span className="font-mono text-red-400">O(n!)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Space Complexity:</span>
                          <span className="font-mono text-blue-400">O(n)</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          n = number of vertices
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Key Concepts
                      </h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div>
                          <span className="text-indigo-400 font-semibold">Path Uniqueness:</span>
                          <span className="ml-2">
                            Each vertex appears exactly once in the path.
                          </span>
                        </div>
                        <div>
                          <span className="text-indigo-400 font-semibold">Connectivity:</span>
                          <span className="ml-2">
                            Path must follow existing edges in the graph.
                          </span>
                        </div>
                        <div>
                          <span className="text-indigo-400 font-semibold">Backtracking:</span>
                          <span className="ml-2">
                            Systematically explore all possibilities and backtrack.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Applications
                      </h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div>• Traveling salesman problem</div>
                        <div>• DNA sequencing</div>
                        <div>• Circuit design</div>
                        <div>• Game puzzles</div>
                        <div>• Route optimization</div>
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
    </div>
  );
}
