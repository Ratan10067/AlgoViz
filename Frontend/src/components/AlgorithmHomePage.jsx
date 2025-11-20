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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen || showComingSoon) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, showComingSoon]);

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
    const leftSafeZone = 80; // pixels from left edge to keep particle-free

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        // ensure particle won't spawn in the left-safe zone
        this.x = Math.random() * (canvas.width - leftSafeZone) + leftSafeZone;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(94, 234, 212, ${Math.random() * 0.2})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // keep particles out of left-safe zone while moving
        if (this.x < leftSafeZone) this.x = leftSafeZone;

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
    if (theme === 'dark') {
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
    } else {
      switch (difficulty) {
        case "Easy":
          return "text-emerald-700 bg-emerald-100 border-emerald-300";
        case "Medium":
          return "text-amber-700 bg-amber-100 border-amber-300";
        case "Hard":
          return "text-rose-700 bg-rose-100 border-rose-300";
        default:
          return "text-slate-700 bg-slate-100 border-slate-300";
      }
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
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 text-gray-900'}`}>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .glassmorphism {
          background: ${theme === 'dark' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.7)'};
          backdrop-filter: blur(20px);
          border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          transition: all 0.3s ease;
        }
        .liquid-bg {
          background: ${theme === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1e3a8a 75%, #0f172a 100%)'
          : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 25%, #3b82f6 50%, #06b6d4 75%, #3b82f6 100%)'};
          background-size: 400% 400%;
          animation: liquid-move 20s ease infinite;
        }
        @keyframes liquid-move {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes tilt {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-tilt {
          animation: tilt 4s ease-in-out infinite;
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .card-hover:hover {
          transform: translateY(-12px) scale(1.02);
        }
      `}</style>

      {/* Hero Section - Redesigned */}
      <header className={`relative overflow-hidden liquid-bg min-h-[90vh] flex items-center ${theme === 'dark' ? '' : 'bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600'}`}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-white/5'}`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-float ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-white/20'}`} style={{ animationDelay: '2s' }}></div>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${theme === 'dark' ? 'bg-blue-500/5' : 'bg-white/10'}`}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">
          <div ref={el => sectionRefs.current[0] = el} className="opacity-0">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left space-y-8">
                {/* Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${theme === 'dark' ? 'glassmorphism border-cyan-500/30' : 'bg-white/20 backdrop-blur-md border-white/40'}`}>
                  <Sparkles className={`w-4 h-4 animate-pulse ${theme === 'dark' ? 'text-cyan-400' : 'text-yellow-300'}`} />
                  <span className={`text-sm font-semibold ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent' : 'text-white'}`}>
                    Next-Gen Learning Platform
                  </span>
                  <Star className={`w-4 h-4 animate-pulse ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-200'}`} />
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">
                    <span className={theme === 'dark' ? 'text-white' : 'text-white drop-shadow-lg'}>
                      Master
                    </span>
                    <br />
                    <span className={theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent' : 'text-yellow-300 drop-shadow-lg'}>
                      Algorithms
                    </span>
                    <br />
                    <span className={theme === 'dark' ? 'text-white' : 'text-white drop-shadow-lg'}>
                      Visually
                    </span>
                  </h1>
                  <p className={`text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl ${theme === 'dark' ? 'text-slate-300' : 'text-white/95 drop-shadow-md'}`}>
                    Transform complex algorithms into <span className={`font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-yellow-200'}`}>interactive visualizations</span>.
                    Learn through stunning animations and real-time execution.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={scrollToTopics}
                    className={`group relative px-8 py-4 font-bold text-lg rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden cursor-pointer ${theme === 'dark'
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white hover:shadow-cyan-500/50'
                      : 'bg-white text-blue-600 hover:shadow-white/50'
                      }`}
                    aria-label="Start Your Journey"
                  >
                    <div className={`absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ${theme === 'dark' ? 'bg-gradient-to-r from-white/0 via-white/20 to-white/0' : 'bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0'
                      }`}></div>
                    <div className="relative flex items-center justify-center gap-3">
                      <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                      <span>Explore Algorithms</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                  <button
                    onClick={handleViewDocs}
                    className={`group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 border backdrop-blur-md cursor-pointer ${theme === 'dark'
                      ? 'glassmorphism border-white/20 hover:border-cyan-400/50 text-white'
                      : 'bg-white/20 border-white/40 hover:border-white/60 text-white'
                      }`}
                    aria-label="View Documentation"
                  >
                    <span className="flex items-center gap-2">
                      <Code className={`w-5 h-5 transition-colors ${theme === 'dark' ? 'group-hover:text-cyan-400' : 'group-hover:text-yellow-200'}`} />
                      Documentation
                    </span>
                  </button>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
                  <div className="text-center lg:text-left">
                    <div className={`text-3xl font-black ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent' : 'text-white drop-shadow-lg'}`}>35+</div>
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-white/90'}`}>Algorithms</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className={`text-3xl font-black ${theme === 'dark' ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' : 'text-white drop-shadow-lg'}`}>6</div>
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-white/90'}`}>Categories</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className={`text-3xl font-black ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent' : 'text-white drop-shadow-lg'}`}>100%</div>
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-white/90'}`}>Interactive</div>
                  </div>
                </div>
              </div>

              {/* Right Visual */}
              <div className="hidden lg:flex justify-center items-center">
                <div className="relative w-full max-w-lg">
                  {/* Central Card */}
                  <div className={`relative rounded-3xl p-8 shadow-2xl animate-float border-2 backdrop-blur-md ${theme === 'dark'
                    ? 'glassmorphism border-cyan-500/30'
                    : 'bg-white/10 border-white/30'
                    }`}>
                    <div className="space-y-6">
                      {/* Code Block Simulation */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="space-y-2 font-mono text-sm">
                          <div className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-700'}`}>function <span className={theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}>quickSort</span>(arr) {'{'}</div>
                          <div className={`pl-4 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-800'}`}>if (arr.length {'<='} 1) return arr;</div>
                          <div className={`pl-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>const pivot = arr[0];</div>
                          <div className={`pl-4 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-800'}`}>...</div>
                          <div className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-700'}`}>{'}'}</div>
                        </div>
                      </div>

                      {/* Visualization Bars */}
                      <div className="flex items-end justify-between gap-2 h-32">
                        {[60, 80, 40, 100, 30, 70, 50, 90].map((height, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-t-lg transition-all duration-300 hover:scale-110 ${theme === 'dark'
                              ? 'bg-gradient-to-t from-cyan-500 to-purple-500'
                              : 'bg-gradient-to-t from-blue-500 to-purple-500'
                              }`}
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>

                      {/* Complexity Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-700'}`}>Time Complexity:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-mono ${theme === 'dark'
                          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400'
                          : 'bg-emerald-100 border border-emerald-300 text-emerald-700'
                          }`}>
                          O(n log n)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Icons */}
                  <div className={`absolute -top-8 -left-8 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg animate-float ${theme === 'dark' ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-gradient-to-br from-blue-400 to-cyan-400'
                    }`} style={{ animationDelay: '0.5s' }}>
                    <GitBranch className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg animate-float ${theme === 'dark' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-purple-400 to-pink-400'
                    }`} style={{ animationDelay: '1s' }}>
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute top-1/2 -right-12 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg animate-float ${theme === 'dark' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-emerald-400 to-teal-400'
                    }`} style={{ animationDelay: '1.5s' }}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Topics Section - Redesigned */}
      <section ref={topicsRef} className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div ref={el => sectionRefs.current[1] = el} className="opacity-0 text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism border border-cyan-500/30 mb-6">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                6 Categories • 35+ Algorithms
              </span>
            </div>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Choose Your
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"> Learning Path</span>
            </h2>
            <p className={`text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
              Master algorithms through interactive visualizations. Each category offers hands-on learning with real-time execution.
            </p>
          </div>

          {/* Topics Grid - Bento Box Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {topics.map((topic, index) => (
              <div
                key={topic.id}
                className={`group relative overflow-hidden rounded-3xl glassmorphism border transition-all duration-500 card-hover cursor-pointer ${theme === 'dark' ? 'border-white/10 hover:border-cyan-400/30' : 'border-gray-200 hover:border-blue-400/50'
                  }`}
                onClick={() => openModal(topic)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${topic.title} modal`}
                onKeyDown={e => { if (e.key === "Enter") openModal(topic); }}
              >
                {/* Gradient Background Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClassMap[topic.id]} opacity-0 group-hover:opacity-20 transition-all duration-500`}></div>

                {/* Decorative Corner Elements */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientClassMap[topic.id]} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`}></div>

                <div className="relative p-6 lg:p-8 h-full flex flex-col">
                  {/* Icon with Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${gradientClassMap[topic.id]} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      {topic.icon}
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientClassMap[topic.id]} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`}></div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-100 text-blue-600'}`}>
                      {topic.algorithms.length} algos
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <h3 className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white group-hover:text-cyan-400' : 'text-gray-900 group-hover:text-blue-600'
                      }`}>
                      {topic.title}
                    </h3>
                    <p className={`text-sm lg:text-base leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                      }`}>
                      {topic.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between group-hover:justify-center transition-all duration-300">
                      <span className={`font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-slate-300 group-hover:text-cyan-400' : 'text-gray-700 group-hover:text-blue-600'
                        }`}>
                        Explore Now
                      </span>
                      <ChevronRight className={`w-5 h-5 transition-all duration-300 group-hover:translate-x-2 ${theme === 'dark' ? 'text-slate-400 group-hover:text-cyan-400' : 'text-gray-500 group-hover:text-blue-600'
                        }`} />
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  style={{
                    background: `linear-gradient(45deg, transparent 30%, ${theme === 'dark' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(59, 130, 246, 0.1)'} 50%, transparent 70%)`,
                    backgroundSize: '200% 200%',
                    animation: 'gradient-shift 3s ease infinite'
                  }}>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section - Redesigned */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div ref={el => sectionRefs.current[2] = el} className="opacity-0 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism border border-purple-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Why Developers Love Us
                </span>
              </div>
              <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Built for
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"> Modern Learning</span>
              </h2>
              <p className={`text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                Experience algorithm education reimagined with cutting-edge visualizations and interactive features
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 */}
              <div className={`group relative p-8 lg:p-10 rounded-3xl border overflow-hidden card-hover ${theme === 'dark' ? 'glassmorphism border-cyan-500/20 hover:border-cyan-400/40' : 'bg-white border-gray-200 hover:border-blue-400/50 shadow-lg'
                }`}>
                {/* Animated Border Top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 space-y-6">
                  {/* Icon */}
                  <div className="inline-flex">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white group-hover:text-cyan-400' : 'text-gray-900 group-hover:text-blue-600'
                      }`}>
                      Interactive Visualizations
                    </h3>
                    <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                      Watch algorithms come alive with stunning real-time animations, step-by-step execution, and interactive controls.
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 pt-4">
                    {['Real-time execution', 'Step-by-step mode', 'Custom input data'].map((feature, i) => (
                      <li key={i} className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feature 2 */}
              <div className={`group relative p-8 lg:p-10 rounded-3xl border overflow-hidden card-hover ${theme === 'dark' ? 'glassmorphism border-emerald-500/20 hover:border-emerald-400/40' : 'bg-white border-gray-200 hover:border-emerald-400/50 shadow-lg'
                }`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 space-y-6">
                  <div className="inline-flex">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white group-hover:text-emerald-400' : 'text-gray-900 group-hover:text-emerald-600'
                      }`}>
                      Performance
                      <br />
                      Analytics
                    </h3>
                    <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                      Deep dive into complexity analysis with live performance metrics, comparison charts, and optimization insights.
                    </p>
                  </div>

                  <ul className="space-y-2 pt-4">
                    {['Time complexity graphs', 'Space usage tracking', 'Algorithm comparison'].map((feature, i) => (
                      <li key={i} className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feature 3 */}
              <div className={`group relative p-8 lg:p-10 rounded-3xl border overflow-hidden card-hover ${theme === 'dark' ? 'glassmorphism border-purple-500/20 hover:border-purple-400/40' : 'bg-white border-gray-200 hover:border-purple-400/50 shadow-lg'
                }`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 space-y-6">
                  <div className="inline-flex">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white group-hover:text-purple-400' : 'text-gray-900 group-hover:text-purple-600'
                      }`}>
                      Multi-Language
                      <br />
                      Code
                    </h3>
                    <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                      View implementations in Python, JavaScript, C++, Java, and more with syntax highlighting and explanations.
                    </p>
                  </div>

                  <ul className="space-y-2 pt-4">
                    {['5+ languages supported', 'Syntax highlighting', 'Copy-paste ready'].map((feature, i) => (
                      <li key={i} className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Modal - Redesigned */}
      {isModalOpen && modalTopic && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl ${theme === 'dark' ? 'bg-black/80' : 'bg-gray-900/60'}`} onClick={closeModal} aria-modal="true" role="dialog">
          <div
            className={`relative w-full max-w-6xl h-[90vh] flex flex-col rounded-3xl border overflow-hidden shadow-2xl ${theme === 'dark' ? 'glassmorphism border-cyan-500/20' : 'bg-white border-gray-200 shadow-blue-500/10'}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header section */}
            <div className={`relative p-6 lg:p-8 bg-gradient-to-r ${gradientClassMap[modalTopic.id]}`}>
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-4 rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl`}>
                    {modalTopic.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl lg:text-4xl font-black text-white mb-2">
                      {modalTopic.title}
                    </h2>
                    <p className="text-base lg:text-lg text-white/80 max-w-2xl">
                      {modalTopic.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold">
                        {modalTopic.algorithms.length} Algorithms
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white hover:text-red-300 transition-all duration-300 backdrop-blur-sm cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Algorithm Grid - Scrollable */}
            <div className={`flex-1 overflow-y-auto p-6 lg:p-8 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
              <div className="grid md:grid-cols-2 gap-4">
                {modalTopic.algorithms.map((algorithm, index) => (
                  <div
                    key={index}
                    onClick={() => selectAlgorithm(algorithm)}
                    className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${selectedAlgorithm?.id === algorithm.id
                      ? theme === 'dark'
                        ? `bg-gradient-to-br ${gradientClassMap[modalTopic.id]}/20 border-cyan-400/50 shadow-xl scale-[1.02]`
                        : `bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-400 shadow-xl shadow-blue-200/50 scale-[1.02]`
                      : theme === 'dark'
                        ? "glassmorphism border-white/10 hover:border-cyan-400/30 hover:scale-[1.02]"
                        : "bg-white border-gray-200 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-100/50 hover:scale-[1.02]"
                      }`}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${algorithm.name}`}
                    onKeyDown={e => { if (e.key === "Enter") selectAlgorithm(algorithm); }}
                  >
                    {/* Selection Indicator */}
                    {selectedAlgorithm?.id === algorithm.id && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <h3 className={`text-xl font-bold transition-colors duration-300 pr-8 ${selectedAlgorithm?.id === algorithm.id
                        ? theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
                        : theme === 'dark' ? "text-white" : "text-gray-900"
                        }`}>
                        {algorithm.name}
                      </h3>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1.5 rounded-full border font-semibold ${getDifficultyColor(algorithm.difficulty)}`}>
                          {algorithm.difficulty}
                        </span>
                        <div className={`flex items-center gap-1.5 text-sm font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                          <Clock className="w-4 h-4" />
                          <span>{algorithm.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer CTA */}
            <div className={`p-6 border-t backdrop-blur-sm ${theme === 'dark' ? 'bg-slate-900/80 border-white/10' : 'bg-white border-gray-200 shadow-inner'}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  {selectedAlgorithm ? (
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Selected: <span className={`font-semibold ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>{selectedAlgorithm.name}</span>
                    </span>
                  ) : (
                    "Select an algorithm to begin visualization"
                  )}
                </div>
                <button
                  onClick={startLearning}
                  disabled={!selectedAlgorithm}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${selectedAlgorithm ? 'cursor-pointer' : 'cursor-not-allowed'} ${selectedAlgorithm
                    ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
                    : theme === 'dark' ? "bg-slate-800 text-slate-600 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  aria-label="Start Visualizing"
                >
                  <div className="flex items-center gap-3">
                    <Rocket className="w-5 h-5" />
                    <span>Start Visualizing</span>
                    {selectedAlgorithm && <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Coming Soon Modal */}
            {showComingSoon && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur" onClick={() => setShowComingSoon(false)} aria-modal="true" role="dialog">
                <div
                  className={`rounded-xl p-6 max-w-xs w-full shadow-xl border relative transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900 border-cyan-500/30' : 'bg-white border-gray-200'}`}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className={`absolute top-2 right-2 hover:text-red-400 transition-colors cursor-pointer ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}
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

      {/* Footer - Redesigned */}
      <footer className={`relative border-t mt-32 py-20 overflow-hidden ${theme === 'dark' ? 'border-white/10 bg-slate-950/50' : 'border-gray-200 bg-white/50'}`}>
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            {/* Brand Section */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  AlgoViz
                </span>
              </div>
              <p className={`text-base leading-relaxed max-w-md ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                Master algorithms through stunning visualizations and interactive learning.
                Transform your understanding of computer science fundamentals.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                <a href="#" className={`p-3 rounded-xl border transition-all duration-300 hover:scale-110 hover:border-cyan-400/50 cursor-pointer ${theme === 'dark' ? 'border-white/10 hover:bg-cyan-500/10' : 'border-gray-200 hover:bg-blue-50'}`} aria-label="GitHub">
                  <Github className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-300 hover:text-cyan-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`} />
                </a>
                <a href="#" className={`p-3 rounded-xl border transition-all duration-300 hover:scale-110 hover:border-cyan-400/50 cursor-pointer ${theme === 'dark' ? 'border-white/10 hover:bg-cyan-500/10' : 'border-gray-200 hover:bg-blue-50'}`} aria-label="Twitter">
                  <Twitter className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-300 hover:text-cyan-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`} />
                </a>
                <a href="#" className={`p-3 rounded-xl border transition-all duration-300 hover:scale-110 hover:border-cyan-400/50 cursor-pointer ${theme === 'dark' ? 'border-white/10 hover:bg-cyan-500/10' : 'border-gray-200 hover:bg-blue-50'}`} aria-label="Mail">
                  <Mail className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-300 hover:text-cyan-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`} />
                </a>
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Resources */}
              <div>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>Resources</h4>
                <ul className="space-y-3">
                  {[
                    { label: 'Documentation', href: '#' },
                    { label: 'Tutorials', href: '#' },
                    { label: 'Blog', href: '/blogs' },
                    { label: 'Support', href: '/support' },
                  ].map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className={`text-sm transition-colors duration-200 cursor-pointer ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>Company</h4>
                <ul className="space-y-3">
                  {[
                    { label: 'About', href: '/about' },
                    { label: 'Careers', href: '#' },
                    { label: 'Contact', href: '/contact' },
                    { label: 'Partners', href: '#' },
                  ].map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className={`text-sm transition-colors duration-200 cursor-pointer ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>Legal</h4>
                <ul className="space-y-3">
                  {[
                    { label: 'Privacy', href: '#' },
                    { label: 'Terms', href: '#' },
                    { label: 'Cookies', href: '#' },
                    { label: 'Licensing', href: '#' },
                  ].map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className={`text-sm transition-colors duration-200 cursor-pointer ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-8 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                © 2025 AlgoViz. All rights reserved.
              </p>
              <p className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                <span>Made with</span>
                <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>for developers worldwide</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top - Hover-Only Button with Full Left Side Trigger */}
      {showScrollToTop && (
        <>
          {/* Invisible hover trigger area spanning full left side */}
          <div
            className="fixed left-0 top-0 h-screen w-20 z-40"
            onMouseEnter={() => setScrollHover(true)}
            onMouseLeave={() => setScrollHover(false)}
            style={{ pointerEvents: 'auto' }}
          />

          {/* Button positioned at left-center */}
          <div className="fixed left-4 top-1/2 -translate-y-1/2 z-41">
            <button
              onClick={() => {
                scrollToTop();
                setScrollHover(false);
              }}
              onMouseEnter={() => setScrollHover(true)}
              onMouseLeave={() => setScrollHover(false)}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl
                transition-all duration-300 cursor-pointer
                ${scrollHover
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-75'
                }
                ${theme === 'dark'
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40'
                }
                hover:scale-110 active:scale-95`}
              aria-label="Scroll to top"
              style={{ pointerEvents: scrollHover ? 'auto' : 'none' }}
            >
              {/* Arrow Icon */}
              <ArrowUp className="w-6 h-6 animate-bounce" />

              {/* Text */}
              <span className="text-xs font-bold uppercase tracking-wider">
                Top
              </span>

              {/* Decorative glow */}
              <div className={`absolute inset-0 rounded-2xl blur-xl opacity-50 -z-10 ${theme === 'dark' ? 'bg-cyan-400' : 'bg-blue-400'
                }`} />
            </button>

            {/* Subtle indicator dot when not hovering */}
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-300 pointer-events-none ${scrollHover
                ? 'opacity-0 scale-0'
                : 'opacity-40 scale-100 animate-pulse'
                } ${theme === 'dark' ? 'bg-cyan-400' : 'bg-blue-500'}`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AlgorithmHomePage;