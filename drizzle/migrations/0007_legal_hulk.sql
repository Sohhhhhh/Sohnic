CREATE TYPE "public"."inspectionType" AS ENUM('order', 'manufacturing_batch', 'transfer');--> statement-breakpoint
CREATE TYPE "public"."itemsType" AS ENUM('sellable_item', 'raw_material');--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"sku" varchar(255) NOT NULL,
	"type" "itemsType" NOT NULL,
	"reorder_point" integer,
	"created_at" timestamp DEFAULT now(),
	"category_id" uuid,
	"sellable_type" "sellableItemType",
	"sale_price" numeric(10, 2),
	"manufacturing_cost" numeric(10, 2),
	"purchase_price" numeric(10, 2),
	"model_number" varchar(255),
	"description" text,
	"unit_of_measurement" varchar(50),
	"standard_price" numeric(10, 2),
	CONSTRAINT "items_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "item_suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"lead_time_days" integer,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "item_suppliers_item_id_supplier_id_unique" UNIQUE("item_id","supplier_id")
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"last_stocktake_date" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "inventory_item_id_warehouse_id_unique" UNIQUE("item_id","warehouse_id")
);
--> statement-breakpoint
CREATE TABLE "inspections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"manufacturing_batch_id" uuid,
	"transfer_order_id" uuid,
	"type" "inspectionType" NOT NULL,
	"inspection_date" date NOT NULL,
	"inspection_result" "inspectionStatus" NOT NULL,
	"notes" text,
	"defect_type" varchar(255),
	"quantity_ordered" integer NOT NULL,
	"quantity_received" integer NOT NULL,
	"quantity_rejected" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"inspector_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manufacturer_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer_id" uuid NOT NULL,
	"manufacturing_order_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"reason" text,
	"status" "returnRequestStatus" DEFAULT 'pending' NOT NULL,
	"inspector_id" uuid,
	"approved_by" uuid,
	"inspection_id" uuid,
	"submission_date" timestamp DEFAULT now(),
	"review_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "supplier_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" uuid NOT NULL,
	"purchase_order_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"reason" text,
	"status" "returnRequestStatus" DEFAULT 'pending' NOT NULL,
	"inspector_id" uuid,
	"approved_by" uuid,
	"inspection_id" uuid,
	"submission_date" timestamp DEFAULT now(),
	"review_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "raw_materials" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sellable_items" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "raw_material_suppliers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sellable_item_suppliers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "raw_materials_inventory" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sellable_items_inventory" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "items_inspection" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "raw_materials_inspection" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "finished_goods_returns" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "raw_material_returns" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "return_requests" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "raw_materials" CASCADE;--> statement-breakpoint
DROP TABLE "sellable_items" CASCADE;--> statement-breakpoint
DROP TABLE "raw_material_suppliers" CASCADE;--> statement-breakpoint
DROP TABLE "sellable_item_suppliers" CASCADE;--> statement-breakpoint
DROP TABLE "raw_materials_inventory" CASCADE;--> statement-breakpoint
DROP TABLE "sellable_items_inventory" CASCADE;--> statement-breakpoint
DROP TABLE "items_inspection" CASCADE;--> statement-breakpoint
DROP TABLE "raw_materials_inspection" CASCADE;--> statement-breakpoint
DROP TABLE "finished_goods_returns" CASCADE;--> statement-breakpoint
DROP TABLE "raw_material_returns" CASCADE;--> statement-breakpoint
DROP TABLE "return_requests" CASCADE;--> statement-breakpoint
ALTER TABLE "quotation_items" DROP CONSTRAINT IF EXISTS "quotation_items_quotation_id_supplier_quotations_id_fk";
--> statement-breakpoint
ALTER TABLE "quotation_items" DROP CONSTRAINT IF EXISTS "quotation_items_item_id_raw_materials_id_fk";
--> statement-breakpoint
ALTER TABLE "supplier_quotations" DROP CONSTRAINT IF EXISTS "supplier_quotations_purchase_request_id_purchase_requests_id_fk";
--> statement-breakpoint
ALTER TABLE "supplier_quotations" DROP CONSTRAINT IF EXISTS "supplier_quotations_supplier_id_suppliers_id_fk";
--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "first_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "last_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "order_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "unit_price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "unit_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "is_returned" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "is_returned" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "quantity_returned" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "quantity_returned" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "branch_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "customer_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "cashier_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "amount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "payment_method" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "branches" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "branches" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "branches" ALTER COLUMN "city" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "branches" ALTER COLUMN "country" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "branches" ALTER COLUMN "manager_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "branches" ALTER COLUMN "is_active" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "branches" ALTER COLUMN "is_active" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "warehouses" ALTER COLUMN "branch_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "warehouses" ALTER COLUMN "address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "warehouses" ALTER COLUMN "capacity" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "warehouses" ALTER COLUMN "capacity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "warehouses" ALTER COLUMN "is_active" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bill_of_materials" ALTER COLUMN "item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bill_of_materials" ALTER COLUMN "quantity_per_unit" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quotation_items" ALTER COLUMN "unit_price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "supplier_quotations" ALTER COLUMN "total_price" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "purchase_order_items" ALTER COLUMN "order_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ALTER COLUMN "item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ALTER COLUMN "quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ALTER COLUMN "unit_price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "purchase_order_items" ALTER COLUMN "unit_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_orders" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_orders" ALTER COLUMN "total_price" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "purchase_orders" ALTER COLUMN "supplier_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_orders" ALTER COLUMN "created_by_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_request_items" ALTER COLUMN "purchase_request_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_request_items" ALTER COLUMN "quantity_requested" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_requests" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_requests" ALTER COLUMN "orderer_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_requests" ALTER COLUMN "branch_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturers" ALTER COLUMN "company_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturers" ALTER COLUMN "city" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturers" ALTER COLUMN "country" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturers" ALTER COLUMN "address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturers" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturers" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturers" ALTER COLUMN "is_active" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturing_batches" ALTER COLUMN "manufacturing_order_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ALTER COLUMN "quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ALTER COLUMN "created_by_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ALTER COLUMN "manufacturer_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ALTER COLUMN "total_manufacturing_cost" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "transfer_orders" ALTER COLUMN "transfer_request_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transfer_orders" ALTER COLUMN "delivery_status" SET DEFAULT 'in_transit';--> statement-breakpoint
ALTER TABLE "transfer_orders" ALTER COLUMN "delivery_status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transfer_request_items" ALTER COLUMN "item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transfer_request_items" ALTER COLUMN "transfer_request_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transfer_request_items" ALTER COLUMN "quantity_requested" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transfer_requests" ALTER COLUMN "requested_by_branch" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transfer_requests" ALTER COLUMN "requested_from_branch" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transfer_requests" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bill_of_materials" ADD COLUMN "component_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_request_items" ADD COLUMN "item_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturing_batches" ADD COLUMN "quantity_produced" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "manufacturing_batches" ADD COLUMN "production_date" date;--> statement-breakpoint
ALTER TABLE "manufacturing_batches" ADD COLUMN "inspection_status" "inspectionStatus";--> statement-breakpoint
ALTER TABLE "manufacturing_batches" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "total";--> statement-breakpoint
ALTER TABLE "bill_of_materials" DROP COLUMN "raw_material_id";--> statement-breakpoint
ALTER TABLE "purchase_order_items" DROP COLUMN "total";--> statement-breakpoint
ALTER TABLE "purchase_request_items" DROP COLUMN "material_id";--> statement-breakpoint
ALTER TABLE "manufacturing_batches" DROP COLUMN "quality_status";--> statement-breakpoint
ALTER TABLE "manufacturing_batches" DROP COLUMN "prod_start_date";--> statement-breakpoint
ALTER TABLE "manufacturing_batches" DROP COLUMN "prod_completion_date";--> statement-breakpoint
ALTER TABLE "manufacturing_batches" DROP COLUMN "quantity";--> statement-breakpoint
ALTER TABLE "manufacturing_orders" DROP COLUMN "order_date";--> statement-breakpoint
DROP TYPE "public"."returnRequestType";