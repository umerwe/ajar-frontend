"use client";

import { AlertCircle } from "lucide-react";

const Error = ({ className = "min-h-screen" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center max-w-md mx-auto">
        <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-4">Please check your connection and
          try again.
        </p>
      </div>
    </div>
  );
};

export default Error;
