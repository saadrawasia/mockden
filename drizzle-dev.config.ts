/* eslint-disable unicorn/filename-case */
// drizzle.config.ts
import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { join } from 'node:path';

dotenv.config({ path: join(__dirname, '.env.development') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment');
}

export default defineConfig({
  schema: './apps/backend/src/db/schema.ts',
  out: './apps/backend/src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
});
