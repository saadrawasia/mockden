import express from 'express';

import { createMockDataRequest, deleteMockDataRequest, getMockDataRequest } from './controllers/mockDataController';
import { createSchemaRequest, getAllSchemasRequest, getSchemaByIdRequest } from './controllers/schemaController';

const router = express.Router();

router.post('/schema', createSchemaRequest);

router.get('/schemas', getAllSchemasRequest);

router.get('/schema/:id', getSchemaByIdRequest);

router.get('/api/:schemaId', getMockDataRequest);
router.post('/api/:schemaId', createMockDataRequest);
router.delete('/api/:schemaId/:primaryKeyValue', deleteMockDataRequest);

export default router;
