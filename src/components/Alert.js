import React from "react";

// Alert component with Tailwind styling
const Alert = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 max-w-sm w-full mx-auto animate-fadeIn">
      <p className="text-gray-700 font-semibold text-center">{message}</p>
      <button
        onClick={onClose}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 w-full"
      >
        Close
      </button>
    </div>
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50"></div>
  </div>
);

export default Alert;
