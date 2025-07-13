import { getAuth } from '@clerk/express';
import type { Request, Response } from 'express';
import { getPaddleSubscription } from '../services/subscriptionService';

export async function getPaddleSubscriptionRequest(req: Request, res: Response) {
	try {
		const { userId } = getAuth(req);
		if (!userId) return res.status(401).json({ message: 'Unauthorized Request' });

		const { id } = req.params;

		const subscription = await getPaddleSubscription(id);
		if (subscription) {
			return res.status(200).json(subscription);
		}
		return res.status(401).json({ message: 'Unauthorized Request' });
	} catch {
		return res.status(400).json({ message: 'Something went wrong.' });
	}
}
