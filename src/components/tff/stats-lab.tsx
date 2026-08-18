import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Filter,
  Flame,
  PieChart,
  Shield,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

import { TeamLogo } from "@/components/tff/branding";
import { computeStatsLab, TeamAnalytics } from "@/lib/stats-lab";
import { FixtureWithTeams, formatDate, Team, Tournament } from "@/lib/tff";
import { cn } from "@/lib/utils";

export function StatsLabDashboard({
  teams,
  fixtures,
  tournaments,
}: {
  teams: Team[];
  fixtures: FixtureWithTeams[];
  tournaments: Tournament[];
}) {
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>("all");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  const filteredFixtures = fixtures.filter((f) =>
    selectedTourneyId === "all" ? true : f.tournament_id === selectedTourneyId
  );

  const stats = computeStatsLab(teams, filteredFixtures);

  const selectedTourneyName =
    selectedTourneyId === "all"
      ? "All-Time"
      : tournaments.find((t) => t.id === selectedTourneyId)?.name ?? "Selected Tournament";

  const spotlightTeam = stats.teamsAnalytics.find(
    (t) => t.team.id === (selectedTeamId || stats.teamsAnalytics[0]?.team.id)
  );

  return (
    <div className="space-y-8">
      {/* Hero Banner & Tournament Filter */}
      <div className="panel relative overflow-hidden p-6 sm:p-8 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card">
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
              <Activity className="size-4" />
              <span>TFF Advanced Performance Analytics</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wide">
              TFF STATS LAB
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
              Deep analytical insights, attack power indices, defensive solidity ratings, and match efficiency distributions for {selectedTourneyName}.
            </p>
          </div>

          {/* Filter Selector */}
          <div className="flex items-center gap-2 bg-secondary/60 p-2 rounded-xl border border-border/80 shrink-0">
            <Filter className="size-4 text-primary ml-1" />
            <span className="text-xs font-semibold label-caps text-muted-foreground hidden sm:inline">Scope:</span>
            <select
              value={selectedTourneyId}
              onChange={(e) => setSelectedTourneyId(e.target.value)}
              className="bg-background border border-border text-sm font-semibold rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            >
              <option value="all">🏆 All-Time (All Tournaments)</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  ⚽ {t.name} ({t.season_year || "Past"})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Goals Scored"
          value={stats.totalGoals}
          subtitle={`${stats.avgGoalsPerMatch} Goals / Match`}
          icon={<Flame className="size-5 text-amber-400" />}
          glowColor="from-amber-500/20 to-transparent"
        />
        <KpiCard
          title="Matches Evaluated"
          value={stats.totalMatches}
          subtitle={`${stats.drawCount} Draws (${stats.drawPct}%)`}
          icon={<Trophy className="size-5 text-primary" />}
          glowColor="from-primary/20 to-transparent"
        />
        <KpiCard
          title="Clean Sheet Rate"
          value={`${stats.cleanSheetPct}%`}
          subtitle={`${stats.cleanSheetsCount} Total Shutouts`}
          icon={<ShieldCheck className="size-5 text-emerald-400" />}
          glowColor="from-emerald-500/20 to-transparent"
        />
        <KpiCard
          title="Penalty Shootouts"
          value={`${stats.penaltiesCount}`}
          subtitle={`${stats.penaltiesPct}% of all matches`}
          icon={<Zap className="size-5 text-cyan-400" />}
          glowColor="from-cyan-500/20 to-transparent"
        />
      </div>

      {/* Leaderboard Indices Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Attacking Teams */}
        <div className="panel p-6 space-y-4 border-border/80">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-display text-lg uppercase tracking-wide flex items-center gap-2 text-foreground">
              <Flame className="size-4 text-amber-400" /> Attack Power Index
            </h3>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Goals / Match</span>
          </div>

          <div className="space-y-3">
            {stats.topAttackingTeams.map((item, idx) => (
              <IndexRankRow key={item.team.id} rank={idx + 1} item={item} metricValue={`${item.attackPowerIndex}`} metricLabel="GF/M" color="amber" />
            ))}
          </div>
        </div>

        {/* Top Defensive Teams */}
        <div className="panel p-6 space-y-4 border-border/80">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-display text-lg uppercase tracking-wide flex items-center gap-2 text-foreground">
              <Shield className="size-4 text-emerald-400" /> Defensive Solidity
            </h3>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Conceded / Match</span>
          </div>

          <div className="space-y-3">
            {stats.topDefensiveTeams.map((item, idx) => (
              <IndexRankRow key={item.team.id} rank={idx + 1} item={item} metricValue={`${item.defenseSolidityIndex}`} metricLabel="GA/M" color="emerald" />
            ))}
          </div>
        </div>

        {/* Top Goal Efficiency Teams */}
        <div className="panel p-6 space-y-4 border-border/80">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-display text-lg uppercase tracking-wide flex items-center gap-2 text-foreground">
              <Zap className="size-4 text-cyan-400" /> Goal Efficiency Factor
            </h3>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">GD / Match</span>
          </div>

          <div className="space-y-3">
            {stats.topEfficiencyTeams.map((item, idx) => (
              <IndexRankRow key={item.team.id} rank={idx + 1} item={item} metricValue={`${item.goalEfficiency > 0 ? "+" : ""}${item.goalEfficiency}`} metricLabel="GD/M" color="cyan" />
            ))}
          </div>
        </div>
      </div>

      {/* Team Analytics Spotlight & Highest Scoring Matches */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Spotlight Team Report Card */}
        <div className="panel p-6 space-y-6 border-primary/40 bg-card/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Team Analytical Profile</span>
              <h3 className="font-display text-2xl uppercase">Stats Spotlight</h3>
            </div>

            {/* Team Picker */}
            <select
              value={spotlightTeam?.team.id || ""}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="bg-background border border-border text-sm font-semibold rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            >
              {stats.teamsAnalytics.map((t) => (
                <option key={t.team.id} value={t.team.id}>
                  {t.team.name} ({t.matchesPlayed} Matches)
                </option>
              ))}
            </select>
          </div>

          {spotlightTeam ? (
            <div className="space-y-6">
              {/* Team Hero Row */}
              <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-xl border border-border/60">
                <TeamLogo
                  name={spotlightTeam.team.name}
                  shortName={spotlightTeam.team.short_name}
                  color={spotlightTeam.team.team_color}
                  logoUrl={spotlightTeam.team.logo_url}
                  size="lg"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-display text-2xl uppercase truncate">{spotlightTeam.team.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    Manager: {spotlightTeam.team.manager_name || "Unknown"} · Played: {spotlightTeam.matchesPlayed} matches
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {spotlightTeam.recentForm.map((res, i) => (
                    <span
                      key={i}
                      className={cn(
                        "size-6 rounded-md grid place-items-center text-[10px] font-extrabold text-white",
                        res === "W" && "bg-emerald-500",
                        res === "D" && "bg-zinc-600",
                        res === "L" && "bg-rose-500"
                      )}
                    >
                      {res}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Matrix Grid */}
              <div className="grid gap-3 sm:grid-cols-3">
                <SpotlightMetric label="Attack Power (API)" value={`${spotlightTeam.attackPowerIndex}`} note={`${spotlightTeam.goalsScored} total goals`} color="text-amber-400" />
                <SpotlightMetric label="Defensive Rating (DSI)" value={`${spotlightTeam.defenseSolidityIndex}`} note={`${spotlightTeam.goalsConceded} conceded`} color="text-emerald-400" />
                <SpotlightMetric label="Goal Efficiency (GEI)" value={`${spotlightTeam.goalEfficiency > 0 ? "+" : ""}${spotlightTeam.goalEfficiency}`} note={`${spotlightTeam.goalDifference > 0 ? "+" : ""}${spotlightTeam.goalDifference} GD`} color="text-cyan-400" />
                <SpotlightMetric label="Clean Sheets" value={`${spotlightTeam.cleanSheets}`} note={`${spotlightTeam.cleanSheetPct}% shutouts`} color="text-blue-400" />
                <SpotlightMetric label="Clutch Wins" value={`${spotlightTeam.clutchWins}`} note={`${spotlightTeam.clutchWinPct}% 1-goal/pen wins`} color="text-purple-400" />
                <SpotlightMetric label="Record (W-D-L)" value={`${spotlightTeam.wins}-${spotlightTeam.draws}-${spotlightTeam.losses}`} note={`${spotlightTeam.matchesPlayed ? Math.round((spotlightTeam.wins / spotlightTeam.matchesPlayed) * 100) : 0}% Win Rate`} color="text-primary" />
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground p-6 text-center">Select a team to inspect detailed analytics.</p>
          )}
        </div>

        {/* Highest Scoring Matches */}
        <div className="panel p-6 space-y-4 border-border/80">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-display text-lg uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> High Goal Thrillers
            </h3>
          </div>

          <div className="space-y-3">
            {stats.highestScoringMatches.map((item) => (
              <div
                key={item.fixture.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground truncate">
                    {item.fixture.tournament?.name || "TFF"} · {formatDate(item.fixture.scheduled_date)}
                  </p>
                  <p className="text-sm font-semibold truncate mt-0.5">
                    {item.fixture.home?.name} vs {item.fixture.away?.name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-display text-lg font-bold text-primary">
                    {item.homeScore} — {item.awayScore}
                  </span>
                  <p className="text-[10px] font-extrabold text-amber-400 uppercase">
                    {item.totalGoals} Goals
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  glowColor,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  glowColor: string;
}) {
  return (
    <div className="panel relative overflow-hidden p-5 border-border/80 bg-card/60">
      <div className={cn("absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br blur-2xl pointer-events-none", glowColor)} />
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold label-caps text-muted-foreground uppercase">{title}</span>
        <div className="grid size-9 place-items-center rounded-lg bg-secondary/80 border border-border/80">{icon}</div>
      </div>
      <p className="font-display text-3xl font-extrabold mt-3 text-foreground tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1 font-medium">{subtitle}</p>
    </div>
  );
}

function IndexRankRow({
  rank,
  item,
  metricValue,
  metricLabel,
  color,
}: {
  rank: number;
  item: TeamAnalytics;
  metricValue: string;
  metricLabel: string;
  color: "amber" | "emerald" | "cyan";
}) {
  const colorMap = {
    amber: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    cyan: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-secondary/20 p-2.5">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-display text-sm font-bold text-muted-foreground w-4 text-center">{rank}</span>
        <TeamLogo
          name={item.team.name}
          shortName={item.team.short_name}
          color={item.team.team_color}
          logoUrl={item.team.logo_url}
          size="xs"
        />
        <Link to="/team/$teamId" params={{ teamId: item.team.id }} className="text-sm font-semibold truncate hover:text-primary">
          {item.team.name}
        </Link>
      </div>
      <div className="text-right shrink-0">
        <span className={cn("px-2 py-0.5 rounded text-xs font-extrabold border font-mono", colorMap[color])}>
          {metricValue} <span className="text-[9px] font-normal opacity-80">{metricLabel}</span>
        </span>
      </div>
    </div>
  );
}

function SpotlightMetric({
  label,
  value,
  note,
  color,
}: {
  label: string;
  value: string;
  note: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/20 p-3">
      <p className="text-[10px] uppercase font-bold text-muted-foreground">{label}</p>
      <p className={cn("font-display text-2xl font-bold mt-1 tracking-tight", color)}>{value}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{note}</p>
    </div>
  );
}
