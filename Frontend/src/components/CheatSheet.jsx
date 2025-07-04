import React, { useState } from "react";
import {
  Search,
  Clock,
  Zap,
  Database,
  List,
  TreePine,
  Hash,
  GitBranch,
} from "lucide-react";

const CheatSheet = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const dataStructures = [
    {
      name: "Array",
      category: "linear",
      icon: <List className="w-6 h-6" />,
      description: "Contiguous memory locations storing elements of same type",
      timeComplexity: {
        access: "O(1)",
        search: "O(n)",
        insertion: "O(n)",
        deletion: "O(n)",
      },
      spaceComplexity: "O(n)",
      useCases: ["Random access", "Cache locality", "Mathematical operations"],
      pros: ["Fast access", "Memory efficient", "Cache friendly"],
      cons: ["Fixed size", "Expensive insertion/deletion"],
    },
    {
      name: "Linked List",
      category: "linear",
      icon: <GitBranch className="w-6 h-6 rotate-90" />,
      description: "Linear collection where elements point to next element",
      timeComplexity: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(1)",
        deletion: "O(1)",
      },
      spaceComplexity: "O(n)",
      useCases: [
        "Dynamic size",
        "Frequent insertion/deletion",
        "Stack/Queue implementation",
      ],
      pros: [
        "Dynamic size",
        "Efficient insertion/deletion",
        "Memory efficient",
      ],
      cons: [
        "No random access",
        "Extra memory for pointers",
        "Not cache friendly",
      ],
    },
    {
      name: "Stack",
      category: "linear",
      icon: <Database className="w-6 h-6" />,
      description: "LIFO (Last In First Out) data structure",
      timeComplexity: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(1)",
        deletion: "O(1)",
      },
      spaceComplexity: "O(n)",
      useCases: ["Function calls", "Expression evaluation", "Undo operations"],
      pros: ["Simple operations", "Memory efficient", "Fast push/pop"],
      cons: ["Limited access", "Stack overflow risk"],
    },
    {
      name: "Queue",
      category: "linear",
      icon: <List className="w-6 h-6" />,
      description: "FIFO (First In First Out) data structure",
      timeComplexity: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(1)",
        deletion: "O(1)",
      },
      spaceComplexity: "O(n)",
      useCases: [
        "BFS traversal",
        "Process scheduling",
        "Buffer implementation",
      ],
      pros: ["Fair ordering", "Efficient enqueue/dequeue"],
      cons: ["Limited access", "Memory overhead"],
    },
    {
      name: "Binary Tree",
      category: "tree",
      icon: <TreePine className="w-6 h-6" />,
      description: "Hierarchical structure with at most 2 children per node",
      timeComplexity: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(n)",
        deletion: "O(n)",
      },
      spaceComplexity: "O(n)",
      useCases: ["Hierarchical data", "Expression trees", "Decision trees"],
      pros: ["Hierarchical structure", "Flexible size"],
      cons: ["Can become unbalanced", "Complex operations"],
    },
    {
      name: "Binary Search Tree",
      category: "tree",
      icon: <TreePine className="w-6 h-6" />,
      description: "Binary tree with ordered property (left < root < right)",
      timeComplexity: {
        access: "O(log n)",
        search: "O(log n)",
        insertion: "O(log n)",
        deletion: "O(log n)",
      },
      spaceComplexity: "O(n)",
      useCases: ["Sorted data", "Range queries", "Database indexing"],
      pros: ["Efficient search", "Ordered traversal", "Dynamic size"],
      cons: ["Can degrade to O(n)", "Complex balancing"],
    },
    {
      name: "Hash Table",
      category: "hash",
      icon: <Hash className="w-6 h-6" />,
      description: "Key-value pairs using hash function for indexing",
      timeComplexity: {
        access: "N/A",
        search: "O(1)",
        insertion: "O(1)",
        deletion: "O(1)",
      },
      spaceComplexity: "O(n)",
      useCases: ["Fast lookups", "Caching", "Database indexing"],
      pros: ["Very fast operations", "Flexible keys", "Constant time"],
      cons: ["Hash collisions", "Memory overhead", "No ordering"],
    },
    {
      name: "Heap",
      category: "tree",
      icon: <TreePine className="w-6 h-6" />,
      description: "Complete binary tree with heap property (min/max)",
      timeComplexity: {
        access: "O(1)",
        search: "O(n)",
        insertion: "O(log n)",
        deletion: "O(log n)",
      },
      spaceComplexity: "O(n)",
      useCases: ["Priority queues", "Heap sort", "Graph algorithms"],
      pros: ["Fast min/max access", "Efficient insertion", "Complete tree"],
      cons: ["Slow search", "Complex operations"],
    },
  ];

  const categories = [
    { id: "all", name: "All", icon: <Database className="w-4 h-4" /> },
    { id: "linear", name: "Linear", icon: <List className="w-4 h-4" /> },
    { id: "tree", name: "Tree", icon: <TreePine className="w-4 h-4" /> },
    { id: "hash", name: "Hash", icon: <Hash className="w-4 h-4" /> },
  ];

  const filteredStructures = dataStructures.filter((ds) => {
    const matchesSearch =
      ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || ds.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getComplexityColor = (complexity) => {
    if (complexity.includes("1")) return "text-green-600 bg-green-50";
    if (complexity.includes("log n")) return "text-blue-600 bg-blue-50";
    if (complexity.includes("n")) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Database className="w-10 h-10 text-blue-400" />
            Data Structures Cheatsheet
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Quick reference for time complexities, space complexities, and use
            cases of common data structures
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search data structures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border text-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Time Complexity Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium text-green-400 bg-green-900/50">
                O(1)
              </span>
              <span className="text-sm text-gray-300">Constant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-blue-50">
                O(log n)
              </span>
              <span className="text-sm text-gray-600">Logarithmic</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium text-yellow-600 bg-yellow-50">
                O(n)
              </span>
              <span className="text-sm text-gray-600">Linear</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium text-red-600 bg-red-50">
                O(n²)
              </span>
              <span className="text-sm text-gray-600">Quadratic</span>
            </div>
          </div>
        </div>

        {/* Data Structures Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStructures.map((ds, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="p-6 bg-gray-800 text-white">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {ds.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{ds.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {ds.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Time Complexity */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Time Complexity
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(ds.timeComplexity).map(
                      ([operation, complexity]) => (
                        <div
                          key={operation}
                          className="flex justify-between items-center py-1"
                        >
                          <span className="text-sm  capitalize">
                            {operation}:
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(
                              complexity
                            )}`}
                          >
                            {complexity}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Space Complexity */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Database className="w-4 h-4" />
                    Space Complexity
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getComplexityColor(
                      ds.spaceComplexity
                    )}`}
                  >
                    {ds.spaceComplexity}
                  </span>
                </div>

                {/* Use Cases */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Common Use Cases
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {ds.useCases.map((useCase, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-semibold text-green-700 mb-2">
                      Pros
                    </h5>
                    <ul className="text-xs  space-y-1">
                      {ds.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-red-700 mb-2">
                      Cons
                    </h5>
                    <ul className="text-xs space-y-1">
                      {ds.cons.map((con, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStructures.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No data structures found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Quick Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white" />
                <span>
                  Choose the right data structure based on your use case
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white" />
                <span>Consider both time and space complexity</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-white" />
                <span>Understand the trade-offs for optimal performance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheatSheet;
