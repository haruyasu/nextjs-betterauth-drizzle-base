ALTER TABLE "product_recommendations" ADD COLUMN "analysis_result" text;--> statement-breakpoint
ALTER TABLE "product_recommendations" ADD COLUMN "recommendation" text;--> statement-breakpoint
ALTER TABLE "product_recommendations" ADD COLUMN "review_data" text;--> statement-breakpoint
ALTER TABLE "product_recommendations" ADD COLUMN "success" boolean DEFAULT true;