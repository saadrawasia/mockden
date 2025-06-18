import type { Request } from 'express';

import db from '@backend/db/client';
import { users } from '@backend/db/schema';
import { clerkClient, getAuth } from '@clerk/express';
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

export async function getAuthenticatedUser(req: Request) {
  const { userId } = getAuth(req);
  if (!userId) {
    return null;
  }
  const user = await getUserByClerkId(userId);
  if (!user) {
    return null;
  }
  return user;
}

type UpdateUserProps = {
  firstName: string;
  lastName: string;
  clerkUserId: string;
};

export async function updateUser({ firstName, lastName, clerkUserId }: UpdateUserProps) {
  try {
    const params = { firstName, lastName };
    await clerkClient.users.updateUser(clerkUserId, params);
    await db
      .update(users)
      .set({ firstName, lastName })
      .where(eq(users.clerkUserId, clerkUserId));
    return { status: 200, json: { message: 'User updated.' } };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: { message: 'User not found.' } };
  }
}

type updatePasswordProps = {
  oldPassword: string;
  newPassword: string;
  clerkUserId: string;
};

type ClerkAPIResponseError = {
  errors: {
    code: string;
    message: string;
    longMessage?: string;
    meta?: Record<string, unknown>;
  }[];
};

// eslint-disable-next-line ts/no-explicit-any
export function isClerkError(error: any): error is ClerkAPIResponseError {
  return (
    typeof error === 'object'
    && error !== null
    && error.status
    && Array.isArray(error.errors)
    && typeof error.errors[0]?.code === 'string'
    && error.clerkError === true
  );
}

export async function updatePassword({ oldPassword, newPassword, clerkUserId }: updatePasswordProps) {
  try {
    const verifyPassword = await clerkClient.users.verifyPassword({ userId: clerkUserId, password: oldPassword });
    if (verifyPassword.verified) {
      await clerkClient.users.updateUser(clerkUserId, { password: newPassword });
      return { status: 200, json: { message: 'Password updated.' } };
    }
    return { status: 400, json: { message: 'Something went wrong!' } };
  }
  catch (err) {
    console.error('DB error:', err);
    if (isClerkError(err)) {
      return { status: 400, json: { message: err.errors[0].longMessage } };
    }
    else {
      return { status: 400, json: { message: 'Something went wrong!' } };
    }
  }
}

type DeleteUserProps = {
  clerkUserId: string;
};

export async function deleteUser({ clerkUserId }: DeleteUserProps) {
  try {
    await clerkClient.users.deleteUser(clerkUserId);
    await db.delete(users).where(eq(users.clerkUserId, clerkUserId));

    return { status: 400, json: { message: 'User deleted.' } };
  }
  catch (err) {
    console.error('DB error:', err);
    if (isClerkError(err)) {
      return { status: 400, json: { message: err.errors[0].longMessage } };
    }
    else {
      return { status: 400, json: { message: 'Something went wrong!' } };
    }
  }
}
