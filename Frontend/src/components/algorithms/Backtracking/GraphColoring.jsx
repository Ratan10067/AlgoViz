import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Palette, Circle, GitBranch, Hash, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const graphColoringCode = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

class GraphColoring {
private:
    vector<vector<int>> graph;
    vector<int> colors;
    int numVertices;
    int numColors;
    
    bool isSafe(int vertex, int color) {                   // Line 10
        // Check if any adjacent vertex has the same color
        for (int i = 0; i < numVertices; i++) {            // Line 12
            if (graph[vertex][i] && colors[i] == color) {  // Line 13
                return false;                              // Line 14
            }
        }
        return true;                                       // Line 17
    }
    
public:
    bool solveColoring(vector<vector<int>>& adjMatrix, int k) {  // Line 21
        graph = adjMatrix;
        numVertices = graph.size();
        numColors = k;
        colors.assign(numVertices, -1);
        
        return backtrack(0);                               // Line 27
    }
    
    bool backtrack(int vertex) {                           // Line 30
        // Base case: all vertices colored
        if (vertex == numVertices) {                       // Line 32
            return true;                                   // Line 33
        }
        
        // Try all colors for current vertex
        for (int color = 0; color < numColors; color++) {  // Line 37
            if (isSafe(vertex, color)) {                   // Line 38
                colors[vertex] = color;                    // Line 39
                
                // Recursively color remaining vertices
                if (backtrack(vertex + 1)) {               // Line 42
                    return true;                           // Line 43
                }
                
                // Backtrack: remove color
                colors[vertex] = -1;                       // Line 47
            }
        }
        
        return false; // No valid coloring found            // Line 51
    }
    
    vector<int> getColors() {                              // Line 54
        return colors;                                     // Line 55
    }
};`,

  python: `class GraphColoring:
    def __init__(self):
        self.graph = []
        self.colors = []
        self.num_vertices = 0
        self.num_colors = 0
    
    def is_safe(self, vertex, color):                      # Line 8
        # Check if any adjacent vertex has the same color
        for i in range(self.num_vertices):                 # Line 10
            if self.graph[vertex][i] and self.colors[i] == color:  # Line 11
                return False                               # Line 12
        return True                                        # Line 13
    
    def solve_coloring(self, adj_matrix, k):               # Line 15
        self.graph = adj_matrix
        self.num_vertices = len(adj_matrix)
        self.num_colors = k
        self.colors = [-1] * self.num_vertices
        
        return self.backtrack(0)                           # Line 21
    
    def backtrack(self, vertex):                           # Line 23
        # Base case: all vertices colored
        if vertex == self.num_vertices:                    # Line 25
            return True                                    # Line 26
        
        # Try all colors for current vertex
        for color in range(self.num_colors):               # Line 29
            if self.is_safe(vertex, color):                # Line 30
                self.colors[vertex] = color                # Line 31
                
                # Recursively color remaining vertices
                if self.backtrack(vertex + 1):             # Line 34
                    return True                            # Line 35
                
                # Backtrack: remove color
                self.colors[vertex] = -1                   # Line 38
        
        return False  # No valid coloring found            # Line 40
    
    def get_colors(self):                                  # Line 42
        return self.colors                                 # Line 43`,

  javascript: `class GraphColoring {
    constructor() {
        this.graph = [];
        this.colors = [];
        this.numVertices = 0;
        this.numColors = 0;
    }
    
    isSafe(vertex, color) {                                // Line 9
        // Check if any adjacent vertex has the same color
        for (let i = 0; i < this.numVertices; i++) {       // Line 11
            if (this.graph[vertex][i] && this.colors[i] === color) {  // Line 12
                return false;                              // Line 13
            }
        }
        return true;                                       // Line 16
    }
    
    solveColoring(adjMatrix, k) {                          // Line 19
        this.graph = adjMatrix;
        this.numVertices = adjMatrix.length;
        this.numColors = k;
        this.colors = new Array(this.numVertices).fill(-1);
        
        return this.backtrack(0);                          // Line 25
    }
    
    backtrack(vertex) {                                    // Line 28
        // Base case: all vertices colored
        if (vertex === this.numVertices) {                 // Line 30
            return true;                                   // Line 31
        }
        
        // Try all colors for current vertex
        for (let color = 0; color < this.numColors; color++) {  // Line 35
            if (this.isSafe(vertex, color)) {              // Line 36
                this.colors[vertex] = color;               // Line 37
                
                // Recursively color remaining vertices
                if (this.backtrack(vertex + 1)) {          // Line 40
                    return true;                           // Line 41
                }
                
                // Backtrack: remove color
                this.colors[vertex] = -1;                  // Line 45
            }
        }
        
        return false; // No valid coloring found           // Line 49
    }
    
    getColors() {                                          // Line 52
        return this.colors;                                // Line 53
    }
}`
};

// Color palette for visualization
const COLOR_PALETTE = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E9", // Light Blue
  "#F8C471", // Orange
  "#82E0AA"  // Light Green
];

// Sample graphs
const sampleGraphs = {
  simple: {
    name: "Simple Graph",
    vertices: 4,
    edges: [[0,1], [1,2], [2,3], [3,0]],
    minColors: 2
  },
  triangle: {
    name: "Triangle + 1",
    vertices: 4,
    edges: [[0,1], [1,2], [2,0], [0,3]],
    minColors: 3
  },
  complex: {
    name: "Complex Graph",
    vertices: 6,
    edges: [[0,1], [0,2], [1,3], [2,3], [3,4], [4,5], [5,0]],
    minColors: 3
  },
  complete: {
    name: "Complete K4",
    vertices: 4,
    edges: [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]],
    minColors: 4
  }
};

export default function GraphColoringVisualizer() {
  const navigate = useNavigate();
  
  // Graph state
  const [graph, setGraph] = useState([]);
  const [numVertices, setNumVertices] = useState(4);
  const [numColors, setNumColors] = useState(3);
  const [selectedGraph, setSelectedGraph] = useState('simple');
  const [vertexColors, setVertexColors] = useState([]);
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
  const [coloringFound, setColoringFound] = useState(false);
  
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
    setVertexColors(new Array(graphData.vertices).fill(-1));
  };

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setPlaying(false);
    setStarted(false);
    setCurrentVertex(-1);
    setVertexColors(new Array(numVertices).fill(-1));
    setAttempts(0);
    setBacktracks(0);
    setColoringFound(false);
    setCurrentHighlightedLine(null);
  };

  // Graph coloring algorithm
  const solveGraphColoring = () => {
    const newSteps = [];
    const colors = new Array(numVertices).fill(-1);
    let attemptCount = 0;
    let backtrackCount = 0;

    const isSafe = (vertex, color) => {
      for (let i = 0; i < numVertices; i++) {
        if (graph[vertex][i] && colors[i] === color) {
          return false;
        }
      }
      return true;
    };

    const backtrack = (vertex) => {
      attemptCount++;

      newSteps.push({
        type: 'exploring_vertex',
        vertex,
        colors: [...colors],
        description: `Exploring vertex ${vertex}`,
        action: 'explore_vertex',
        explanation: `Attempting to color vertex ${vertex}. Trying different colors.`,
        currentLine: 30,
        attempts: attemptCount,
        backtracks: backtrackCount
      });

      // Base case: all vertices colored
      if (vertex === numVertices) {
        newSteps.push({
          type: 'solution_found',
          vertex: -1,
          colors: [...colors],
          description: 'Valid coloring found!',
          action: 'solution_found',
          explanation: `Successfully colored all vertices with ${numColors} colors.`,
          currentLine: 32,
          attempts: attemptCount,
          backtracks: backtrackCount
        });
        return true;
      }

      // Try all colors for current vertex
      for (let color = 0; color < numColors; color++) {
        newSteps.push({
          type: 'trying_color',
          vertex,
          color,
          colors: [...colors],
          description: `Trying color ${color} for vertex ${vertex}`,
          action: 'try_color',
          explanation: `Testing if color ${color} can be assigned to vertex ${vertex}.`,
          currentLine: 38,
          attempts: attemptCount,
          backtracks: backtrackCount
        });

        if (isSafe(vertex, color)) {
          colors[vertex] = color;
          
          newSteps.push({
            type: 'color_assigned',
            vertex,
            color,
            colors: [...colors],
            description: `Color ${color} assigned to vertex ${vertex}`,
            action: 'assign_color',
            explanation: `Color ${color} is safe for vertex ${vertex}. Proceeding to next vertex.`,
            currentLine: 39,
            attempts: attemptCount,
            backtracks: backtrackCount
          });

          if (backtrack(vertex + 1)) {
            return true;
          }

          // Backtrack
          colors[vertex] = -1;
          backtrackCount++;
          
          newSteps.push({
            type: 'backtrack',
            vertex,
            color,
            colors: [...colors],
            description: `Backtracking from vertex ${vertex}, removing color ${color}`,
            action: 'backtrack',
            explanation: `Color ${color} led to no solution. Removing and trying next color.`,
            currentLine: 47,
            attempts: attemptCount,
            backtracks: backtrackCount
          });
        } else {
          newSteps.push({
            type: 'color_conflict',
            vertex,
            color,
            colors: [...colors],
            description: `Color ${color} conflicts with adjacent vertices`,
            action: 'color_conflict',
            explanation: `Color ${color} cannot be used for vertex ${vertex} due to adjacent vertex conflicts.`,
            currentLine: 38,
            attempts: attemptCount,
            backtracks: backtrackCount
          });
        }
      }

      return false;
    };

    newSteps.push({
      type: 'initialization',
      vertex: 0,
      colors: [...colors],
      description: `Starting graph coloring with ${numColors} colors`,
      action: 'initialize',
      explanation: `Beginning graph coloring algorithm using backtracking with ${numColors} colors.`,
      currentLine: 21,
      attempts: 0,
      backtracks: 0
    });

    const solutionExists = backtrack(0);

    if (!solutionExists) {
      newSteps.push({
        type: 'no_solution',
        vertex: -1,
        colors: [...colors],
        description: `No valid coloring possible with ${numColors} colors`,
        action: 'no_solution',
        explanation: `Cannot color this graph with ${numColors} colors. Try increasing the number of colors.`,
        currentLine: -1,
        attempts: attemptCount,
        backtracks: backtrackCount
      });
    }

    setSteps(newSteps);
    setAttempts(attemptCount);
    setBacktracks(backtrackCount);
    setColoringFound(solutionExists);
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
      setVertexColors(currentStepData.colors);
      setCurrentHighlightedLine(currentStepData.currentLine);
      setAttempts(currentStepData.attempts);
      setBacktracks(currentStepData.backtracks);
    }
  }, [currentStep, steps]);

  const getVertexClass = (vertex) => {
    const isCurrentVertex = currentVertex === vertex;
    const color = vertexColors[vertex];
    const currentStepData = steps[currentStep];
    
    let baseClass = "absolute rounded-full border-4 font-bold text-white flex items-center justify-center transition-all duration-500 text-lg w-12 h-12";
    
    if (color >= 0) {
      baseClass += ` border-gray-800`;
    } else {
      baseClass += ` border-gray-400 bg-gray-200 text-gray-800`;
    }
    
    if (isCurrentVertex && currentStepData) {
      switch (currentStepData.type) {
        case 'exploring_vertex':
          baseClass += " ring-4 ring-blue-400";
          break;
        case 'trying_color':
          baseClass += " ring-4 ring-yellow-400";
          break;
        case 'color_assigned':
          baseClass += " ring-4 ring-green-400";
          break;
        case 'color_conflict':
          baseClass += " ring-4 ring-red-400";
          break;
        case 'backtrack':
          baseClass += " ring-4 ring-orange-400";
          break;
        default:
          baseClass += " ring-2 ring-indigo-300";
      }
    }
    
    return baseClass;
  };

  const getVertexStyle = (vertex) => {
    const position = vertexPositions[vertex];
    const color = vertexColors[vertex];
    
    return {
      left: `${position?.x - 24}px`,
      top: `${position?.y - 24}px`,
      backgroundColor: color >= 0 ? COLOR_PALETTE[color] : '#e5e7eb'
    };
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
                <Palette size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Graph Coloring</h1>
                <p className="text-sm text-gray-400">Backtracking Algorithm Visualization</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-700/50 px-4 py-2 rounded-xl">
              <span className="text-sm text-gray-300">
                Time: O(k^n) | Space: O(n) | Backtracking
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
                      <span className="text-gray-400">Min Colors: </span>
                      <span className="text-yellow-400 font-mono">
                        {sampleGraphs[selectedGraph].minColors}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Color Settings */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Number of Colors: {numColors}
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    value={numColors}
                    onChange={e => setNumColors(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="mt-2 flex flex-wrap gap-1">
                    {COLOR_PALETTE.slice(0, numColors).map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color }}
                        title={`Color ${index}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="pt-4 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Solver Controls
                  </h3>

                  <button
                    onClick={solveGraphColoring}
                    disabled={playing}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-200 shadow-lg mb-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Palette size={18} />
                      Color Graph
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
                      Assign colors to vertices such that no two adjacent vertices 
                      have the same color, using minimum number of colors.
                    </p>
                    <p>
                      Uses backtracking to explore all valid color assignments.
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
                      Graph Visualization
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
                          stroke="#6b7280"
                          strokeWidth="3"
                          className="transition-all duration-300"
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

                  {/* Color legend */}
                  <div className="absolute bottom-4 left-4 bg-gray-800/70 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-2">Colors Used:</div>
                    <div className="flex gap-2">
                      {Array.from(new Set(vertexColors.filter(c => c >= 0))).map(colorIndex => (
                        <div key={colorIndex} className="flex items-center gap-1">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-400"
                            style={{ backgroundColor: COLOR_PALETTE[colorIndex] }}
                          />
                          <span className="text-xs text-gray-300">{colorIndex}</span>
                        </div>
                      ))}
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
                              <span className="text-gray-400">Vertex: </span>
                              <span className="text-gray-300 font-mono">
                                {steps[currentStep].vertex}
                              </span>
                            </div>
                          )}
                          {steps[currentStep].color >= 0 && (
                            <div className="text-sm">
                              <span className="text-gray-400">Color: </span>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-400"
                                  style={{ backgroundColor: COLOR_PALETTE[steps[currentStep].color] }}
                                />
                                <span className="text-gray-300">{steps[currentStep].color}</span>
                              </div>
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
                            Coloring Found
                          </span>
                        </div>
                        <span className="font-mono text-green-300 text-lg">
                          {coloringFound ? 'Yes' : 'No'}
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
                            Colors Used
                          </span>
                        </div>
                        <span className="font-mono text-indigo-300 text-lg">
                          {numColors}
                        </span>
                      </div>
                    </div>

                    {/* Algorithm Properties */}
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-2">
                        Graph Coloring Rules
                      </h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>• No adjacent vertices same color</div>
                        <div>• Use minimum number of colors</div>
                        <div>• Each vertex gets exactly one color</div>
                        <div>• Backtrack on conflicts</div>
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
                          Graph Coloring Implementation
                        </h3>
                      </div>
                      <div className="relative">
                        <BasicCodeDisplay
                          cppCode={graphColoringCode.cpp}
                          pythonCode={graphColoringCode.python}
                          jsCode={graphColoringCode.javascript}
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
                          <span className="font-mono text-red-400">O(k^n)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Space Complexity:</span>
                          <span className="font-mono text-blue-400">O(n)</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          k = number of colors, n = number of vertices
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Key Concepts
                      </h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div>
                          <span className="text-indigo-400 font-semibold">Constraint Satisfaction:</span>
                          <span className="ml-2">
                            Each vertex must satisfy the no-adjacent-same-color rule.
                          </span>
                        </div>
                        <div>
                          <span className="text-indigo-400 font-semibold">Backtracking:</span>
                          <span className="ml-2">
                            Try colors sequentially and backtrack on conflicts.
                          </span>
                        </div>
                        <div>
                          <span className="text-indigo-400 font-semibold">Pruning:</span>
                          <span className="ml-2">
                            Skip invalid color assignments early to optimize search.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Applications
                      </h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div>• Map coloring problems</div>
                        <div>• Register allocation in compilers</div>
                        <div>• Scheduling and timetabling</div>
                        <div>• Frequency assignment</div>
                        <div>• Sudoku and puzzle solving</div>
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
