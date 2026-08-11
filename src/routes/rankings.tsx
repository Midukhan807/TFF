import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown } from "lucide-react";

import { TeamLogo } from "@/components/tff/branding";
import { EmptyState, SectionHeading } from "@/components/tff/ui";
import {
  DEFAULT_RANKING,
  buildCareers,
  fetchAllStandings,
  fetchChampions,
  fetchRankingConfig,
  fetchTeams,
} from "@/lib/tff";

export const Route = createFileRoute("/rankings")({
  head: () => ({
    meta: [
      { title: "TFF Global Rankings | TFF eFootball" },
      {
        name: "description",
        content:
          "TFF global rankings — all-time team power ratings built from every TFF tournament result, title and goal.",
      },
      { property: "og:title", content: "TFF Global Rankings | TFF eFootball" },
      {
        property: "og:description",
        content: "All-time TFF team rankings across every tournament ever played.",
      },
    ],
  }),
  component: RankingsPage,
});

function RankingsPage() {
  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const standings = useQuery({ queryKey: ["all-standings"], queryFn: fetchAllStandings });
  const champions = useQuery({ queryKey: ["champions"], queryFn: fetchChampions });
  const config = useQuery({ queryKey: ["ranking-config"], queryFn: fetchRankingConfig });

  const ranking = config.data ?? DEFAULT_RANKING;
  const careers = buildCareers(
    teams.data ?? [],
    standings.data ?? [],
    champions.data ?? [],
    ranking,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="All-Time"
        title="TFF Global Rankings"
        subtitle={`Ranking points: ${ranking.points_champion} per title, ${ranking.points_runner_up} for a runner-up finish, ${ranking.points_participation} per tournament entered.`}
      />

      {careers.length ? (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
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
                    <span className="inline-flex items-center gap-1 text-primary">
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
                  <td className="px-4 py-3 text-center">
                    {career.played ? Math.round((career.wins / career.played) * 100) : 0}%
                  </td>
                  <td className="font-display px-4 py-3 text-right text-xl text-primary">
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
