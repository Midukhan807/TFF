-- Migration: Create predictions table with public RLS policies for TFF Match Predictions
-- Run this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/phlpfpbcsfwubdrtfpmb/sql/new

-- 1. Create predictions table
CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fixture_id UUID NOT NULL REFERENCES public.fixtures(id) ON DELETE CASCADE,
    visitor_id TEXT NOT NULL,
    user_name TEXT NOT NULL DEFAULT 'Anonymous Fan',
    prediction TEXT NOT NULL CHECK (prediction IN ('home', 'draw', 'away')),
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT predictions_fixture_visitor_key UNIQUE (fixture_id, visitor_id)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies allowing public read & write access for fan predictions
CREATE POLICY "Allow public read access to predictions"
ON public.predictions FOR SELECT
USING (true);

CREATE POLICY "Allow public insert to predictions"
ON public.predictions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update to predictions"
ON public.predictions FOR UPDATE
USING (true)
WITH CHECK (true);
