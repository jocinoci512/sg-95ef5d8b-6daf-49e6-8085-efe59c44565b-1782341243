-- Quote Requests: Drop and consolidate with email validation
DROP POLICY IF EXISTS "customers_view_own_quotes" ON quote_requests;
DROP POLICY IF EXISTS "anyone_insert_quotes" ON quote_requests;
DROP POLICY IF EXISTS "admins_manage_quotes" ON quote_requests;

CREATE POLICY "quote_requests_select" ON quote_requests
  FOR SELECT USING (
    customer_id = auth.uid()
    OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "quote_requests_insert" ON quote_requests
  FOR INSERT WITH CHECK (
    customer_email IS NOT NULL
    AND customer_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

CREATE POLICY "quote_requests_update" ON quote_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "quote_requests_delete" ON quote_requests
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Blog Posts: Drop and consolidate
DROP POLICY IF EXISTS "anyone_view_published_posts" ON blog_posts;
DROP POLICY IF EXISTS "admins_view_all_posts" ON blog_posts;
DROP POLICY IF EXISTS "admins_manage_posts" ON blog_posts;

CREATE POLICY "blog_posts_select" ON blog_posts
  FOR SELECT USING (
    published = true
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "blog_posts_insert" ON blog_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "blog_posts_update" ON blog_posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "blog_posts_delete" ON blog_posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );