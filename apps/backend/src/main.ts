import app from './app';
import router from './router';

const port = 4000;

app.use('/', router);

// app.all('/:schemaId/:id?', async (req: Request, res: Response) => {
//   const { schema } = req.params;
//   const method = req.method;

//   switch (method) {
//     case 'GET':
//       try {
//         const query = 'Select * from mock_data where schema_id = ?';
//         const mockData = (await db.all(query, [schema])) as Record[];
//         const data = mockData.map(mockData => mockData.data);
//         return res.json(data);
//       }
//       catch (err) {
//         console.error('DB error:', err);
//         return res.json({ message: 'Mock data not found' });
//       }

//       // case 'POST': {
//       //   const newItem: DataItem = { id: Date.now(), ...req.body };
//       //   db[schema].push(newItem);
//       //   return res.status(201).json(newItem);
//       // }

//       // case 'PUT':
//       // case 'PATCH': {
//       //   const idx = db[schema].findIndex((item) => item.id === Number(id));
//       //   if (idx === -1) return res.status(404).send('Not found');
//       //   db[schema][idx] = { ...db[schema][idx], ...req.body };
//       //   return res.json(db[schema][idx]);
//       // }

//       // case 'DELETE':
//       //   db[schema] = db[schema].filter((item) => item.id !== Number(id));
//       //   return res.status(204).send();

//     default:
//       return res.status(405).json({ message: 'Method Not Allowed' });
//   }
// });

app.listen(port, () =>
  console.log(`Backend running at http://localhost:${port}`));
