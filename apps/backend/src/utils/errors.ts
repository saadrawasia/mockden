export class NotFoundError extends Error {
	status = 404;

	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
}

export class ValidationError extends Error {
	status = 422;
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
	}
}

export class InternalServerError extends Error {
	status = 500;
	constructor(message: string) {
		super(message);
		this.name = 'InternalServerError';
	}
}
