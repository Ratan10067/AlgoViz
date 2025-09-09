import React, { useState, useRef, useEffect } from "react";
import {
  Play, Code, GitBranch, Grid3X3, Shuffle, Search, TrendingUp, Layers, ChevronRight, Github, Twitter, Mail, Heart, X, Clock, Zap, ArrowUp, Rocket, Sparkles, Star, Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Accent color mapping for Tailwind
const accentClassMap = {
  "teal-400": "text-teal-400 bg-teal-400 border-teal-400",
  "emerald-400": "text-emerald-400 bg-emerald-400 border-emerald-400",
  "indigo-400": "text-indigo-400 bg-indigo-400 border-indigo-400",
  "amber-400": "text-amber-400 bg-amber-400 border-amber-400",
  "rose-400": "text-rose-400 bg-rose-400 border-rose-400",
  "violet-400": "text-violet-400 bg-violet-400 border-violet-400",
};

// Gradient mapping for Tailwind
const gradientClassMap = {
  "arrays": "from-teal-600 via-cyan-600 to-blue-600",
  "trees": "from-emerald-600 via-green-600 to-lime-600",
  "dynamic": "from-indigo-600 via-purple-600 to-violet-600",
  "searching": "from-amber-600 via-orange-600 to-red-600",
  "greedy": "from-rose-600 via-pink-600 to-fuchsia-600",
  "backtracking": "from-violet-600 via-purple-600 to-indigo-600",
};

const AlgorithmHomePage = () => {
  const { theme, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTopic, setModalTopic] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [isStartLearningActive, setIsStartLearningActive] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [scrollHover, setScrollHover] = useState(false);
  const [showScrollShade, setShowScrollShade] = useState(false);
  const topicsRef = useRef(null);
  const sectionRefs = useRef([]);
  const navigate = useNavigate();

  // Scroll animations (intersection observer)
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
          }
        });
      },
      { threshold: 0.1 }
    );
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Scroll to top visibility handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollToTop(scrollTop > 500);
      setShowScrollShade(scrollTop > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Particle background: use canvas for better performance
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 15;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(94, 234, 212, ${Math.random() * 0.2})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animateParticles);
    };



    createParticles();
    animateParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    };
  }, []);

  // Topics data
  const topics = [
    {
      id: "arrays",
      title: "Arrays & Sorting",
      icon: <Grid3X3 className="w-8 h-8" />,
      description: "Explore fundamental array operations and sorting algorithms with interactive demonstrations",
      algorithms: [
        { name: "Bubble Sort", difficulty: "Easy", time: "O(n²)", id: "bubble-sort" },
        { name: "Quick Sort", difficulty: "Medium", time: "O(n log n)", id: "quick-sort" },
        { name: "Merge Sort", difficulty: "Medium", time: "O(n log n)", id: "merge-sort" },
        { name: "Binary Search", difficulty: "Easy", time: "O(log n)", id: "binary-search" },
        { name: "Linear Search", difficulty: "Easy", time: "O(n)", id: "linear-search" },
        { name: "Heap Sort", difficulty: "Hard", time: "O(n log n)", id: "heap-sort" },
      ],
      accent: "teal-400",
    },
    {
      id: "trees",
      title: "Trees & Graphs",
      icon: <GitBranch className="w-8 h-8" />,
      description: "Visualize complex tree structures and graph traversal algorithms in real-time",
      algorithms: [
        { name: "Binary Search Tree", difficulty: "Medium", time: "O(log n)", id: "bst" },
        { name: "AVL Tree", difficulty: "Hard", time: "O(log n)", id: "avl-tree" },
        { name: "Depth First Search (DFS)", difficulty: "Medium", time: "O(V*E)", id: "dfs" },
        { name: "Breadth First Search (BFS)", difficulty: "Medium", time: "O(V + E)", id: "bfs" },
        { name: "Dijkstra's Algorithm", difficulty: "Hard", time: "O(V²)", id: "dijkstra" },
        { name: "Tree Traversals", difficulty: "Easy", time: "O(n)", id: "tree-traversal" },
      ],
      accent: "emerald-400",
    },
    {
      id: "dynamic",
      title: "Dynamic Programming",
      icon: <Layers className="w-8 h-8" />,
      description: "Master optimization problems with elegant dynamic programming solutions",
      algorithms: [
        { name: "Fibonacci Sequence", difficulty: "Easy", time: "O(n)", id: "fibonacci" },
        { name: "Knapsack Problem", difficulty: "Hard", time: "O(nW)", id: "knapsack" },
        { name: "Longest Common Subsequence", difficulty: "Medium", time: "O(nm)", id: "lcs" },
        { name: "Edit Distance", difficulty: "Medium", time: "O(nm)", id: "edit-distance" },
        { name: "Coin Change", difficulty: "Medium", time: "O(nW)", id: "coin-change" },
        { name: "Matrix Chain Multiplication", difficulty: "Hard", time: "O(n³)", id: "mcm" },
      ],
      accent: "indigo-400",
    },
    {
      id: "searching",
      title: "Search Algorithms",
      icon: <Search className="w-8 h-8" />,
      description: "Discover efficient searching techniques with visual complexity analysis",
      algorithms: [
        { name: "Linear Search", difficulty: "Easy", time: "O(n)", id: "linear-search" },
        { name: "Binary Search", difficulty: "Easy", time: "O(log n)", id: "binary-search" },
        { name: "Interpolation Search", difficulty: "Medium", time: "O(log log n)", id: "interpolation-search" },
        { name: "Exponential Search", difficulty: "Medium", time: "O(log n)", id: "exponential-search" },
        { name: "Ternary Search", difficulty: "Medium", time: "O(log n)", id: "ternary-search" },
        { name: "Jump Search", difficulty: "Easy", time: "O(√n)", id: "jump-search" },
      ],
      accent: "amber-400",
    },
    {
      id: "greedy",
      title: "Greedy Algorithms",
      icon: <TrendingUp className="w-8 h-8" />,
      description: "Understand greedy strategies for solving optimization challenges",
      algorithms: [
        { name: "Activity Selection", difficulty: "Medium", time: "O(n log n)", id: "activity-selection" },
        { name: "Huffman Coding", difficulty: "Hard", time: "O(n log n)", id: "huffman-coding" },
        { name: "Fractional Knapsack", difficulty: "Medium", time: "O(n log n)", id: "fractional-knapsack" },
        { name: "Job Scheduling", difficulty: "Medium", time: "O(n log n)", id: "job-scheduling" },
        { name: "Minimum Spanning Tree", difficulty: "Hard", time: "O(E log V)", id: "mst" },
        { name: "Coin Change Greedy", difficulty: "Easy", time: "O(n)", id: "coin-change-greedy" },
      ],
      accent: "rose-400",
    },
    {
      id: "backtracking",
      title: "Backtracking",
      icon: <Shuffle className="w-8 h-8" />,
      description: "Solve complex constraint problems using intelligent backtracking",
      algorithms: [
        { name: "N-Queens Problem", difficulty: "Hard", time: "O(N!)", id: "n-queens" },
        { name: "Sudoku Solver", difficulty: "Hard", time: "O(9^(n*n))", id: "sudoku-solver" },
        { name: "Maze Solver", difficulty: "Medium", time: "O(4^(n*m))", id: "maze-solver" },
        { name: "Subset Sum", difficulty: "Medium", time: "O(2^n)", id: "subset-sum" },
        { name: "Graph Coloring", difficulty: "Hard", time: "O(m^V)", id: "graph-coloring" },
        { name: "Hamiltonian Path", difficulty: "Hard", time: "O(N!)", id: "hamiltonian-path" },
      ],
      accent: "violet-400",
    },
  ];

  const scrollToTopics = () => {
    if (topicsRef.current) {
      topicsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (!selectedAlgorithm) return;
    
    // Graph algorithms
    if (selectedAlgorithm.id === "bfs") {
      navigate("/bfs-visualizer");
    } else if (selectedAlgorithm.id === "dfs") {
      navigate("/dfs-visualizer");
    } else if (selectedAlgorithm.id === "dijkstra") {
      navigate("/dijkstra-visualizer");
    }
    // Sorting algorithms
    else if (selectedAlgorithm.id === "bubble-sort") {
      navigate("/bubble-sort");
    } else if (selectedAlgorithm.id === "quick-sort") {
      navigate("/quick-sort");
    } else if (selectedAlgorithm.id === "merge-sort") {
      navigate("/merge-sort");
    } else if (selectedAlgorithm.id === "heap-sort") {
      navigate("/heap-sort");
    }
    // Search algorithms
    else if (selectedAlgorithm.id === "binary-search") {
      navigate("/binary-search");
    } else if (selectedAlgorithm.id === "linear-search") {
      navigate("/linear-search");
    } else if (selectedAlgorithm.id === "exponential-search") {
      navigate("/exponential-search");
    } else if (selectedAlgorithm.id === "interpolation-search") {
      navigate("/interpolation-search");
    } else if (selectedAlgorithm.id === "jump-search") {
      navigate("/jump-search");
    } else if (selectedAlgorithm.id === "ternary-search") {
      navigate("/ternary-search");
    }
    // Tree algorithms
    else if (selectedAlgorithm.id === "tree-traversal") {
      navigate("/tree-traversal");
    } else if (selectedAlgorithm.id === "bst") {
      navigate("/bst");
    } else if (selectedAlgorithm.id === "avl-tree") {
      navigate("/avl-tree");
    }
    // Dynamic Programming
    else if (selectedAlgorithm.id === "fibonacci") {
      navigate("/fibonacci");
    } else if (selectedAlgorithm.id === "knapsack") {
      navigate("/knapsack");
    } else if (selectedAlgorithm.id === "lcs") {
      navigate("/lcs");
    } else if (selectedAlgorithm.id === "edit-distance") {
      navigate("/edit-distance");
    } else if (selectedAlgorithm.id === "coin-change") {
      navigate("/coin-change");
    } else if (selectedAlgorithm.id === "mcm") {
      navigate("/matrix-chain-multiplication");
    }
    // Greedy Algorithms
    else if (selectedAlgorithm.id === "activity-selection") {
      navigate("/activity-selection");
    } else if (selectedAlgorithm.id === "huffman-coding") {
      navigate("/huffman-coding");
    } else if (selectedAlgorithm.id === "fractional-knapsack") {
      navigate("/fractional-knapsack");
    } else if (selectedAlgorithm.id === "job-scheduling") {
      navigate("/job-scheduling");
    } else if (selectedAlgorithm.id === "mst") {
      navigate("/minimum-spanning-tree");
    } else if (selectedAlgorithm.id === "coin-change-greedy") {
      navigate("/coin-change-greedy");
    }
    // Backtracking
    else if (selectedAlgorithm.id === "n-queens") {
      navigate("/n-queens");
    } else if (selectedAlgorithm.id === "sudoku-solver") {
      navigate("/sudoku-solver");
    } else if (selectedAlgorithm.id === "maze-solver") {
      navigate("/maze-solver");
    } else if (selectedAlgorithm.id === "subset-sum") {
      navigate("/subset-sum");
    } else if (selectedAlgorithm.id === "graph-coloring") {
      navigate("/graph-coloring");
    } else if (selectedAlgorithm.id === "hamiltonian-path") {
      navigate("/hamiltonian-path");
    }
    // All other algorithms show coming soon
    else {
      setShowComingSoon(true);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-300 bg-emerald-500/20 border-emerald-400/40";
      case "Medium":
        return "text-amber-300 bg-amber-500/20 border-amber-400/40";
      case "Hard":
        return "text-rose-300 bg-rose-500/20 border-rose-400/40";
      default:
        return "text-slate-300 bg-slate-500/20 border-slate-400/40";
    }
  };

  // Auth Modal handlers
  const handleSignIn = () => {
    setShowAuthModal(false);
    navigate("/signin");
  };
  const handleRegister = () => {
    setShowAuthModal(false);
    navigate("/register");
  };

  // Documentation button
  const handleViewDocs = () => {
    navigate("/view-documentation");
  };

  // Accessibility: close modal with ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isModalOpen]);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-900'}`}>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .glassmorphism {
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: background 0.7s, color 0.7s;
        }
        .liquid-bg {
          background: linear-gradient(270deg, #0c4a6e, #164e63, #1e3a8a, #374151);
          background-size: 400% 400%;
          animation: liquid-move 15s ease infinite;
        }
        @keyframes liquid-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        body.algo-light {
          background: #f3f4f6 !important;
          color: #222 !important;
          transition: background 0.7s, color 0.7s;
        }
        body.algo-dark {
          background: #0f172a !important;
          color: #fff !important;
          transition: background 0.7s, color 0.7s;
        }
      `}</style>

      {/* Hero Section */}
      <header className="relative overflow-hidden liquid-bg">
        <div className="container mx-auto px-6 py-24 text-center relative z-10">
          <div ref={el => sectionRefs.current[0] = el} className="opacity-0">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className={`text-6xl md:text-8xl font-black mb-6 leading-tight text-white`}>
              Algorithm
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400 bg-clip-text text-transparent block">
                Visualizer
              </span>
            </h1>
            <p className={`text-xl mb-12 max-w-4xl mx-auto leading-relaxed`}>
              <span className={`${theme === 'dark' ? 'text-slate-300' : 'text-gray-200'}`}>
                Experience the future of algorithm learning through stunning visualizations,
                interactive simulations, and real-time complexity analysis.
              </span>
              <span className={`font-semibold text-cyan-400`}> Transform your understanding</span>
              <span className={`${theme === 'dark' ? 'text-slate-300' : 'text-gray-200'}`}> of computer science fundamentals.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={scrollToTopics}
                className={`group px-10 py-4 ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white' : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600'} rounded-2xl transition-all duration-500 shadow-2xl transform hover:scale-110 active:scale-95 relative overflow-hidden`}
                aria-label="Start Your Journey"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center space-x-3">
                  <Play className="w-6 h-6 group-hover:animate-pulse" />
                  <span className="font-bold text-lg">Start Your Journey</span>
                  <Flame className="w-5 h-5 text-orange-300 group-hover:animate-bounce" />
                </div>
              </button>
              <button
                className={`group px-8 py-4 glassmorphism rounded-2xl border transition-all duration-300 transform hover:scale-105 active:scale-95 ${theme === 'dark' ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 bg-white/50 text-gray-900 hover:bg-white/80 shadow-lg'}`}
                onClick={handleViewDocs}
                aria-label="View Documentation"
              >
                <span className="font-semibold group-hover:text-cyan-400 transition-colors duration-300">
                  View Documentation
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Topics Section */}
      <section ref={topicsRef} className="py-24 relative">
        <div className="container mx-auto px-6">
          <div ref={el => sectionRefs.current[1] = el} className="opacity-0 text-center mb-20">
            <h2 className={`text-5xl md:text-6xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Explore Algorithm
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"> Topics</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
              Dive deep into specialized algorithm categories, each crafted with immersive visualizations
              and interactive learning experiences
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic, index) => (
              <div
                key={topic.id}
                className="group relative overflow-hidden rounded-3xl glassmorphism cursor-pointer border border-white/10 transition-all duration-300 ease-in-out hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20"
                onClick={() => openModal(topic)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${topic.title} modal`}
                onKeyDown={e => { if (e.key === "Enter") openModal(topic); }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClassMap[topic.id]} opacity-0 group-hover:opacity-10 transition-all duration-700`}></div>
                <div className="relative p-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${gradientClassMap[topic.id]} mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    {topic.icon}
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 group-hover:${accentClassMap[topic.accent]?.split(" ")[0]} transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {topic.title}
                  </h3>
                  <p className={`mb-8 leading-relaxed group-hover:transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-600 group-hover:text-gray-700'}`}>
                    {topic.description}
                  </p>
                  <div className={`w-full px-6 py-4 glassmorphism rounded-2xl border transition-all duration-500 flex items-center justify-center space-x-3 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                    <span className={`font-semibold group-hover:${accentClassMap[topic.accent]?.split(" ")[0]} transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      Explore Algorithms
                    </span>
                    <ChevronRight className={`w-5 h-5 group-hover:translate-x-2 group-hover:${accentClassMap[topic.accent]?.split(" ")[0]} transition-all duration-300`} />
                  </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${accentClassMap[topic.accent]?.split(" ")[1]}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div ref={el => sectionRefs.current[2] = el} className="opacity-0 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`text-4xl md:text-5xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Why Choose
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"> AlgoViz?</span>
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                Experience the next generation of algorithm education with cutting-edge features
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className={`group p-8 rounded-3xl border relative overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'glassmorphism border-cyan-500/20 hover:border-cyan-400/40' : 'bg-white border-cyan-200 hover:border-cyan-300 shadow-lg hover:shadow-xl'}`}
                style={theme === 'dark' ? {
                  background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.5), rgba(6, 78, 59, 0.2))'
                } : {
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(240, 249, 255, 0.8))'
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 text-center group-hover:text-cyan-400 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Interactive Visualizations
                </h3>
                <p className={`text-center leading-relaxed group-hover:transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-600 group-hover:text-gray-700'}`}>
                  Immerse yourself in algorithm execution with stunning real-time animations,
                  interactive controls, and dynamic data flow visualization.
                </p>
              </div>
              <div className={`group p-8 rounded-3xl border relative overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'glassmorphism border-emerald-500/20 hover:border-emerald-400/40' : 'bg-white border-emerald-200 hover:border-emerald-300 shadow-lg hover:shadow-xl'}`}
                style={theme === 'dark' ? {
                  background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.5), rgba(6, 78, 59, 0.2))'
                } : {
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(236, 253, 245, 0.8))'
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 text-center group-hover:text-emerald-400 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Advanced Analytics
                </h3>
                <p className={`text-center leading-relaxed group-hover:transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-600 group-hover:text-gray-700'}`}>
                  Deep dive into complexity analysis with interactive graphs, performance metrics,
                  and comparative studies across different algorithms.
                </p>
              </div>
              <div className={`group p-8 rounded-3xl border relative overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'glassmorphism border-indigo-500/20 hover:border-indigo-400/40' : 'bg-white border-indigo-200 hover:border-indigo-300 shadow-lg hover:shadow-xl'}`}
                style={theme === 'dark' ? {
                  background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.5), rgba(49, 46, 129, 0.2))'
                } : {
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(238, 242, 255, 0.8))'
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 text-center group-hover:text-indigo-400 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Multi-Language Support
                </h3>
                <p className={`text-center leading-relaxed group-hover:transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-600 group-hover:text-gray-700'}`}>
                  Access comprehensive code implementations across Python, JavaScript, Java, C++,
                  and more with intelligent syntax highlighting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Modal */}
      {isModalOpen && modalTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg" onClick={closeModal} aria-modal="true" role="dialog">
          <div
            className={`relative w-full max-w-5xl h-[85vh] flex flex-col glassmorphism rounded-3xl border overflow-hidden shadow-2xl ${theme === 'dark' ? 'border-cyan-500/30' : 'border-gray-300'}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header section - Fixed height */}
            <div className={`p-6 ${gradientClassMap[modalTopic.id]} relative overflow-hidden`}>
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${gradientClassMap[modalTopic.id]} shadow-lg`}>
                    {modalTopic.icon}
                  </div>
                  <div>
                    <h2 className={`text-2xl md:text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {modalTopic.title}
                    </h2>
                    <p className={`text-sm md:text-base mt-1 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                      {modalTopic.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className={`p-2 rounded-xl glassmorphism hover:text-red-400 transition-all duration-300 border absolute top-2 right-2 md:static ${theme === 'dark' ? 'text-white hover:bg-white/10 border-white/10' : 'text-gray-600 hover:bg-gray-100 border-gray-200'}`}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Algorithm list - Scrollable content with fixed height */}
            <div className={`flex-1 overflow-y-auto p-6 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900/50 to-slate-950/50' : 'bg-gradient-to-b from-gray-50/50 to-white/50'}`}>
              <div className="grid gap-4">
                {modalTopic.algorithms.map((algorithm, index) => (
                  <div
                    key={index}
                    onClick={() => selectAlgorithm(algorithm)}
                    className={`p-5 rounded-xl border transition-all duration-300 group cursor-pointer relative overflow-hidden ${selectedAlgorithm?.id === algorithm.id
                        ? `bg-gradient-to-r ${gradientClassMap[modalTopic.id]}/20 border-${modalTopic.accent}/50 shadow-lg`
                        : theme === 'dark' ? "glassmorphism border-white/10 hover:border-white/20 hover:bg-white/5" : "bg-white/50 border-gray-200 hover:border-gray-300 hover:bg-white/80"
                      }`}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${algorithm.name}`}
                    onKeyDown={e => { if (e.key === "Enter") selectAlgorithm(algorithm); }}
                  >
                    <div className="relative flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold transition-colors duration-300 ${selectedAlgorithm?.id === algorithm.id
                            ? accentClassMap[modalTopic.accent]?.split(" ")[0]
                            : theme === 'dark' ? "text-white" : "text-gray-900"
                          }`}>
                          {algorithm.name}
                        </h3>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(algorithm.difficulty)
                            }`}>
                            {algorithm.difficulty}
                          </span>
                          <div className={`flex items-center space-x-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                            <Clock className="w-3 h-3" />
                            <span>{algorithm.time}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 transition-all duration-300 ${selectedAlgorithm?.id === algorithm.id
                            ? accentClassMap[modalTopic.accent]?.split(" ")[0] + " rotate-90"
                            : theme === 'dark' ? "text-slate-500 group-hover:text-slate-300" : "text-gray-400 group-hover:text-gray-600"
                          }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed button section - Always visible */}
            <div className={`flex justify-center p-4 border-t transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-cyan-500/30' : 'bg-gray-50 border-gray-200'}`}>
              <button
                onClick={startLearning}
                disabled={!selectedAlgorithm}
                className={`w-fit px-4 py-3 rounded-xl font-bold text-lg transition-all duration-500 ${selectedAlgorithm
                    ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg hover:opacity-90"
                    : theme === 'dark' ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                aria-label="Start Visualizing"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Rocket className="w-5 h-5" />
                  <span>Start Visualizing</span>
                  {selectedAlgorithm && (
                    <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                  )}
                </div>
              </button>
            </div>

            {/* Coming Soon Modal */}
            {showComingSoon && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur" onClick={() => setShowComingSoon(false)} aria-modal="true" role="dialog">
                <div
                  className={`rounded-xl p-6 max-w-xs w-full shadow-xl border relative transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900 border-cyan-500/30' : 'bg-white border-gray-200'}`}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className={`absolute top-2 right-2 hover:text-red-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}
                    onClick={() => setShowComingSoon(false)}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className={`text-xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>Coming Soon</h2>
                  <div className={`text-center ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                    This algorithm visualizer is under development!
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-100'}`}>
                      <Clock className={`w-6 h-6 animate-pulse ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`relative border-t mt-32 py-16 glassmorphism ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  AlgoViz
                </span>
              </div>
              <p className={`max-w-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                Visualizing algorithms for better understanding and learning experiences.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="p-3 glassmorphism rounded-xl hover:bg-cyan-600/20 transition-colors duration-300" aria-label="GitHub">
                  <Github className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`} />
                </a>
                <a href="#" className="p-3 glassmorphism rounded-xl hover:bg-cyan-600/20 transition-colors duration-300" aria-label="Twitter">
                  <Twitter className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`} />
                </a>
                <a href="#" className="p-3 glassmorphism rounded-xl hover:bg-cyan-600/20 transition-colors duration-300" aria-label="Mail">
                  <Mail className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`} />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Resources</h4>
                <ul className="space-y-3">
                  <li><a href="#" className={`hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Documentation</a></li>
                  <li><a href="#" className={`hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Tutorials</a></li>
                  <li><a href="/blogs" className={`hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Blog</a></li>
                  <li><a href="/support" className={`hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Company</h4>
                <ul className="space-y-3">
                  <li><a href="/about" className={`hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>About</a></li>
                  <li><a href="#" className={`hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Careers</a></li>
                  <li><a href="/contact" className={`hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Contact</a></li>
                  <li><a href="#" className={`hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Partners</a></li>
                </ul>
              </div>
              <div>
                <h4 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Legal</h4>
                <ul className="space-y-3">
                  <li><a href="#" className={`hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Privacy Policy</a></li>
                  <li><a href="#" className={`hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Terms of Service</a></li>
                  <li><a href="#" className={`hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Cookie Policy</a></li>
                  <li><a href="#" className={`hover:text-cyan-400 transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Licensing</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className={`border-t mt-16 pt-8 text-center ${theme === 'dark' ? 'border-cyan-500' : 'border-gray-400'}`}>
            <p className={`flex items-center justify-center ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
              <span>Made with</span>
              <Heart className="w-5 h-5 text-rose-500 mx-2 animate-pulse" />
              <span>for the developer community</span>
            </p>
          </div>
        </div>
      </footer>

      {/* CodeForces-style Scroll to Top - Left Side Full Height Rectangle */}
      {showScrollShade && (
        <div
          className="cf-scroll-to-top"
          style={{ position: 'fixed', left: 0, top: 0, height: '100vh', width: '40px', zIndex: 40 }}
          onMouseEnter={() => setScrollHover(true)}
          onMouseLeave={() => setScrollHover(false)}
        >
          <div style={{ width: '100%', height: '100%', background: scrollHover ? (theme === 'dark' ? 'rgba(30,41,59,0.15)' : 'rgba(59,130,246,0.08)') : (theme === 'dark' ? 'rgba(30,41,59,0.08)' : 'rgba(59,130,246,0.04)'), transition: 'background 0.2s', position: 'absolute', left: 0, top: 0 }} />
          {scrollHover && (
            <button
              onClick={scrollToTop}
              style={{ position: 'relative', zIndex: 1 }}
              className={`w-full h-full flex flex-col items-center justify-center group transition-all duration-200 ${theme === 'dark' ? 'hover:bg-slate-700/20 text-slate-400 hover:text-cyan-400' : 'hover:bg-gray-100/20 text-gray-500 hover:text-blue-600'}`}
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              {/* Up arrow icon */}
              <svg 
                className="cf-scroll-arrow w-5 h-5 transition-transform duration-200 group-hover:-translate-y-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 10l7-7m0 0l7 7m-7-7v18" 
                />
              </svg>
              {/* Small "top" text */}
              <span className="cf-scroll-text text-xs font-medium mt-1 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                TOP
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AlgorithmHomePage;