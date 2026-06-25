-- Add comprehensive shipment types and enhanced fields
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS shipment_type TEXT DEFAULT 'standard_delivery';
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS current_location TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pickup_lat NUMERIC;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS pickup_lng NUMERIC;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS delivery_lat NUMERIC;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS delivery_lng NUMERIC;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS distance_km NUMERIC;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS carrier_name TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS carrier_phone TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS package_description TEXT;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS package_weight NUMERIC;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS is_on_hold BOOLEAN DEFAULT false;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS hold_reason TEXT;

-- Create shipment_timeline table for detailed tracking history
CREATE TABLE IF NOT EXISTS shipment_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_title TEXT NOT NULL,
  event_description TEXT,
  location TEXT,
  event_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Create shipment_documents table
CREATE TABLE IF NOT EXISTS shipment_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shipment_notes table
CREATE TABLE IF NOT EXISTS shipment_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_shipment_timeline_shipment ON shipment_timeline(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_timeline_timestamp ON shipment_timeline(event_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_shipment_documents_shipment ON shipment_documents(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_notes_shipment ON shipment_notes(shipment_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read, user_id);
CREATE INDEX IF NOT EXISTS idx_shipments_type ON shipments(shipment_type);
CREATE INDEX IF NOT EXISTS idx_shipments_archived ON shipments(is_archived);

-- Enable RLS
ALTER TABLE shipment_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shipment_timeline
CREATE POLICY "public_read_timeline" ON shipment_timeline FOR SELECT USING (true);
CREATE POLICY "admin_manage_timeline" ON shipment_timeline FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- RLS Policies for shipment_documents
CREATE POLICY "public_read_documents" ON shipment_documents FOR SELECT USING (true);
CREATE POLICY "admin_manage_documents" ON shipment_documents FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- RLS Policies for shipment_notes
CREATE POLICY "admin_read_notes" ON shipment_notes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);
CREATE POLICY "admin_manage_notes" ON shipment_notes FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- RLS Policies for activity_logs
CREATE POLICY "admin_read_logs" ON activity_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);
CREATE POLICY "system_write_logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- RLS Policies for notifications
CREATE POLICY "user_read_own_notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "admin_create_notifications" ON notifications FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
  )
);
CREATE POLICY "user_update_own_notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

COMMENT ON TABLE shipment_timeline IS 'Detailed event history for shipment tracking';
COMMENT ON TABLE shipment_documents IS 'Documents and attachments for shipments';
COMMENT ON TABLE shipment_notes IS 'Internal and customer-facing notes';
COMMENT ON TABLE activity_logs IS 'System-wide activity tracking';
COMMENT ON TABLE notifications IS 'User notifications for shipment updates';