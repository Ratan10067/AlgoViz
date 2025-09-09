import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  GitBranch, Network, Zap, Calculator, Plus, Minus, Edit3, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const MST = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Graph state
  const [vertices, setVertices] = useState([
    { id: 0, x: 200, y: 150, label: 'A' },
    { id: 1, x: 400, y: 100, label: 'B' },
    { id: 2, x: 600, y: 150, label: 'C' },
    { id: 3, x: 300, y: 300, label: 'D' },
    { id: 4, x: 500, y: 350, label: 'E' }
  ]);
  
  const [edges, setEdges] = useState([
    { from: 0, to: 1, weight: 4, id: 'edge-0-1' },
    { from: 0, to: 3, weight: 2, id: 'edge-0-3' },
    { from: 1, to: 2, weight: 3, id: 'edge-1-2' },
    { from: 1, to: 3, weight: 5, id: 'edge-1-3' },
    { from: 1, to: 4, weight: 6, id: 'edge-1-4' },
    { from: 2, to: 4, weight: 1, id: 'edge-2-4' },
    { from: 3, to: 4, weight: 7, id: 'edge-3-4' }
  ]);
  
  // Algorithm state
  const [algorithm, setAlgorithm] = useState('kruskal'); // 'kruskal' or 'prim'
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(800);
  
  // Visualization state
  const [mstEdges, setMstEdges] = useState([]);
  const [currentEdge, setCurrentEdge] = useState(null);
  const [visitedVertices, setVisitedVertices] = useState(new Set());
  const [sortedEdges, setSortedEdges] = useState([]);
  const [disjointSets, setDisjointSets] = useState({});
  const [totalWeight, setTotalWeight] = useState(0);
  
  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [newEdgeFrom, setNewEdgeFrom] = useState('');
  const [newEdgeTo, setNewEdgeTo] = useState('');
  const [newEdgeWeight, setNewEdgeWeight] = useState('');
  
  // UI state
  const [activeRightTab, setActiveRightTab] = useState("info");
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
    setMstEdges([]);
    setCurrentEdge(null);
    setVisitedVertices(new Set());
    setSortedEdges([]);
    setDisjointSets({});
    setTotalWeight(0);
    setCurrentHighlightedLine(null);
  };

  // Disjoint Set (Union-Find) operations for Kruskal's
  const makeSet = (vertices) => {
    const sets = {};
    vertices.forEach(vertex => {
      sets[vertex.id] = { parent: vertex.id, rank: 0 };
    });
    return sets;
  };

  const find = (sets, x) => {
    if (sets[x].parent !== x) {
      sets[x].parent = find(sets, sets[x].parent); // Path compression
    }
    return sets[x].parent;
  };

  const union = (sets, x, y) => {
    const rootX = find(sets, x);
    const rootY = find(sets, y);
    
    if (rootX !== rootY) {
      // Union by rank
      if (sets[rootX].rank < sets[rootY].rank) {
        sets[rootX].parent = rootY;
      } else if (sets[rootX].rank > sets[rootY].rank) {
        sets[rootY].parent = rootX;
      } else {
        sets[rootY].parent = rootX;
        sets[rootX].rank++;
      }
      return true;
    }
    return false;
  };

  // Kruskal's Algorithm
  const generateKruskalSteps = () => {
    const steps = [];
    const sortedEdgeList = [...edges].sort((a, b) => a.weight - b.weight);
    const sets = makeSet(vertices);
    const mst = [];
    let totalCost = 0;
    
    // Step 1: Initialize
    steps.push({
      type: 'initialize',
      description: `Kruskal's Algorithm: Find MST using edge sorting and union-find`,
      sortedEdges: [...sortedEdgeList],
      mstEdges: [],
      currentEdge: null,
      sets: JSON.parse(JSON.stringify(sets)),
      totalWeight: 0,
      action: 'initialize',
      explanation: 'Sort all edges by weight and initialize disjoint sets for each vertex',
      highlightedLine: 1
    });

    // Step 2: Show sorted edges
    steps.push({
      type: 'sort_edges',
      description: 'Edges sorted by weight (greedy choice)',
      sortedEdges: [...sortedEdgeList],
      mstEdges: [],
      currentEdge: null,
      sets: JSON.parse(JSON.stringify(sets)),
      totalWeight: 0,
      action: 'sort_edges',
      explanation: 'Process edges from smallest to largest weight',
      highlightedLine: 4
    });

    // Step 3: Process each edge
    for (const edge of sortedEdgeList) {
      // Consider current edge
      steps.push({
        type: 'consider_edge',
        description: `Considering edge ${vertices[edge.from].label}-${vertices[edge.to].label} (weight: ${edge.weight})`,
        sortedEdges: [...sortedEdgeList],
        mstEdges: [...mst],
        currentEdge: edge,
        sets: JSON.parse(JSON.stringify(sets)),
        totalWeight: totalCost,
        action: 'consider_edge',
        explanation: `Check if adding this edge creates a cycle using union-find`,
        highlightedLine: 7
      });

      const rootFrom = find(sets, edge.from);
      const rootTo = find(sets, edge.to);

      if (rootFrom !== rootTo) {
        // Add edge to MST
        union(sets, edge.from, edge.to);
        mst.push(edge);
        totalCost += edge.weight;
        
        steps.push({
          type: 'add_edge',
          description: `Added edge ${vertices[edge.from].label}-${vertices[edge.to].label} to MST`,
          sortedEdges: [...sortedEdgeList],
          mstEdges: [...mst],
          currentEdge: edge,
          sets: JSON.parse(JSON.stringify(sets)),
          totalWeight: totalCost,
          action: 'add_edge',
          explanation: `Edge connects different components - safe to add`,
          highlightedLine: 9
        });
        
        // Check if MST is complete
        if (mst.length === vertices.length - 1) {
          steps.push({
            type: 'complete',
            description: `MST complete! Total weight: ${totalCost}`,
            sortedEdges: [...sortedEdgeList],
            mstEdges: [...mst],
            currentEdge: null,
            sets: JSON.parse(JSON.stringify(sets)),
            totalWeight: totalCost,
            action: 'complete',
            explanation: `Found spanning tree with ${vertices.length - 1} edges`,
            highlightedLine: 15
          });
          break;
        }
      } else {
        // Skip edge (creates cycle)
        steps.push({
          type: 'skip_edge',
          description: `Skipped edge ${vertices[edge.from].label}-${vertices[edge.to].label} (creates cycle)`,
          sortedEdges: [...sortedEdgeList],
          mstEdges: [...mst],
          currentEdge: edge,
          sets: JSON.parse(JSON.stringify(sets)),
          totalWeight: totalCost,
          action: 'skip_edge',
          explanation: `Edge connects vertices in same component - would create cycle`,
          highlightedLine: 11
        });
      }
    }

    return steps;
  };

  // Prim's Algorithm
  const generatePrimSteps = () => {
    const steps = [];
    const visited = new Set();
    const mst = [];
    let totalCost = 0;
    const startVertex = vertices[0];
    
    // Step 1: Initialize
    steps.push({
      type: 'initialize',
      description: `Prim's Algorithm: Start from vertex ${startVertex.label}`,
      visitedVertices: new Set(),
      mstEdges: [],
      currentEdge: null,
      totalWeight: 0,
      action: 'initialize',
      explanation: 'Start with any vertex and grow the MST one edge at a time',
      highlightedLine: 1
    });

    // Step 2: Add start vertex
    visited.add(startVertex.id);
    steps.push({
      type: 'add_vertex',
      description: `Added vertex ${startVertex.label} to MST`,
      visitedVertices: new Set(visited),
      mstEdges: [],
      currentEdge: null,
      totalWeight: 0,
      action: 'add_start_vertex',
      explanation: `Begin with vertex ${startVertex.label}`,
      highlightedLine: 4
    });

    // Step 3: Build MST
    while (visited.size < vertices.length) {
      let minEdge = null;
      let minWeight = Infinity;
      
      // Find minimum weight edge crossing the cut
      for (const edge of edges) {
        const fromVisited = visited.has(edge.from);
        const toVisited = visited.has(edge.to);
        
        // Edge crosses the cut (one endpoint in MST, one outside)
        if ((fromVisited && !toVisited) || (!fromVisited && toVisited)) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            minEdge = edge;
          }
        }
      }

      if (minEdge) {
        // Consider the minimum edge
        steps.push({
          type: 'consider_edge',
          description: `Considering minimum edge ${vertices[minEdge.from].label}-${vertices[minEdge.to].label} (weight: ${minEdge.weight})`,
          visitedVertices: new Set(visited),
          mstEdges: [...mst],
          currentEdge: minEdge,
          totalWeight: totalCost,
          action: 'consider_edge',
          explanation: `This is the minimum weight edge crossing the cut`,
          highlightedLine: 7
        });

        // Add edge and vertex to MST
        const newVertex = visited.has(minEdge.from) ? minEdge.to : minEdge.from;
        visited.add(newVertex);
        mst.push(minEdge);
        totalCost += minEdge.weight;
        
        steps.push({
          type: 'add_edge',
          description: `Added edge ${vertices[minEdge.from].label}-${vertices[minEdge.to].label} and vertex ${vertices[newVertex].label}`,
          visitedVertices: new Set(visited),
          mstEdges: [...mst],
          currentEdge: minEdge,
          totalWeight: totalCost,
          action: 'add_edge',
          explanation: `Expand MST by adding the minimum crossing edge`,
          highlightedLine: 10
        });
      }
    }

    // Complete
    steps.push({
      type: 'complete',
      description: `MST complete! Total weight: ${totalCost}`,
      visitedVertices: new Set(visited),
      mstEdges: [...mst],
      currentEdge: null,
      totalWeight: totalCost,
      action: 'complete',
      explanation: `All vertices connected with minimum total weight`,
      highlightedLine: 15
    });

    return steps;
  };

  const startMST = () => {
    if (vertices.length < 2) {
      setAlertConfig({
        isOpen: true,
        message: "Need at least 2 vertices to find MST.",
        type: "error"
      });
      return;
    }

    if (edges.length === 0) {
      setAlertConfig({
        isOpen: true,
        message: "Need at least one edge to find MST.",
        type: "error"
      });
      return;
    }
    
    const mstSteps = algorithm === 'kruskal' ? generateKruskalSteps() : generatePrimSteps();
    setSteps(mstSteps);
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

  const addEdge = () => {
    const from = parseInt(newEdgeFrom);
    const to = parseInt(newEdgeTo);
    const weight = parseInt(newEdgeWeight);
    
    if (isNaN(from) || isNaN(to) || isNaN(weight)) {
      setAlertConfig({
        isOpen: true,
        message: "Please enter valid vertex IDs and weight.",
        type: "error"
      });
      return;
    }

    if (from === to) {
      setAlertConfig({
        isOpen: true,
        message: "Cannot create self-loop.",
        type: "error"
      });
      return;
    }

    if (from >= vertices.length || to >= vertices.length || from < 0 || to < 0) {
      setAlertConfig({
        isOpen: true,
        message: "Invalid vertex ID.",
        type: "error"
      });
      return;
    }

    // Check if edge already exists
    const edgeExists = edges.some(edge => 
      (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)
    );

    if (edgeExists) {
      setAlertConfig({
        isOpen: true,
        message: "Edge already exists.",
        type: "error"
      });
      return;
    }

    const newEdge = {
      from,
      to,
      weight,
      id: `edge-${from}-${to}`
    };

    setEdges([...edges, newEdge]);
    setNewEdgeFrom('');
    setNewEdgeTo('');
    setNewEdgeWeight('');
    resetVisualization();
  };

  const removeEdge = (edgeToRemove) => {
    setEdges(edges.filter(edge => edge.id !== edgeToRemove.id));
    resetVisualization();
  };

  const reset = () => {
    setVertices([
      { id: 0, x: 200, y: 150, label: 'A' },
      { id: 1, x: 400, y: 100, label: 'B' },
      { id: 2, x: 600, y: 150, label: 'C' },
      { id: 3, x: 300, y: 300, label: 'D' },
      { id: 4, x: 500, y: 350, label: 'E' }
    ]);
    setEdges([
      { from: 0, to: 1, weight: 4, id: 'edge-0-1' },
      { from: 0, to: 3, weight: 2, id: 'edge-0-3' },
      { from: 1, to: 2, weight: 3, id: 'edge-1-2' },
      { from: 1, to: 3, weight: 5, id: 'edge-1-3' },
      { from: 1, to: 4, weight: 6, id: 'edge-1-4' },
      { from: 2, to: 4, weight: 1, id: 'edge-2-4' },
      { from: 3, to: 4, weight: 7, id: 'edge-3-4' }
    ]);
    resetVisualization();
    setEditMode(false);
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
    description: "Set up the graph and click 'Start MST' to begin",
    mstEdges: [],
    currentEdge: null,
    visitedVertices: new Set(),
    sortedEdges: [],
    sets: {},
    totalWeight: 0,
    action: 'ready',
    explanation: '',
    highlightedLine: null
  };

  // Update state based on current step
  useEffect(() => {
    if (currentStepData) {
      setMstEdges(currentStepData.mstEdges || []);
      setCurrentEdge(currentStepData.currentEdge);
      setVisitedVertices(currentStepData.visitedVertices || new Set());
      setSortedEdges(currentStepData.sortedEdges || []);
      setDisjointSets(currentStepData.sets || {});
      setTotalWeight(currentStepData.totalWeight || 0);
      setCurrentHighlightedLine(currentStepData.highlightedLine);
    }
  }, [currentStepData]);

  // Canvas drawing effect
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 500;
    
    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw MST visualization
    drawMSTVisualization(ctx, currentStepData);

  }, [currentStepData, vertices, edges]);

  const drawMSTVisualization = (ctx, stepData) => {
    // Draw edges first (so they appear behind vertices)
    edges.forEach(edge => {
      const fromVertex = vertices.find(v => v.id === edge.from);
      const toVertex = vertices.find(v => v.id === edge.to);
      
      if (!fromVertex || !toVertex) return;
      
      // Determine edge color and style
      let strokeColor = '#64748b';
      let lineWidth = 2;
      
      if (stepData.mstEdges?.some(mstEdge => mstEdge.id === edge.id)) {
        strokeColor = '#22c55e'; // Green for MST edges
        lineWidth = 4;
      } else if (stepData.currentEdge?.id === edge.id) {
        strokeColor = '#fbbf24'; // Yellow for current edge
        lineWidth = 4;
      }
      
      // Draw edge line
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(fromVertex.x, fromVertex.y);
      ctx.lineTo(toVertex.x, toVertex.y);
      ctx.stroke();
      
      // Draw weight
      const midX = (fromVertex.x + toVertex.x) / 2;
      const midY = (fromVertex.y + toVertex.y) / 2;
      
      // Weight background
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(midX - 15, midY - 12, 30, 24);
      
      // Weight border
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(midX - 15, midY - 12, 30, 24);
      
      // Weight text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(edge.weight.toString(), midX, midY + 4);
    });
    
    // Draw vertices
    vertices.forEach(vertex => {
      let fillColor = '#475569';
      let strokeColor = '#94a3b8';
      
      if (stepData.visitedVertices?.has(vertex.id)) {
        fillColor = '#22c55e';
        strokeColor = '#16a34a';
      }
      
      // Vertex circle
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 25, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Vertex label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(vertex.label, vertex.x, vertex.y + 5);
    });
    
    // Draw title and info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${algorithm === 'kruskal' ? "Kruskal's" : "Prim's"} Algorithm - MST`, 20, 30);
    
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(stepData.action?.replace('_', ' ').toUpperCase() || 'READY', 20, 55);
    
    // Draw current total weight
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`Total Weight: ${stepData.totalWeight}`, 20, canvas.height - 40);
    
    // Draw explanation
    if (stepData.explanation) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      const maxWidth = canvas.width - 40;
      const lines = wrapText(ctx, stepData.explanation, maxWidth);
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height - 20 + index * 15);
      });
    }
  };

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const mstCode = `// Kruskal's Algorithm using Union-Find
function kruskalMST(vertices, edges) {
  // Sort edges by weight (greedy choice)
  const sortedEdges = edges.sort((a, b) => a.weight - b.weight);
  
  // Initialize disjoint sets
  const parent = {};
  const rank = {};
  vertices.forEach(v => {
    parent[v] = v;
    rank[v] = 0;
  });
  
  // Union-Find operations
  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // Path compression
    }
    return parent[x];
  }
  
  function union(x, y) {
    const rootX = find(x);
    const rootY = find(y);
    
    if (rootX !== rootY) {
      // Union by rank
      if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
      } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
      } else {
        parent[rootY] = rootX;
        rank[rootX]++;
      }
      return true;
    }
    return false; // Cycle detected
  }
  
  const mst = [];
  let totalWeight = 0;
  
  // Process edges in order of increasing weight
  for (const edge of sortedEdges) {
    if (union(edge.from, edge.to)) {
      mst.push(edge);
      totalWeight += edge.weight;
      
      // Stop when we have V-1 edges
      if (mst.length === vertices.length - 1) {
        break;
      }
    }
  }
  
  return { mst, totalWeight };
}

// Prim's Algorithm using priority queue
function primMST(vertices, edges) {
  if (vertices.length === 0) return { mst: [], totalWeight: 0 };
  
  const visited = new Set();
  const mst = [];
  let totalWeight = 0;
  
  // Start with any vertex
  const startVertex = vertices[0];
  visited.add(startVertex);
  
  while (visited.size < vertices.length) {
    let minEdge = null;
    let minWeight = Infinity;
    
    // Find minimum weight edge crossing the cut
    for (const edge of edges) {
      const fromVisited = visited.has(edge.from);
      const toVisited = visited.has(edge.to);
      
      // Edge crosses the cut
      if ((fromVisited && !toVisited) || (!fromVisited && toVisited)) {
        if (edge.weight < minWeight) {
          minWeight = edge.weight;
          minEdge = edge;
        }
      }
    }
    
    if (minEdge) {
      // Add edge to MST
      mst.push(minEdge);
      totalWeight += minEdge.weight;
      
      // Add new vertex to visited set
      const newVertex = visited.has(minEdge.from) ? minEdge.to : minEdge.from;
      visited.add(newVertex);
    } else {
      break; // Graph is not connected
    }
  }
  
  return { mst, totalWeight };
}

// Optimized Prim's with priority queue
class PriorityQueue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element, priority) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }
  
  dequeue() {
    return this.items.shift();
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}

function primMSTOptimized(vertices, adjacencyList) {
  const visited = new Set();
  const mst = [];
  let totalWeight = 0;
  
  // Priority queue to store edges with their weights
  const pq = new PriorityQueue();
  
  // Start with vertex 0
  const startVertex = vertices[0];
  visited.add(startVertex);
  
  // Add all edges from start vertex to priority queue
  if (adjacencyList[startVertex]) {
    adjacencyList[startVertex].forEach(({ to, weight }) => {
      if (!visited.has(to)) {
        pq.enqueue({ from: startVertex, to, weight }, weight);
      }
    });
  }
  
  while (!pq.isEmpty() && visited.size < vertices.length) {
    const { element: edge } = pq.dequeue();
    
    // Skip if both vertices are already visited
    if (visited.has(edge.to)) continue;
    
    // Add edge to MST
    mst.push(edge);
    totalWeight += edge.weight;
    visited.add(edge.to);
    
    // Add all edges from newly added vertex
    if (adjacencyList[edge.to]) {
      adjacencyList[edge.to].forEach(({ to, weight }) => {
        if (!visited.has(to)) {
          pq.enqueue({ from: edge.to, to, weight }, weight);
        }
      });
    }
  }
  
  return { mst, totalWeight };
}

// Usage example:
const vertices = ['A', 'B', 'C', 'D', 'E'];
const edges = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'D', weight: 2 },
  { from: 'B', to: 'C', weight: 3 },
  { from: 'B', to: 'D', weight: 5 },
  { from: 'B', to: 'E', weight: 6 },
  { from: 'C', to: 'E', weight: 1 },
  { from: 'D', to: 'E', weight: 7 }
];

console.log('Kruskal MST:', kruskalMST(vertices, edges));
console.log('Prim MST:', primMST(vertices, edges));

// Time Complexity:
// Kruskal's: O(E log E) - dominated by edge sorting
// Prim's: O(E log V) with binary heap, O(E + V log V) with Fibonacci heap
// Space Complexity: O(V) for both algorithms

// When to use which:
// - Kruskal's: Better for sparse graphs (few edges)
// - Prim's: Better for dense graphs (many edges)
// - Both produce the same MST (if edge weights are unique)`;

  const presets = [
    {
      name: "Small Graph",
      vertices: [
        { id: 0, x: 200, y: 150, label: 'A' },
        { id: 1, x: 400, y: 100, label: 'B' },
        { id: 2, x: 350, y: 250, label: 'C' }
      ],
      edges: [
        { from: 0, to: 1, weight: 5, id: 'edge-0-1' },
        { from: 1, to: 2, weight: 3, id: 'edge-1-2' },
        { from: 0, to: 2, weight: 8, id: 'edge-0-2' }
      ]
    },
    {
      name: "Dense Graph",
      vertices: [
        { id: 0, x: 150, y: 120, label: 'A' },
        { id: 1, x: 350, y: 80, label: 'B' },
        { id: 2, x: 550, y: 120, label: 'C' },
        { id: 3, x: 250, y: 250, label: 'D' },
        { id: 4, x: 450, y: 250, label: 'E' }
      ],
      edges: [
        { from: 0, to: 1, weight: 2, id: 'edge-0-1' },
        { from: 0, to: 3, weight: 6, id: 'edge-0-3' },
        { from: 1, to: 2, weight: 3, id: 'edge-1-2' },
        { from: 1, to: 3, weight: 8, id: 'edge-1-3' },
        { from: 1, to: 4, weight: 5, id: 'edge-1-4' },
        { from: 2, to: 4, weight: 7, id: 'edge-2-4' },
        { from: 3, to: 4, weight: 9, id: 'edge-3-4' }
      ]
    }
  ];

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
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Minimum Spanning Tree</h1>
            <p className="text-gray-400 text-sm">
              Kruskal's: O(E log E) | Prim's: O(E log V) | Greedy Algorithm
            </p>
          </div>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Controls */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full bg-slate-800 border-r border-purple-500 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Algorithm Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Algorithm</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setAlgorithm('kruskal');
                      resetVisualization();
                    }}
                    className={`p-3 rounded-lg border transition-colors ${
                      algorithm === 'kruskal'
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-slate-700 border-gray-600 hover:bg-slate-600'
                    }`}
                  >
                    <GitBranch className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs">Kruskal's</div>
                  </button>
                  <button
                    onClick={() => {
                      setAlgorithm('prim');
                      resetVisualization();
                    }}
                    className={`p-3 rounded-lg border transition-colors ${
                      algorithm === 'prim'
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-slate-700 border-gray-600 hover:bg-slate-600'
                    }`}
                  >
                    <Zap className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs">Prim's</div>
                  </button>
                </div>
              </div>

              {/* Graph Info */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-2">Graph Info</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vertices:</span>
                    <span className="text-blue-400">{vertices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Edges:</span>
                    <span className="text-green-400">{edges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">MST Edges:</span>
                    <span className="text-purple-400">{vertices.length - 1}</span>
                  </div>
                </div>
              </div>

              {/* Edit Mode */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Graph Editor</h3>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="p-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    {editMode ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </button>
                </div>
                
                {editMode && (
                  <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                    <div className="text-sm font-medium">Add Edge</div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        placeholder="From"
                        value={newEdgeFrom}
                        onChange={(e) => setNewEdgeFrom(e.target.value)}
                        className="p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                        min="0"
                        max={vertices.length - 1}
                      />
                      <input
                        type="number"
                        placeholder="To"
                        value={newEdgeTo}
                        onChange={(e) => setNewEdgeTo(e.target.value)}
                        className="p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                        min="0"
                        max={vertices.length - 1}
                      />
                      <input
                        type="number"
                        placeholder="Weight"
                        value={newEdgeWeight}
                        onChange={(e) => setNewEdgeWeight(e.target.value)}
                        className="p-2 bg-slate-600 rounded text-sm border border-gray-500 focus:border-purple-500 focus:outline-none"
                        min="1"
                      />
                    </div>
                    <button
                      onClick={addEdge}
                      className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-500 transition-colors text-sm"
                    >
                      Add Edge
                    </button>
                    
                    <div className="text-sm font-medium mt-4">Current Edges</div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {edges.map((edge) => (
                        <div key={edge.id} className="flex items-center justify-between p-2 bg-slate-600 rounded text-xs">
                          <span>
                            {vertices[edge.from]?.label}-{vertices[edge.to]?.label} ({edge.weight})
                          </span>
                          <button
                            onClick={() => removeEdge(edge)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Presets */}
              <div>
                <label className="block text-sm font-medium mb-2">Example Graphs</label>
                <div className="space-y-2">
                  {presets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setVertices(preset.vertices);
                        setEdges(preset.edges);
                        resetVisualization();
                        setEditMode(false);
                      }}
                      disabled={playing}
                      className="w-full text-left p-2 bg-slate-700 rounded text-sm hover:bg-slate-600 disabled:opacity-50 transition-colors"
                    >
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-400">
                        V: {preset.vertices.length}, E: {preset.edges.length}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <button
                  onClick={startMST}
                  disabled={playing || vertices.length < 2 || edges.length === 0}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Network className="w-4 h-4" />
                  <span>Start MST</span>
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
                  <span>Reset</span>
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

              {/* Results */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>MST Results</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Algorithm:</span>
                    <span className="text-blue-400 font-mono capitalize">{algorithm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">MST Edges:</span>
                    <span className="text-green-400 font-mono">{mstEdges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Weight:</span>
                    <span className="text-purple-400 font-mono">{totalWeight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Complete:</span>
                    <span className={`font-mono ${mstEdges.length === vertices.length - 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {mstEdges.length === vertices.length - 1 ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* Middle Panel - Visualization */}
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full bg-slate-900 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-5xl">
              {/* Description */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">
                  {algorithm === 'kruskal' ? "Kruskal's" : "Prim's"} Algorithm Visualization
                </h2>
                <p className="text-gray-400">{currentStepData.description}</p>
              </div>

              {/* Canvas Visualization */}
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-700 rounded-lg bg-slate-800/50"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
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
                  code={mstCode}
                  language="javascript"
                  highlightedLine={currentHighlightedLine}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Minimum Spanning Tree</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Find the minimum cost tree that connects all vertices in a weighted undirected graph.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Kruskal's Algorithm:</h4>
                    <ol className="text-sm space-y-1 text-gray-300 list-decimal list-inside">
                      <li>Sort all edges by weight</li>
                      <li>Initialize disjoint sets for each vertex</li>
                      <li>For each edge (in sorted order):</li>
                      <li className="ml-4">• Check if it creates a cycle</li>
                      <li className="ml-4">• If not, add to MST and union sets</li>
                      <li>Stop when MST has V-1 edges</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Prim's Algorithm:</h4>
                    <ol className="text-sm space-y-1 text-gray-300 list-decimal list-inside">
                      <li>Start with any vertex</li>
                      <li>Maintain set of visited vertices</li>
                      <li>Repeat until all vertices visited:</li>
                      <li className="ml-4">• Find minimum weight edge crossing cut</li>
                      <li className="ml-4">• Add edge and new vertex to MST</li>
                      <li>Result: minimum spanning tree</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Complexity Analysis:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-blue-900/30 rounded p-2">
                        <div className="text-blue-400 font-mono text-xs mb-1">Kruskal's:</div>
                        <div className="text-xs">Time: O(E log E), Space: O(V)</div>
                      </div>
                      <div className="bg-green-900/30 rounded p-2">
                        <div className="text-green-400 font-mono text-xs mb-1">Prim's:</div>
                        <div className="text-xs">Time: O(E log V), Space: O(V)</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">When to Use Which:</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="bg-purple-900/30 rounded p-2">
                        <div className="text-purple-400 font-mono text-xs mb-1">Kruskal's:</div>
                        <div className="text-xs">Better for sparse graphs (few edges)</div>
                      </div>
                      <div className="bg-orange-900/30 rounded p-2">
                        <div className="text-orange-400 font-mono text-xs mb-1">Prim's:</div>
                        <div className="text-xs">Better for dense graphs (many edges)</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Applications:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Network design (cables, roads)</li>
                      <li>• Circuit design optimization</li>
                      <li>• Cluster analysis</li>
                      <li>• Approximation algorithms</li>
                      <li>• Image segmentation</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Properties:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>• Unique if all edge weights distinct</li>
                      <li>• Always has exactly V-1 edges</li>
                      <li>• Removing any edge disconnects tree</li>
                      <li>• Adding any edge creates cycle</li>
                      <li>• Total weight is minimum possible</li>
                    </ul>
                  </div>

                  {started && (
                    <div>
                      <h4 className="font-medium mb-2">Current State:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Algorithm:</span>
                          <span className="text-blue-400 font-mono capitalize">{algorithm}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Action:</span>
                          <span className="text-white font-mono capitalize">
                            {currentStepData.action?.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">MST Edges:</span>
                          <span className="text-green-400 font-mono">{mstEdges.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Weight:</span>
                          <span className="text-purple-400 font-mono">{totalWeight}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Completed:</span>
                          <span className={`font-mono ${mstEdges.length === vertices.length - 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {Math.round((mstEdges.length / Math.max(1, vertices.length - 1)) * 100)}%
                          </span>
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

export default MST;
