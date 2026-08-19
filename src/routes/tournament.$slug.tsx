import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Goal, Info, Shield, Trophy } from "lucide-react";

import { TeamLogo } from "@/components/tff/branding";
import { ChampionCard, KnockoutBracket } from "@/components/tff/trophy";
import { TournamentAwardsSection } from "@/components/tff/awards";
import {
  EmptyState,
  FixtureCard,
  ResultCard,
  StandingsTable,
  StatCard,
  StatusBadge,
  TeamCard,
} from "@/components/tff/ui";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FORMAT_LABELS,
  fetchChampions,
  fetchFixtures,
  fetchPlayerStats,
  fetchStandings,
  fetchTournamentBySlug,
  fetchTournamentTeams,
  formatDate,
  sortStandings,
  titleFromSlug,
  type FixtureWithTeams,
} from "@/lib/tff";

const TABS = [
  "overview",
  "fixtures",
  "results",
  "standings",
  "teams",
  "knockout",
  "statistics",
  "awards",
] as const;

export const Route = createFileRoute("/tournament/$slug")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: typeof search["tab"] === "string" && TABS.includes(search["tab"] as any)
        ? (search["tab"] as string)
        : "overview",
  }),
  head: ({ params }) => {
    const title = titleFromSlug(params.slug).replace(/^Tff/, "TFF");
    return {
      meta: [
        { title: `${title} | TFF eFootball` },
        {
          name: "description",
          content: `Follow the ${title} — fixtures, results, standings, teams and the eventual champion.`,
        },
        { property: "og:title", content: `${title} | TFF eFootball` },
        {
          property: "og:description",
          content: `Fixtures, results, standings and champions for the ${title}.`,
        },
      ],
    };
  },
  component: TournamentDetail,
});

function TournamentDetail() {
  const { slug } = Route.useParams();
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  const tournamentQuery = useQuery({
    queryKey: ["tournament", slug],
    queryFn: () => fetchTournamentBySlug(slug),
  });
  const tournament = tournamentQuery.data;
  const id = tournament?.id;

  const teams = useQuery({
    queryKey: ["tournament-teams", id],
    queryFn: () => fetchTournamentTeams(id!),
    enabled: !!id,
  });
  const fixtures = useQuery({
    queryKey: ["fixtures", id],
    queryFn: () => fetchFixtures(id!),
    enabled: !!id,
  });
  const standings = useQuery({
    queryKey: ["standings", id],
    queryFn: () => fetchStandings(id!),
    enabled: !!id,
  });
  const players = useQuery({
    queryKey: ["player-stats", id],
    queryFn: () => fetchPlayerStats(id!),
    enabled: !!id,
  });
  const champions = useQuery({ queryKey: ["champions"], queryFn: fetchChampions });

  if (tournamentQuery.isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-24 text-muted-foreground">Loading...</div>;
  }
  if (!tournament) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <EmptyState title="Tournament not found" description="This TFF tournament does not exist." />
      </div>
    );
  }

  const allFixtures = fixtures.data ?? [];
  const league = allFixtures.filter((f) => f.stage === "league");
  const knockout = allFixtures.filter((f) => f.stage === "knockout");
  const completed = allFixtures.filter((f) => f.status === "completed" && f.result);
  const upcoming = allFixtures.filter((f) => f.status === "scheduled");
  const ranked = sortStandings(standings.data ?? [], tournament.tiebreakers);
  const teamMap = new Map((teams.data ?? []).map((t) => [t.id, t]));
  const leader = ranked[0] ? teamMap.get(ranked[0].team_id) : null;
  const champion = (champions.data ?? []).find((c) => c.tournament_id === tournament.id);
  const goals = completed.reduce(
    (sum, f) => sum + ((f.result?.home_score ?? 0) + (f.result?.away_score ?? 0)),
    0,
  );

  return (
    <div>
      <header className="relative overflow-hidden border-b border-border/70 min-h-[220px] flex items-end">
        {/* Background Banner Image */}
        {tournament.banner_url ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={tournament.banner_url}
              alt={tournament.name}
              className="w-full h-full object-cover object-center opacity-40 blur-[1px] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          </div>
        ) : (
          <div
            className="absolute inset-0 z-0 opacity-50"
            style={{
              background:
                "radial-gradient(90% 120% at 15% 0%, oklch(0.34 0.08 84 / 55%), transparent 60%), var(--gradient-surface)",
            }}
          />
        )}

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 w-full">
          <div className="flex flex-wrap items-center gap-5">
            {tournament.logo_url ? (
              <img
                src={tournament.logo_url}
                alt={tournament.name}
                className="size-20 rounded-2xl object-contain border border-primary/40 p-2 bg-zinc-950/80 shadow-lg"
              />
            ) : (
              <span
                className="font-display grid size-20 place-items-center rounded-2xl border border-primary/40 text-xl text-primary"
                style={{ background: "var(--gradient-surface)" }}
              >
                TFF
              </span>
            )}
            <div>
              <StatusBadge status={tournament.status} />
              <h1 className="mt-2 text-4xl uppercase font-display tracking-wider sm:text-5xl">{tournament.name}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {formatDate(tournament.start_date)} — {formatDate(tournament.end_date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="size-3.5" />
                  {teams.data?.length ?? 0} Teams
                </span>
                <span>{FORMAT_LABELS[tournament.format]}</span>
              </p>
            </div>
          </div>

          <Tabs
            value={tab}
            onValueChange={(value) => navigate({ search: { tab: value as any } })}
            className="mt-8"
          >
            <TabsList className="flex-wrap">
              {TABS.map((value) => (
                <TabsTrigger key={value} value={value} className="capitalize">
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
        {tab === "overview" && (
          <div className="space-y-8">
            {champion && (
              <ChampionCard
                tournament={tournament}
                champion={champion}
                teams={teamMap}
                featured
              />
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Teams" value={teams.data?.length ?? 0} icon={<Shield className="size-4" />} />
              <StatCard label="Matches Played" value={`${completed.length} / ${allFixtures.length}`} />
              <StatCard label="Goals" value={goals} icon={<Goal className="size-4" />} />
              <StatCard
                label="Current Leader"
                value={<span className="text-2xl">{leader?.name ?? "—"}</span>}
                hint={`${ranked[0]?.points ?? 0} points`}
                icon={<Trophy className="size-4" />}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="panel p-6">
                <p className="label-caps mb-4 flex items-center gap-2 text-primary">
                  <Info className="size-4" /> Tournament Information
                </p>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <Detail label="Organizer" value={tournament.organizer} />
                  <Detail label="Format" value={FORMAT_LABELS[tournament.format] ?? "League"} />
                  <Detail label="Teams" value={String(teams.data?.length ?? 0)} />
                  <Detail label="Start" value={formatDate(tournament.start_date)} />
                  <Detail label="End" value={formatDate(tournament.end_date)} />
                  <Detail
                    label="Points"
                    value={`W ${tournament.points_win} / D ${tournament.points_draw} / L ${tournament.points_loss}`}
                  />
                </dl>
                {tournament.description && (
                  <p className="mt-5 text-sm text-muted-foreground">{tournament.description}</p>
                )}
                {tournament.rules && (
                  <p className="mt-3 border-t border-border/60 pt-3 text-sm text-muted-foreground">
                    <span className="label-caps mr-2 text-primary">Rules</span>
                    {tournament.rules}
                  </p>
                )}
              </div>

              <div className="panel p-6">
                <p className="label-caps mb-3 text-primary">Progress</p>
                <p className="font-display text-4xl">
                  {completed.length} / {allFixtures.length}
                </p>
                <Progress
                  className="mt-3"
                  value={allFixtures.length ? (completed.length / allFixtures.length) * 100 : 0}
                />
                <div className="mt-6 space-y-3">
                  <p className="label-caps text-muted-foreground">Top of the table</p>
                  {ranked.slice(0, 5).map((row, index) => (
                    <div key={row.team_id} className="flex items-center gap-3 text-sm">
                      <span className="font-display w-5 text-muted-foreground">{index + 1}</span>
                      <TeamLogo
                        name={teamMap.get(row.team_id)?.name ?? "Team"}
                        shortName={teamMap.get(row.team_id)?.short_name}
                        color={teamMap.get(row.team_id)?.team_color}
                        size="sm"
                      />
                      <span className="flex-1 truncate">{teamMap.get(row.team_id)?.name}</span>
                      <span className="font-display text-primary">{row.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl">Latest Results</h2>
                <div className="space-y-4">
                  {completed.slice(-3).reverse().map((fixture) => (
                    <ResultCard key={fixture.id} fixture={fixture} />
                  ))}
                  {!completed.length && (
                    <EmptyState title="No results yet" description="No results have been recorded yet." />
                  )}
                </div>
              </div>
              <div>
                <h2 className="mb-4 text-2xl">Next Matches</h2>
                <div className="space-y-4">
                  {upcoming.slice(0, 3).map((fixture) => (
                    <FixtureCard key={fixture.id} fixture={fixture} />
                  ))}
                  {!upcoming.length && (
                    <EmptyState title="No upcoming matches" description="All matches have been played." />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "fixtures" && <FixtureList fixtures={league} />}

        {tab === "results" &&
          (completed.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...completed].reverse().map((fixture) => (
                <ResultCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          ) : (
            <EmptyState title="No results yet" description="No results have been recorded yet." />
          ))}

        {tab === "standings" &&
          (ranked.length ? (
            <StandingsTable rows={ranked} teams={teams.data ?? []} />
          ) : (
            <EmptyState title="No standings yet" description="Standings appear once teams are added." />
          ))}

        {tab === "teams" &&
          (teams.data?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teams.data.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <EmptyState title="No teams registered" description="No teams have been registered." />
          ))}

        {tab === "knockout" &&
          (knockout.length ? (
            <KnockoutBracket fixtures={knockout} />
          ) : (
            <EmptyState
              title="No knockout stage"
              description="This tournament has no knockout fixtures yet."
            />
          ))}

        {tab === "statistics" && (
          <Statistics
            completed={completed}
            goals={goals}
            ranked={ranked}
            teamNames={teamMap}
            players={players.data ?? []}
          />
        )}

        {tab === "awards" && (
          <TournamentAwardsSection
            tournament={tournament}
            completedFixtures={completed}
            standings={standings.data ?? []}
            teamsMap={teamMap}
            champion={champion.data}
            playerStats={players.data ?? []}
          />
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-caps text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}

function FixtureList({ fixtures }: { fixtures: FixtureWithTeams[] }) {
  if (!fixtures.length) {
    return (
      <EmptyState
        title="No fixtures yet"
        description="Fixtures will appear once the TFF organizer generates them."
      />
    );
  }
  const matchdays = [...new Set(fixtures.map((f) => f.matchday ?? 0))].sort((a, b) => a - b);
  return (
    <div className="space-y-6">
      {matchdays.map((matchday) => {
        const group = fixtures.filter((f) => (f.matchday ?? 0) === matchday);
        return (
          <div key={matchday} className="panel overflow-hidden">
            {/* Matchday header */}
            <div className="bg-primary/10 border-b border-primary/20 px-5 py-3 flex items-center justify-between">
              <h2 className="font-display text-lg tracking-widest text-primary uppercase">
                Matchday {matchday}
              </h2>
              <span className="text-xs text-muted-foreground">
                {group[0]?.scheduled_date ? formatDate(group[0].scheduled_date) : `${group.length} match${group.length !== 1 ? "es" : ""}`}
              </span>
            </div>
            {/* Matches table */}
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border/40">
                {group.map((fixture) => (
                  <tr key={fixture.id} className="hover:bg-secondary/10 transition-colors">
                    {/* Home team */}
                    <td className="px-5 py-3 text-right font-semibold w-[42%]">
                      <div className="flex items-center justify-end gap-2">
                        <span>{fixture.home?.name || "TBD"}</span>
                        <TeamLogo
                          name={fixture.home?.name ?? ""}
                          shortName={(fixture.home as any)?.short_name}
                          color={(fixture.home as any)?.team_color}
                          logoUrl={(fixture.home as any)?.logo_url}
                          size="sm"
                        />
                      </div>
                    </td>
                    {/* Score / VS */}
                    <td className="px-2 py-3 text-center w-[16%]">
                      <span className={`inline-block px-3 py-1 rounded font-bold text-sm ${
                        fixture.status === "completed"
                          ? "bg-green-500/15 text-green-400 border border-green-500/30"
                          : "bg-primary/15 text-primary border border-primary/30"
                      }`}>
                        {fixture.status === "completed"
                          ? `${fixture.result?.home_score} – ${fixture.result?.away_score}`
                          : "VS"}
                      </span>
                    </td>
                    {/* Away team */}
                    <td className="px-5 py-3 text-left font-semibold w-[42%]">
                      <div className="flex items-center gap-2">
                        <TeamLogo
                          name={fixture.away?.name ?? ""}
                          shortName={(fixture.away as any)?.short_name}
                          color={(fixture.away as any)?.team_color}
                          logoUrl={(fixture.away as any)?.logo_url}
                          size="sm"
                        />
                        <span>{fixture.away?.name || "TBD"}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
function Statistics({
  completed,
  goals,
  ranked,
  teamNames,
  players,
}: {
  completed: FixtureWithTeams[];
  goals: number;
  ranked: ReturnType<typeof sortStandings>;
  teamNames: Map<string, { name: string }>;
  players: { player_name: string; goals: number; assists: number; motm: number }[];
}) {
  const completedWithResults = completed.filter(
    (f) => f.result && f.result.home_score !== null && f.result.home_score !== undefined
  );

  const biggest = [...completedWithResults].sort(
    (a, b) =>
      Math.abs((b.result?.home_score ?? 0) - (b.result?.away_score ?? 0)) -
      Math.abs((a.result?.home_score ?? 0) - (a.result?.away_score ?? 0)),
  )[0];

  const highest = [...completedWithResults].sort(
    (a, b) =>
      ((b.result?.home_score ?? 0) + (b.result?.away_score ?? 0)) -
      ((a.result?.home_score ?? 0) + (a.result?.away_score ?? 0)),
  )[0];

  const mostWins = [...ranked].sort((a, b) => b.wins - a.wins)[0];
  const bestDefense = [...ranked].sort((a, b) => a.goals_against - b.goals_against)[0];
  const mostGoals = [...ranked].sort((a, b) => b.goals_for - a.goals_for)[0];

  // Compute Clean Sheets per team
  const cleanSheetsMap = new Map<string, number>();
  for (const f of completed) {
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

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Matches" value={completed.length} />
        <StatCard label="Total Goals" value={goals} />
        <StatCard
          label="Goals / Match"
          value={completed.length ? (goals / completed.length).toFixed(2) : "0.00"}
        />
        <StatCard
          label="Biggest Victory"
          value={
            biggest && biggest.result
              ? `${biggest.result.home_score}-${biggest.result.away_score}`
              : "—"
          }
          hint={biggest ? `${biggest.home?.name} vs ${biggest.away?.name}` : undefined}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Most Wins"
          value={<span className="text-2xl">{teamNames.get(mostWins?.team_id ?? "")?.name ?? "—"}</span>}
          hint={`${mostWins?.wins ?? 0} wins`}
        />
        <StatCard
          label="Most Goals"
          value={<span className="text-2xl">{teamNames.get(mostGoals?.team_id ?? "")?.name ?? "—"}</span>}
          hint={`${mostGoals?.goals_for ?? 0} scored`}
        />
        <StatCard
          label="Best Defense"
          value={
            <span className="text-2xl">{teamNames.get(bestDefense?.team_id ?? "")?.name ?? "—"}</span>
          }
          hint={`${bestDefense?.goals_against ?? 0} conceded`}
        />
        <StatCard
          label="Most Clean Sheets 🧤"
          value={
            <span className="text-2xl">
              {topCleanSheetTeamId ? (teamNames.get(topCleanSheetTeamId)?.name ?? "—") : "—"}
            </span>
          }
          hint={topCleanSheetTeamId ? `${maxCleanSheets} clean sheet${maxCleanSheets !== 1 ? "s" : ""}` : "0 clean sheets"}
        />
      </div>

      {highest && highest.result && (
        <div className="panel p-6">
          <p className="label-caps text-primary">Highest scoring match</p>
          <p className="font-display mt-2 text-3xl">
            {highest.home?.name} {highest.result.home_score} — {highest.result.away_score}{" "}
            {highest.away?.name}
          </p>
        </div>
      )}

      {players.length > 0 && (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="label-caps border-b border-border/70 text-muted-foreground">
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-center">Goals</th>
                <th className="px-4 py-3 text-center">Assists</th>
                <th className="px-4 py-3 text-center">MOTM</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.player_name} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3 font-semibold">{player.player_name}</td>
                  <td className="px-4 py-3 text-center text-primary">{player.goals}</td>
                  <td className="px-4 py-3 text-center">{player.assists}</td>
                  <td className="px-4 py-3 text-center">{player.motm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Looking for the full table?{" "}
        <Link to="." search={{ tab: "standings" }} className="text-primary hover:underline">
          View standings
        </Link>
      </p>
    </div>
  );
}
