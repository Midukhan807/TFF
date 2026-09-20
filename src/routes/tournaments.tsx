import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AlertTriangle, Flame, Goal, ShieldAlert, Trophy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TeamLogo } from "@/components/tff/branding";
import { EmptyState, SectionHeading, TournamentCard } from "@/components/tff/ui";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FORMAT_LABELS,
  fetchAllStandings,
  fetchChampions,
  fetchTeams,
  fetchTournaments,
} from "@/lib/tff";

export const Route = createFileRoute("/tournaments")({
  head: () => ({
    meta: [
      { title: "Triad Champions League (TCL) & Competitions | Triad Football Federation (TFF)" },
      {
        name: "description",
        content:
          "Browse every eFootball competition organized by the Triad Football Federation (TFF), including official Triad Champions League (TCL) seasons, live matches, standings, and completed tournament archives.",
      },
      {
        name: "keywords",
        content:
          "Triad Champions League, TCL, Triad Football Federation, TFF tournaments, eFootball league, TCL Season 7, eFootball competitions",
      },
      { property: "og:title", content: "Triad Champions League (TCL) & Competitions | TFF" },
      {
        property: "og:description",
        content: "Live, upcoming and completed Triad Champions League (TCL) and TFF eFootball tournaments.",
      },
    ],
  }),
  component: TournamentsPage,
});

function TournamentsPage() {
  const [tab, setTab] = useState("all");
  const [year, setYear] = useState("all");
  const [format, setFormat] = useState("all");
  const [search, setSearch] = useState("");
  const [statsTourneyFilter, setStatsTourneyFilter] = useState("all");
  const [statsCategory, setStatsCategory] = useState<"goals" | "yellow" | "red" | "fairplay">("goals");

  const tournaments = useQuery({ queryKey: ["tournaments"], queryFn: fetchTournaments });
  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const champions = useQuery({ queryKey: ["champions"], queryFn: fetchChampions });
  const standings = useQuery({ queryKey: ["all-standings"], queryFn: fetchAllStandings });

  const teamMap = new Map((teams.data ?? []).map((t) => [t.id, t]));
  const championMap = new Map(
    (champions.data ?? []).map((c) => [c.tournament_id, c.champion_team_id]),
  );
  const all = tournaments.data ?? [];
  const tourneyMap = new Map(all.map((t) => [t.id, t]));
  const years = [...new Set(all.map((t) => t.season_year).filter(Boolean))].sort(
    (a, b) => (b as number) - (a as number),
  );

  const filtered = all.filter((t) => {
    if (tab === "upcoming" && !["upcoming", "draft"].includes(t.status)) return false;
    if (tab === "live" && t.status !== "live") return false;
    if (tab === "completed" && !["completed", "archived"].includes(t.status)) return false;
    if (year !== "all" && String(t.season_year) !== year) return false;
    if (format !== "all" && t.format !== format) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Aggregate standings data for leaderboard view
  const allStandingsRows = standings.data ?? [];
  const filteredStandingsRows = statsTourneyFilter === "all"
    ? allStandingsRows
    : allStandingsRows.filter((r) => r.tournament_id === statsTourneyFilter);

  // Group by team for the selected tournament or all-time
  const teamStatsAgg = new Map<string, {
    teamId: string;
    team: ReturnType<typeof teamMap.get>;
    played: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDiff: number;
    yellowCards: number;
    redCards: number;
    points: number;
    tournamentsCount: number;
  }>();

  for (const row of filteredStandingsRows) {
    const cur = teamStatsAgg.get(row.team_id) || {
      teamId: row.team_id,
      team: teamMap.get(row.team_id),
      played: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      yellowCards: 0,
      redCards: 0,
      points: 0,
      tournamentsCount: 0,
    };
    cur.played += row.played || 0;
    cur.goalsFor += row.goals_for || 0;
    cur.goalsAgainst += row.goals_against || 0;
    cur.goalDiff += (row.goals_for || 0) - (row.goals_against || 0);
    cur.yellowCards += Number(row.yellow_cards) || 0;
    cur.redCards += Number(row.red_cards) || 0;
    cur.points += row.points || 0;
    cur.tournamentsCount += 1;
    teamStatsAgg.set(row.team_id, cur);
  }

  const teamList = Array.from(teamStatsAgg.values());

  const goalsLeaderboard = [...teamList].sort((a, b) => b.goalsFor - a.goalsFor || b.goalDiff - a.goalDiff);
  const yellowLeaderboard = [...teamList].sort((a, b) => b.yellowCards - a.yellowCards || b.played - a.played);
  const redLeaderboard = [...teamList].sort((a, b) => b.redCards - a.redCards || b.yellowCards - a.yellowCards);
  const fairPlayLeaderboard = [...teamList]
    .filter((t) => t.played > 0)
    .sort((a, b) => (a.yellowCards + a.redCards * 3) - (b.yellowCards + b.redCards * 3));

  const totalGoals = teamList.reduce((acc, t) => acc + t.goalsFor, 0);
  const totalYellows = teamList.reduce((acc, t) => acc + t.yellowCards, 0);
  const totalReds = teamList.reduce((acc, t) => acc + t.redCards, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Competitions"
        title="TFF Tournaments"
        subtitle="Every competition organized by TFF, from the first kick-off to the final whistle."
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="stats" className="text-amber-400 font-bold">
              📊 Stats Leaderboard
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {tab !== "stats" ? (
          <>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All years</SelectItem>
                {years.map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All formats</SelectItem>
                {Object.entries(FORMAT_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tournaments..."
              className="max-w-xs"
            />
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-3 ml-auto">
            <Select value={statsTourneyFilter} onValueChange={setStatsTourneyFilter}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by Tournament" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🏆 All Tournaments</SelectItem>
                {all.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {tab === "stats" ? (
        <div className="space-y-8">
          {/* Top Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="panel p-5 bg-gradient-to-b from-amber-950/30 to-card border-amber-500/30">
              <p className="label-caps text-amber-400 font-bold flex items-center gap-1.5">
                <Goal className="size-4" /> Total Goals Scored
              </p>
              <p className="font-display text-3xl font-extrabold text-foreground mt-2">{totalGoals}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Leader: {goalsLeaderboard[0]?.team?.name ?? "—"} ({goalsLeaderboard[0]?.goalsFor ?? 0} goals)
              </p>
            </div>
            <div className="panel p-5 bg-gradient-to-b from-yellow-950/30 to-card border-yellow-500/30">
              <p className="label-caps text-yellow-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="size-4" /> Total Yellow Cards
              </p>
              <p className="font-display text-3xl font-extrabold text-yellow-400 mt-2">{totalYellows} 🟨</p>
              <p className="text-xs text-muted-foreground mt-1">
                Most cautioned: {yellowLeaderboard[0]?.team?.name ?? "—"} ({yellowLeaderboard[0]?.yellowCards ?? 0} yellows)
              </p>
            </div>
            <div className="panel p-5 bg-gradient-to-b from-red-950/30 to-card border-red-500/30">
              <p className="label-caps text-red-400 font-bold flex items-center gap-1.5">
                <ShieldAlert className="size-4" /> Total Red Cards
              </p>
              <p className="font-display text-3xl font-extrabold text-red-400 mt-2">{totalReds} 🟥</p>
              <p className="text-xs text-muted-foreground mt-1">
                Most expulsions: {redLeaderboard[0]?.team?.name ?? "—"} ({redLeaderboard[0]?.redCards ?? 0} reds)
              </p>
            </div>
          </div>

          {/* Sub category switch */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border/70 pb-3">
            <button
              onClick={() => setStatsCategory("goals")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statsCategory === "goals"
                  ? "bg-amber-500 text-black font-bold shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              ⚽ Most Goals Leaderboard
            </button>
            <button
              onClick={() => setStatsCategory("yellow")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statsCategory === "yellow"
                  ? "bg-yellow-500 text-black font-bold shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              🟨 Yellow Cards Leaderboard
            </button>
            <button
              onClick={() => setStatsCategory("red")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statsCategory === "red"
                  ? "bg-red-600 text-white font-bold shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              🟥 Red Cards Leaderboard
            </button>
            <button
              onClick={() => setStatsCategory("fairplay")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statsCategory === "fairplay"
                  ? "bg-emerald-600 text-white font-bold shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              🕊️ Fair Play Ranking
            </button>
          </div>

          {/* Leaderboard Table */}
          <div className="panel p-0 overflow-hidden border-border/80">
            <div className="p-4 bg-secondary/40 border-b border-border/60 flex items-center justify-between">
              <p className="text-xs uppercase font-bold text-foreground tracking-wider flex items-center gap-2">
                {statsCategory === "goals" && <>⚽ Top Scoring Teams Leaderboard</>}
                {statsCategory === "yellow" && <>🟨 Most Yellow Cards Leaderboard</>}
                {statsCategory === "red" && <>🟥 Most Red Cards Leaderboard</>}
                {statsCategory === "fairplay" && <>🕊️ Fair Play & Clean Record Standings</>}
              </p>
              {statsTourneyFilter !== "all" && tourneyMap.get(statsTourneyFilter) && (
                <Link
                  to="/tournament/$slug"
                  params={{ slug: tourneyMap.get(statsTourneyFilter)!.slug }}
                  search={{ tab: "statistics" }}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  View Tournament Stats Page →
                </Link>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="label-caps border-b border-border/70 text-muted-foreground bg-muted/20 text-xs">
                    <th className="px-4 py-3 text-center w-12">#</th>
                    <th className="px-4 py-3 text-left">Team</th>
                    <th className="px-4 py-3 text-center">Played</th>
                    {statsCategory === "goals" && (
                      <>
                        <th className="px-4 py-3 text-center text-amber-400 font-bold">Goals For (GF)</th>
                        <th className="px-4 py-3 text-center">Goals / Game</th>
                        <th className="px-4 py-3 text-center">Conceded</th>
                        <th className="px-4 py-3 text-center">Goal Diff</th>
                      </>
                    )}
                    {statsCategory === "yellow" && (
                      <>
                        <th className="px-4 py-3 text-center text-yellow-400 font-bold">Yellow Cards</th>
                        <th className="px-4 py-3 text-center">Yellows / Game</th>
                        <th className="px-4 py-3 text-center">Red Cards</th>
                      </>
                    )}
                    {statsCategory === "red" && (
                      <>
                        <th className="px-4 py-3 text-center text-red-400 font-bold">Red Cards</th>
                        <th className="px-4 py-3 text-center">Reds / Game</th>
                        <th className="px-4 py-3 text-center">Yellow Cards</th>
                      </>
                    )}
                    {statsCategory === "fairplay" && (
                      <>
                        <th className="px-4 py-3 text-center text-yellow-400">🟨 (1pt)</th>
                        <th className="px-4 py-3 text-center text-red-400">🟥 (3pts)</th>
                        <th className="px-4 py-3 text-center font-bold text-foreground">Discipline Points</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(statsCategory === "goals"
                    ? goalsLeaderboard
                    : statsCategory === "yellow"
                    ? yellowLeaderboard
                    : statsCategory === "red"
                    ? redLeaderboard
                    : fairPlayLeaderboard
                  ).map((t, idx) => {
                    const penaltyPts = t.yellowCards + t.redCards * 3;
                    return (
                      <tr
                        key={t.teamId}
                        className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-center text-xs text-muted-foreground font-semibold">
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to="/team/$teamId"
                            params={{ teamId: t.teamId }}
                            className="flex items-center gap-2.5 hover:underline"
                          >
                            <TeamLogo
                              name={t.team?.name}
                              shortName={t.team?.short_name}
                              color={t.team?.team_color}
                              logoUrl={t.team?.logo_url}
                              size="xs"
                            />
                            <span className="font-semibold text-foreground">{t.team?.name ?? "Unknown Team"}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center text-muted-foreground">{t.played}</td>
                        {statsCategory === "goals" && (
                          <>
                            <td className="px-4 py-3 text-center font-display font-bold text-base text-amber-400">
                              {t.goalsFor}
                            </td>
                            <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                              {t.played ? (t.goalsFor / t.played).toFixed(2) : "0.00"}
                            </td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{t.goalsAgainst}</td>
                            <td className={`px-4 py-3 text-center font-bold text-xs ${t.goalDiff > 0 ? "text-emerald-400" : t.goalDiff < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                              {t.goalDiff > 0 ? `+${t.goalDiff}` : t.goalDiff}
                            </td>
                          </>
                        )}
                        {statsCategory === "yellow" && (
                          <>
                            <td className="px-4 py-3 text-center font-display font-bold text-base text-yellow-400">
                              🟨 {t.yellowCards}
                            </td>
                            <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                              {t.played ? (t.yellowCards / t.played).toFixed(2) : "0.00"}
                            </td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{t.redCards}</td>
                          </>
                        )}
                        {statsCategory === "red" && (
                          <>
                            <td className="px-4 py-3 text-center font-display font-bold text-base text-red-400">
                              🟥 {t.redCards}
                            </td>
                            <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                              {t.played ? (t.redCards / t.played).toFixed(2) : "0.00"}
                            </td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{t.yellowCards}</td>
                          </>
                        )}
                        {statsCategory === "fairplay" && (
                          <>
                            <td className="px-4 py-3 text-center text-yellow-400 font-semibold">{t.yellowCards}</td>
                            <td className="px-4 py-3 text-center text-red-400 font-semibold">{t.redCards}</td>
                            <td className="px-4 py-3 text-center font-display font-bold text-foreground">
                              {penaltyPts} pts
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tournament) => {
            const championId = championMap.get(tournament.id);
            return (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                championName={championId ? teamMap.get(championId)?.name : null}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No TFF tournaments yet"
          description="No tournaments match this filter. Try a different tab, year or format."
        />
      )}
    </div>
  );
}
