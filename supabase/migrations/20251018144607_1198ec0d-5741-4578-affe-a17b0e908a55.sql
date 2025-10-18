-- Enable PostGIS extension for geospatial features
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enum for location status
CREATE TYPE location_status AS ENUM ('live', 'paused', 'denied', 'error');

-- Create user_locations table
CREATE TABLE public.user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION NOT NULL,
  speed DOUBLE PRECISION,
  heading DOUBLE PRECISION,
  geohash TEXT,
  location_status location_status NOT NULL DEFAULT 'paused',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_latitude CHECK (lat >= -90 AND lat <= 90),
  CONSTRAINT valid_longitude CHECK (lng >= -180 AND lng <= 180),
  CONSTRAINT valid_accuracy CHECK (accuracy >= 0)
);

-- Create index for geospatial queries
CREATE INDEX idx_user_locations_geohash ON public.user_locations(geohash);
CREATE INDEX idx_user_locations_status ON public.user_locations(location_status);
CREATE INDEX idx_user_locations_updated_at ON public.user_locations(updated_at);

-- Enable Row Level Security
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only read their own location
CREATE POLICY "Users can view their own location"
  ON public.user_locations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own location
CREATE POLICY "Users can insert their own location"
  ON public.user_locations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own location
CREATE POLICY "Users can update their own location"
  ON public.user_locations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own location
CREATE POLICY "Users can delete their own location"
  ON public.user_locations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Public policy: Users with 'live' status can see other users' approximate locations within range
CREATE POLICY "Users can view nearby live users"
  ON public.user_locations
  FOR SELECT
  USING (
    location_status = 'live' 
    AND EXISTS (
      SELECT 1 FROM public.user_locations my_loc
      WHERE my_loc.user_id = auth.uid()
      AND my_loc.location_status = 'live'
    )
  );

-- Enable realtime for location updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_locations;

-- Function to calculate distance between two points (Haversine)
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 DOUBLE PRECISION,
  lng1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION,
  lng2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  earth_radius CONSTANT DOUBLE PRECISION := 6371000; -- meters
  dlat DOUBLE PRECISION;
  dlng DOUBLE PRECISION;
  a DOUBLE PRECISION;
  c DOUBLE PRECISION;
BEGIN
  dlat := radians(lat2 - lat1);
  dlng := radians(lng2 - lng1);
  
  a := sin(dlat/2) * sin(dlat/2) + 
       cos(radians(lat1)) * cos(radians(lat2)) * 
       sin(dlng/2) * sin(dlng/2);
  
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN earth_radius * c;
END;
$$;