import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Flame, Trophy, User, Vote } from "lucide-react";
import { toast } from "sonner";

import {
  computePredictionStats,
  fetchPredictionsForFixture,
  getStoredHandle,
  getVisitorId,
  setStoredHandle,
  submitPredictionVote,
  type PredictionChoice,
} from "@/lib/predictions";
import type { FixtureWithTeams } from "@/lib/tff";
import { Button } from "@/components/ui/button";

export function MatchPredictionPoll({
  fixture,
  compact = false,
}: {
  fixture: FixtureWithTeams;
  compact?: boolean;
}) {
  const queryClient = useQueryClient();
  const visitorId = getVisitorId();

  const [userNameInput, setUserNameInput] = useState(getStoredHandle());
  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<PredictionChoice | null>(null);

  const predictionsQuery = useQuery({
    queryKey: ["predictions", fixture.id],
    queryFn: () => fetchPredictionsForFixture(fixture.id),
  });

  const voteMutation = useMutation({
    mutationFn: async ({ choice, handle }: { choice: PredictionChoice; handle: string }) => {
      return submitPredictionVote(fixture.id, choice, handle);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["predictions", fixture.id] });
      queryClient.invalidateQueries({ queryKey: ["all-predictions"] });
      toast.success(`Prediction submitted for ${variables.choice.toUpperCase()}!`);
    },
  });

  const votes = predictionsQuery.data ?? [];
  const stats = computePredictionStats(votes);
  const userVote = votes.find((v) => v.visitor_id === visitorId);

  function handleVoteClick(choice: PredictionChoice) {
    if (fixture.status === "completed") {
      toast.error("Match is completed. Voting is closed!");
      return;
    }

    const currentHandle = getStoredHandle();
    if (!currentHandle) {
      setPendingChoice(choice);
      setShowNameModal(true);
      return;
    }

    voteMutation.mutate({ choice, handle: currentHandle });
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userNameInput.trim()) {
      toast.error("Please enter a predictor handle or name.");
      return;
    }

    setStoredHandle(userNameInput.trim());
    setShowNameModal(false);

    if (pendingChoice) {
      voteMutation.mutate({ choice: pendingChoice, handle: userNameInput.trim() });
      setPendingChoice(null);
    }
  }

  const homeName = fixture.home?.short_name || fixture.home?.name || "HOME";
  const awayName = fixture.away?.short_name || fixture.away?.name || "AWAY";

  if (compact) {
    return (
      <div className="space-y-1.5 w-full">
        {/* Compact 3-color Bar */}
        <div className="flex h-3 w-full overflow-hidden rounded-full border border-border/60 bg-secondary shadow-inner">
          <div
            style={{ width: `${stats.homePct}%` }}
            className="bg-primary flex items-center justify-center text-[9px] font-extrabold text-primary-foreground transition-all duration-300"
            title={`${homeName} Win: ${stats.homePct}%`}
          />
          <div
            style={{ width: `${stats.drawPct}%` }}
            className="bg-zinc-600 flex items-center justify-center text-[9px] font-extrabold text-white transition-all duration-300"
            title={`Draw: ${stats.drawPct}%`}
          />
          <div
            style={{ width: `${stats.awayPct}%` }}
            className="bg-emerald-500 flex items-center justify-center text-[9px] font-extrabold text-white transition-all duration-300"
            title={`${awayName} Win: ${stats.awayPct}%`}
          />
        </div>

        {/* Compact Labels & Quick Vote Buttons */}
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
          <button
            onClick={() => handleVoteClick("home")}
            className={`hover:text-primary transition-colors flex items-center gap-1 ${userVote?.prediction === "home" ? "text-primary font-black" : ""}`}
          >
            🔴 {homeName} ({stats.homePct}%)
          </button>
          <button
            onClick={() => handleVoteClick("draw")}
            className={`hover:text-foreground transition-colors flex items-center gap-1 ${userVote?.prediction === "draw" ? "text-foreground font-black" : ""}`}
          >
            ⚪ DRAW ({stats.drawPct}%)
          </button>
          <button
            onClick={() => handleVoteClick("away")}
            className={`hover:text-emerald-400 transition-colors flex items-center gap-1 ${userVote?.prediction === "away" ? "text-emerald-400 font-black" : ""}`}
          >
            🟢 {awayName} ({stats.awayPct}%)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel p-5 space-y-4 border-border/80 bg-card/60">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <Vote className="size-4 text-primary animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Fan Match Prediction Poll
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {stats.totalVotes} Vote{stats.totalVotes !== 1 ? "s" : ""} Cast
        </span>
      </div>

      {/* Live Voting Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex h-4 w-full overflow-hidden rounded-full border border-border/80 bg-secondary shadow-inner">
          <div
            style={{ width: `${stats.homePct}%` }}
            className="bg-primary flex items-center justify-center text-[10px] font-black text-primary-foreground transition-all duration-500"
          >
            {stats.homePct >= 10 && `${stats.homePct}%`}
          </div>
          <div
            style={{ width: `${stats.drawPct}%` }}
            className="bg-zinc-600 flex items-center justify-center text-[10px] font-black text-zinc-100 transition-all duration-500"
          >
            {stats.drawPct >= 10 && `${stats.drawPct}%`}
          </div>
          <div
            style={{ width: `${stats.awayPct}%` }}
            className="bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white transition-all duration-500"
          >
            {stats.awayPct >= 10 && `${stats.awayPct}%`}
          </div>
        </div>

        <div className="flex justify-between text-[11px] font-semibold text-muted-foreground px-1">
          <span className="text-primary font-bold">{homeName} {stats.homePct}%</span>
          <span className="text-zinc-400">Draw {stats.drawPct}%</span>
          <span className="text-emerald-400 font-bold">{awayName} {stats.awayPct}%</span>
        </div>
      </div>

      {/* Voting Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          size="sm"
          variant={userVote?.prediction === "home" ? "default" : "outline"}
          onClick={() => handleVoteClick("home")}
          disabled={fixture.status === "completed" || voteMutation.isPending}
          className={`h-9 font-bold text-xs uppercase tracking-wider border-primary/40 ${
            userVote?.prediction === "home"
              ? "bg-primary text-primary-foreground shadow-md"
              : "hover:bg-primary/10 hover:text-primary"
          }`}
        >
          {userVote?.prediction === "home" && <Check className="size-3.5 mr-1" />}
          🔴 {homeName} Win
        </Button>

        <Button
          size="sm"
          variant={userVote?.prediction === "draw" ? "secondary" : "outline"}
          onClick={() => handleVoteClick("draw")}
          disabled={fixture.status === "completed" || voteMutation.isPending}
          className={`h-9 font-bold text-xs uppercase tracking-wider border-zinc-700 ${
            userVote?.prediction === "draw"
              ? "bg-zinc-700 text-white shadow-md"
              : "hover:bg-zinc-800 hover:text-white"
          }`}
        >
          {userVote?.prediction === "draw" && <Check className="size-3.5 mr-1" />}
          ⚪ Draw
        </Button>

        <Button
          size="sm"
          variant={userVote?.prediction === "away" ? "default" : "outline"}
          onClick={() => handleVoteClick("away")}
          disabled={fixture.status === "completed" || voteMutation.isPending}
          className={`h-9 font-bold text-xs uppercase tracking-wider border-emerald-500/40 ${
            userVote?.prediction === "away"
              ? "bg-emerald-600 text-white shadow-md"
              : "hover:bg-emerald-500/10 hover:text-emerald-400 text-emerald-400"
          }`}
        >
          {userVote?.prediction === "away" && <Check className="size-3.5 mr-1" />}
          🟢 {awayName} Win
        </Button>
      </div>

      {/* User Handle Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <User className="size-5 text-primary" />
              <h3 className="font-display text-lg uppercase">Enter Predictor Handle</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your name or gamer handle to save your predictions and compete on the Prediction Leaderboard!
            </p>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <input
                type="text"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                placeholder="e.g. Alex_eFootball"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-semibold"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowNameModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="font-bold">
                  Submit Vote
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
