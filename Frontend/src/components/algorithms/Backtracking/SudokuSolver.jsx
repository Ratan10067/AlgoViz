import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Grid3X3, Hash, Zap, ArrowRight, Plus, SquareStack
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const sudokuCode = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

class SudokuSolver {
private:
    vector<vector<int>> grid;
    
    bool isValid(int row, int col, int num) {              // Line 7
        // Check row
        for (int x = 0; x < 9; x++) {                      // Line 9
            if (grid[row][x] == num) return false;         // Line 10
        }
        
        // Check column
        for (int x = 0; x < 9; x++) {                      // Line 14
            if (grid[x][col] == num) return false;         // Line 15
        }
        
        // Check 3x3 box
        int startRow = row - row % 3;                      // Line 19
        int startCol = col - col % 3;                      // Line 20
        
        for (int i = 0; i < 3; i++) {                      // Line 22
            for (int j = 0; j < 3; j++) {                  // Line 23
                if (grid[i + startRow][j + startCol] == num) {  // Line 24
                    return false;                          // Line 25
                }
            }
        }
        
        return true;                                       // Line 30
    }
    
public:
    bool solveSudoku() {                                   // Line 34
        for (int row = 0; row < 9; row++) {               // Line 35
            for (int col = 0; col < 9; col++) {           // Line 36
                if (grid[row][col] == 0) {                // Line 37
                    for (int num = 1; num <= 9; num++) {  // Line 38
                        if (isValid(row, col, num)) {     // Line 39
                            grid[row][col] = num;         // Line 40
                            
                            if (solveSudoku()) {          // Line 42
                                return true;              // Line 43
                            }
                            
                            grid[row][col] = 0; // Backtrack  // Line 46
                        }
                    }
                    
                    return false;                         // Line 50
                }
            }
        }
        
        return true; // Puzzle solved                     // Line 55
    }
};`,

  python: `class SudokuSolver:
    def __init__(self, grid):
        self.grid = grid
    
    def is_valid(self, row, col, num):                    # Line 5
        # Check row
        for x in range(9):                                # Line 7
            if self.grid[row][x] == num:                  # Line 8
                return False
        
        # Check column
        for x in range(9):                                # Line 12
            if self.grid[x][col] == num:                  # Line 13
                return False
        
        # Check 3x3 box
        start_row = row - row % 3                         # Line 17
        start_col = col - col % 3                         # Line 18
        
        for i in range(3):                                # Line 20
            for j in range(3):                            # Line 21
                if self.grid[i + start_row][j + start_col] == num:  # Line 22
                    return False                          # Line 23
        
        return True                                       # Line 25
    
    def solve_sudoku(self):                              # Line 27
        for row in range(9):                             # Line 28
            for col in range(9):                         # Line 29
                if self.grid[row][col] == 0:             # Line 30
                    for num in range(1, 10):             # Line 31
                        if self.is_valid(row, col, num): # Line 32
                            self.grid[row][col] = num    # Line 33
                            
                            if self.solve_sudoku():      # Line 35
                                return True              # Line 36
                            
                            self.grid[row][col] = 0  # Backtrack  # Line 38
                    
                    return False                         # Line 40
        
        return True  # Puzzle solved                     # Line 42`,

  javascript: `class SudokuSolver {
    constructor(grid) {
        this.grid = grid;
    }
    
    isValid(row, col, num) {                             // Line 6
        // Check row
        for (let x = 0; x < 9; x++) {                    // Line 8
            if (this.grid[row][x] === num) return false; // Line 9
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {                    // Line 13
            if (this.grid[x][col] === num) return false; // Line 14
        }
        
        // Check 3x3 box
        const startRow = row - row % 3;                  // Line 18
        const startCol = col - col % 3;                  // Line 19
        
        for (let i = 0; i < 3; i++) {                    // Line 21
            for (let j = 0; j < 3; j++) {                // Line 22
                if (this.grid[i + startRow][j + startCol] === num) {  // Line 23
                    return false;                        // Line 24
                }
            }
        }
        
        return true;                                     // Line 29
    }
    
    solveSudoku() {                                      // Line 32
        for (let row = 0; row < 9; row++) {              // Line 33
            for (let col = 0; col < 9; col++) {          // Line 34
                if (this.grid[row][col] === 0) {         // Line 35
                    for (let num = 1; num <= 9; num++) { // Line 36
                        if (this.isValid(row, col, num)) {  // Line 37
                            this.grid[row][col] = num;   // Line 38
                            
                            if (this.solveSudoku()) {    // Line 40
                                return true;             // Line 41
                            }
                            
                            this.grid[row][col] = 0; // Backtrack  // Line 44
                        }
                    }
                    
                    return false;                        // Line 48
                }
            }
        }
        
        return true; // Puzzle solved                    // Line 53
    }
}`
};

// Sample Sudoku puzzles
const samplePuzzles = {
  easy: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ],
  medium: [
    [0, 0, 0, 6, 0, 0, 4, 0, 0],
    [7, 0, 0, 0, 0, 3, 6, 0, 0],
    [0, 0, 0, 0, 9, 1, 0, 8, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 5, 0, 1, 8, 0, 0, 0, 3],
    [0, 0, 0, 3, 0, 6, 0, 4, 5],
    [0, 4, 0, 2, 0, 0, 0, 6, 0],
    [9, 0, 3, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 1, 0, 0]
  ],
  hard: [
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [4, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 6, 0, 2],
    [0, 0, 0, 0, 0, 3, 0, 7, 0],
    [5, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 8],
    [0, 6, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 5, 0, 8, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0]
  ]
};

export default function SudokuSolverVisualizer() {
  const navigate = useNavigate();
  
  // Sudoku state
  const [sudokuGrid, setSudokuGrid] = useState(samplePuzzles.easy.map(row => [...row]));
  const [originalGrid, setOriginalGrid] = useState(samplePuzzles.easy.map(row => [...row]));
  const [solvedGrid, setSolvedGrid] = useState([]);
  const [currentCell, setCurrentCell] = useState({ row: -1, col: -1 });
  const [attempts, setAttempts] = useState(0);
  const [backtracks, setBacktracks] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(500);
  
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

  // Initialize grid
  useEffect(() => {
    const puzzle = samplePuzzles[selectedDifficulty].map(row => [...row]);
    setSudokuGrid(puzzle);
    setOriginalGrid(puzzle);
    resetVisualization();
  }, [selectedDifficulty]);

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setPlaying(false);
    setStarted(false);
    setCurrentCell({ row: -1, col: -1 });
    setAttempts(0);
    setBacktracks(0);
    setSolvedGrid([]);
    setCurrentHighlightedLine(null);
  };

  // Sudoku validation functions
  const isValid = (grid, row, col, num) => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }
    
    // Check 3x3 box
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) {
          return false;
        }
      }
    }
    
    return true;
  };

  const findEmptyCell = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          return { row, col };
        }
      }
    }
    return null;
  };

  // Sudoku solver with step tracking
  const solveSudoku = () => {
    const newSteps = [];
    const grid = sudokuGrid.map(row => [...row]);
    let attemptCount = 0;
    let backtrackCount = 0;

    const solve = (currentGrid) => {
      const emptyCell = findEmptyCell(currentGrid);
      
      if (!emptyCell) {
        // Puzzle solved
        newSteps.push({
          type: 'solved',
          grid: currentGrid.map(row => [...row]),
          cell: { row: -1, col: -1 },
          num: -1,
          description: 'Sudoku solved successfully!',
          action: 'complete',
          explanation: 'All cells filled correctly. Puzzle complete!',
          currentLine: 55,
          attempts: attemptCount,
          backtracks: backtrackCount
        });
        return true;
      }

      const { row, col } = emptyCell;
      
      newSteps.push({
        type: 'exploring_cell',
        grid: currentGrid.map(row => [...row]),
        cell: { row, col },
        num: -1,
        description: `Exploring empty cell at (${row + 1}, ${col + 1})`,
        action: 'find_empty',
        explanation: `Found empty cell at row ${row + 1}, column ${col + 1}. Trying numbers 1-9.`,
        currentLine: 37,
        attempts: attemptCount,
        backtracks: backtrackCount
      });

      for (let num = 1; num <= 9; num++) {
        attemptCount++;
        
        newSteps.push({
          type: 'trying_number',
          grid: currentGrid.map(row => [...row]),
          cell: { row, col },
          num,
          description: `Trying number ${num} at (${row + 1}, ${col + 1})`,
          action: 'try_number',
          explanation: `Testing if number ${num} is valid at position (${row + 1}, ${col + 1}).`,
          currentLine: 39,
          attempts: attemptCount,
          backtracks: backtrackCount
        });

        if (isValid(currentGrid, row, col, num)) {
          // Place the number
          currentGrid[row][col] = num;
          
          newSteps.push({
            type: 'place_number',
            grid: currentGrid.map(row => [...row]),
            cell: { row, col },
            num,
            description: `Placed ${num} at (${row + 1}, ${col + 1}) - valid placement`,
            action: 'place_number',
            explanation: `Number ${num} is valid. Placed at (${row + 1}, ${col + 1}). Continuing recursively.`,
            currentLine: 40,
            attempts: attemptCount,
            backtracks: backtrackCount
          });

          // Recursive call
          if (solve(currentGrid)) {
            return true;
          }

          // Backtrack
          currentGrid[row][col] = 0;
          backtrackCount++;
          
          newSteps.push({
            type: 'backtrack',
            grid: currentGrid.map(row => [...row]),
            cell: { row, col },
            num,
            description: `Backtracking from (${row + 1}, ${col + 1}) - no solution found with ${num}`,
            action: 'backtrack',
            explanation: `Number ${num} leads to no solution. Removing and trying next number.`,
            currentLine: 46,
            attempts: attemptCount,
            backtracks: backtrackCount
          });
        } else {
          newSteps.push({
            type: 'invalid_number',
            grid: currentGrid.map(row => [...row]),
            cell: { row, col },
            num,
            description: `Number ${num} is invalid at (${row + 1}, ${col + 1}) - conflicts detected`,
            action: 'reject_number',
            explanation: `Number ${num} violates Sudoku rules at (${row + 1}, ${col + 1}). Trying next number.`,
            currentLine: 39,
            attempts: attemptCount,
            backtracks: backtrackCount
          });
        }
      }

      newSteps.push({
        type: 'no_solution',
        grid: currentGrid.map(row => [...row]),
        cell: { row, col },
        num: -1,
        description: `No valid number found for (${row + 1}, ${col + 1}) - returning false`,
        action: 'no_solution',
        explanation: `All numbers 1-9 tested at (${row + 1}, ${col + 1}). No valid placement found.`,
        currentLine: 50,
        attempts: attemptCount,
        backtracks: backtrackCount
      });

      return false;
    };

    newSteps.push({
      type: 'initialization',
      grid: grid.map(row => [...row]),
      cell: { row: -1, col: -1 },
      num: -1,
      description: 'Starting Sudoku solver with backtracking algorithm',
      action: 'initialize',
      explanation: 'Beginning systematic solution using backtracking. Finding first empty cell.',
      currentLine: 34,
      attempts: 0,
      backtracks: 0
    });

    const solved = solve(grid);
    
    if (!solved) {
      newSteps.push({
        type: 'unsolvable',
        grid: grid.map(row => [...row]),
        cell: { row: -1, col: -1 },
        num: -1,
        description: 'Puzzle appears to be unsolvable',
        action: 'unsolvable',
        explanation: 'No valid solution found. The puzzle may be invalid or have no solution.',
        currentLine: -1,
        attempts: attemptCount,
        backtracks: backtrackCount
      });
    }

    setSteps(newSteps);
    setAttempts(attemptCount);
    setBacktracks(backtrackCount);
    setSolvedGrid(grid);
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
      setSudokuGrid(currentStepData.grid);
      setCurrentCell(currentStepData.cell);
      setCurrentHighlightedLine(currentStepData.currentLine);
      setAttempts(currentStepData.attempts);
      setBacktracks(currentStepData.backtracks);
    }
  }, [currentStep, steps]);

  const getCellClass = (row, col) => {
    const isOriginal = originalGrid[row][col] !== 0;
    const isCurrent = currentCell.row === row && currentCell.col === col;
    const currentStepData = steps[currentStep];
    
    let baseClass = isOriginal 
      ? "bg-gray-100 text-gray-900 font-bold" 
      : "bg-white text-gray-700";
    
    // Box borders
    const rightBorder = (col + 1) % 3 === 0 && col < 8 ? "border-r-2 border-gray-800" : "border-r border-gray-300";
    const bottomBorder = (row + 1) % 3 === 0 && row < 8 ? "border-b-2 border-gray-800" : "border-b border-gray-300";
    
    let highlightClass = "";
    
    if (isCurrent && currentStepData) {
      switch (currentStepData.type) {
        case 'exploring_cell':
          highlightClass = "ring-4 ring-blue-400 bg-blue-100";
          break;
        case 'trying_number':
          highlightClass = "ring-4 ring-yellow-400 bg-yellow-100";
          break;
        case 'place_number':
          highlightClass = "ring-4 ring-green-400 bg-green-100";
          break;
        case 'invalid_number':
          highlightClass = "ring-4 ring-red-400 bg-red-100";
          break;
        case 'backtrack':
          highlightClass = "ring-4 ring-orange-400 bg-orange-100";
          break;
        default:
          highlightClass = "ring-2 ring-blue-300 bg-blue-50";
      }
    }
    
    return `${baseClass} ${rightBorder} ${bottomBorder} ${highlightClass} transition-all duration-300 flex items-center justify-center text-lg font-semibold`;
  };

  const loadPuzzle = (difficulty) => {
    setSelectedDifficulty(difficulty);
    const puzzle = samplePuzzles[difficulty].map(row => [...row]);
    setSudokuGrid(puzzle);
    setOriginalGrid(puzzle);
    resetVisualization();
  };

  const clearGrid = () => {
    const emptyGrid = Array(9).fill().map(() => Array(9).fill(0));
    setSudokuGrid(emptyGrid);
    setOriginalGrid(emptyGrid);
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
                <Grid3X3 size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Sudoku Solver</h1>
                <p className="text-sm text-gray-400">Backtracking Algorithm Visualization</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-700/50 px-4 py-2 rounded-xl">
              <span className="text-sm text-gray-300">
                Time: O(9^n) | Space: O(n) | Backtracking Algorithm
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
                  <h2 className="text-lg font-semibold text-gray-200">Sudoku Settings</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Puzzle Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Select Puzzle Difficulty
                  </label>
                  <div className="space-y-2">
                    {Object.keys(samplePuzzles).map(difficulty => (
                      <button
                        key={difficulty}
                        onClick={() => loadPuzzle(difficulty)}
                        className={`w-full py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                          selectedDifficulty === difficulty
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                        }`}
                      >
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </button>
                    ))}
                    <button
                      onClick={clearGrid}
                      className="w-full py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    >
                      Clear Grid
                    </button>
                  </div>
                </div>

                {/* Controls */}
                <div className="pt-4 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Solver Controls
                  </h3>

                  <button
                    onClick={solveSudoku}
                    disabled={playing}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-200 shadow-lg mb-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Hash size={18} />
                      Solve Sudoku
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
                      Solve 9×9 Sudoku puzzles using backtracking algorithm. The solver 
                      systematically tries numbers 1-9 in empty cells, backtracking when 
                      constraints are violated.
                    </p>
                    <p>
                      Each number must be unique in its row, column, and 3×3 subgrid.
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
                    <SquareStack size={20} className="text-indigo-400" />
                    <h2 className="text-lg font-semibold text-gray-200">
                      Sudoku Grid
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
                      gridTemplateColumns: 'repeat(9, 1fr)',
                      width: Math.min(500, window.innerWidth * 0.4),
                      height: Math.min(500, window.innerWidth * 0.4)
                    }}
                  >
                    {sudokuGrid.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={getCellClass(rowIndex, colIndex)}
                          style={{
                            width: Math.min(500, window.innerWidth * 0.4) / 9,
                            height: Math.min(500, window.innerWidth * 0.4) / 9
                          }}
                        >
                          {cell !== 0 && (
                            <span className="select-none">
                              {cell}
                            </span>
                          )}
                          {steps[currentStep] && 
                           steps[currentStep].cell.row === rowIndex && 
                           steps[currentStep].cell.col === colIndex && 
                           steps[currentStep].num > 0 &&
                           (steps[currentStep].type === 'trying_number' || 
                            steps[currentStep].type === 'invalid_number') && (
                            <span className="absolute text-sm text-red-600 font-bold">
                              {steps[currentStep].num}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                      <span className="text-gray-300">Given</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded"></div>
                      <span className="text-gray-300">Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded"></div>
                      <span className="text-gray-300">Valid</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border-2 border-red-400 rounded"></div>
                      <span className="text-gray-300">Invalid</span>
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
                          {steps[currentStep].cell.row >= 0 && (
                            <div className="text-sm">
                              <span className="text-gray-400">Position: </span>
                              <span className="text-gray-300 font-mono">
                                ({steps[currentStep].cell.row + 1}, {steps[currentStep].cell.col + 1})
                              </span>
                            </div>
                          )}
                          {steps[currentStep].num > 0 && (
                            <div className="text-sm">
                              <span className="text-gray-400">Number: </span>
                              <span className="text-gray-300 font-mono text-lg">
                                {steps[currentStep].num}
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
                            Difficulty
                          </span>
                        </div>
                        <span className="font-mono text-indigo-300 text-lg capitalize">
                          {selectedDifficulty}
                        </span>
                      </div>
                    </div>

                    {/* Sudoku Rules */}
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-2">
                        Sudoku Rules
                      </h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>• Each row must contain digits 1-9</div>
                        <div>• Each column must contain digits 1-9</div>
                        <div>• Each 3×3 box must contain digits 1-9</div>
                        <div>• No repetition within constraints</div>
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
                          Sudoku Solver Implementation
                        </h3>
                      </div>
                      <div className="relative">
                        <BasicCodeDisplay
                          cppCode={sudokuCode.cpp}
                          pythonCode={sudokuCode.python}
                          jsCode={sudokuCode.javascript}
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
                          <span className="font-mono text-red-400">O(9^(n×n))</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Space Complexity:</span>
                          <span className="font-mono text-blue-400">O(n)</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          n = number of empty cells
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
                            Each cell must satisfy row, column, and box constraints.
                          </span>
                        </div>
                        <div>
                          <span className="text-indigo-400 font-semibold">Backtracking:</span>
                          <span className="ml-2">
                            When a dead end is reached, undo recent choices and try alternatives.
                          </span>
                        </div>
                        <div>
                          <span className="text-indigo-400 font-semibold">Systematic Search:</span>
                          <span className="ml-2">
                            Fill cells in order, trying numbers 1-9 for each empty cell.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Applications
                      </h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div>• Puzzle and game solving</div>
                        <div>• Constraint satisfaction problems</div>
                        <div>• Logic programming systems</div>
                        <div>• AI problem-solving techniques</div>
                        <div>• Mathematical proof assistance</div>
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
