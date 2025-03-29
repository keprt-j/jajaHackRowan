import './globals.css';
import React from 'react';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JajaHack',
  description: 'AI-powered platform for seamless communication'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css" />
      </head>
      <body className={inter.className}>
        <Auth0Provider>
          <main id="app" className="d-flex flex-column h-100" data-testid="layout">
            {children}
          </main>
        </Auth0Provider>
      </body>
    </html>
  );
}
