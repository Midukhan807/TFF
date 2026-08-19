import { Award, Flame, Goal, Shield, Sparkles, Trophy, User } from "lucide-react";
import { TeamLogo } from "@/components/tff/branding";
import {
  calculateTournamentMVP,
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
  champion?: Champion | null | undefined;
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

  // 4. Auto-Calculated MVP (Option 1 Weighted Formula)
  const autoMVP = calculateTournamentMVP(playerStats, champion?.champion_team_id);
  const mvpTeam = autoMVP?.player.team_id ? teamsMap.get(autoMVP.player.team_id) : null;

  const topPlayerStat = [...playerStats].sort((a, b) => b.goals - a.goals)[0];
  const topScorerName = customAward?.top_scorer_player || topPlayerStat?.player_name || champion?.top_scorer || "TBD";
  const mvpName = champion?.mvp || autoMVP?.player.player_name || "TBD";

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
        {/* 0. TOURNAMENT MVP */}
        <div className="panel relative overflow-hidden p-6 border-purple-500/40 bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent sm:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400">
              <Award className="size-5" />
              <span className="label-caps font-semibold">Tournament MVP (Most Valuable Player)</span>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-display uppercase tracking-wider font-bold">
              👑 TOP PERFORMER
            </span>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TeamLogo
                name={mvpTeam?.name ?? "TFF"}
                shortName={mvpTeam?.short_name}
                color={mvpTeam?.team_color}
                logoUrl={mvpTeam?.logo_url}
                size="xl"
              />
              <div>
                <p className="font-display text-3xl sm:text-4xl text-white font-bold tracking-wide">
                  {mvpName}
                </p>
                <p className="text-sm text-purple-400 font-semibold mt-0.5">
                  {mvpTeam?.name ? mvpTeam.name : "Triad Football Federation"}
                </p>
              </div>
            </div>

            {autoMVP && (
              <div className="flex items-center gap-3 bg-zinc-950/80 p-3 rounded-xl border border-purple-500/30">
                <div className="text-center px-3 border-r border-border/60">
                  <p className="font-display text-2xl text-purple-400 font-bold">{autoMVP.score}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">MVP Rating</p>
                </div>
                <div className="text-xs space-y-0.5 text-zinc-300">
                  <p>⭐ <b>{autoMVP.player.motm || 0}</b> MOTM Awards</p>
                  <p>⚽ <b>{autoMVP.player.goals || 0}</b> Goals · 🎯 <b>{autoMVP.player.assists || 0}</b> Assists</p>
                </div>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-muted-foreground bg-zinc-900/60 p-3 rounded-lg border border-border/40">
            Calculated automatically using weighted performance metrics: MOTM awards (10pts), Goals (3pts), Assists (2pts), Fair Play cards (-1pt YC / -3pts RC), plus Champion team multiplier bonus.
          </p>
        </div>
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

        {/* 3. BEST DEFENSIVE TEAM (CONCEDED) */}
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

        {/* 4. GOLDEN GLOVE (MOST CLEAN SHEETS) */}
        <div className="panel relative overflow-hidden p-6 border-cyan-500/40 bg-gradient-to-b from-cyan-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400">
              <Shield className="size-5" />
              <span className="label-caps font-semibold">Golden Glove (Clean Sheets)</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-display">
              SHUTOUT KING 🧤
            </span>
          </div>

          {(() => {
            const cleanSheetsMap = new Map<string, number>();
            for (const f of completedFixtures) {
              if (f.status === "completed" && f.result) {
                if (f.home_team_id) {
                  if (!cleanSheetsMap.has(f.home_team_id)) cleanSheetsMap.set(f.home_team_id, 0);
                  if ((f.result.away_score ?? 0) === 0) {
                    cleanSheetsMap.set(f.home_team_id, cleanSheetsMap.get(f.home_team_id)! + 1);
                  }
                }
                if (f.away_team_id) {
                  if (!cleanSheetsMap.has(f.away_team_id)) cleanSheetsMap.set(f.away_team_id, 0);
                  if ((f.result.home_score ?? 0) === 0) {
                    cleanSheetsMap.set(f.away_team_id, cleanSheetsMap.get(f.away_team_id)! + 1);
                  }
                }
              }
            }

            let topCleanSheetTeamId = "";
            let maxCleanSheets = 0;
            for (const [teamId, count] of cleanSheetsMap.entries()) {
              if (count > maxCleanSheets) {
                maxCleanSheets = count;
                topCleanSheetTeamId = teamId;
              }
            }

            const cleanSheetTeam = topCleanSheetTeamId ? teamsMap.get(topCleanSheetTeamId) : null;

            return (
              <>
                <div className="mt-5 flex items-center gap-4">
                  <TeamLogo
                    name={cleanSheetTeam?.name ?? "TBD"}
                    shortName={cleanSheetTeam?.short_name}
                    color={cleanSheetTeam?.team_color}
                    logoUrl={cleanSheetTeam?.logo_url}
                    size="lg"
                  />
                  <div>
                    <p className="font-display text-2xl text-white">
                      {cleanSheetTeam?.name ?? "To be determined"}
                    </p>
                    <p className="text-xs text-cyan-400 font-medium">
                      {maxCleanSheets} Clean Sheet{maxCleanSheets !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-muted-foreground bg-zinc-900/60 p-3 rounded-lg border border-border/40">
                  Awarded to the team with the most shutouts (zero goals conceded in a match) across all fixtures.
                </p>
              </>
            );
          })()}
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
