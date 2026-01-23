CREATE TYPE "public"."branchType" AS ENUM('main', 'sub');--> statement-breakpoint
CREATE TYPE "public"."customerType" AS ENUM('individual', 'business', 'educational');--> statement-breakpoint
CREATE TYPE "public"."deliveryStatus" AS ENUM('in_transit', 'delivered');--> statement-breakpoint
CREATE TYPE "public"."inspectionStatus" AS ENUM('passed', 'failed', 'needs_rework');--> statement-breakpoint
CREATE TYPE "public"."manufacturingOrderStatus" AS ENUM('pending', 'approved', 'rejected', 'in_production', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."paymentMethod" AS ENUM('cash', 'credit_card', 'debit_card', 'bank_transfer', 'mobile_payment');--> statement-breakpoint
CREATE TYPE "public"."productCategory" AS ENUM('development_boards', 'sensor_modules', 'communication_modules', 'power_management', 'display_modules', 'motor_drivers', 'interface_conversion', 'audio_signal_processing');--> statement-breakpoint
CREATE TYPE "public"."purchaseOrderStatus" AS ENUM('pending', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."purchaseRequestStatus" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."refreshTokensRevocationReason" AS ENUM('rotation', 'reuse', 'logout', 'password_change', 'password_reset', 'deletion', 'security', 'other');--> statement-breakpoint
CREATE TYPE "public"."returnRequestStatus" AS ENUM('pending', 'approved', 'rejected', 'completed');--> statement-breakpoint
CREATE TYPE "public"."returnRequestType" AS ENUM('sellable_item', 'raw_material');--> statement-breakpoint
CREATE TYPE "public"."sellableItemType" AS ENUM('finished', 'resale');--> statement-breakpoint
CREATE TYPE "public"."transferRequestStatus" AS ENUM('pending', 'approved', 'rejected', 'in_transit', 'received', 'completed');--> statement-breakpoint
CREATE TYPE "public"."userRole" AS ENUM('super_admin', 'branch_admin', 'hr', 'storage_manager', 'accountant', 'inspector', 'cashier');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"type" "customerType" DEFAULT 'individual',
	"phone" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"item_id" uuid,
	"quantity" integer,
	"unit_price" integer,
	"total" integer,
	"is_returned" boolean,
	"quantity_returned" integer,
	"created_at" timestamp DEFAULT now(),
	"returned_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"branch_id" uuid,
	"customer_id" uuid,
	"cashier_id" uuid,
	"amount" double precision,
	"payment_method" "paymentMethod",
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"revocation_reason" "refreshTokensRevocationReason",
	"revoked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" "userRole" NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"password" varchar(255),
	"phone" varchar(50) NOT NULL,
	"date_of_birth" date,
	"is_active" boolean,
	"role_id" uuid,
	"branch_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"type" "branchType" DEFAULT 'sub',
	"city" varchar(255),
	"country" varchar(255),
	"manager_id" uuid,
	"is_active" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "warehouses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"branch_id" uuid,
	"address" varchar(500),
	"capacity" numeric,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bill_of_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid,
	"raw_material_id" uuid,
	"quantity_per_unit" integer
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"parent_category_id" uuid
);
--> statement-breakpoint
CREATE TABLE "raw_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"sku" varchar(255),
	"unit_of_measurement" varchar(50),
	"reorder_point" integer,
	"standard_price" double precision,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "raw_materials_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "sellable_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"sku" varchar(255),
	"category_id" uuid,
	"type" "sellableItemType",
	"sale_price" double precision,
	"reorder_point" integer,
	"description" text,
	"manufacturing_cost" double precision,
	"purchase_price" double precision,
	"model_number" varchar(255),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "sellable_items_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "quotation_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quotation_id" uuid,
	"item_id" uuid,
	"quantity" integer,
	"unit_price" numeric
);
--> statement-breakpoint
CREATE TABLE "raw_material_suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"material_id" uuid,
	"supplier_id" uuid,
	"unit_price" numeric,
	"lead_time_days" integer,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sellable_item_suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid,
	"supplier_id" uuid,
	"purchase_price" numeric,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "supplier_quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"purchase_request_id" uuid,
	"supplier_id" uuid,
	"total_price" numeric,
	"valid_until" date,
	"lead_time_days" integer,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"company_name" varchar(255),
	"lead_time_days" integer,
	"email" varchar(255),
	"phone" varchar(50),
	"country" varchar(255),
	"city" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "purchase_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"item_id" uuid,
	"quantity" integer,
	"unit_price" double precision,
	"total" double precision
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quotation_id" uuid,
	"status" "purchaseOrderStatus" DEFAULT 'pending',
	"order_date" date,
	"expected_delivery_date" date,
	"actual_delivery_date" date,
	"total_price" double precision,
	"supplier_id" uuid,
	"created_by_id" uuid,
	"approved_by_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "purchase_request_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"purchase_request_id" uuid,
	"material_id" uuid,
	"quantity_requested" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "purchase_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "purchaseRequestStatus" DEFAULT 'pending',
	"orderer_id" uuid,
	"reviewer_id" uuid,
	"branch_id" uuid,
	"request_date" timestamp DEFAULT now(),
	"review_date" timestamp,
	"rejection_reason" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "raw_materials_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"raw_material_id" uuid,
	"warehouse_id" uuid,
	"quantity" integer DEFAULT 0,
	"last_stocktake_date" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sellable_items_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sellable_item_id" uuid,
	"warehouse_id" uuid,
	"quantity" integer DEFAULT 0,
	"last_stocktake_date" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "manufacturers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" varchar(255),
	"city" varchar(255),
	"country" varchar(255),
	"address" varchar(500),
	"phone" varchar(50),
	"email" varchar(255),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "manufacturing_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturing_order_id" uuid,
	"quality_status" "inspectionStatus",
	"prod_start_date" date,
	"prod_completion_date" date,
	"quantity" integer
);
--> statement-breakpoint
CREATE TABLE "manufacturing_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"quantity" integer,
	"status" "manufacturingOrderStatus" DEFAULT 'pending',
	"created_by_id" uuid,
	"approved_by_id" uuid,
	"manufacturer_id" uuid,
	"order_date" timestamp DEFAULT now(),
	"approval_date" timestamp,
	"expected_completion_date" date,
	"actual_completion_date" date,
	"total_manufacturing_cost" numeric,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transfer_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transfer_request_id" uuid,
	"expected_delivery_date" date,
	"actual_delivery_date" date,
	"delivery_status" "deliveryStatus",
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transfer_request_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid,
	"transfer_request_id" uuid,
	"quantity_requested" integer,
	"quantity_approved" integer,
	"quantity_received" integer
);
--> statement-breakpoint
CREATE TABLE "transfer_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requested_by_branch" uuid,
	"requested_from_branch" uuid,
	"status" "transferRequestStatus" DEFAULT 'pending',
	"notes" text,
	"approved_by_id" uuid,
	"approved_at" date,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "items_inspection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturing_batch_id" uuid,
	"inspection_date" date,
	"inspection_result" "inspectionStatus",
	"notes" text,
	"defect_type" varchar(255),
	"quantity_ordered" integer,
	"quantity_received" integer,
	"quantity_rejected" integer,
	"item_id" uuid,
	"inspector_id" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "raw_materials_inspection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"inspection_date" date,
	"inspection_result" "inspectionStatus",
	"notes" text,
	"defect_type" varchar(255),
	"quantity_ordered" integer,
	"quantity_received" integer,
	"quantity_rejected" integer,
	"item_id" uuid,
	"inspector_id" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "finished_goods_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"return_request_id" uuid,
	"finished_goods_inspection_id" uuid,
	"manufacturer_id" uuid,
	"manufacturing_order_id" uuid,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "finished_goods_returns_return_request_id_unique" UNIQUE("return_request_id")
);
--> statement-breakpoint
CREATE TABLE "raw_material_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"return_request_id" uuid,
	"raw_material_inspection_id" uuid,
	"supplier_id" uuid,
	"purchase_order_id" uuid,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "raw_material_returns_return_request_id_unique" UNIQUE("return_request_id")
);
--> statement-breakpoint
CREATE TABLE "return_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_type" "returnRequestType",
	"reason" text,
	"quantity" integer,
	"status" "returnRequestStatus" DEFAULT 'pending',
	"inspector_id" uuid,
	"approved_by" uuid,
	"submission_date" timestamp DEFAULT now(),
	"review_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
