-- Create admin user account with provided credentials
-- This will be done through Supabase Auth API from the application
-- First, let's ensure the trigger function exists to auto-assign super_admin role

CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'info@gocargologistics.com' THEN
    INSERT INTO profiles (id, full_name, email, role, phone, is_active)
    VALUES (
      NEW.id,
      'GoCargo Administrator',
      NEW.email,
      'super_admin',
      '+1-555-GOCARGO',
      true
    );
  ELSE
    INSERT INTO profiles (id, email, role, is_active)
    VALUES (NEW.id, NEW.email, 'customer', true);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_admin_user();

COMMENT ON FUNCTION handle_new_admin_user() IS 'Auto-creates profile with super_admin role for info@gocargologistics.com';