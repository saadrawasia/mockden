import app from './app';
import mockDataRouter from './routes/mockData';
import projectRouter from './routes/project';
import schemaRouter from './routes/schema';

const port = process.env.PORT || 4000;

app.use('/projects', projectRouter);
app.use('/projects/:projectId/schemas', schemaRouter);

app.use('/api', mockDataRouter);

app.listen(port, () =>
  console.log(`Backend running at http://localhost:${port}`));
