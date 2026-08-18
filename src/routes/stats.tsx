import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { StatsLabDashboard } from "@/components/tff/stats-lab";
import { fetchAllFixtures, fetchTeams, fetchTournaments } from "@/lib/tff";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "TFF Stats Lab | Triad Football Federation Advanced Analytics" },
      {
        name: "description",
        content:
          "Official Triad Football Federation (TFF) Stats Lab — Advanced eFootball tournament metrics, Attack Power Index, Defensive Solidity Index, and team analytics.",
      },
      {
        name: "keywords",
        content:
          "TFF stats lab, Triad Football Federation analytics, eFootball team statistics, TFF attack power index, TFF defensive ratings",
      },
      { property: "og:title", content: "TFF Stats Lab | Triad Football Federation Analytics" },
      {
        property: "og:description",
        content: "Advanced eFootball analytics and team performance indices for Triad Football Federation (TFF).",
      },
    ],
  }),
  component: StatsPage,
});

function StatsPage() {
  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const fixtures = useQuery({ queryKey: ["all-fixtures"], queryFn: fetchAllFixtures });
  const tournaments = useQuery({ queryKey: ["tournaments"], queryFn: fetchTournaments });

  if (teams.isLoading || fixtures.isLoading || tournaments.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 text-center space-y-4">
        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-muted-foreground">Loading TFF Stats Lab Analytics...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <StatsLabDashboard
        teams={teams.data ?? []}
        fixtures={fixtures.data ?? []}
        tournaments={tournaments.data ?? []}
      />
    </div>
  );
}
