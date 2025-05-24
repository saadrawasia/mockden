import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

interface DataItem extends Record<string, unknown> {
  id: number;
}

interface DB {
  [resource: string]: DataItem[];
}

const db: DB = {
  posts: [{ id: 1, title: 'Hello World', body: 'Welcome to the mock API!' }],
};

app.post('/define-schema', (req: Request, res: Response) => {
  const { resource, initialData } = req.body;
  console.log({ resource });
  if (!resource) return res.status(400).send('Missing resource name');
  db[resource] = initialData || [];
  return res.status(201).json({ message: `Resource '${resource}' created.` });
});

app.get('/resources', (req: Request, res: Response) => {
  return res.json({ data: Object.keys(db) });
});

app.all('/:resource/:id?', (req: Request, res: Response): Response | void => {
  const { resource, id } = req.params;
  const method = req.method;

  if (!db[resource]) return res.status(404).send('Resource not found');

  switch (method) {
    case 'GET':
      return id
        ? res.json(db[resource].find((item) => item.id === Number(id)))
        : res.json(db[resource]);

    case 'POST': {
      const newItem: DataItem = { id: Date.now(), ...req.body };
      db[resource].push(newItem);
      return res.status(201).json(newItem);
    }

    case 'PUT':
    case 'PATCH': {
      const idx = db[resource].findIndex((item) => item.id === Number(id));
      if (idx === -1) return res.status(404).send('Not found');
      db[resource][idx] = { ...db[resource][idx], ...req.body };
      return res.json(db[resource][idx]);
    }

    case 'DELETE':
      db[resource] = db[resource].filter((item) => item.id !== Number(id));
      return res.status(204).send();

    default:
      return res.status(405).send('Method Not Allowed');
  }
});

app.listen(port, () =>
  console.log(`Backend running at http://localhost:${port}`)
);
