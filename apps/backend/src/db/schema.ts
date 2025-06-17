// apps/backend/src/db/schema.ts
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

const createdAt = timestamp('created_at').notNull().defaultNow();
const updatedAt = timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date());

// --- Users table ---
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  clerkUserId: varchar('clerk_user_id', { length: 255 }).unique().notNull(),
  planTier: varchar('plan_tier', { length: 50 }).default('free'),
  createdAt,
  updatedAt,
});

// --- Projects table ---
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  apiKey: uuid('api_key').defaultRandom().notNull(),
  description: text('description'),
  createdAt,
  updatedAt,
}, table => [index('idx_projects_user_id').on(table.userId)]);

// --- Schemas table ---
export const schemas = pgTable(
  'schemas',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id').references(() => projects.id, {
      onDelete: 'cascade',
    }),
    name: varchar('name', { length: 255 }).notNull(),
    fields: jsonb('fields').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    fakeData: boolean('fake_data').default(false),
    isActive: boolean('is_active').default(true),
    createdAt,
    updatedAt,
  },
  table => [index('idx_schemas_project_id').on(table.projectId)],
);

// --- Mock Data table ---
export const mockData = pgTable(
  'mock_data',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    schemaId: uuid('schema_id').references(() => schemas.id, {
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
