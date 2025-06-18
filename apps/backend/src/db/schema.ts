// apps/backend/src/db/schema.ts
import { serial } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const createdAt = timestamp('createdAt').notNull().defaultNow();
const updatedAt = timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date());

// --- Users table ---
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('firstName', { length: 255 }).notNull(),
  lastName: varchar('lastName', { length: 255 }).notNull(),
  clerkUserId: varchar('clerkUserId', { length: 255 }).unique().notNull(),
  planTier: varchar('planTier', { length: 50 }).default('free'),
  createdAt,
  updatedAt,
});

// --- Projects table ---
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  apiKey: uuid('apiKey').defaultRandom().notNull(),
  description: text('description').notNull(),
  createdAt,
  updatedAt,
}, table => [index('idx_projects_user_id').on(table.userId)]);

// --- Schemas table ---
export const schemas = pgTable(
  'schemas',
  {
    id: serial('id').primaryKey(),
    projectId: integer('projectId').notNull().references(() => projects.id, {
      onDelete: 'cascade',
    }),
    name: varchar('name', { length: 255 }).notNull(),
    fields: jsonb('fields').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    fakeData: boolean('fakeData').notNull().default(false),
    isActive: boolean('isActive').notNull().default(true),
    createdAt,
    updatedAt,
  },
  table => [index('idx_schemas_project_id').on(table.projectId)],
);

// --- Mock Data table ---
export const mockData = pgTable(
  'mock_data',
  {
    id: serial('id').primaryKey(),
    schemaId: integer('schemaId').notNull().references(() => schemas.id, {
      onDelete: 'cascade',
    }),
    data: jsonb('data').notNull(),
    createdAt,
    updatedAt,
  },
  table => [
    index('idx_mock_data_schema_id').on(table.schemaId),
    index('idx_mock_data_jsonb').on(table.data),
  ],
);
