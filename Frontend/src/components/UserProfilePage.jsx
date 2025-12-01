import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
  Github,
  Linkedin,
  Twitter,
  Globe,
  ArrowLeft, // Import ArrowLeft
  AlertTriangle, // Import Alert Icon
} from "lucide-react";

// --- Custom Alert Component (Matches your theme) ---
const CustomAlert = ({ config, onClose }) => {
  if (!config.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-slate-800 border border-white/10 rounded-3xl shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

        <div className="relative flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            Confirmation Required
          </h3>
          <p className="text-slate-400 mb-6">{config.message}</p>

          {config.customButtons}
        </div>
      </div>
    </div>
  );
};

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  // Alert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "info",
    customButtons: null,
  });

  // --- Your Handle Back Logic ---
  const handleBack = () => {
    setAlertConfig({
      isOpen: true,
      message:
        "Are you sure you want to go back? Any unsaved progress will be lost.",
      type: "warning",
      customButtons: (
        <div className="flex gap-3 justify-center w-full">
          <button
            onClick={() =>
              setAlertConfig((prev) => ({ ...prev, isOpen: false }))
            }
            className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:bg-slate-600 shadow-lg font-semibold border border-white/5"
          >
            Stay
          </button>
          <button
            onClick={() => {
              setAlertConfig((prev) => ({ ...prev, isOpen: false }));
              // Simulating navigation - replace '/' with your target route
              setTimeout(() => navigate("/"), 100);
            }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/20 font-semibold"
          >
            Go Back
          </button>
        </div>
      ),
    });
  };

  // Sample user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    joinDate: "January 2024",
    level: "Algorithm Master",
    avatar: null,
    bio: "Passionate about data structures and algorithms. Love visualizing complex concepts!",
    location: "San Francisco, CA",
    website: "alexcodes.dev",
    social: {
      github: "alexjohnson",
      linkedin: "alexjohnson",
      twitter: "@alexcodes",
    },
  };

  // Sample activities data
  const pastActivities = [
    {
      id: 1,
      type: "sorting",
      algorithm: "Quick Sort",
      category: "Arrays & Sorting",
      date: "2024-11-28",
      time: "14:30",
      duration: "5 mins",
      complexity: "O(n log n)",
      status: "completed",
      accuracy: 95,
      badge: "Speed Demon",
    },
    {
      id: 2,
      type: "searching",
      algorithm: "Binary Search Tree",
      category: "Trees & Graphs",
      date: "2024-11-27",
      time: "10:15",
      duration: "8 mins",
      complexity: "O(log n)",
      status: "completed",
      accuracy: 88,
      badge: null,
    },
    {
      id: 3,
      type: "graph",
      algorithm: "Dijkstra's Algorithm",
      category: "Trees & Graphs",
      date: "2024-11-26",
      time: "16:45",
      duration: "12 mins",
      complexity: "O(V²)",
      status: "completed",
      accuracy: 92,
      badge: "Path Finder",
    },
    {
      id: 4,
      type: "dynamic-programming",
      algorithm: "Knapsack Problem",
      category: "Dynamic Programming",
      date: "2024-11-25",
      time: "11:20",
      duration: "10 mins",
      complexity: "O(nW)",
      status: "completed",
      accuracy: 100,
      badge: "Perfect Score",
    },
    {
      id: 5,
      type: "sorting",
      algorithm: "Merge Sort",
      category: "Arrays & Sorting",
      date: "2024-11-24",
      time: "13:10",
      duration: "7 mins",
      complexity: "O(n log n)",
      status: "completed",
      accuracy: 87,
      badge: null,
    },
  ];

  const achievements = [
    {
      icon: "🏆",
      title: "First Algorithm",
      desc: "Completed your first visualization",
      unlocked: true,
    },
    {
      icon: "🔥",
      title: "Week Streak",
      desc: "Learned for 7 days straight",
      unlocked: true,
    },
    {
      icon: "⚡",
      title: "Speed Demon",
      desc: "Completed 10 algorithms in one day",
      unlocked: true,
    },
    {
      icon: "🎯",
      title: "Perfect Score",
      desc: "100% accuracy on an algorithm",
      unlocked: true,
    },
    {
      icon: "🌟",
      title: "Algorithm Master",
      desc: "Mastered 20 algorithms",
      unlocked: false,
    },
    {
      icon: "💎",
      title: "Diamond Learner",
      desc: "50 algorithms completed",
      unlocked: false,
    },
  ];

  const stats = {
    totalActivities: pastActivities.length,
    currentStreak: 5,
    avgAccuracy: Math.round(
      pastActivities.reduce((acc, act) => acc + act.accuracy, 0) /
        pastActivities.length
    ),
    badgesEarned: pastActivities.filter((a) => a.badge).length,
    totalTime: "2h 45m",
    favoriteCategory: "Trees & Graphs",
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
    const icons = {
      sorting: Code,
      searching: BookOpen,
      graph: Activity,
      "dynamic-programming": Trophy,
    };
    const Icon = icons[type] || Play;
    return <Icon className="w-6 h-6" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Arrays & Sorting": "from-cyan-500 to-blue-500",
      "Trees & Graphs": "from-emerald-500 to-teal-500",
      "Dynamic Programming": "from-purple-500 to-pink-500",
      Searching: "from-amber-500 to-orange-500",
    };
    return colors[category] || "from-cyan-500 to-blue-500";
  };

  // Overview Tab
  const renderOverviewContent = () => (
    <div className="space-y-6">
      {/* Enhanced Profile Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>

        <div className="relative p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Enhanced Profile Picture */}
            <div className="relative group">
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 p-1 shadow-2xl transform transition-transform group-hover:scale-105">
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-20 h-20 text-cyan-400" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-xl hover:shadow-cyan-500/50 transition-all hover:scale-110">
                <Edit2 className="w-4 h-4 text-white" />
              </button>
              <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg">
                <span className="text-xs font-bold text-white">Lvl 12</span>
              </div>
            </div>

            {/* Enhanced Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {userData.name}
                </h1>
                <CheckCircle className="w-6 h-6 text-cyan-400" />
              </div>

              <p className="text-lg text-slate-400 mb-2 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {userData.email}
              </p>

              <p className="text-slate-300 mb-4 max-w-2xl">{userData.bio}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-slate-300">
                    Joined {userData.joinDate}
                  </span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
                  <span className="text-sm font-bold text-white">
                    {userData.level}
                  </span>
                </div>
                {userData.location && (
                  <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-slate-300">
                      {userData.location}
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-2">
                {userData.social.github && (
                  <a
                    href={`https://github.com/${userData.social.github}`}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-110"
                  >
                    <Github className="w-5 h-5 text-slate-300" />
                  </a>
                )}
                {userData.social.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${userData.social.linkedin}`}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-110"
                  >
                    <Linkedin className="w-5 h-5 text-slate-300" />
                  </a>
                )}
                {userData.social.twitter && (
                  <a
                    href={`https://twitter.com/${userData.social.twitter}`}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-110"
                  >
                    <Twitter className="w-5 h-5 text-slate-300" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            icon: Trophy,
            label: "Total Activities",
            value: stats.totalActivities,
            color: "from-cyan-500 to-blue-500",
            bg: "from-cyan-500/20 to-blue-500/20",
          },
          {
            icon: Zap,
            label: "Current Streak",
            value: `${stats.currentStreak} days`,
            color: "from-emerald-500 to-teal-500",
            bg: "from-emerald-500/20 to-teal-500/20",
          },
          {
            icon: Target,
            label: "Avg Accuracy",
            value: `${stats.avgAccuracy}%`,
            color: "from-purple-500 to-pink-500",
            bg: "from-purple-500/20 to-pink-500/20",
          },
          {
            icon: Award,
            label: "Badges Earned",
            value: stats.badgesEarned,
            color: "from-amber-500 to-orange-500",
            bg: "from-amber-500/20 to-orange-500/20",
          },
          {
            icon: Clock,
            label: "Total Time",
            value: stats.totalTime,
            color: "from-rose-500 to-red-500",
            bg: "from-rose-500/20 to-red-500/20",
          },
          {
            icon: Star,
            label: "Favorite Topic",
            value: stats.favoriteCategory,
            color: "from-indigo-500 to-violet-500",
            bg: "from-indigo-500/20 to-violet-500/20",
            valueClass: "text-lg",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${stat.bg} border border-white/10 backdrop-blur-sm group hover:scale-105 transition-all`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-white/50" />
              </div>
              <h3 className="text-sm font-semibold text-slate-400 mb-1">
                {stat.label}
              </h3>
              <p
                className={`${
                  stat.valueClass || "text-3xl"
                } font-black text-white`}
              >
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements Section */}
      <div className="rounded-3xl overflow-hidden bg-slate-800/50 border border-white/10 backdrop-blur-sm">
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            Achievements
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:scale-105 hover:shadow-xl"
                    : "bg-white/5 border-white/5 opacity-50"
                }`}
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="font-bold text-white mb-1">
                  {achievement.title}
                </h3>
                <p className="text-sm text-slate-400">{achievement.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-3xl overflow-hidden bg-slate-800/50 border border-white/10 backdrop-blur-sm">
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
          <h2 className="text-2xl font-bold text-white">Recent Activities</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {pastActivities.slice(0, 4).map((activity) => (
              <div
                key={activity.id}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 bg-gradient-to-br ${getCategoryColor(
                        activity.category
                      )} rounded-xl shadow-lg`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {activity.algorithm}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {activity.category} • {activity.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {activity.badge && (
                      <div className="px-3 py-1 bg-amber-500/20 rounded-lg border border-amber-500/30">
                        <span className="text-xs font-bold text-amber-400">
                          {activity.badge}
                        </span>
                      </div>
                    )}
                    <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                      {activity.accuracy}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveTab("activity")}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all"
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
          <h2 className="text-4xl font-bold text-white mb-2">
            Your Learning Journey
          </h2>
          <p className="text-slate-400">
            Track your progress through algorithm visualization
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden bg-slate-800 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-white/10">
            <button
              onClick={prevActivity}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="text-sm font-semibold text-slate-400">
                Activity {currentActivityIndex + 1} of {pastActivities.length}
              </span>
            </div>
            <button
              onClick={nextActivity}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div
                  className={`p-5 bg-gradient-to-br ${getCategoryColor(
                    currentActivity.category
                  )} rounded-3xl shadow-xl`}
                >
                  {getActivityIcon(currentActivity.type)}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {currentActivity.algorithm}
                  </h3>
                  <p className="text-slate-400">{currentActivity.category}</p>
                </div>
              </div>
              <div className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                <span className="text-sm font-bold text-white uppercase">
                  {currentActivity.status}
                </span>
              </div>
            </div>

            {currentActivity.badge && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400" />
                  <div>
                    <p className="text-sm text-slate-400">Badge Earned</p>
                    <p className="font-bold text-amber-400">
                      {currentActivity.badge}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: Calendar,
                  label: "Date",
                  value: currentActivity.date,
                  color: "cyan",
                },
                {
                  icon: Clock,
                  label: "Duration",
                  value: currentActivity.duration,
                  color: "emerald",
                },
                {
                  icon: Code,
                  label: "Complexity",
                  value: currentActivity.complexity,
                  color: "purple",
                },
                {
                  icon: Trophy,
                  label: "Accuracy",
                  value: `${currentActivity.accuracy}%`,
                  color: "amber",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10"
                >
                  <item.icon
                    className={`w-5 h-5 mb-2 text-${item.color}-400`}
                  />
                  <p className="text-sm text-slate-400 mb-1">{item.label}</p>
                  <p className="font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-400">
                  Accuracy Score
                </span>
                <span className="text-sm font-bold text-cyan-400">
                  {currentActivity.accuracy}%
                </span>
              </div>
              <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 shadow-lg"
                  style={{ width: `${currentActivity.accuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {pastActivities.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentActivityIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentActivityIndex
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 w-12"
                  : "bg-white/20 hover:bg-white/30 w-2"
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
      <h2 className="text-4xl font-bold text-white mb-8">Account Settings</h2>

      {/* Profile Settings */}
      <div className="rounded-3xl p-8 bg-slate-800 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl">
            <User className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Profile Information</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={userData.name}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue={userData.email}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Bio
            </label>
            <textarea
              rows="3"
              defaultValue={userData.bio}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none"
            />
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-cyan-500/50 transition-all">
            Save Changes
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="rounded-3xl p-8 bg-slate-800 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Security</h3>
        </div>
        <div className="space-y-4">
          <button className="w-full text-left p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
            <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
              Change Password
            </div>
            <div className="text-sm text-slate-400">
              Update your account password
            </div>
          </button>
          <button className="w-full text-left p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
            <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
              Two-Factor Authentication
            </div>
            <div className="text-sm text-slate-400">
              Add an extra layer of security
            </div>
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="rounded-3xl p-8 bg-slate-800 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Preferences</h3>
        </div>
        <div className="space-y-6">
          {[
            {
              icon: Bell,
              label: "Email Notifications",
              desc: "Receive updates about your progress",
              checked: true,
            },
            {
              icon: Moon,
              label: "Dark Mode",
              desc: "Always enabled for optimal viewing",
              checked: true,
            },
          ].map((pref, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/10">
                  <pref.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">{pref.label}</div>
                  <div className="text-sm text-slate-400">{pref.desc}</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={pref.checked}
                />
                <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-3xl p-8 bg-red-500/10 border border-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-500/20 rounded-2xl">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-red-400">Danger Zone</h3>
        </div>
        <p className="text-red-200/70 mb-6">
          Once you delete your account, there is no going back. Please be
          certain. All your progress, badges, and activity history will be
          permanently removed.
        </p>
        <button className="flex items-center gap-2 px-6 py-3 border border-red-500/50 text-red-400 font-bold rounded-xl hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/20 transition-all group">
          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Delete Account
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Alert Component */}
      <CustomAlert
        config={alertConfig}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="fixed left-0 top-0 h-screen w-20 lg:w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col justify-between z-50 transition-all">
          <div>
            {/* --- ADDED: Back Button at the very top of Sidebar --- */}
            <button
              onClick={handleBack}
              className="w-full flex items-center gap-3 p-3 mb-6 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold hidden lg:block">
                Back to Home
              </span>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3 p-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black text-white hidden lg:block tracking-tight">
                Algo<span className="text-cyan-400">Viz</span>
              </span>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              {[
                { id: "overview", icon: User, label: "Overview" },
                { id: "activity", icon: Activity, label: "Activity" },
                { id: "settings", icon: Settings, label: "Settings" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all group relative overflow-hidden ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-white shadow-lg border border-cyan-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {activeTab === item.id && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-500 rounded-r-full"></div>
                  )}
                  <item.icon
                    className={`w-5 h-5 transition-colors ${
                      activeTab === item.id
                        ? "text-cyan-400"
                        : "group-hover:text-cyan-400"
                    }`}
                  />
                  <span
                    className={`font-semibold hidden lg:block ${
                      activeTab === item.id ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all group">
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="font-semibold hidden lg:block">Log Out</span>
            </button>

            <div className="hidden lg:flex p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {userData.name}
                </p>
                <p className="text-xs text-slate-400 truncate">Pro Member</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 ml-20 lg:ml-72 p-4 md:p-8 lg:p-12 w-full max-w-[1600px] mx-auto min-h-screen">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "overview" && renderOverviewContent()}
            {activeTab === "activity" && renderActivityContent()}
            {activeTab === "settings" && renderSettingsContent()}
          </div>

          {/* Footer */}
          <footer className="mt-20 pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
            <p>© 2024 AlgoViz Platform. Keep visualizing.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
