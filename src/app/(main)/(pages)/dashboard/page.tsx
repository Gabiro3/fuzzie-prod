"use client"
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/lib/db';


interface User {
  googleResourceId: string | null;
}

const DashboardPage = () => {
  const { user, isLoaded } = useUser(); // Using the useUser hook
  const [loading, setLoading] = useState(true);
  const [listener, setListener] = useState<User | null>(null);

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (user) {
        const userId = user.id; // Get the user ID from the user object

        try {
          const upsertedUser = await db.user.upsert({
            where: { clerkId: userId },
            update: {}, // No update needed if the user exists
            create: {
              clerkId: userId,
              name: user.username,
              email: user.primaryEmailAddressId || '',
              profileImage: user.imageUrl,
            },
            select: {
              googleResourceId: true,
            },
          });
          setListener(upsertedUser); // Store the upserted user
          console.log(upsertedUser);
        } catch (error) {
          console.error('Error upserting user:', error);
        }
      }
      setLoading(false); // Stop loading once the check is complete
    };

    if (isLoaded) {
      checkUserRegistration();
    }
  }, [user, isLoaded]); // Depend on user and isLoaded

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
