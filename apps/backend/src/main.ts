import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './db/db';
import { createSchema, getAllSchemas, getSchema } from './services/mockData';

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

type Record = {
  id: number;
  schema_id: number;
  data: number;
};

app.post('/schema', async (req: Request, res: Response) => {
  const { name, schema } = req.body;
  return createSchema({ name, schema, res });
});

app.get('/schemas', async (_req: Request, res: Response) => {
  return getAllSchemas(res);
});

app.get('/schema/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  return getSchema({ id, res });
});

app.all('/:schemaId/:id?', async (req: Request, res: Response) => {
  const { schema } = req.params;
  const method = req.method;

  switch (method) {
    case 'GET':
      try {
        const query = 'Select * from mock_data where schema_id = ?';
        const mockData = (await db.all(query, [schema])) as Record[];
        const data = mockData.map((mockData) => mockData.data);
        return res.json(data);
      } catch (err) {
        console.error('DB error:', err);
        return res.json({ message: 'Mock data not found' });
      }

    // case 'POST': {
    //   const newItem: DataItem = { id: Date.now(), ...req.body };
    //   db[schema].push(newItem);
    //   return res.status(201).json(newItem);
    // }

    // case 'PUT':
    // case 'PATCH': {
    //   const idx = db[schema].findIndex((item) => item.id === Number(id));
    //   if (idx === -1) return res.status(404).send('Not found');
    //   db[schema][idx] = { ...db[schema][idx], ...req.body };
    //   return res.json(db[schema][idx]);
    // }

    // case 'DELETE':
    //   db[schema] = db[schema].filter((item) => item.id !== Number(id));
    //   return res.status(204).send();

    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
});

app.listen(port, () =>
  console.log(`Backend running at http://localhost:${port}`)
);
