import { join } from 'node:path';
/* eslint-disable unicorn/filename-case */
// drizzle.config.ts
import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: join(__dirname, '.env.production') });

if (!process.env.DATABASE_PUBLIC_URL) {
	throw new Error('DATABASE_URL is not defined in the environment');
}

console.log(process.env.NODE_ENV);
console.log(process.env.DATABASE_PUBLIC_URL);

export default defineConfig({
	schema: './apps/backend/src/db/schema.ts',
	out: './apps/backend/src/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_PUBLIC_URL,
	},
	strict: true,
});
