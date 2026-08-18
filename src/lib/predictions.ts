import { supabase } from "@/integrations/supabase/client";
import { parseResultPenalties, type FixtureWithTeams } from "@/lib/tff";

export type PredictionChoice = "home" | "draw" | "away";

export interface PredictionVote {
  id: string;
  fixture_id: string;
  visitor_id: string;
  user_name: string;
  prediction: PredictionChoice;
  created_at?: string;
}

export interface PredictionStats {
  totalVotes: number;
  homeVotes: number;
  drawVotes: number;
  awayVotes: number;
  homePct: number;
  drawPct: number;
  awayPct: number;
}

export interface PredictorLeaderboardRow {
  userName: string;
  totalPredictions: number;
  correctCount: number;
  points: number;
  accuracyPct: number;
}

const VISITOR_ID_KEY = "tff_visitor_id";
const USER_HANDLE_KEY = "tff_user_handle";
const LOCAL_VOTES_KEY = "tff_local_prediction_votes";

// Manage visitor ID in localStorage
export function getVisitorId(): string {
  if (typeof window === "undefined") return "guest_visitor";
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = "v_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

// Manage user handle in localStorage
export function getStoredHandle(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(USER_HANDLE_KEY) || "";
}

export function setStoredHandle(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_HANDLE_KEY, name.trim());
}

// Get local votes fallback array
function getLocalVotes(): PredictionVote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_VOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalVote(vote: PredictionVote): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalVotes();
    const filtered = existing.filter(
      (v) => !(v.fixture_id === vote.fixture_id && v.visitor_id === vote.visitor_id)
    );
    filtered.push(vote);
    localStorage.setItem(LOCAL_VOTES_KEY, JSON.stringify(filtered));
  } catch {}
}

// Fetch prediction votes for a single fixture
export async function fetchPredictionsForFixture(fixtureId: string): Promise<PredictionVote[]> {
  try {
    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("fixture_id", fixtureId);

    if (error || !data) {
      // Fallback to local votes if table does not exist
      const local = getLocalVotes().filter((v) => v.fixture_id === fixtureId);
      return local;
    }
    return data as unknown as PredictionVote[];
  } catch {
    const local = getLocalVotes().filter((v) => v.fixture_id === fixtureId);
    return local;
  }
}

// Fetch all predictions
export async function fetchAllPredictions(): Promise<PredictionVote[]> {
  try {
    const { data, error } = await supabase
      .from("predictions")
      .select("*");

    if (error || !data) {
      return getLocalVotes();
    }
    const dbVotes = data as unknown as PredictionVote[];
    const localVotes = getLocalVotes();
    
    // Merge DB and local votes by visitor_id + fixture_id
    const combinedMap = new Map<string, PredictionVote>();
    for (const v of [...dbVotes, ...localVotes]) {
      combinedMap.set(`${v.fixture_id}_${v.visitor_id}`, v);
    }
    return Array.from(combinedMap.values());
  } catch {
    return getLocalVotes();
  }
}

// Submit or update a prediction vote
export async function submitPredictionVote(
  fixtureId: string,
  choice: PredictionChoice,
  userName?: string
): Promise<PredictionVote> {
  const visitorId = getVisitorId();
  const nameToUse = userName?.trim() || getStoredHandle() || "Anonymous Fan";

  if (userName?.trim()) {
    setStoredHandle(userName.trim());
  }

  const votePayload: PredictionVote = {
    id: `vote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    fixture_id: fixtureId,
    visitor_id: visitorId,
    user_name: nameToUse,
    prediction: choice,
    created_at: new Date().toISOString(),
  };

  saveLocalVote(votePayload);

  try {
    // Upsert into Supabase predictions table if available
    const { data, error } = await supabase
      .from("predictions")
      .upsert(
        {
          fixture_id: fixtureId,
          visitor_id: visitorId,
          user_name: nameToUse,
          prediction: choice,
        },
        { onConflict: "fixture_id,visitor_id" }
      )
      .select()
      .single();

    if (!error && data) {
      return data as unknown as PredictionVote;
    }
  } catch {}

  return votePayload;
}

// Compute percentage statistics for a set of votes
export function computePredictionStats(votes: PredictionVote[]): PredictionStats {
  const totalVotes = votes.length;
  if (totalVotes === 0) {
    return {
      totalVotes: 0,
      homeVotes: 0,
      drawVotes: 0,
      awayVotes: 0,
      homePct: 34,
      drawPct: 33,
      awayPct: 33,
    };
  }

  const homeVotes = votes.filter((v) => v.prediction === "home").length;
  const drawVotes = votes.filter((v) => v.prediction === "draw").length;
  const awayVotes = votes.filter((v) => v.prediction === "away").length;

  const homePct = Math.round((homeVotes / totalVotes) * 100);
  const drawPct = Math.round((drawVotes / totalVotes) * 100);
  const awayPct = Math.max(0, 100 - homePct - drawPct);

  return {
    totalVotes,
    homeVotes,
    drawVotes,
    awayVotes,
    homePct,
    drawPct,
    awayPct,
  };
}

// Compute Predictor Leaderboard rankings
export function computePredictionLeaderboard(
  completedFixtures: FixtureWithTeams[],
  allVotes: PredictionVote[]
): PredictorLeaderboardRow[] {
  const fixtureOutcomeMap = new Map<string, "home" | "draw" | "away">();

  for (const f of completedFixtures) {
    if (f.status === "completed" && f.result) {
      const res = f.result;
      const homeScore = Number(res.home_score) || 0;
      const awayScore = Number(res.away_score) || 0;

      if (homeScore > awayScore) {
        fixtureOutcomeMap.set(f.id, "home");
      } else if (awayScore > homeScore) {
        fixtureOutcomeMap.set(f.id, "away");
      } else {
        // If tied regular score, check penalties winner or count draw
        const { homePen, awayPen } = parseResultPenalties(res);
        if (homePen !== null && awayPen !== null) {
          fixtureOutcomeMap.set(f.id, homePen > awayPen ? "home" : "away");
        } else {
          fixtureOutcomeMap.set(f.id, "draw");
        }
      }
    }
  }

  const userStatsMap = new Map<
    string,
    { total: number; correct: number; points: number }
  >();

  for (const vote of allVotes) {
    const outcome = fixtureOutcomeMap.get(vote.fixture_id);
    if (!outcome) continue; // Match not completed yet

    const key = vote.user_name || "Anonymous Fan";
    const current = userStatsMap.get(key) || { total: 0, correct: 0, points: 0 };
    current.total += 1;

    if (vote.prediction === outcome) {
      current.correct += 1;
      current.points += 3; // +3 points for correct prediction
    }

    userStatsMap.set(key, current);
  }

  const rows: PredictorLeaderboardRow[] = [];
  for (const [userName, stats] of userStatsMap.entries()) {
    rows.push({
      userName,
      totalPredictions: stats.total,
      correctCount: stats.correct,
      points: stats.points,
      accuracyPct: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    });
  }

  return rows.sort((a, b) => b.points - a.points || b.accuracyPct - a.accuracyPct);
}
