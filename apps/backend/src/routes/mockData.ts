import {
  createMockDataRequest,
  deleteMockDataRequest,
  getMockDataRequest,
  updateMockDataRequest,
} from '@backend/controllers/mockDataController';
import express from 'express';

const mockDataRouter = express.Router({ mergeParams: true });

mockDataRouter.get('/', getMockDataRequest);
mockDataRouter.get('/:primaryKeyValue', getMockDataRequest);
mockDataRouter.post('/', createMockDataRequest);
mockDataRouter.delete('/:primaryKeyValue', deleteMockDataRequest);
mockDataRouter.put('/:primaryKeyValue', updateMockDataRequest);
mockDataRouter.patch('/:primaryKeyValue', updateMockDataRequest);

export default mockDataRouter;
