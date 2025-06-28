import React, { useState } from "react";
import {
  X,
  BookOpen,
  Code,
  Play,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";

const DocumentationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const features = [
    {
      icon: <Play className="w-6 h-6" />,
      title: "Interactive Visualizations",
      description:
        "Watch algorithms execute step-by-step with smooth animations and real-time feedback.",
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Code Implementation",
      description:
        "View actual code implementations in multiple programming languages for each algorithm.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Complexity Analysis",
      description:
        "Understand time and space complexity with visual graphs and detailed explanations.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Learning Path",
      description:
        "Follow structured learning paths from beginner to advanced algorithm concepts.",
    },
  ];

  const algorithmCategories = [
    "Sorting Algorithms",
    "Search Algorithms",
    "Graph Algorithms",
    "Dynamic Programming",
    "Tree Algorithms",
    "String Algorithms",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Main Content */}
      <div className="text-center text-white max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">
            Algorithm{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Visualizer
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Master data structures and algorithms through interactive
            visualizations. Watch algorithms come to life with step-by-step
            animations and real-time complexity analysis.
          </p>

          <div className="flex gap-4 justify-center">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Start Learning
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="border border-gray-600 hover:border-gray-400 bg-gray-800/50 hover:bg-gray-700/50 px-8 py-3 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm"
            >
              View Documentation
            </button>
          </div>
        </div>

        {/* Algorithm Categories Preview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
          {algorithmCategories.map((category, index) => (
            <div
              key={index}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:bg-gray-700/40 transition-all duration-300"
            >
              <span className="text-sm text-gray-300">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Documentation
                  </h2>
                  <p className="text-gray-400">Complete guide to AlgoViz</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Introduction */}
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    AlgoViz
                  </span>
                </h3>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  AlgoViz is an interactive platform designed to help you
                  understand complex algorithms and data structures through
                  beautiful visualizations and hands-on learning.
                </p>
              </div>

              {/* Features Grid */}
              <div>
                <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Key Features
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <div>
                          <h5 className="font-semibold text-white mb-2">
                            {feature.title}
                          </h5>
                          <p className="text-gray-400 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Getting Started */}
              <div>
                <h4 className="text-xl font-semibold text-white mb-6">
                  Getting Started
                </h4>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-white">
                        1. Choose an Algorithm
                      </h5>
                      <ArrowRight className="w-5 h-5 text-cyan-400" />
                    </div>
                    <p className="text-gray-400 text-sm">
                      Browse through our extensive collection of algorithms
                      organized by category. From basic sorting to advanced
                      graph algorithms.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-white">
                        2. Interactive Visualization
                      </h5>
                      <ArrowRight className="w-5 h-5 text-cyan-400" />
                    </div>
                    <p className="text-gray-400 text-sm">
                      Watch the algorithm execute step-by-step with customizable
                      input data and adjustable animation speed.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-white">
                        3. Learn & Practice
                      </h5>
                      <ArrowRight className="w-5 h-5 text-cyan-400" />
                    </div>
                    <p className="text-gray-400 text-sm">
                      Study the code implementation, analyze complexity, and
                      test your understanding with interactive quizzes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Algorithm Categories */}
              <div>
                <h4 className="text-xl font-semibold text-white mb-6">
                  Available Topics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {algorithmCategories.map((category, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4 text-center hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 group"
                    >
                      <span className="text-white font-medium group-hover:text-cyan-300 transition-colors duration-300">
                        {category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-8">
                <h4 className="text-2xl font-bold text-white mb-4">
                  Ready to Start Learning?
                </h4>
                <p className="text-gray-300 mb-6">
                  Join thousands of students and professionals mastering
                  algorithms through interactive visualization.
                </p>
                <div className="flex gap-4 justify-center">
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105">
                    Start Learning Now
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="border border-gray-600 hover:border-gray-400 bg-gray-800/50 hover:bg-gray-700/50 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300"
                  >
                    Close Documentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationModal;
