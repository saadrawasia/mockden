CREATE TABLE "mock_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"schemaId" integer NOT NULL,
	"data" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"apiKey" uuid DEFAULT gen_random_uuid() NOT NULL,
	"description" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schemas" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"fields" jsonb NOT NULL,
	"slug" varchar(255) NOT NULL,
	"fakeData" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	"clerkUserId" varchar(255) NOT NULL,
	"planTier" varchar(50) DEFAULT 'free',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_clerkUserId_unique" UNIQUE("clerkUserId")
);
--> statement-breakpoint
ALTER TABLE "mock_data" ADD CONSTRAINT "mock_data_schemaId_schemas_id_fk" FOREIGN KEY ("schemaId") REFERENCES "public"."schemas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schemas" ADD CONSTRAINT "schemas_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_mock_data_schema_id" ON "mock_data" USING btree ("schemaId");--> statement-breakpoint
CREATE INDEX "idx_mock_data_jsonb" ON "mock_data" USING btree ("data");--> statement-breakpoint
CREATE INDEX "idx_projects_user_id" ON "projects" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_schemas_project_id" ON "schemas" USING btree ("projectId");