export interface GeneratedFixture {
  matchday: number;
  round: string;
  home_team_id: string;
  away_team_id: string;
}

/**
 * Circle-method round robin. Returns matchdays of pairings.
 * Odd team counts get an automatic BYE (that team simply doesn't play that matchday).
 */
export function roundRobin(teamIds: string[]): GeneratedFixture[] {
  const list: (string | null)[] = [...teamIds];
  if (list.length % 2 === 1) list.push(null); // BYE
  const n = list.length;
  const fixtures: GeneratedFixture[] = [];

  for (let round = 0; round < n - 1; round++) {
    for (let i = 0; i < n / 2; i++) {
      const a = list[i];
      const b = list[n - 1 - i];
      if (!a || !b) continue; // BYE
      const [home, away] = round % 2 === 0 ? [a, b] : [b, a];
      fixtures.push({
        matchday: round + 1,
        round: `Matchday ${round + 1}`,
        home_team_id: home,
        away_team_id: away,
      });
    }
    // rotate all but the first entry
    const fixed = list[0]!;
    const rest = list.slice(1);
    rest.unshift(rest.pop()!);
    list.splice(0, list.length, fixed, ...rest);
  }
  return fixtures;
}

export function doubleRoundRobin(teamIds: string[]): GeneratedFixture[] {
  const first = roundRobin(teamIds);
  const matchdays = Math.max(...first.map((f) => f.matchday));
  const second = first.map((f) => ({
    matchday: f.matchday + matchdays,
    round: `Matchday ${f.matchday + matchdays}`,
    home_team_id: f.away_team_id,
    away_team_id: f.home_team_id,
  }));
  return [...first, ...second];
}

const KNOCKOUT_ROUND_NAMES: Record<number, string> = {
  16: "Round of 16",
  8: "Quarter Final",
  4: "Semi Final",
  2: "Final",
};

/** Single elimination bracket for the first round only (later rounds are created on advance). */
export function singleElimination(teamIds: string[]): GeneratedFixture[] {
  const size = teamIds.length;
  const roundName = KNOCKOUT_ROUND_NAMES[size] ?? `Round of ${size}`;
  const fixtures: GeneratedFixture[] = [];
  for (let i = 0; i < Math.floor(size / 2); i++) {
    fixtures.push({
      matchday: 1,
      round: roundName,
      home_team_id: teamIds[i]!,
      away_team_id: teamIds[size - 1 - i]!,
    });
  }
  return fixtures;
}

export function nextKnockoutRound(currentRound: string): string | null {
  const order = ["Round of 16", "Quarter Final", "Semi Final", "Final"];
  const index = order.indexOf(currentRound);
  if (index === -1 || index === order.length - 1) return null;
  return order[index + 1]!;
}

export function generateFixtures(format: string, teamIds: string[]): GeneratedFixture[] {
  if (teamIds.length < 2) return [];
  switch (format) {
    case "double_round_robin":
      return doubleRoundRobin(teamIds);
    case "knockout":
      return singleElimination(teamIds);
    case "league":
    case "single_round_robin":
    case "group_stage":
    case "league_knockout":
    default:
      return roundRobin(teamIds);
  }
}

/** Guard against duplicates and self-matches before persisting. */
export function validateFixtures(fixtures: GeneratedFixture[]) {
  const seen = new Set<string>();
  for (const f of fixtures) {
    if (f.home_team_id === f.away_team_id) return "A team cannot play itself.";
    const key = `${f.home_team_id}-${f.away_team_id}`;
    if (seen.has(key)) return "Duplicate fixture detected.";
    seen.add(key);
  }
  return null;
}
