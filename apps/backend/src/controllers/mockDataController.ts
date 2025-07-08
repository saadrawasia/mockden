import type { RequestWithProject } from '@shared/lib/types';
import type { Response } from 'express';

import {
	createMockData,
	deleteMockData,
	getMockData,
	getMockDataByPrimaryKey,
	updateMockData,
} from '@backend/services/mockDataService';
import { InternalServerError, NotFoundError, ValidationError } from '../utils/errors';
import { handleMissingData, handleMissingSchema, handleServerError } from '../utils/helpers';

export async function getMockDataRequest(req: RequestWithProject, res: Response) {
	const { schema } = req;
	if (!schema || schema.id === undefined)
		return handleMissingSchema(res, 'Project or schema not found.');

	const limit = Math.min(Number(req.query.limit) || 10, 100);
	const offset = Number(req.query.offset) || 0;
	const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;
	const order: 'asc' | 'desc' | undefined =
		typeof req.query.order === 'string' && ['asc', 'desc'].includes(req.query.order)
			? (req.query.order as 'asc' | 'desc')
			: 'asc';

	try {
		const allData = await getMockData(schema.id, { sort, order }); // get all data for total count
		const total = Array.isArray(allData) ? allData.length : 0;

		// Paginate in-memory
		const paginatedData = allData.slice(offset, offset + limit);

		const hasMore = offset + limit < total;

		return res.status(200).json({
			success: true,
			data: paginatedData,
			pagination: {
				total,
				limit,
				offset,
				hasMore,
			},
		});
	} catch (err) {
		if (err instanceof InternalServerError) {
			return res.status(err.status).json({ success: false, message: err.message });
		}
		return handleServerError(res, err);
	}
}

export async function createMockDataRequest(req: RequestWithProject, res: Response) {
	const { user, schema, project } = req;
	if (!schema || schema.id === undefined || !project || project.id === undefined)
		return handleMissingSchema(res, 'Project or schema not found.');

	const data = req.body;
	if (!data) return handleMissingData(res);

	try {
		const planTier: 'free' | 'pro' = user?.planTier === 'pro' ? 'pro' : 'free';
		const mockData = await createMockData(schema.id, data, planTier, project.id);
		return res
			.status(201)
			.json({ success: true, data: mockData, message: 'Record created successfully' });
	} catch (err) {
		if (err instanceof ValidationError) {
			return res
				.status(err.status)
				.json({ success: false, errors: JSON.parse(err.message), message: 'Validation Failed' });
		}
		if (err instanceof NotFoundError || err instanceof InternalServerError) {
			return res.status(err.status).json({ success: false, message: err.message });
		}
		return handleServerError(res, err);
	}
}

export async function updateMockDataRequest(req: RequestWithProject, res: Response) {
	const { schema, project } = req;
	if (!schema || schema.id === undefined || !project || project.id === undefined)
		return handleMissingSchema(res, 'Project or schema not found.');

	const { primaryKeyValue } = req.params;
	const data = req.body;
	if (!data) return handleMissingData(res);

	try {
		const mockData = await updateMockData(schema.id, primaryKeyValue, data, project.id);
		return res.status(mockData.status).json(mockData.json);
	} catch (e) {
		return handleServerError(res, e);
	}
}

export async function deleteMockDataRequest(req: RequestWithProject, res: Response) {
	const { schema, project } = req;
	if (!schema || schema.id === undefined || !project || project.id === undefined)
		return handleMissingSchema(res, 'Project or schema not found.');

	const { primaryKeyValue } = req.params;
	try {
		const mockData = await deleteMockData(schema.id, primaryKeyValue, project.id);
		return res.status(mockData.status).json(mockData.json);
	} catch (e) {
		return handleServerError(res, e);
	}
}

export async function getMockDataByPrimaryKeyRequest(req: RequestWithProject, res: Response) {
	const { schema, project } = req;
	if (!schema || schema.id === undefined || !project || project.id === undefined)
		return handleMissingSchema(res, 'Project or schema not found.');

	const { primaryKeyValue } = req.params;
	try {
		const data = await getMockDataByPrimaryKey(schema.id, primaryKeyValue, project.id);
		return res.status(200).json({
			success: true,
			data,
		});
	} catch (err) {
		if (err instanceof NotFoundError) {
			return res
				.status(err.status)
				.json({ success: false, message: err.message, code: 'NOT_FOUND' });
		}
		return handleServerError(res, err);
	}
}
