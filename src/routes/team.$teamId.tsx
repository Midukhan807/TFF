import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

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
      points: acc.points + row.points,
    }),
    { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, points: 0 },
  );

  // Add stats from completed knockout stage matches
  const knockoutCompleted = (fixtures.data ?? []).filter(
    (f) => (f.stage === "knockout" || !!f.round) && f.status === "completed" && f.result,
  );
  for (const f of knockoutCompleted) {
    totals.played += 1;
    const isHome = f.home_team_id === teamId;
    const myScore = isHome ? Number(f.result!.home_score) || 0 : Number(f.result!.away_score) || 0;
    const oppScore = isHome ? Number(f.result!.away_score) || 0 : Number(f.result!.home_score) || 0;
    totals.gf += myScore;
    totals.ga += oppScore;
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Tournaments" value={rows.length} />
          <StatCard label="Championships" value={titles} />
          <StatCard label="Matches Played" value={totals.played} />
          <StatCard label="Win %" value={`${winPct}%`} />
          <StatCard label="Wins" value={totals.wins} />
          <StatCard label="Draws" value={totals.draws} />
          <StatCard label="Losses" value={totals.losses} />
          <StatCard
            label="Goals"
            value={`${totals.gf} : ${totals.ga}`}
            hint={`GD ${totals.gf - totals.ga > 0 ? "+" : ""}${totals.gf - totals.ga}`}
          />
        </div>

        <section>
          <h2 className="mb-4 text-2xl">Tournament History</h2>
          {rows.length ? (
            <div className="panel overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="label-caps border-b border-border/70 text-muted-foreground">
                    <th className="px-4 py-3 text-left">Tournament</th>
                    <th className="px-4 py-3 text-center">Year</th>
                    <th className="px-4 py-3 text-center">P</th>
                    <th className="px-4 py-3 text-center">W</th>
                    <th className="px-4 py-3 text-center">D</th>
                    <th className="px-4 py-3 text-center">L</th>
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
                        <td className="px-4 py-3 text-center text-primary">{row.points}</td>
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
      </div>
    </div>
  );
}
