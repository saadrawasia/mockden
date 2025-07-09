import type { Response } from 'express';

export function slugify(str: string) {
	let result = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
	result = result.toLowerCase(); // convert string to lowercase
	result = result
		.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
		.replace(/\s+/g, '-') // replace spaces with hyphens
		.replace(/-+/g, '-'); // remove consecutive hyphens
	return result;
}

export function handleMissingSchema(res: Response, message: string) {
	return res.status(404).json({ success: false, message, code: 'NOT_FOUND' });
}

export function handleMissingData(res: Response) {
	return res.status(400).json({ success: false, message: 'Data is missing.' });
}

export function handleServerError(res: Response, e: unknown) {
	console.error('error', (e as Error).message);
	return res.status(500).json({ success: false, message: 'Something went wrong.' });
}
