-- Testimonials: Drop and consolidate with validation
DROP POLICY IF EXISTS "anyone_view_approved_testimonials" ON testimonials;
DROP POLICY IF EXISTS "admins_view_all_testimonials" ON testimonials;
DROP POLICY IF EXISTS "anyone_insert_testimonials" ON testimonials;
DROP POLICY IF EXISTS "admins_manage_testimonials" ON testimonials;

CREATE POLICY "testimonials_select" ON testimonials
  FOR SELECT USING (
    approved = true
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "testimonials_insert" ON testimonials
  FOR INSERT WITH CHECK (
    customer_email IS NOT NULL
    AND customer_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND shipment_id IS NOT NULL
  );

CREATE POLICY "testimonials_update" ON testimonials
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "testimonials_delete" ON testimonials
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Contact Inquiries: Drop and consolidate with validation
DROP POLICY IF EXISTS "anyone_insert_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "admins_manage_inquiries" ON contact_inquiries;

CREATE POLICY "contact_inquiries_select" ON contact_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "contact_inquiries_insert" ON contact_inquiries
  FOR INSERT WITH CHECK (
    email IS NOT NULL
    AND email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND length(message) >= 10
  );

CREATE POLICY "contact_inquiries_update" ON contact_inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "contact_inquiries_delete" ON contact_inquiries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );