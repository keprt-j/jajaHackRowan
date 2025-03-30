'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';

export default function LandingPage() {
  const { user, isLoading } = useUser();

  const handleLogout = () => {
    const auth0Domain = process.env.PUBLIC_AUTH0_DOMAIN;
    const clientId = process.env.PUBLIC_AUTH0_CLIENT_ID;
    const returnTo = window.location.origin; // Redirect to the home page after logout

    // Redirect to the Auth0 logout endpoint
    window.location.href = `https://${auth0Domain}/v2/logout?returnTo=${encodeURIComponent(
      returnTo
    )}&client_id=${clientId}`;
  };

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
              <h1 className="text-2xl font-bold text-gray-900">BenignAI</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 rounded-md"
                    >
                      Log out
                    </button>
                  </div>
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="h-10 w-10 rounded-full ring-2 ring-gray-200"
                  />
                </div>
              ) : (
                <Link
                  href="/api/auth/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 rounded-md"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Rest of the page content */}
    </div>
  );
}