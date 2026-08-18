import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Filter } from "lucide-react";
import { useState } from "react";

import { TeamLogo } from "@/components/tff/branding";
import { EmptyState, SectionHeading } from "@/components/tff/ui";
import {
  DEFAULT_RANKING,
  buildCareers,
  fetchAllFixtures,
  fetchAllStandings,
  fetchChampions,
  fetchRankingConfig,
  fetchTeams,
  fetchTournaments,
} from "@/lib/tff";

export const Route = createFileRoute("/rankings")({
  head: () => ({
    meta: [
      { title: "TFF Global Rankings | Triad Football Federation Team Power Ratings" },
      {
        name: "description",
        content:
          "Official Triad Football Federation (TFF) Global Rankings — all-time team power ratings built from every Triad Champions League (TCL) tournament result, title, win, and goal.",
      },
      {
        name: "keywords",
        content:
          "TFF global rankings, Triad Football Federation rankings, Triad Champions League team ratings, TFF eFootball leaderboard",
      },
      { property: "og:title", content: "TFF Global Rankings | Triad Football Federation" },
      {
        property: "og:description",
        content: "All-time team power ratings across every Triad Football Federation (TFF) tournament.",
      },
    ],
  }),
  component: RankingsPage,
});

function RankingsPage() {
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>("all");

  const tournaments = useQuery({ queryKey: ["tournaments"], queryFn: fetchTournaments });
  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const standings = useQuery({ queryKey: ["all-standings"], queryFn: fetchAllStandings });
  const champions = useQuery({ queryKey: ["champions"], queryFn: fetchChampions });
  const config = useQuery({ queryKey: ["ranking-config"], queryFn: fetchRankingConfig });
  const fixtures = useQuery({ queryKey: ["all-fixtures"], queryFn: fetchAllFixtures });

  const ranking = config.data ?? DEFAULT_RANKING;

  // Filter standings, champions, and fixtures by selected tournament if not "all"
  const filteredStandings = (standings.data ?? []).filter((s) =>
    selectedTourneyId === "all" ? true : s.tournament_id === selectedTourneyId,
  );
  const filteredChampions = (champions.data ?? []).filter((c) =>
    selectedTourneyId === "all" ? true : c.tournament_id === selectedTourneyId,
  );
  const filteredFixtures = (fixtures.data ?? []).filter((f) =>
    selectedTourneyId === "all" ? true : f.tournament_id === selectedTourneyId,
  );

  let careers = buildCareers(
    teams.data ?? [],
    filteredStandings,
    filteredChampions,
    ranking,
    filteredFixtures,
  );

  // If a specific tournament is selected, only show teams that participated (or all if 0)
  if (selectedTourneyId !== "all") {
    const activeCareers = careers.filter((c) => c.played > 0 || c.tournaments > 0);
    if (activeCareers.length > 0) {
      careers = activeCareers;
    }
  }

  const selectedTourneyName =
    selectedTourneyId === "all"
      ? "All-Time"
      : tournaments.data?.find((t) => t.id === selectedTourneyId)?.name ?? "Selected Tournament";

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 space-y-8">
      {/* Header and Filter */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-border/70 pb-6">
        <div>
          <p className="label-caps text-xs text-primary mb-1">
            {selectedTourneyId === "all" ? "All-Time" : "Tournament Filter"}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-wide uppercase">
            {selectedTourneyId === "all" ? "TFF Global Rankings" : `${selectedTourneyName}`}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {selectedTourneyId === "all"
              ? "All-time team power ratings built from every TFF tournament result, title and match win."
              : `Standings & rating metrics for ${selectedTourneyName}.`}
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 bg-secondary/30 p-2 rounded-xl border border-border/60 shrink-0">
          <Filter className="size-4 text-primary ml-1" />
          <span className="text-xs font-semibold label-caps text-muted-foreground hidden sm:inline">Filter:</span>
          <select
            value={selectedTourneyId}
            onChange={(e) => setSelectedTourneyId(e.target.value)}
            className="bg-background border border-border text-sm font-semibold rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          >
            <option value="all">🏆 All-Time (All Tournaments)</option>
            {tournaments.data?.map((t) => (
              <option key={t.id} value={t.id}>
                ⚽ {t.name} ({t.season_year || "Past"})
              </option>
            ))}
          </select>
        </div>
      </div>

      {careers.length ? (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="label-caps border-b border-border/70 text-muted-foreground">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-center">Titles</th>
                <th className="px-4 py-3 text-center">Tour.</th>
                <th className="px-4 py-3 text-center">P</th>
                <th className="px-4 py-3 text-center">W</th>
                <th className="px-4 py-3 text-center">D</th>
                <th className="px-4 py-3 text-center">L</th>
                <th className="px-4 py-3 text-center">GF</th>
                <th className="px-4 py-3 text-center">GA</th>
                <th className="px-3 py-3 text-center text-yellow-400" title="Yellow Cards">YC</th>
                <th className="px-3 py-3 text-center text-red-400" title="Red Cards">RC</th>
                <th className="px-4 py-3 text-center">Win %</th>
                <th className="px-4 py-3 text-right">Rating</th>
              </tr>
            </thead>
            <tbody>
              {careers.map((career, index) => (
                <tr
                  key={career.team.id}
                  className={`border-b border-border/40 last:border-0 ${index < 3 ? "bg-primary/5" : ""}`}
                >
                  <td className="px-4 py-3">
                    <span className="font-display text-lg text-muted-foreground">{index + 1}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to="/team/$teamId"
                      params={{ teamId: career.team.id }}
                      className="flex items-center gap-3 font-semibold hover:text-primary"
                    >
                      <TeamLogo
                        name={career.team.name}
                        shortName={career.team.short_name}
                        color={career.team.team_color}
                        logoUrl={career.team.logo_url}
                        size="sm"
                      />
                      {career.team.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-primary font-bold">
                      {career.titles > 0 && <Crown className="size-3.5" />}
                      {career.titles}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{career.tournaments}</td>
                  <td className="px-4 py-3 text-center">{career.played}</td>
                  <td className="px-4 py-3 text-center">{career.wins}</td>
                  <td className="px-4 py-3 text-center">{career.draws}</td>
                  <td className="px-4 py-3 text-center">{career.losses}</td>
                  <td className="px-4 py-3 text-center">{career.goalsFor}</td>
                  <td className="px-4 py-3 text-center">{career.goalsAgainst}</td>
                  <td className="px-3 py-3 text-center">
                    <span className="inline-flex items-center justify-center gap-1 rounded bg-yellow-500/10 px-1.5 py-0.5 text-xs font-semibold text-yellow-400 border border-yellow-500/20">
                      <span className="inline-block size-2 rounded-sm bg-yellow-400" />
                      {career.yellowCards}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="inline-flex items-center justify-center gap-1 rounded bg-red-500/10 px-1.5 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20">
                      <span className="inline-block size-2 rounded-sm bg-red-500" />
                      {career.redCards}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {career.played ? Math.round((career.wins / career.played) * 100) : 0}%
                  </td>
                  <td className="font-display px-4 py-3 text-right text-xl text-primary font-bold">
                    {career.rankingPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No ranking data yet"
          description="Rankings appear once TFF tournaments have been played."
        />
      )}
    </div>
  );
}

