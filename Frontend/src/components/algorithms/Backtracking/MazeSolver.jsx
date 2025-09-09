import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Grid3X3, MapPin, Navigation, ArrowRight, Map, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const mazeCode = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

class MazeSolver {
private:
    vector<vector<int>> maze;
    vector<vector<bool>> visited;
    vector<pair<int, int>> path;
    int rows, cols;
    
    // Directions: right, down, left, up
    int dx[4] = {0, 1, 0, -1};                             // Line 10
    int dy[4] = {1, 0, -1, 0};                             // Line 11
    
    bool isValid(int x, int y) {                           // Line 13
        return (x >= 0 && x < rows && y >= 0 && y < cols   // Line 14
                && maze[x][y] == 0 && !visited[x][y]);     // Line 15
    }
    
public:
    bool solveMaze(int startX, int startY, int endX, int endY) {  // Line 19
        // Initialize visited array
        visited.assign(rows, vector<bool>(cols, false));   // Line 21
        path.clear();                                      // Line 22
        
        return backtrack(startX, startY, endX, endY);      // Line 24
    }
    
    bool backtrack(int x, int y, int endX, int endY) {     // Line 27
        // Mark current cell as visited
        visited[x][y] = true;                              // Line 29
        path.push_back({x, y});                            // Line 30
        
        // Check if reached destination
        if (x == endX && y == endY) {                      // Line 33
            return true;                                   // Line 34
        }
        
        // Try all four directions
        for (int i = 0; i < 4; i++) {                      // Line 38
            int newX = x + dx[i];                          // Line 39
            int newY = y + dy[i];                          // Line 40
            
            if (isValid(newX, newY)) {                     // Line 42
                if (backtrack(newX, newY, endX, endY)) {   // Line 43
                    return true;                           // Line 44
                }
            }
        }
        
        // Backtrack: remove current cell from path
        path.pop_back();                                   // Line 50
        visited[x][y] = false;                             // Line 51
        
        return false;                                      // Line 53
    }
};`,

  python: `class MazeSolver:
    def __init__(self, maze):
        self.maze = maze
        self.rows = len(maze)
        self.cols = len(maze[0])
        self.visited = [[False] * self.cols for _ in range(self.rows)]  # Line 6
        self.path = []
        
        # Directions: right, down, left, up
        self.directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # Line 10
    
    def is_valid(self, x, y):                              # Line 12
        return (0 <= x < self.rows and 0 <= y < self.cols  # Line 13
                and self.maze[x][y] == 0 and not self.visited[x][y])  # Line 14
    
    def solve_maze(self, start_x, start_y, end_x, end_y):  # Line 16
        # Reset visited array and path
        self.visited = [[False] * self.cols for _ in range(self.rows)]  # Line 18
        self.path = []                                     # Line 19
        
        return self.backtrack(start_x, start_y, end_x, end_y)  # Line 21
    
    def backtrack(self, x, y, end_x, end_y):              # Line 23
        # Mark current cell as visited
        self.visited[x][y] = True                          # Line 25
        self.path.append((x, y))                           # Line 26
        
        # Check if reached destination
        if x == end_x and y == end_y:                      # Line 29
            return True                                    # Line 30
        
        # Try all four directions
        for dx, dy in self.directions:                     # Line 33
            new_x, new_y = x + dx, y + dy                  # Line 34
            
            if self.is_valid(new_x, new_y):                # Line 36
                if self.backtrack(new_x, new_y, end_x, end_y):  # Line 37
                    return True                            # Line 38
        
        # Backtrack: remove current cell from path
        self.path.pop()                                    # Line 41
        self.visited[x][y] = False                         # Line 42
        
        return False                                       # Line 44`,

  javascript: `class MazeSolver {
    constructor(maze) {
        this.maze = maze;
        this.rows = maze.length;
        this.cols = maze[0].length;
        this.visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));  // Line 6
        this.path = [];
        
        // Directions: right, down, left, up
        this.directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];  // Line 10
    }
    
    isValid(x, y) {                                        // Line 13
        return (x >= 0 && x < this.rows && y >= 0 && y < this.cols  // Line 14
                && this.maze[x][y] === 0 && !this.visited[x][y]);  // Line 15
    }
    
    solveMaze(startX, startY, endX, endY) {                // Line 18
        // Reset visited array and path
        this.visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));  // Line 20
        this.path = [];                                    // Line 21
        
        return this.backtrack(startX, startY, endX, endY); // Line 23
    }
    
    backtrack(x, y, endX, endY) {                          // Line 26
        // Mark current cell as visited
        this.visited[x][y] = true;                         // Line 28
        this.path.push([x, y]);                            // Line 29
        
        // Check if reached destination
        if (x === endX && y === endY) {                    // Line 32
            return true;                                   // Line 33
        }
        
        // Try all four directions
        for (let [dx, dy] of this.directions) {            // Line 37
            const newX = x + dx;                           // Line 38
            const newY = y + dy;                           // Line 39
            
            if (this.isValid(newX, newY)) {                // Line 41
                if (this.backtrack(newX, newY, endX, endY)) {  // Line 42
                    return true;                           // Line 43
                }
            }
        }
        
        // Backtrack: remove current cell from path
        this.path.pop();                                   // Line 48
        this.visited[x][y] = false;                        // Line 49
        
        return false;                                      // Line 51
    }
}`
};

const MAZE_CELL = {
  EMPTY: 0,
  WALL: 1,
  START: 2,
  END: 3
};

// Sample mazes
const sampleMazes = {
  simple: [
    [2, 0, 1, 0, 0],
    [0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 0],
    [0, 0, 0, 0, 3]
  ],
  medium: [
    [2, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 1, 1, 1, 0],
    [1, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0],
    [0, 4, 0, 1, 1, 1, 0, 1],
    [0, 2, 0, 0, 0, 0, 0, 3]
  ],
  complex: [
    [2, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 1, 0],
    [1, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 3]
  ]
};

export default function MazeSolverVisualizer() {
  const navigate = useNavigate();
  
  // Maze state
  const [maze, setMaze] = useState(sampleMazes.simple.map(row => [...row]));
  const [originalMaze, setOriginalMaze] = useState(sampleMazes.simple.map(row => [...row]));
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [end, setEnd] = useState({ x: 4, y: 4 });
  const [visited, setVisited] = useState([]);
  const [currentCell, setCurrentCell] = useState({ x: -1, y: -1 });
  const [path, setPath] = useState([]);
  const [selectedMaze, setSelectedMaze] = useState('simple');
  
  // Algorithm state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [backtracks, setBacktracks] = useState(0);
  const [totalCells, setTotalCells] = useState(0);
  
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

  // Initialize maze
  useEffect(() => {
    const selectedMazeData = sampleMazes[selectedMaze].map(row => [...row]);
    setMaze(selectedMazeData);
    setOriginalMaze(selectedMazeData);
    
    // Find start and end positions
    for (let i = 0; i < selectedMazeData.length; i++) {
      for (let j = 0; j < selectedMazeData[0].length; j++) {
        if (selectedMazeData[i][j] === MAZE_CELL.START) {
          setStart({ x: i, y: j });
        } else if (selectedMazeData[i][j] === MAZE_CELL.END) {
          setEnd({ x: i, y: j });
        }
      }
    }
    
    resetVisualization();
  }, [selectedMaze]);

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setPlaying(false);
    setStarted(false);
    setCurrentCell({ x: -1, y: -1 });
    setVisited([]);
    setPath([]);
    setBacktracks(0);
    setTotalCells(0);
    setCurrentHighlightedLine(null);
  };

  // Maze solving algorithm
  const solveMaze = () => {
    const newSteps = [];
    const mazeGrid = maze.map(row => [...row]);
    const visitedGrid = Array(mazeGrid.length).fill().map(() => Array(mazeGrid[0].length).fill(false));
    const currentPath = [];
    let backtrackCount = 0;
    let cellCount = 0;
    
    const directions = [
      { dx: 0, dy: 1, name: 'right' },
      { dx: 1, dy: 0, name: 'down' },
      { dx: 0, dy: -1, name: 'left' },
      { dx: -1, dy: 0, name: 'up' }
    ];

    const isValid = (x, y) => {
      return (x >= 0 && x < mazeGrid.length && 
              y >= 0 && y < mazeGrid[0].length && 
              (mazeGrid[x][y] === MAZE_CELL.EMPTY || mazeGrid[x][y] === MAZE_CELL.END) && 
              !visitedGrid[x][y]);
    };

    const backtrack = (x, y) => {
      cellCount++;
      
      // Mark as visited and add to path
      visitedGrid[x][y] = true;
      currentPath.push({ x, y });
      
      newSteps.push({
        type: 'visit',
        position: { x, y },
        path: [...currentPath],
        visited: visitedGrid.map(row => [...row]),
        description: `Visiting cell (${x}, ${y})`,
        action: 'visit_cell',
        explanation: `Moving to cell (${x}, ${y}). Marking as visited and adding to current path.`,
        currentLine: 29,
        backtracks: backtrackCount,
        totalCells: cellCount
      });

      // Check if reached destination
      if (x === end.x && y === end.y) {
        newSteps.push({
          type: 'found',
          position: { x, y },
          path: [...currentPath],
          visited: visitedGrid.map(row => [...row]),
          description: 'Destination reached! Path found.',
          action: 'path_found',
          explanation: 'Successfully reached the destination. A valid path has been found!',
          currentLine: 33,
          backtracks: backtrackCount,
          totalCells: cellCount
        });
        return true;
      }

      // Try all four directions
      for (let i = 0; i < directions.length; i++) {
        const dir = directions[i];
        const newX = x + dir.dx;
        const newY = y + dir.dy;

        newSteps.push({
          type: 'exploring',
          position: { x, y },
          next: { x: newX, y: newY },
          direction: dir.name,
          path: [...currentPath],
          visited: visitedGrid.map(row => [...row]),
          description: `Exploring ${dir.name} direction: (${newX}, ${newY})`,
          action: 'explore_direction',
          explanation: `From (${x}, ${y}), trying to move ${dir.name} to (${newX}, ${newY}).`,
          currentLine: 42,
          backtracks: backtrackCount,
          totalCells: cellCount
        });

        if (isValid(newX, newY)) {
          newSteps.push({
            type: 'valid_move',
            position: { x, y },
            next: { x: newX, y: newY },
            path: [...currentPath],
            visited: visitedGrid.map(row => [...row]),
            description: `Valid move to (${newX}, ${newY}) - proceeding recursively`,
            action: 'valid_move',
            explanation: `Cell (${newX}, ${newY}) is valid (empty and unvisited). Making recursive call.`,
            currentLine: 43,
            backtracks: backtrackCount,
            totalCells: cellCount
          });

          if (backtrack(newX, newY)) {
            return true;
          }
        } else {
          let reason = '';
          if (newX < 0 || newX >= mazeGrid.length || newY < 0 || newY >= mazeGrid[0].length) {
            reason = 'out of bounds';
          } else if (mazeGrid[newX][newY] === MAZE_CELL.WALL) {
            reason = 'wall';
          } else if (visitedGrid[newX][newY]) {
            reason = 'already visited';
          }

          newSteps.push({
            type: 'invalid_move',
            position: { x, y },
            next: { x: newX, y: newY },
            reason,
            path: [...currentPath],
            visited: visitedGrid.map(row => [...row]),
            description: `Invalid move to (${newX}, ${newY}) - ${reason}`,
            action: 'invalid_move',
            explanation: `Cannot move to (${newX}, ${newY}): ${reason}. Trying next direction.`,
            currentLine: 42,
            backtracks: backtrackCount,
            totalCells: cellCount
          });
        }
      }

      // Backtrack
      currentPath.pop();
      visitedGrid[x][y] = false;
      backtrackCount++;

      newSteps.push({
        type: 'backtrack',
        position: { x, y },
        path: [...currentPath],
        visited: visitedGrid.map(row => [...row]),
        description: `Backtracking from (${x}, ${y}) - no valid path found`,
        action: 'backtrack',
        explanation: `No valid moves from (${x}, ${y}). Backtracking: removing from path and marking unvisited.`,
        currentLine: 50,
        backtracks: backtrackCount,
        totalCells: cellCount
      });

      return false;
    };

    newSteps.push({
      type: 'initialization',
      position: start,
      path: [],
      visited: visitedGrid.map(row => [...row]),
      description: `Starting maze solving from (${start.x}, ${start.y})`,
      action: 'initialize',
      explanation: `Beginning maze traversal using backtracking algorithm. Starting from (${start.x}, ${start.y}).`,
      currentLine: 27,
      backtracks: 0,
      totalCells: 0
    });

    const solutionFound = backtrack(start.x, start.y);

    if (!solutionFound) {
      newSteps.push({
        type: 'no_solution',
        position: start,
        path: [],
        visited: visitedGrid.map(row => [...row]),
        description: 'No solution exists for this maze configuration',
        action: 'no_solution',
        explanation: 'Exhausted all possibilities. This maze has no valid path from start to end.',
        currentLine: -1,
        backtracks: backtrackCount,
        totalCells: cellCount
      });
    }

    setSteps(newSteps);
    setBacktracks(backtrackCount);
    setTotalCells(cellCount);
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
      setCurrentCell(currentStepData.position);
      setVisited(currentStepData.visited);
      setPath(currentStepData.path);
      setCurrentHighlightedLine(currentStepData.currentLine);
      setBacktracks(currentStepData.backtracks);
      setTotalCells(currentStepData.totalCells);
    }
  }, [currentStep, steps]);

  const getCellClass = (row, col) => {
    const cellValue = maze[row][col];
    const isCurrentCell = currentCell.x === row && currentCell.y === col;
    const isVisited = visited[row] && visited[row][col];
    const isInPath = path.some(p => p.x === row && p.y === col);
    const currentStepData = steps[currentStep];
    
    let baseClass = "";
    
    // Base cell styling
    switch (cellValue) {
      case MAZE_CELL.WALL:
        baseClass = "bg-gray-800 border border-gray-700";
        break;
      case MAZE_CELL.START:
        baseClass = "bg-green-500 border border-green-400";
        break;
      case MAZE_CELL.END:
        baseClass = "bg-red-500 border border-red-400";
        break;
      default:
        baseClass = "bg-white border border-gray-300";
    }
    
    let highlightClass = "";
    
    // Current step highlighting
    if (isCurrentCell && currentStepData) {
      switch (currentStepData.type) {
        case 'visit':
          highlightClass = "ring-4 ring-blue-400 bg-blue-200";
          break;
        case 'exploring':
          highlightClass = "ring-4 ring-yellow-400 bg-yellow-200";
          break;
        case 'backtrack':
          highlightClass = "ring-4 ring-orange-400 bg-orange-200";
          break;
        case 'found':
          highlightClass = "ring-4 ring-green-400 bg-green-300";
          break;
        default:
          highlightClass = "ring-2 ring-blue-300";
      }
    }
    
    // Path highlighting
    if (isInPath && cellValue === MAZE_CELL.EMPTY) {
      baseClass = "bg-blue-300 border border-blue-400";
    }
    
    // Visited highlighting
    if (isVisited && cellValue === MAZE_CELL.EMPTY && !isInPath) {
      baseClass = "bg-gray-200 border border-gray-300";
    }
    
    // Next cell highlighting
    if (currentStepData && currentStepData.next && 
        currentStepData.next.x === row && currentStepData.next.y === col) {
      if (currentStepData.type === 'exploring') {
        highlightClass = "ring-2 ring-yellow-300";
      } else if (currentStepData.type === 'valid_move') {
        highlightClass = "ring-2 ring-green-300";
      } else if (currentStepData.type === 'invalid_move') {
        highlightClass = "ring-2 ring-red-300";
      }
    }
    
    return `${baseClass} ${highlightClass} transition-all duration-300 flex items-center justify-center relative`;
  };

  const getCellIcon = (row, col) => {
    const cellValue = maze[row][col];
    
    if (cellValue === MAZE_CELL.START) {
      return <MapPin size={16} className="text-white" />;
    } else if (cellValue === MAZE_CELL.END) {
      return <Target size={16} className="text-white" />;
    }
    
    return null;
  };

  const loadMaze = (mazeType) => {
    setSelectedMaze(mazeType);
  };

  const generateRandomMaze = () => {
    const size = 8;
    const newMaze = Array(size).fill().map(() => Array(size).fill(MAZE_CELL.WALL));
    
    // Simple maze generation (random paths)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (Math.random() < 0.7) {
          newMaze[i][j] = MAZE_CELL.EMPTY;
        }
      }
    }
    
    // Ensure start and end are empty
    newMaze[0][0] = MAZE_CELL.START;
    newMaze[size-1][size-1] = MAZE_CELL.END;
    
    setMaze(newMaze);
    setOriginalMaze(newMaze);
    setStart({ x: 0, y: 0 });
    setEnd({ x: size-1, y: size-1 });
    setSelectedMaze('custom');
    resetVisualization();
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
                <Map size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Maze Solver</h1>
                <p className="text-sm text-gray-400">Backtracking Algorithm Visualization</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-700/50 px-4 py-2 rounded-xl">
              <span className="text-sm text-gray-300">
                Time: O(4^(n×m)) | Space: O(n×m) | DFS Backtracking
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
                  <h2 className="text-lg font-semibold text-gray-200">Maze Settings</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Maze Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Select Maze
                  </label>
                  <div className="space-y-2">
                    {Object.keys(sampleMazes).map(mazeType => (
                      <button
                        key={mazeType}
                        onClick={() => loadMaze(mazeType)}
                        className={`w-full py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                          selectedMaze === mazeType
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                        }`}
                      >
                        {mazeType.charAt(0).toUpperCase() + mazeType.slice(1)}
                      </button>
                    ))}
                    <button
                      onClick={generateRandomMaze}
                      className="w-full py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 flex items-center justify-center gap-2"
                    >
                      <Shuffle size={16} />
                      Generate Random
                    </button>
                  </div>
                </div>

                {/* Controls */}
                <div className="pt-4 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Solver Controls
                  </h3>

                  <button
                    onClick={solveMaze}
                    disabled={playing}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-200 shadow-lg mb-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Navigation size={18} />
                      Solve Maze
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
                          min={100}
                          max={1500}
                          step={50}
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
                      Find path from start to end using backtracking. The algorithm 
                      explores each direction (right, down, left, up) recursively.
                    </p>
                    <p>
                      When a dead end is reached, it backtracks to try alternative paths.
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
                    <Grid3X3 size={20} className="text-indigo-400" />
                    <h2 className="text-lg font-semibold text-gray-200">
                      Maze Grid
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
                <div className="bg-gray-800/30 p-6 rounded-2xl shadow-2xl">
                  <div 
                    className="grid gap-0 border-4 border-gray-800 rounded-lg overflow-hidden bg-white"
                    style={{ 
                      gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`,
                      width: Math.min(600, window.innerWidth * 0.4),
                      height: Math.min(600, window.innerWidth * 0.4)
                    }}
                  >
                    {maze.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={getCellClass(rowIndex, colIndex)}
                          style={{
                            width: Math.min(600, window.innerWidth * 0.4) / maze[0].length,
                            height: Math.min(600, window.innerWidth * 0.4) / maze.length
                          }}
                        >
                          {getCellIcon(rowIndex, colIndex)}
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                        <MapPin size={8} className="text-white" />
                      </div>
                      <span className="text-gray-300">Start</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                        <Target size={8} className="text-white" />
                      </div>
                      <span className="text-gray-300">End</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-800 border border-gray-700 rounded"></div>
                      <span className="text-gray-300">Wall</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-300 border border-blue-400 rounded"></div>
                      <span className="text-gray-300">Path</span>
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
                          <div className="text-sm">
                            <span className="text-gray-400">Position: </span>
                            <span className="text-gray-300 font-mono">
                              ({steps[currentStep].position.x}, {steps[currentStep].position.y})
                            </span>
                          </div>
                          {steps[currentStep].direction && (
                            <div className="text-sm">
                              <span className="text-gray-400">Direction: </span>
                              <span className="text-gray-300 capitalize">
                                {steps[currentStep].direction}
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
                            Cells Visited
                          </span>
                        </div>
                        <span className="font-mono text-blue-300 text-lg">
                          {totalCells}
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
                            Path Length
                          </span>
                        </div>
                        <span className="font-mono text-green-300 text-lg">
                          {path.length}
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
                            Maze Size
                          </span>
                        </div>
                        <span className="font-mono text-indigo-300 text-lg">
                          {maze.length} × {maze[0].length}
                        </span>
                      </div>
                    </div>

                    {/* Algorithm Steps */}
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-2">
                        Algorithm Steps
                      </h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>1. Mark current cell as visited</div>
                        <div>2. Check if destination reached</div>
                        <div>3. Try all four directions</div>
                        <div>4. Recursively explore valid cells</div>
                        <div>5. Backtrack if no path found</div>
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
                          Maze Solver Implementation
                        </h3>
                      </div>
                      <div className="relative">
                        <BasicCodeDisplay
                          cppCode={mazeCode.cpp}
                          pythonCode={mazeCode.python}
                          jsCode={mazeCode.javascript}
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
                          <span className="font-mono text-red-400">O(4^(n×m))</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Space Complexity:</span>
                          <span className="font-mono text-blue-400">O(n×m)</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          n×m = maze dimensions
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Key Concepts
                      </h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div>
                          <span className="text-indigo-400 font-semibold">Depth-First Search:</span>
                          <span className="ml-2">
                            Explores as far as possible along each path before backtracking.
                          </span>
                        </div>
                        <div>
                          <span className="text-indigo-400 font-semibold">Backtracking:</span>
                          <span className="ml-2">
                            Systematically explores all possibilities by undoing choices when stuck.
                          </span>
                        </div>
                        <div>
                          <span className="text-indigo-400 font-semibold">Path Finding:</span>
                          <span className="ml-2">
                            Maintains current path and backtracks when dead ends are reached.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Applications
                      </h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div>• Robot navigation and pathfinding</div>
                        <div>• Game AI and maze solving</div>
                        <div>• Network routing algorithms</div>
                        <div>• Puzzle and labyrinth solving</div>
                        <div>• Graph traversal problems</div>
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
