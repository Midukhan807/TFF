-- Add logo_video_url column to teams table if it does not exist
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS logo_video_url TEXT;
