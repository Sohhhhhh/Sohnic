ALTER TABLE "transfer_orders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "transfer_orders" CASCADE;--> statement-breakpoint
ALTER TABLE "inspections" RENAME COLUMN "transfer_order_id" TO "transfer_request_id";--> statement-breakpoint
ALTER TABLE "transfer_returns" RENAME COLUMN "transfer_order_id" TO "transfer_request_id";--> statement-breakpoint
ALTER TABLE "inspections" DROP CONSTRAINT "inspections_item_transfer_unq";--> statement-breakpoint
ALTER TABLE "transfer_requests" ADD COLUMN "created_by_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "transfer_requests" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "transfer_requests" ADD COLUMN "dispatched_by_id" uuid;--> statement-breakpoint
ALTER TABLE "transfer_requests" ADD COLUMN "dispatched_at" timestamp;--> statement-breakpoint
ALTER TABLE "transfer_requests" ADD COLUMN "delivered_at" timestamp;--> statement-breakpoint
ALTER TABLE "transfer_requests" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "transfer_requests" ADD CONSTRAINT "transfer_requests_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfer_requests" ADD CONSTRAINT "transfer_requests_dispatched_by_id_users_id_fk" FOREIGN KEY ("dispatched_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_transfer_request_id_transfer_requests_id_fk" FOREIGN KEY ("transfer_request_id") REFERENCES "public"."transfer_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfer_returns" ADD CONSTRAINT "transfer_returns_transfer_request_id_transfer_requests_id_fk" FOREIGN KEY ("transfer_request_id") REFERENCES "public"."transfer_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_item_transfer_unq" UNIQUE("item_id","transfer_request_id");--> statement-breakpoint
DROP TYPE "public"."deliveryStatus";