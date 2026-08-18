import { Swords, ArrowRightLeft, Trophy, Flame, Sparkles, ShieldCheck, History } from "lucide-react";
import { useMemo } from "react";

import { TeamLogo } from "@/components/tff/branding";
import { Champion, FixtureWithTeams, formatDate, getTeamFoundedYear, getTeamVideoLogo, StandingRow, Team } from "@/lib/tff";
import { computeH2HComparison, FormMatch } from "@/lib/h2h";

interface H2HPredictorProps {
  teams: Team[];
  teamAId: string;
  teamBId: string;
  onSelectTeamA: (id: string) => void;
  onSelectTeamB: (id: string) => void;
  allFixtures: FixtureWithTeams[];
  allStandings: StandingRow[];
  champions: Champion[];
}

export function H2HPredictor({
  teams,
  teamAId,
  teamBId,
  onSelectTeamA,
  onSelectTeamB,
  allFixtures,
  allStandings,
  champions,
}: H2HPredictorProps) {
  const teamA = useMemo(() => teams.find((t) => t.id === teamAId) || teams[0], [teams, teamAId]);
  const teamB = useMemo(
    () => teams.find((t) => t.id === teamBId) || teams.find((t) => t.id !== teamA?.id) || teams[1],
    [teams, teamBId, teamA]
  );

  const comparison = useMemo(() => {
    if (!teamA || !teamB) return null;
    return computeH2HComparison(teamA, teamB, allFixtures, allStandings, champions);
  }, [teamA, teamB, allFixtures, allStandings, champions]);

  if (!teamA || !teamB || !comparison) {
    return null;
  }

  const swapTeams = () => {
    onSelectTeamA(teamB.id);
    onSelectTeamB(teamA.id);
  };

  const { statsA, statsB, probability, matches, totalMatches, biggestWinA, biggestWinB } = comparison;

  return (
    <div className="space-y-8">
      {/* Selector Header Panel */}
      <div className="panel p-6 border-border/80 bg-card/60 backdrop-blur-md shadow-2xl rounded-xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Team A Dropdown */}
          <div className="flex w-full flex-1 items-center gap-3">
            <TeamLogo
              name={teamA.name}
              shortName={teamA.short_name}
              color={teamA.team_color}
              logoUrl={teamA.logo_url}
              videoUrl={getTeamVideoLogo(teamA)}
              size="md"
            />
            <div className="flex-1">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Team 1</label>
              <select
                value={teamA.id}
                onChange={(e) => onSelectTeamA(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border/80 bg-background/90 px-3 py-2 text-sm font-semibold text-foreground shadow-sm focus:border-primary focus:outline-none"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id} disabled={t.id === teamB.id}>
                    {t.name} ({t.short_name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={swapTeams}
            title="Swap Teams"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110 active:scale-95"
          >
            <ArrowRightLeft className="size-5" />
          </button>

          {/* Team B Dropdown */}
          <div className="flex w-full flex-1 items-center gap-3">
            <div className="flex-1 text-right md:text-left">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Team 2</label>
              <select
                value={teamB.id}
                onChange={(e) => onSelectTeamB(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border/80 bg-background/90 px-3 py-2 text-sm font-semibold text-foreground shadow-sm focus:border-primary focus:outline-none"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id} disabled={t.id === teamA.id}>
                    {t.name} ({t.short_name})
                  </option>
                ))}
              </select>
            </div>
            <TeamLogo
              name={teamB.name}
              shortName={teamB.short_name}
              color={teamB.team_color}
              logoUrl={teamB.logo_url}
              videoUrl={getTeamVideoLogo(teamB)}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Hero Matchup Clash Card */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-b from-background via-card/80 to-background p-6 sm:p-8 shadow-2xl">
        {/* Background glow effects */}
        <div
          className="absolute -left-20 -top-20 size-72 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: teamA.team_color || "#3b82f6" }}
        />
        <div
          className="absolute -right-20 -top-20 size-72 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: teamB.team_color || "#ef4444" }}
        />

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Team A Profile */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <TeamLogo
              name={teamA.name}
              shortName={teamA.short_name}
              color={teamA.team_color}
              logoUrl={teamA.logo_url}
              videoUrl={getTeamVideoLogo(teamA)}
              size="lg"
            />
            <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-wide">{teamA.name}</h2>
            <p className="text-sm text-muted-foreground font-medium">
              Manager: <span className="text-foreground font-semibold">{teamA.manager_name || "N/A"}</span> · Est. {getTeamFoundedYear(teamA)}
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Form:</span>
              <FormBadges form={statsA.form} />
            </div>
          </div>

          {/* VS Centerpiece */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 shadow-lg shadow-primary/20 animate-pulse">
              <Swords className="size-8 text-primary" />
            </div>
            <span className="mt-2 text-xs uppercase tracking-widest font-bold text-muted-foreground">
              Rivalry Clash
            </span>
            <div className="mt-1 flex items-center gap-2 rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-primary border border-border">
              <History className="size-3.5" /> {totalMatches} {totalMatches === 1 ? "Meeting" : "Meetings"} Recorded
            </div>
          </div>

          {/* Team B Profile */}
          <div className="flex flex-col items-center text-center md:items-end md:text-right">
            <TeamLogo
              name={teamB.name}
              shortName={teamB.short_name}
              color={teamB.team_color}
              logoUrl={teamB.logo_url}
              videoUrl={getTeamVideoLogo(teamB)}
              size="lg"
            />
            <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-wide">{teamB.name}</h2>
            <p className="text-sm text-muted-foreground font-medium">
              Manager: <span className="text-foreground font-semibold">{teamB.manager_name || "N/A"}</span> · Est. {getTeamFoundedYear(teamB)}
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Form:</span>
              <FormBadges form={statsB.form} />
            </div>
          </div>
        </div>

        {/* Win Probability Predictor Bar */}
        <div className="mt-8 border-t border-border/70 pt-6">
          <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider mb-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Sparkles className="size-4" /> {teamA.short_name} Win {probability.winPctA}%
            </div>
            <div className="text-muted-foreground text-xs font-semibold">
              Draw {probability.drawPct}%
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              {teamB.short_name} Win {probability.winPctB}% <Sparkles className="size-4" />
            </div>
          </div>

          <div className="flex h-4.5 w-full overflow-hidden rounded-full border border-border/80 bg-secondary shadow-inner">
            <div
              style={{ width: `${probability.winPctA}%`, backgroundColor: teamA.team_color || "#3b82f6" }}
              className="flex items-center justify-center text-[10px] font-extrabold text-white transition-all duration-500"
              title={`${teamA.name} Win Probability: ${probability.winPctA}%`}
            >
              {probability.winPctA >= 15 && `${probability.winPctA}%`}
            </div>
            <div
              style={{ width: `${probability.drawPct}%` }}
              className="flex items-center justify-center bg-zinc-600/70 text-[10px] font-extrabold text-zinc-200 transition-all duration-500"
              title={`Draw Probability: ${probability.drawPct}%`}
            >
              {probability.drawPct >= 10 && `${probability.drawPct}%`}
            </div>
            <div
              style={{ width: `${probability.winPctB}%`, backgroundColor: teamB.team_color || "#10b981" }}
              className="flex items-center justify-center text-[10px] font-extrabold text-white transition-all duration-500"
              title={`${teamB.name} Win Probability: ${probability.winPctB}%`}
            >
              {probability.winPctB >= 15 && `${probability.winPctB}%`}
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground italic">
            *Predictive rating calculated using direct H2H history, career win percentages, and recent form.
          </p>
        </div>
      </div>

      {/* Head-to-Head Detailed Comparison Metrics */}
      <div className="panel p-6 border-border/80 space-y-6">
        <h3 className="text-xl font-bold uppercase tracking-wide flex items-center gap-2">
          <Flame className="size-5 text-primary" /> Head-to-Head Stats Comparison
        </h3>

        <div className="space-y-4">
          <StatComparisonRow
            label="Direct Wins"
            valA={statsA.wins}
            valB={statsB.wins}
            colorA={teamA.team_color}
            colorB={teamB.team_color}
          />
          <StatComparisonRow
            label="Direct Goals Scored"
            valA={statsA.goalsScored}
            valB={statsB.goalsScored}
            colorA={teamA.team_color}
            colorB={teamB.team_color}
          />
          <StatComparisonRow
            label="Clean Sheets in H2H"
            valA={statsA.cleanSheets}
            valB={statsB.cleanSheets}
            colorA={teamA.team_color}
            colorB={teamB.team_color}
          />
          <StatComparisonRow
            label="Overall Career Win %"
            valA={`${statsA.overallWinPct}%`}
            valB={`${statsB.overallWinPct}%`}
            rawA={statsA.overallWinPct}
            rawB={statsB.overallWinPct}
            colorA={teamA.team_color}
            colorB={teamB.team_color}
          />
          <StatComparisonRow
            label="Yellow Cards (H2H)"
            valA={statsA.yellowCards}
            valB={statsB.yellowCards}
            rawA={statsA.yellowCards}
            rawB={statsB.yellowCards}
            invertHighlight
            colorA={teamA.team_color}
            colorB={teamB.team_color}
          />
          <StatComparisonRow
            label="Red Cards (H2H)"
            valA={statsA.redCards}
            valB={statsB.redCards}
            rawA={statsA.redCards}
            rawB={statsB.redCards}
            invertHighlight
            colorA={teamA.team_color}
            colorB={teamB.team_color}
          />
        </div>
      </div>

      {/* Milestone Highlights */}
      {(biggestWinA || biggestWinB) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {biggestWinA && (
            <div className="panel p-4 border-l-4 border-l-primary bg-card/70">
              <span className="text-xs uppercase font-bold text-muted-foreground">Biggest Win for {teamA.short_name}</span>
              <p className="mt-1 text-lg font-extrabold text-foreground">
                {teamA.short_name} {biggestWinA.homeScore} - {biggestWinA.awayScore} {teamB.short_name}
              </p>
              <p className="text-xs text-muted-foreground">{biggestWinA.tournamentName} · {formatDate(biggestWinA.date)}</p>
            </div>
          )}
          {biggestWinB && (
            <div className="panel p-4 border-l-4 border-l-emerald-500 bg-card/70">
              <span className="text-xs uppercase font-bold text-muted-foreground">Biggest Win for {teamB.short_name}</span>
              <p className="mt-1 text-lg font-extrabold text-foreground">
                {teamB.short_name} {biggestWinB.awayScore} - {biggestWinB.homeScore} {teamA.short_name}
              </p>
              <p className="text-xs text-muted-foreground">{biggestWinB.tournamentName} · {formatDate(biggestWinB.date)}</p>
            </div>
          )}
        </div>
      )}

      {/* Complete Historical Match Encounters */}
      <div className="panel p-6 border-border/80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold uppercase tracking-wide flex items-center gap-2">
            <History className="size-5 text-primary" /> Past Encounters ({matches.length})
          </h3>
        </div>

        {matches.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 p-8 text-center">
            <ShieldCheck className="mx-auto size-10 text-muted-foreground/50" />
            <h4 className="mt-2 font-semibold">No Past Matches Recorded</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {teamA.name} and {teamB.name} have not faced each other in an official TFF tournament match yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((m, idx) => {
              const homeIsA = m.homeTeamId === teamA.id;
              const teamHome = homeIsA ? teamA : teamB;
              const teamAway = homeIsA ? teamB : teamA;

              return (
                <div
                  key={m.fixture.id || idx}
                  className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border/70 bg-card/40 p-4 transition-all hover:bg-card/90 sm:flex-row"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                    <Trophy className="size-3.5 text-primary" />
                    <span>{m.tournamentName}</span>
                    <span>·</span>
                    <span>{formatDate(m.date)}</span>
                  </div>

                  <div className="flex items-center gap-4 font-bold">
                    <div className="flex items-center gap-2 text-right">
                      <span className={m.winnerTeamId === teamHome.id ? "text-primary font-black" : ""}>
                        {teamHome.name}
                      </span>
                      <TeamLogo
                        name={teamHome.name}
                        shortName={teamHome.short_name}
                        color={teamHome.team_color}
                        logoUrl={teamHome.logo_url}
                        size="xs"
                      />
                    </div>

                    <div className="rounded-lg bg-secondary px-3 py-1 text-sm font-extrabold tracking-wider border border-border">
                      {m.homeScore} - {m.awayScore}
                    </div>

                    <div className="flex items-center gap-2 text-left">
                      <TeamLogo
                        name={teamAway.name}
                        shortName={teamAway.short_name}
                        color={teamAway.team_color}
                        logoUrl={teamAway.logo_url}
                        size="xs"
                      />
                      <span className={m.winnerTeamId === teamAway.id ? "text-primary font-black" : ""}>
                        {teamAway.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FormBadges({ form }: { form: FormMatch[] }) {
  if (form.length === 0) {
    return <span className="text-xs text-muted-foreground italic">No games</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {form.map((f, i) => (
        <span
          key={f.fixtureId + i}
          title={`${f.result} vs ${f.opponentName} (${f.scoreText})`}
          className={`flex size-5.5 items-center justify-center rounded text-[10px] font-extrabold uppercase text-white shadow-sm ${
            f.result === "W"
              ? "bg-emerald-600"
              : f.result === "D"
              ? "bg-amber-600"
              : "bg-red-600"
          }`}
        >
          {f.result}
        </span>
      ))}
    </div>
  );
}

interface StatComparisonRowProps {
  label: string;
  valA: number | string;
  valB: number | string;
  rawA?: number;
  rawB?: number;
  invertHighlight?: boolean;
  colorA?: string;
  colorB?: string;
}

function StatComparisonRow({
  label,
  valA,
  valB,
  rawA,
  rawB,
  invertHighlight = false,
  colorA,
  colorB,
}: StatComparisonRowProps) {
  const numA = rawA !== undefined ? rawA : typeof valA === "number" ? valA : 0;
  const numB = rawB !== undefined ? rawB : typeof valB === "number" ? valB : 0;

  const total = numA + numB || 1;
  const pctA = Math.round((numA / total) * 100);
  const pctB = Math.round((numB / total) * 100);

  const isAheadA = invertHighlight ? numA < numB : numA > numB;
  const isAheadB = invertHighlight ? numB < numA : numB > numA;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
        <span className={isAheadA ? "text-primary font-black text-sm" : "text-muted-foreground"}>
          {valA}
        </span>
        <span className="text-foreground/80">{label}</span>
        <span className={isAheadB ? "text-primary font-black text-sm" : "text-muted-foreground"}>
          {valB}
        </span>
      </div>

      <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          style={{ width: `${pctA}%`, backgroundColor: isAheadA ? colorA || "#3b82f6" : "#64748b" }}
          className="h-full transition-all duration-300"
        />
        <div
          style={{ width: `${pctB}%`, backgroundColor: isAheadB ? colorB || "#ef4444" : "#64748b" }}
          className="h-full transition-all duration-300"
        />
      </div>
    </div>
  );
}
