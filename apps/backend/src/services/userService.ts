import db from '@backend/db/client';
import { users } from '@backend/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserByClerkId(clerkId: string) {
  const user = await db.query.users.findFirst({
    where: fields => eq(fields.clerkUserId, clerkId),
  });

  return user;
}

type EmailAddress = {
  email_address: string;
};

type User = {
  email_addresses?: EmailAddress[];
  first_name?: string;
  last_name?: string;
  id: string;
};

export async function createUser(user: User) {
  return await db.insert(users).values({
    email: user.email_addresses?.[0]?.email_address || '',
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    clerkUserId: user.id,
  });
}
