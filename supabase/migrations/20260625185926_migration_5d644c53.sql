-- Make customer_id nullable for B2B/commercial shipments
ALTER TABLE shipments ALTER COLUMN customer_id DROP NOT NULL;

COMMENT ON COLUMN shipments.customer_id IS 'Optional customer profile ID - null for B2B/commercial shipments without portal access';