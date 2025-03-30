'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@auth0/nextjs-auth0';
import Chat from './components/Chat';

interface Region {
  top: number;
  left: number;
  height: number;
  width: number;
}

interface PredictionData {
  prediction: string;
  confidence: number;
  regions: Region[];
}

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [image, setImage] = useState<File | null>(null);
  const [predData, setPredData] = useState<PredictionData | null>(null);
  const [showRegions, setShowRegions] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPredData(null);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        console.log('API Response:', data);
        console.log('Regions:', data.regions);
        setPredData(data);
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-zinc-800 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-xl font-bold text-white">Medical Image Analysis</h3>
          </motion.div>
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-6 w-6 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full animate-pulse"
              />
            ) : user && user.name ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2">
                <span className="text-sm text-gray-200">{user.name}</span>
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  src={user.picture}
                  alt="Profile"
                  style={{ borderRadius: '50%' }}
                  className="h-8 w-8 ring-2 ring-blue-400/20"
                />
                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  href="/api/auth/logout"
                  style={{ borderRadius: '20px' }}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 hover:shadow-lg">
                  Log out
                </motion.a>
              </motion.div>
            ) : (
              <motion.a
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                href="/api/auth/login"
                style={{ borderRadius: '20px' }}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg">
                Log in
              </motion.a>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{ borderRadius: '20px' }}
          className="bg-white shadow-xl p-8 border border-gray-100">
          <AnimatePresence mode="wait">
            {predData ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative">
                  <div className="relative">
                    <motion.img
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      src={URL.createObjectURL(image!)}
                      alt="Uploaded"
                      style={{ borderRadius: '20px' }}
                      className="shadow-lg w-64 h-64 object-contain bg-gradient-to-br from-gray-50 to-gray-100"
                    />
                    {showRegions && predData.regions && (
                      <div className="absolute inset-0 w-64 h-64">
                        {predData.regions.map((region, index) => (
                          <div
                            key={index}
                            className="absolute border-2 border-red-500 bg-gradient-to-br from-red-500/20 to-red-500/10 transition-all duration-200"
                            style={{
                              left: `${region[0]}px`,
                              top: `${region[1]}px`,
                              width: `${region[2]}px`,
                              height: `${region[3]}px`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showRegions}
                        onChange={e => setShowRegions(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Show Detection Regions</span>
                    </label>
                  </div>
                </motion.div>

                <div className="hidden md:block w-px h-64 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center md:text-left">
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                    Analysis Results
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-1.5 rounded-full ${
                            predData.prediction === 'malignant'
                              ? 'bg-gradient-to-br from-red-100 to-red-50'
                              : 'bg-gradient-to-br from-green-100 to-green-50'
                          }`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              predData.prediction === 'malignant' ? 'text-red-600' : 'text-green-600'
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            {predData.prediction === 'malignant' ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {predData.prediction === 'malignant' ? 'Potential Cancer Detected' : 'No Cancer Detected'}
                          </h3>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {predData.prediction === 'malignant'
                              ? 'Please consult with a healthcare professional for further evaluation.'
                              : 'Regular check-ups are recommended.'}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-center md:justify-start space-x-2">
                        <span className="text-lg font-medium text-gray-700">Prediction:</span>
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          style={{ borderRadius: '9999px' }}
                          className={`px-3 py-1 text-sm font-medium ${
                            predData.prediction === 'malignant'
                              ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-800'
                              : 'bg-gradient-to-r from-green-100 to-green-50 text-green-800'
                          }`}>
                          {predData.prediction}
                        </motion.span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start space-x-2">
                        <span className="text-lg font-medium text-gray-700">Confidence:</span>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '8rem' }}
                          transition={{ delay: 0.7, duration: 0.5 }}
                          style={{ borderRadius: '9999px' }}
                          className="w-32 bg-gradient-to-r from-gray-200 to-gray-100 h-2.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${predData.confidence * 100}%` }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            style={{ borderRadius: '9999px' }}
                            className={`h-2.5 ${
                              predData.confidence > 0.7
                                ? 'bg-gradient-to-r from-red-500 to-red-600'
                                : 'bg-gradient-to-r from-green-500 to-green-600'
                            }`}></motion.div>
                        </motion.div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.9 }}
                          className="text-sm font-medium text-gray-600">
                          {(predData.confidence * 100).toFixed(1)}%
                        </motion.span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• This is an AI-assisted analysis</p>
                      <p>• Results should be verified by a medical professional</p>
                      <p>• Regular screenings are important for early detection</p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                      className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setImage(null);
                          setPredData(null);
                          fileInputRef.current?.click();
                        }}
                        style={{ borderRadius: '20px' }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                        Upload Another Image
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-16 w-16 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  Upload an Image
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 mb-8 max-w-md mx-auto">
                  Upload a medical image for cancer detection analysis. We support JPG, JPEG, and PNG formats.
                </motion.p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ borderRadius: '20px' }}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Choose Image
                </motion.button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.main>

      <Chat />
    </div>
  );
}
