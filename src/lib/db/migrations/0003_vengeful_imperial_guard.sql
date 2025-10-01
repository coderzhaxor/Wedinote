DROP TABLE "invitations" CASCADE;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "isInvited" boolean DEFAULT false NOT NULL;