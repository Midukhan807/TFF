import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export function TffLogo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img src={logo} alt="TFF Logo" className="size-10 object-contain" />
      {showText && (
        <span className="leading-none">
          <span className="font-display block text-lg tracking-wide">TFF eFOOTBALL</span>
          <span className="label-caps block text-[0.6rem] text-muted-foreground">
            Tournament Hub
          </span>
        </span>
      )}
    </span>
  );
}

export function TeamLogo({
  name,
  shortName,
  color,
  logoUrl,
  videoUrl,
  isHovered,
  size = "md",
  className,
}: {
  name: string;
  shortName?: string | null | undefined;
  color?: string | null | undefined;
  logoUrl?: string | null | undefined;
  videoUrl?: string | null | undefined;
  isHovered?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "size-8 text-[0.65rem]",
    md: "size-11 text-xs",
    lg: "size-16 text-base",
    xl: "size-28 text-2xl",
  } as const;

  const [selfHover, setSelfHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeHover = isHovered ?? selfHover;

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      if (activeHover) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [activeHover, videoUrl]);

  const initials = (shortName ?? name).slice(0, 3).toUpperCase();

  return (
    <div
      className={cn("relative shrink-0 overflow-hidden rounded-xl", sizes[size], className)}
      onMouseEnter={() => setSelfHover(true)}
      onMouseLeave={() => setSelfHover(false)}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        <span
          aria-label={`${name} logo`}
          className="font-display grid size-full place-items-center border border-border/80 tracking-wider"
          style={{
            background: `linear-gradient(150deg, ${color ?? "#D4A017"}33, oklch(0.2 0.008 265))`,
            color: color ?? undefined,
          }}
        >
          {initials}
        </span>
      )}

      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-300 pointer-events-none",
            activeHover ? "opacity-100 z-10" : "opacity-0 -z-10"
          )}
        />
      )}
    </div>
  );
}
