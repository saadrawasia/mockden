import type { RequestWithProject } from '@shared/lib/types';
import type { Response } from 'express';

import {
	createMockData,
	deleteMockData,
	getMockData,
	getMockDataByPrimaryKey,
	updateMockData,
} from '@backend/services/mockDataService';

function handleMissingSchema(res: Response) {
	return res.status(404).json({ message: 'Project or schema not found.' });
}

function handleMissingData(res: Response) {
	return res.status(400).json({ message: 'Data is missing.' });
}

function handleServerError(res: Response, e: unknown) {
	console.error('error', (e as Error).message);
	return res.status(500).json({ message: 'Something went wrong.' });
}

export async function getMockDataRequest(req: RequestWithProject, res: Response) {
	const { schema } = req;
	if (!schema || schema.id === undefined) return handleMissingSchema(res);

	try {
		const mockData = await getMockData(schema.id);
		return res.status(mockData.status).json(mockData.json);
	} catch (e) {
		return handleServerError(res, e);
	}
}

export async function createMockDataRequest(req: RequestWithProject, res: Response) {
	const { user, schema, project } = req;
	if (!schema || schema.id === undefined || !project || project.id === undefined)
		return handleMissingSchema(res);

	const data = req.body;
	if (!data) return handleMissingData(res);

	try {
		const planTier: 'free' | 'pro' = user?.planTier === 'pro' ? 'pro' : 'free';
		const mockData = await createMockData(schema.id, data, planTier, project.id);
		return res.status(mockData.status).json(mockData.json);
	} catch (e) {
		return handleServerError(res, e);
	}
}

export async function updateMockDataRequest(req: RequestWithProject, res: Response) {
	const { schema, project } = req;
	if (!schema || schema.id === undefined || !project || project.id === undefined)
		return handleMissingSchema(res);

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
		return handleMissingSchema(res);

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
		return handleMissingSchema(res);

	const { primaryKeyValue } = req.params;
	try {
		const mockData = await getMockDataByPrimaryKey(schema.id, primaryKeyValue, project.id);
		return res.status(mockData.status).json(mockData.json);
	} catch (e) {
		return handleServerError(res, e);
	}
}
