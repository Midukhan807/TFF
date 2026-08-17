import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Medal, Trophy, Flame, Shield, Award, Sparkles, TrendingUp, Loader2 } from "lucide-react";

import { ChampionCard } from "@/components/tff/trophy";
import { EmptyState } from "@/components/tff/ui";
import { TeamLogo } from "@/components/tff/branding";
import { fetchChampions, fetchTeams, fetchTournaments, getTeamVideoLogo } from "@/lib/tff";

export const Route = createFileRoute("/champions")({
  head: () => ({
    meta: [
      { title: "Hall of Champions | Triad Football Federation (TFF) & Triad Champions League" },
      {
        name: "description",
        content:
          "The Triad Football Federation (TFF) Hall of Champions — every official Triad Champions League (TCL) title winner, runner-up, top scorer and MVP player of the tournament.",
      },
      {
        name: "keywords",
        content:
          "Triad Champions League winners, TFF champions, Triad Football Federation Hall of Champions, TCL champions list, eFootball champions",
      },
      { property: "og:title", content: "Hall of Champions | Triad Football Federation (TFF)" },
      {
        property: "og:description",
        content: "Every champion crowned in Triad Football Federation (TFF) and Triad Champions League (TCL) history.",
      },
    ],
  }),
  component: ChampionsPage,
});

function ChampionsPage() {
  const champions = useQuery({ queryKey: ["champions"], queryFn: fetchChampions });
  const tournaments = useQuery({ queryKey: ["tournaments"], queryFn: fetchTournaments });
  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });

  const isLoading = champions.isLoading || tournaments.isLoading || teams.isLoading;

  const teamMap = new Map((teams.data ?? []).map((t) => [t.id, t]));
  const tournamentMap = new Map((tournaments.data ?? []).map((t) => [t.id, t]));
  const list = champions.data ?? [];

  // Map tournament order (already sorted descending by season)
  const tourneyOrderMap = new Map((tournaments.data ?? []).map((t, idx) => [t.id, idx]));
  const sortedChampions = [...list].sort((a, b) => {
    const orderA = tourneyOrderMap.get(a.tournament_id) ?? 999;
    const orderB = tourneyOrderMap.get(b.tournament_id) ?? 999;
    return orderA - orderB;
  });

  const titleCount = new Map<string, number>();
  for (const champion of list) {
    const winnerId = champion.champion_team_id;
    if (!winnerId) continue;
    titleCount.set(winnerId, (titleCount.get(winnerId) ?? 0) + 1);
  }
  const mostDecorated = [...titleCount.entries()].sort((a, b) => b[1] - a[1]);
  const topTeam = mostDecorated[0] ? teamMap.get(mostDecorated[0][0]) : null;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-12">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/40 via-zinc-950/90 to-zinc-950 p-8 sm:p-12 shadow-[0_0_50px_rgba(245,158,11,0.12)]">
        {/* Glow Effects */}
        <div
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-96 rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(circle, oklch(0.75 0.18 70) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 backdrop-blur-md">
            <Crown className="size-4 animate-pulse" /> Immortal Legacy
          </span>

          <h1 className="mt-4 font-display text-4xl sm:text-6xl tracking-wide uppercase text-foreground">
            Hall of Champions
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Completed TFF tournaments are etched into eternity. Here are the elite sides, commanders, and goalscorers who conquered the federation.
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-4 backdrop-blur-sm">
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 mb-2">
                <Trophy className="size-5" />
              </span>
              <span className="font-display text-3xl text-amber-400">{list.length}</span>
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
                Tournaments Crowned
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-4 backdrop-blur-sm">
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 mb-2">
                <Shield className="size-5" />
              </span>
              <span className="font-display text-3xl text-amber-400">{titleCount.size}</span>
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
                Unique Champions
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-4 backdrop-blur-sm">
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 mb-2">
                <Crown className="size-5" />
              </span>
              <span className="font-display text-2xl text-amber-400 truncate max-w-[180px]">
                {topTeam ? topTeam.name : "—"}
              </span>
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
                {mostDecorated[0] ? `${mostDecorated[0][1]} Title(s) • Most Decorated` : "Most Decorated"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Title Leaderboard Showcase */}
      {mostDecorated.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="size-4" /> Honor Roll
              </div>
              <h2 className="font-display text-3xl uppercase tracking-wide text-foreground mt-1">
                Title Leaderboard
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mostDecorated.map(([teamId, count], index) => {
              const team = teamMap.get(teamId);
              if (!team) return null;
              const isFirst = index === 0;
              return (
                <Link
                  key={teamId}
                  to="/team/$teamId"
                  params={{ teamId }}
                  className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                    isFirst
                      ? "border-amber-500/50 bg-gradient-to-br from-amber-950/30 to-zinc-950 shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:border-amber-500"
                      : "border-border/70 bg-zinc-950/70 hover:border-amber-500/30 hover:bg-zinc-900/60"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <TeamLogo
                        name={team.name}
                        shortName={team.short_name}
                        color={team.team_color}
                        logoUrl={team.logo_url}
                        videoUrl={getTeamVideoLogo(team)}
                        size="lg"
                        className="shadow-lg"
                      />
                      {isFirst && (
                        <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-md">
                          <Crown className="size-3.5 fill-current" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xs text-muted-foreground">Rank #{index + 1}</span>
                        {isFirst && (
                          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[0.6rem] font-bold text-amber-400 uppercase">
                            Leader
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-xl uppercase tracking-wide text-foreground truncate group-hover:text-amber-400 transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {count} TFF Championship Title{count > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-center">
                      <div className="flex items-center gap-1 text-amber-400 font-display text-3xl">
                        <Trophy className="size-6" /> {count}
                      </div>
                    </div>
                  </div>

                  {/* Dominance Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-3">
                    <div className="h-1.5 flex-1 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full"
                        style={{ width: `${list.length > 0 ? Math.min(100, (count / list.length) * 100) : 0}%` }}
                      />
                    </div>
                    <span className="text-[0.65rem] font-mono text-muted-foreground">
                      {list.length > 0 ? Math.round((count / list.length) * 100) : 0}% of titles
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Championship Archives Timeline */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Trophy className="size-4" /> Hall of Fame Archives
            </div>
            <h2 className="font-display text-3xl uppercase tracking-wide text-foreground mt-1">
              Championship History
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {sortedChampions.length} Official Season Archives
          </span>
        </div>

        {sortedChampions.length ? (
          <div className="space-y-6">
            {sortedChampions.map((champion, index) => {
              const tournament = tournamentMap.get(champion.tournament_id);
              if (!tournament) return null;
              return (
                <ChampionCard
                  key={champion.id}
                  tournament={tournament}
                  champion={champion}
                  teams={teamMap}
                  featured={index === 0}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No champions yet"
            description="No TFF tournament has been completed yet. The first champion is still to be crowned."
          />
        )}
      </section>
    </div>
  );
}
