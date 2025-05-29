import { createSchemaRequest, deleteSchemaRequest, getAllSchemasRequest, getSchemaByIdRequest } from '@backend/controllers/schemaController';
import express from 'express';

const schemaRouter = express.Router();

schemaRouter.post('/', createSchemaRequest);

schemaRouter.get('/', getAllSchemasRequest);

schemaRouter.get('/:id', getSchemaByIdRequest);

schemaRouter.delete('/:id', deleteSchemaRequest);

export default schemaRouter;
