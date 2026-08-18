import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Trophy, Shield, Users, Eye, User, Shirt, Activity, Calendar } from "lucide-react";

import { TeamLogo } from "@/components/tff/branding";
import { cn } from "@/lib/utils";
import {
  FORMAT_LABELS,
  formatDate,
  formatTime,
  getTeamFoundedYear,
  getTeamVideoLogo,
  getMatchWinner,
  parseResultPenalties,
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

export function TeamCard({
  team,
  played,
  titles,
}: {
  team: Team;
  played?: number | string;
  titles?: number | string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const primaryColor = team.team_color || "#D4A017";
  const foundedYear = getTeamFoundedYear(team);
  const videoUrl = getTeamVideoLogo(team);

  const borderStyle = {
    borderColor: `${primaryColor}44`,
    boxShadow: `0 4px 20px rgba(0,0,0,0.5), inset 0 0 20px ${primaryColor}08`,
  };

  return (
    <Link
      to="/team/$teamId"
      params={{ teamId: team.id }}
      className="group relative flex rounded-2xl bg-zinc-950/90 border transition-all duration-500 flex-row items-center gap-3 p-3 sm:flex-col sm:items-center sm:p-6 sm:hover:-translate-y-2"
      style={borderStyle}
      onMouseEnter={(e) => {
        setIsHovered(true);
        e.currentTarget.style.borderColor = primaryColor;
        e.currentTarget.style.boxShadow = `0 10px 30px ${primaryColor}22, inset 0 0 25px ${primaryColor}15`;
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.borderColor = `${primaryColor}44`;
        e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.5), inset 0 0 20px ${primaryColor}08`;
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

      {/* Logo — small on mobile, large on sm+ */}
      <div className="relative shrink-0 sm:mb-6">
        <div
          className="absolute -inset-1 rounded-full blur-sm opacity-40 group-hover:opacity-80 transition-opacity duration-300"
          style={{ backgroundColor: primaryColor }}
        />
        <TeamLogo
          name={team.name}
          shortName={team.short_name}
          color={team.team_color}
          logoUrl={team.logo_url}
          videoUrl={videoUrl}
          isHovered={isHovered}
          size="lg"
          className="relative size-14 sm:size-32 rounded-full border-2 sm:border-4 border-zinc-950 object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 sm:w-full sm:text-center sm:space-y-3">
        <h3 className="font-display text-base sm:text-3xl uppercase tracking-wider text-white group-hover:text-primary transition-colors duration-200 truncate sm:whitespace-normal leading-tight">
          {team.name}
        </h3>

        {/* Mobile: short name pill + founded year in one compact row */}
        <div className="flex items-center gap-2 mt-1 sm:hidden">
          <span
            className="font-display text-[10px] tracking-widest px-2 py-0.5 rounded border font-semibold uppercase shrink-0"
            style={{ color: primaryColor, borderColor: `${primaryColor}55`, backgroundColor: `${primaryColor}11` }}
          >
            {team.short_name}
          </span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Est. {foundedYear}</span>
        </div>

        {/* Manager */}
        {team.manager_name && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1 sm:justify-center">
            <User className="size-3 shrink-0" style={{ color: primaryColor }} />
            <span className="truncate">{team.manager_name}</span>
          </div>
        )}

        {/* Desktop: decorative short name with lines */}
        <div className="hidden sm:flex items-center justify-center gap-3">
          <span className="h-[1px] w-8 bg-zinc-800" />
          <span
            className="font-display text-xs tracking-widest px-2.5 py-0.5 rounded border font-semibold uppercase"
            style={{ color: primaryColor, borderColor: `${primaryColor}55`, backgroundColor: `${primaryColor}11` }}
          >
            {team.short_name}
          </span>
          <span className="h-[1px] w-8 bg-zinc-800" />
        </div>
      </div>

      {/* Mobile: chevron */}
      <div className="sm:hidden shrink-0 text-zinc-600">
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Desktop-only: stats list */}
      <div className="hidden sm:block w-full mt-6 border-t border-zinc-900 pt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="size-4" style={{ color: primaryColor }} />
            <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">Founded</span>
          </div>
          <span className="font-display text-white font-medium">{foundedYear}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shirt className="size-4" style={{ color: primaryColor }} />
            <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">Home Kit</span>
          </div>
          <span className="font-display text-white font-medium uppercase flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />Primary
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="size-4" style={{ color: primaryColor }} />
            <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">Matches Played</span>
          </div>
          <span className="font-display text-white font-medium">
            {played !== undefined && played !== null ? played : "--"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="size-4" style={{ color: primaryColor }} />
            <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">Titles</span>
          </div>
          <span className="font-display text-white font-medium">
            {titles !== undefined && titles !== null ? String(titles).padStart(2, "0") : "00"}
          </span>
        </div>
      </div>

      {/* Desktop-only: view button */}
      <div
        className="hidden sm:flex w-full mt-6 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 bg-zinc-950 text-zinc-300"
        style={{ borderColor: `${primaryColor}22` }}
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

  // Premium fallback background gradient if no banner is provided
  const fallbackBg = "linear-gradient(to bottom, rgba(20, 20, 25, 0.4), rgba(10, 10, 12, 0.95))";
  const bannerStyle = tournament.banner_url
    ? { backgroundImage: `url(${tournament.banner_url})` }
    : tournament.logo_url
      ? { backgroundImage: `url(${tournament.logo_url})` }
      : { background: "linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(9, 9, 11, 0.95) 100%)" };

  return (
    <Link
      to="/tournament/$slug"
      params={{ slug: tournament.slug }}
      className="panel group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] bg-zinc-950/80 border border-zinc-900 rounded-2xl"
    >
      {/* 1. Header Banner Image */}
      <div className="relative w-full overflow-hidden transition-transform duration-500 group-hover:scale-105 bg-zinc-950">
        {(tournament.banner_url || tournament.logo_url) ? (
          <img
            src={tournament.banner_url || tournament.logo_url}
            alt={tournament.name}
            className="w-full h-auto object-contain block"
          />
        ) : (
          <div
            className="h-48 w-full"
            style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(9,9,11,0.95) 100%)" }}
          />
        )}
        {/* Subtle bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-950 to-transparent" />
        {/* Badge in top-right */}
        <div className="absolute top-4 right-4">
          <StatusBadge status={tournament.status} />
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-6 pt-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold tracking-widest text-red-500/80 bg-red-500/10 px-2.5 py-0.5 rounded-full">
              {FORMAT_LABELS[tournament.format] ?? "League"}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              Season {tournament.season_year || new Date().getFullYear()}
            </span>
          </div>

          <h3 className="mt-3 text-2xl font-bold font-display tracking-wide text-white group-hover:text-red-500 transition-colors duration-200 leading-tight">
            {tournament.name}
          </h3>

          {tournament.start_date ? (
            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 font-medium">
              <Calendar className="size-3.5 text-zinc-500" />
              <span>{formatDate(tournament.start_date)} — {formatDate(tournament.end_date)}</span>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 italic">
              <Calendar className="size-3.5 text-zinc-600" />
              <span>Scheduling in progress</span>
            </div>
          )}
        </div>

        {/* 3. Stats Grid */}
        <div className="mt-6 border-t border-zinc-900 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 text-center">
              <p className="font-display text-2xl text-white font-bold">{teamCount}</p>
              <p className="text-[0.65rem] uppercase tracking-wider font-semibold text-zinc-500 mt-0.5">Teams</p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 text-center">
              <p className="font-display text-2xl text-white font-bold">{matchCount}</p>
              <p className="text-[0.65rem] uppercase tracking-wider font-semibold text-zinc-500 mt-0.5">Matches</p>
            </div>
          </div>

          {championName && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <Trophy className="size-5 text-yellow-500 animate-pulse" />
              <div>
                <p className="text-[0.6rem] uppercase tracking-wider font-bold text-yellow-500/80">Champion</p>
                <p className="font-display font-semibold text-white leading-tight mt-0.5">{championName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
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
  const { winnerTeamId, isPenalties } = getMatchWinner(fixture);
  const { homePen, awayPen } = parseResultPenalties(result);

  const homeWin = winnerTeamId === fixture.home_team_id;
  const awayWin = winnerTeamId === fixture.away_team_id;

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="label-caps text-primary">{fixture.tournament?.name ?? "TFF"}</p>
        <p className="text-xs text-muted-foreground">{formatDate(fixture.scheduled_date)}</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{fixture.round ?? ""}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <TeamSide team={fixture.home} align="left" dim={awayWin} />
        <div className="flex flex-col items-center shrink-0">
          <div className="font-display rounded-lg border border-border bg-secondary px-3 py-1 text-2xl">
            {result ? `${result.home_score} — ${result.away_score}` : "—"}
          </div>
          {isPenalties && homePen !== null && awayPen !== null && (
            <span className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full">
              ({homePen} - {awayPen} pen)
            </span>
          )}
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
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="label-caps border-b border-border/70 text-muted-foreground">
            <th className="px-4 py-3 text-left">Pos</th>
            <th className="px-2 py-3 text-left">Team</th>
            {["P", "W", "D", "L", "GF", "GA", "GD"].map((h) => (
              <th key={h} className="px-2 py-3 text-center">
                {h}
              </th>
            ))}
            <th className="px-2 py-3 text-center text-yellow-400" title="Yellow Cards">
              YC
            </th>
            <th className="px-2 py-3 text-center text-red-400" title="Red Cards">
              RC
            </th>
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
                <td className="px-2 py-3 text-center">
                  <span className="inline-flex items-center justify-center gap-1 rounded bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-400 border border-yellow-500/20">
                    <span className="inline-block size-2 rounded-sm bg-yellow-400" />
                    {row.yellow_cards ?? 0}
                  </span>
                </td>
                <td className="px-2 py-3 text-center">
                  <span className="inline-flex items-center justify-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20">
                    <span className="inline-block size-2 rounded-sm bg-red-500" />
                    {row.red_cards ?? 0}
                  </span>
                </td>
                <td className="font-display px-4 py-3 text-center text-lg text-primary font-bold">
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
