ALTER TABLE "invitations" RENAME COLUMN "sent_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;