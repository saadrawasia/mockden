import express from 'express';
import { getPaddleSubscriptionRequest } from '../controllers/subscriptionController';

const subscriptionRouter = express.Router({ mergeParams: true });

subscriptionRouter.get('/:id', getPaddleSubscriptionRequest);

export default subscriptionRouter;
