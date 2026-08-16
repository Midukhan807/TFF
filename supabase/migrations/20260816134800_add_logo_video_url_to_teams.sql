-- Add logo_video_url and founded_year columns to teams table if they do not exist
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS logo_video_url TEXT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS founded_year INTEGER;
