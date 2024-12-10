import React from 'react';
import Link from 'next/link';

const Error401Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          {/* Custom cube icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                className="w-24 h-24 text-blue-500 animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <path d="M3.27 6.96L12 12.01l8.73-5.05" />
                <path d="M12 22.08V12" />
              </svg>
              {/* Lock icon */}
              <svg
                viewBox="0 0 24 24"
                className="absolute -bottom-2 -right-2 w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          {/* Error message */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-blue-900">401 - Unauthorized Access</h1>
            <p className="text-xl text-blue-600">Oops! Looks like you don't have permission to access this area.</p>
          </div>

          {/* Custom alert */}
          <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-blue-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="ml-3">
                <h3 className="text-blue-800 font-semibold">Access Denied</h3>
                <p className="text-blue-600 mt-1">
                  This section of our 3D Model Store requires proper authentication. Please log in or contact support if you believe this is an error.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/login" passHref>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                Return
              </button>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-blue-400 text-sm">
            <p>Need help? Contact our support team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error401Page;