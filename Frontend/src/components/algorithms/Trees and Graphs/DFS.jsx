import React, { useState, useEffect, useRef } from "react";
import cytoscape from "../../../utils/cytoscapeSetup.js";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";

import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Layers,
  GitBranch, Zap, TrendingUp, Eye, ChevronDown, Info, Sparkles,
  FastForward, Rewind, Menu, X as XIcon, Home, BookOpen, ArrowLeftRight
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";
import { dfs as dfsCode } from "../../../algorithms/codeExamples.js";

export default function DFSRecursiveVisualizer() {
  // Separate refs for desktop and mobile canvases so we mount Cytoscape in the visible one only
  const cyRef = useRef(null); // desktop (lg and up)
  const mobileCyRef = useRef(null); // mobile / tablet (< lg)
  const cyInstance = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Graph state
  const [numNodes, setNumNodes] = useState(8);
  const [edgeList, setEdgeList] = useState(
    "1-2,1-3,2-4,2-5,3-5,3-6,4-7,5-7,5-8,6-8"
  );
  const [graphType, setGraphType] = useState("undirected");
  const [startNode, setStartNode] = useState("1");

  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(500);

  // Scroll to top on mount to prevent auto-scroll issue
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // UI state
  const [activeRightTab, setActiveRightTab] = useState("stats");
  const [edgeValidationError, setEdgeValidationError] = useState("");
  const [isValidGraph, setIsValidGraph] = useState(false);
  const [currentHighlightedLine, setCurrentHighlightedLine] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);
  // Mobile enhanced UI state
  const [showCodeDrawer, setShowCodeDrawer] = useState(false);
  const [mobileAccordions, setMobileAccordions] = useState({
    settings: false,
    stats: true,
    timing: false,
    stack: false,
    complexity: false,
  });
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
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Leave
          </button>
          <button
            onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl"
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

          if (from < 1 || to < 1 || from > nodeCount || to > nodeCount) {
            throw new Error(
              `Edge "${pair}" contains invalid node indices. Must be between 1 and ${nodeCount}`
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

  // Recursive DFS step computation
  const computeDFSRecursiveSteps = (nodesCount, edgesArr, start) => {
    const adj = {};
    for (let i = 1; i <= nodesCount; i++) adj[i] = [];

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

    const dfs = (node) => {
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

    dfs(startNodeNum);

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
    // Decide which container to mount into based on current viewport width (Tailwind lg breakpoint ~1024px)
    const targetContainer = (window.innerWidth >= 1024 ? cyRef.current : mobileCyRef.current);
    if (!targetContainer) return; // safety guard if ref not yet assigned

    const cy = cytoscape({
      container: targetContainer,
      elements: {
        nodes: Array.from({ length: numNodes }, (_, i) => ({
          data: { id: `${i + 1}`, label: `${i + 1}` },
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
            "background-color": theme === 'dark' ? "#475569" : "#cbd5e1",
            "border-width": 3,
            "border-color": theme === 'dark' ? "#94a3b8" : "#64748b",
            "text-valign": "center",
            "text-halign": "center",
            color: theme === 'dark' ? "#ffffff" : "#000000",
            "font-size": "18px",
            "font-weight": "bold",
            width: 50,
            height: 50,
            "text-outline-width": 2,
            "text-outline-color": theme === 'dark' ? "#000000" : "#ffffff",
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
            "line-color": theme === 'dark' ? "#64748b" : "#94a3b8",
            "curve-style": "bezier",
            "target-arrow-shape": graphType === "directed" ? "triangle" : "triangle",
            "target-arrow-color": theme === 'dark' ? "#64748b" : "#94a3b8",
            "arrow-scale": 1.5,
            "source-arrow-shape": graphType === "undirected" ? "triangle" : "none",
            "source-arrow-color": theme === 'dark' ? "#64748b" : "#94a3b8",
          },
        },
        {
          selector: "edge.treeEdge",
          style: {
            width: 4,
            "line-color": "#10b981",
            "target-arrow-color": "#10b981",
            "source-arrow-color": "#10b981",
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
            "source-arrow-color": "#f59e0b",
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

  // UI Helper Functions
  const getProgressValue = () => {
    if (!started || !steps.length) return "0";
    return `${Math.round(((currentStep + 1) / steps.length) * 100)}`;
  };

  const getProgressPercentage = () => {
    if (!steps.length) return 0;
    return ((currentStep + 1) / steps.length) * 100;
  };

  // UI Components
  const TabButton = ({ id, icon: Icon, label, className = "" }) => (
    <button
      onClick={() => setActiveRightTab(id)}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeRightTab === id
        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105"
        : theme === 'dark'
          ? "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
        } ${className}`}
    >
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const StatCard = ({ icon: Icon, value, label, color = "cyan", className = "" }) => {
    const colorClasses = {
      cyan: theme === 'dark'
        ? "from-cyan-500/20 to-blue-500/20 border-cyan-500/30"
        : "from-cyan-100 to-blue-100 border-cyan-300",
      green: theme === 'dark'
        ? "from-green-500/20 to-emerald-500/20 border-green-500/30"
        : "from-green-100 to-emerald-100 border-green-300",
      amber: theme === 'dark'
        ? "from-amber-500/20 to-orange-500/20 border-amber-500/30"
        : "from-amber-100 to-orange-100 border-amber-300",
      red: theme === 'dark'
        ? "from-red-500/20 to-pink-500/20 border-red-500/30"
        : "from-red-100 to-pink-100 border-red-300",
    };

    const iconColors = {
      cyan: theme === 'dark' ? "text-cyan-400" : "text-cyan-600",
      green: theme === 'dark' ? "text-green-400" : "text-green-600",
      amber: theme === 'dark' ? "text-amber-400" : "text-amber-600",
      red: theme === 'dark' ? "text-red-400" : "text-red-600",
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 backdrop-blur-sm shadow-lg ${className}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-white/50'}`}>
            <Icon size={20} className={iconColors[color]} />
          </div>
          <div className="min-w-0 flex-1">
            <div className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>
              {value}
            </div>
            <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
              {label}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ControlButton = ({ onClick, disabled, icon: Icon, label, variant = "primary", className = "" }) => {
    const variants = {
      primary: disabled
        ? theme === 'dark' ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white hover:scale-105 shadow-lg",
      success: disabled
        ? theme === 'dark' ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-105 shadow-lg",
      danger: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white hover:scale-105 shadow-lg",
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${variants[variant]} ${className}`}
        title={label}
      >
        <Icon size={18} />
        <span className="hidden sm:inline text-sm">{label}</span>
      </button>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'}`}>
      {/* Modern Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b shadow-lg ${theme === 'dark' ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
        <div className="px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={handleBack}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-300 hover:scale-110 flex-shrink-0 ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              title="Go back"
            >
              <ArrowLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <GitBranch size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h1 className={`text-base sm:text-xl lg:text-2xl font-black truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  DFS Visualizer
                </h1>
                <p className={`text-xs sm:text-sm hidden sm:block ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  Recursive Depth-First Search
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Graph Type Badge - Hidden on mobile */}
            <div className={`hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl shadow-md ${theme === 'dark' ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-100'
              }`}>
              <Layers className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <span className={`text-xs sm:text-sm font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                {graphType === 'directed' ? 'Directed' : 'Undirected'}
              </span>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
            >
              {isMobileMenuOpen ? (
                <XIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              ) : (
                <Menu className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Stats Bar */}
        <div className={`lg:hidden px-4 pb-3 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="grid grid-cols-4 gap-2 mt-3">
            <div className={`text-center p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
              <div className={`text-lg font-black ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                {steps[currentStep] ? [...steps[currentStep].visited].length : 0}
              </div>
              <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                Visited
              </div>
            </div>
            <div className={`text-center p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
              <div className={`text-lg font-black ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                {steps[currentStep] ? steps[currentStep].callStack.length : 0}
              </div>
              <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                Stack
              </div>
            </div>
            <div className={`text-center p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
              <div className={`text-lg font-black ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                {numNodes}
              </div>
              <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                Nodes
              </div>
            </div>
            <div className={`text-center p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
              <div className={`text-lg font-black ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`}>
                {getProgressValue()}%
              </div>
              <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                Done
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Desktop Layout (3-panel) */}
        <div className="hidden lg:block h-full">
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
              defaultSize={22}
              minSize={18}
              maxSize={35}
              onResize={() => setIsResizing(true)}
            >
              <div className={`h-full border-r flex flex-col ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-xl border-white/10' : 'bg-white/80 border-gray-200'
                }`}>
                {/* Settings Header */}
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                      <Settings size={18} className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} />
                    </div>
                    <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Configuration
                    </h2>
                  </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
                  {/* Graph Type */}
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                      Graph Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["undirected", "directed"].map(type => (
                        <button
                          key={type}
                          onClick={() => {
                            if (graphType !== type) {
                              setPlaying(false);
                              setStarted(false);
                              setCurrentStep(0);
                            }
                            setGraphType(type);
                          }}
                          className={`py-2.5 px-3 rounded-xl font-bold transition-all duration-300 text-sm ${graphType === type
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105"
                            : theme === 'dark'
                              ? "bg-white/5 text-slate-300 hover:bg-white/10"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Number of Nodes */}
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                      Number of Nodes
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="20"
                      value={numNodes}
                      onChange={e => {
                        const value = e.target.value;
                        if (value === '') {
                          setNumNodes('');
                        } else {
                          const num = parseInt(value, 10);
                          setNumNodes(isNaN(num) ? 3 : Math.max(3, Math.min(20, num)));
                        }
                      }}
                      onBlur={e => {
                        if (e.target.value === '' || parseInt(e.target.value) < 3) {
                          setNumNodes(3);
                        }
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl font-semibold transition-all duration-300 focus:ring-2 ${theme === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white focus:ring-cyan-500/50 focus:border-cyan-500'
                        : 'bg-gray-100 border border-gray-200 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'
                        }`}
                    />
                  </div>

                  {/* Edges */}
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                      Edges (format: 1-2,2-3)
                    </label>
                    <textarea
                      rows={3}
                      value={edgeList}
                      onChange={e => setEdgeList(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl font-mono text-sm resize-none transition-all duration-300 focus:ring-2 ${theme === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white focus:ring-cyan-500/50 focus:border-cyan-500'
                        : 'bg-gray-100 border border-gray-200 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'
                        }`}
                      placeholder="1-2,2-3,3-4..."
                    />
                    {edgeValidationError && (
                      <div className={`mt-2 flex items-start gap-2 p-2.5 rounded-lg border text-xs ${theme === 'dark' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' : 'bg-yellow-100 border-yellow-300 text-yellow-700'
                        }`}>
                        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                        <span className="font-semibold">{edgeValidationError}</span>
                      </div>
                    )}
                  </div>

                  {/* Start Node */}
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                      Start Node
                    </label>
                    <select
                      value={startNode}
                      onChange={e => setStartNode(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl font-semibold transition-all duration-300 focus:ring-2 ${theme === 'dark'
                        ? 'bg-white/10 border border-white/20 text-white focus:ring-cyan-500/50 focus:border-cyan-500'
                        : 'bg-gray-100 border border-gray-200 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'
                        }`}
                    >
                      {Array.from({ length: numNodes }, (_, i) => (
                        <option key={i + 1} value={`${i + 1}`} className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>
                          Node {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateGraph}
                    disabled={!isValidGraph}
                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 shadow-xl ${isValidGraph
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 text-white"
                      : theme === 'dark'
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles size={18} />
                      <span>Generate Graph</span>
                    </div>
                  </button>

                  {/* Playback Controls */}
                  <div className={`pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                    <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <Play size={16} />
                      Playback Controls
                    </h3>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <ControlButton
                        onClick={() => {
                          if (!steps.length) return;
                          setStarted(true);
                          setPlaying(!playing);
                        }}
                        disabled={steps.length === 0}
                        icon={playing ? Pause : Play}
                        label={playing ? "Pause" : "Play"}
                        variant="success"
                      />
                      <ControlButton
                        onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
                        disabled={currentStep >= steps.length - 1}
                        icon={SkipForward}
                        label="Step"
                        variant="primary"
                      />
                      <ControlButton
                        onClick={() => setCurrentStep(Math.max(currentStep - 1, 0))}
                        disabled={currentStep <= 0}
                        icon={Rewind}
                        label="Back"
                        variant="primary"
                      />
                      <ControlButton
                        onClick={() => {
                          setPlaying(false);
                          setCurrentStep(0);
                          setStarted(false);
                        }}
                        icon={RotateCcw}
                        label="Reset"
                        variant="danger"
                      />
                    </div>

                    {/* Speed Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                          Speed
                        </label>
                        <span className={`text-xs font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          {speed}ms
                        </span>
                      </div>
                      <input
                        type="range"
                        min={100}
                        max={2000}
                        step={100}
                        value={speed}
                        onChange={e => setSpeed(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                      />
                      <div className={`flex justify-between text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                        <span>Fast</span>
                        <span>Slow</span>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className={`rounded-xl p-4 border ${theme === 'dark' ? 'bg-white/5 backdrop-blur-sm border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Legend
                    </h4>
                    <div className="space-y-2">
                      {[
                        { color: "bg-gray-500", label: "Unvisited" },
                        { color: "bg-blue-500", label: "In Stack" },
                        { color: "bg-red-500", label: "Current" },
                        { color: "bg-green-500", label: "Visited" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${item.color} rounded-full shadow-md`}></div>
                          <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className={`w-0.5 transition-all duration-200 cursor-col-resize flex items-center justify-center group relative ${theme === 'dark' ? 'bg-white/10 hover:bg-cyan-500/70 hover:w-2' : 'bg-gray-300 hover:bg-cyan-500 hover:w-2'
              }`}>
              <div className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ${theme === 'dark' ? 'bg-gray-800 border-cyan-500' : 'bg-white border-cyan-500'
                }`}>
                <ArrowLeftRight size={14} className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} />
              </div>
            </PanelResizeHandle>

            {/* Center Panel - Canvas */}
            <Panel minSize={40} maxSize={70}>
              <div className="h-full flex flex-col p-4">
                {/* Canvas Controls Bar */}
                <div className={`mb-4 p-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 backdrop-blur-sm border-white/10' : 'bg-white/80 border-gray-200'
                  }`}>
                  <div className="flex items-center justify-between gap-4">
                    {/* Progress Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Activity className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                      <div className="min-w-0 flex-1">
                        <div className={`text-xs font-semibold mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                          Step {currentStep + 1} of {steps.length}
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}>
                          <div
                            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage()}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Current Action */}
                    {steps[currentStep] && (
                      <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${theme === 'dark' ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'
                        }`}>
                        <Zap className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                        <span className={`text-sm font-bold truncate max-w-xs ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
                          }`}>
                          {steps[currentStep].action}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 overflow-hidden">
                  <div
                    ref={cyRef}
                    className={`w-full h-full rounded-2xl border shadow-2xl ${theme === 'dark' ? 'bg-slate-800/30 backdrop-blur-sm border-white/10' : 'bg-white border-gray-200'
                      }`}
                  />
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className={`w-0.5 transition-all duration-200 cursor-col-resize flex items-center justify-center group relative ${theme === 'dark' ? 'bg-white/10 hover:bg-cyan-500/70 hover:w-2' : 'bg-gray-300 hover:bg-cyan-500 hover:w-2'
              }`}>
              <div className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ${theme === 'dark' ? 'bg-gray-800 border-cyan-500' : 'bg-white border-cyan-500'
                }`}>
                <ArrowLeftRight size={14} className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} />
              </div>
            </PanelResizeHandle>

            {/* Right Panel - Stats & Code */}
            <Panel
              defaultSize={25}
              minSize={20}
              maxSize={40}
              onResize={() => setIsResizing(true)}
            >
              <div className={`h-full border-l flex flex-col ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-xl border-white/10' : 'bg-white/80 border-gray-200'
                }`}>
                {/* Tab Navigation */}
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="grid grid-cols-2 gap-2">
                    <TabButton id="stats" icon={BarChart3} label="Stats" />
                    <TabButton id="algorithm" icon={Code2} label="Code" />
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  {activeRightTab === "stats" && (
                    <div className="space-y-4">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <StatCard
                          icon={Target}
                          value={steps[currentStep] ? [...steps[currentStep].visited].length : 0}
                          label="Visited"
                          color="green"
                        />
                        <StatCard
                          icon={Activity}
                          value={steps[currentStep] ? steps[currentStep].callStack.length : 0}
                          label="Stack"
                          color="cyan"
                        />
                        <StatCard
                          icon={Maximize2}
                          value={numNodes}
                          label="Nodes"
                          color="amber"
                        />
                        <StatCard
                          icon={Clock}
                          value={`${getProgressValue()}%`}
                          label="Progress"
                          color="red"
                        />
                      </div>

                      {/* Node Timing */}
                      <div className={`rounded-xl p-4 border ${theme === 'dark' ? 'bg-white/5 backdrop-blur-sm border-white/10' : 'bg-gray-50 border-gray-200'
                        }`}>
                        <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                          <Clock size={16} />
                          Node Timing
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                          {Array.from({ length: numNodes }, (_, i) => {
                            const nodeId = i + 1;
                            const discovery = steps[currentStep]?.discovery[nodeId] || "";
                            const finish = steps[currentStep]?.finish[nodeId] || "";
                            const isCurrent = steps[currentStep]?.current === nodeId;
                            const inStack = steps[currentStep]?.callStack.includes(nodeId);
                            const visited = steps[currentStep]?.visited.has(nodeId);

                            return (
                              <div
                                key={nodeId}
                                className={`flex flex-col items-center justify-center rounded-lg p-2 text-center border transition-all duration-300 ${isCurrent
                                  ? theme === 'dark' ? "bg-red-500/20 border-red-500/50 scale-105" : "bg-red-100 border-red-300 scale-105"
                                  : inStack
                                    ? theme === 'dark' ? "bg-blue-500/20 border-blue-500/30" : "bg-blue-100 border-blue-300"
                                    : visited
                                      ? theme === 'dark' ? "bg-green-500/20 border-green-500/30" : "bg-green-100 border-green-300"
                                      : theme === 'dark' ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-200"
                                  }`}
                              >
                                <div className={`text-xs font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {nodeId}
                                </div>
                                <div className="flex flex-col gap-0.5 text-xs font-semibold">
                                  {discovery && (
                                    <div className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
                                      D:{discovery}
                                    </div>
                                  )}
                                  {finish && (
                                    <div className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}>
                                      F:{finish}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Call Stack */}
                      {steps[currentStep] && (
                        <div className={`rounded-xl p-4 border ${theme === 'dark' ? 'bg-white/5 backdrop-blur-sm border-white/10' : 'bg-gray-50 border-gray-200'
                          }`}>
                          <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                            <Layers size={16} />
                            Call Stack
                            <span className={`ml-auto text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                              }`}>
                              Depth: {steps[currentStep].callStack.length}
                            </span>
                          </h3>

                          <div className={`flex flex-col space-y-2 max-h-48 overflow-y-auto p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-white'
                            } custom-scrollbar`}>
                            {steps[currentStep].callStack.length === 0 ? (
                              <div className={`text-center py-6 text-sm font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                Stack is empty
                              </div>
                            ) : (
                              [...steps[currentStep].callStack].reverse().map((node, index) => {
                                const isTop = index === 0;
                                return (
                                  <div
                                    key={index}
                                    className={`p-3 rounded-lg border transition-all duration-300 ${isTop
                                      ? theme === 'dark' ? "bg-red-500/20 border-red-500/40" : "bg-red-100 border-red-300"
                                      : theme === 'dark' ? "bg-blue-500/20 border-blue-500/30" : "bg-blue-100 border-blue-300"
                                      }`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${isTop ? "bg-red-500" : "bg-blue-500"}`}></div>
                                        <span className={`font-mono font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                          }`}>
                                          Node {node}
                                        </span>
                                      </div>
                                      <div className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                                        }`}>
                                        #{steps[currentStep].callStack.length - index}
                                      </div>
                                    </div>
                                    {steps[currentStep].discovery[node] && (
                                      <div className="mt-2 flex justify-between text-xs font-semibold">
                                        <span className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
                                          D: {steps[currentStep].discovery[node]}
                                        </span>
                                        <span className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}>
                                          F: {steps[currentStep].finish[node] || "?"}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}

                      {/* Complexity Info */}
                      <div className={`rounded-xl p-4 border ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20' : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200'
                        }`}>
                        <h4 className={`text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Complexity
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className={`font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                              Time:
                            </span>
                            <span className={`font-mono font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                              O(V + E)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                              Space:
                            </span>
                            <span className={`font-mono font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                              O(V)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeRightTab === "algorithm" && (
                    <div className="space-y-4">
                      <div className={`rounded-xl border overflow-hidden ${theme === 'dark' ? 'bg-slate-800/50 backdrop-blur-sm border-white/10' : 'bg-white border-gray-200'
                        }`}>
                        <div className={`flex items-center gap-2 p-3 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                          }`}>
                          <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                            <Code2 size={16} className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} />
                          </div>
                          <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            DFS Implementation
                          </h3>
                        </div>
                        <BasicCodeDisplay
                          cppCode={dfsCode.cpp}
                          pythonCode={dfsCode.python}
                          jsCode={dfsCode.javascript}
                          highlightedLine={currentHighlightedLine}
                          className="min-h-[400px]"
                        />
                      </div>

                      {/* Algorithm Info */}
                      <div className={`rounded-xl p-4 border ${theme === 'dark' ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20' : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                        }`}>
                        <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                          <Info size={16} />
                          Edge Types
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                            <span className={`font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                              Tree Edges:
                            </span>
                            <span className={`ml-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                              Part of DFS tree
                            </span>
                          </div>
                          <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                            <span className={`font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                              Back Edges:
                            </span>
                            <span className={`ml-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                              Indicate cycles
                            </span>
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

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex flex-col relative">
          {/* Mobile Canvas Area */}
          <div className="p-3 sm:p-4 overflow-visible">
            <div className="flex flex-col">
              {/* Mobile Action Display */}
              {steps[currentStep] && (
                <div className={`mb-3 p-3 rounded-xl border ${theme === 'dark' ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    <Zap className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    <span className={`text-xs sm:text-sm font-bold truncate ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
                      }`}>
                      {steps[currentStep].action}
                    </span>
                  </div>
                </div>
              )}

              {/* Canvas (mobile Cytoscape mount) with floating controls */}
              <div className="mb-4 relative">
                <div
                  ref={mobileCyRef}
                  className={`w-full h-[55vh] rounded-2xl border shadow-xl ${theme === 'dark' ? 'bg-slate-800/30 backdrop-blur-sm border-white/10' : 'bg-white border-gray-200'
                    }`}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-slate-900/70 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2 rounded-xl shadow-xl">
                  <ControlButton
                    onClick={() => {
                      if (!steps.length) return;
                      setStarted(true);
                      setPlaying(!playing);
                    }}
                    disabled={steps.length === 0}
                    icon={playing ? Pause : Play}
                    label={playing ? 'Pause' : 'Play'}
                    variant="success"
                    className="!py-2 !px-3"
                  />
                  <ControlButton
                    onClick={() => setCurrentStep(Math.max(currentStep - 1, 0))}
                    disabled={currentStep <= 0}
                    icon={Rewind}
                    label="Back"
                    variant="primary"
                    className="!py-2 !px-3"
                  />
                  <ControlButton
                    onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
                    disabled={currentStep >= steps.length - 1}
                    icon={SkipForward}
                    label="Next"
                    variant="primary"
                    className="!py-2 !px-3"
                  />
                  <ControlButton
                    onClick={() => {
                      setPlaying(false);
                      setCurrentStep(0);
                      setStarted(false);
                    }}
                    icon={RotateCcw}
                    label="Reset"
                    variant="danger"
                    className="!py-2 !px-3"
                  />
                </div>
                <button
                  onClick={() => setShowCodeDrawer(true)}
                  className="absolute bottom-4 right-4 p-3 rounded-full shadow-xl font-bold transition-all duration-300 bg-gradient-to-br from-cyan-500 to-blue-600 text-white hover:scale-110"
                  aria-label="Open Code"
                >
                  <Code2 size={20} />
                </button>
              </div>

              {/* Mobile Progress Bar */}
              <div className={`mt-3 p-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 backdrop-blur-sm border-white/10' : 'bg-white/80 border-gray-200'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                    Step {currentStep + 1} / {steps.length}
                  </span>
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    {getProgressValue()}%
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <div
                    className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Removed sticky bottom control panel in favor of floating overlay */}
        </div>

        {/* Mobile Side Panel */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className={`absolute right-0 top-0 bottom-0 w-full max-w-md transform transition-transform duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'
                } shadow-2xl overflow-y-auto`}
              onClick={e => e.stopPropagation()}
            >
              {/* Panel Header */}
              <div className={`sticky top-0 z-10 p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'
                }`}>
                <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {activeRightTab === 'settings' && 'Settings'}
                  {activeRightTab === 'algorithm' && 'Algorithm'}
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                >
                  <XIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                </button>
              </div>

              {/* Panel Content */}
              <div className="p-4">
                {activeRightTab === 'settings' && (
                  <div className="space-y-5">
                    {/* Graph Type */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                        Graph Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["undirected", "directed"].map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              if (graphType !== type) {
                                setPlaying(false);
                                setStarted(false);
                                setCurrentStep(0);
                              }
                              setGraphType(type);
                            }}
                            className={`py-3 px-4 rounded-xl font-bold transition-all duration-300 ${graphType === type
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                              : theme === 'dark'
                                ? "bg-white/5 text-slate-300"
                                : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Number of Nodes */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                        Number of Nodes
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="20"
                        value={numNodes}
                        onChange={e => setNumNodes(parseInt(e.target.value) || 3)}
                        className={`w-full px-4 py-3 rounded-xl font-semibold ${theme === 'dark'
                          ? 'bg-white/10 border border-white/20 text-white'
                          : 'bg-gray-100 border border-gray-200 text-gray-900'
                          }`}
                      />
                    </div>

                    {/* Edges */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                        Edges (format: 0-1,1-2)
                      </label>
                      <textarea
                        rows={4}
                        value={edgeList}
                        onChange={e => setEdgeList(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl font-mono text-sm resize-none ${theme === 'dark'
                          ? 'bg-white/10 border border-white/20 text-white'
                          : 'bg-gray-100 border border-gray-200 text-gray-900'
                          }`}
                        placeholder="0-1,1-2,2-3..."
                      />
                      {edgeValidationError && (
                        <div className={`mt-2 flex items-start gap-2 p-3 rounded-lg border text-xs ${theme === 'dark' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' : 'bg-yellow-100 border-yellow-300 text-yellow-700'
                          }`}>
                          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                          <span className="font-semibold">{edgeValidationError}</span>
                        </div>
                      )}
                    </div>

                    {/* Start Node */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                        Start Node
                      </label>
                      <select
                        value={startNode}
                        onChange={e => setStartNode(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl font-semibold ${theme === 'dark'
                          ? 'bg-white/10 border border-white/20 text-white'
                          : 'bg-gray-100 border border-gray-200 text-gray-900'
                          }`}
                      >
                        {Array.from({ length: numNodes }, (_, i) => (
                          <option key={i} value={`${i}`} className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>
                            Node {i}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Generate Button */}
                    <button
                      onClick={() => {
                        handleGenerateGraph();
                        setIsMobileMenuOpen(false);
                      }}
                      disabled={!isValidGraph}
                      className={`w-full py-4 rounded-xl font-bold transition-all duration-300 shadow-xl ${isValidGraph
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : theme === 'dark'
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      Generate Graph
                    </button>

                    {/* Speed Control */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                          Animation Speed
                        </label>
                        <span className={`text-sm font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          {speed}ms
                        </span>
                      </div>
                      <input
                        type="range"
                        min={100}
                        max={2000}
                        step={100}
                        value={speed}
                        onChange={e => setSpeed(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                      />
                      <div className={`flex justify-between text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                        <span>Fast</span>
                        <span>Slow</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className={`rounded-xl p-4 border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                      }`}>
                      <h4 className={`text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Legend
                      </h4>
                      <div className="space-y-2">
                        {[
                          { color: "bg-gray-500", label: "Unvisited nodes" },
                          { color: "bg-blue-500", label: "In call stack" },
                          { color: "bg-red-500", label: "Current node" },
                          { color: "bg-green-500", label: "Visited nodes" },
                          { color: "bg-green-500", label: "Tree edges", border: true },
                          { color: "bg-yellow-500", label: "Back edges (cycles)", dashed: true },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            {item.dashed ? (
                              <div className="w-8 h-0.5 border-t-2 border-dashed border-yellow-500"></div>
                            ) : item.border ? (
                              <div className={`w-8 h-1 ${item.color} rounded`}></div>
                            ) : (
                              <div className={`w-3 h-3 ${item.color} rounded-full shadow-md`}></div>
                            )}
                            <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* (Stats tab removed for mobile) */}

                {activeRightTab === 'algorithm' && (
                  <div className="space-y-4">
                    <div className={`rounded-xl border overflow-hidden ${theme === 'dark' ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200'
                      }`}>
                      <div className={`flex items-center gap-2 p-3 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                        }`}>
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                          <Code2 size={16} className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} />
                        </div>
                        <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          DFS Implementation
                        </h3>
                      </div>
                      <BasicCodeDisplay
                        cppCode={dfsCode.cpp}
                        pythonCode={dfsCode.python}
                        jsCode={dfsCode.javascript}
                        highlightedLine={currentHighlightedLine}
                        className="min-h-[300px]"
                      />
                    </div>

                    {/* Edge Types Info */}
                    <div className={`rounded-xl p-4 border ${theme === 'dark' ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20' : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                      }`}>
                      <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        <Info size={16} />
                        Edge Classification
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-1 bg-green-500 rounded"></div>
                            <span className={`font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                              Tree Edges
                            </span>
                          </div>
                          <span className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                            Edges that are part of the DFS spanning tree. These connect a node to its descendants.
                          </span>
                        </div>
                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-0.5 border-t-2 border-dashed border-yellow-500"></div>
                            <span className={`font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                              Back Edges
                            </span>
                          </div>
                          <span className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                            Edges that connect to an ancestor in the DFS tree. These indicate the presence of cycles.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Key Concepts */}
                    <div className={`rounded-xl p-4 border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                      }`}>
                      <h4 className={`text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Key Concepts
                      </h4>
                      <ul className="space-y-2 text-xs">
                        <li className={`flex items-start gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                          <span className="text-cyan-400 font-bold mt-0.5">•</span>
                          <span><strong>Discovery Time:</strong> When a node is first visited</span>
                        </li>
                        <li className={`flex items-start gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                          <span className="text-cyan-400 font-bold mt-0.5">•</span>
                          <span><strong>Finish Time:</strong> When all descendants are explored</span>
                        </li>
                        <li className={`flex items-start gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                          <span className="text-cyan-400 font-bold mt-0.5">•</span>
                          <span><strong>Call Stack:</strong> Tracks the current recursion path</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alert Component */}
      <Alert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        customButtons={alertConfig.customButtons}
      />

      {/* Mobile statistics & analysis accordions */}
      <section className="lg:hidden px-4 pb-24 space-y-4">
        <h2 className={`text-lg font-black flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <BarChart3 size={18} className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} />
          DFS Statistics & Analysis
        </h2>
        <div className="space-y-3">
          {/* Configuration Accordion (Mobile) */}
          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <button
              onClick={() => setMobileAccordions(prev => ({ ...prev, settings: !prev.settings }))}
              className={`w-full flex items-center justify-between px-4 py-3 font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              <span className="flex items-center gap-2">
                <Settings size={16} /> Configuration
              </span>
              <ChevronDown className={`transition-transform ${mobileAccordions.settings ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordions.settings && (
              <div className="p-4 pt-0 space-y-4">
                {/* Graph Type */}
                <div>
                  <label className={`block text-xs font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>Graph Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['undirected', 'directed'].map(type => (
                      <button
                        key={type}
                        onClick={() => setGraphType(type)}
                        className={`py-2 px-3 rounded-lg font-bold text-xs transition-all duration-300 ${graphType === type
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow'
                          : theme === 'dark'
                            ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Number of Nodes */}
                <div>
                  <label className={`block text-xs font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>Number of Nodes</label>
                  <input
                    type="number"
                    min={3}
                    max={20}
                    value={numNodes}
                    onChange={e => setNumNodes(parseInt(e.target.value) || 3)}
                    className={`w-full px-3 py-2 rounded-lg font-semibold text-xs focus:ring-2 transition ${theme === 'dark'
                      ? 'bg-white/10 border border-white/20 text-white focus:ring-cyan-500/40 focus:border-cyan-500'
                      : 'bg-gray-100 border border-gray-200 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'
                      }`}
                  />
                </div>
                {/* Edge List */}
                <div>
                  <label className={`block text-xs font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>Edges (0-1,1-2)</label>
                  <textarea
                    rows={2}
                    value={edgeList}
                    onChange={e => setEdgeList(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg font-mono text-[11px] resize-none focus:ring-2 transition ${theme === 'dark'
                      ? 'bg-white/10 border border-white/20 text-white focus:ring-cyan-500/40 focus:border-cyan-500'
                      : 'bg-gray-100 border border-gray-200 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'
                      }`}
                    placeholder="0-1,1-2,2-3"
                  />
                  {edgeValidationError && (
                    <div className={`mt-2 flex items-start gap-2 p-2 rounded-lg border text-[10px] ${theme === 'dark'
                      ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
                      : 'bg-yellow-100 border-yellow-300 text-yellow-700'
                      }`}>
                      <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                      <span className="font-semibold leading-tight">{edgeValidationError}</span>
                    </div>
                  )}
                </div>
                {/* Start Node */}
                <div>
                  <label className={`block text-xs font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>Start Node</label>
                  <select
                    value={startNode}
                    onChange={e => setStartNode(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg font-semibold text-xs focus:ring-2 transition ${theme === 'dark'
                      ? 'bg-white/10 border border-white/20 text-white focus:ring-cyan-500/40 focus:border-cyan-500'
                      : 'bg-gray-100 border border-gray-200 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'
                      }`}
                  >
                    {Array.from({ length: numNodes }, (_, i) => (
                      <option key={i} value={`${i}`} className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>
                        Node {i}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Speed Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>Speed</label>
                    <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{speed}ms</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={2000}
                    step={100}
                    value={speed}
                    onChange={e => setSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                  />
                  <div className={`flex justify-between text-[10px] font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                    <span>Fast</span><span>Slow</span>
                  </div>
                </div>
                {/* Generate Button */}
                <button
                  onClick={handleGenerateGraph}
                  disabled={!isValidGraph}
                  className={`w-full py-2.5 rounded-lg font-bold text-xs transition-all duration-300 shadow ${isValidGraph
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  aria-label="Generate Graph"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles size={14} />
                    <span>Generate Graph</span>
                  </div>
                </button>
              </div>
            )}
          </div>
          {/* Stats Accordion */}
          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <button
              onClick={() => setMobileAccordions(prev => ({ ...prev, stats: !prev.stats }))}
              className={`w-full flex items-center justify-between px-4 py-3 font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              <span className="flex items-center gap-2"><Target size={16} /> Core Stats</span>
              <ChevronDown className={`transition-transform ${mobileAccordions.stats ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordions.stats && (
              <div className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <StatCard icon={Target} value={steps[currentStep] ? [...steps[currentStep].visited].length : 0} label="Visited" color="green" />
                  <StatCard icon={Activity} value={steps[currentStep] ? steps[currentStep].callStack.length : 0} label="Stack" color="cyan" />
                  <StatCard icon={Maximize2} value={numNodes} label="Nodes" color="amber" />
                  <StatCard icon={Clock} value={`${getProgressValue()}%`} label="Progress" color="red" />
                </div>
              </div>
            )}
          </div>

          {/* Timing Accordion */}
          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <button
              onClick={() => setMobileAccordions(prev => ({ ...prev, timing: !prev.timing }))}
              className={`w-full flex items-center justify-between px-4 py-3 font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              <span className="flex items-center gap-2"><Clock size={16} /> Node Timing</span>
              <ChevronDown className={`transition-transform ${mobileAccordions.timing ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordions.timing && (
              <div className="p-4 pt-0 grid grid-cols-4 gap-2">
                {Array.from({ length: numNodes }, (_, i) => {
                  const discovery = steps[currentStep]?.discovery[i] || '';
                  const finish = steps[currentStep]?.finish[i] || '';
                  const isCurrent = steps[currentStep]?.current === i;
                  const inStack = steps[currentStep]?.callStack.includes(i);
                  const visited = steps[currentStep]?.visited.has(i);
                  return (
                    <div
                      key={i}
                      className={`flex flex-col items-center justify-center rounded-lg p-2 text-center border ${isCurrent
                        ? theme === 'dark' ? 'bg-red-500/20 border-red-500/50' : 'bg-red-100 border-red-300'
                        : inStack
                          ? theme === 'dark' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-100 border-blue-300'
                          : visited
                            ? theme === 'dark' ? 'bg-green-500/20 border-green-500/30' : 'bg-green-100 border-green-300'
                            : theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
                        }`}
                    >
                      <div className={`text-xs font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{i}</div>
                      <div className="flex flex-col gap-0.5 text-xs font-semibold">
                        {discovery && <div className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>D:{discovery}</div>}
                        {finish && <div className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}>F:{finish}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Call Stack Accordion */}
          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <button
              onClick={() => setMobileAccordions(prev => ({ ...prev, stack: !prev.stack }))}
              className={`w-full flex items-center justify-between px-4 py-3 font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              <span className="flex items-center gap-2"><Layers size={16} /> Call Stack</span>
              <ChevronDown className={`transition-transform ${mobileAccordions.stack ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordions.stack && (
              <div className="p-4 pt-0 max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
                {steps[currentStep]?.callStack.length ? (
                  [...steps[currentStep].callStack].reverse().map((node, index) => {
                    const isTop = index === 0;
                    return (
                      <div key={index} className={`p-3 rounded-lg border ${isTop ? (theme === 'dark' ? 'bg-red-500/20 border-red-500/40' : 'bg-red-100 border-red-300') : (theme === 'dark' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-100 border-blue-300')}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isTop ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                            <span className={`font-mono font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Node {node}</span>
                          </div>
                          <div className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>#{steps[currentStep].callStack.length - index}</div>
                        </div>
                        {steps[currentStep].discovery[node] && (
                          <div className="mt-2 flex justify-between text-xs font-semibold">
                            <span className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>D: {steps[currentStep].discovery[node]}</span>
                            <span className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}>F: {steps[currentStep].finish[node] || '?'}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className={`text-center py-6 text-sm font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Call stack is empty</div>
                )}
              </div>
            )}
          </div>

          {/* Complexity Accordion */}
          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <button
              onClick={() => setMobileAccordions(prev => ({ ...prev, complexity: !prev.complexity }))}
              className={`w-full flex items-center justify-between px-4 py-3 font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              <span className="flex items-center gap-2"><TrendingUp size={16} /> Complexity</span>
              <ChevronDown className={`transition-transform ${mobileAccordions.complexity ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordions.complexity && (
              <div className={`p-4 pt-0 text-sm space-y-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                <div className="flex justify-between"><span className="font-semibold">Time:</span><span className={`font-mono font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>O(V + E)</span></div>
                <div className="flex justify-between"><span className="font-semibold">Space:</span><span className={`font-mono font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>O(V)</span></div>
                <div className="text-xs font-semibold">V = vertices (nodes), E = edges</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Code Drawer */}
      {showCodeDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCodeDrawer(false)} />
          <div className={`mt-auto rounded-t-2xl shadow-2xl border-t-4 ${theme === 'dark' ? 'bg-slate-900 border-cyan-500' : 'bg-white border-cyan-400'}`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>DFS Implementation</h3>
              <button
                onClick={() => setShowCodeDrawer(false)}
                className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <XIcon size={18} className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
              </button>
            </div>
            <div className="p-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
              <BasicCodeDisplay
                cppCode={dfsCode.cpp}
                pythonCode={dfsCode.python}
                jsCode={dfsCode.javascript}
                highlightedLine={currentHighlightedLine}
                className="min-h-[300px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(6, 182, 212, 0.5)' : 'rgba(6, 182, 212, 0.6)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? 'rgba(6, 182, 212, 0.7)' : 'rgba(6, 182, 212, 0.8)'};
        }
      `}</style>
    </div>
  );
}