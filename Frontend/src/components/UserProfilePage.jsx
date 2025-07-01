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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const navigate = useNavigate();
  // Sample user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    joinDate: "January 2024",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    totalActivities: 45,
    streak: 12,
    favoriteAlgorithm: "Quick Sort",
  };

  // Sample past activities data
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

  const sidebarItems = [
    { id: "profile", icon: User, label: "Your Profile" },
    { id: "activity", icon: Activity, label: "Past Activity" },
    { id: "accounts", icon: Settings, label: "Accounts" },
  ];

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

  const renderProfileContent = () => (
    <div className="space-y-8">
      <div className="text-center">
        <img
          src={userData.avatar}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-blue-500"
        />
        <h2 className="text-3xl font-bold text-white mb-2">{userData.name}</h2>
        <p className="text-gray-300 mb-4">{userData.email}</p>
        <p className="text-sm text-gray-400">
          Member since {userData.joinDate}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl border border-gray-700">
          <Trophy className="w-8 h-8 mb-3 text-blue-200" />
          <h3 className="text-lg font-semibold mb-1">Total Activities</h3>
          <p className="text-3xl font-bold">{userData.totalActivities}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6 rounded-xl border border-gray-700">
          <Activity className="w-8 h-8 mb-3 text-emerald-200" />
          <h3 className="text-lg font-semibold mb-1">Current Streak</h3>
          <p className="text-3xl font-bold">{userData.streak} days</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-xl border border-gray-700">
          <Code className="w-8 h-8 mb-3 text-purple-200" />
          <h3 className="text-lg font-semibold mb-1">Favorite Algorithm</h3>
          <p className="text-lg font-semibold">{userData.favoriteAlgorithm}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Edit Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={userData.name}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={userData.email}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderActivityContent = () => {
    const currentActivity = pastActivities[currentActivityIndex];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Your Learning Journey
          </h2>
          <p className="text-gray-300">
            Track your progress through DSA concepts
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
              <button
                onClick={prevActivity}
                className="p-2 rounded-full bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-400">
                  {currentActivityIndex + 1} of {pastActivities.length}
                </span>
              </div>

              <button
                onClick={nextActivity}
                className="p-2 rounded-full bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-900 rounded-full border border-blue-700">
                    <div className="text-blue-300">
                      {getActivityIcon(currentActivity.type)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {currentActivity.algorithm}
                    </h3>
                    <p className="text-gray-400 capitalize">
                      {currentActivity.type.replace("-", " ")}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentActivity.status === "completed"
                      ? "bg-emerald-900 text-emerald-300 border border-emerald-700"
                      : "bg-yellow-900 text-yellow-300 border border-yellow-700"
                  }`}
                >
                  {currentActivity.status}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <Calendar className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="font-semibold text-white">
                    {currentActivity.date}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <Clock className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="font-semibold text-white">
                    {currentActivity.duration}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <Code className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Complexity</p>
                  <p className="font-semibold text-white">
                    {currentActivity.complexity}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <Trophy className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Accuracy</p>
                  <p className="font-semibold text-white">
                    {currentActivity.accuracy}%
                  </p>
                </div>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentActivity.accuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {pastActivities.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentActivityIndex(index)}
              className={`h-2 rounded-full transition-colors ${
                index === currentActivityIndex
                  ? "bg-blue-500"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderAccountsContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Security</h3>
        <div className="space-y-4">
          <button className="w-full text-left p-4 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="font-medium text-white">Change Password</div>
            <div className="text-sm text-gray-400">
              Update your account password
            </div>
          </button>
          <button className="w-full text-left p-4 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="font-medium text-white">
              Two-Factor Authentication
            </div>
            <div className="text-sm text-gray-400">
              Add an extra layer of security
            </div>
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Email Notifications</div>
              <div className="text-sm text-gray-400">
                Receive updates about your progress
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Dark Mode</div>
              <div className="text-sm text-gray-400">Switch to dark theme</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className=" p-6 bg-gray-800 rounded-xl ">
        <h3 className="text-lg font-bold text-red-300 mb-4">Danger Zone</h3>
        <button className=" text-white px-6 py-2 rounded-lg bg-red-600 hover:bg-red-600 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileContent();
      case "activity":
        return renderActivityContent();
      case "accounts":
        return renderAccountsContent();
      default:
        return renderProfileContent();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-900 shadow-2xl h-screen sticky top-0 border-r border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />
              <div>
                <h3 className="font-bold text-white">{userData.name}</h3>
                <p className="text-sm text-gray-400">{userData.email}</p>
              </div>
            </div>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-600 hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
