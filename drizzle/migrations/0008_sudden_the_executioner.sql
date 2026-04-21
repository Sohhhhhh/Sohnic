ALTER TABLE "item_suppliers" ADD COLUMN "item_type" "itemsType" NOT NULL;
ALTER TABLE "suppliers" DROP COLUMN "order_date";--> statement-breakpoint