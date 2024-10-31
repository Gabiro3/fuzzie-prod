"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { createUser } from './_actions/create-usr';

interface User {
  googleResourceId: string | null;
}

const DashboardPage = () => {
  const { isLoaded, isSignedIn, user } = useUser(); // useUser hook for client-side auth
  const [loading, setLoading] = useState(true);
  const [listener, setListener] = useState<User | null>(null);

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (isLoaded && isSignedIn && user) { // Ensure user data is loaded and signed in
        try {
          const upsertedUser = await createUser();
          setListener(upsertedUser || null); // Set the listener state
          console.log(upsertedUser);
        } catch (error) {
          console.error('Error upserting user:', error);
        }
      }
      setLoading(false); // Stop loading once the check is complete
    };

    checkUserRegistration();
  }, [isLoaded, isSignedIn, user]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking
  }

  return (
    <div className="flex flex-col gap-4 relative">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        Dashboard
      </h1>
      {/* You can use listener data here if needed */}
    </div>
  );
};

export default DashboardPage;


