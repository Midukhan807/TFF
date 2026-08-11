
CREATE TYPE public.app_role AS ENUM ('admin','organizer');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_tff_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer');
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'organizer')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  short_name text NOT NULL,
  logo_url text,
  manager_name text,
  team_color text NOT NULL DEFAULT '#D4A017',
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  logo_url text,
  banner_url text,
  season_year int,
  start_date date,
  end_date date,
  format text NOT NULL DEFAULT 'single_round_robin',
  status text NOT NULL DEFAULT 'draft',
  points_win int NOT NULL DEFAULT 3,
  points_draw int NOT NULL DEFAULT 1,
  points_loss int NOT NULL DEFAULT 0,
  tiebreakers text[] NOT NULL DEFAULT ARRAY['points','goal_difference','goals_for','head_to_head'],
  num_groups int NOT NULL DEFAULT 0,
  qualification_rules text,
  rules text,
  organizer text NOT NULL DEFAULT 'TFF',
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tournaments_status_check CHECK (status IN ('draft','upcoming','live','completed','archived')),
  CONSTRAINT tournaments_format_check CHECK (format IN ('league','single_round_robin','double_round_robin','group_stage','knockout','league_knockout'))
);

CREATE TABLE public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  name text NOT NULL
);

CREATE TABLE public.tournament_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  group_id uuid REFERENCES public.groups(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tournament_id, team_id)
);

CREATE TABLE public.fixtures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  stage text NOT NULL DEFAULT 'league',
  round text,
  matchday int,
  bracket_slot int,
  home_team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
  away_team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
  scheduled_date date,
  scheduled_time time,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fixtures_status_check CHECK (status IN ('scheduled','live','completed','postponed','cancelled')),
  CONSTRAINT fixtures_not_self CHECK (home_team_id IS NULL OR away_team_id IS NULL OR home_team_id <> away_team_id)
);
CREATE INDEX fixtures_tournament_idx ON public.fixtures(tournament_id, matchday);
CREATE INDEX fixtures_home_idx ON public.fixtures(home_team_id);
CREATE INDEX fixtures_away_idx ON public.fixtures(away_team_id);

CREATE TABLE public.results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id uuid NOT NULL UNIQUE REFERENCES public.fixtures(id) ON DELETE CASCADE,
  home_score int NOT NULL CHECK (home_score >= 0),
  away_score int NOT NULL CHECK (away_score >= 0),
  played_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  screenshot_url text,
  motm text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.player_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  goals int NOT NULL DEFAULT 0,
  assists int NOT NULL DEFAULT 0,
  motm int NOT NULL DEFAULT 0
);

CREATE TABLE public.champions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL UNIQUE REFERENCES public.tournaments(id) ON DELETE CASCADE,
  champion_team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  runner_up_team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  third_place_team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  final_score text,
  mvp text,
  top_scorer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ranking_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  points_champion int NOT NULL DEFAULT 100,
  points_runner_up int NOT NULL DEFAULT 70,
  points_semi_final int NOT NULL DEFAULT 50,
  points_quarter_final int NOT NULL DEFAULT 30,
  points_participation int NOT NULL DEFAULT 10
);
INSERT INTO public.ranking_settings (id) VALUES (1);

GRANT SELECT ON public.teams, public.tournaments, public.groups, public.tournament_teams, public.fixtures, public.results, public.player_statistics, public.champions, public.ranking_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.teams, public.tournaments, public.groups, public.tournament_teams, public.fixtures, public.results, public.player_statistics, public.champions, public.ranking_settings TO authenticated;
GRANT ALL ON public.teams, public.tournaments, public.groups, public.tournament_teams, public.fixtures, public.results, public.player_statistics, public.champions, public.ranking_settings TO service_role;

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.champions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranking_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "admin write teams" ON public.teams FOR ALL TO authenticated USING (public.is_tff_admin()) WITH CHECK (public.is_tff_admin());
CREATE POLICY "public read tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "admin write tournaments" ON public.tournaments FOR ALL TO authenticated USING (public.is_tff_admin()) WITH CHECK (public.is_tff_admin());
CREATE POLICY "public read groups" ON public.groups FOR SELECT USING (true);
CREATE POLICY "admin write groups" ON public.groups FOR ALL TO authenticated USING (public.is_tff_admin()) WITH CHECK (public.is_tff_admin());
CREATE POLICY "public read tournament_teams" ON public.tournament_teams FOR SELECT USING (true);
CREATE POLICY "admin write tournament_teams" ON public.tournament_teams FOR ALL TO authenticated USING (public.is_tff_admin()) WITH CHECK (public.is_tff_admin());
CREATE POLICY "public read fixtures" ON public.fixtures FOR SELECT USING (true);
CREATE POLICY "admin write fixtures" ON public.fixtures FOR ALL TO authenticated USING (public.is_tff_admin()) WITH CHECK (public.is_tff_admin());
CREATE POLICY "public read results" ON public.results FOR SELECT USING (true);
CREATE POLICY "admin write results" ON public.results FOR ALL TO authenticated USING (public.is_tff_admin()) WITH CHECK (public.is_tff_admin());
CREATE POLICY "public read player_statistics" ON public.player_statistics FOR SELECT USING (true);
CREATE POLICY "admin write player_statistics" ON public.player_statistics FOR ALL TO authenticated USING (public.is_tff_admin()) WITH CHECK (public.is_tff_admin());
CREATE POLICY "public read champions" ON public.champions FOR SELECT USING (true);
CREATE POLICY "admin write champions" ON public.champions FOR ALL TO authenticated USING (public.is_tff_admin()) WITH CHECK (public.is_tff_admin());
CREATE POLICY "public read ranking_settings" ON public.ranking_settings FOR SELECT USING (true);
CREATE POLICY "admin write ranking_settings" ON public.ranking_settings FOR ALL TO authenticated USING (public.is_tff_admin()) WITH CHECK (public.is_tff_admin());

CREATE OR REPLACE VIEW public.standings
WITH (security_invoker = true) AS
WITH played AS (
  SELECT f.tournament_id, f.home_team_id AS team_id, r.home_score AS gf, r.away_score AS ga
  FROM public.fixtures f JOIN public.results r ON r.fixture_id = f.id
  WHERE f.status = 'completed' AND f.stage = 'league'
  UNION ALL
  SELECT f.tournament_id, f.away_team_id AS team_id, r.away_score AS gf, r.home_score AS ga
  FROM public.fixtures f JOIN public.results r ON r.fixture_id = f.id
  WHERE f.status = 'completed' AND f.stage = 'league'
)
SELECT
  tt.tournament_id,
  tt.team_id,
  tt.group_id,
  COALESCE(count(p.team_id), 0)::int AS played,
  COALESCE(sum((p.gf > p.ga)::int), 0)::int AS wins,
  COALESCE(sum((p.gf = p.ga)::int), 0)::int AS draws,
  COALESCE(sum((p.gf < p.ga)::int), 0)::int AS losses,
  COALESCE(sum(p.gf), 0)::int AS goals_for,
  COALESCE(sum(p.ga), 0)::int AS goals_against,
  COALESCE(sum(p.gf - p.ga), 0)::int AS goal_difference,
  COALESCE(sum((p.gf > p.ga)::int) * t.points_win + sum((p.gf = p.ga)::int) * t.points_draw + sum((p.gf < p.ga)::int) * t.points_loss, 0)::int AS points
FROM public.tournament_teams tt
JOIN public.tournaments t ON t.id = tt.tournament_id
LEFT JOIN played p ON p.tournament_id = tt.tournament_id AND p.team_id = tt.team_id
GROUP BY tt.tournament_id, tt.team_id, tt.group_id, t.points_win, t.points_draw, t.points_loss;

GRANT SELECT ON public.standings TO anon, authenticated, service_role;
