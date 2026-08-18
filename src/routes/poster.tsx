import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Palette, Sparkles, Trophy, Image as ImageIcon } from "lucide-react";

import { MatchdayPosterDialog } from "@/components/tff/poster-studio";
import { fetchAllFixtures, fetchTournaments, type FixtureWithTeams } from "@/lib/tff";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/poster")({
  head: () => ({
    meta: [
      { title: "TFF Media Studio & Poster Generator | Triad Football Federation" },
      {
        name: "description",
        content:
          "Generate high-resolution esports posters, matchday graphic cards, and scorecards for Instagram, WhatsApp, and Discord.",
      },
    ],
  }),
  component: PosterStudioPage,
});

function PosterStudioPage() {
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>("all");
  const [activeFixture, setActiveFixture] = useState<FixtureWithTeams | null>(null);

  const tournaments = useQuery({ queryKey: ["tournaments"], queryFn: fetchTournaments });
  const fixtures = useQuery({ queryKey: ["all-fixtures"], queryFn: fetchAllFixtures });

  const allFixtures = fixtures.data ?? [];
  const filteredFixtures = allFixtures.filter((f) =>
    selectedTourneyId === "all" ? true : f.tournament_id === selectedTourneyId
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="size-4 text-primary animate-pulse" />
            <p className="label-caps text-xs text-primary">Esports Graphics Studio</p>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl tracking-wide uppercase">
            Matchday Poster Generator
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Create and export crisp 1080x1080 & 1080x1920 social media graphic cards for any fixture or result.
          </p>
        </div>

        {/* Tournament Filter */}
        <div className="flex items-center gap-2 bg-secondary/30 p-2 rounded-xl border border-border/60 shrink-0">
          <Trophy className="size-4 text-primary ml-1" />
          <span className="text-xs font-semibold label-caps text-muted-foreground hidden sm:inline">Tournament:</span>
          <select
            value={selectedTourneyId}
            onChange={(e) => setSelectedTourneyId(e.target.value)}
            className="bg-background border border-border text-sm font-semibold rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          >
            <option value="all">🏆 All Tournaments</option>
            {tournaments.data?.map((t) => (
              <option key={t.id} value={t.id}>
                ⚽ {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fixtures Selection Grid */}
      <div className="space-y-4">
        <h3 className="font-display text-xl uppercase tracking-wider flex items-center gap-2">
          <Palette className="size-5 text-primary" /> Select a Match to Create Graphic
        </h3>

        {filteredFixtures.length === 0 ? (
          <div className="panel p-12 text-center text-muted-foreground space-y-2">
            <ImageIcon className="mx-auto size-12 opacity-40" />
            <p className="font-bold text-base">No Fixtures Available</p>
            <p className="text-xs">Select another tournament or add fixtures in the admin panel.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFixtures.map((f) => {
              const isCompleted = f.status === "completed" && f.result;
              return (
                <div
                  key={f.id}
                  className="panel p-4 flex flex-col justify-between gap-4 border-border/70 hover:border-primary/50 transition-all bg-card/60"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold border-b border-border/40 pb-2">
                    <span className="text-primary font-bold">{f.tournament?.name || "TFF"}</span>
                    <span>{f.round || (f.matchday ? `Matchday ${f.matchday}` : "Fixture")}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 py-2">
                    <span className="font-bold text-sm truncate max-w-[110px] text-right">
                      {f.home?.name || "Home"}
                    </span>

                    <div className="font-display shrink-0 rounded-lg border border-border bg-secondary px-3 py-1 text-sm font-extrabold">
                      {isCompleted ? `${f.result?.home_score} - ${f.result?.away_score}` : "VS"}
                    </div>

                    <span className="font-bold text-sm truncate max-w-[110px] text-left">
                      {f.away?.name || "Away"}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setActiveFixture(f)}
                    className="w-full gap-1.5 font-bold uppercase tracking-wider text-xs border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary"
                  >
                    <Palette className="size-3.5" /> Launch Studio & Export Poster
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Studio Modal */}
      <MatchdayPosterDialog
        fixture={activeFixture}
        isOpen={!!activeFixture}
        onClose={() => setActiveFixture(null)}
      />
    </div>
  );
}
