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
  size = "md",
  className,
}: {
  name: string;
  shortName?: string | null | undefined;
  color?: string | null | undefined;
  logoUrl?: string | null | undefined;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "size-8 text-[0.65rem]",
    md: "size-11 text-xs",
    lg: "size-16 text-base",
    xl: "size-28 text-2xl",
  } as const;
  const initials = (shortName ?? name).slice(0, 3).toUpperCase();

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        loading="lazy"
        className={cn("rounded-xl object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <span
      aria-label={`${name} logo`}
      className={cn(
        "font-display grid shrink-0 place-items-center rounded-xl border border-border/80 tracking-wider",
        sizes[size],
        className,
      )}
      style={{
        background: `linear-gradient(150deg, ${color ?? "#D4A017"}33, oklch(0.2 0.008 265))`,
        color: color ?? undefined,
      }}
    >
      {initials}
    </span>
  );
}
