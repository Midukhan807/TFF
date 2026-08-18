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
  logo_video_url?: string | null;
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
  home_penalties?: number | null;
  away_penalties?: number | null;
  home_yellow_cards?: number;
  away_yellow_cards?: number;
  home_red_cards?: number;
  away_red_cards?: number;
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
  yellow_cards?: number;
  red_cards?: number;
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

export interface TournamentAward {
  tournament_id: string;
  best_goal_player?: string | null;
  best_goal_team_id?: string | null;
  best_goal_description?: string | null;
  best_goal_video_url?: string | null;
  top_scorer_team_id?: string | null;
  best_defense_team_id?: string | null;
  best_goalkeeper?: string | null;
  custom_honors?: string | null;
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

export function parseResultPenalties(result: MatchResult | null): { homePen: number | null; awayPen: number | null } {
  if (!result) return { homePen: null, awayPen: null };

  if (typeof result.home_penalties === "number" && typeof result.away_penalties === "number") {
    return { homePen: result.home_penalties, awayPen: result.away_penalties };
  }

  if (result.notes) {
    try {
      if (result.notes.startsWith("{") && result.notes.endsWith("}")) {
        const parsed = JSON.parse(result.notes);
        if (typeof parsed.home_penalties === "number" && typeof parsed.away_penalties === "number") {
          return { homePen: Number(parsed.home_penalties), awayPen: Number(parsed.away_penalties) };
        }
      }
      const match = result.notes.match(/PEN:\s*(\d+)\s*[-:]\s*(\d+)/i) || result.notes.match(/penalties:\s*(\d+)\s*[-:]\s*(\d+)/i);
      if (match) {
        return { homePen: parseInt(match[1], 10), awayPen: parseInt(match[2], 10) };
      }
    } catch {}
  }
  return { homePen: null, awayPen: null };
}

export function getMatchWinner(fixture: FixtureWithTeams): { winnerTeamId: string | null; isPenalties: boolean } {
  const result = fixture.result;
  if (!result) return { winnerTeamId: null, isPenalties: false };

  const homeScore = Number(result.home_score) || 0;
  const awayScore = Number(result.away_score) || 0;

  if (homeScore > awayScore) {
    return { winnerTeamId: fixture.home_team_id, isPenalties: false };
  }
  if (awayScore > homeScore) {
    return { winnerTeamId: fixture.away_team_id, isPenalties: false };
  }

  // Tied score -> check penalties
  const { homePen, awayPen } = parseResultPenalties(result);
  if (homePen !== null && awayPen !== null) {
    if (homePen > awayPen) {
      return { winnerTeamId: fixture.home_team_id, isPenalties: true };
    }
    if (awayPen > homePen) {
      return { winnerTeamId: fixture.away_team_id, isPenalties: true };
    }
  }

  return { winnerTeamId: null, isPenalties: false };
}

export interface TwoLegAggregateResult {
  teamAId: string | null;
  teamBId: string | null;
  totalGoalsA: number;
  totalGoalsB: number;
  winnerTeamId: string | null;
  isPenalties: boolean;
  penA: number | null;
  penB: number | null;
  isCompleted: boolean;
}

export function computeTwoLegAggregate(
  leg1?: FixtureWithTeams | null,
  leg2?: FixtureWithTeams | null
): TwoLegAggregateResult {
  if (!leg1) {
    return {
      teamAId: null,
      teamBId: null,
      totalGoalsA: 0,
      totalGoalsB: 0,
      winnerTeamId: null,
      isPenalties: false,
      penA: null,
      penB: null,
      isCompleted: false,
    };
  }

  const teamAId = leg1.home_team_id;
  const teamBId = leg1.away_team_id;

  const res1 = leg1.result;
  const res2 = leg2?.result;

  const leg1A = res1 ? Number(res1.home_score) || 0 : 0;
  const leg1B = res1 ? Number(res1.away_score) || 0 : 0;

  // In Leg 2, Team B is home and Team A is away
  const leg2B = res2 ? (leg2?.home_team_id === teamBId ? Number(res2.home_score) || 0 : Number(res2.away_score) || 0) : 0;
  const leg2A = res2 ? (leg2?.away_team_id === teamAId ? Number(res2.away_score) || 0 : Number(res2.home_score) || 0) : 0;

  const totalGoalsA = leg1A + leg2A;
  const totalGoalsB = leg1B + leg2B;

  const isCompleted = !!(res1 && res2);
  let winnerTeamId: string | null = null;
  let isPenalties = false;
  let penA: number | null = null;
  let penB: number | null = null;

  if (isCompleted) {
    if (totalGoalsA > totalGoalsB) {
      winnerTeamId = teamAId;
    } else if (totalGoalsB > totalGoalsA) {
      winnerTeamId = teamBId;
    } else if (res2) {
      // Tied aggregate -> penalties on Leg 2
      const { homePen, awayPen } = parseResultPenalties(res2);
      if (homePen !== null && awayPen !== null) {
        const homeIsTeamB = leg2?.home_team_id === teamBId;
        penB = homeIsTeamB ? homePen : awayPen;
        penA = homeIsTeamB ? awayPen : homePen;

        if (penA > penB) {
          winnerTeamId = teamAId;
          isPenalties = true;
        } else if (penB > penA) {
          winnerTeamId = teamBId;
          isPenalties = true;
        }
      }
    }
  }

  return {
    teamAId,
    teamBId,
    totalGoalsA,
    totalGoalsB,
    winnerTeamId,
    isPenalties,
    penA,
    penB,
    isCompleted,
  };
}

/* --------------------------------- queries -------------------------------- */

export async function fetchTeams(): Promise<Team[]> {
  const { data, error } = await db.from("teams").select("*").eq("is_demo", false).order("name");
  if (error) throw error;
  return (data ?? []) as Team[];
}

export function parseSeasonNumber(name: string): number | null {
  if (!name) return null;
  const match = name.match(/season\s*[-_]?\s*(\d+)/i) || name.match(/\bs(\d+)\b/i);
  return match ? parseInt(match[1], 10) : null;
}

export function sortTournaments<T extends { name: string; season_year?: number | null; start_date?: string | null; created_at?: string }>(
  tournaments: T[]
): T[] {
  return [...tournaments].sort((a, b) => {
    const seasonA = parseSeasonNumber(a.name);
    const seasonB = parseSeasonNumber(b.name);

    if (seasonA !== null && seasonB !== null) {
      if (seasonA !== seasonB) return seasonB - seasonA;
    } else if (seasonA !== null) {
      return -1;
    } else if (seasonB !== null) {
      return 1;
    }

    const yearA = a.season_year ?? 0;
    const yearB = b.season_year ?? 0;
    if (yearA !== yearB) return yearB - yearA;

    const dateA = a.start_date || a.created_at || "";
    const dateB = b.start_date || b.created_at || "";
    if (dateA !== dateB) return dateB.localeCompare(dateA);

    return a.name.localeCompare(b.name);
  });
}

export async function fetchTournaments(): Promise<any[]> {
  const { data, error } = await db
    .from("tournaments")
    .select("*, tournament_teams(count), fixtures(count)")
    .eq("is_demo", false)
    .order("start_date", { ascending: false });
  if (error) throw error;
  return sortTournaments(data ?? []);
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

export async function fetchAllFixtures(): Promise<FixtureWithTeams[]> {
  const { data, error } = await db
    .from("fixtures")
    .select(FIXTURE_SELECT)
    .order("scheduled_date", { ascending: false });
  if (error) throw error;
  const normalized = ((data ?? []) as any[]).map(normalizeFixture);
  return normalized.filter((f: any) => !f.tournament?.is_demo);
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

export function getTournamentAwards(tournamentId: string): TournamentAward | null {
  try {
    const raw = localStorage.getItem("tff_tournament_awards");
    if (!raw) return null;
    const allMap: Record<string, TournamentAward> = JSON.parse(raw);
    return allMap[tournamentId] || null;
  } catch {
    return null;
  }
}

export function saveTournamentAwards(tournamentId: string, award: TournamentAward): void {
  try {
    const raw = localStorage.getItem("tff_tournament_awards");
    const allMap: Record<string, TournamentAward> = raw ? JSON.parse(raw) : {};
    allMap[tournamentId] = award;
    localStorage.setItem("tff_tournament_awards", JSON.stringify(allMap));
  } catch (e) {
    console.error("Failed to save tournament awards to localStorage", e);
  }
}

async function getFixtureCardsMap(tournamentId?: string): Promise<Map<string, { yellow: number; red: number }>> {
  const cardsMap = new Map<string, { yellow: number; red: number }>();
  try {
    let query = db.from("fixtures").select("home_team_id, away_team_id, tournament_id, results(home_yellow_cards, away_yellow_cards, home_red_cards, away_red_cards)").eq("status", "completed");
    if (tournamentId) {
      query = query.eq("tournament_id", tournamentId);
    }
    const { data, error } = await query;
    if (error || !data) return cardsMap;

    for (const f of data) {
      const res = Array.isArray(f.results) ? f.results[0] : f.results;
      if (!res) continue;

      if (f.home_team_id) {
        const key = tournamentId ? f.home_team_id : `${f.tournament_id}_${f.home_team_id}`;
        const cur = cardsMap.get(key) || { yellow: 0, red: 0 };
        cur.yellow += Number(res.home_yellow_cards) || 0;
        cur.red += Number(res.home_red_cards) || 0;
        cardsMap.set(key, cur);
      }
      if (f.away_team_id) {
        const key = tournamentId ? f.away_team_id : `${f.tournament_id}_${f.away_team_id}`;
        const cur = cardsMap.get(key) || { yellow: 0, red: 0 };
        cur.yellow += Number(res.away_yellow_cards) || 0;
        cur.red += Number(res.away_red_cards) || 0;
        cardsMap.set(key, cur);
      }
    }
  } catch (e) {
    console.error("Error fetching fixture cards", e);
  }
  return cardsMap;
}

export async function fetchStandings(tournamentId: string): Promise<StandingRow[]> {
  const manual = getManualStandings(tournamentId);
  let rows: StandingRow[] = [];
  if (manual.length > 0) {
    rows = manual;
  } else {
    const { data, error } = await db.from("standings").select("*").eq("tournament_id", tournamentId);
    if (error) throw error;
    rows = (data ?? []) as StandingRow[];
  }

  try {
    const cardsMap = await getFixtureCardsMap(tournamentId);
    if (cardsMap.size > 0) {
      return rows.map((row) => {
        const cards = cardsMap.get(row.team_id);
        if (!cards) return row;
        return {
          ...row,
          yellow_cards: Math.max(Number(row.yellow_cards) || 0, cards.yellow),
          red_cards: Math.max(Number(row.red_cards) || 0, cards.red),
        };
      });
    }
  } catch {}

  return rows;
}

export async function fetchAllStandings(): Promise<StandingRow[]> {
  const { data, error } = await db.from("standings").select("*, tournament:tournament_id(id,is_demo)");
  let dbRows = ((data ?? []) as any[]).filter((row) => !row.tournament?.is_demo) as StandingRow[];

  const manualAll = getManualStandings();
  let rows: StandingRow[] = [];
  if (manualAll.length > 0) {
    const manualTourneyIds = new Set(manualAll.map((m) => m.tournament_id));
    dbRows = dbRows.filter((r) => !manualTourneyIds.has(r.tournament_id));
    rows = [...dbRows, ...manualAll];
  } else {
    rows = dbRows;
  }

  try {
    const cardsMap = await getFixtureCardsMap();
    if (cardsMap.size > 0) {
      return rows.map((row) => {
        const key = `${row.tournament_id}_${row.team_id}`;
        const cards = cardsMap.get(key) || cardsMap.get(row.team_id);
        if (!cards) return row;
        return {
          ...row,
          yellow_cards: Math.max(Number(row.yellow_cards) || 0, cards.yellow),
          red_cards: Math.max(Number(row.red_cards) || 0, cards.red),
        };
      });
    }
  } catch {}

  return rows;
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

export function getTeamVideoLogo(team: any): string | null {
  if (!team) return null;
  if (team.logo_video_url) return team.logo_video_url;

  if (typeof window !== "undefined" && team.id) {
    try {
      const stored = localStorage.getItem("tff_team_video_logos");
      if (stored) {
        const map = JSON.parse(stored);
        if (map[team.id]) return map[team.id];
      }
    } catch {}
  }

  // Fallback default animated logo for DEMONIC FC
  if (
    team.name?.toLowerCase().includes("demonic") ||
    team.short_name?.toUpperCase() === "DMN"
  ) {
    return "/Video Project 16.mp4";
  }

  return null;
}

export function setTeamVideoLogo(teamId: string, videoUrl: string | null) {
  if (typeof window === "undefined" || !teamId) return;
  try {
    const stored = localStorage.getItem("tff_team_video_logos");
    const map = stored ? JSON.parse(stored) : {};
    if (videoUrl) {
      map[teamId] = videoUrl;
    } else {
      delete map[teamId];
    }
    localStorage.setItem("tff_team_video_logos", JSON.stringify(map));
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
  yellowCards: number;
  redCards: number;
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
  fixtures?: FixtureWithTeams[],
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
      yellowCards: 0,
      redCards: 0,
      titles: 0,
      rankingPoints: 0,
    });
  }

  const teamTournaments = new Map<string, Set<string>>();

  // 1. Group stage / League standings stats
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
    entry.yellowCards += Number(row.yellow_cards) || 0;
    entry.redCards += Number(row.red_cards) || 0;
  }

  // 2. Knockout stage matches and stage reach points
  if (fixtures && fixtures.length > 0) {
    const teamKnockoutRounds = new Map<string, Set<string>>();

    for (const f of fixtures) {
      if (!f.home_team_id || !f.away_team_id) continue;
      const isKnockout = f.stage === "knockout" || !!f.round;

      // Track tournament participation
      if (f.tournament_id) {
        if (!teamTournaments.has(f.home_team_id)) teamTournaments.set(f.home_team_id, new Set());
        if (!teamTournaments.has(f.away_team_id)) teamTournaments.set(f.away_team_id, new Set());
        teamTournaments.get(f.home_team_id)!.add(f.tournament_id);
        teamTournaments.get(f.away_team_id)!.add(f.tournament_id);
      }

      if (isKnockout && f.round && f.tournament_id) {
        const roundName = f.round.trim();
        const homeKey = `${f.home_team_id}_${f.tournament_id}`;
        const awayKey = `${f.away_team_id}_${f.tournament_id}`;

        if (!teamKnockoutRounds.has(homeKey)) teamKnockoutRounds.set(homeKey, new Set());
        if (!teamKnockoutRounds.has(awayKey)) teamKnockoutRounds.set(awayKey, new Set());
        teamKnockoutRounds.get(homeKey)!.add(roundName);
        teamKnockoutRounds.get(awayKey)!.add(roundName);
      }

      // Record match results for completed knockout fixtures
      if (isKnockout && f.status === "completed" && f.result) {
        const homeEntry = map.get(f.home_team_id);
        const awayEntry = map.get(f.away_team_id);
        const hs = Number(f.result.home_score) || 0;
        const as = Number(f.result.away_score) || 0;

        if (homeEntry) {
          homeEntry.played += 1;
          homeEntry.goalsFor += hs;
          homeEntry.goalsAgainst += as;
          if (hs > as) homeEntry.wins += 1;
          else if (hs < as) homeEntry.losses += 1;
          else homeEntry.draws += 1;
        }

        if (awayEntry) {
          awayEntry.played += 1;
          awayEntry.goalsFor += as;
          awayEntry.goalsAgainst += hs;
          if (as > hs) awayEntry.wins += 1;
          else if (as < hs) awayEntry.losses += 1;
          else awayEntry.draws += 1;
        }
      }
    }

    // Award knockout stage ranking points (Semi Final / Quarter Final reach)
    for (const [key, rounds] of teamKnockoutRounds.entries()) {
      const [teamId, tournamentId] = key.split("_");
      const entry = map.get(teamId);
      if (!entry) continue;

      const champRow = champions.find((c) => c.tournament_id === tournamentId);
      const isWinner = champRow?.champion_team_id === teamId;
      const isRunnerUp = champRow?.runner_up_team_id === teamId;
      const isThird = champRow?.third_place_team_id === teamId;

      if (!isWinner && !isRunnerUp && !isThird) {
        if (rounds.has("Semi Final") || rounds.has("semi_final")) {
          entry.rankingPoints += config.points_semi_final;
        } else if (rounds.has("Quarter Final") || rounds.has("quarter_final")) {
          entry.rankingPoints += config.points_quarter_final;
        }
      }
    }
  }

  // 3. Participation points
  for (const [teamId, tourneySet] of teamTournaments.entries()) {
    const entry = map.get(teamId);
    if (entry) {
      entry.tournaments = tourneySet.size;
      entry.rankingPoints += tourneySet.size * config.points_participation;
    }
  }

  // 4. Champion & Runner Up points
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
    (a, b) => b.rankingPoints - a.rankingPoints || b.titles - a.titles || b.wins - a.wins || b.goalsFor - a.goalsFor,
  );
}

export function calculateTournamentMVP(
  playerStats: PlayerStat[],
  championTeamId?: string | null,
): { player: PlayerStat; score: number } | null {
  if (!playerStats || playerStats.length === 0) return null;

  const rankedPlayers = [...playerStats].map((p) => {
    // Weighted Performance Score formula:
    // (MOTM * 10) + (Goals * 3) + (Assists * 2) - (Yellow Cards * 1) - (Red Cards * 3)
    let rawScore =
      (p.motm || 0) * 10 +
      (p.goals || 0) * 3 +
      (p.assists || 0) * 2 -
      (p.yellow_cards || 0) * 1 -
      (p.red_cards || 0) * 3;

    // 1.2x Champion team multiplier
    if (championTeamId && p.team_id && p.team_id === championTeamId) {
      rawScore = rawScore * 1.2;
    }

    return { player: p, score: Math.round(rawScore * 10) / 10 };
  });

  rankedPlayers.sort(
    (a, b) =>
      b.score - a.score ||
      (b.player.goals || 0) - (a.player.goals || 0) ||
      (b.player.motm || 0) - (a.player.motm || 0),
  );

  return rankedPlayers[0] ?? null;
}

