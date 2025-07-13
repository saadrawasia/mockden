import { clerkMiddleware, requireAuth } from '@clerk/express';
import express from 'express';
import { rateLimiter } from '../middleware/rateLimiter';
import mockDataRouter from './mockData';
import projectRouter from './project';
import schemaRouter from './schema';
import subscriptionRouter from './subscription';
import userRouter from './user';
import clerkWebhook from './webhooks/clerk';
import paddleWebhook from './webhooks/paddle';

const router = express.Router();
const authRouter = express.Router();

router.get('/testing/uptimerobot', (_req, res) => {
	res.status(200).type('html').send('Working');
});

router.head('/testing/uptimerobot', (_req, res) => {
	res.status(200).type('html').end();
});
router.use('/mockdata/:projectSlug/:schemaSlug', rateLimiter, mockDataRouter);
router.use('/webhooks/clerk', clerkWebhook);
router.use('/webhooks/paddle', paddleWebhook);

authRouter.use(
	clerkMiddleware({ publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY }),
	requireAuth()
);

authRouter.use('/users', userRouter);
authRouter.use('/projects', projectRouter);
authRouter.use('/projects/:projectId/schemas', schemaRouter);
authRouter.use('/subscriptions', subscriptionRouter);

export { router, authRouter };
