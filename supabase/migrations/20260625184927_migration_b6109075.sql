-- Enterprise Schema Enhancements
-- Add comprehensive shipment types, activity logging, routes, notes, and staff management

-- 1. Expand shipment types to support all 18+ categories
ALTER TABLE shipments DROP CONSTRAINT IF EXISTS shipments_shipping_type_check;
ALTER TABLE shipments ADD CONSTRAINT shipments_shipping_type_check CHECK (
  shipping_type IN (
    'air_freight', 'ocean_freight', 'road_freight', 'rail_freight',
    'express_delivery', 'standard_delivery', 'overnight_shipping', 'same_day_delivery',
    'international_shipping', 'domestic_shipping', 'heavy_cargo', 'vehicle_shipping',
    'refrigerated_cargo', 'dangerous_goods', 'container_shipping', 'parcel_delivery',
    'document_delivery', 'freight_forwarding', 'warehouse_distribution',
    'open_carrier', 'enclosed_carrier', 'expedited', 'standard'
  )
);

-- 2. Expand shipment statuses
ALTER TABLE shipments DROP CONSTRAINT IF EXISTS shipments_status_check;
ALTER TABLE shipments ADD CONSTRAINT shipments_status_check CHECK (
  status IN (
    'pending_pickup', 'picked_up', 'in_transit', 'at_hub', 'customs_clearance',
    'out_for_delivery', 'delivered', 'cancelled', 'on_hold', 'delayed',
    'processing', 'dispatched', 'arrived_at_distribution', 'archived'
  )
);

-- 3. Add routing and map data to shipments
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pickup_lat DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pickup_lng DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS delivery_lat DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS delivery_lng DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS route_distance_km NUMERIC(10, 2);
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS current_lat DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS current_lng DOUBLE PRECISION;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;

-- 4. Create activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at);

-- 5. Create shipment notes table
CREATE TABLE IF NOT EXISTS shipment_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shipment_notes_shipment ON shipment_notes(shipment_id);

-- 6. Add document categories
ALTER TABLE shipment_documents ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE shipment_documents DROP CONSTRAINT IF EXISTS shipment_documents_category_check;
ALTER TABLE shipment_documents ADD CONSTRAINT shipment_documents_category_check CHECK (
  category IN (
    'shipping_label', 'bill_of_lading', 'customs_document', 'invoice',
    'delivery_photo', 'proof_of_delivery', 'package_image', 'general'
  )
);

-- 7. Enable RLS on new tables
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_notes ENABLE ROW LEVEL SECURITY;

-- 8. RLS policies for activity_logs (admin only)
CREATE POLICY "admins_view_logs" ON activity_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- 9. RLS policies for shipment_notes
CREATE POLICY "admins_all_notes" ON shipment_notes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "customers_view_external_notes" ON shipment_notes
  FOR SELECT
  USING (
    is_internal = false
    AND EXISTS (
      SELECT 1 FROM shipments
      WHERE shipments.id = shipment_notes.shipment_id
        AND shipments.customer_id = auth.uid()
    )
  );

COMMENT ON TABLE activity_logs IS 'Audit trail of all system actions';
COMMENT ON TABLE shipment_notes IS 'Internal and customer-facing notes for shipments';