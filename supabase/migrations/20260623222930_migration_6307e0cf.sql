-- RLS Policies for shipments
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_view_own_shipments" ON shipments;
DROP POLICY IF EXISTS "admins_view_all_shipments" ON shipments;
DROP POLICY IF EXISTS "admins_manage_shipments" ON shipments;

CREATE POLICY "customers_view_own_shipments" ON shipments
  FOR SELECT USING (
    customer_id = auth.uid()
  );

CREATE POLICY "admins_view_all_shipments" ON shipments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "admins_manage_shipments" ON shipments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for tracking_events
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_view_tracking" ON tracking_events;
DROP POLICY IF EXISTS "admins_manage_tracking" ON tracking_events;

CREATE POLICY "public_view_tracking" ON tracking_events
  FOR SELECT USING (true);

CREATE POLICY "admins_manage_tracking" ON tracking_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for quote_requests
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_view_own_quotes" ON quote_requests;
DROP POLICY IF EXISTS "anyone_insert_quotes" ON quote_requests;
DROP POLICY IF EXISTS "admins_manage_quotes" ON quote_requests;

CREATE POLICY "customers_view_own_quotes" ON quote_requests
  FOR SELECT USING (
    customer_id = auth.uid() OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "anyone_insert_quotes" ON quote_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admins_manage_quotes" ON quote_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone_view_published_posts" ON blog_posts;
DROP POLICY IF EXISTS "admins_view_all_posts" ON blog_posts;
DROP POLICY IF EXISTS "admins_manage_posts" ON blog_posts;

CREATE POLICY "anyone_view_published_posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "admins_view_all_posts" ON blog_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "admins_manage_posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone_view_approved_testimonials" ON testimonials;
DROP POLICY IF EXISTS "admins_view_all_testimonials" ON testimonials;
DROP POLICY IF EXISTS "anyone_insert_testimonials" ON testimonials;
DROP POLICY IF EXISTS "admins_manage_testimonials" ON testimonials;

CREATE POLICY "anyone_view_approved_testimonials" ON testimonials
  FOR SELECT USING (approved = true);

CREATE POLICY "admins_view_all_testimonials" ON testimonials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "anyone_insert_testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admins_manage_testimonials" ON testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for contact_inquiries
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone_insert_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "admins_manage_inquiries" ON contact_inquiries;

CREATE POLICY "anyone_insert_inquiries" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admins_manage_inquiries" ON contact_inquiries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );