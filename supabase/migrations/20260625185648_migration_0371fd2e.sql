-- Add missing enterprise logistics columns to shipments table
ALTER TABLE shipments 
  ADD COLUMN IF NOT EXISTS sender_name text,
  ADD COLUMN IF NOT EXISTS sender_address text,
  ADD COLUMN IF NOT EXISTS sender_phone text,
  ADD COLUMN IF NOT EXISTS sender_email text,
  ADD COLUMN IF NOT EXISTS receiver_name text,
  ADD COLUMN IF NOT EXISTS receiver_address text,
  ADD COLUMN IF NOT EXISTS receiver_phone text,
  ADD COLUMN IF NOT EXISTS receiver_email text,
  ADD COLUMN IF NOT EXISTS package_dimensions text,
  ADD COLUMN IF NOT EXISTS shipping_cost numeric(10,2),
  ADD COLUMN IF NOT EXISTS carrier text,
  ADD COLUMN IF NOT EXISTS driver_name text,
  ADD COLUMN IF NOT EXISTS driver_phone text,
  ADD COLUMN IF NOT EXISTS origin_city text,
  ADD COLUMN IF NOT EXISTS origin_country text,
  ADD COLUMN IF NOT EXISTS destination_city text,
  ADD COLUMN IF NOT EXISTS destination_country text;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_shipments_sender ON shipments(sender_name);
CREATE INDEX IF NOT EXISTS idx_shipments_receiver ON shipments(receiver_name);
CREATE INDEX IF NOT EXISTS idx_shipments_carrier ON shipments(carrier);

COMMENT ON COLUMN shipments.sender_name IS 'Name of the sender/shipper';
COMMENT ON COLUMN shipments.receiver_name IS 'Name of the receiver/consignee';
COMMENT ON COLUMN shipments.shipping_cost IS 'Total cost of shipment';
COMMENT ON COLUMN shipments.carrier IS 'Carrier/logistics company name';