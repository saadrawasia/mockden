import db from '@backend/db/client';
import { users } from '@backend/db/schema';
import express from 'express';

const router = express.Router();

router.post('/clerk/user-created', express.json(), async (req, res) => {
  try {
    const event = req.body;

    if (event.type !== 'user.created') {
      return res.status(400).send('Ignored');
    }

    const user = event.data;

    await db.insert(users).values({
      email: user.email_addresses?.[0]?.email_address || '',
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      clerkUserId: user.id,
    });

    return res.status(200).send('User created');
  }
  catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).send('Error processing webhook');
  }
});

export default router;
