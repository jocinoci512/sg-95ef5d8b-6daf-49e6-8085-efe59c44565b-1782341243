-- Add RLS policy to allow public read access to shipments for tracking
-- This allows anyone to view shipments by tracking number
CREATE POLICY "public_tracking_select" ON shipments
FOR SELECT
TO anon, authenticated
USING (true);

-- Verify the policy was created
SELECT policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'shipments' 
AND policyname = 'public_tracking_select';