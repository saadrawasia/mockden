import { createSchemaRequest, getAllSchemasRequest, getSchemaByIdRequest } from '@backend/controllers/schemaController';
import express from 'express';

const schemaRouter = express.Router();

schemaRouter.post('/', createSchemaRequest);

schemaRouter.get('/', getAllSchemasRequest);

schemaRouter.get('/:id', getSchemaByIdRequest);

export default schemaRouter;
