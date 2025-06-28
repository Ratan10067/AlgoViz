import React, { useState, useRef } from "react";
import {
  Play,
  Code,
  GitBranch,
  Grid3X3,
  Shuffle,
  Search,
  TrendingUp,
  Layers,
  ChevronRight,
  Github,
  Twitter,
  Mail,
  Heart,
  X,
  Clock,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Import the new Navbar component

const AlgorithmHomePage = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTopic, setModalTopic] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [isStartLearningActive, setIsStartLearningActive] = useState(false);
  const topicsRef = useRef(null);
  const navigate = useNavigate();

  const topics = [
    {
      id: "arrays",
      title: "Arrays & Sorting",
      icon: <Grid3X3 className="w-8 h-8" />,
      description:
        "Explore fundamental array operations and sorting algorithms",
      algorithms: [
        {
          name: "Bubble Sort",
          difficulty: "Easy",
          time: "O(n²)",
          id: "bubble-sort",
        },
        {
          name: "Quick Sort",
          difficulty: "Medium",
          time: "O(n log n)",
          id: "quick-sort",
        },
        {
          name: "Merge Sort",
          difficulty: "Medium",
          time: "O(n log n)",
          id: "merge-sort",
        },
        {
          name: "Binary Search",
          difficulty: "Easy",
          time: "O(log n)",
          id: "binary-search",
        },
        {
          name: "Linear Search",
          difficulty: "Easy",
          time: "O(n)",
          id: "linear-search",
        },
        {
          name: "Heap Sort",
          difficulty: "Hard",
          time: "O(n log n)",
          id: "heap-sort",
        },
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "trees",
      title: "Trees & Graphs",
      icon: <GitBranch className="w-8 h-8" />,
      description: "Visualize tree traversals and graph algorithms",
      algorithms: [
        {
          name: "Binary Search Tree",
          difficulty: "Medium",
          time: "O(log n)",
          id: "bst",
        },
        {
          name: "AVL Tree",
          difficulty: "Hard",
          time: "O(log n)",
          id: "avl-tree",
        },
        {
          name: "Depth First Search",
          difficulty: "Medium",
          time: "O(V + E)",
          id: "dfs",
        },
        {
          name: "Breadth First Search",
          difficulty: "Medium",
          time: "O(V + E)",
          id: "bfs",
        },
        {
          name: "Dijkstra's Algorithm",
          difficulty: "Hard",
          time: "O(V²)",
          id: "dijkstra",
        },
        {
          name: "Tree Traversals",
          difficulty: "Easy",
          time: "O(n)",
          id: "tree-traversal",
        },
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "dynamic",
      title: "Dynamic Programming",
      icon: <Layers className="w-8 h-8" />,
      description: "Master optimization problems with dynamic programming",
      algorithms: [
        {
          name: "Fibonacci Sequence",
          difficulty: "Easy",
          time: "O(n)",
          id: "fibonacci",
        },
        {
          name: "Knapsack Problem",
          difficulty: "Hard",
          time: "O(nW)",
          id: "knapsack",
        },
        {
          name: "Longest Common Subsequence",
          difficulty: "Medium",
          time: "O(nm)",
          id: "lcs",
        },
        {
          name: "Edit Distance",
          difficulty: "Medium",
          time: "O(nm)",
          id: "edit-distance",
        },
        {
          name: "Coin Change",
          difficulty: "Medium",
          time: "O(nW)",
          id: "coin-change",
        },
        {
          name: "Matrix Chain Multiplication",
          difficulty: "Hard",
          time: "O(n³)",
          id: "mcm",
        },
      ],
      color: "from-purple-500 to-violet-500",
    },
    {
      id: "searching",
      title: "Search Algorithms",
      icon: <Search className="w-8 h-8" />,
      description: "Learn various searching techniques and their complexities",
      algorithms: [
        {
          name: "Linear Search",
          difficulty: "Easy",
          time: "O(n)",
          id: "linear-search-2",
        },
        {
          name: "Binary Search",
          difficulty: "Easy",
          time: "O(log n)",
          id: "binary-search-2",
        },
        {
          name: "Interpolation Search",
          difficulty: "Medium",
          time: "O(log log n)",
          id: "interpolation-search",
        },
        {
          name: "Exponential Search",
          difficulty: "Medium",
          time: "O(log n)",
          id: "exponential-search",
        },
        {
          name: "Ternary Search",
          difficulty: "Medium",
          time: "O(log n)",
          id: "ternary-search",
        },
        {
          name: "Jump Search",
          difficulty: "Easy",
          time: "O(√n)",
          id: "jump-search",
        },
      ],
      color: "from-orange-500 to-red-500",
    },
    {
      id: "greedy",
      title: "Greedy Algorithms",
      icon: <TrendingUp className="w-8 h-8" />,
      description: "Understand greedy approach for optimization problems",
      algorithms: [
        {
          name: "Activity Selection",
          difficulty: "Medium",
          time: "O(n log n)",
          id: "activity-selection",
        },
        {
          name: "Huffman Coding",
          difficulty: "Hard",
          time: "O(n log n)",
          id: "huffman-coding",
        },
        {
          name: "Fractional Knapsack",
          difficulty: "Medium",
          time: "O(n log n)",
          id: "fractional-knapsack",
        },
        {
          name: "Job Scheduling",
          difficulty: "Medium",
          time: "O(n log n)",
          id: "job-scheduling",
        },
        {
          name: "Minimum Spanning Tree",
          difficulty: "Hard",
          time: "O(E log V)",
          id: "mst",
        },
        {
          name: "Coin Change Greedy",
          difficulty: "Easy",
          time: "O(n)",
          id: "coin-change-greedy",
        },
      ],
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "backtracking",
      title: "Backtracking",
      icon: <Shuffle className="w-8 h-8" />,
      description: "Solve complex problems using backtracking techniques",
      algorithms: [
        {
          name: "N-Queens Problem",
          difficulty: "Hard",
          time: "O(N!)",
          id: "n-queens",
        },
        {
          name: "Sudoku Solver",
          difficulty: "Hard",
          time: "O(9^(n*n))",
          id: "sudoku-solver",
        },
        {
          name: "Maze Solver",
          difficulty: "Medium",
          time: "O(4^(n*m))",
          id: "maze-solver",
        },
        {
          name: "Subset Sum",
          difficulty: "Medium",
          time: "O(2^n)",
          id: "subset-sum",
        },
        {
          name: "Graph Coloring",
          difficulty: "Hard",
          time: "O(m^V)",
          id: "graph-coloring",
        },
        {
          name: "Hamiltonian Path",
          difficulty: "Hard",
          time: "O(N!)",
          id: "hamiltonian-path",
        },
      ],
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const scrollToTopics = () => {
    if (topicsRef.current) {
      topicsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openModal = (topic) => {
    setModalTopic(topic);
    setIsModalOpen(true);
    setSelectedAlgorithm(null);
    setIsStartLearningActive(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTopic(null);
    setSelectedAlgorithm(null);
    setIsStartLearningActive(false);
  };

  const selectAlgorithm = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setIsStartLearningActive(true);
  };

  const startLearning = () => {
    navigate("/bfs-visualizer");
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "Medium":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "Hard":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/30";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>

        {/* Use the imported Navbar component */}
        <Navbar />

        {/* Hero Section */}
        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Algorithm
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              Visualizer
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Master data structures and algorithms through interactive
            visualizations. Watch algorithms come to life with step-by-step
            animations and real-time complexity analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToTopics}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-xl flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start Learning</span>
            </button>
            <button className="px-8 py-4 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-all duration-300">
              View Documentation
            </button>
          </div>
        </div>
      </header>

      {/* Topics Section */}
      <section ref={topicsRef} className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Explore Algorithm Topics
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Choose from various algorithm categories and start your journey into
            computational thinking
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="group relative overflow-hidden rounded-2xl bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer"
                onMouseEnter={() => setSelectedTopic(topic.id)}
                onMouseLeave={() => setSelectedTopic(null)}
                onClick={() => openModal(topic)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                <div className="relative p-8">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${topic.color} mb-6`}
                  >
                    {topic.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">
                    {topic.title}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {topic.description}
                  </p>

                  <div className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg border border-gray-600 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg">
                    <span>Explore Algorithms</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Why Choose AlgoViz?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Interactive Visualizations
                </h3>
                <p className="text-gray-400">
                  Watch algorithms execute step-by-step with beautiful
                  animations and real-time data flow.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Complexity Analysis
                </h3>
                <p className="text-gray-400">
                  Understand time and space complexity with visual graphs and
                  detailed explanations.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-gray-800 border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Code Implementation
                </h3>
                <p className="text-gray-400">
                  See actual code implementation in multiple programming
                  languages with syntax highlighting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && modalTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
            {/* Modal Header */}
            <div
              className={`p-6 bg-gradient-to-r ${modalTopic.color} bg-opacity-20 border-b border-gray-700`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${modalTopic.color}`}
                  >
                    {modalTopic.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      {modalTopic.title}
                    </h2>
                    <p className="text-gray-300 mt-1">
                      {modalTopic.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto bg-gray-900">
              <div className="grid gap-4">
                {modalTopic.algorithms.map((algorithm, index) => (
                  <div
                    key={index}
                    onClick={() => selectAlgorithm(algorithm)}
                    className={`p-4 rounded-lg border transition-all duration-300 group cursor-pointer ${
                      selectedAlgorithm?.id === algorithm.id
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50"
                        : "bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold transition-colors duration-300 ${
                            selectedAlgorithm?.id === algorithm.id
                              ? "text-cyan-400"
                              : "text-white group-hover:text-cyan-400"
                          }`}
                        >
                          {algorithm.name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              Time: {algorithm.time}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                              algorithm.difficulty
                            )}`}
                          >
                            {algorithm.difficulty}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 transition-all duration-300 ${
                          selectedAlgorithm?.id === algorithm.id
                            ? "text-cyan-400 translate-x-1"
                            : "text-gray-400 group-hover:text-white group-hover:translate-x-1"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer with Start Button */}
            <div className="p-6 border-t border-gray-700 bg-gray-800">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-center sm:text-left">
                  <p className="text-white font-semibold">
                    {selectedAlgorithm
                      ? `Selected: ${selectedAlgorithm.name}`
                      : "Select an algorithm to start"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {selectedAlgorithm
                      ? "Click Start Learning to begin visualization"
                      : "Choose any algorithm and begin your journey"}
                  </p>
                </div>
                <button
                  onClick={startLearning}
                  disabled={!isStartLearningActive}
                  className={`px-8 py-3 rounded-lg transition-all duration-300 shadow-lg flex items-center space-x-2 ${
                    isStartLearningActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  <span>Start Learning</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-bold text-white">AlgoViz</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The ultimate platform for learning and visualizing algorithms.
                Master computer science fundamentals through interactive
                experiences.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300"
                >
                  <Mail className="w-5 h-8" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    Algorithms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Resources
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 AlgoViz. All rights reserved.
            </p>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-gray-400 text-sm">
                Made with love for computer science
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AlgorithmHomePage;
