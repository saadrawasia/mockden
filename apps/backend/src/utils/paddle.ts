import { Environment, Paddle } from '@paddle/paddle-node-sdk';

export const paddle = new Paddle(process.env.VITE_PADDLE_SECRET_TOKEN || '', {
	environment: Environment.sandbox,
});
