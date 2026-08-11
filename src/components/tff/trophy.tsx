import { Link } from "@tanstack/react-router";
import { Crown, Medal, Trophy } from "lucide-react";

import { TeamLogo } from "@/components/tff/branding";
import { cn } from "@/lib/utils";
import type { Champion, FixtureWithTeams, Team, Tournament } from "@/lib/tff";

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
        "panel relative overflow-hidden p-6",
        featured && "border-primary/50 shadow-[var(--shadow-gold)]",
      )}
    >
      <div
        className="pointer-events-none absolute -top-24 right-0 size-56 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 text-primary">
          <Trophy className="size-4" />
          <span className="label-caps">TFF Champion</span>
        </div>
        <Link
          to="/tournament/$slug"
          params={{ slug: tournament.slug }}
          className="font-display mt-2 block text-xl hover:text-primary"
        >
          {tournament.name}
        </Link>

        <div className="mt-5 flex items-center gap-4">
          <TeamLogo
            name={winner?.name ?? "TBD"}
            shortName={winner?.short_name}
            color={winner?.team_color}
            logoUrl={winner?.logo_url}
            size={featured ? "xl" : "lg"}
          />
          <div>
            <p className={cn("font-display leading-none", featured ? "text-4xl" : "text-3xl")}>
              {winner?.name ?? "To be decided"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {champion.final_score ?? "Final result recorded"}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 border-t border-border/70 pt-4 text-sm sm:grid-cols-2">
          <p className="flex items-center gap-2 text-muted-foreground">
            <Medal className="size-4 text-silver" /> Runner-up:{" "}
            <span className="text-foreground">{runnerUp?.name ?? "—"}</span>
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Medal className="size-4 text-[oklch(0.65_0.11_60)]" /> Third:{" "}
            <span className="text-foreground">{third?.name ?? "—"}</span>
          </p>
          {champion.mvp && (
            <p className="text-muted-foreground">
              MVP: <span className="text-foreground">{champion.mvp}</span>
            </p>
          )}
          {champion.top_scorer && (
            <p className="text-muted-foreground">
              Top scorer: <span className="text-foreground">{champion.top_scorer}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const ROUND_ORDER = ["Round of 16", "Quarter Final", "Semi Final", "Third Place", "Final"];

export function KnockoutBracket({ fixtures }: { fixtures: FixtureWithTeams[] }) {
  const rounds = ROUND_ORDER.filter((round) => fixtures.some((f) => f.round === round));
  if (!rounds.length) return null;

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-6">
        {rounds.map((round) => (
          <div key={round} className="w-72 shrink-0">
            <p className="label-caps mb-3 text-primary">{round}</p>
            <div className="flex flex-col justify-around gap-4">
              {fixtures
                .filter((f) => f.round === round)
                .map((fixture) => {
                  const result = fixture.result;
                  const homeWon = result ? result.home_score > result.away_score : false;
                  const awayWon = result ? result.away_score > result.home_score : false;
                  return (
                    <div key={fixture.id} className="panel p-3">
                      {[
                        { team: fixture.home, score: result?.home_score, won: homeWon },
                        { team: fixture.away, score: result?.away_score, won: awayWon },
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
                          <span className="font-display text-lg">{side.score ?? "-"}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
        <div className="grid w-64 shrink-0 place-items-center">
          <div className="panel flex flex-col items-center gap-2 p-6 text-center">
            <Crown className="size-8 text-primary" />
            <p className="label-caps text-muted-foreground">Champion</p>
            <p className="font-display text-2xl">
              {(() => {
                const final = fixtures.find((f) => f.round === "Final");
                if (!final?.result) return "?";
                return final.result.home_score > final.result.away_score
                  ? (final.home?.name ?? "?")
                  : (final.away?.name ?? "?");
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
