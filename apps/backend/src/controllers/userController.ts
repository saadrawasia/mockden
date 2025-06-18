import type { Request, Response } from 'express';

import { deleteUser, updatePassword, updateUser } from '@backend/services/userService';
import { getAuth } from '@clerk/express';

export async function editUserRequest(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId)
      return res.status(401).json({ message: 'Unauthorized Request' }); ;
    const { firstName, lastName } = req.body;

    const updatedUser = await updateUser({
      firstName,
      lastName,
      clerkUserId: userId,
    });
    return res.status(updatedUser.status).json(updatedUser.json);
  }
  catch {
    return res.status(400).json({ message: 'Something went wrong.' });
  }
}

export async function updatePasswordRequest(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId)
      return res.status(401).json({ message: 'Unauthorized Request' }); ;
    const { oldPassword, newPassword } = req.body;

    const updatedUser = await updatePassword({
      oldPassword,
      newPassword,
      clerkUserId: userId,
    });
    return res.status(updatedUser.status).json(updatedUser.json);
  }
  catch {
    return res.status(400).json({ message: 'Something went wrong.' });
  }
}

export async function deleteUserRequest(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId)
      return res.status(401).json({ message: 'Unauthorized Request' }); ;
    const { clerkUserId } = req.body;

    const updatedUser = await deleteUser({
      clerkUserId,
    });
    return res.status(updatedUser.status).json(updatedUser.json);
  }
  catch {
    return res.status(400).json({ message: 'Something went wrong.' });
  }
}
