import React, { useState } from "react";
import {
  Send,
  Star,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  ArrowLeft,
} from "lucide-react";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("feedback");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    rating: 0,
    category: "general",
  });
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error",
  });
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
  // Mock previous queries data
  const [previousQueries] = useState([
    {
      id: 1,
      subject: "Login Issue",
      message: "Cannot access my account after password reset",
      status: "resolved",
      date: "2025-06-28",
      response: "Issue resolved. Password reset link was sent to your email.",
    },
    {
      id: 2,
      subject: "Feature Request",
      message: "Would love to see dark mode option",
      status: "in-progress",
      date: "2025-06-25",
      response: "Thanks for the suggestion! We're working on it.",
    },
    {
      id: 3,
      subject: "Bug Report",
      message: "Page not loading on mobile browser",
      status: "pending",
      date: "2025-06-20",
      response: "",
    },
    {
      id: 4,
      subject: "General Inquiry",
      message: "How to upgrade my subscription?",
      status: "resolved",
      date: "2025-06-15",
      response: "You can upgrade from your account settings page.",
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          rating: 0,
          category: "general",
        });
      }, 3000);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "text-green-400 bg-green-900/20 border-green-700";
      case "in-progress":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-700";
      case "pending":
        return "text-red-400 bg-red-900/20 border-red-700";
      default:
        return "text-gray-400 bg-gray-800 border-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Support Center
          </h1>
          <p className="text-gray-400 text-lg">
            We're here to help. Share your experience or get support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("feedback")}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors duration-200 ${activeTab === "feedback"
                    ? "bg-white text-gray-900"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                Share Feedback
              </button>
              <button
                onClick={() => setActiveTab("support")}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors duration-200 ${activeTab === "support"
                    ? "bg-white text-gray-900"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                Get Support
              </button>
            </div>

            {/* Form */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              {/* Rating Section (for feedback tab) */}
              {activeTab === "feedback" && (
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">
                    Rate Your Experience
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        className="transition-colors duration-200"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= formData.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-600 hover:text-yellow-400"
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Category & Subject */}
              {activeTab === "support" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="Brief description"
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Brief description of your feedback"
                  />
                </div>
              )}

              {/* Message */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-2">
                  {activeTab === "feedback"
                    ? "Share Your Experience"
                    : "Describe Your Issue"}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
                  placeholder={
                    activeTab === "feedback"
                      ? "Tell us about your experience with our service..."
                      : "Please describe your issue in detail..."
                  }
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>
                  {activeTab === "feedback"
                    ? "Submit Feedback"
                    : "Submit Request"}
                </span>
              </button>

              {/* Success Message */}
              {submitted && (
                <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">
                  ✓ Thank you! Your{" "}
                  {activeTab === "feedback" ? "feedback" : "support request"}{" "}
                  has been submitted successfully.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Previous Queries */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Previous Queries
              </h3>

              <div className="space-y-4">
                {previousQueries.map((query) => (
                  <div
                    key={query.id}
                    className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white text-sm truncate">
                        {query.subject}
                      </h4>
                      <div className="flex items-center ml-2">
                        {getStatusIcon(query.status)}
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {query.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">
                        {query.date}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          query.status
                        )}`}
                      >
                        {query.status}
                      </span>
                    </div>

                    {query.response && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <p className="text-gray-300 text-xs">
                          <strong>Response:</strong> {query.response}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h4 className="font-semibold text-white mb-3">
                  Need Immediate Help?
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    support@company.com
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    +1 (555) 123-4567
                  </div>
                </div>
              </div>
            </div>
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
