import { Link } from "@tanstack/react-router";
import { Trophy, Shield, Users, Eye, User, Shirt, Activity } from "lucide-react";

import { TeamLogo } from "@/components/tff/branding";
import { cn } from "@/lib/utils";
import {
  FORMAT_LABELS,
  formatDate,
  formatTime,
  type FixtureWithTeams,
  type StandingRow,
  type Team,
  type Tournament,
  type TournamentStatus,
} from "@/lib/tff";

/* -------------------------------- primitives ------------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string | undefined;
  title: string;
  subtitle?: string | undefined;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="label-caps mb-2 text-primary">{eyebrow}</p>}
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: TournamentStatus | string }) {
  const styles: Record<string, string> = {
    live: "border-[var(--live)]/50 bg-[var(--live)]/15 text-[oklch(0.78_0.15_25)]",
    upcoming: "border-primary/40 bg-primary/10 text-primary",
    completed: "border-border bg-secondary text-muted-foreground",
    archived: "border-border bg-secondary text-muted-foreground",
    draft: "border-border bg-secondary text-muted-foreground",
    scheduled: "border-primary/30 bg-primary/10 text-primary",
    postponed: "border-border bg-secondary text-muted-foreground",
    cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={cn(
        "label-caps inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        styles[status] ?? styles["draft"],
      )}
    >
      {status === "live" && (
        <span className="size-1.5 animate-pulse rounded-full bg-[var(--live)]" />
      )}
      {status}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string | undefined;
  icon?: React.ReactNode;
}) {
  return (
    <div className="panel p-5 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <p className="label-caps text-muted-foreground">{label}</p>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <p className="font-display mt-3 text-4xl leading-none">{value}</p>
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string | undefined;
  action?: React.ReactNode;
}) {
  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary">
        <Trophy className="size-5" />
      </span>
      <h3 className="text-2xl">{title}</h3>
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}

/* --------------------------------- cards ---------------------------------- */

export function TeamCard({ team }: { team: Team }) {
  const primaryColor = team.team_color || "#D4A017";
  const foundedYear = team.created_at ? new Date(team.created_at).getFullYear() : 2026;

  return (
    <Link
      to="/team/$teamId"
      params={{ teamId: team.id }}
      className="group relative flex flex-col items-center rounded-2xl bg-zinc-950/90 p-6 border transition-all duration-500 hover:-translate-y-2"
      style={{
        borderColor: `${primaryColor}44`,
        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 20px ${primaryColor}08`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = primaryColor;
        e.currentTarget.style.boxShadow = `0 10px 30px ${primaryColor}22, inset 0 0 25px ${primaryColor}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${primaryColor}44`;
        e.currentTarget.style.boxShadow = `0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 20px ${primaryColor}08`;
      }}
    >
      {/* Glow border overlay effect */}
      <span
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          border: `1px solid ${primaryColor}`,
          boxShadow: `0 0 15px ${primaryColor}33`,
        }}
      />

      {/* 1. Large Logo */}
      <div className="relative mb-6">
        <div
          className="absolute -inset-1.5 rounded-full blur-sm opacity-40 group-hover:opacity-80 transition-opacity duration-300"
          style={{ backgroundColor: primaryColor }}
        />
        <TeamLogo
          name={team.name}
          shortName={team.short_name}
          color={team.team_color}
          logoUrl={team.logo_url}
          size="xl"
          className="relative size-32 rounded-full border-4 border-zinc-950 object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* 2. Team Name & Badge */}
      <div className="text-center space-y-3 w-full">
        <h3 className="font-display text-3xl uppercase tracking-wider text-white group-hover:text-primary transition-colors duration-200">
          {team.name}
        </h3>

        {/* Short Name with horizontal decorative lines */}
        <div className="flex items-center justify-center gap-3">
          <span className="h-[1px] w-8 bg-zinc-800" />
          <span
            className="font-display text-xs tracking-widest px-2.5 py-0.5 rounded border font-semibold uppercase"
            style={{
              color: primaryColor,
              borderColor: `${primaryColor}55`,
              backgroundColor: `${primaryColor}11`,
            }}
          >
            {team.short_name}
          </span>
          <span className="h-[1px] w-8 bg-zinc-800" />
        </div>

        {/* Manager Badge */}
        {team.manager_name && (
          <div className="mx-auto flex items-center justify-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1 text-xs text-muted-foreground w-fit">
            <User className="size-3.5" style={{ color: primaryColor }} />
            <span>MANAGER:</span>
            <span className="font-medium text-foreground uppercase">{team.manager_name}</span>
          </div>
        )}
      </div>

      {/* 3. Info List */}
      <div className="w-full mt-6 border-t border-zinc-900 pt-6 space-y-4 text-sm">
        {/* Founded */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Shield className="size-4" style={{ color: primaryColor }} />
            <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">Founded</span>
          </div>
          <span className="font-display text-white font-medium">{foundedYear}</span>
        </div>


        {/* Home Kit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Shirt className="size-4" style={{ color: primaryColor }} />
            <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">Home Kit</span>
          </div>
          <span className="font-display text-white font-medium uppercase flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
            Primary
          </span>
        </div>

        {/* Matches Played */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Activity className="size-4" style={{ color: primaryColor }} />
            <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">Matches Played</span>
          </div>
          <span className="font-display text-white font-medium">--</span>
        </div>

        {/* Titles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Trophy className="size-4" style={{ color: primaryColor }} />
            <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">Titles</span>
          </div>
          <span className="font-display text-white font-medium">00</span>
        </div>
      </div>

      {/* 4. Bottom View Button */}
      <div
        className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 bg-zinc-950 text-zinc-300"
        style={{
          borderColor: `${primaryColor}22`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = primaryColor;
          e.currentTarget.style.backgroundColor = `${primaryColor}11`;
          e.currentTarget.style.color = primaryColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${primaryColor}22`;
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "";
        }}
      >
        <Eye className="size-4" />
        View Team Profile
      </div>
    </Link>
  );
}

export function TournamentCard({
  tournament,
  championName,
  teamCount: propTeamCount,
  matchCount: propMatchCount,
}: {
  tournament: any;
  championName?: string | null | undefined;
  teamCount?: number | undefined;
  matchCount?: number | undefined;
}) {
  const teamCount = propTeamCount ?? tournament.tournament_teams?.[0]?.count ?? 0;
  const matchCount = propMatchCount ?? tournament.fixtures?.[0]?.count ?? 0;

  return (
    <Link
      to="/tournament/$slug"
      params={{ slug: tournament.slug }}
      className="panel group relative flex flex-col overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-gold)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {tournament.logo_url ? (
            <img
              src={tournament.logo_url}
              alt={tournament.name}
              className="size-12 rounded-xl object-contain border border-border bg-black/40 p-1"
            />
          ) : (
            <span
              className="font-display grid size-12 place-items-center rounded-xl border border-primary/40 text-sm text-primary"
              style={{ background: "var(--gradient-surface)" }}
            >
              TFF
            </span>
          )}
          <div>
            <p className="label-caps text-muted-foreground">{tournament.season_year || "Season"}</p>
            <h3 className="text-2xl leading-tight group-hover:text-primary transition-colors duration-200">{tournament.name}</h3>
          </div>
        </div>
        <StatusBadge status={tournament.status} />
      </div>

      {tournament.start_date ? (
        <p className="mt-4 text-xs text-silver/80 font-medium">
          {formatDate(tournament.start_date)} — {formatDate(tournament.end_date)}
        </p>
      ) : (
        <p className="mt-4 text-xs text-muted-foreground italic">
          Scheduling in progress
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border/70 pt-4 text-center">
        <div>
          <p className="font-display text-2xl text-foreground font-semibold">{teamCount}</p>
          <p className="label-caps text-muted-foreground text-[0.65rem]">Teams</p>
        </div>
        <div>
          <p className="font-display text-2xl text-foreground font-semibold">{matchCount}</p>
          <p className="label-caps text-muted-foreground text-[0.65rem]">Matches</p>
        </div>
        <div>
          <p className="font-display truncate text-xl text-primary font-semibold">
            {FORMAT_LABELS[tournament.format]?.split(" ")[0] ?? "League"}
          </p>
          <p className="label-caps text-muted-foreground text-[0.65rem]">Format</p>
        </div>
      </div>

      {championName && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2">
          <Trophy className="size-4 text-primary" />
          <span className="label-caps text-primary">Champion</span>
          <span className="font-display ml-auto text-lg">{championName}</span>
        </div>
      )}
    </Link>
  );
}

export function FixtureCard({ fixture }: { fixture: FixtureWithTeams }) {
  return (
    <div className="panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div className="min-w-40 shrink-0">
        <p className="label-caps text-primary">{fixture.tournament?.name ?? "TFF"}</p>
        <p className="text-xs text-muted-foreground">{fixture.round ?? "Fixture"}</p>
      </div>
      <div className="flex flex-1 items-center justify-between gap-3">
        <TeamSide team={fixture.home} align="left" />
        <div className="shrink-0 text-center">
          <p className="font-display text-lg text-muted-foreground">VS</p>
          <p className="text-xs text-muted-foreground">{formatTime(fixture.scheduled_time)}</p>
        </div>
        <TeamSide team={fixture.away} align="right" />
      </div>
      <div className="shrink-0 text-left sm:text-right">
        <p className="label-caps text-muted-foreground">{formatDate(fixture.scheduled_date)}</p>
        <StatusBadge status={fixture.status} />
      </div>
    </div>
  );
}

export function ResultCard({ fixture }: { fixture: FixtureWithTeams }) {
  const result = fixture.result;
  const homeWin = result ? result.home_score > result.away_score : false;
  const awayWin = result ? result.away_score > result.home_score : false;
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="label-caps text-primary">{fixture.tournament?.name ?? "TFF"}</p>
        <p className="text-xs text-muted-foreground">{formatDate(fixture.scheduled_date)}</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{fixture.round ?? ""}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <TeamSide team={fixture.home} align="left" dim={awayWin} />
        <div className="font-display shrink-0 rounded-lg border border-border bg-secondary px-3 py-1 text-2xl">
          {result ? `${result.home_score} — ${result.away_score}` : "—"}
        </div>
        <TeamSide team={fixture.away} align="right" dim={homeWin} />
      </div>
    </div>
  );
}

function TeamSide({
  team,
  align,
  dim,
}: {
  team: Team | null;
  align: "left" | "right";
  dim?: boolean;
}) {
  const content = (
    <>
      <TeamLogo
        name={team?.name ?? "TBD"}
        shortName={team?.short_name}
        color={team?.team_color}
        logoUrl={team?.logo_url}
      />
      <span className={cn("truncate text-sm font-semibold", dim && "text-muted-foreground")}>
        {team?.name ?? "TBD"}
      </span>
    </>
  );
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2.5",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      {content}
    </div>
  );
}

export function StandingsTable({
  rows,
  teams,
  qualifyCount,
}: {
  rows: StandingRow[];
  teams: Team[];
  qualifyCount?: number | undefined;
}) {
  const teamMap = new Map(teams.map((t) => [t.id, t]));
  return (
    <div className="panel overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="label-caps border-b border-border/70 text-muted-foreground">
            <th className="px-4 py-3 text-left">Pos</th>
            <th className="px-2 py-3 text-left">Team</th>
            {["P", "W", "D", "L", "GF", "GA", "GD"].map((h) => (
              <th key={h} className="px-2 py-3 text-center">
                {h}
              </th>
            ))}
            <th className="px-4 py-3 text-center text-primary">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const team = teamMap.get(row.team_id);
            const qualifies = qualifyCount ? index < qualifyCount : false;
            return (
              <tr
                key={row.team_id}
                className="border-b border-border/40 transition-colors last:border-0 hover:bg-secondary/60"
              >
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "font-display grid size-7 place-items-center rounded-md border border-border text-sm",
                      qualifies && "border-primary/60 bg-primary/15 text-primary",
                    )}
                  >
                    {index + 1}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <Link
                    to="/team/$teamId"
                    params={{ teamId: row.team_id }}
                    className="flex items-center gap-2.5 hover:text-primary"
                  >
                    <TeamLogo
                      name={team?.name ?? "Team"}
                      shortName={team?.short_name}
                      color={team?.team_color}
                      logoUrl={team?.logo_url}
                      size="sm"
                    />
                    <span className="font-semibold">{team?.name ?? "Unknown"}</span>
                  </Link>
                </td>
                <td className="px-2 py-3 text-center">{row.played}</td>
                <td className="px-2 py-3 text-center">{row.wins}</td>
                <td className="px-2 py-3 text-center">{row.draws}</td>
                <td className="px-2 py-3 text-center">{row.losses}</td>
                <td className="px-2 py-3 text-center">{row.goals_for}</td>
                <td className="px-2 py-3 text-center">{row.goals_against}</td>
                <td className="px-2 py-3 text-center">
                  {row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}
                </td>
                <td className="font-display px-4 py-3 text-center text-lg text-primary">
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
