import { EventName } from '@paddle/paddle-node-sdk';
import express from 'express';
import {
	subscriptionActivateOrCreate,
	subscriptionCancel,
	subscriptionUpdate,
} from '../../services/subscriptionService';
import { paddle } from '../../utils/paddle';

const router = express.Router();

router.post('/', express.json(), async (req, res) => {
	const signature = (req.headers['paddle-signature'] as string) || '';
	// req.body should be of type `buffer`, convert to string before passing it to `unmarshal`.
	// If express returned a JSON, remove any other middleware that might have processed raw request to object
	const rawRequestBody = JSON.stringify(req.body);
	// Replace `WEBHOOK_SECRET_KEY` with the secret key in notifications from vendor dashboard
	const secretKey = process.env.WEBHOOK_SECRET_KEY || '';

	try {
		if (signature && rawRequestBody) {
			// The `unmarshal` function will validate the integrity of the webhook and return an entity
			const eventData = await paddle.webhooks.unmarshal(rawRequestBody, secretKey, signature);
			switch (eventData.eventType) {
				case EventName.SubscriptionActivated:
					await subscriptionActivateOrCreate(eventData.data);
					break;
				case EventName.SubscriptionUpdated:
					await subscriptionUpdate(eventData.data);
					break;
				case EventName.SubscriptionCreated:
					await subscriptionActivateOrCreate(eventData.data);
					break;
				case EventName.SubscriptionCanceled:
					await subscriptionCancel(eventData.data);
					break;
				case EventName.SubscriptionPastDue:
					console.log(`Subscription ${eventData.data.id} was updated`);
					break;
				default:
					console.log(eventData.eventType);
			}
		} else {
			console.log('Signature missing in header');
		}
	} catch (e) {
		// Handle signature mismatch or other runtime errors
		console.log(e);
	}
	// Return a response to acknowledge
	res.send('Processed webhook event');
});

export default router;
