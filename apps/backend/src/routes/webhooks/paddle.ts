import { EventName, Paddle } from '@paddle/paddle-node-sdk';
import express from 'express';

const router = express.Router();
const paddle = new Paddle(process.env.VITE_PADDLE_SECRET_TOKEN || '');

router.post('/', express.json(), async (req, res) => {
	const signature = (req.headers['paddle-signature'] as string) || '';
	// req.body should be of type `buffer`, convert to string before passing it to `unmarshal`.
	// If express returned a JSON, remove any other middleware that might have processed raw request to object
	const rawRequestBody = req.body.toString();
	// Replace `WEBHOOK_SECRET_KEY` with the secret key in notifications from vendor dashboard
	const secretKey = process.env.WEBHOOK_SECRET_KEY || '';

	try {
		if (signature && rawRequestBody) {
			// The `unmarshal` function will validate the integrity of the webhook and return an entity
			const eventData = await paddle.webhooks.unmarshal(rawRequestBody, secretKey, signature);
			console.log({ eventData });
			switch (eventData.eventType) {
				case EventName.ProductUpdated:
					console.log(`Product ${eventData.data.id} was updated`);
					break;
				case EventName.SubscriptionUpdated:
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
