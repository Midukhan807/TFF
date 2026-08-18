import { FixtureWithTeams, getMatchWinner, parseResultPenalties, Team } from "@/lib/tff";

export interface TeamAnalytics {
  team: Team;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  goalDifference: number;
  attackPowerIndex: number; // Goals Scored / Match
  defenseSolidityIndex: number; // Goals Conceded / Match
  goalEfficiency: number; // GD / Match
  cleanSheets: number;
  cleanSheetPct: number;
  clutchWins: number; // 1-goal wins + penalty shootout wins
  clutchWinPct: number;
  recentForm: ("W" | "D" | "L")[];
}

export interface StatsLabOverview {
  totalMatches: number;
  totalGoals: number;
  avgGoalsPerMatch: number;
  cleanSheetsCount: number;
  cleanSheetPct: number;
  drawCount: number;
  drawPct: number;
  penaltiesCount: number;
  penaltiesPct: number;
  teamsAnalytics: TeamAnalytics[];
  topAttackingTeams: TeamAnalytics[];
  topDefensiveTeams: TeamAnalytics[];
  topEfficiencyTeams: TeamAnalytics[];
  topClutchTeams: TeamAnalytics[];
  highestScoringMatches: {
    fixture: FixtureWithTeams;
    totalGoals: number;
    homeScore: number;
    awayScore: number;
  }[];
}

export function computeStatsLab(
  teams: Team[],
  fixtures: FixtureWithTeams[]
): StatsLabOverview {
  const completedFixtures = fixtures.filter(
    (f) => f.status === "completed" && f.result
  );

  const totalMatches = completedFixtures.length;
  let totalGoals = 0;
  let cleanSheetsCount = 0;
  let drawCount = 0;
  let penaltiesCount = 0;

  const highestScoringList: {
    fixture: FixtureWithTeams;
    totalGoals: number;
    homeScore: number;
    awayScore: number;
  }[] = [];

  for (const f of completedFixtures) {
    const res = f.result!;
    const h = Number(res.home_score) || 0;
    const a = Number(res.away_score) || 0;
    const matchTotal = h + a;
    totalGoals += matchTotal;

    if (h === 0 || a === 0) cleanSheetsCount += 1;
    if (h === a) drawCount += 1;

    const { isPenalties } = getMatchWinner(f);
    if (isPenalties) penaltiesCount += 1;

    highestScoringList.push({
      fixture: f,
      totalGoals: matchTotal,
      homeScore: h,
      awayScore: a,
    });
  }

  highestScoringList.sort((a, b) => b.totalGoals - a.totalGoals);
  const topHighestScoringMatches = highestScoringList.slice(0, 6);

  const avgGoalsPerMatch = totalMatches > 0 ? Number((totalGoals / totalMatches).toFixed(2)) : 0;
  const cleanSheetPct = totalMatches > 0 ? Math.round((cleanSheetsCount / (totalMatches * 2)) * 100) : 0;
  const drawPct = totalMatches > 0 ? Math.round((drawCount / totalMatches) * 100) : 0;
  const penaltiesPct = totalMatches > 0 ? Math.round((penaltiesCount / totalMatches) * 100) : 0;

  // Build individual team analytics
  const teamsAnalytics: TeamAnalytics[] = teams.map((team) => {
    const teamFixtures = completedFixtures.filter(
      (f) => f.home_team_id === team.id || f.away_team_id === team.id
    );

    // Sort chronologically
    teamFixtures.sort((a, b) => {
      const dA = new Date(a.scheduled_date || a.created_at || 0).getTime();
      const dB = new Date(b.scheduled_date || b.created_at || 0).getTime();
      return dA - dB;
    });

    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsScored = 0;
    let goalsConceded = 0;
    let cleanSheets = 0;
    let clutchWins = 0;
    const recentForm: ("W" | "D" | "L")[] = [];

    for (const f of teamFixtures) {
      const res = f.result!;
      const isHome = f.home_team_id === team.id;
      const gf = isHome ? Number(res.home_score) || 0 : Number(res.away_score) || 0;
      const ga = isHome ? Number(res.away_score) || 0 : Number(res.home_score) || 0;

      goalsScored += gf;
      goalsConceded += ga;
      if (ga === 0) cleanSheets += 1;

      const { winnerTeamId, isPenalties } = getMatchWinner(f);

      if (winnerTeamId === team.id) {
        wins += 1;
        recentForm.push("W");
        const margin = gf - ga;
        if (margin === 1 || isPenalties) {
          clutchWins += 1;
        }
      } else if (winnerTeamId !== null && winnerTeamId !== team.id) {
        losses += 1;
        recentForm.push("L");
      } else {
        draws += 1;
        recentForm.push("D");
      }
    }

    const matchesPlayed = teamFixtures.length;
    const goalDifference = goalsScored - goalsConceded;
    const attackPowerIndex = matchesPlayed > 0 ? Number((goalsScored / matchesPlayed).toFixed(2)) : 0;
    const defenseSolidityIndex = matchesPlayed > 0 ? Number((goalsConceded / matchesPlayed).toFixed(2)) : 0;
    const goalEfficiency = matchesPlayed > 0 ? Number((goalDifference / matchesPlayed).toFixed(2)) : 0;
    const cleanSheetPctTeam = matchesPlayed > 0 ? Math.round((cleanSheets / matchesPlayed) * 100) : 0;
    const clutchWinPct = matchesPlayed > 0 ? Math.round((clutchWins / matchesPlayed) * 100) : 0;

    return {
      team,
      matchesPlayed,
      wins,
      draws,
      losses,
      goalsScored,
      goalsConceded,
      goalDifference,
      attackPowerIndex,
      defenseSolidityIndex,
      goalEfficiency,
      cleanSheets,
      cleanSheetPct: cleanSheetPctTeam,
      clutchWins,
      clutchWinPct,
      recentForm: recentForm.slice(-5),
    };
  });

  // Filter out teams with 0 matches for rankings
  const activeTeams = teamsAnalytics.filter((t) => t.matchesPlayed > 0);

  const topAttackingTeams = [...activeTeams].sort((a, b) => b.attackPowerIndex - a.attackPowerIndex).slice(0, 5);
  const topDefensiveTeams = [...activeTeams].sort((a, b) => a.defenseSolidityIndex - b.defenseSolidityIndex).slice(0, 5);
  const topEfficiencyTeams = [...activeTeams].sort((a, b) => b.goalEfficiency - a.goalEfficiency).slice(0, 5);
  const topClutchTeams = [...activeTeams].sort((a, b) => b.clutchWins - a.clutchWins).slice(0, 5);

  return {
    totalMatches,
    totalGoals,
    avgGoalsPerMatch,
    cleanSheetsCount,
    cleanSheetPct,
    drawCount,
    drawPct,
    penaltiesCount,
    penaltiesPct,
    teamsAnalytics,
    topAttackingTeams,
    topDefensiveTeams,
    topEfficiencyTeams,
    topClutchTeams,
    highestScoringMatches: topHighestScoringMatches,
  };
}
