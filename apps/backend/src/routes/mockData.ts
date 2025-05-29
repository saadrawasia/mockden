import { createMockDataRequest, deleteMockDataRequest, getMockDataRequest, updateMockDataRequest } from '@backend/controllers/mockDataController';
import express from 'express';

const mockDataRouter = express.Router();

mockDataRouter.get('/:schemaId', getMockDataRequest);
mockDataRouter.post('/:schemaId', createMockDataRequest);
mockDataRouter.delete('/:schemaId/:primaryKeyValue', deleteMockDataRequest);
mockDataRouter.put('/:schemaId/:primaryKeyValue', updateMockDataRequest);
mockDataRouter.patch('/:schemaId/:primaryKeyValue', updateMockDataRequest);

export default mockDataRouter;
