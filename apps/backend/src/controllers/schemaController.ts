import type { Request, Response } from 'express';

import { getProjectById } from '@backend/services/projectService';
import {
	createSchema,
	deleteSchema,
	editSchema,
	getAllSchemas,
	getSchemaById,
} from '@backend/services/schemaService';
import { getAuthenticatedUser } from '@backend/services/userService';

export async function createSchemaRequest(req: Request, res: Response) {
	try {
		const user = await getAuthenticatedUser(req);
		if (!user) return res.status(401).json({ message: 'Unauthorized Request' });
		const { name, fields, fakeData, isActive } = req.body;
		const { projectId } = req.params;
		const project = await getProjectById(Number.parseInt(projectId), user.id);
		if (!project || 'message' in project.json) {
			return res.status(404).json({ message: 'Project Not Found.' });
		}
		const newSchema = await createSchema({
			name,
			fields,
			projectId: Number.parseInt(projectId),
			fakeData,
			isActive,
		});
		return res.status(newSchema.status).json(newSchema.json);
	} catch {
		return res.status(400).json({ message: 'Something went wrong.' });
	}
}
export async function editSchemaRequest(req: Request, res: Response) {
	try {
		const user = await getAuthenticatedUser(req);
		if (!user) return res.status(401).json({ message: 'Unauthorized Request' });
		const { name, fields, fakeData, isActive } = req.body;
		const { projectId, id } = req.params;
		const project = await getProjectById(Number.parseInt(projectId), user.id);
		if (!project || 'message' in project.json) {
			return res.status(404).json({ message: 'Project Not Found.' });
		}
		const updatedSchema = await editSchema({
			id: Number.parseInt(id),
			name,
			fields,
			projectId: Number.parseInt(projectId),
			fakeData,
			isActive,
		});
		return res.status(updatedSchema.status).json(updatedSchema.json);
	} catch {
		return res.status(400).json({ message: 'Something went wrong.' });
	}
}

export async function getAllSchemasRequest(req: Request, res: Response) {
	const user = await getAuthenticatedUser(req);
	if (!user) return res.status(401).json({ message: 'Unauthorized Request' });
	const { projectId } = req.params;
	const project = await getProjectById(Number.parseInt(projectId), user.id);
	if (!project || 'message' in project.json) {
		return res.status(404).json({ message: 'Project Not Found.' });
	}
	const schemas = await getAllSchemas(project.json.id);
	return res.status(schemas.status).json(schemas.json);
}

export async function getSchemaByIdRequest(req: Request, res: Response) {
	const user = await getAuthenticatedUser(req);
	if (!user) return res.status(401).json({ message: 'Unauthorized Request' });
	const { projectId, id } = req.params;
	const project = await getProjectById(Number.parseInt(projectId), user.id);
	if (!project || 'message' in project.json) {
		return res.status(404).json({ message: 'Project Not Found.' });
	}
	const schemas = await getSchemaById(Number.parseInt(id), project.json.id);
	return res.status(schemas.status).json(schemas.json);
}

export async function deleteSchemaRequest(req: Request, res: Response) {
	const user = await getAuthenticatedUser(req);
	if (!user) return res.status(401).json({ message: 'Unauthorized Request' });
	const { projectId, id } = req.params;
	const project = await getProjectById(Number.parseInt(projectId), user.id);
	if (!project || 'message' in project.json) {
		return res.status(404).json({ message: 'Project Not Found.' });
	}
	const schemas = await deleteSchema(Number.parseInt(id));
	return res.status(schemas.status).json(schemas.json);
}
