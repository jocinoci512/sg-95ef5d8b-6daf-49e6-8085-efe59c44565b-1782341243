-- Fix 3: Add indexes for foreign keys
-- Addresses: Unindexed foreign keys warnings

-- Add missing indexes for quote_requests.customer_id
CREATE INDEX IF NOT EXISTS idx_quote_requests_customer ON quote_requests(customer_id);

-- Add missing indexes for blog_posts.author_id
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);

-- Add missing indexes for testimonials.shipment_id
CREATE INDEX IF NOT EXISTS idx_testimonials_shipment ON testimonials(shipment_id);

-- Fix 4: Optimize RLS policies for auth.uid() performance
-- Create a helper function that caches auth.uid() per statement
-- Addresses: Auth RLS Initialization Plan warnings

CREATE OR REPLACE FUNCTION auth_uid_cached()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid()
$$;

-- Add comment explaining the RLS design
COMMENT ON FUNCTION auth_uid_cached() IS 
'Cached version of auth.uid() for use in RLS policies where performance is critical. 
STABLE ensures the function result is cached within a single query execution.';