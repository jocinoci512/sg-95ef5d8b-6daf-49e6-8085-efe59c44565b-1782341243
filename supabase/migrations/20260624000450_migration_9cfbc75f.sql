-- Create shipment_documents table
CREATE TABLE IF NOT EXISTS shipment_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE shipment_documents ENABLE ROW LEVEL SECURITY;

-- Admin policies (read, insert, update, delete)
CREATE POLICY "admins_all_documents" ON shipment_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Customer policies (read only their own shipment documents)
CREATE POLICY "customers_view_own_documents" ON shipment_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shipments
      WHERE shipments.id = shipment_documents.shipment_id
      AND shipments.customer_id = auth.uid()
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_shipment_documents_shipment_id ON shipment_documents(shipment_id);

-- Add updated_at trigger
CREATE TRIGGER update_shipment_documents_updated_at
  BEFORE UPDATE ON shipment_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_shipment_timestamp();