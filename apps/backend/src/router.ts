import express from 'express';

import { createMockDataRequest, deleteMockDataRequest, getMockDataRequest, updateMockDataRequest } from './controllers/mockDataController';

const router = express.Router();

router.get('/api/:schemaId', getMockDataRequest);
router.post('/api/:schemaId', createMockDataRequest);
router.delete('/api/:schemaId/:primaryKeyValue', deleteMockDataRequest);
router.put('/api/:schemaId/:primaryKeyValue', updateMockDataRequest);
router.patch('/api/:schemaId/:primaryKeyValue', updateMockDataRequest);

export default router;
