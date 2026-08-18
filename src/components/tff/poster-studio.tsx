import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { Download, Sparkles, Trophy, Palette, Layers, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";

import { TeamLogo } from "@/components/tff/branding";
import { formatDate, parseResultPenalties, type FixtureWithTeams } from "@/lib/tff";
import { Button } from "@/components/ui/button";

export type PosterTheme = "cyberpunk" | "championship" | "crimson" | "emerald";
export type AspectRatio = "square" | "story";

export function MatchdayPosterDialog({
  fixture,
  isOpen,
  onClose,
}: {
  fixture: FixtureWithTeams | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [theme, setTheme] = useState<PosterTheme>("cyberpunk");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("square");
  const [tagline, setTagline] = useState("#TFFeFootball");
  const [isExporting, setIsExporting] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || !fixture) return null;

  const result = fixture.result;
  const isCompleted = fixture.status === "completed" && result;
  const { homePen, awayPen } = parseResultPenalties(result);

  async function handleDownload() {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      toast.info("Rendering HD Graphic Poster...");

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      const homeName = fixture?.home?.name || "TeamA";
      const awayName = fixture?.away?.name || "TeamB";
      const fileSlug = `${homeName}-vs-${awayName}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      link.download = `tff-matchday-${fileSlug}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("HD Poster downloaded successfully!");
    } catch (err: any) {
      toast.error("Failed to export poster: " + (err.message || "Unknown error"));
    } finally {
      setIsExporting(false);
    }
  }

  const themeStyles = {
    cyberpunk: {
      bg: "from-zinc-950 via-purple-950/70 to-cyan-950/80",
      border: "border-cyan-500/40",
      accent: "text-cyan-400",
      badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      glow: "from-cyan-500/20 to-purple-500/20",
    },
    championship: {
      bg: "from-amber-950 via-zinc-950 to-amber-900/40",
      border: "border-amber-500/40",
      accent: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      glow: "from-amber-500/25 to-yellow-500/10",
    },
    crimson: {
      bg: "from-red-950 via-zinc-950 to-rose-950/80",
      border: "border-rose-500/40",
      accent: "text-rose-400",
      badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      glow: "from-rose-500/25 to-red-500/10",
    },
    emerald: {
      bg: "from-emerald-950 via-zinc-950 to-teal-950/80",
      border: "border-emerald-500/40",
      accent: "text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      glow: "from-emerald-500/25 to-teal-500/10",
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary animate-pulse" />
            <h2 className="font-display text-xl uppercase tracking-wider">
              Matchday Graphic Card Studio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Studio Controls */}
        <div className="grid gap-4 sm:grid-cols-3 bg-secondary/30 p-4 rounded-xl border border-border/60">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              <Palette className="inline size-3 mr-1" /> Esports Color Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as PosterTheme)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-bold"
            >
              <option value="cyberpunk">🌌 Cyberpunk Neon</option>
              <option value="championship">🏆 Gold Championship</option>
              <option value="crimson">🔥 Crimson Clash</option>
              <option value="emerald">⚡ Electric Emerald</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              <Layers className="inline size-3 mr-1" /> Canvas Format / Size
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-bold"
            >
              <option value="square">📷 Square 1:1 (Feed Post - 1080x1080)</option>
              <option value="story">📱 Story 9:16 (Reels/Status - 1080x1920)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              🏷️ Custom Hashtag / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="#TFFeFootball"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-semibold"
            />
          </div>
        </div>

        {/* Live Canvas Preview Container */}
        <div className="flex justify-center overflow-x-auto py-4 bg-zinc-950/90 rounded-2xl border border-border/60 shadow-inner">
          <div
            ref={cardRef}
            className={`relative flex flex-col justify-between p-8 overflow-hidden rounded-2xl border bg-gradient-to-b ${currentTheme.bg} ${currentTheme.border} transition-all shadow-2xl`}
            style={{
              width: aspectRatio === "square" ? "500px" : "400px",
              height: aspectRatio === "square" ? "500px" : "640px",
            }}
          >
            {/* Background Ambient Glow Circles */}
            <div
              className={`pointer-events-none absolute -top-20 -left-20 size-64 rounded-full bg-gradient-to-br ${currentTheme.glow} blur-3xl opacity-60`}
            />
            <div
              className={`pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-gradient-to-tl ${currentTheme.glow} blur-3xl opacity-60`}
            />

            {/* Top Bar: Tournament & Round Banner */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className={`size-5 ${currentTheme.accent}`} />
                <span className="font-display text-sm uppercase tracking-widest text-white">
                  {fixture.tournament?.name || "TFF eFOOTBALL"}
                </span>
              </div>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${currentTheme.badge}`}>
                {fixture.round || (fixture.matchday ? `Matchday ${fixture.matchday}` : "OFFICIAL MATCH")}
              </span>
            </div>

            {/* Main Center Matchup Showcase */}
            <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 w-full text-center">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-2">
                  <TeamLogo
                    name={fixture.home?.name || "Home"}
                    shortName={fixture.home?.short_name}
                    color={fixture.home?.team_color}
                    logoUrl={fixture.home?.logo_url}
                    size="lg"
                    className="shadow-2xl ring-2 ring-white/20"
                  />
                  <div>
                    <h3 className="font-display text-lg uppercase tracking-wide text-white font-extrabold truncate max-w-[130px]">
                      {fixture.home?.name || "Home Team"}
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Mgr: {fixture.home?.manager_name || "TBD"}
                    </p>
                  </div>
                </div>

                {/* Score vs VS Center Banner */}
                <div className="flex flex-col items-center px-2">
                  {isCompleted ? (
                    <div className="flex flex-col items-center">
                      <div className="font-display text-4xl font-black tracking-wider text-white bg-black/50 border border-white/10 rounded-xl px-4 py-1.5 shadow-2xl">
                        {result.home_score} - {result.away_score}
                      </div>
                      {homePen !== null && awayPen !== null && (
                        <span className="mt-2 text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          ({homePen} - {awayPen} pen)
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className={`font-display text-3xl font-black uppercase tracking-widest ${currentTheme.accent}`}>
                        VS
                      </div>
                      <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                        UPCOMING
                      </span>
                    </div>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center gap-2">
                  <TeamLogo
                    name={fixture.away?.name || "Away"}
                    shortName={fixture.away?.short_name}
                    color={fixture.away?.team_color}
                    logoUrl={fixture.away?.logo_url}
                    size="lg"
                    className="shadow-2xl ring-2 ring-white/20"
                  />
                  <div>
                    <h3 className="font-display text-lg uppercase tracking-wide text-white font-extrabold truncate max-w-[130px]">
                      {fixture.away?.name || "Away Team"}
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Mgr: {fixture.away?.manager_name || "TBD"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Match Date / Kickoff Info */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-bold tracking-wider text-zinc-300 bg-black/40 px-4 py-1.5 rounded-full border border-white/10">
                <span>🗓️ {formatDate(fixture.scheduled_date)}</span>
                {fixture.scheduled_time && <span>• ⏰ {fixture.scheduled_time.slice(0, 5)}</span>}
              </div>
            </div>

            {/* Bottom Footer: Official Branding & Tagline */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-display text-xs tracking-wider text-white">
                  TRIAD FOOTBALL FEDERATION
                </span>
              </div>
              <span className={`text-xs font-bold tracking-widest uppercase ${currentTheme.accent}`}>
                {tagline}
              </span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isExporting}
            className="gap-2 font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            {isExporting ? (
              <>
                <RefreshCw className="size-4 animate-spin" /> Rendering PNG...
              </>
            ) : (
              <>
                <Download className="size-4" /> Download HD Graphic (.png)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
