ALTER TABLE "quotation_items" ALTER COLUMN "quotation_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quotation_items" ALTER COLUMN "item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quotation_items" ALTER COLUMN "quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quotation_items" ALTER COLUMN "unit_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "raw_material_suppliers" ALTER COLUMN "material_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "raw_material_suppliers" ALTER COLUMN "supplier_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "raw_material_suppliers" ALTER COLUMN "unit_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "raw_material_suppliers" ALTER COLUMN "is_primary" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sellable_item_suppliers" ALTER COLUMN "item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sellable_item_suppliers" ALTER COLUMN "supplier_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sellable_item_suppliers" ALTER COLUMN "purchase_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sellable_item_suppliers" ALTER COLUMN "is_primary" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_quotations" ALTER COLUMN "purchase_request_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_quotations" ALTER COLUMN "supplier_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_quotations" ALTER COLUMN "total_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_quotations" ALTER COLUMN "valid_until" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_quotations" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "suppliers" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "suppliers" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_quotation_id_supplier_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."supplier_quotations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_item_id_raw_materials_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."raw_materials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_material_suppliers" ADD CONSTRAINT "raw_material_suppliers_material_id_raw_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."raw_materials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_material_suppliers" ADD CONSTRAINT "raw_material_suppliers_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sellable_item_suppliers" ADD CONSTRAINT "sellable_item_suppliers_item_id_sellable_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."sellable_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sellable_item_suppliers" ADD CONSTRAINT "sellable_item_suppliers_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_quotations" ADD CONSTRAINT "supplier_quotations_purchase_request_id_purchase_requests_id_fk" FOREIGN KEY ("purchase_request_id") REFERENCES "public"."purchase_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_quotations" ADD CONSTRAINT "supplier_quotations_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_material_suppliers" ADD CONSTRAINT "raw_material_suppliers_material_id_supplier_id_unique" UNIQUE("material_id","supplier_id");--> statement-breakpoint
ALTER TABLE "sellable_item_suppliers" ADD CONSTRAINT "sellable_item_suppliers_item_id_supplier_id_unique" UNIQUE("item_id","supplier_id");--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_email_unique" UNIQUE("email");