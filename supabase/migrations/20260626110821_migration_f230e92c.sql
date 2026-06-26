-- Also ensure tracking_events table allows public reads for timeline display
CREATE POLICY "public_tracking_events_select" ON tracking_events
FOR SELECT
TO anon, authenticated
USING (true);

-- Verify
SELECT policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'tracking_events' 
AND policyname = 'public_tracking_events_select';