import React from "react";
import { AlertTriangle, X, Check } from "lucide-react";

export default function Alert({
  message,
  type = "error",
  isOpen,
  onClose,
  customButtons,
}) {
  const getAlertIcon = () => {
    switch (type) {
      case "success":
        return <Check className="w-8 h-8" />;
      case "warning":
        return <AlertTriangle className="w-8 h-8" />;
      case "error":
        return <X className="w-8 h-8" />;
      default:
        return <AlertTriangle className="w-8 h-8" />;
    }
  };

  const getAlertColors = () => {
    switch (type) {
      case "success":
        return "from-emerald-500 to-teal-500";
      case "warning":
        return "from-yellow-500 to-orange-500";
      case "error":
        return "from-red-500 to-pink-500";
      default:
        return "from-blue-500 to-purple-500";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${getAlertColors()} p-[1px] opacity-20`}
        >
          <div className="w-full h-full bg-gray-800/95 rounded-3xl" />
        </div>

        <div className="relative text-center">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${getAlertColors()} rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse`}
          >
            {getAlertIcon()}
          </div>

          <h2 className="text-2xl font-semibold text-white mb-4 capitalize">
            {type} Alert
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed mb-8 break-words">
            {message}
          </p>

          {customButtons || (
            <button
              onClick={onClose}
              className={`px-6 py-3 bg-gradient-to-r ${getAlertColors()} text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg`}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
