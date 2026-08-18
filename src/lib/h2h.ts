import { Champion, FixtureWithTeams, getMatchWinner, StandingRow, Team } from "@/lib/tff";

export interface H2HMatchResult {
  fixture: FixtureWithTeams;
  date: string;
  tournamentName: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  winnerTeamId: string | null; // null for draw
}

export interface FormMatch {
  fixtureId: string;
  opponentName: string;
  opponentShortName: string;
  result: "W" | "D" | "L";
  scoreText: string;
  date: string;
}

export interface TeamH2HStats {
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  overallWinPct: number;
  form: FormMatch[];
}

export interface H2HComparison {
  teamA: Team;
  teamB: Team;
  totalMatches: number;
  statsA: TeamH2HStats;
  statsB: TeamH2HStats;
  matches: H2HMatchResult[];
  probability: {
    winPctA: number;
    drawPct: number;
    winPctB: number;
  };
  biggestWinA: H2HMatchResult | null;
  biggestWinB: H2HMatchResult | null;
  highestScoringMatch: H2HMatchResult | null;
}

export function computeForm(teamId: string, allFixtures: FixtureWithTeams[], limit = 5): FormMatch[] {
  const completed = allFixtures
    .filter(
      (f) =>
        f.status === "completed" &&
        f.result &&
        (f.home_team_id === teamId || f.away_team_id === teamId)
    )
    .sort((a, b) => {
      const dateA = a.scheduled_date || a.result?.played_at || "";
      const dateB = b.scheduled_date || b.result?.played_at || "";
      return dateB.localeCompare(dateA);
    })
    .slice(0, limit);

  return completed.map((f) => {
    const isHome = f.home_team_id === teamId;
    const myScore = isHome ? Number(f.result!.home_score) || 0 : Number(f.result!.away_score) || 0;
    const oppScore = isHome ? Number(f.result!.away_score) || 0 : Number(f.result!.home_score) || 0;
    const opp = isHome ? f.away : f.home;

    let res: "W" | "D" | "L" = "D";
    if (myScore > oppScore) res = "W";
    else if (myScore < oppScore) res = "L";

    return {
      fixtureId: f.id,
      opponentName: opp?.name || "Unknown",
      opponentShortName: opp?.short_name || "UNK",
      result: res,
      scoreText: `${myScore}-${oppScore}`,
      date: f.scheduled_date || "",
    };
  });
}

export function computeH2HComparison(
  teamA: Team,
  teamB: Team,
  allFixtures: FixtureWithTeams[],
  allStandings: StandingRow[] = [],
  _champions: Champion[] = []
): H2HComparison {
  const directFixtures = allFixtures.filter(
    (f) =>
      f.status === "completed" &&
      f.result &&
      ((f.home_team_id === teamA.id && f.away_team_id === teamB.id) ||
        (f.home_team_id === teamB.id && f.away_team_id === teamA.id))
  );

  let winsA = 0;
  let winsB = 0;
  let draws = 0;
  let gfA = 0;
  let gfB = 0;
  let cleanSheetsA = 0;
  let cleanSheetsB = 0;
  let yellowA = 0;
  let yellowB = 0;
  let redA = 0;
  let redB = 0;

  let maxMarginA = 0;
  let maxMarginB = 0;
  let biggestWinA: H2HMatchResult | null = null;
  let biggestWinB: H2HMatchResult | null = null;
  let maxTotalGoals = -1;
  let highestScoringMatch: H2HMatchResult | null = null;

  const matchesList: H2HMatchResult[] = [];

  for (const f of directFixtures) {
    const res = f.result!;
    const isAHome = f.home_team_id === teamA.id;
    const scoreA = isAHome ? Number(res.home_score) || 0 : Number(res.away_score) || 0;
    const scoreB = isAHome ? Number(res.away_score) || 0 : Number(res.home_score) || 0;
    const yA = isAHome ? Number(res.home_yellow_cards) || 0 : Number(res.away_yellow_cards) || 0;
    const yB = isAHome ? Number(res.away_yellow_cards) || 0 : Number(res.home_yellow_cards) || 0;
    const rA = isAHome ? Number(res.home_red_cards) || 0 : Number(res.away_red_cards) || 0;
    const rB = isAHome ? Number(res.away_red_cards) || 0 : Number(res.home_red_cards) || 0;

    gfA += scoreA;
    gfB += scoreB;
    yellowA += yA;
    yellowB += yB;
    redA += rA;
    redB += rB;

    if (scoreB === 0) cleanSheetsA += 1;
    if (scoreA === 0) cleanSheetsB += 1;

    const { winnerTeamId } = getMatchWinner(f);
    let winnerId: string | null = winnerTeamId;

    if (winnerId === teamA.id) {
      winsA += 1;
      const margin = Math.max(1, scoreA - scoreB);
      if (margin > maxMarginA) {
        maxMarginA = margin;
        biggestWinA = {
          fixture: f,
          date: f.scheduled_date || res.played_at || "",
          tournamentName: f.tournament?.name || "TFF Tournament",
          homeTeamId: f.home_team_id || "",
          awayTeamId: f.away_team_id || "",
          homeScore: Number(res.home_score) || 0,
          awayScore: Number(res.away_score) || 0,
          winnerTeamId: winnerId,
        };
      }
    } else if (winnerId === teamB.id) {
      winsB += 1;
      const margin = Math.max(1, scoreB - scoreA);
      if (margin > maxMarginB) {
        maxMarginB = margin;
        biggestWinB = {
          fixture: f,
          date: f.scheduled_date || res.played_at || "",
          tournamentName: f.tournament?.name || "TFF Tournament",
          homeTeamId: f.home_team_id || "",
          awayTeamId: f.away_team_id || "",
          homeScore: Number(res.home_score) || 0,
          awayScore: Number(res.away_score) || 0,
          winnerTeamId: winnerId,
        };
      }
    } else {
      draws += 1;
    }

    const matchObj: H2HMatchResult = {
      fixture: f,
      date: f.scheduled_date || res.played_at || "",
      tournamentName: f.tournament?.name || "TFF Tournament",
      homeTeamId: f.home_team_id || "",
      awayTeamId: f.away_team_id || "",
      homeScore: Number(res.home_score) || 0,
      awayScore: Number(res.away_score) || 0,
      winnerTeamId: winnerId,
    };
    matchesList.push(matchObj);

    const totG = scoreA + scoreB;
    if (totG > maxTotalGoals) {
      maxTotalGoals = totG;
      highestScoringMatch = matchObj;
    }
  }

  // Calculate career statistics for Team A and Team B across all matches
  const calcCareerStats = (teamId: string) => {
    const rows = allStandings.filter((s) => s.team_id === teamId);
    let p = 0;
    let w = 0;
    for (const r of rows) {
      p += r.played;
      w += r.wins;
    }
    // Include completed knockout stage matches if any
    const koCompleted = allFixtures.filter(
      (f) =>
        (f.stage === "knockout" || !!f.round) &&
        f.status === "completed" &&
        f.result &&
        (f.home_team_id === teamId || f.away_team_id === teamId)
    );
    for (const f of koCompleted) {
      p += 1;
      const isHome = f.home_team_id === teamId;
      const myScore = isHome ? Number(f.result!.home_score) || 0 : Number(f.result!.away_score) || 0;
      const oppScore = isHome ? Number(f.result!.away_score) || 0 : Number(f.result!.home_score) || 0;
      if (myScore > oppScore) w += 1;
    }
    const winPct = p > 0 ? (w / p) * 100 : 50;
    return { p, w, winPct };
  };

  const careerA = calcCareerStats(teamA.id);
  const careerB = calcCareerStats(teamB.id);

  const formA = computeForm(teamA.id, allFixtures, 5);
  const formB = computeForm(teamB.id, allFixtures, 5);

  const formPts = (form: FormMatch[]) =>
    form.reduce((sum, item) => sum + (item.result === "W" ? 3 : item.result === "D" ? 1 : 0), 0);

  const ptsFormA = formPts(formA);
  const ptsFormB = formPts(formB);

  // Probability calculations
  let ratingA = 50;
  let ratingB = 50;

  if (directFixtures.length > 0) {
    const h2hPctA = (winsA + draws * 0.5) / directFixtures.length;
    const h2hPctB = (winsB + draws * 0.5) / directFixtures.length;
    ratingA = h2hPctA * 50 + (careerA.winPct / 100) * 30 + (ptsFormA / 15) * 20;
    ratingB = h2hPctB * 50 + (careerB.winPct / 100) * 30 + (ptsFormB / 15) * 20;
  } else {
    ratingA = (careerA.winPct / 100) * 60 + (ptsFormA / 15) * 40;
    ratingB = (careerB.winPct / 100) * 60 + (ptsFormB / 15) * 40;
  }

  // Normalize rating into win A %, draw %, win B %
  const totalRating = ratingA + ratingB || 100;
  let rawWinA = (ratingA / totalRating) * 78;
  let rawWinB = (ratingB / totalRating) * 78;
  let rawDraw = 22;

  // Fine tune draw chance based on draw tendencies
  const drawRatioA = directFixtures.length > 0 ? draws / directFixtures.length : 0.25;
  if (drawRatioA > 0.3) {
    rawDraw = 28;
    const rem = 72;
    rawWinA = (ratingA / totalRating) * rem;
    rawWinB = (ratingB / totalRating) * rem;
  }

  const winPctA = Math.round(rawWinA);
  const winPctB = Math.round(rawWinB);
  const drawPct = 100 - winPctA - winPctB;

  return {
    teamA,
    teamB,
    totalMatches: directFixtures.length,
    statsA: {
      wins: winsA,
      draws,
      losses: winsB,
      goalsScored: gfA,
      goalsConceded: gfB,
      cleanSheets: cleanSheetsA,
      yellowCards: yellowA,
      redCards: redA,
      overallWinPct: Math.round(careerA.winPct),
      form: formA,
    },
    statsB: {
      wins: winsB,
      draws,
      losses: winsA,
      goalsScored: gfB,
      goalsConceded: gfA,
      cleanSheets: cleanSheetsB,
      yellowCards: yellowB,
      redCards: redB,
      overallWinPct: Math.round(careerB.winPct),
      form: formB,
    },
    matches: matchesList,
    probability: {
      winPctA,
      drawPct,
      winPctB,
    },
    biggestWinA,
    biggestWinB,
    highestScoringMatch,
  };
}
