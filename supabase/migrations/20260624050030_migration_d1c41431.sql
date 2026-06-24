-- Simplified admin setup - just ensure role column and profile structure is ready
-- The actual user creation will be done via Supabase Admin API

-- Verify profiles table has proper role enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
    END IF;
END $$;

-- Ensure role column exists with proper type
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'customer';
    END IF;
END $$;

-- Create index on role for faster admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Grant necessary permissions
GRANT USAGE ON TYPE user_role TO authenticated;
GRANT USAGE ON TYPE user_role TO anon;