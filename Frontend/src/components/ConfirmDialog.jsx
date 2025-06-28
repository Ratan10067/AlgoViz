import React from "react";
import { X } from "lucide-react";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-[400px] border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <p className="text-gray-300 mb-6">{message}</p>

        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Leave
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Stay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
