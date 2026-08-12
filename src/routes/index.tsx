import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Trophy, Users, Youtube, Play } from "lucide-react";

import { EmptyState, ResultCard, SectionHeading, StatusBadge, TournamentCard } from "@/components/tff/ui";
import { FixtureCard } from "@/components/tff/ui";
import { TeamLogo } from "@/components/tff/branding";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  fetchChampions,
  fetchFixtures,
  fetchLatestResults,
  fetchStandings,
  fetchTeams,
  fetchTournamentTeams,
  fetchTournaments,
  fetchUpcomingFixtures,
  formatDate,
  sortStandings,
  fetchRankingConfig,
} from "@/lib/tff";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Triad Football Federation (TFF) | Triad Champions League & eFootball Hub" },
      {
        name: "description",
        content:
          "Official home of the Triad Football Federation (TFF eFootball) & Triad Champions League (TCL). Follow live eFootball tournaments, fixtures, results, standings, team power rankings and Hall of Champions.",
      },
      {
        name: "keywords",
        content:
          "Triad Football Federation, Triad Champions League, TFF, TFF eFootball, Triad Football, TCL, eFootball tournaments, TCL Season 7, TFF global rankings",
      },
      { property: "og:title", content: "Triad Football Federation (TFF) | Triad Champions League" },
      {
        property: "og:description",
        content: "Compete. Conquer. Create History. Official home of the Triad Football Federation (TFF) and Triad Champions League (TCL).",
      },
    ],
  }),
  component: Home,
});

function getEmbedUrl(url?: string | null) {
  if (!url) return "https://www.youtube.com/embed/live_stream?channel=UCphlpfpbcsfwubdrtfpmb";
  if (url.includes("embed/")) return url;

  let videoId = "";
  if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("live/")) {
    videoId = url.split("live/")[1]?.split("?")[0];
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}

function LiveStreamSection({ liveUrl }: { liveUrl?: string | null }) {
  const embedUrl = getEmbedUrl(liveUrl);
  const watchUrl = liveUrl || "https://www.youtube.com/@Dante_JR_7";

  return (
    <section className="panel relative overflow-hidden p-6 sm:p-8 border-red-600/30 bg-black/40">
      <div className="absolute top-0 right-0 p-4">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_1.8fr] items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-500">
            <Youtube className="size-6 animate-pulse" />
            <span className="font-display text-lg tracking-wider">TFF LIVE STREAM</span>
          </div>
          <h2 className="text-3xl font-display uppercase tracking-wide">Watch the Action Live</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sometimes we stream tournaments and matches live on our YouTube channel. Tune in to watch competitive eFootball, intense finals, and highlight reels.
          </p>
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-semibold">
            <a href={watchUrl} target="_blank" rel="noopener noreferrer">
              <Play className="size-4 mr-2" /> Visit YouTube Channel
            </a>
          </Button>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden border border-border/80 shadow-2xl">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={embedUrl}
            title="TFF Live Stream"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function Home() {
  const tournaments = useQuery({ queryKey: ["tournaments"], queryFn: fetchTournaments });
  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const champions = useQuery({ queryKey: ["champions"], queryFn: fetchChampions });
  const results = useQuery({ queryKey: ["latest-results"], queryFn: () => fetchLatestResults(4) });
  const upcoming = useQuery({ queryKey: ["upcoming"], queryFn: () => fetchUpcomingFixtures(4) });
  const config = useQuery({ queryKey: ["ranking-config"], queryFn: fetchRankingConfig });

  const all = tournaments.data ?? [];
  const active = all.find((t) => t.status === "live") ?? null;
  const archive = all.filter((t) => t.status === "completed" || t.status === "archived");

  const teamMap = new Map((teams.data ?? []).map((t) => [t.id, t]));
  const championByTournament = new Map(
    (champions.data ?? []).map((c) => [c.tournament_id, c.champion_team_id]),
  );

  return (
    <div>
      <Hero />
      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6">
        <LiveStreamSection liveUrl={config.data?.youtube_live_url} />

        {active && (
          <ActiveTournament tournamentId={active.id} slug={active.slug} />
        )}

        {results.data && results.data.length > 0 && (
          <section>
            <SectionHeading
              eyebrow="Match Centre"
              title="Latest Results"
              action={
                <Button asChild variant="secondary" size="sm">
                  <Link to="/tournaments">View All Results</Link>
                </Button>
              }
            />
            <div className="grid gap-4 md:grid-cols-2">
              {results.data.map((fixture) => (
                <ResultCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          </section>
        )}

        {upcoming.data && upcoming.data.length > 0 && (
          <section>
            <SectionHeading eyebrow="Fixtures" title="Upcoming Matches" />
            <div className="space-y-4">
              {upcoming.data.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          </section>
        )}

        {archive.length > 0 && (
          <section>
            <SectionHeading
              eyebrow="History"
              title="TFF Tournament Archive"
              subtitle="Every tournament. Every result. Every champion."
              action={
                <Button asChild variant="secondary" size="sm">
                  <Link to="/tournaments">
                    All Tournaments <ArrowRight className="size-4" />
                  </Link>
                </Button>
              }
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {archive.map((tournament) => {
                const championId = championByTournament.get(tournament.id);
                return (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    championName={championId ? teamMap.get(championId)?.name : null}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div
        className="absolute inset-0 opacity-75"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, oklch(0.62 0.22 25 / 20%), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <p className="label-caps text-primary">Triad Football Federation</p>
        <h1 className="mt-4 text-6xl leading-[0.9] sm:text-8xl">
          TFF <span className="text-gradient-gold">eFOOTBALL</span>
        </h1>
        <p className="font-display mt-4 text-2xl text-silver sm:text-3xl">
          Compete. Conquer. Create History.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-sm text-muted-foreground sm:text-base">
          TFF is a competitive eFootball tournament organization bringing players together through
          organized competitions, intense matches and unforgettable finals.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/tournaments">View Tournaments</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/teams">View Teams</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/champions">Tournament History</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ActiveTournament({
  tournamentId,
  slug,
}: {
  tournamentId?: string | undefined;
  slug?: string | undefined;
}) {
  const tournaments = useQuery({ queryKey: ["tournaments"], queryFn: fetchTournaments });
  const tournament = (tournaments.data ?? []).find((t) => t.id === tournamentId);

  const fixtures = useQuery({
    queryKey: ["fixtures", tournamentId],
    queryFn: () => fetchFixtures(tournamentId!),
    enabled: !!tournamentId,
  });
  const standings = useQuery({
    queryKey: ["standings", tournamentId],
    queryFn: () => fetchStandings(tournamentId!),
    enabled: !!tournamentId,
  });
  const entrants = useQuery({
    queryKey: ["tournament-teams", tournamentId],
    queryFn: () => fetchTournamentTeams(tournamentId!),
    enabled: !!tournamentId,
  });

  if (!tournament || !slug) {
    return (
      <section>
        <SectionHeading eyebrow="Now Playing" title="Current Tournament" />
        <EmptyState
          title="No Active Tournament"
          description="Stay tuned for the next TFF competition."
          action={
            <Button asChild className="mt-2">
              <Link to="/tournaments">Explore Tournament History</Link>
            </Button>
          }
        />
      </section>
    );
  }

  const all = fixtures.data ?? [];
  const played = all.filter((f) => f.status === "completed").length;
  const leaderRow = sortStandings(standings.data ?? [], tournament.tiebreakers)[0];
  const leader = (entrants.data ?? []).find((team) => team.id === leaderRow?.team_id);

  return (
    <section>
      <SectionHeading eyebrow="Now Playing" title="Current Tournament" />
      <div className="panel relative overflow-hidden p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <span
              className="font-display grid size-16 place-items-center rounded-2xl border border-primary/40 text-lg text-primary"
              style={{ background: "var(--gradient-surface)" }}
            >
              TFF
            </span>
            <div>
              <StatusBadge status={tournament.status} />
              <h3 className="mt-2 text-4xl uppercase">{tournament.name}</h3>
              <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {formatDate(tournament.start_date)} — {formatDate(tournament.end_date)}
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/tournament/$slug" params={{ slug }}>
              View Tournament <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="relative mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MiniStat label="Teams" value={entrants.data?.length ?? 0} icon={<Users className="size-4" />} />
              <MiniStat label="Played" value={played} />
              <MiniStat label="Remaining" value={all.length - played} />
              <MiniStat label="Total" value={all.length} />
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span className="label-caps">Progress</span>
                <span>
                  {played} / {all.length} matches
                </span>
              </div>
              <Progress value={all.length ? (played / all.length) * 100 : 0} />
            </div>
          </div>

          <div className="panel flex items-center gap-4 p-5">
            <TeamLogo
              name={leader?.name ?? "TBD"}
              shortName={leader?.short_name}
              color={leader?.team_color}
              logoUrl={leader?.logo_url}
              size="lg"
            />
            <div>
              <p className="label-caps flex items-center gap-1.5 text-primary">
                <Trophy className="size-3.5" /> Current Leader
              </p>
              <p className="font-display mt-1 text-2xl">{leader?.name ?? "To be decided"}</p>
              <p className="text-xs text-muted-foreground">{leaderRow?.points ?? 0} points</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-secondary/40 p-4">
      <p className="label-caps flex items-center gap-1.5 text-muted-foreground">
        {icon} {label}
      </p>
      <p className="font-display mt-1.5 text-3xl">{value}</p>
    </div>
  );
}
