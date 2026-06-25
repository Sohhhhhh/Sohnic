ALTER TABLE "inspections" ADD CONSTRAINT "inspections_item_order_unq" UNIQUE("item_id","order_id");--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_item_batch_unq" UNIQUE("item_id","manufacturing_batch_id");--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_item_transfer_unq" UNIQUE("item_id","transfer_order_id");