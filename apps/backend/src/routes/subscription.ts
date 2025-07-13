import express from 'express';
import {
	cancelPaddleSubscriptionRequest,
	getPaddleSubscriptionRequest,
} from '../controllers/subscriptionController';

const subscriptionRouter = express.Router({ mergeParams: true });

subscriptionRouter.get('/:id', getPaddleSubscriptionRequest);
subscriptionRouter.delete('/:id', cancelPaddleSubscriptionRequest);

export default subscriptionRouter;
