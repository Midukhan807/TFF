import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Vote, Trophy, Flame, Sparkles, Medal, Award, CheckCircle2 } from "lucide-react";

import { MatchPredictionPoll } from "@/components/tff/prediction-poll";
import {
  computePredictionLeaderboard,
  fetchAllPredictions,
  getStoredHandle,
  setStoredHandle,
} from "@/lib/predictions";
import { fetchAllFixtures, fetchTournaments, type FixtureWithTeams } from "@/lib/tff";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "Match Predictions & Community Arena | Triad Football Federation" },
      {
        name: "description",
        content:
          "Vote on upcoming eFootball match predictions, view live fan voting percentages, and compete on the TFF Predictor Leaderboard.",
      },
    ],
  }),
  component: PredictionsPage,
});

function PredictionsPage() {
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>("all");
  const [selectedMatchday, setSelectedMatchday] = useState<number | "all">("all");
  const [userHandle, setUserHandleState] = useState(getStoredHandle());
  const [editingHandle, setEditingHandle] = useState(false);

  const tournaments = useQuery({ queryKey: ["tournaments"], queryFn: fetchTournaments });
  const fixtures = useQuery({ queryKey: ["all-fixtures"], queryFn: fetchAllFixtures });
  const predictions = useQuery({ queryKey: ["all-predictions"], queryFn: fetchAllPredictions });

  const allFixtures = fixtures.data ?? [];
  const allVotes = predictions.data ?? [];

  const filteredFixtures = allFixtures.filter((f) =>
    selectedTourneyId === "all" ? true : f.tournament_id === selectedTourneyId
  );

  const upcomingFixtures = filteredFixtures.filter((f) => f.status !== "completed");
  const completedFixtures = allFixtures.filter((f) => f.status === "completed");

  const availableMatchdays = Array.from(
    new Set(
      upcomingFixtures
        .map((f) => f.matchday)
        .filter((m): m is number => m !== null && m !== undefined && m > 0)
    )
  ).sort((a, b) => a - b);

  const displayedUpcomingFixtures = upcomingFixtures.filter((f) =>
    selectedMatchday === "all" ? true : f.matchday === selectedMatchday
  );

  const leaderboard = computePredictionLeaderboard(completedFixtures, allVotes);

  function handleSaveHandle(e: React.FormEvent) {
    e.preventDefault();
    if (userHandle.trim()) {
      setStoredHandle(userHandle.trim());
      setEditingHandle(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="size-4 text-primary animate-pulse" />
            <p className="label-caps text-xs text-primary">Community Voting Arena</p>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl tracking-wide uppercase">
            Match Predictions Hub
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Cast your match outcome predictions, view real-time fan voting bars, and climb the predictor leaderboard!
          </p>
        </div>

        {/* Predictor Profile Badge & Tournament Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-secondary/40 p-2.5 rounded-xl border border-border/60">
            <Trophy className="size-4 text-amber-400" />
            <div className="text-xs">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Predictor Handle:</span>
              <span className="font-bold text-foreground">{userHandle || "Anonymous Guest"}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingHandle(!editingHandle)}
              className="h-6 text-[10px] px-2 font-bold uppercase text-primary ml-1"
            >
              Edit
            </Button>
          </div>

          <select
            value={selectedTourneyId}
            onChange={(e) => {
              setSelectedTourneyId(e.target.value);
              setSelectedMatchday("all");
            }}
            className="bg-background border border-border text-sm font-semibold rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
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

      {/* Edit Handle Banner */}
      {editingHandle && (
        <div className="panel p-4 bg-primary/10 border-primary/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <p className="text-xs font-semibold">Set your custom predictor handle to rank on the leaderboard!</p>
          </div>
          <form onSubmit={handleSaveHandle} className="flex gap-2 shrink-0">
            <input
              type="text"
              value={userHandle}
              onChange={(e) => setUserHandleState(e.target.value)}
              placeholder="e.g. GamerTag99"
              className="h-8 px-2.5 rounded border border-input text-xs font-semibold bg-background"
            />
            <Button size="sm" type="submit" className="h-8 text-xs font-bold">Save</Button>
          </form>
        </div>
      )}

      {/* Main Grid: Upcoming Matches Polls & Leaderboard */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left Column: Upcoming Match Predictions */}
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl uppercase tracking-wider flex items-center gap-2">
              <Vote className="size-5 text-primary" /> Upcoming Matches to Predict
            </h2>
          </div>

          {/* Matchday Filter Buttons */}
          {availableMatchdays.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-card/60 border border-border/80 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedMatchday("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedMatchday === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                All Matchdays ({upcomingFixtures.length})
              </button>
              {availableMatchdays.map((md) => {
                const count = upcomingFixtures.filter((f) => f.matchday === md).length;
                return (
                  <button
                    type="button"
                    key={md}
                    onClick={() => setSelectedMatchday(md)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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

          {displayedUpcomingFixtures.length === 0 ? (
            <div className="panel p-12 text-center text-muted-foreground space-y-2">
              <CheckCircle2 className="mx-auto size-12 opacity-40 text-green-400" />
              <p className="font-bold text-base text-foreground">No Upcoming Scheduled Matches</p>
              <p className="text-xs">All current fixtures have been completed or no matches found for this matchday.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {displayedUpcomingFixtures.map((f) => (
                <div key={f.id} className="panel p-5 space-y-4 border-border/80 bg-card/60">
                  {/* Match Banner Header */}
                  <div className="flex items-center justify-between text-xs font-bold border-b border-border/40 pb-2">
                    <span className="text-primary">{f.tournament?.name || "TFF League"}</span>
                    <span className="text-muted-foreground">
                      {f.round || (f.matchday ? `Matchday ${f.matchday}` : "Fixture")}
                    </span>
                  </div>

                  {/* Team vs Team Header */}
                  <div className="flex items-center justify-between text-base font-bold py-1">
                    <span className="truncate max-w-[140px] text-right">{f.home?.name || "Home"}</span>
                    <span className="font-display text-sm px-3 py-1 bg-secondary rounded-lg border border-border">VS</span>
                    <span className="truncate max-w-[140px] text-left">{f.away?.name || "Away"}</span>
                  </div>

                  {/* Prediction Poll */}
                  <MatchPredictionPoll fixture={f} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Predictor Leaderboard */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl uppercase tracking-wider flex items-center gap-2">
            <Medal className="size-5 text-amber-400" /> Predictor Leaderboard
          </h2>

          <div className="panel overflow-hidden border-border/80">
            <div className="bg-secondary/60 p-3.5 border-b border-border/60 flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>Predictor</span>
              <span>Pts (Acc %)</span>
            </div>

            {leaderboard.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
                <Award className="mx-auto size-8 opacity-40 text-amber-400" />
                <p className="font-bold">No Leaderboard Data Yet</p>
                <p className="text-[11px]">Rankings generate automatically as predicted matches finish!</p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {leaderboard.map((row, idx) => {
                  const rankIcon =
                    idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
                  return (
                    <div
                      key={row.userName}
                      className="p-3.5 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-display font-black text-sm text-amber-400 w-6">
                          {rankIcon}
                        </span>
                        <div>
                          <p className="font-bold text-sm text-foreground truncate max-w-[130px]">
                            {row.userName}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-semibold">
                            {row.correctCount}/{row.totalPredictions} Correct
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-display text-base font-extrabold text-primary">
                          {row.points} pts
                        </span>
                        <span className="block text-[10px] font-bold text-emerald-400">
                          {row.accuracyPct}% Acc
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
