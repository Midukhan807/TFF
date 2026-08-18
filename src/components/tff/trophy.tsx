import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Award, Crown, Flame, Medal, Trophy } from "lucide-react";

import { TeamLogo } from "@/components/tff/branding";
import { cn } from "@/lib/utils";
import { getTeamVideoLogo, getMatchWinner, parseResultPenalties, type Champion, type FixtureWithTeams, type Team, type Tournament } from "@/lib/tff";

export function ChampionCard({
  tournament,
  champion,
  teams,
  featured,
}: {
  tournament: Tournament;
  champion: Champion;
  teams: Map<string, Team>;
  featured?: boolean | undefined;
}) {
  const winner = champion.champion_team_id ? teams.get(champion.champion_team_id) : null;
  const runnerUp = champion.runner_up_team_id ? teams.get(champion.runner_up_team_id) : null;
  const third = champion.third_place_team_id ? teams.get(champion.third_place_team_id) : null;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300",
        featured
          ? "border-amber-500/50 bg-gradient-to-b from-amber-950/40 via-zinc-950/90 to-zinc-950 shadow-[0_0_35px_rgba(245,158,11,0.18)]"
          : "border-border/80 bg-zinc-950/80 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.1)]"
      )}
    >
      {/* Background ambient gold glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-24 right-0 size-72 rounded-full blur-3xl transition-opacity duration-500",
          featured ? "opacity-35" : "opacity-15 group-hover:opacity-25"
        )}
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 70) 0%, transparent 70%)" }}
      />

      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-zinc-900/60 px-6 py-3.5 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Crown className="size-4" />
          </span>
          <div>
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-amber-400/90">
              {featured ? "★ Reigning Champion" : "Official Champion"}
            </span>
            <span className="mx-2 text-zinc-600">•</span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
              {tournament.season_year ? `Season ${tournament.season_year}` : "TFF Archive"}
            </span>
          </div>
        </div>

        <Link
          to="/tournament/$slug"
          params={{ slug: tournament.slug }}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-amber-400"
        >
          <span>{tournament.name}</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div className="p-6">
        {/* Main Winner Showcase */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {winner ? (
              <Link to="/team/$teamId" params={{ teamId: winner.id }} className="shrink-0 transition-transform duration-300 group-hover:scale-105">
                <TeamLogo
                  name={winner.name}
                  shortName={winner.short_name}
                  color={winner.team_color}
                  logoUrl={winner.logo_url}
                  videoUrl={featured ? getTeamVideoLogo(winner) : null}
                  autoPlay={featured ?? false}
                  size={featured ? "xl" : "lg"}
                  className="shadow-xl ring-2 ring-amber-500/30"
                />
              </Link>
            ) : (
              <div className="grid size-16 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                <Trophy className="size-8" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-amber-400">
                  <Trophy className="size-3" /> Champion
                </span>
                {champion.final_score && (
                  <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 text-[0.65rem] font-mono text-zinc-300">
                    Final: {champion.final_score}
                  </span>
                )}
              </div>

              {winner ? (
                <Link
                  to="/team/$teamId"
                  params={{ teamId: winner.id }}
                  className={cn(
                    "font-display block uppercase tracking-wide text-foreground transition-colors hover:text-amber-400 mt-1",
                    featured ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
                  )}
                >
                  {winner.name}
                </Link>
              ) : (
                <p className="font-display text-2xl uppercase tracking-wide text-muted-foreground mt-1">
                  To Be Decided
                </p>
              )}

              <p className="text-xs text-muted-foreground mt-0.5">
                Crowned Champion of <strong className="text-zinc-300">{tournament.name}</strong>
              </p>
            </div>
          </div>

          {/* Quick Stats / Trophy Icon Badge */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border/40 pt-4 sm:border-t-0 sm:pt-0">
            <div className="flex flex-col items-end text-right">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-400/80">Title Record</span>
              <span className="font-display text-2xl text-amber-400">#1 PLACE</span>
            </div>
            <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-950/40 border border-amber-500/40 text-amber-400 shadow-inner">
              <Trophy className="size-6" />
            </div>
          </div>
        </div>

        {/* Podium & Accolades Grid */}
        <div className="mt-6 grid gap-3 border-t border-border/60 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Runner Up */}
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
            {runnerUp ? (
              <Link to="/team/$teamId" params={{ teamId: runnerUp.id }} className="shrink-0">
                <TeamLogo
                  name={runnerUp.name}
                  shortName={runnerUp.short_name}
                  color={runnerUp.team_color}
                  logoUrl={runnerUp.logo_url}
                  autoPlay={false}
                  size="sm"
                  className="rounded-lg shadow-sm"
                />
              </Link>
            ) : (
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
                <Medal className="size-5 text-zinc-300" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-400">Runner-Up 🥈</p>
              {runnerUp ? (
                <Link to="/team/$teamId" params={{ teamId: runnerUp.id }} className="truncate block text-xs font-semibold text-foreground hover:text-amber-400 transition-colors">
                  {runnerUp.name}
                </Link>
              ) : (
                <p className="truncate text-xs font-semibold text-muted-foreground">—</p>
              )}
            </div>
          </div>

          {/* Third Place */}
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
            {third ? (
              <Link to="/team/$teamId" params={{ teamId: third.id }} className="shrink-0">
                <TeamLogo
                  name={third.name}
                  shortName={third.short_name}
                  color={third.team_color}
                  logoUrl={third.logo_url}
                  autoPlay={false}
                  size="sm"
                  className="rounded-lg shadow-sm"
                />
              </Link>
            ) : (
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-950/50 text-amber-600 border border-amber-800/50">
                <Medal className="size-5 text-amber-600" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-600/90">3rd Place 🥉</p>
              {third ? (
                <Link to="/team/$teamId" params={{ teamId: third.id }} className="truncate block text-xs font-semibold text-foreground hover:text-amber-400 transition-colors">
                  {third.name}
                </Link>
              ) : (
                <p className="truncate text-xs font-semibold text-muted-foreground">—</p>
              )}
            </div>
          </div>

          {/* Tournament MVP */}
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Award className="size-5 text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-400">Tournament MVP 🎖️</p>
              <p className="truncate text-xs font-semibold text-foreground">
                {champion.mvp || "—"}
              </p>
            </div>
          </div>

          {/* Top Scorer */}
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Flame className="size-5 text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-400">Top Scorer ⚽</p>
              <p className="truncate text-xs font-semibold text-foreground">
                {champion.top_scorer || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const STAGE_STEPS = [
  { key: "Round of 16", label: "Round of 16" },
  { key: "Quarter Final", label: "Quarter Final" },
  { key: "Semi Final", label: "Semi Final" },
  { key: "Third Place", label: "3rd Place Match" },
  { key: "Final", label: "Final 🏆" },
];

export function KnockoutBracket({ fixtures }: { fixtures: FixtureWithTeams[] }) {
  const activeSteps = STAGE_STEPS.filter((step) =>
    fixtures.some((f) => f.round && f.round.startsWith(step.key))
  );

  if (!activeSteps.length) return null;

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-6">
        {activeSteps.map((step) => {
          const stepFixtures = fixtures.filter((f) => f.round && f.round.startsWith(step.key));
          const leg1List = stepFixtures.filter((f) => !f.round?.includes("2nd Leg"));

          return (
            <div key={step.key} className="w-80 shrink-0">
              <p className="label-caps mb-3 text-primary font-bold">{step.label}</p>
              <div className="flex flex-col justify-around gap-4">
                {leg1List.map((f1) => {
                  const isTwoLegged = f1.round?.includes("1st Leg");
                  const f2 = isTwoLegged
                    ? stepFixtures.find(
                        (f) =>
                          f.round?.includes("2nd Leg") &&
                          ((f.home_team_id === f1.away_team_id && f.away_team_id === f1.home_team_id) ||
                            f.bracket_slot === (f1.bracket_slot ? f1.bracket_slot + 1 : -1))
                      )
                    : null;

                  if (isTwoLegged && f2) {
                    const agg = computeTwoLegAggregate(f1, f2);
                    const homeWon = agg.winnerTeamId === f1.home_team_id;
                    const awayWon = agg.winnerTeamId === f1.away_team_id;

                    const res1 = f1.result;
                    const res2 = f2.result;

                    return (
                      <div key={f1.id} className="panel p-3.5 space-y-2 border-primary/30 bg-card/60">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-muted-foreground border-b border-border/40 pb-1">
                          <span className="text-primary">2-Legged Tie (Aggregate)</span>
                          {agg.isCompleted && (
                            <span className="text-amber-400 font-extrabold">
                              Agg: {agg.totalGoalsA} - {agg.totalGoalsB}
                            </span>
                          )}
                        </div>

                        {[
                          { team: f1.home, scoreL1: res1?.home_score, scoreL2: res2?.away_score, total: agg.totalGoalsA, pen: agg.penA, won: homeWon },
                          { team: f1.away, scoreL1: res1?.away_score, scoreL2: res2?.home_score, total: agg.totalGoalsB, pen: agg.penB, won: awayWon },
                        ].map((side, i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
                              side.won && "bg-primary/20 border border-primary/40",
                            )}
                          >
                            <TeamLogo
                              name={side.team?.name ?? "TBD"}
                              shortName={side.team?.short_name}
                              color={side.team?.team_color}
                              logoUrl={side.team?.logo_url}
                              size="sm"
                            />
                            <span
                              className={cn(
                                "flex-1 truncate text-sm",
                                side.won ? "font-bold text-primary" : "text-muted-foreground",
                              )}
                            >
                              {side.team?.name ?? "TBD"}
                            </span>
                            <div className="text-right flex items-center gap-1.5 text-xs">
                              <span className="text-muted-foreground font-mono">
                                ({side.scoreL1 ?? "-"}-{side.scoreL2 ?? "-"})
                              </span>
                              <span className="font-display text-base font-bold text-foreground">
                                {agg.isCompleted ? side.total : "-"}
                              </span>
                              {agg.isPenalties && side.pen !== null && side.pen !== undefined && (
                                <span className="text-[10px] font-extrabold text-amber-400">({side.pen}p)</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  const result = f1.result;
                  const { winnerTeamId, isPenalties } = getMatchWinner(f1);
                  const { homePen, awayPen } = parseResultPenalties(result);

                  const homeWon = winnerTeamId === f1.home_team_id;
                  const awayWon = winnerTeamId === f1.away_team_id;

                  return (
                    <div key={f1.id} className="panel p-3">
                      {[
                        { team: f1.home, score: result?.home_score, pen: homePen, won: homeWon },
                        { team: f1.away, score: result?.away_score, pen: awayPen, won: awayWon },
                      ].map((side, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-1.5",
                            side.won && "bg-primary/15",
                          )}
                        >
                          <TeamLogo
                            name={side.team?.name ?? "TBD"}
                            shortName={side.team?.short_name}
                            color={side.team?.team_color}
                            logoUrl={side.team?.logo_url}
                            size="sm"
                          />
                          <span
                            className={cn(
                              "flex-1 truncate text-sm",
                              side.won ? "font-semibold text-primary" : "text-muted-foreground",
                            )}
                          >
                            {side.team?.name ?? "TBD"}
                          </span>
                          <div className="text-right">
                            <span className="font-display text-lg">{side.score ?? "-"}</span>
                            {isPenalties && side.pen !== null && side.pen !== undefined && (
                              <span className="ml-1 text-[11px] font-bold text-amber-400">({side.pen}p)</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="grid w-64 shrink-0 place-items-center">
          <div className="panel flex flex-col items-center gap-2 p-6 text-center">
            <Crown className="size-8 text-primary animate-pulse" />
            <p className="label-caps text-muted-foreground">Champion</p>
            <p className="font-display text-2xl font-black text-primary">
              {(() => {
                const finalStep = fixtures.filter((f) => f.round && f.round.startsWith("Final"));
                const finalLeg1 = finalStep.find((f) => !f.round?.includes("2nd Leg"));
                const finalLeg2 = finalStep.find((f) => f.round?.includes("2nd Leg"));

                if (finalLeg1?.round?.includes("1st Leg") && finalLeg2) {
                  const agg = computeTwoLegAggregate(finalLeg1, finalLeg2);
                  if (!agg.winnerTeamId) return "?";
                  const championTeam = fixtures.find((f) => f.home_team_id === agg.winnerTeamId || f.away_team_id === agg.winnerTeamId);
                  return (
                    (championTeam?.home_team_id === agg.winnerTeamId ? championTeam.home?.name : championTeam?.away?.name) ?? "?"
                  );
                }

                if (!finalLeg1?.result) return "?";
                const { winnerTeamId } = getMatchWinner(finalLeg1);
                if (!winnerTeamId) return "?";
                return winnerTeamId === finalLeg1.home_team_id
                  ? (finalLeg1.home?.name ?? "?")
                  : (finalLeg1.away?.name ?? "?");
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
