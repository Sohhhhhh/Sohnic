ALTER TABLE "supplier_quotations" ALTER COLUMN "lead_time_days" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quotation_items" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "supplier_quotations" DROP COLUMN "total_price";--> statement-breakpoint
ALTER TABLE "purchase_requests" DROP COLUMN "request_date";