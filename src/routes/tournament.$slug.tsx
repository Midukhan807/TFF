import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Award,
  CalendarDays,
  Flame,
  Goal,
  Info,
  Medal,
  Shield,
  ShieldAlert,
  Sparkles,
  Trophy,
} from "lucide-react";

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
  type PlayerStat,
  type Team,
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
  validateSearch: (search: Record<string, unknown>) => {
    let tabVal = typeof search["tab"] === "string" ? (search["tab"] as string) : "overview";
    if (tabVal === "stats") tabVal = "statistics";
    return {
      tab: TABS.includes(tabVal as any) ? tabVal : "overview",
    };
  },
  errorComponent: ({ error }) => {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="panel p-6 bg-red-950/60 border-red-500/50 text-red-200 space-y-3">
          <h2 className="text-lg font-bold text-red-400">Tournament Detail Error</h2>
          <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto bg-black/60 p-4 rounded-xl border border-red-500/30">
            {error instanceof Error ? error.stack || error.message : JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
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
  const isKnockoutFixture = (f: FixtureWithTeams) =>
    f.stage === "knockout" || Boolean(f.round && f.round.trim().length > 0);

  const league = allFixtures.filter((f) => !isKnockoutFixture(f));
  const knockout = allFixtures.filter((f) => isKnockoutFixture(f));
  const completed = allFixtures.filter((f) => f.status === "completed" && f.result);
  const upcoming = allFixtures.filter((f) => f.status === "scheduled");
  const ranked = sortStandings(standings.data ?? [], tournament.tiebreakers);
  const teamMap = new Map((teams.data ?? []).map((t) => [t.id, t]));
  const leader = ranked[0] ? teamMap.get(ranked[0].team_id) : null;
  const champion = (champions.data ?? []).find((c) => c.tournament_id === tournament.id);

  const completedKnockout = completed.filter(isKnockoutFixture);
  const completedLeague = completed.filter((f) => !isKnockoutFixture(f));

  const leagueGoalsFromStandings = ranked.reduce((sum, r) => sum + (Number(r.goals_for) || 0), 0);
  const leagueMatchesFromStandings = Math.round(
    ranked.reduce((sum, r) => sum + (Number(r.played) || 0), 0) / 2
  );
  const knockoutGoals = completedKnockout.reduce(
    (sum, f) => sum + ((Number(f.result?.home_score) || 0) + (Number(f.result?.away_score) || 0)),
    0
  );

  const fixtureGoalsSum = completed.reduce(
    (sum, f) => sum + ((Number(f.result?.home_score) || 0) + (Number(f.result?.away_score) || 0)),
    0,
  );

  const totalGoals = completedLeague.length > 0
    ? fixtureGoalsSum
    : leagueGoalsFromStandings + knockoutGoals;

  const totalCompletedMatches = completedLeague.length > 0
    ? completed.length
    : leagueMatchesFromStandings + completedKnockout.length;

  const totalFixturesCount = completedLeague.length > 0
    ? allFixtures.length
    : leagueMatchesFromStandings + allFixtures.length;

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
            onValueChange={(value) => navigate({ to: ".", search: (prev) => ({ ...prev, tab: value as any }) })}
            className="mt-8"
          >
            <TabsList className="flex-wrap">
              {TABS.map((value) => (
                <TabsTrigger key={value} value={value} className="capitalize">
                  {value === "statistics" ? "Stats" : value}
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
              <StatCard label="Matches Played" value={`${totalCompletedMatches} / ${totalFixturesCount}`} />
              <StatCard label="Goals" value={totalGoals} icon={<Goal className="size-4" />} />
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
                  {totalCompletedMatches} / {totalFixturesCount}
                </p>
                <Progress
                  className="mt-3"
                  value={totalFixturesCount ? (totalCompletedMatches / totalFixturesCount) * 100 : 0}
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
            goals={totalGoals}
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
            champion={champion}
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
  const [selectedMatchday, setSelectedMatchday] = useState<number | "all">("all");

  if (!fixtures.length) {
    return (
      <EmptyState
        title="No fixtures yet"
        description="Fixtures will appear once the TFF organizer generates them."
      />
    );
  }
  const matchdays = [...new Set(fixtures.map((f) => f.matchday ?? 0))].sort((a, b) => a - b);
  const visibleMatchdays =
    selectedMatchday === "all"
      ? matchdays
      : matchdays.filter((md) => md === selectedMatchday);

  return (
    <div className="space-y-6">
      {/* Matchday Filter Buttons */}
      {matchdays.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-card/60 border border-border/80 rounded-xl">
          <button
            type="button"
            onClick={() => setSelectedMatchday("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMatchday === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            }`}
          >
            All Matchdays ({fixtures.length})
          </button>
          {matchdays.map((md) => {
            const count = fixtures.filter((f) => (f.matchday ?? 0) === md).length;
            return (
              <button
                type="button"
                key={md}
                onClick={() => setSelectedMatchday(md)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedMatchday === md
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                Matchday {md} ({count})
              </button>
            );
          })}
        </div>
      )}

      {visibleMatchdays.map((matchday) => {
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
  );
}

interface TeamStatsAggregated {
  teamId: string;
  team: Team | undefined;
  played: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  yellowCards: number;
  redCards: number;
  cleanSheets: number;
  fairPlayScore: number;
}

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
  teamNames: Map<string, Team>;
  players: PlayerStat[];
}) {
  const [activeLeaderboard, setActiveLeaderboard] = useState<
    "all" | "goals" | "yellow" | "red" | "fairplay"
  >("all");

  const completedWithResults = completed.filter(
    (f) => f.result && f.result.home_score !== null && f.result.home_score !== undefined
  );

  // 1. Build comprehensive team statistics
  const teamStatsMap = new Map<string, TeamStatsAggregated>();

  // Ensure all tournament teams exist in the map
  for (const [id, t] of teamNames.entries()) {
    teamStatsMap.set(id, {
      teamId: id,
      team: t,
      played: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      yellowCards: 0,
      redCards: 0,
      cleanSheets: 0,
      fairPlayScore: 0,
    });
  }

  // Populate league / group stage stats from standings if available
  const hasLeagueStandings = ranked.length > 0;
  for (const row of ranked) {
    const entry = teamStatsMap.get(row.team_id) || {
      teamId: row.team_id,
      team: teamNames.get(row.team_id),
      played: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      yellowCards: 0,
      redCards: 0,
      cleanSheets: 0,
      fairPlayScore: 0,
    };
    entry.played = Number(row.played) || 0;
    entry.goalsFor = Number(row.goals_for) || 0;
    entry.goalsAgainst = Number(row.goals_against) || 0;
    entry.goalDiff = row.goal_difference ?? (entry.goalsFor - entry.goalsAgainst);
    entry.yellowCards = Number(row.yellow_cards) || 0;
    entry.redCards = Number(row.red_cards) || 0;
    teamStatsMap.set(row.team_id, entry);
  }

  const isKnockoutMatch = (f: FixtureWithTeams) =>
    f.stage === "knockout" || Boolean(f.round && f.round.trim().length > 0);

  // Aggregate cards, clean sheets, and knockout match stats (Quarter-Finals, Semi-Finals, Finals, etc.)
  const fixtureCards = new Map<string, { yellow: number; red: number }>();

  for (const f of completedWithResults) {
    const res = f.result;
    if (!res) continue;

    const homeId = f.home_team_id;
    const awayId = f.away_team_id;
    const homeScore = Number(res.home_score) || 0;
    const awayScore = Number(res.away_score) || 0;
    const homeYellow = Number(res.home_yellow_cards) || 0;
    const awayYellow = Number(res.away_yellow_cards) || 0;
    const homeRed = Number(res.home_red_cards) || 0;
    const awayRed = Number(res.away_red_cards) || 0;

    const isKnockout = isKnockoutMatch(f);

    if (homeId) {
      const cur = fixtureCards.get(homeId) || { yellow: 0, red: 0 };
      cur.yellow += homeYellow;
      cur.red += homeRed;
      fixtureCards.set(homeId, cur);
    }
    if (awayId) {
      const cur = fixtureCards.get(awayId) || { yellow: 0, red: 0 };
      cur.yellow += awayYellow;
      cur.red += awayRed;
      fixtureCards.set(awayId, cur);
    }

    if (homeId && teamStatsMap.has(homeId)) {
      const homeEntry = teamStatsMap.get(homeId)!;
      if (awayScore === 0) homeEntry.cleanSheets += 1;

      // Add match stats for knockout matches (Quarter-Finals, Semi-Finals, Finals, etc.)
      // OR if tournament has no league standings table, count all completed fixtures
      if (isKnockout || !hasLeagueStandings) {
        homeEntry.played += 1;
        homeEntry.goalsFor += homeScore;
        homeEntry.goalsAgainst += awayScore;
      }
    }

    if (awayId && teamStatsMap.has(awayId)) {
      const awayEntry = teamStatsMap.get(awayId)!;
      if (homeScore === 0) awayEntry.cleanSheets += 1;

      if (isKnockout || !hasLeagueStandings) {
        awayEntry.played += 1;
        awayEntry.goalsFor += awayScore;
        awayEntry.goalsAgainst += homeScore;
      }
    }
  }

  // Recalculate goal difference, cards, and fair play scores
  for (const [id, entry] of teamStatsMap.entries()) {
    const fCards = fixtureCards.get(id);
    if (fCards) {
      entry.yellowCards = Math.max(entry.yellowCards, fCards.yellow);
      entry.redCards = Math.max(entry.redCards, fCards.red);
    }
    entry.goalDiff = entry.goalsFor - entry.goalsAgainst;
    // FIFA/UEFA Fair Play metric: 1 pt per yellow, 3 pts per red
    entry.fairPlayScore = entry.yellowCards * 1 + entry.redCards * 3;
  }

  const allTeamStats = Array.from(teamStatsMap.values());

  // 2. Leaderboards
  const teamGoalsLeaderboard = [...allTeamStats].sort((a, b) => {
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    return a.played - b.played;
  });

  const yellowCardsLeaderboard = [...allTeamStats].sort((a, b) => {
    if (b.yellowCards !== a.yellowCards) return b.yellowCards - a.yellowCards;
    return b.played - a.played;
  });

  const redCardsLeaderboard = [...allTeamStats].sort((a, b) => {
    if (b.redCards !== a.redCards) return b.redCards - a.redCards;
    if (b.yellowCards !== a.yellowCards) return b.yellowCards - a.yellowCards;
    return b.played - a.played;
  });

  const fairPlayLeaderboard = [...allTeamStats].sort((a, b) => {
    if (a.fairPlayScore !== b.fairPlayScore) return a.fairPlayScore - b.fairPlayScore;
    if (a.redCards !== b.redCards) return a.redCards - b.redCards;
    return a.yellowCards - b.yellowCards;
  });

  const playerScorersLeaderboard = [...players].sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    if (b.assists !== a.assists) return b.assists - a.assists;
    return b.motm - a.motm;
  });

  // Aggregate Totals
  const totalTournamentGoals = allTeamStats.reduce((acc, t) => acc + t.goalsFor, 0);
  const totalTournamentMatches = Math.round(allTeamStats.reduce((acc, t) => acc + t.played, 0) / 2);
  const totalYellows = allTeamStats.reduce((acc, t) => acc + t.yellowCards, 0);
  const totalReds = allTeamStats.reduce((acc, t) => acc + t.redCards, 0);

  const topScorerPlayer = playerScorersLeaderboard[0];
  const topScoringTeam = teamGoalsLeaderboard[0];
  const topYellowTeam = yellowCardsLeaderboard[0];
  const topRedTeam = redCardsLeaderboard[0];
  const cleanestTeam = fairPlayLeaderboard.find((t) => t.played > 0) ?? fairPlayLeaderboard[0];

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

  const getRankBadge = (index: number) => {
    if (index === 0)
      return (
        <span className="inline-flex items-center justify-center size-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold shadow-sm">
          🥇
        </span>
      );
    if (index === 1)
      return (
        <span className="inline-flex items-center justify-center size-6 rounded-full bg-zinc-400/20 text-zinc-300 border border-zinc-400/40 text-xs font-bold shadow-sm">
          🥈
        </span>
      );
    if (index === 2)
      return (
        <span className="inline-flex items-center justify-center size-6 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 text-xs font-bold shadow-sm">
          🥉
        </span>
      );
    return (
      <span className="inline-flex items-center justify-center size-6 rounded-full bg-secondary/80 text-muted-foreground text-xs font-semibold">
        {index + 1}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards: Matches, Goals, Yellow Cards, Red Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Goals"
          value={totalTournamentGoals}
          hint={totalTournamentMatches ? `${(totalTournamentGoals / totalTournamentMatches).toFixed(2)} goals / match` : "0.00 / match"}
          icon={<Goal className="size-4 text-primary" />}
        />
        <StatCard
          label="Yellow Cards 🟨"
          value={totalYellows}
          hint={totalTournamentMatches ? `${(totalYellows / totalTournamentMatches).toFixed(2)} cards / match` : "0.00 / match"}
          icon={<AlertTriangle className="size-4 text-yellow-400" />}
        />
        <StatCard
          label="Red Cards 🟥"
          value={totalReds}
          hint={totalTournamentMatches ? `${(totalReds / totalTournamentMatches).toFixed(2)} send-offs / match` : "0 send-offs"}
          icon={<ShieldAlert className="size-4 text-red-500" />}
        />
        <StatCard
          label="Total Matches"
          value={totalTournamentMatches}
          hint={highest ? `Highest: ${highest.home?.name} ${highest.result?.home_score}-${highest.result?.away_score} ${highest.away?.name}` : "Matches played"}
          icon={<Trophy className="size-4 text-amber-400" />}
        />
      </div>

      {/* Featured Leaderboard Highlight Badges */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Top Scorer Card */}
        <div className="panel p-4 bg-gradient-to-b from-amber-950/30 via-card to-card border-amber-500/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="label-caps text-amber-400 flex items-center gap-1.5 text-[11px] font-bold">
              <Flame className="size-3.5 text-amber-400" /> Top Scorer
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
              {topScorerPlayer ? `${topScorerPlayer.goals} Goals` : topScoringTeam ? `${topScoringTeam.goalsFor} Goals` : "0"}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            {topScorerPlayer ? (
              <div>
                <p className="font-display font-bold text-lg text-foreground truncate">{topScorerPlayer.player_name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {teamNames.get(topScorerPlayer.team_id ?? "")?.name ?? "Tournament Leader"}
                </p>
              </div>
            ) : topScoringTeam ? (
              <div className="flex items-center gap-2.5">
                <TeamLogo
                  name={topScoringTeam.team?.name}
                  shortName={topScoringTeam.team?.short_name}
                  color={topScoringTeam.team?.team_color}
                  logoUrl={topScoringTeam.team?.logo_url}
                  size="sm"
                />
                <div>
                  <p className="font-display font-bold text-base text-foreground">{topScoringTeam.team?.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Top Attacking Team</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No goals recorded</p>
            )}
          </div>
        </div>

        {/* Most Yellow Cards Card */}
        <div className="panel p-4 bg-gradient-to-b from-yellow-950/30 via-card to-card border-yellow-500/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="label-caps text-yellow-400 flex items-center gap-1.5 text-[11px] font-bold">
              🟨 Most Yellows
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
              {topYellowTeam?.yellowCards ?? 0} Cards
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            {topYellowTeam ? (
              <>
                <TeamLogo
                  name={topYellowTeam.team?.name}
                  shortName={topYellowTeam.team?.short_name}
                  color={topYellowTeam.team?.team_color}
                  logoUrl={topYellowTeam.team?.logo_url}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="font-display font-bold text-base text-foreground truncate">
                    {topYellowTeam.team?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {topYellowTeam.played ? `${(topYellowTeam.yellowCards / topYellowTeam.played).toFixed(1)} / game` : "0 / game"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Clean record</p>
            )}
          </div>
        </div>

        {/* Most Red Cards Card */}
        <div className="panel p-4 bg-gradient-to-b from-red-950/30 via-card to-card border-red-500/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="label-caps text-red-400 flex items-center gap-1.5 text-[11px] font-bold">
              🟥 Most Reds
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30">
              {topRedTeam?.redCards ?? 0} Cards
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            {topRedTeam && topRedTeam.redCards > 0 ? (
              <>
                <TeamLogo
                  name={topRedTeam.team?.name}
                  shortName={topRedTeam.team?.short_name}
                  color={topRedTeam.team?.team_color}
                  logoUrl={topRedTeam.team?.logo_url}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="font-display font-bold text-base text-foreground truncate">
                    {topRedTeam.team?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {topRedTeam.redCards} expulsion{topRedTeam.redCards > 1 ? "s" : ""}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
                <Sparkles className="size-4" /> Zero red cards so far!
              </p>
            )}
          </div>
        </div>

        {/* Fair Play Card */}
        <div className="panel p-4 bg-gradient-to-b from-emerald-950/30 via-card to-card border-emerald-500/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="label-caps text-emerald-400 flex items-center gap-1.5 text-[11px] font-bold">
              🕊️ Fair Play Leader
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              {cleanestTeam?.fairPlayScore ?? 0} Pts
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            {cleanestTeam ? (
              <>
                <TeamLogo
                  name={cleanestTeam.team?.name}
                  shortName={cleanestTeam.team?.short_name}
                  color={cleanestTeam.team?.team_color}
                  logoUrl={cleanestTeam.team?.logo_url}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="font-display font-bold text-base text-foreground truncate">
                    {cleanestTeam.team?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cleanestTeam.yellowCards} 🟨 · {cleanestTeam.redCards} 🟥
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard View Switcher / Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-border/70 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveLeaderboard("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLeaderboard === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            All Leaderboards
          </button>
          <button
            onClick={() => setActiveLeaderboard("goals")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLeaderboard === "goals"
                ? "bg-amber-500 text-black font-bold shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            ⚽ Most Goals
          </button>
          <button
            onClick={() => setActiveLeaderboard("yellow")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLeaderboard === "yellow"
                ? "bg-yellow-500 text-black font-bold shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            🟨 Yellow Cards
          </button>
          <button
            onClick={() => setActiveLeaderboard("red")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLeaderboard === "red"
                ? "bg-red-600 text-white font-bold shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            🟥 Red Cards
          </button>
          <button
            onClick={() => setActiveLeaderboard("fairplay")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLeaderboard === "fairplay"
                ? "bg-emerald-600 text-white font-bold shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            🕊️ Fair Play
          </button>
        </div>
      </div>

      {/* 1. MOST GOALS SECTION */}
      {(activeLeaderboard === "all" || activeLeaderboard === "goals") && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display uppercase tracking-wider flex items-center gap-2 text-amber-400">
              <Goal className="size-5" /> Most Goals Leaderboard
            </h3>
            <span className="text-xs text-muted-foreground">
              {totalTournamentGoals} total tournament goals
            </span>
          </div>

          {/* Player Scorers (if data exists) */}
          {playerScorersLeaderboard.length > 0 && (
            <div className="panel p-0 overflow-hidden border-border/80">
              <div className="p-3.5 bg-secondary/40 border-b border-border/60 flex items-center justify-between">
                <p className="text-xs uppercase font-bold text-primary tracking-wider flex items-center gap-1.5">
                  <Flame className="size-3.5 text-amber-400" /> Player Top Scorers (Golden Boot)
                </p>
                <span className="text-[11px] text-muted-foreground">{playerScorersLeaderboard.length} Players</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="label-caps border-b border-border/70 text-muted-foreground bg-muted/20 text-xs">
                      <th className="px-4 py-3 text-center w-12">#</th>
                      <th className="px-4 py-3 text-left">Player</th>
                      <th className="px-4 py-3 text-left">Team</th>
                      <th className="px-4 py-3 text-center font-bold text-amber-400">Goals</th>
                      <th className="px-4 py-3 text-center">Assists</th>
                      <th className="px-4 py-3 text-center">MOTM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerScorersLeaderboard.map((p, idx) => {
                      const t = teamNames.get(p.team_id ?? "");
                      return (
                        <tr
                          key={p.id || `${p.player_name}-${idx}`}
                          className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors"
                        >
                          <td className="px-4 py-3 text-center">{getRankBadge(idx)}</td>
                          <td className="px-4 py-3 font-semibold text-foreground">{p.player_name}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <TeamLogo
                                name={t?.name}
                                shortName={t?.short_name}
                                color={t?.team_color}
                                logoUrl={t?.logo_url}
                                size="xs"
                              />
                              <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                                {t?.name ?? "—"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-display font-extrabold text-base text-amber-400">
                            {p.goals}
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground">{p.assists}</td>
                          <td className="px-4 py-3 text-center">
                            {p.motm > 0 ? (
                              <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                                🌟 {p.motm}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/60">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Team Goals Leaderboard */}
          <div className="panel p-0 overflow-hidden border-border/80">
            <div className="p-3.5 bg-secondary/40 border-b border-border/60 flex items-center justify-between">
              <p className="text-xs uppercase font-bold text-primary tracking-wider flex items-center gap-1.5">
                <Trophy className="size-3.5 text-primary" /> Team Attack Leaderboard (Most Goals Scored)
              </p>
              <span className="text-[11px] text-muted-foreground">{teamGoalsLeaderboard.length} Teams</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="label-caps border-b border-border/70 text-muted-foreground bg-muted/20 text-xs">
                    <th className="px-4 py-3 text-center w-12">#</th>
                    <th className="px-4 py-3 text-left">Team</th>
                    <th className="px-4 py-3 text-center">Played</th>
                    <th className="px-4 py-3 text-center font-bold text-amber-400">Goals For (GF)</th>
                    <th className="px-4 py-3 text-center">Goals / Game</th>
                    <th className="px-4 py-3 text-center">Conceded</th>
                    <th className="px-4 py-3 text-center">GD</th>
                  </tr>
                </thead>
                <tbody>
                  {teamGoalsLeaderboard.map((t, idx) => (
                    <tr
                      key={t.teamId}
                      className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-4 py-3 text-center">{getRankBadge(idx)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <TeamLogo
                            name={t.team?.name}
                            shortName={t.team?.short_name}
                            color={t.team?.team_color}
                            logoUrl={t.team?.logo_url}
                            size="xs"
                          />
                          <span className="font-semibold text-foreground">{t.team?.name ?? "Unknown Team"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{t.played}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2.5 py-0.5 font-display font-extrabold text-base text-amber-400 border border-amber-500/30">
                          {t.goalsFor}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-xs">
                        {t.played ? (t.goalsFor / t.played).toFixed(2) : "0.00"}
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{t.goalsAgainst}</td>
                      <td className={`px-4 py-3 text-center font-bold ${t.goalDiff > 0 ? "text-emerald-400" : t.goalDiff < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                        {t.goalDiff > 0 ? `+${t.goalDiff}` : t.goalDiff}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. YELLOW CARDS LEADERBOARD */}
      {(activeLeaderboard === "all" || activeLeaderboard === "yellow") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display uppercase tracking-wider flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="size-5 text-yellow-400" /> Yellow Cards Leaderboard
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 font-bold">
              Total 🟨: {totalYellows}
            </span>
          </div>

          <div className="panel p-0 overflow-hidden border-yellow-500/30">
            <div className="p-3.5 bg-yellow-950/20 border-b border-yellow-500/20 flex items-center justify-between">
              <p className="text-xs uppercase font-bold text-yellow-400 tracking-wider flex items-center gap-1.5">
                🟨 Team Cautions & Disciplinary Record
              </p>
              <span className="text-[11px] text-muted-foreground">Sorted by most yellow cards</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="label-caps border-b border-border/70 text-muted-foreground bg-muted/20 text-xs">
                    <th className="px-4 py-3 text-center w-12">#</th>
                    <th className="px-4 py-3 text-left">Team</th>
                    <th className="px-4 py-3 text-center">Played</th>
                    <th className="px-4 py-3 text-center font-bold text-yellow-400">Yellow Cards</th>
                    <th className="px-4 py-3 text-center">Cards / Match</th>
                    <th className="px-4 py-3 text-center">Discipline Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {yellowCardsLeaderboard.map((t, idx) => {
                    const avg = t.played ? (t.yellowCards / t.played).toFixed(2) : "0.00";
                    return (
                      <tr
                        key={t.teamId}
                        className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-center">
                          {idx === 0 && t.yellowCards > 0 ? (
                            <span className="inline-flex items-center justify-center size-6 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-xs font-bold">
                              #1
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">{idx + 1}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <TeamLogo
                              name={t.team?.name}
                              shortName={t.team?.short_name}
                              color={t.team?.team_color}
                              logoUrl={t.team?.logo_url}
                              size="xs"
                            />
                            <span className="font-semibold text-foreground">{t.team?.name ?? "Unknown Team"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-muted-foreground">{t.played}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-500/15 px-3 py-1 font-display font-extrabold text-base text-yellow-400 border border-yellow-500/30">
                            🟨 {t.yellowCards}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-muted-foreground font-medium">
                          {avg} / game
                        </td>
                        <td className="px-4 py-3 text-center">
                          {t.yellowCards === 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Clean Record
                            </span>
                          ) : t.yellowCards >= 5 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30">
                              ⚠️ High Caution
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 bg-zinc-800/40 px-2 py-0.5 rounded">
                              Moderate
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. RED CARDS LEADERBOARD */}
      {(activeLeaderboard === "all" || activeLeaderboard === "red") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display uppercase tracking-wider flex items-center gap-2 text-red-500">
              <ShieldAlert className="size-5 text-red-500" /> Red Cards Leaderboard
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 font-bold">
              Total 🟥: {totalReds}
            </span>
          </div>

          <div className="panel p-0 overflow-hidden border-red-500/30">
            <div className="p-3.5 bg-red-950/20 border-b border-red-500/20 flex items-center justify-between">
              <p className="text-xs uppercase font-bold text-red-400 tracking-wider flex items-center gap-1.5">
                🟥 Send-Offs & Red Card Infractions
              </p>
              <span className="text-[11px] text-muted-foreground">Sorted by most red cards</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="label-caps border-b border-border/70 text-muted-foreground bg-muted/20 text-xs">
                    <th className="px-4 py-3 text-center w-12">#</th>
                    <th className="px-4 py-3 text-left">Team</th>
                    <th className="px-4 py-3 text-center">Played</th>
                    <th className="px-4 py-3 text-center font-bold text-red-400">Red Cards</th>
                    <th className="px-4 py-3 text-center">Reds / Match</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {redCardsLeaderboard.map((t, idx) => {
                    const avg = t.played ? (t.redCards / t.played).toFixed(2) : "0.00";
                    return (
                      <tr
                        key={t.teamId}
                        className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-center">
                          {idx === 0 && t.redCards > 0 ? (
                            <span className="inline-flex items-center justify-center size-6 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold">
                              #1
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">{idx + 1}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <TeamLogo
                              name={t.team?.name}
                              shortName={t.team?.short_name}
                              color={t.team?.team_color}
                              logoUrl={t.team?.logo_url}
                              size="xs"
                            />
                            <span className="font-semibold text-foreground">{t.team?.name ?? "Unknown Team"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-muted-foreground">{t.played}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-display font-extrabold text-base border ${
                              t.redCards > 0
                                ? "bg-red-500/20 text-red-400 border-red-500/40 shadow-sm"
                                : "bg-secondary text-muted-foreground border-border/40"
                            }`}
                          >
                            🟥 {t.redCards}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-muted-foreground font-medium">
                          {avg} / game
                        </td>
                        <td className="px-4 py-3 text-center">
                          {t.redCards === 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              ✓ No Red Cards
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded border border-red-500/30">
                              🚨 Suspensions
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. FULL FAIR PLAY & DISCIPLINARY TABLE */}
      {(activeLeaderboard === "all" || activeLeaderboard === "fairplay") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display uppercase tracking-wider flex items-center gap-2 text-emerald-400">
              <Award className="size-5 text-emerald-400" /> Fair Play & Discipline Standings
            </h3>
            <span className="text-xs text-muted-foreground">
              Formula: 🟨 = 1pt · 🟥 = 3pts (Lowest score is cleanest)
            </span>
          </div>

          <div className="panel p-0 overflow-hidden border-border/80">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="label-caps border-b border-border/70 text-muted-foreground bg-muted/20 text-xs">
                    <th className="px-4 py-3 text-center w-12">Rank</th>
                    <th className="px-4 py-3 text-left">Team</th>
                    <th className="px-4 py-3 text-center">Played</th>
                    <th className="px-4 py-3 text-center text-yellow-400">Yellow (1pt)</th>
                    <th className="px-4 py-3 text-center text-red-400">Red (3pts)</th>
                    <th className="px-4 py-3 text-center font-bold text-foreground">Penalty Points</th>
                    <th className="px-4 py-3 text-center">Clean Sheets</th>
                    <th className="px-4 py-3 text-center">Fair Play Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {fairPlayLeaderboard.map((t, idx) => {
                    const grade =
                      t.fairPlayScore === 0
                        ? { label: "Perfect (A+)", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" }
                        : t.fairPlayScore <= 3
                        ? { label: "Good (A)", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" }
                        : t.fairPlayScore <= 6
                        ? { label: "Fair (B)", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" }
                        : { label: "Poor (C)", color: "text-red-400 bg-red-500/10 border-red-500/20" };

                    return (
                      <tr
                        key={t.teamId}
                        className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-center">{getRankBadge(idx)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <TeamLogo
                              name={t.team?.name}
                              shortName={t.team?.short_name}
                              color={t.team?.team_color}
                              logoUrl={t.team?.logo_url}
                              size="xs"
                            />
                            <span className="font-semibold text-foreground">{t.team?.name ?? "Unknown Team"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-muted-foreground">{t.played}</td>
                        <td className="px-4 py-3 text-center font-semibold text-yellow-400">
                          {t.yellowCards}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-red-400">
                          {t.redCards}
                        </td>
                        <td className="px-4 py-3 text-center font-display font-extrabold text-foreground">
                          {t.fairPlayScore}
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-muted-foreground font-medium">
                          {t.cleanSheets} 🧤
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold border ${grade.color}`}
                          >
                            {grade.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quick link to standings table */}
      <p className="text-xs text-muted-foreground pt-2">
        Looking for tournament points and standings?{" "}
        <Link to="." search={{ tab: "standings" }} className="text-primary hover:underline font-semibold">
          View full standings table →
        </Link>
      </p>
    </div>
  );
}
// Clean HMR trigger

