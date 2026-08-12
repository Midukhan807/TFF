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
  founded_year: number | null;
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

export function getManualStandings(tournamentId?: string): StandingRow[] {
  try {
    const raw = localStorage.getItem("tff_manual_standings");
    if (!raw) return [];
    const allMap: Record<string, StandingRow[]> = JSON.parse(raw);
    if (tournamentId) {
      return allMap[tournamentId] || [];
    }
    return Object.values(allMap).flat();
  } catch {
    return [];
  }
}

export function saveManualStandings(tournamentId: string, rows: StandingRow[]): void {
  try {
    const raw = localStorage.getItem("tff_manual_standings");
    const allMap: Record<string, StandingRow[]> = raw ? JSON.parse(raw) : {};
    allMap[tournamentId] = rows;
    localStorage.setItem("tff_manual_standings", JSON.stringify(allMap));
  } catch (e) {
    console.error("Failed to save manual standings to localStorage", e);
  }
}

export async function fetchStandings(tournamentId: string): Promise<StandingRow[]> {
  const manual = getManualStandings(tournamentId);
  if (manual.length > 0) return manual;

  const { data, error } = await db.from("standings").select("*").eq("tournament_id", tournamentId);
  if (error) throw error;
  return (data ?? []) as StandingRow[];
}

export async function fetchAllStandings(): Promise<StandingRow[]> {
  const { data, error } = await db.from("standings").select("*, tournament:tournament_id(id,is_demo)");
  let dbRows = ((data ?? []) as any[]).filter((row) => !row.tournament?.is_demo) as StandingRow[];

  const manualAll = getManualStandings();
  if (manualAll.length > 0) {
    const manualTourneyIds = new Set(manualAll.map((m) => m.tournament_id));
    dbRows = dbRows.filter((r) => !manualTourneyIds.has(r.tournament_id));
    return [...dbRows, ...manualAll];
  }

  return dbRows;
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

export function getTeamFoundedYear(team: any): number {
  if (team?.founded_year) return Number(team.founded_year);
  if (typeof window !== "undefined" && team?.id) {
    try {
      const stored = localStorage.getItem("tff_founded_years");
      if (stored) {
        const map = JSON.parse(stored);
        if (map[team.id]) return Number(map[team.id]);
      }
    } catch {}
  }
  return team?.created_at ? new Date(team.created_at).getFullYear() : 2026;
}

export function setTeamFoundedYear(teamId: string, year: number) {
  if (typeof window === "undefined" || !teamId) return;
  try {
    const stored = localStorage.getItem("tff_founded_years");
    const map = stored ? JSON.parse(stored) : {};
    map[teamId] = year;
    localStorage.setItem("tff_founded_years", JSON.stringify(map));
  } catch {}
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

  const teamTournaments = new Map<string, Set<string>>();

  for (const row of standings) {
    const entry = map.get(row.team_id);
    if (!entry) continue;

    if (!teamTournaments.has(row.team_id)) {
      teamTournaments.set(row.team_id, new Set());
    }
    if (row.tournament_id) {
      teamTournaments.get(row.team_id)!.add(row.tournament_id);
    }

    entry.played += Number(row.played) || 0;
    entry.wins += Number(row.wins) || 0;
    entry.draws += Number(row.draws) || 0;
    entry.losses += Number(row.losses) || 0;
    entry.goalsFor += Number(row.goals_for) || 0;
    entry.goalsAgainst += Number(row.goals_against) || 0;
  }

  for (const [teamId, tourneySet] of teamTournaments.entries()) {
    const entry = map.get(teamId);
    if (entry) {
      entry.tournaments = tourneySet.size;
      entry.rankingPoints += tourneySet.size * config.points_participation;
    }
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
