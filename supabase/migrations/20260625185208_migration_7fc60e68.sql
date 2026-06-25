-- Create admin account with provided credentials
-- Email: info@gocargologistics.com
-- Password: 664610716Joel@

-- First, check if user exists and get their ID
DO $$
DECLARE
  admin_user_id UUID;
  admin_email TEXT := 'info@gocargologistics.com';
BEGIN
  -- Check if auth.users entry exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = admin_email;
  
  IF admin_user_id IS NULL THEN
    -- User doesn't exist, we'll need to handle this through Supabase Auth
    RAISE NOTICE 'Admin user not found in auth.users - will need to be created via Supabase Auth';
  ELSE
    -- Update or create profile
    INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
      admin_user_id,
      admin_email,
      'GoCargo Admin',
      'super_admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'super_admin',
      email = admin_email,
      full_name = 'GoCargo Admin',
      updated_at = NOW();
    
    RAISE NOTICE 'Admin profile updated for existing user';
  END IF;
END $$;

-- Create a function to set up admin on first signup
CREATE OR REPLACE FUNCTION handle_admin_signup()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.email = 'info@gocargologistics.com' THEN
    INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      'GoCargo Admin',
      'super_admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'super_admin',
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for admin auto-setup
DROP TRIGGER IF EXISTS on_admin_user_created ON auth.users;
CREATE TRIGGER on_admin_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_admin_signup();