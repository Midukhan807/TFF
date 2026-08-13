import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TrophyRevealCardProps {
  className?: string;
  compact?: boolean;
  autoPlay?: boolean;
}

export function TrophyRevealCard({ className, compact = false, autoPlay = true }: TrophyRevealCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      className={cn(
        "panel relative overflow-hidden border-amber-500/30 bg-black/60 shadow-[var(--shadow-gold)] transition-all hover:border-amber-500/50",
        compact ? "p-4" : "p-6 sm:p-8",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.62 0.22 25) 0%, transparent 70%)" }}
      />

      <div className={cn("grid gap-6 items-center", compact ? "grid-cols-1" : "lg:grid-cols-[1fr_1.3fr]")}>
        {/* Left / Text Info */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-primary">
            <Trophy className="size-5 animate-pulse text-amber-400" />
            <span className="label-caps font-semibold tracking-wider text-amber-400">
              OFFICIAL TFF TROPHY
            </span>
          </div>

          <h2 className={cn("font-display uppercase tracking-wide", compact ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl")}>
            The Crown of Champions
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Unveiling the official Triad Football Federation (TFF) Championship Trophy. Forged for perfection, awarded exclusively to the champions of the Triad Champions League.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              onClick={togglePlay}
              variant="default"
              size={compact ? "sm" : "default"}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold border-none shadow-md"
            >
              {isPlaying ? (
                <>
                  <Pause className="size-4 mr-2" /> Pause Video
                </>
              ) : (
                <>
                  <Play className="size-4 mr-2" /> Play Reveal Video
                </>
              )}
            </Button>

            <Button
              onClick={toggleMute}
              variant="outline"
              size={compact ? "sm" : "default"}
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
            >
              {isMuted ? (
                <>
                  <VolumeX className="size-4 mr-2" /> Unmute Sound
                </>
              ) : (
                <>
                  <Volume2 className="size-4 mr-2" /> Mute Sound
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right / Video Container */}
        <div className="relative group aspect-video rounded-xl overflow-hidden border border-amber-500/40 shadow-2xl bg-black">
          <video
            ref={videoRef}
            src="/trophy_reveal.mp4"
            className="w-full h-full object-cover"
            autoPlay={autoPlay}
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Overlay controls badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 pointer-events-none">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30">
              <Sparkles className="size-3.5 text-amber-400" /> TFF 3D Reveal Animation
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="size-8 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white"
                onClick={togglePlay}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="size-8 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white"
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrophyRevealModalButton({ label = "Watch Trophy Reveal" }: { label?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="border-amber-500/50 hover:border-amber-400 text-amber-400 hover:bg-amber-500/10 font-semibold gap-2">
          <Trophy className="size-4 text-amber-400" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl border-amber-500/40 bg-black/95 p-6 text-white shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl font-display text-amber-400">
            <Trophy className="size-6 text-amber-400" /> TFF Official Esports Trophy Unveiling
          </DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video rounded-xl overflow-hidden border border-amber-500/30 bg-black">
          <video
            src="/trophy_reveal.mp4"
            className="w-full h-full object-cover"
            autoPlay
            controls
            loop
            playsInline
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
