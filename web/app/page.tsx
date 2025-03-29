'use client';

import { useUser } from '@auth0/nextjs-auth0';
import React from 'react';

export default function Home() {
  const { user, isLoading } = useUser();
  return (
    <div>
      <div>
        {!isLoading && !user && (
          <div>
            <a href="/auth/login">Log in</a>
          </div>
        )}
      </div>
      <div>
        {user && (
          <div>
            <div>
              <img
                src={user.picture}
                alt="Profile"
                className="nav-user-profile rounded-circle"
                width="50"
                height="50"
              />
            </div>
            <div>
              <div>{user.name}</div>
              <div>
                <a href="/auth/logout">Log out</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
