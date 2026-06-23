-- Extend profiles table for customer data
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS zip_code text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country text DEFAULT 'United States';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number text UNIQUE NOT NULL,
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pickup_address text NOT NULL,
  pickup_city text NOT NULL,
  pickup_state text NOT NULL,
  pickup_zip text NOT NULL,
  delivery_address text NOT NULL,
  delivery_city text NOT NULL,
  delivery_state text NOT NULL,
  delivery_zip text NOT NULL,
  vehicle_type text NOT NULL,
  vehicle_make text,
  vehicle_model text,
  vehicle_year text,
  shipping_type text NOT NULL CHECK (shipping_type IN ('open_carrier', 'enclosed_carrier', 'expedited', 'standard')),
  status text NOT NULL DEFAULT 'pending_pickup' CHECK (status IN ('pending_pickup', 'picked_up', 'in_transit', 'at_hub', 'customs_clearance', 'out_for_delivery', 'delivered', 'cancelled')),
  estimated_pickup_date date,
  actual_pickup_date date,
  estimated_delivery_date date,
  actual_delivery_date date,
  price decimal(10,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tracking events table
CREATE TABLE IF NOT EXISTS tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status text NOT NULL,
  location text,
  description text NOT NULL,
  event_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  pickup_address text NOT NULL,
  pickup_city text NOT NULL,
  pickup_state text NOT NULL,
  pickup_zip text NOT NULL,
  delivery_address text NOT NULL,
  delivery_city text NOT NULL,
  delivery_state text NOT NULL,
  delivery_zip text NOT NULL,
  vehicle_type text NOT NULL,
  vehicle_make text,
  vehicle_model text,
  vehicle_year text,
  shipping_type text NOT NULL,
  preferred_date date,
  additional_notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'accepted', 'rejected')),
  admin_notes text,
  quoted_price decimal(10,2),
  customer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  category text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  published boolean DEFAULT false,
  seo_title text,
  seo_description text,
  seo_keywords text,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text NOT NULL,
  shipment_id uuid REFERENCES shipments(id) ON DELETE SET NULL,
  approved boolean DEFAULT false,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shipments_customer ON shipments(customer_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment ON tracking_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to generate unique tracking number
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS text AS $$
DECLARE
  new_tracking text;
  exists boolean;
BEGIN
  LOOP
    new_tracking := 'GCL' || LPAD(floor(random() * 1000000000)::text, 9, '0');
    SELECT EXISTS(SELECT 1 FROM shipments WHERE tracking_number = new_tracking) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN new_tracking;
END;
$$ LANGUAGE plpgsql;

-- Update trigger for shipments
CREATE OR REPLACE FUNCTION update_shipment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_shipments_timestamp
  BEFORE UPDATE ON shipments
  FOR EACH ROW
  EXECUTE FUNCTION update_shipment_timestamp();

CREATE TRIGGER update_quote_requests_timestamp
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_shipment_timestamp();

CREATE TRIGGER update_blog_posts_timestamp
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_shipment_timestamp();