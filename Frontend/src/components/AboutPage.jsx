import React, { useState } from "react";
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
} from "lucide-react";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
export default function AboutPage() {
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error",
  });
  const navigate = useNavigate();
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Interactive Visualizations",
      description:
        "Watch algorithms come to life with step-by-step visual representations of DFS, BFS, sorting algorithms, and more.",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Comprehensive Tutorials",
      description:
        "Learn from beginner to advanced with detailed tutorials covering all major data structures and algorithms.",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Quick Reference Cheatsheets",
      description:
        "Access concise cheatsheets for time complexity, space complexity, and algorithm implementations.",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Curated Practice Problems",
      description:
        "Solve handpicked important questions from top coding platforms with detailed explanations.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Interactive Learning",
      description:
        "Engage with interactive code editors and real-time algorithm execution to enhance understanding.",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Progress Tracking",
      description:
        "Monitor your learning journey with progress indicators and achievement milestones.",
    },
  ];
  const handleBack = () => {
    setAlertConfig({
      isOpen: true,
      message: "Are you sure you want to leave? Your progress will be lost.",
      type: "warning",
      customButtons: (
        <div className="flex space-x-4 justify-center ">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Leave
          </button>
          <button
            onClick={closeAlert}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Stay
          </button>
        </div>
      ),
    });
  };
  const showAlert = (message, type = "error") => {
    setAlertConfig({
      isOpen: true,
      message,
      type,
    });
  };

  const closeAlert = () => {
    setAlertConfig({
      ...alertConfig,
      isOpen: false,
    });
  };
  const benefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Faster Learning",
      description:
        "Visual learning accelerates understanding compared to traditional text-based methods.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Better Retention",
      description:
        "Interactive visualizations help you remember algorithms and their working principles.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Clear Concepts",
      description:
        "Complex algorithms become simple with step-by-step visual breakdowns.",
    },
    {
      icon: <Users className="w-6 h-6" />,
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Master Data Structures & Algorithms
            <span className="block text-2xl md:text-3xl text-gray-400 mt-2 font-normal">
              Through Interactive Visualization
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We transform complex algorithms into intuitive visual experiences,
            making DSA learning engaging, effective, and accessible for
            everyone.
          </p>
        </div>

        {/* What We Do Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What We Do
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-8">
            <p className="text-lg text-gray-300 leading-relaxed text-center mb-6">
              Our platform revolutionizes how you learn Data Structures and
              Algorithms by combining visual learning with hands-on practice. We
              believe that seeing algorithms in action makes them easier to
              understand, remember, and implement.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="text-white mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-gray-800 border border-gray-700 rounded-lg p-6"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex items-start space-x-4"
              >
                <div className="text-white flex-shrink-0 mt-1">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Path Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Your Learning Journey
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Learn Concepts
                </h3>
                <p className="text-gray-400">
                  Start with interactive tutorials and visual explanations of
                  core concepts.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Visualize Algorithms
                </h3>
                <p className="text-gray-400">
                  Watch algorithms execute step-by-step with our interactive
                  visualizations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Practice & Master
                </h3>
                <p className="text-gray-400">
                  Solve curated problems and use cheatsheets to reinforce your
                  learning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Content */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What You'll Find Here
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Code className="w-6 h-6 mr-3" />
                Algorithm Visualizations
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  DFS & BFS Traversals
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Sorting Algorithms
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Dynamic Programming
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Graph Algorithms
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-3" />
                Learning Resources
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Step-by-step Tutorials
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Interactive Blogs
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Quick Reference Guides
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Practice Problems
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Master DSA?
          </h2>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of students and professionals who have improved their
            coding skills through our interactive learning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Start Learning
            </button>
            <button className="bg-gray-700 border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200">
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
