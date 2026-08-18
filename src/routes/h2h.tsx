import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Swords, Loader2 } from "lucide-react";
import { z } from "zod";

import { H2HPredictor } from "@/components/tff/h2h-predictor";
import { EmptyState } from "@/components/tff/ui";
import { fetchAllFixtures, fetchAllStandings, fetchChampions, fetchTeams } from "@/lib/tff";

const h2hSearchSchema = z.object({
  team1: z.string().optional(),
  team2: z.string().optional(),
});

export const Route = createFileRoute("/h2h")({
  validateSearch: (search) => h2hSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Head-to-Head (H2H) Rivalry & Predictor | TFF eFootball" },
      {
        name: "description",
        content:
          "Compare head-to-head records, win probabilities, past match histories, and form between any two eFootball teams in the Triad Football Federation (TFF).",
      },
      { property: "og:title", content: "Head-to-Head (H2H) Rivalry | TFF eFootball" },
      {
        property: "og:description",
        content: "Analyze direct team rivalries, historical scores, and win predictions for TFF teams.",
      },
    ],
  }),
  component: H2HPage,
});

function H2HPage() {
  const { team1, team2 } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const fixtures = useQuery({ queryKey: ["all-fixtures"], queryFn: fetchAllFixtures });
  const standings = useQuery({ queryKey: ["all-standings"], queryFn: fetchAllStandings });
  const champions = useQuery({ queryKey: ["champions"], queryFn: fetchChampions });

  const isLoading = teams.isLoading || fixtures.isLoading || standings.isLoading || champions.isLoading;

  const teamList = teams.data ?? [];
  const selectedA = team1 && teamList.some((t) => t.id === team1) ? team1 : teamList[0]?.id || "";
  const selectedB =
    team2 && teamList.some((t) => t.id === team2) && team2 !== selectedA
      ? team2
      : teamList.find((t) => t.id !== selectedA)?.id || "";

  const handleSelectA = (id: string) => {
    navigate({
      search: (prev) => ({ ...prev, team1: id }),
      replace: true,
    });
  };

  const handleSelectB = (id: string) => {
    navigate({
      search: (prev) => ({ ...prev, team2: id }),
      replace: true,
    });
  };

  return (
    <div>
      <header className="border-b border-border/70" style={{ background: "var(--gradient-surface)" }}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Swords className="size-6 animate-pulse" />
            <span className="label-caps font-bold">TFF Analytics Tool</span>
          </div>
          <h1 className="text-4xl sm:text-5xl uppercase font-black">Head-to-Head Rivalry</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
            Compare any two TFF teams side-by-side. Analyze historical match scores, direct win/loss records, current form, and win probability predictions.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground font-semibold">Calculating Head-to-Head analytics...</p>
          </div>
        ) : teamList.length < 2 ? (
          <EmptyState
            title="Insufficient Teams"
            description="At least 2 teams must exist in TFF to run Head-to-Head comparison."
          />
        ) : (
          <H2HPredictor
            teams={teamList}
            teamAId={selectedA}
            teamBId={selectedB}
            onSelectTeamA={handleSelectA}
            onSelectTeamB={handleSelectB}
            allFixtures={fixtures.data ?? []}
            allStandings={standings.data ?? []}
            champions={champions.data ?? []}
          />
        )}
      </div>
    </div>
  );
}
