'use client';

import { useUser } from '@auth0/nextjs-auth0';
import React from 'react';

export default function Home() {
  const { user, isLoading } = useUser();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getPrediction = async () => {
    console.log(fileInputRef.current?.files);
    const formData = new FormData();
    if (fileInputRef.current?.files) {
      const file = fileInputRef.current.files[0];
      formData.append('file', file);
    }

    console.log(formData);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      console.log('Upload success:', data);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
    }
  };
  return (
    <div>
      <div className="flex">
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
      <div>
        <button
          onClick={() => {
            fileInputRef.current?.click();
          }}
          className="">
          Upload Photo
        </button>
        <input
          type="file"
          className=""
          hidden
          onChange={getPrediction}
          multiple={false}
          ref={fileInputRef}
          accept=".jpg, .jpeg, .png"
        />
      </div>
    </div>
  );
}
