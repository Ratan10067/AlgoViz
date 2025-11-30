import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Code,
  BookOpen,
  Zap,
  Users,
  Target,
  CheckCircle,
  Brain,
  Lightbulb,
  Trophy,
  FileText,
  MessageSquare,
  Bot,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Instagram,
  Globe,
} from "lucide-react";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";

// import anupPhoto from "../assets/subject.png";

export default function AboutPage() {
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error",
  });
  const navigate = useNavigate();

  // --- FIX: Scroll to top on page load ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackClick = () => {
    try {
      navigate("/");
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to window.location if navigate fails
      window.location.href = "/";
    }
  };

  const teamMembers = [
    {
      name: "Ratan",
      role: "Frontend & Backend",
      bio: "The creative force behind the project, combining a passion for algorithm visualization with a keen eye for design and simulation to make complex topics intuitive and beautiful.",
      photoUrl: null,
      socialLinks: [
        {
          platform: "github",
          url: "https://github.com/Ratan10067",
          icon: <Github className="w-5 h-5" />,
        },
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/ratan-kumar-24961b285/",
          icon: <Linkedin className="w-5 h-5" />,
        },
        {
          platform: "twitter",
          url: "https://twitter.com/ratan",
          icon: <Twitter className="w-5 h-5" />,
        },
        {
          platform: "email",
          url: "mailto:ratan@example.com",
          icon: <Mail className="w-5 h-5" />,
        },
      ],
    },
    {
      name: "Anup",
      role: "Frontend",
      bio: "Anup architects the platform's robust and secure foundation. His expertise in modern web security and browser technologies ensures a reliable and safe learning environment.",
      photoUrl: null, // Using the imported image variable
    },
    {
      name: "3rd Person",
      role: "Waiting",
      bio: "The silent partners dedicated to crafting clear tutorials and providing instant insights, translating complex concepts into practical lessons for all learners.",
      photoUrl: null, 
    },
  ];

  const features = [
    {
      icon: <Code className="w-8 h-8 text-cyan-400" />,
      title: "Interactive Visualizations",
      description:
        "Watch algorithms come to life with step-by-step visual representations of DFS, BFS, sorting algorithms, and more.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-cyan-400" />,
      title: "Comprehensive Tutorials",
      description:
        "Learn from beginner to advanced with detailed tutorials covering all major data structures and algorithms.",
    },
    {
      icon: <FileText className="w-8 h-8 text-cyan-400" />,
      title: "Quick Reference Cheatsheets",
      description:
        "Access concise cheatsheets for time complexity, space complexity, and algorithm implementations.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-cyan-400" />,
      title: "Curated Practice Problems",
      description:
        "Solve handpicked important questions from top coding platforms with detailed explanations.",
    },
    {
      icon: <Brain className="w-8 h-8 text-cyan-400" />,
      title: "Interactive Learning",
      description:
        "Engage with interactive code editors and real-time algorithm execution to enhance understanding.",
    },
    {
      icon: <Trophy className="w-8 h-8 text-cyan-400" />,
      title: "Progress Tracking",
      description:
        "Monitor your learning journey with progress indicators and achievement milestones.",
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-cyan-300" />,
      title: "Faster Learning",
      description:
        "Visual learning accelerates understanding compared to traditional text-based methods.",
    },
    {
      icon: <Target className="w-6 h-6 text-cyan-300" />,
      title: "Better Retention",
      description:
        "Interactive visualizations help you remember algorithms and their working principles.",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-cyan-300" />,
      title: "Clear Concepts",
      description:
        "Complex algorithms become simple with step-by-step visual breakdowns.",
    },
    {
      icon: <Users className="w-6 h-6 text-cyan-300" />,
      title: "Interview Ready",
      description:
        "Practice with real interview questions and build confidence for coding interviews.",
    },
  ];

  const stats = [
    { number: "50+", label: "Algorithm Visualizations" },
    { number: "200+", label: "Practice Problems" },
    { number: "100+", label: "Tutorial Articles" },
    { number: "25+", label: "Cheat Sheets" },
  ];

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, isOpen: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white animate-fadeIn">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        .glassmorphism-card {
          background: rgba(17, 24, 39, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(55, 65, 81, 0.5);
        }
        .step-circle {
            background: rgba(30, 41, 59, 0.5);
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button - Added z-index to ensure it's above decorative elements */}
        <div className="relative z-10">
          {/* <ResponsiveButton
            onClick={handleBackClick}
            className="mb-8 hover:cursor-pointer"
            variant="ghost"
            size="md"
            icon={<ArrowLeft className="w-5 h-5" />}
            iconPosition="left"
          >
            Back to Home
          </ResponsiveButton> */}
        </div>

        {/* Hero Section */}
        <div className="text-center mt-20 mb-20 relative">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-3xl opacity-50 animate-pulse decorative-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-violet-500/10 rounded-full filter blur-3xl opacity-50 animate-pulse delay-2000 decorative-blob"></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 relative z-1">
            Master Data Structures & Algorithms
            <span className="block text-3xl md:text-4xl bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mt-2 font-normal">
              Through Interactive Visualization
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed relative z-1 mt-10">
            We transform complex algorithms into intuitive visual experiences,
            making DSA learning engaging, effective, and accessible for
            everyone.
          </p>
        </div>

        {/* Meet the Team Section */}
        <div className="mb-20 relative z-1">
          <h2 className="text-4xl font-bold text-white mb-10 text-center">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="team-card glassmorphism-card rounded-2xl p-6 text-center flex flex-col items-center"
              >
                <div className="team-content">
                  <div className="team-image-container">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="team-image"
                      />
                    ) : (
                      <div className="team-image flex items-center justify-center bg-slate-800 border-2 border-slate-700">
                        {member.name === "AIs" ? (
                          <Bot className="w-16 h-16 text-slate-500" />
                        ) : (
                          <Users className="w-16 h-16 text-slate-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-cyan-400 mb-4">{member.role}</p>
                  <p className="text-slate-400 text-sm text-center leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="social-links">
                  <div className="flex justify-center space-x-4">
                    {member.socialLinks?.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link p-3 rounded-xl bg-slate-800/60 text-slate-300 hover:text-cyan-400"
                        title={link.platform}
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm mt-3 font-medium text-center">
                    Connect with {member.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What We Do Section */}
        <div className="mb-20 relative z-1">
          <h2 className="text-4xl font-bold text-white mb-10 text-center">
            What We Do
          </h2>
          <div className="glassmorphism-card rounded-2xl p-8 mb-8">
            <p className="text-lg text-slate-300 leading-relaxed text-center mb-10">
              Our platform revolutionizes how you learn Data Structures and
              Algorithms by combining visual learning with hands-on practice. We
              believe that seeing algorithms in action makes them easier to
              understand, remember, and implement.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-400/60 hover:-translate-y-1"
                >
                  <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20 relative z-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center glassmorphism-card rounded-2xl p-6"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20 relative z-1">
          <h2 className="text-4xl font-bold text-white mb-10 text-center">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="glassmorphism-card rounded-2xl p-6 flex items-start space-x-4"
              >
                <div className="flex-shrink-0 mt-1 p-2 bg-cyan-500/10 rounded-full">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Path Section */}
        <div className="mb-20 relative z-1">
          <h2 className="text-4xl font-bold text-white mb-10 text-center">
            Your Learning Journey
          </h2>
          <div className="glassmorphism-card rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 step-circle rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <span className="text-2xl font-bold text-cyan-400">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Learn Concepts
                </h3>
                <p className="text-slate-400">
                  Start with interactive tutorials and visual explanations of
                  core concepts.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 step-circle rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <span className="text-2xl font-bold text-cyan-400">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Visualize Algorithms
                </h3>
                <p className="text-slate-400">
                  Watch algorithms execute step-by-step with our interactive
                  visualizations.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 step-circle rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <span className="text-2xl font-bold text-cyan-400">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Practice & Master
                </h3>
                <p className="text-slate-400">
                  Solve curated problems and use cheatsheets to reinforce your
                  learning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Content */}
        <div className="mb-20 relative z-1">
          <h2 className="text-4xl font-bold text-white mb-10 text-center">
            What You'll Find Here
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glassmorphism-card rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Code className="w-6 h-6 mr-3 text-cyan-400" />
                Algorithm Visualizations
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-emerald-400" />
                  DFS & BFS Traversals
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-emerald-400" />
                  Sorting Algorithms
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-emerald-400" />
                  Dynamic Programming
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-emerald-400" />
                  Graph Algorithms
                </li>
              </ul>
            </div>
            <div className="glassmorphism-card rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-cyan-400" />
                Learning Resources
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-emerald-400" />
                  Step-by-step Tutorials
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-emerald-400" />
                  Interactive Blogs
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-emerald-400" />
                  Quick Reference Guides
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-emerald-400" />
                  Practice Problems
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center glassmorphism-card rounded-2xl p-10 relative z-1">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Master DSA?
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who have improved their
            coding skills through our interactive learning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-cyan-500/20 transform hover:scale-105"
            >
              Start Learning
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 rounded-xl font-semibold bg-slate-700/50 border border-slate-600 text-white hover:bg-slate-700 transition-colors duration-300"
            >
              View Tutorials
            </button>
          </div>
        </div>
      </div>
      <Alert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={closeAlert}
        customButtons={alertConfig.customButtons}
      />
    </div>
  );
}
