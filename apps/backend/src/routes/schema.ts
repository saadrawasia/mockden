import {
  createSchemaRequest,
  deleteSchemaRequest,
  editSchemaRequest,
  getAllSchemasRequest,
  getSchemaByIdRequest,
} from '@backend/controllers/schemaController';
import express from 'express';

const schemaRouter = express.Router({ mergeParams: true });

schemaRouter.post('/', createSchemaRequest);

schemaRouter.get('/', getAllSchemasRequest);

schemaRouter.get('/:id', getSchemaByIdRequest);

schemaRouter.delete('/:id', deleteSchemaRequest);

schemaRouter.put('/:id', editSchemaRequest);

export default schemaRouter;
