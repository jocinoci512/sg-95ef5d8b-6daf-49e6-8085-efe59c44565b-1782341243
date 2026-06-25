-- Shipments: Drop old policies and create consolidated ones
DROP POLICY IF EXISTS "customers_view_own_shipments" ON shipments;
DROP POLICY IF EXISTS "admins_view_all_shipments" ON shipments;
DROP POLICY IF EXISTS "admins_manage_shipments" ON shipments;

CREATE POLICY "shipments_select" ON shipments
  FOR SELECT USING (
    customer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "shipments_insert" ON shipments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "shipments_update" ON shipments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "shipments_delete" ON shipments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Tracking Events: Drop and consolidate
DROP POLICY IF EXISTS "public_view_tracking" ON tracking_events;
DROP POLICY IF EXISTS "admins_manage_tracking" ON tracking_events;

CREATE POLICY "tracking_events_select" ON tracking_events
  FOR SELECT USING (true);

CREATE POLICY "tracking_events_insert" ON tracking_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "tracking_events_update" ON tracking_events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "tracking_events_delete" ON tracking_events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );