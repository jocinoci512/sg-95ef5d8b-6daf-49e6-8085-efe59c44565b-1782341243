-- Create Admin User Seed Script
-- This creates the initial admin user for the Go Cargo Logistics platform
-- Email: support@gocargologisticsus.com
-- Password: 664610716Joel@

-- Function to create admin user with profile
CREATE OR REPLACE FUNCTION create_admin_user(
  user_email TEXT,
  user_password TEXT,
  user_full_name TEXT DEFAULT 'System Administrator'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create user in auth.users table
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', user_full_name),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Create corresponding profile with admin role
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    user_email,
    user_full_name,
    'super_admin',
    true,
    NOW(),
    NOW()
  );

  RETURN new_user_id;
END;
$$;

-- Execute the function to create the admin user
SELECT create_admin_user(
  'support@gocargologisticsus.com',
  '664610716Joel@',
  'Go Cargo Admin'
);

-- Clean up the function (optional - comment out if you want to keep it for creating more admins)
-- DROP FUNCTION IF EXISTS create_admin_user(TEXT, TEXT, TEXT);

-- Verify the admin user was created
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.is_active,
  p.created_at
FROM profiles p
WHERE p.email = 'support@gocargologisticsus.com';