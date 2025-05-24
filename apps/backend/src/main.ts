import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './db/db';

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

// interface DataItem extends Record<string, unknown> {
//   id: number;
// }

// interface DB {
//   [resource: string]: DataItem[];
// }

// const db: DB = {
//   posts: [{ id: 1, title: 'Hello World', body: 'Welcome to the mock API!' }],
// };

type Record = {
  id: number;
  resource_id: number;
  data: number;
};

app.post('/resource', async (req: Request, res: Response) => {
  const { resource } = req.body;
  if (!resource)
    return res.status(400).json({ message: 'Missing resource name' });
  const existingResource = await db.get(
    'Select * from resources where name = ?',
    [resource]
  );
  if (existingResource) {
    return res
      .status(400)
      .json({ message: 'Resource with this name already exist' });
  }

  const { lastID } = await db.run(
    'INSERT INTO resources(name, schema_definition) VALUES(?, ?)',
    [resource, '']
  );

  return res
    .status(201)
    .json({ id: lastID, name: resource, schema_definition: '' });
});

app.get('/resources', async (req: Request, res: Response) => {
  try {
    const query = 'Select * from resources';
    const resources = await db.all(query);
    return res.json(resources);
  } catch (err) {
    console.error('DB error:', err);
    return res.json({ message: 'Resources not found' });
  }
});

app.all('/:resourceId/:id?', async (req: Request, res: Response) => {
  const { resource } = req.params;
  const method = req.method;

  switch (method) {
    case 'GET':
      try {
        const query = 'Select * from records where resource_id = ?';
        const records = (await db.all(query, [resource])) as Record[];
        const data = records.map((record) => record.data);
        return res.json(data);
      } catch (err) {
        console.error('DB error:', err);
        return res.json({ message: 'Resources not found' });
      }

    // case 'POST': {
    //   const newItem: DataItem = { id: Date.now(), ...req.body };
    //   db[resource].push(newItem);
    //   return res.status(201).json(newItem);
    // }

    // case 'PUT':
    // case 'PATCH': {
    //   const idx = db[resource].findIndex((item) => item.id === Number(id));
    //   if (idx === -1) return res.status(404).send('Not found');
    //   db[resource][idx] = { ...db[resource][idx], ...req.body };
    //   return res.json(db[resource][idx]);
    // }

    // case 'DELETE':
    //   db[resource] = db[resource].filter((item) => item.id !== Number(id));
    //   return res.status(204).send();

    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
});

app.listen(port, () =>
  console.log(`Backend running at http://localhost:${port}`)
);
