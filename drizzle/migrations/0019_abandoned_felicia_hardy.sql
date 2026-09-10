ALTER TYPE "public"."manufacturingOrderStatus" ADD VALUE 'materials_sent' BEFORE 'in_production';--> statement-breakpoint
CREATE TABLE "manufacturing_order_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturing_order_id" uuid NOT NULL,
	"material_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_cost" numeric(10, 2)
);
--> statement-breakpoint
ALTER TABLE "manufacturing_batches" ADD COLUMN "received_by_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturing_batches" ADD COLUMN "notes" varchar(1000);--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ADD COLUMN "notes" varchar(1000);--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ADD COLUMN "rejection_reason" varchar(1000);--> statement-breakpoint
ALTER TABLE "manufacturing_order_materials" ADD CONSTRAINT "manufacturing_order_materials_manufacturing_order_id_manufacturing_orders_id_fk" FOREIGN KEY ("manufacturing_order_id") REFERENCES "public"."manufacturing_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturing_order_materials" ADD CONSTRAINT "manufacturing_order_materials_material_id_items_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturing_batches" ADD CONSTRAINT "manufacturing_batches_received_by_id_users_id_fk" FOREIGN KEY ("received_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturers" ADD CONSTRAINT "manufacturers_email_unique" UNIQUE("email");