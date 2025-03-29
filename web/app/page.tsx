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
      <div className="flex justify-content-between">
        <div className="mx-2 my-1 font-bold text-2xl">Cancer detector</div>
        {!isLoading && !user && (
          <div className="mx-2 my-1">
            <a href="/auth/login">Log in</a>
          </div>
        )}
        {user && (
          <div className="flex">
            <div className="mx-2 my-1">
              <div>{user.name}</div>
              <div>
                <a href="/auth/logout">Log out</a>
              </div>
            </div>
            <div className="mx-2 my-1">
              <img
                src={user.picture}
                alt="Profile"
                className="nav-user-profile rounded-circle"
                width="50"
                height="50"
              />
            </div>
          </div>
        )}
      </div>
      <div>
        <button
          onClick={() => {
            fileInputRef.current?.click();
          }}
          className={`rounded-lg bg-blue-500 hover:bg-indigo-500 px-6 py-2 text-lg transition-all text-white ease-in-out ring-blue-800 duration-100 outline-none`}>
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
