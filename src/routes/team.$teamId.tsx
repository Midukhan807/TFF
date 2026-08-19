import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Swords } from "lucide-react";

import { TeamLogo } from "@/components/tff/branding";
import { EmptyState, ResultCard, StatCard } from "@/components/tff/ui";
import {
  fetchAllStandings,
  fetchChampions,
  fetchTeamFixtures,
  fetchTeams,
  fetchTournaments,
  getTeamFoundedYear,
  getTeamVideoLogo,
} from "@/lib/tff";

export const Route = createFileRoute("/team/$teamId")({
  head: () => ({
    meta: [
      { title: "Team Profile | TFF eFootball" },
      {
        name: "description",
        content:
          "TFF team profile — tournament participations, championships, match record, goals and full TFF history.",
      },
      { property: "og:title", content: "Team Profile | TFF eFootball" },
      {
        property: "og:description",
        content: "Complete TFF record for this team: titles, results and tournament history.",
      },
    ],
  }),
  component: TeamProfile,
});

function TeamProfile() {
  const { teamId } = Route.useParams();
  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const standings = useQuery({ queryKey: ["all-standings"], queryFn: fetchAllStandings });
  const tournaments = useQuery({ queryKey: ["tournaments"], queryFn: fetchTournaments });
  const champions = useQuery({ queryKey: ["champions"], queryFn: fetchChampions });
  const fixtures = useQuery({
    queryKey: ["team-fixtures", teamId],
    queryFn: () => fetchTeamFixtures(teamId),
  });

  const team = (teams.data ?? []).find((t) => t.id === teamId);
  if (!team) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <EmptyState title="Team not found" description="This team is not in the TFF database." />
      </div>
    );
  }

  const rows = (standings.data ?? []).filter((row) => row.team_id === teamId);
  const totals = rows.reduce(
    (acc, row) => ({
      played: acc.played + row.played,
      wins: acc.wins + row.wins,
      draws: acc.draws + row.draws,
      losses: acc.losses + row.losses,
      gf: acc.gf + row.goals_for,
      ga: acc.ga + row.goals_against,
      yellow: acc.yellow + (row.yellow_cards || 0),
      red: acc.red + (row.red_cards || 0),
      points: acc.points + row.points,
    }),
    { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, yellow: 0, red: 0, points: 0 },
  );

  // Add stats from completed knockout stage matches
  const knockoutCompleted = (fixtures.data ?? []).filter(
    (f) => (f.stage === "knockout" || !!f.round) && f.status === "completed" && f.result,
  );
  for (const f of knockoutCompleted) {
    totals.played += 1;
    const isHome = f.home_team_id === teamId;
    const myScore = isHome ? Number(f.result?.home_score) || 0 : Number(f.result?.away_score) || 0;
    const oppScore = isHome ? Number(f.result?.away_score) || 0 : Number(f.result?.home_score) || 0;
    totals.gf += myScore;
    totals.ga += oppScore;
    if (isHome) {
      totals.yellow += Number(f.result?.home_yellow_cards) || 0;
      totals.red += Number(f.result?.home_red_cards) || 0;
    } else {
      totals.yellow += Number(f.result?.away_yellow_cards) || 0;
      totals.red += Number(f.result?.away_red_cards) || 0;
    }
    if (myScore > oppScore) totals.wins += 1;
    else if (myScore < oppScore) totals.losses += 1;
    else totals.draws += 1;
  }

  const titles = (champions.data ?? []).filter((c) => c.champion_team_id === teamId).length;
  const tournamentMap = new Map((tournaments.data ?? []).map((t) => [t.id, t]));
  const recent = (fixtures.data ?? []).filter((f) => f.result).slice(0, 4);
  const winPct = totals.played ? Math.round((totals.wins / totals.played) * 100) : 0;

  return (
    <div>
      <header className="border-b border-border/70" style={{ background: "var(--gradient-surface)" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 py-12 sm:px-6">
          <TeamLogo
            name={team.name}
            shortName={team.short_name}
            color={team.team_color}
            logoUrl={team.logo_url}
            videoUrl={getTeamVideoLogo(team)}
            size="xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="label-caps text-primary">TFF Team</p>
              <span className="text-[0.65rem] font-semibold text-primary/80 border border-primary/30 bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Est. {getTeamFoundedYear(team)}
              </span>
            </div>
            <h1 className="text-5xl uppercase">{team.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {team.short_name}
              {team.manager_name ? ` · Manager ${team.manager_name}` : ""}
              {` · Founded ${getTeamFoundedYear(team)}`}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Tournaments" value={rows.length} />
          <StatCard label="Championships" value={titles} />
          <StatCard label="Matches Played" value={totals.played} />
          <StatCard label="Win %" value={`${winPct}%`} />
          <StatCard
            label="Discipline"
            value={
              <span className="flex items-center gap-2 text-2xl">
                <span className="text-yellow-400 font-bold">🟨 {totals.yellow}</span>
                <span className="text-red-400 font-bold">🟥 {totals.red}</span>
              </span>
            }
          />
        </div>

        <section>
          <h2 className="mb-4 text-2xl">Tournament History</h2>
          {rows.length ? (
            <div className="panel overflow-x-auto">
              <table className="w-full min-w-[660px] text-sm">
                <thead>
                  <tr className="label-caps border-b border-border/70 text-muted-foreground">
                    <th className="px-4 py-3 text-left">Tournament</th>
                    <th className="px-4 py-3 text-center">Year</th>
                    <th className="px-4 py-3 text-center">P</th>
                    <th className="px-4 py-3 text-center">W</th>
                    <th className="px-4 py-3 text-center">D</th>
                    <th className="px-4 py-3 text-center">L</th>
                    <th className="px-3 py-3 text-center text-yellow-400" title="Yellow Cards">YC</th>
                    <th className="px-3 py-3 text-center text-red-400" title="Red Cards">RC</th>
                    <th className="px-4 py-3 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const tournament = tournamentMap.get(row.tournament_id);
                    if (!tournament) return null;
                    return (
                      <tr key={row.tournament_id} className="border-b border-border/40 last:border-0">
                        <td className="px-4 py-3">
                          <Link
                            to="/tournament/$slug"
                            params={{ slug: tournament.slug }}
                            className="font-semibold hover:text-primary"
                          >
                            {tournament.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">{tournament.season_year}</td>
                        <td className="px-4 py-3 text-center">{row.played}</td>
                        <td className="px-4 py-3 text-center">{row.wins}</td>
                        <td className="px-4 py-3 text-center">{row.draws}</td>
                        <td className="px-4 py-3 text-center">{row.losses}</td>
                        <td className="px-3 py-3 text-center">
                          <span className="inline-flex items-center justify-center gap-1 rounded bg-yellow-500/10 px-1.5 py-0.5 text-xs font-semibold text-yellow-400 border border-yellow-500/20">
                            {row.yellow_cards ?? 0}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="inline-flex items-center justify-center gap-1 rounded bg-red-500/10 px-1.5 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20">
                            {row.red_cards ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-primary font-bold">{row.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No tournaments yet"
              description="This team has not competed in a TFF tournament yet."
            />
          )}
        </section>

        <section>
          <h2 className="mb-4 text-2xl">Recent Results</h2>
          {recent.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {recent.map((fixture) => (
                <ResultCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          ) : (
            <EmptyState title="No results yet" description="No results have been recorded yet." />
          )}
        </section>

        <section className="panel p-6 border-primary/30 bg-card/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-extrabold uppercase tracking-wide flex items-center gap-2">
                <Swords className="size-6 text-primary" /> Head-to-Head Rivalries
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Compare {team.name} head-to-head against any rival team in TFF.
              </p>
            </div>
            <Link
              to="/h2h"
              search={{ team1: team.id }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90"
            >
              Open Full H2H Predictor <Swords className="size-4" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(teams.data ?? [])
              .filter((t) => t.id !== team.id)
              .slice(0, 8)
              .map((opp) => (
                <Link
                  key={opp.id}
                  to="/h2h"
                  search={{ team1: team.id, team2: opp.id }}
                  className="flex items-center gap-3 rounded-lg border border-border/70 bg-card/40 p-3 transition-all hover:border-primary/50 hover:bg-primary/10"
                >
                  <TeamLogo
                    name={opp.name}
                    shortName={opp.short_name}
                    color={opp.team_color}
                    logoUrl={opp.logo_url}
                    size="sm"
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{opp.name}</p>
                    <p className="text-xs text-primary font-semibold flex items-center gap-1">
                      Compare H2H <Swords className="size-3" />
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
