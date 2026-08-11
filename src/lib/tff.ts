import { supabase } from "@/integrations/supabase/client";

/* ---------------------------------- types --------------------------------- */

export type TournamentStatus = "draft" | "upcoming" | "live" | "completed" | "archived";
export type FixtureStatus = "scheduled" | "live" | "completed" | "postponed" | "cancelled";
export type TournamentFormat =
  | "league"
  | "single_round_robin"
  | "double_round_robin"
  | "group_stage"
  | "knockout"
  | "league_knockout";

export interface Team {
  id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
  manager_name: string | null;
  team_color: string;
  created_at: string;
}

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  season_year: number | null;
  start_date: string | null;
  end_date: string | null;
  format: TournamentFormat;
  status: TournamentStatus;
  points_win: number;
  points_draw: number;
  points_loss: number;
  tiebreakers: string[];
  num_groups: number;
  rules: string | null;
  organizer: string;
  created_at: string;
}

export interface Fixture {
  id: string;
  tournament_id: string;
  stage: string;
  round: string | null;
  matchday: number | null;
  bracket_slot: number | null;
  home_team_id: string | null;
  away_team_id: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  status: FixtureStatus;
}

export interface MatchResult {
  id: string;
  fixture_id: string;
  home_score: number;
  away_score: number;
  played_at: string;
  notes: string | null;
  screenshot_url: string | null;
  motm: string | null;
}

export interface StandingRow {
  tournament_id: string;
  team_id: string;
  group_id: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

export interface Champion {
  id: string;
  tournament_id: string;
  champion_team_id: string | null;
  runner_up_team_id: string | null;
  third_place_team_id: string | null;
  final_score: string | null;
  mvp: string | null;
  top_scorer: string | null;
}

export interface PlayerStat {
  id: string;
  tournament_id: string;
  team_id: string | null;
  player_name: string;
  goals: number;
  assists: number;
  motm: number;
}

export type FixtureWithTeams = Fixture & {
  home: Team | null;
  away: Team | null;
  result: MatchResult | null;
  tournament?: Pick<Tournament, "id" | "name" | "slug"> | null;
};

/* --------------------------------- helpers -------------------------------- */

const db = supabase as unknown as {
  from: (table: string) => any;
};

export const FORMAT_LABELS: Record<string, string> = {
  league: "League",
  single_round_robin: "Single Round Robin",
  double_round_robin: "Double Round Robin",
  group_stage: "Group Stage",
  knockout: "Knockout",
  league_knockout: "League + Knockout",
};

export function formatDate(value?: string | null) {
  if (!value) return "TBD";
  return new Date(`${value}T00:00:00`)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export function formatTime(value?: string | null) {
  if (!value) return "--:--";
  return value.slice(0, 5);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => (part.length <= 3 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(" ");
}

/* --------------------------------- queries -------------------------------- */

export async function fetchTeams(): Promise<Team[]> {
  const { data, error } = await db.from("teams").select("*").eq("is_demo", false).order("name");
  if (error) throw error;
  return (data ?? []) as Team[];
}

export async function fetchTournaments(): Promise<any[]> {
  const { data, error } = await db
    .from("tournaments")
    .select("*, tournament_teams(count), fixtures(count)")
    .eq("is_demo", false)
    .order("start_date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchTournamentBySlug(slug: string): Promise<Tournament | null> {
  const { data, error } = await db.from("tournaments").select("*").eq("is_demo", false).eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data ?? null) as Tournament | null;
}

export async function fetchTournamentTeams(tournamentId: string): Promise<Team[]> {
  const { data, error } = await db
    .from("tournament_teams")
    .select("team_id, group_id, teams(*)")
    .eq("tournament_id", tournamentId);
  if (error) throw error;
  return ((data ?? []) as any[]).map((row) => row.teams as Team).filter(Boolean).filter((team) => !(team as any).is_demo);
}

const FIXTURE_SELECT =
  "*, home:home_team_id(*), away:away_team_id(*), result:results(*), tournament:tournament_id(id,name,slug,is_demo)";

function normalizeFixture(row: any): FixtureWithTeams {
  const result = Array.isArray(row.result) ? (row.result[0] ?? null) : (row.result ?? null);
  return { ...row, result } as FixtureWithTeams;
}

export async function fetchFixtures(tournamentId: string): Promise<FixtureWithTeams[]> {
  const { data, error } = await db
    .from("fixtures")
    .select(FIXTURE_SELECT)
    .eq("tournament_id", tournamentId)
    .order("matchday")
    .order("scheduled_time");
  if (error) throw error;
  return ((data ?? []) as any[]).map(normalizeFixture);
}

export async function fetchLatestResults(limit = 6): Promise<FixtureWithTeams[]> {
  const { data, error } = await db
    .from("fixtures")
    .select(FIXTURE_SELECT)
    .eq("status", "completed")
    .order("scheduled_date", { ascending: false });
  if (error) throw error;
  const normalized = ((data ?? []) as any[]).map(normalizeFixture);
  return normalized.filter((f: any) => !f.tournament?.is_demo).slice(0, limit);
}

export async function fetchUpcomingFixtures(limit = 6): Promise<FixtureWithTeams[]> {
  const { data, error } = await db
    .from("fixtures")
    .select(FIXTURE_SELECT)
    .eq("status", "scheduled")
    .order("scheduled_date", { ascending: true });
  if (error) throw error;
  const normalized = ((data ?? []) as any[]).map(normalizeFixture);
  return normalized.filter((f: any) => !f.tournament?.is_demo).slice(0, limit);
}

export async function fetchStandings(tournamentId: string): Promise<StandingRow[]> {
  const { data, error } = await db.from("standings").select("*").eq("tournament_id", tournamentId);
  if (error) throw error;
  return (data ?? []) as StandingRow[];
}

export async function fetchAllStandings(): Promise<StandingRow[]> {
  const { data, error } = await db.from("standings").select("*, tournament:tournament_id(id,is_demo)");
  if (error) throw error;
  return ((data ?? []) as any[]).filter((row) => !row.tournament?.is_demo) as StandingRow[];
}

export async function fetchChampions(): Promise<Champion[]> {
  const { data, error } = await db.from("champions").select("*, tournament:tournament_id(id,is_demo)");
  if (error) throw error;
  return ((data ?? []) as any[]).filter((c) => !c.tournament?.is_demo) as Champion[];
}

export async function fetchPlayerStats(tournamentId: string): Promise<PlayerStat[]> {
  const { data, error } = await db
    .from("player_statistics")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("goals", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PlayerStat[];
}

export async function fetchTeamFixtures(teamId: string): Promise<FixtureWithTeams[]> {
  const { data, error } = await db
    .from("fixtures")
    .select(FIXTURE_SELECT)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .order("scheduled_date", { ascending: false });
  if (error) throw error;
  const normalized = ((data ?? []) as any[]).map(normalizeFixture);
  return normalized.filter((f: any) => !f.tournament?.is_demo);
}

/* ------------------------------ derived logic ----------------------------- */

export function sortStandings(rows: StandingRow[], tiebreakers: string[] = []) {
  const order = tiebreakers.length
    ? tiebreakers
    : ["points", "goal_difference", "goals_for", "head_to_head"];
  return [...rows].sort((a, b) => {
    for (const key of order) {
      if (key === "points" && a.points !== b.points) return b.points - a.points;
      if (key === "goal_difference" && a.goal_difference !== b.goal_difference)
        return b.goal_difference - a.goal_difference;
      if (key === "goals_for" && a.goals_for !== b.goals_for) return b.goals_for - a.goals_for;
      if (key === "wins" && a.wins !== b.wins) return b.wins - a.wins;
    }
    return 0;
  });
}

export interface TeamCareer {
  team: Team;
  tournaments: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  titles: number;
  rankingPoints: number;
}

export interface RankingConfig {
  points_champion: number;
  points_runner_up: number;
  points_semi_final: number;
  points_quarter_final: number;
  points_participation: number;
  youtube_live_url?: string | null;
}

export const DEFAULT_RANKING: RankingConfig = {
  points_champion: 100,
  points_runner_up: 70,
  points_semi_final: 50,
  points_quarter_final: 30,
  points_participation: 10,
};

export async function fetchRankingConfig(): Promise<RankingConfig> {
  const { data } = await db.from("ranking_settings").select("*").eq("id", 1).maybeSingle();
  return (data ?? DEFAULT_RANKING) as RankingConfig;
}

export function buildCareers(
  teams: Team[],
  standings: StandingRow[],
  champions: Champion[],
  config: RankingConfig,
): TeamCareer[] {
  const map = new Map<string, TeamCareer>();
  for (const team of teams) {
    map.set(team.id, {
      team,
      tournaments: 0,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      titles: 0,
      rankingPoints: 0,
    });
  }
  for (const row of standings) {
    const entry = map.get(row.team_id);
    if (!entry) continue;
    entry.tournaments += 1;
    entry.played += row.played;
    entry.wins += row.wins;
    entry.draws += row.draws;
    entry.losses += row.losses;
    entry.goalsFor += row.goals_for;
    entry.goalsAgainst += row.goals_against;
    entry.rankingPoints += config.points_participation;
  }
  for (const champ of champions) {
    const winner = champ.champion_team_id ? map.get(champ.champion_team_id) : null;
    if (winner) {
      winner.titles += 1;
      winner.rankingPoints += config.points_champion;
    }
    const runner = champ.runner_up_team_id ? map.get(champ.runner_up_team_id) : null;
    if (runner) runner.rankingPoints += config.points_runner_up;
    const third = champ.third_place_team_id ? map.get(champ.third_place_team_id) : null;
    if (third) third.rankingPoints += config.points_semi_final;
  }
  return [...map.values()].sort(
    (a, b) => b.rankingPoints - a.rankingPoints || b.titles - a.titles || b.wins - a.wins,
  );
}

/* ------------------------------- PLAYERS DB --------------------------------- */

export interface EFootballPlayer {
  id: string; // maps to konamiID
  name: string;
  shirt_name?: string;
  full_name?: string;
  nationalities?: string[];
  age?: number;
  birthdate?: string;
  height?: number;
  weight?: number;
  strong_foot?: number; // 0 for Right, 1 for Left
  strong_hand?: number;
  star_rating?: number;
  registered_position?: number;
  positions?: number[];
  game_versions?: string[];
  real_face?: string[];
  is_system?: boolean;
  overall_rating?: number;
  team?: string;
  playing_style?: string;
  nationality?: string;
  raw_data?: any;
}

export interface PlayerFilterParams {
  search?: string;
  position?: string;
  nationality?: string;
  team?: string;
  playingStyle?: string;
  minRating?: number;
  maxRating?: number;
  page?: number;
  limit?: number;
}

export const POSITION_MAP: Record<number, string> = {
  0: "GK",
  1: "CB",
  2: "LB",
  3: "RB",
  4: "DMF",
  5: "CMF",
  6: "LMF",
  7: "RMF",
  8: "AMF",
  9: "LWF",
  10: "RWF",
  11: "SS",
  12: "CF",
};

export const POSITION_REVERSE_MAP = Object.fromEntries(
  Object.entries(POSITION_MAP).map(([k, v]) => [v, parseInt(k)]),
);

export const NATIONALITY_MAP: Record<string, string> = {
  "13": "Japan",
  "146": "Brazil",
  "9": "England",
  "14": "France",
  "15": "Germany",
  "18": "Italy",
  "34": "Spain",
  "45": "Argentina",
  "47": "Portugal",
  "37": "Netherlands",
};

export async function fetchPlayers(params: PlayerFilterParams): Promise<{ players: EFootballPlayer[]; totalCount: number }> {
  const {
    search = "",
    position = "",
    nationality = "",
    team = "",
    playingStyle = "",
    minRating = 60,
    maxRating = 99,
    page = 1,
    limit = 24,
  } = params;

  try {
    let query = db.from("efootball_players").select("*", { count: "exact" });

    if (search.trim()) {
      query = query.ilike("name", `%${search.trim()}%`);
    }

    if (position) {
      const posId = POSITION_REVERSE_MAP[position];
      if (posId !== undefined) {
        query = query.eq("registered_position", posId);
      }
    }

    if (nationality) {
      query = query.eq("nationality", nationality);
    }

    if (team) {
      query = query.eq("team", team);
    }

    if (playingStyle) {
      query = query.eq("playing_style", playingStyle);
    }

    if (minRating) {
      query = query.gte("overall_rating", minRating);
    }

    if (maxRating) {
      query = query.lte("overall_rating", maxRating);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.order("overall_rating", { ascending: false }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      players: (data ?? []) as EFootballPlayer[],
      totalCount: count ?? 0,
    };
  } catch (dbError) {
    console.warn("Supabase fetch failed, falling back to local mock generator:", dbError);
    // Return simulated players so the UI never crashes and remains fully testable
    return fetchLocalSimulatedPlayers(params);
  }
}

export async function fetchPlayerById(id: string): Promise<EFootballPlayer | null> {
  try {
    const { data, error } = await db.from("efootball_players").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (data) return data as EFootballPlayer;
  } catch (err) {
    console.warn("Supabase fetch player by ID failed, using simulated fallback.");
  }
  return getLocalSimulatedPlayerById(id);
}

// MOCK GENERATOR FOR FALLBACK & LOCAL DEVELOPMENT
function fetchLocalSimulatedPlayers(params: PlayerFilterParams) {
  const allMockPlayers = getMockPlayersPool();
  
  let filtered = allMockPlayers;

  if (params.search?.trim()) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(s));
  }

  if (params.position) {
    filtered = filtered.filter(p => POSITION_MAP[p.registered_position ?? 0] === params.position);
  }

  if (params.nationality) {
    filtered = filtered.filter(p => p.nationality === params.nationality);
  }

  if (params.team) {
    filtered = filtered.filter(p => p.team === params.team);
  }

  if (params.playingStyle) {
    filtered = filtered.filter(p => p.playing_style === params.playingStyle);
  }

  if (params.minRating) {
    filtered = filtered.filter(p => (p.overall_rating ?? 60) >= params.minRating!);
  }

  if (params.maxRating) {
    filtered = filtered.filter(p => (p.overall_rating ?? 60) <= params.maxRating!);
  }

  const from = ((params.page ?? 1) - 1) * (params.limit ?? 24);
  const to = from + (params.limit ?? 24);

  return {
    players: filtered.slice(from, to),
    totalCount: filtered.length,
  };
}

function getLocalSimulatedPlayerById(id: string): EFootballPlayer | null {
  const pool = getMockPlayersPool();
  return pool.find(p => p.id === id) || null;
}

let cachedMockPool: EFootballPlayer[] = [];
function getMockPlayersPool(): EFootballPlayer[] {
  if (cachedMockPool.length > 0) return cachedMockPool;

  const names = [
    "L. Messi", "C. Ronaldo", "Neymar Jr", "K. Mbappé", "E. Haaland",
    "Kevin De Bruyne", "Mohamed Salah", "Robert Lewandowski", "Jude Bellingham", "Vinícius Júnior",
    "Bukayo Saka", "Antoine Griezmann", "Harry Kane", "Son Heung-Min", "Rodri",
    "Martin Ødegaard", "Bruno Fernandes", "Rafa Leão", "Pedri", "Gavi",
    "F. de Jong", "L. Modrić", "T. Kroos", "J. Musiala", "Florian Wirtz"
  ];

  const positions = [12, 11, 9, 10, 8, 5, 4, 6, 7, 1, 2, 3, 0];
  const nationalities = ["Argentina", "Portugal", "Brazil", "France", "Norway", "Belgium", "Egypt", "Poland", "England", "South Korea", "Spain", "Germany"];
  const teams = ["Manchester Red", "Madrid White", "Barcelona Blaugrana", "München Red", "Paris Blue", "Milano Black", "London Gunners"];
  const styles = ["Goal Poacher", "Creative Playmaker", "Box-to-Box", "Destroyer", "Anchor Man", "Roaming Flank", "Prolific Winger", "Build Up"];

  cachedMockPool = Array.from({ length: 150 }).map((_, idx) => {
    const id = (idx + 1000).toString();
    const name = names[idx % names.length] + (idx >= names.length ? ` (${Math.floor(idx / names.length)})` : "");
    const star_rating = (idx % 3) + 3; // 3 to 5 stars
    const overall_rating =star_rating === 5 ? 90 + (idx % 6) : star_rating === 4 ? 80 + (idx % 8) : 72 + (idx % 8);
    const registered_position = positions[idx % positions.length];
    const nationality = nationalities[idx % nationalities.length];
    const team = teams[idx % teams.length];
    const playing_style = styles[idx % styles.length];

    const attributes = {
      offensive_awareness: 60 + (idx % 35),
      ball_control: 65 + (idx % 30),
      dribbling: 65 + (idx % 30),
      tight_possession: 60 + (idx % 35),
      low_pass: 55 + (idx % 40),
      lofted_pass: 50 + (idx % 45),
      finishing: 50 + (idx % 45),
      heading: 45 + (idx % 45),
      place_kicking: 50 + (idx % 40),
      curl: 50 + (idx % 40),
      speed: 65 + (idx % 30),
      acceleration: 65 + (idx % 30),
      kicking_power: 60 + (idx % 35),
      jump: 50 + (idx % 40),
      physical_contact: 45 + (idx % 45),
      balance: 60 + (idx % 35),
      stamina: 60 + (idx % 35),
      defensive_awareness: 30 + (idx % 60),
      tackling: 30 + (idx % 60),
      aggression: 40 + (idx % 50),
    };

    const skills = [
      "Double Touch",
      "One-touch Pass",
      "Through Passing",
      "Long Range Drive",
      "Marseille Turn",
      "Cut Behind & Turn",
      "Weighted Pass",
      "Acrobatics"
    ].slice(0, 3 + (idx % 4));

    return {
      id,
      name,
      shirt_name: name.toUpperCase(),
      full_name: `${name} Full Profile`,
      age: 20 + (idx % 18),
      height: 165 + (idx % 30),
      weight: 60 + (idx % 30),
      strong_foot: idx % 2,
      star_rating,
      registered_position,
      positions: [0,0,0,0,0,0,0,0,0,0,0,0,0],
      overall_rating,
      team,
      playing_style,
      nationality,
      attributes,
      skills,
      game_versions: ["eFootball 2026", "eFootball 2025"],
    };
  });

  return cachedMockPool;
}

