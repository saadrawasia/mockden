import express from 'express';

import { createMockDataRequest, deleteMockDataRequest, getMockDataRequest, updateMockDataRequest } from './controllers/mockDataController';
import { createSchemaRequest, getAllSchemasRequest, getSchemaByIdRequest } from './controllers/schemaController';

const router = express.Router();

router.post('/schema', createSchemaRequest);

router.get('/schemas', getAllSchemasRequest);

router.get('/schema/:id', getSchemaByIdRequest);

router.get('/api/:schemaId', getMockDataRequest);
router.post('/api/:schemaId', createMockDataRequest);
router.delete('/api/:schemaId/:primaryKeyValue', deleteMockDataRequest);
router.put('/api/:schemaId/:primaryKeyValue', updateMockDataRequest);
router.patch('/api/:schemaId/:primaryKeyValue', updateMockDataRequest);

export default router;
