import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Play,
  Code,
  Clock,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";

const AlgorithmsPage = () => {
  const [activeCategory, setActiveCategory] = useState("sorting");
  const [expandedAlgorithm, setExpandedAlgorithm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplexity, setSelectedComplexity] = useState("all");

  const algorithms = {
    sorting: [
      {
        name: "Bubble Sort",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        difficulty: "Easy",
        description:
          "Simple comparison-based sorting algorithm that repeatedly steps through the list.",
        code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
        keyPoints: [
          "In-place sorting",
          "Stable algorithm",
          "Simple to implement",
        ],
      },
      {
        name: "Quick Sort",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(log n)",
        difficulty: "Medium",
        description:
          "Efficient divide-and-conquer algorithm that picks a pivot and partitions the array.",
        code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
        keyPoints: [
          "Divide and conquer",
          "In-place sorting",
          "Average case O(n log n)",
        ],
      },
      {
        name: "Merge Sort",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        difficulty: "Medium",
        description:
          "Stable divide-and-conquer algorithm that divides the array into halves and merges them.",
        code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
        keyPoints: [
          "Stable sorting",
          "Guaranteed O(n log n)",
          "Divide and conquer",
        ],
      },
    ],
    searching: [
      {
        name: "Binary Search",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        difficulty: "Easy",
        description:
          "Efficient search algorithm for sorted arrays using divide and conquer.",
        code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Not found
}`,
        keyPoints: [
          "Requires sorted array",
          "Logarithmic time",
          "Divide and conquer",
        ],
      },
      {
        name: "Linear Search",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        difficulty: "Easy",
        description:
          "Simple search algorithm that checks each element sequentially.",
        code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1; // Not found
}`,
        keyPoints: [
          "Works on unsorted arrays",
          "Simple implementation",
          "Linear time complexity",
        ],
      },
    ],
    graph: [
      {
        name: "Depth-First Search (DFS)",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        difficulty: "Medium",
        description:
          "Graph traversal algorithm that explores as far as possible along each branch.",
        code: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  
  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  
  return visited;
}`,
        keyPoints: [
          "Uses stack (recursion)",
          "Explores depth first",
          "Memory efficient",
        ],
      },
      {
        name: "Breadth-First Search (BFS)",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        difficulty: "Medium",
        description:
          "Graph traversal algorithm that explores neighbors before going deeper.",
        code: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node);
    
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return visited;
}`,
        keyPoints: [
          "Uses queue",
          "Level-by-level traversal",
          "Shortest path in unweighted graphs",
        ],
      },
      {
        name: "Dijkstra's Algorithm",
        timeComplexity: "O((V + E) log V)",
        spaceComplexity: "O(V)",
        difficulty: "Hard",
        description:
          "Finds shortest path from source to all other vertices in weighted graph.",
        code: `function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  const pq = [[0, start]];
  
  // Initialize distances
  for (const node in graph) {
    distances[node] = Infinity;
  }
  distances[start] = 0;
  
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [currentDist, currentNode] = pq.shift();
    
    if (visited.has(currentNode)) continue;
    visited.add(currentNode);
    
    for (const [neighbor, weight] of graph[currentNode] || []) {
      const newDist = currentDist + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.push([newDist, neighbor]);
      }
    }
  }
  
  return distances;
}`,
        keyPoints: [
          "Shortest path algorithm",
          "Works with weighted graphs",
          "Greedy approach",
        ],
      },
    ],
    dynamic: [
      {
        name: "Fibonacci (DP)",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        difficulty: "Easy",
        description: "Classic dynamic programming example using memoization.",
        code: `function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

// Space optimized version
function fibonacciOptimized(n) {
  if (n <= 1) return n;
  
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
        keyPoints: [
          "Memoization technique",
          "Overlapping subproblems",
          "Space optimization possible",
        ],
      },
      {
        name: "Longest Common Subsequence",
        timeComplexity: "O(m × n)",
        spaceComplexity: "O(m × n)",
        difficulty: "Medium",
        description: "Finds the longest subsequence common to two sequences.",
        code: `function lcs(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}`,
        keyPoints: [
          "2D DP table",
          "Bottom-up approach",
          "Classic string problem",
        ],
      },
    ],
  };

  const categories = [
    { id: "sorting", name: "Sorting Algorithms", icon: "🔄" },
    { id: "searching", name: "Searching Algorithms", icon: "🔍" },
    { id: "graph", name: "Graph Algorithms", icon: "🕸️" },
    { id: "dynamic", name: "Dynamic Programming", icon: "⚡" },
  ];

  const complexityColors = {
    "O(1)": "text-green-600 bg-green-50",
    "O(log n)": "text-blue-600 bg-blue-50",
    "O(n)": "text-yellow-600 bg-yellow-50",
    "O(n log n)": "text-orange-600 bg-orange-50",
    "O(n²)": "text-red-600 bg-red-50",
    "O((V + E) log V)": "text-purple-600 bg-purple-50",
    "O(V + E)": "text-indigo-600 bg-indigo-50",
    "O(m × n)": "text-pink-600 bg-pink-50",
  };

  const difficultyColors = {
    Easy: "text-green-600 bg-green-50",
    Medium: "text-yellow-600 bg-yellow-50",
    Hard: "text-red-600 bg-red-50",
  };

  const filteredAlgorithms =
    algorithms[activeCategory]?.filter((algo) => {
      const matchesSearch =
        algo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        algo.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesComplexity =
        selectedComplexity === "all" ||
        algo.difficulty.toLowerCase() === selectedComplexity;
      return matchesSearch && matchesComplexity;
    }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Algorithms</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive collection of data structure algorithms
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search algorithms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                      activeCategory === category.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                    <span className="ml-auto text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {algorithms[category.id]?.length || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="space-y-6">
              {filteredAlgorithms.map((algorithm, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {algorithm.name}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              difficultyColors[algorithm.difficulty]
                            }`}
                          >
                            {algorithm.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2">
                          {algorithm.description}
                        </p>

                        <div className="flex items-center space-x-6 mt-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Time:</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                complexityColors[algorithm.timeComplexity]
                              }`}
                            >
                              {algorithm.timeComplexity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Space:
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                complexityColors[algorithm.spaceComplexity]
                              }`}
                            >
                              {algorithm.spaceComplexity}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedAlgorithm(
                            expandedAlgorithm === index ? null : index
                          )
                        }
                        className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Code className="w-4 h-4" />
                        <span>View Code</span>
                        {expandedAlgorithm === index ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {expandedAlgorithm === index && (
                      <div className="mt-6 space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Key Points:
                          </h4>
                          <ul className="space-y-1">
                            {algorithm.keyPoints.map((point, i) => (
                              <li
                                key={i}
                                className="text-sm text-gray-600 flex items-center"
                              >
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gray-900 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-white">
                              Implementation
                            </h4>
                            <button className="text-gray-400 hover:text-white text-sm">
                              Copy Code
                            </button>
                          </div>
                          <pre className="text-sm text-gray-300 overflow-x-auto">
                            <code>{algorithm.code}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredAlgorithms.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No algorithms found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsPage;
