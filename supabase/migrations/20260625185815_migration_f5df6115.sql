-- Create tracking number sequence for automatic generation
CREATE SEQUENCE IF NOT EXISTS tracking_number_seq START 1000000001;

-- Create function to generate tracking numbers
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'GC' || LPAD(nextval('tracking_number_seq')::TEXT, 10, '0');
END;
$$;

COMMENT ON FUNCTION generate_tracking_number() IS 'Generates unique tracking numbers in format GC0000000001';