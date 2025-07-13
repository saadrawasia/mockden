CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"subscriptionId" varchar(255) NOT NULL,
	"paddleCustomerId" varchar(255) NOT NULL,
	"productId" varchar(255) NOT NULL,
	"status" varchar NOT NULL,
	"startDate" date NOT NULL,
	"nextBillDate" date NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;