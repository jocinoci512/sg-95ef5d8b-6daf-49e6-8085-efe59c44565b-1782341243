-- Also check shipment_timeline table
CREATE POLICY "public_timeline_select" ON shipment_timeline
FOR SELECT
TO anon, authenticated
USING (true);

-- Verify
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'shipment_timeline' 
AND policyname = 'public_timeline_select';