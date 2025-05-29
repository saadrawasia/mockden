import app from './app';
import mockDataRouter from './routes/mockData';
import schemaRouter from './routes/schema';

const port = (process.env.PORT) || 4000;

app.use('/schemas', schemaRouter);

app.use('/api', mockDataRouter);

app.listen(port, () =>
  console.log(`Backend running at http://localhost:${port}`));
