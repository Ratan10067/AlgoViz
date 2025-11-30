import React, { useState } from "react";
import {
  User,
  Activity,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Trophy,
  Code,
  Play,
  BookOpen,
  ArrowLeft,
  TrendingUp,
  Award,
  Target,
  Zap,
  Star,
  Edit2,
  Mail,
  Shield,
  Bell,
  Moon,
  Trash2,
  CheckCircle,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  // Sample activities data
  const pastActivities = [
    {
      id: 1,
      type: "sorting",
      algorithm: "Bubble Sort",
      date: "2024-06-28",
      time: "14:30",
      duration: "5 mins",
      complexity: "O(n²)",
      status: "completed",
      accuracy: 95,
    },
    {
      id: 2,
      type: "searching",
      algorithm: "Binary Search",
      date: "2024-06-27",
      time: "10:15",
      duration: "3 mins",
      complexity: "O(log n)",
      status: "completed",
      accuracy: 88,
    },
    {
      id: 3,
      type: "graph",
      algorithm: "DFS Traversal",
      date: "2024-06-26",
      time: "16:45",
      duration: "8 mins",
      complexity: "O(V + E)",
      status: "completed",
      accuracy: 92,
    },
    {
      id: 4,
      type: "dynamic-programming",
      algorithm: "Fibonacci Sequence",
      date: "2024-06-25",
      time: "11:20",
      duration: "6 mins",
      complexity: "O(n)",
      status: "completed",
      accuracy: 100,
    },
    {
      id: 5,
      type: "sorting",
      algorithm: "Merge Sort",
      date: "2024-06-24",
      time: "13:10",
      duration: "7 mins",
      complexity: "O(n log n)",
      status: "completed",
      accuracy: 87,
    },
  ];

  // Get user's join date in a readable format
  const formatJoinDate = () => {
    if (!user || !user.createdAt) {
      return "Recent member";
    }

    try {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch (error) {
      return user.memberSince || "Recent member";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const nextActivity = () => {
    setCurrentActivityIndex((prev) =>
      prev === pastActivities.length - 1 ? 0 : prev + 1
    );
  };

  const prevActivity = () => {
    setCurrentActivityIndex((prev) =>
      prev === 0 ? pastActivities.length - 1 : prev - 1
    );
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "sorting":
        return <Code className="w-6 h-6" />;
      case "searching":
        return <BookOpen className="w-6 h-6" />;
      case "graph":
        return <Activity className="w-6 h-6" />;
      case "dynamic-programming":
        return <Trophy className="w-6 h-6" />;
      default:
        return <Play className="w-6 h-6" />;
    }
  };

  // Overview Tab
  const renderOverviewContent = () => (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className={`relative overflow-hidden rounded-3xl ${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-gray-50'} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} shadow-xl`}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>

        <div className="relative p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 p-1 shadow-lg">
                <div className={`w-full h-full rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} flex items-center justify-center`}>
                  <User className="w-16 h-16 text-cyan-400" />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-cyan-500 rounded-xl shadow-lg hover:bg-cyan-600 transition-all hover:scale-110">
                <Edit2 className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className={`text-4xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user?.name || "User"}
              </h1>
              <p className={`text-lg mb-4 flex items-center justify-center md:justify-start gap-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                <Mail className="w-4 h-4" />
                {user?.email || "No email provided"}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className={`px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'} flex items-center gap-2`}>
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                    Joined {formatJoinDate()}
                  </span>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <span className="text-sm font-bold text-white">Level 1 Learner</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
              >
                <Edit2 className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`relative overflow-hidden rounded-3xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200'}`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-2xl">
                <Trophy className="w-6 h-6 text-cyan-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-cyan-400 opacity-50" />
            </div>
            <h3 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-cyan-200' : 'text-cyan-700'}`}>
              Total Activities
            </h3>
            <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {pastActivities.length}
            </p>
          </div>
        </div>

        <div className={`relative overflow-hidden rounded-3xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'}`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-2xl">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-400 opacity-50" />
            </div>
            <h3 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-emerald-200' : 'text-emerald-700'}`}>
              Current Streak
            </h3>
            <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              3 days
            </p>
          </div>
        </div>

        <div className={`relative overflow-hidden rounded-3xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'}`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-2xl">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <Star className="w-5 h-5 text-purple-400 opacity-50" />
            </div>
            <h3 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-purple-200' : 'text-purple-700'}`}>
              Avg Accuracy
            </h3>
            <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              92%
            </p>
          </div>
        </div>

        <div className={`relative overflow-hidden rounded-3xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'}`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <Trophy className="w-5 h-5 text-amber-400 opacity-50" />
            </div>
            <h3 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-amber-200' : 'text-amber-700'}`}>
              Badges Earned
            </h3>
            <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              0
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`rounded-3xl overflow-hidden ${theme === 'dark' ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200'} border`}>
        <div className="p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Recent Activities
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {pastActivities.slice(0, 3).map((activity) => (
              <div
                key={activity.id}
                className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} transition-all cursor-pointer group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} group-hover:text-cyan-400 transition-colors`}>
                        {activity.algorithm}
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                        {activity.date} • {activity.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'} font-semibold`}>
                      {activity.accuracy}%
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveTab("activity")}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            View All Activities
          </button>
        </div>
      </div>
    </div>
  );

  // Activity Tab
  const renderActivityContent = () => {
    const currentActivity = pastActivities[currentActivityIndex];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Your Learning Journey
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
            Track your progress through DSA concepts
          </p>
        </div>

        <div className={`rounded-3xl overflow-hidden ${theme === 'dark' ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'} border shadow-xl`}>
          <div className={`flex items-center justify-between p-6 ${theme === 'dark' ? 'bg-gradient-to-r from-slate-800 to-slate-700 border-b border-white/10' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'}`}>
            <button
              onClick={prevActivity}
              className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-gray-50'} border ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'} transition-all hover:scale-110`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                {currentActivityIndex + 1} of {pastActivities.length}
              </span>
            </div>

            <button
              onClick={nextActivity}
              className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-gray-50'} border ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'} transition-all hover:scale-110`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-lg">
                  <div className="text-white">
                    {getActivityIcon(currentActivity.type)}
                  </div>
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {currentActivity.algorithm}
                  </h3>
                  <p className={`capitalize ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                    {currentActivity.type.replace("-", " ")}
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                <span className="text-sm font-bold text-white">
                  {currentActivity.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                <Calendar className="w-5 h-5 mb-2 text-cyan-400" />
                <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Date</p>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {currentActivity.date}
                </p>
              </div>
              <div className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                <Clock className="w-5 h-5 mb-2 text-emerald-400" />
                <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Duration</p>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {currentActivity.duration}
                </p>
              </div>
              <div className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                <Code className="w-5 h-5 mb-2 text-purple-400" />
                <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Complexity</p>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {currentActivity.complexity}
                </p>
              </div>
              <div className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                <Trophy className="w-5 h-5 mb-2 text-amber-400" />
                <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Accuracy</p>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {currentActivity.accuracy}%
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  Accuracy Score
                </span>
                <span className="text-sm font-bold text-cyan-400">
                  {currentActivity.accuracy}%
                </span>
              </div>
              <div className={`w-full h-3 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} overflow-hidden`}>
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${currentActivity.accuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {pastActivities.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentActivityIndex(index)}
              className={`h-2 rounded-full transition-all ${index === currentActivityIndex
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 scale-110"
                  : theme === 'dark' ? "bg-white/20 hover:bg-white/30" : "bg-gray-300 hover:bg-gray-400"
                }`}
            />
          ))}
        </div>
      </div>
    );
  };

  // Settings Tab
  const renderSettingsContent = () => (
    <div className="space-y-6">
      <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Account Settings
      </h2>

      {/* Security Section */}
      <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'} border`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Security
          </h3>
        </div>
        <div className="space-y-4">
          <button className={`w-full text-left p-5 rounded-2xl ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} border transition-all group`}>
            <div className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} group-hover:text-cyan-400 transition-colors`}>
              Change Password
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
              Update your account password
            </div>
          </button>
          <button className={`w-full text-left p-5 rounded-2xl ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} border transition-all group`}>
            <div className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} group-hover:text-cyan-400 transition-colors`}>
              Two-Factor Authentication
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
              Add an extra layer of security
            </div>
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'} border`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Preferences
          </h3>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
                <Bell className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Email Notifications
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  Receive updates about your progress
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500"></div>
            </label>
          </div>

          <div className={`h-px ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
                <Moon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Dark Mode
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  Switch to dark theme
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={theme === 'dark'} readOnly />
              <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-3xl p-8 bg-red-500/10 border border-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-500/20 rounded-2xl">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
        </div>
        <p className={`mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all hover:scale-105">
          Delete Account
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewContent();
      case "activity":
        return renderActivityContent();
      case "settings":
        return renderSettingsContent();
      default:
        return renderOverviewContent();
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50'}`}>
      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-30 backdrop-blur-xl ${theme === 'dark' ? 'bg-slate-900/80 border-b border-white/10' : 'bg-white/80 border-b border-gray-200'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition-all group`}
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="font-semibold">Back to Home</span>
              </button>

              <div className={`h-8 w-px ${theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'}`}></div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5">
                  <div className={`w-full h-full rounded-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} flex items-center justify-center`}>
                    <Code className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h1 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {user?.name || "User"}
                  </h1>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                    Profile Dashboard
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-2xl transition-all hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200'} border sticky top-24`}>
              <nav className="space-y-2">
                {[
                  { id: "overview", icon: User, label: "Overview" },
                  { id: "activity", icon: Activity, label: "Activity" },
                  { id: "settings", icon: Settings, label: "Settings" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === item.id
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105"
                        : theme === 'dark'
                          ? "text-slate-300 hover:bg-white/10"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
