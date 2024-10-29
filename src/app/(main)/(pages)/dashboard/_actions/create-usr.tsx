'use server'
import { Option } from '@/components/ui/multiple-selector'
import { db } from '@/lib/db'
import { auth, currentUser } from '@clerk/nextjs'

export const createUser = async () => {
  const { userId } = auth()
  const user = await currentUser()

  if (userId) {
    // Check if the user exists
    const listener = await db.user.upsert({
      where: { clerkId: userId },
      update: {},  // If the user exists, no update needed, so leave this empty
      create: {    // If the user doesn't exist, create a new entry with provided details
        clerkId: userId,
        name: user?.username,
        email: user?.primaryEmailAddressId || '',
        profileImage: user?.imageUrl,
      },
      select: {
        googleResourceId: true,
      },
    });
    console.log(listener);

    return listener;
  }
}


