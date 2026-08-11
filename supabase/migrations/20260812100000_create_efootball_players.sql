-- Migration: Create efootball_players table and indexes
CREATE TABLE IF NOT EXISTS public.efootball_players (
  id text PRIMARY KEY, -- maps to konamiID
  name text NOT NULL, -- player name (playerName[0])
  shirt_name text, -- shirt name
  full_name text, -- full name
  nationalities jsonb, -- array of nationality IDs
  age integer,
  birthdate text,
  height integer,
  weight integer,
  strong_foot integer, -- 0 for Right, 1 for Left
  strong_hand integer,
  star_rating integer,
  registered_position integer, -- 0 to 12
  positions jsonb, -- playability array
  game_versions jsonb,
  real_face jsonb,
  is_system boolean,
  
  -- Generated/Populated fields for search & filter:
  overall_rating integer DEFAULT 60,
  team text,
  playing_style text,
  attributes jsonb, -- Speed, passing, dribbling, etc.
  skills jsonb, -- list of skills
  nationality text, -- mapped text name (e.g. "Japan", "Brazil")
  raw_data jsonb
);

-- Grant SELECT to public/anon
GRANT SELECT ON public.efootball_players TO anon;
GRANT SELECT ON public.efootball_players TO authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_players_name ON public.efootball_players USING gin (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_players_registered_position ON public.efootball_players (registered_position);
CREATE INDEX IF NOT EXISTS idx_players_overall_rating ON public.efootball_players (overall_rating);
CREATE INDEX IF NOT EXISTS idx_players_nationality ON public.efootball_players (nationality);
CREATE INDEX IF NOT EXISTS idx_players_team ON public.efootball_players (team);
CREATE INDEX IF NOT EXISTS idx_players_playing_style ON public.efootball_players (playing_style);
