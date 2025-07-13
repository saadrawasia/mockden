// apps/backend/src/db/schema.ts
import { relations } from 'drizzle-orm';
import { serial } from 'drizzle-orm/pg-core';
import { date } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { index, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

const createdAt = timestamp('createdAt').notNull().defaultNow();
const updatedAt = timestamp('updatedAt')
	.notNull()
	.defaultNow()
	.$onUpdate(() => new Date());

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
export const projects = pgTable(
	'projects',
	{
		id: serial('id').primaryKey(),
		userId: integer('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		name: varchar('name', { length: 255 }).notNull(),
		slug: varchar('slug', { length: 255 }).notNull(),
		apiKey: uuid('apiKey').defaultRandom().notNull(),
		description: text('description').notNull(),
		createdAt,
		updatedAt,
	},
	table => [index('idx_projects_user_id').on(table.userId)]
);

// --- Schemas table ---
export const schemas = pgTable(
	'schemas',
	{
		id: serial('id').primaryKey(),
		projectId: integer('projectId')
			.notNull()
			.references(() => projects.id, {
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
	table => [index('idx_schemas_project_id').on(table.projectId)]
);

// --- Mock Data table ---
export const mockData = pgTable(
	'mock_data',
	{
		id: serial('id').primaryKey(),
		schemaId: integer('schemaId')
			.notNull()
			.references(() => schemas.id, {
				onDelete: 'cascade',
			}),
		data: jsonb('data').notNull(),
		createdAt,
		updatedAt,
	},
	table => [
		index('idx_mock_data_schema_id').on(table.schemaId),
		index('idx_mock_data_jsonb').on(table.data),
	]
);

export const apiUsage = pgTable('api_usage', {
	id: serial('id').primaryKey(),
	userId: integer('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	date: date('date').notNull(),
	count: integer('count').notNull().default(0),
	createdAt,
	updatedAt,
});

export const subscriptions = pgTable('subscriptions', {
	id: serial('id').primaryKey(),
	userId: integer('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	subscriptionId: varchar('subscriptionId', { length: 255 }).notNull(),
	paddleCustomerId: varchar('paddleCustomerId', { length: 255 }).notNull(),
	productId: varchar('productId', { length: 255 }).notNull(),
	status: varchar('status').notNull(),
	startDate: date('startDate').notNull(),
	nextBillDate: date('nextBillDate'),
	createdAt,
	updatedAt,
});

export const userRelations = relations(users, ({ one, many }) => ({
	projects: many(projects),
	apiUsage: many(apiUsage),
	subscription: one(subscriptions, {
		fields: [users.id],
		references: [subscriptions.userId],
	}),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
	user: one(users, {
		fields: [projects.userId],
		references: [users.id],
	}),
	schemas: many(schemas),
}));

export const schemaRelations = relations(schemas, ({ one }) => ({
	project: one(projects, {
		fields: [schemas.projectId],
		references: [projects.id],
	}),
}));

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
	user: one(users, {
		fields: [subscriptions.userId],
		references: [users.id],
	}),
}));
