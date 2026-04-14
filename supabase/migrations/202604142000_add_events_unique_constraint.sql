-- Add unique constraint for event deduplication
-- This allows ON CONFLICT to work properly in bulk imports

ALTER TABLE public.events
ADD CONSTRAINT events_unique_title_date_location
UNIQUE (title, event_date, location);