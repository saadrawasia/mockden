import {
	createMockDataRequest,
	deleteMockDataRequest,
	getMockDataByPrimaryKeyRequest,
	getMockDataRequest,
	updateMockDataRequest,
} from '@backend/controllers/mockDataController';
import express from 'express';

const mockDataRouter = express.Router({ mergeParams: true });

mockDataRouter.get('/', getMockDataRequest);
mockDataRouter.get('/:primaryKeyValue', getMockDataByPrimaryKeyRequest);
mockDataRouter.post('/', createMockDataRequest);
mockDataRouter.delete('/:primaryKeyValue', deleteMockDataRequest);
mockDataRouter.put('/:primaryKeyValue', updateMockDataRequest);
mockDataRouter.patch('/:primaryKeyValue', updateMockDataRequest);

export default mockDataRouter;
