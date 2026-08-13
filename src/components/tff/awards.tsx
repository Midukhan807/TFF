import { Award, Flame, Goal, Shield, Sparkles, Trophy, User } from "lucide-react";
import { TeamLogo } from "@/components/tff/branding";
import {
  getTournamentAwards,
  sortStandings,
  type Champion,
  type FixtureWithTeams,
  type PlayerStat,
  type StandingRow,
  type Team,
  type Tournament,
} from "@/lib/tff";

interface TournamentAwardsProps {
  tournament: Tournament;
  completedFixtures: FixtureWithTeams[];
  standings: StandingRow[];
  teamsMap: Map<string, Team>;
  champion?: Champion | null;
  playerStats?: PlayerStat[];
}

export function TournamentAwardsSection({
  tournament,
  completedFixtures,
  standings,
  teamsMap,
  champion,
  playerStats = [],
}: TournamentAwardsProps) {
  // 1. Custom / Manual awards set by Admin
  const customAward = getTournamentAwards(tournament.id);

  // 2. Computed Team Awards from standings & fixtures
  const ranked = sortStandings(standings);
  const topScoringTeamRow = [...ranked].sort((a, b) => b.goals_for - a.goals_for)[0];
  const bestDefenseTeamRow = [...ranked].sort((a, b) => a.goals_against - b.goals_against)[0];

  const topScoringTeam = topScoringTeamRow?.team_id ? teamsMap.get(topScoringTeamRow.team_id) : null;
  const bestDefenseTeam = bestDefenseTeamRow?.team_id ? teamsMap.get(bestDefenseTeamRow.team_id) : null;

  // Custom award team overrides
  const bestGoalTeam = customAward?.best_goal_team_id
    ? teamsMap.get(customAward.best_goal_team_id)
    : null;

  // 3. Computed Match Thriller / Highest Scoring Match
  const matchThriller = [...completedFixtures].sort(
    (a, b) =>
      (b.result?.home_score ?? 0) + (b.result?.away_score ?? 0) -
      ((a.result?.home_score ?? 0) + (a.result?.away_score ?? 0)),
  )[0];

  // 4. Player Stats Awards (Top Scorer & MVP)
  const topPlayerStat = [...playerStats].sort((a, b) => b.goals - a.goals)[0];
  const mvpStat = [...playerStats].sort((a, b) => b.motm - a.motm)[0];

  const topScorerName = customAward?.top_scorer_player || topPlayerStat?.player_name || champion?.top_scorer || "TBD";
  const mvpName = champion?.mvp || mvpStat?.player_name || "TBD";

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-primary/10 to-purple-500/10 border border-amber-500/30 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400">
              <Trophy className="size-5" />
              <span className="label-caps font-semibold">Official Honors</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-white mt-1">
              {tournament.name} — Tournament Awards
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Celebrating outstanding team performances, spectacular goals, top scorers, and tournament MVPs.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Award Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. BEST GOAL OF THE TOURNAMENT */}
        <div className="panel relative overflow-hidden p-6 border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="size-5" />
              <span className="label-caps font-semibold">Goal of the Tournament</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-display">
              SPECTACULAR
            </span>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <TeamLogo
              name={bestGoalTeam?.name ?? "TFF"}
              shortName={bestGoalTeam?.short_name}
              color={bestGoalTeam?.team_color}
              logoUrl={bestGoalTeam?.logo_url}
              size="lg"
            />
            <div>
              <p className="font-display text-2xl text-white">
                {customAward?.best_goal_player || "Nomination Open"}
              </p>
              <p className="text-xs text-amber-400/90 font-medium">
                {bestGoalTeam?.name || "TFF League Match"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground line-clamp-3 bg-zinc-900/60 p-3 rounded-lg border border-border/40">
            {customAward?.best_goal_description ||
              "Awarded for the most technical, powerful, or decisive goal scored during this tournament edition."}
          </p>
        </div>

        {/* 2. TOP SCORING TEAM (GOLDEN BOOT TEAM) */}
        <div className="panel relative overflow-hidden p-6 border-primary/40 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Goal className="size-5" />
              <span className="label-caps font-semibold">Top Scoring Team</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-display">
              ATTACKING POWER
            </span>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <TeamLogo
              name={topScoringTeam?.name ?? "TBD"}
              shortName={topScoringTeam?.short_name}
              color={topScoringTeam?.team_color}
              logoUrl={topScoringTeam?.logo_url}
              size="lg"
            />
            <div>
              <p className="font-display text-2xl text-white">
                {topScoringTeam?.name ?? "To be determined"}
              </p>
              <p className="text-xs text-primary font-medium">
                {topScoringTeamRow ? `${topScoringTeamRow.goals_for} Goals Scored` : "0 Goals"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground bg-zinc-900/60 p-3 rounded-lg border border-border/40">
            Awarded to the team with the highest total goal output across all tournament matches.
          </p>
        </div>

        {/* 3. BEST DEFENSIVE TEAM (GOLDEN GLOVE) */}
        <div className="panel relative overflow-hidden p-6 border-blue-500/40 bg-gradient-to-b from-blue-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400">
              <Shield className="size-5" />
              <span className="label-caps font-semibold">Best Defensive Team</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-display">
              IRON DEFENSE
            </span>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <TeamLogo
              name={bestDefenseTeam?.name ?? "TBD"}
              shortName={bestDefenseTeam?.short_name}
              color={bestDefenseTeam?.team_color}
              logoUrl={bestDefenseTeam?.logo_url}
              size="lg"
            />
            <div>
              <p className="font-display text-2xl text-white">
                {bestDefenseTeam?.name ?? "To be determined"}
              </p>
              <p className="text-xs text-blue-400 font-medium">
                {bestDefenseTeamRow ? `${bestDefenseTeamRow.goals_against} Goals Conceded` : "0 Conceded"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground bg-zinc-900/60 p-3 rounded-lg border border-border/40">
            Awarded to the side maintaining the tightest defensive record with the fewest goals conceded.
          </p>
        </div>

        {/* 4. PLAYER OF THE TOURNAMENT (MVP) */}
        <div className="panel relative overflow-hidden p-6 border-purple-500/40 bg-gradient-to-b from-purple-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400">
              <Award className="size-5" />
              <span className="label-caps font-semibold">Tournament MVP</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-display">
              MOST VALUABLE
            </span>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="size-14 rounded-full bg-purple-500/10 border-2 border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <User className="size-7" />
            </div>
            <div>
              <p className="font-display text-2xl text-white">{mvpName}</p>
              <p className="text-xs text-purple-400 font-medium">
                {mvpStat ? `${mvpStat.motm} Man of the Match Awards` : "Official TFF MVP"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground bg-zinc-900/60 p-3 rounded-lg border border-border/40">
            Recognizing the standout player who delivered game-changing performances throughout the competition.
          </p>
        </div>

        {/* 5. GOLDEN BOOT PLAYER */}
        <div className="panel relative overflow-hidden p-6 border-yellow-500/40 bg-gradient-to-b from-yellow-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-400">
              <Flame className="size-5" />
              <span className="label-caps font-semibold">Golden Boot Player</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-display">
              TOP SCORER
            </span>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="size-14 rounded-full bg-yellow-500/10 border-2 border-yellow-500/40 flex items-center justify-center text-yellow-400 shrink-0">
              <Goal className="size-7" />
            </div>
            <div>
              <p className="font-display text-2xl text-white">{topScorerName}</p>
              <p className="text-xs text-yellow-400 font-medium">
                {topPlayerStat ? `${topPlayerStat.goals} Goals Scored` : "Individual Goal King"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground bg-zinc-900/60 p-3 rounded-lg border border-border/40">
            Awarded to the tournament's highest individual goalscorer across all matches.
          </p>
        </div>

        {/* 6. MATCH THRILLER OF THE TOURNAMENT */}
        <div className="panel relative overflow-hidden p-6 border-emerald-500/40 bg-gradient-to-b from-emerald-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <Flame className="size-5" />
              <span className="label-caps font-semibold">Highest Scoring Match</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-display">
              THRILLER
            </span>
          </div>

          {matchThriller ? (
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between bg-zinc-900/80 p-3 rounded-lg border border-border/40">
                <div className="flex items-center gap-2">
                  <TeamLogo
                    name={matchThriller.home?.name ?? ""}
                    shortName={(matchThriller.home as any)?.short_name}
                    color={(matchThriller.home as any)?.team_color}
                    logoUrl={(matchThriller.home as any)?.logo_url}
                    size="sm"
                  />
                  <span className="font-semibold text-sm">{matchThriller.home?.name}</span>
                </div>
                <span className="font-display text-lg text-primary font-bold">
                  {matchThriller.result?.home_score} – {matchThriller.result?.away_score}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{matchThriller.away?.name}</span>
                  <TeamLogo
                    name={matchThriller.away?.name ?? ""}
                    shortName={(matchThriller.away as any)?.short_name}
                    color={(matchThriller.away as any)?.team_color}
                    logoUrl={(matchThriller.away as any)?.logo_url}
                    size="sm"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Total goals: {(matchThriller.result?.home_score ?? 0) + (matchThriller.result?.away_score ?? 0)}
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">No completed match recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
