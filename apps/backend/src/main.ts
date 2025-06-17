import app from './app';
import mockDataRouter from './routes/mockData';
import projectRouter from './routes/project';
import schemaRouter from './routes/schema';
import clerkWebhook from './routes/webhooks/clerk';

const port = process.env.PORT || 4000;

app.use('/webhooks', clerkWebhook);
app.use('/projects', projectRouter);
app.use('/projects/:projectId/schemas', schemaRouter);

app.use('/api', mockDataRouter);

app.listen(port, () =>
  console.log(`Backend running at http://localhost:${port}`));

// app.listen(3000, () => console.log('Listening on port 3000'));
