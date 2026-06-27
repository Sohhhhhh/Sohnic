ALTER TABLE "manufacturer_returns" ADD CONSTRAINT "manufacturer_returns_inspection_id_unique" UNIQUE("inspection_id");--> statement-breakpoint
ALTER TABLE "supplier_returns" ADD CONSTRAINT "supplier_returns_inspection_id_unique" UNIQUE("inspection_id");--> statement-breakpoint
ALTER TABLE "transfer_returns" ADD CONSTRAINT "transfer_returns_inspection_id_unique" UNIQUE("inspection_id");