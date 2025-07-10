import { clerkMiddleware, requireAuth } from '@clerk/express';

import app from './app';
import { rateLimiter } from './middleware/rateLimiter';
import mockDataRouter from './routes/mockData';
import projectRouter from './routes/project';
import schemaRouter from './routes/schema';
import userRouter from './routes/user';
import clerkWebhook from './routes/webhooks/clerk';

const port = process.env.PORT || 4000;

app.use(clerkMiddleware({ publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY }));

app.use('/webhooks', clerkWebhook);
app.use('/users', requireAuth(), userRouter);
app.use('/projects', requireAuth(), projectRouter);
app.use('/projects/:projectId/schemas', requireAuth(), schemaRouter);

app.use('/mockdata/:projectSlug/:schemaSlug', rateLimiter, mockDataRouter);

app.head('/testing/uptimerobot', (_req, res) => {
	res.status(200).send('Working');
});

app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));
