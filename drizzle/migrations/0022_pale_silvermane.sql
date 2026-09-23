CREATE TYPE "public"."returnType" AS ENUM('supplier', 'manufacturer', 'transfer');--> statement-breakpoint
CREATE TABLE "returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "returnType" NOT NULL,
	"inspection_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"reason" text,
	"status" "returnRequestStatus" DEFAULT 'pending' NOT NULL,
	"inspector_id" uuid NOT NULL,
	"approved_by_id" uuid,
	"rejection_reason" text,
	"submission_date" timestamp DEFAULT now(),
	"review_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "returns_inspection_id_unique" UNIQUE("inspection_id")
);
--> statement-breakpoint
ALTER TABLE "manufacturer_returns" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "supplier_returns" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "transfer_returns" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "manufacturer_returns" CASCADE;--> statement-breakpoint
DROP TABLE "supplier_returns" CASCADE;--> statement-breakpoint
DROP TABLE "transfer_returns" CASCADE;--> statement-breakpoint
ALTER TABLE "inspections" DROP CONSTRAINT "inspections_item_order_unq";--> statement-breakpoint
ALTER TABLE "inspections" DROP CONSTRAINT "inspections_item_batch_unq";--> statement-breakpoint
ALTER TABLE "inspections" DROP CONSTRAINT "inspections_item_transfer_unq";--> statement-breakpoint
ALTER TABLE "inspections" DROP CONSTRAINT "inspections_branch_id_branches_id_fk";
--> statement-breakpoint
ALTER TABLE "inspections" ALTER COLUMN "inspection_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "inspections" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_inspection_id_inspections_id_fk" FOREIGN KEY ("inspection_id") REFERENCES "public"."inspections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_inspector_id_users_id_fk" FOREIGN KEY ("inspector_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_type_fk_chk" CHECK (
    (type='order' AND order_id IS NOT NULL AND manufacturing_batch_id IS NULL AND transfer_request_id IS NULL)
    OR (type='manufacturing_batch' AND order_id IS NULL AND manufacturing_batch_id IS NOT NULL AND transfer_request_id IS NULL)
    OR (type='transfer' AND order_id IS NULL AND manufacturing_batch_id IS NULL AND transfer_request_id IS NOT NULL)
  );--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_qty_chk" CHECK (quantity_received >= 0 
  AND quantity_rejected >= 0 
  AND quantity_rejected <= quantity_received
  AND quantity_ordered >= quantity_received);--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_defect_chk" CHECK ((inspection_result='passed' AND defect_type IS NULL) 
  OR (inspection_result IN ('failed','needs_rework') AND defect_type IS NOT NULL));