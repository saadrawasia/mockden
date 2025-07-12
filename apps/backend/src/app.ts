import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { authRouter, router } from './routes';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use('/', router);
app.use('/api', authRouter);

app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));
