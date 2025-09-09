import React, { useState, useEffect, useRef } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import {
  Play, Pause, SkipForward, RotateCcw, Settings, BarChart3, Code2,
  Activity, Target, Clock, Maximize2, ArrowLeft, AlertTriangle, Shuffle,
  Crown, Grid3X3, Zap, ArrowRight, Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Alert from "../../Alert.jsx";
import BasicCodeDisplay from "../../BasicCodeDisplay.jsx";

const nQueensCode = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

class NQueens {
private:
    vector<vector<int>> board;
    vector<vector<vector<int>>> solutions;
    int n;
    
    bool isSafe(int row, int col) {                    // Line 8
        // Check column
        for (int i = 0; i < row; i++) {               // Line 10
            if (board[i][col] == 1) return false;     // Line 11
        }
        
        // Check upper left diagonal
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) { // Line 15
            if (board[i][j] == 1) return false;       // Line 16
        }
        
        // Check upper right diagonal
        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) { // Line 20
            if (board[i][j] == 1) return false;       // Line 21
        }
        
        return true;                                   // Line 24
    }
    
public:
    bool solve(int row) {                             // Line 28
        if (row == n) {                               // Line 29
            solutions.push_back(board);                // Line 30
            return true;                               // Line 31
        }
        
        for (int col = 0; col < n; col++) {           // Line 34
            if (isSafe(row, col)) {                   // Line 35
                board[row][col] = 1;                   // Line 36
                
                if (solve(row + 1)) return true;      // Line 38
                
                board[row][col] = 0; // Backtrack     // Line 40
            }
        }
        
        return false;                                  // Line 44
    }
    
    void findAllSolutions(int row) {                  // Line 47
        if (row == n) {                               // Line 48
            solutions.push_back(board);                // Line 49
            return;                                    // Line 50
        }
        
        for (int col = 0; col < n; col++) {           // Line 53
            if (isSafe(row, col)) {                   // Line 54
                board[row][col] = 1;                   // Line 55
                findAllSolutions(row + 1);             // Line 56
                board[row][col] = 0; // Backtrack     // Line 57
            }
        }
    }
};`,

  python: `class NQueens:
    def __init__(self, n):
        self.n = n
        self.board = [[0] * n for _ in range(n)]
        self.solutions = []
    
    def is_safe(self, row, col):                      # Line 7
        # Check column
        for i in range(row):                          # Line 9
            if self.board[i][col] == 1:               # Line 10
                return False
        
        # Check upper left diagonal
        i, j = row - 1, col - 1                      # Line 14
        while i >= 0 and j >= 0:                     # Line 15
            if self.board[i][j] == 1:                 # Line 16
                return False
            i -= 1
            j -= 1
        
        # Check upper right diagonal
        i, j = row - 1, col + 1                      # Line 22
        while i >= 0 and j < self.n:                 # Line 23
            if self.board[i][j] == 1:                 # Line 24
                return False
            i -= 1
            j += 1
        
        return True                                   # Line 29
    
    def solve(self, row):                            # Line 31
        if row == self.n:                            # Line 32
            self.solutions.append([row[:] for row in self.board])  # Line 33
            return True                               # Line 34
        
        for col in range(self.n):                    # Line 36
            if self.is_safe(row, col):               # Line 37
                self.board[row][col] = 1             # Line 38
                
                if self.solve(row + 1):              # Line 40
                    return True
                
                self.board[row][col] = 0  # Backtrack  # Line 43
        
        return False                                  # Line 45`,

  javascript: `class NQueens {
    constructor(n) {
        this.n = n;
        this.board = Array(n).fill().map(() => Array(n).fill(0));
        this.solutions = [];
    }
    
    isSafe(row, col) {                               // Line 8
        // Check column
        for (let i = 0; i < row; i++) {              // Line 10
            if (this.board[i][col] === 1) return false;  // Line 11
        }
        
        // Check upper left diagonal
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {  // Line 15
            if (this.board[i][j] === 1) return false;    // Line 16
        }
        
        // Check upper right diagonal
        for (let i = row - 1, j = col + 1; i >= 0 && j < this.n; i--, j++) {  // Line 20
            if (this.board[i][j] === 1) return false;    // Line 21
        }
        
        return true;                                 // Line 24
    }
    
    solve(row) {                                     // Line 27
        if (row === this.n) {                        // Line 28
            this.solutions.push(this.board.map(r => [...r]));  // Line 29
            return true;                             // Line 30
        }
        
        for (let col = 0; col < this.n; col++) {     // Line 33
            if (this.isSafe(row, col)) {             // Line 34
                this.board[row][col] = 1;            // Line 35
                
                if (this.solve(row + 1)) return true;  // Line 37
                
                this.board[row][col] = 0; // Backtrack  // Line 39
            }
        }
        
        return false;                                // Line 43
    }
}`
};

export default function NQueensVisualizer() {
  const navigate = useNavigate();
  
  // Board state
  const [boardSize, setBoardSize] = useState(8);
  const [board, setBoard] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [totalSolutions, setTotalSolutions] = useState(0);
  const [backtracks, setBacktracks] = useState(0);
  
  // Animation state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(800);
  
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

  // Initialize board
  useEffect(() => {
    resetVisualization();
  }, [boardSize]);

  const resetVisualization = () => {
    setBoard(Array(boardSize).fill().map(() => Array(boardSize).fill(0)));
    setSteps([]);
    setCurrentStep(0);
    setPlaying(false);
    setStarted(false);
    setSolutions([]);
    setTotalSolutions(0);
    setBacktracks(0);
    setCurrentHighlightedLine(null);
  };

  // N-Queens solver algorithm
  const solveNQueens = () => {
    const newSteps = [];
    const newBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
    const allSolutions = [];
    let backtrackCount = 0;

    const isSafe = (board, row, col) => {
      // Check column
      for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) return false;
      }
      
      // Check upper left diagonal
      for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 1) return false;
      }
      
      // Check upper right diagonal
      for (let i = row - 1, j = col + 1; i >= 0 && j < boardSize; i--, j++) {
        if (board[i][j] === 1) return false;
      }
      
      return true;
    };

    const solve = (row) => {
      if (row === boardSize) {
        // Found a solution
        allSolutions.push(newBoard.map(r => [...r]));
        newSteps.push({
          type: 'solution_found',
          board: newBoard.map(r => [...r]),
          row,
          col: -1,
          description: `Solution found! All ${boardSize} queens placed successfully.`,
          action: 'complete',
          explanation: `Found solution #${allSolutions.length}. Board state saved.`,
          currentLine: 29,
          solutions: allSolutions.length,
          backtracks: backtrackCount
        });
        return false; // Continue searching for more solutions
      }

      newSteps.push({
        type: 'exploring_row',
        board: newBoard.map(r => [...r]),
        row,
        col: -1,
        description: `Exploring row ${row} to place queen #${row + 1}`,
        action: 'explore_row',
        explanation: `Trying to place queen at row ${row}. Testing each column for valid placement.`,
        currentLine: 34,
        solutions: allSolutions.length,
        backtracks: backtrackCount
      });

      for (let col = 0; col < boardSize; col++) {
        newSteps.push({
          type: 'checking_position',
          board: newBoard.map(r => [...r]),
          row,
          col,
          description: `Checking if position (${row}, ${col}) is safe`,
          action: 'check_safety',
          explanation: `Validating position (${row}, ${col}): checking column, diagonals for conflicts.`,
          currentLine: 35,
          solutions: allSolutions.length,
          backtracks: backtrackCount
        });

        if (isSafe(newBoard, row, col)) {
          // Place queen
          newBoard[row][col] = 1;
          newSteps.push({
            type: 'place_queen',
            board: newBoard.map(r => [...r]),
            row,
            col,
            description: `Placed queen at (${row}, ${col}) - position is safe`,
            action: 'place_queen',
            explanation: `Position (${row}, ${col}) is safe. Queen placed successfully.`,
            currentLine: 36,
            solutions: allSolutions.length,
            backtracks: backtrackCount
          });

          // Recursive call
          newSteps.push({
            type: 'recursive_call',
            board: newBoard.map(r => [...r]),
            row: row + 1,
            col: -1,
            description: `Moving to next row ${row + 1}`,
            action: 'recurse',
            explanation: `Queen placed at (${row}, ${col}). Recursively solving for row ${row + 1}.`,
            currentLine: 38,
            solutions: allSolutions.length,
            backtracks: backtrackCount
          });

          solve(row + 1);

          // Backtrack
          newBoard[row][col] = 0;
          backtrackCount++;
          newSteps.push({
            type: 'backtrack',
            board: newBoard.map(r => [...r]),
            row,
            col,
            description: `Backtracking from (${row}, ${col}) - no valid solution found in this path`,
            action: 'backtrack',
            explanation: `Removing queen from (${row}, ${col}). Backtracking to try next position.`,
            currentLine: 40,
            solutions: allSolutions.length,
            backtracks: backtrackCount
          });
        } else {
          newSteps.push({
            type: 'unsafe_position',
            board: newBoard.map(r => [...r]),
            row,
            col,
            description: `Position (${row}, ${col}) is unsafe - conflicts detected`,
            action: 'reject_position',
            explanation: `Position (${row}, ${col}) conflicts with existing queens. Trying next column.`,
            currentLine: 35,
            solutions: allSolutions.length,
            backtracks: backtrackCount
          });
        }
      }

      newSteps.push({
        type: 'row_complete',
        board: newBoard.map(r => [...r]),
        row,
        col: -1,
        description: `Finished exploring row ${row} - no valid placement found`,
        action: 'row_complete',
        explanation: `All positions in row ${row} tested. No valid placement possible.`,
        currentLine: 44,
        solutions: allSolutions.length,
        backtracks: backtrackCount
      });

      return false;
    };

    newSteps.push({
      type: 'initialization',
      board: newBoard.map(r => [...r]),
      row: 0,
      col: -1,
      description: 'Starting N-Queens solver with backtracking algorithm',
      action: 'initialize',
      explanation: `Beginning search for all solutions on ${boardSize}×${boardSize} board.`,
      currentLine: 28,
      solutions: 0,
      backtracks: 0
    });

    solve(0);

    newSteps.push({
      type: 'complete',
      board: newBoard.map(r => [...r]),
      row: -1,
      col: -1,
      description: `Search completed. Found ${allSolutions.length} solution(s)`,
      action: 'complete',
      explanation: `Search completed. Explored all possible placements using backtracking.`,
      currentLine: -1,
      solutions: allSolutions.length,
      backtracks: backtrackCount
    });

    setSteps(newSteps);
    setSolutions(allSolutions);
    setTotalSolutions(allSolutions.length);
    setBacktracks(backtrackCount);
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
      setBoard(currentStepData.board);
      setCurrentHighlightedLine(currentStepData.currentLine);
      setTotalSolutions(currentStepData.solutions);
      setBacktracks(currentStepData.backtracks);
    }
  }, [currentStep, steps]);

  const getCellClass = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    const baseClass = isLight 
      ? "bg-amber-100 border-amber-200" 
      : "bg-amber-200 border-amber-300";
    
    let additionalClass = "";
    
    if (steps[currentStep]) {
      const current = steps[currentStep];
      
      // Highlight current position being checked
      if (current.row === row && current.col === col) {
        if (current.type === 'checking_position') {
          additionalClass = "ring-4 ring-blue-400 bg-blue-100";
        } else if (current.type === 'place_queen') {
          additionalClass = "ring-4 ring-green-400 bg-green-100";
        } else if (current.type === 'unsafe_position') {
          additionalClass = "ring-4 ring-red-400 bg-red-100";
        } else if (current.type === 'backtrack') {
          additionalClass = "ring-4 ring-yellow-400 bg-yellow-100";
        }
      }
      
      // Show attacking lines for placed queens
      if (board[row][col] === 1) {
        additionalClass += " shadow-lg";
      }
    }
    
    return `${baseClass} ${additionalClass} transition-all duration-300`;
  };

  const isUnderAttack = (row, col) => {
    if (!steps[currentStep] || steps[currentStep].type !== 'checking_position') return false;
    
    const { row: checkRow, col: checkCol } = steps[currentStep];
    if (row === checkRow && col === checkCol) return false;
    
    // Check if this cell is under attack by any placed queen
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (board[r][c] === 1) {
          // Same column
          if (c === checkCol && row !== r) return true;
          // Diagonal
          if (Math.abs(r - checkRow) === Math.abs(c - checkCol) && (row === r || col === c)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
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
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <Crown size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">N-Queens Problem</h1>
                <p className="text-sm text-gray-400">Backtracking Algorithm Visualization</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-700/50 px-4 py-2 rounded-xl">
              <span className="text-sm text-gray-300">
                Time: O(N!) | Space: O(N) | Backtracking Algorithm
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
                  <Settings size={20} className="text-purple-400" />
                  <h2 className="text-lg font-semibold text-gray-200">N-Queens Settings</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Board Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Board Size (N×N)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[4, 5, 6, 7, 8, 9, 10, 12].map(size => (
                      <button
                        key={size}
                        onClick={() => setBoardSize(size)}
                        className={`py-2 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                          boardSize === size
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                        }`}
                      >
                        {size}×{size}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Smaller boards solve faster. 8×8 is the classic problem.
                  </p>
                </div>

                {/* Controls */}
                <div className="pt-4 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Algorithm Controls
                  </h3>

                  <button
                    onClick={solveNQueens}
                    disabled={playing}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-200 shadow-lg mb-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Shuffle size={18} />
                      Start N-Queens Solver
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
                          className="w-full accent-purple-500"
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
                          className="w-full accent-purple-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Algorithm Info */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-200 mb-3">
                    Algorithm Overview
                  </h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      The N-Queens problem places N chess queens on an N×N chessboard 
                      so that no two queens can attack each other.
                    </p>
                    <p>
                      This implementation uses backtracking to explore all possible 
                      solutions systematically.
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
                    <Grid3X3 size={20} className="text-purple-400" />
                    <h2 className="text-lg font-semibold text-gray-200">
                      {boardSize}×{boardSize} Chessboard
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
                    className="grid gap-1 border-2 border-gray-600/50 rounded-lg overflow-hidden"
                    style={{ 
                      gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                      width: Math.min(500, window.innerWidth * 0.4),
                      height: Math.min(500, window.innerWidth * 0.4)
                    }}
                  >
                    {board.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`
                            ${getCellClass(rowIndex, colIndex)}
                            border flex items-center justify-center text-2xl font-bold
                            ${isUnderAttack(rowIndex, colIndex) ? 'bg-red-200' : ''}
                          `}
                          style={{
                            width: Math.min(500, window.innerWidth * 0.4) / boardSize,
                            height: Math.min(500, window.innerWidth * 0.4) / boardSize
                          }}
                        >
                          {cell === 1 && (
                            <Crown 
                              size={Math.min(24, (Math.min(500, window.innerWidth * 0.4) / boardSize) * 0.6)} 
                              className="text-purple-700 drop-shadow-lg" 
                            />
                          )}
                        </div>
                      ))
                    )}
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
                        ? "bg-purple-600 text-white"
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
                        ? "bg-purple-600 text-white"
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
                            <span className="text-purple-400 font-medium">
                              {steps[currentStep].action}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Explanation: </span>
                            <span className="text-gray-300">
                              {steps[currentStep].explanation}
                            </span>
                          </div>
                          {steps[currentStep].row >= 0 && (
                            <div className="text-sm">
                              <span className="text-gray-400">Position: </span>
                              <span className="text-gray-300 font-mono">
                                ({steps[currentStep].row}, {steps[currentStep].col})
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
                      
                      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-green-400">
                            Solutions Found
                          </span>
                        </div>
                        <span className="font-mono text-green-300 text-lg">
                          {totalSolutions}
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

                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-blue-400">
                            Current Step
                          </span>
                        </div>
                        <span className="font-mono text-blue-300 text-lg">
                          {currentStep + 1} / {steps.length}
                        </span>
                      </div>

                      <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-purple-400">
                            Board Size
                          </span>
                        </div>
                        <span className="font-mono text-purple-300 text-lg">
                          {boardSize}×{boardSize}
                        </span>
                      </div>
                    </div>

                    {/* Expected Solutions */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-2">
                        Expected Solutions
                      </h4>
                      <div className="text-sm text-gray-300">
                        <div className="space-y-1">
                          <div>4×4: 2 solutions</div>
                          <div>5×5: 10 solutions</div>
                          <div>6×6: 4 solutions</div>
                          <div>7×7: 40 solutions</div>
                          <div>8×8: 92 solutions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeRightTab === "algorithm" && (
                  <div className="space-y-4">
                    <div className="bg-gray-700/30 rounded-xl border border-gray-600/30 overflow-hidden">
                      <div className="flex items-center gap-2 p-3 border-b border-gray-600/30">
                        <Code2 size={18} className="text-purple-400" />
                        <h3 className="text-lg font-semibold text-gray-200">
                          N-Queens Implementation
                        </h3>
                      </div>
                      <div className="relative">
                        <BasicCodeDisplay
                          cppCode={nQueensCode.cpp}
                          pythonCode={nQueensCode.python}
                          jsCode={nQueensCode.javascript}
                          highlightedLine={currentHighlightedLine}
                          className="min-h-[300px]"
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Algorithm Complexity
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Time Complexity:</span>
                          <span className="font-mono text-red-400">O(N!)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Space Complexity:</span>
                          <span className="font-mono text-blue-400">O(N)</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          N = size of the chessboard
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Key Concepts
                      </h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div>
                          <span className="text-purple-400 font-semibold">Backtracking:</span>
                          <span className="ml-2">
                            Systematically explore all possibilities and undo choices that lead to dead ends.
                          </span>
                        </div>
                        <div>
                          <span className="text-purple-400 font-semibold">Constraint Satisfaction:</span>
                          <span className="ml-2">
                            Queens cannot attack each other (same row, column, or diagonal).
                          </span>
                        </div>
                        <div>
                          <span className="text-purple-400 font-semibold">Pruning:</span>
                          <span className="ml-2">
                            Early detection of invalid states reduces search space significantly.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/20 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3">
                        Applications
                      </h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        <div>• Constraint satisfaction problems</div>
                        <div>• Puzzle solving algorithms</div>
                        <div>• Game AI and strategic planning</div>
                        <div>• Resource allocation optimization</div>
                        <div>• Scheduling and timetabling</div>
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
