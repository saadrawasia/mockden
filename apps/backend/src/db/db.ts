import sqlite3 from 'sqlite3';

sqlite3.verbose();

const DB_PATH = './apps/backend/src/db/mockden.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Failed to connect to the database:', err.message);
  } else {
    console.log(`✅ Connected to SQLite database at ${DB_PATH}`);
  }
});

// Enable foreign key support
db.run(`PRAGMA foreign_keys = ON;`);

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      schema_definition TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_id INTEGER NOT NULL,
      data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
    );
  `);
});

// Promisified versions
const dbAsync = {
  get: (sql: string, params: unknown[] = []) =>
    new Promise<unknown>((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),

  all: (sql: string, params: unknown[] = []) =>
    new Promise<unknown[]>((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  run: (sql: string, params: unknown[] = []) =>
    new Promise<{ lastID: number; changes: number }>((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    }),
  exec: (sql: string) =>
    new Promise<void>((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    }),
};

export default dbAsync;
