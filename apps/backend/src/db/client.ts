import { neon } from '@neondatabase/serverless';
import { type NeonHttpDatabase, drizzle as neonDrizzle } from 'drizzle-orm/neon-http';
import { type NodePgDatabase, drizzle as pgDrizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schemas from './schema';

let db: NodePgDatabase<typeof schemas> | NeonHttpDatabase<typeof schemas>;

if (process.env.NODE_ENV === 'production') {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false, // needed for Railway's SSL hostname mismatch
		},
	});
	db = pgDrizzle(pool, { schema: schemas });
} else {
	const sql = neon(process.env.DATABASE_URL!);
	db = neonDrizzle(sql, { schema: schemas });
}

export default db;
