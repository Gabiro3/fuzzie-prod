"use client"

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { currentUser, auth } from '@clerk/nextjs';

interface User {
  googleResourceId: string | null;
}

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [listener, setListener] = useState<User | null>(null); // Set the initial state to User type or null
  const { userId } = auth();

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (userId) {
        const user = await currentUser();
        if (user) {
          try {
            const upsertedUser = await db.user.upsert({
              where: { clerkId: userId },
              update: {}, // No update needed if the user exists
              create: { // Create a new user if they don't exist
                clerkId: userId,
                name: user.username,
                email: user.primaryEmailAddressId || '',
                profileImage: user.imageUrl,
              },
              select: {
                googleResourceId: true,
              },
            });
            setListener(upsertedUser); // Now setListener can accept User or null
            console.log(upsertedUser);
          } catch (error) {
            console.error('Error upserting user:', error);
          }
        }
      }
      setLoading(false); // Stop loading once the check is complete
    };

    checkUserRegistration();
  }, [userId]); // Depend on userId

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

