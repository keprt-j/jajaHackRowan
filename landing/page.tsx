'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';

export default function LandingPage() {
  const { user, isLoading } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header with Auth Buttons */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">Cancer Detector</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <Link
                      href="/api/auth/logout"
                      style={{ borderRadius: '20px' }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      Log out
                    </Link>
                  </div>
                  <img
                    src={user.picture}
                    alt="Profile"
                    style={{ borderRadius: '50%' }}
                    className="h-10 w-10 ring-2 ring-gray-200"
                  />
                </div>
              ) : (
                <Link
                  href="/api/auth/login"
                  style={{ borderRadius: '20px' }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Advanced Medical Image</span>
              <span className="block text-blue-600">Analysis Platform</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Leveraging cutting-edge AI technology to provide accurate and rapid cancer detection analysis.
              Get instant results and expert insights for your medical images.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Key Features
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Everything you need for accurate medical image analysis
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-blue-500 text-white mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">AI-Powered Analysis</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Advanced machine learning algorithms for accurate cancer detection and analysis.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-blue-500 text-white mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Real-time Results</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get instant analysis results with detailed confidence scores and predictions.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-blue-500 text-white mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">AI Assistant</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get expert insights and answers to your questions about the analysis results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Simple steps to get your analysis results
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-lg font-medium text-gray-900">Upload Image</h3>
                <p className="mt-2 text-base text-gray-500">
                  Upload your medical image in JPG, JPEG, or PNG format.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-lg font-medium text-gray-900">AI Analysis</h3>
                <p className="mt-2 text-base text-gray-500">
                  Our AI system analyzes your image for cancer detection.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-lg font-medium text-gray-900">Get Results</h3>
                <p className="mt-2 text-base text-gray-500">
                  Receive detailed analysis results and expert insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Start analyzing your medical images today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>     
    </div>
  );
} 