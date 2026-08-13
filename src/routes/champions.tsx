import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ChampionCard } from "@/components/tff/trophy";
import { EmptyState, SectionHeading, StatCard } from "@/components/tff/ui";
import { TeamLogo } from "@/components/tff/branding";
import { fetchChampions, fetchTeams, fetchTournaments } from "@/lib/tff";

export const Route = createFileRoute("/champions")({
  head: () => ({
    meta: [
      { title: "Hall of Champions | Triad Football Federation (TFF) & Triad Champions League" },
      {
        name: "description",
        content:
          "The Triad Football Federation (TFF) Hall of Champions — every official Triad Champions League (TCL) title winner, runner-up, top scorer and MVP player of the tournament.",
      },
      {
        name: "keywords",
        content:
          "Triad Champions League winners, TFF champions, Triad Football Federation Hall of Champions, TCL champions list, eFootball champions",
      },
      { property: "og:title", content: "Hall of Champions | Triad Football Federation (TFF)" },
      {
        property: "og:description",
        content: "Every champion crowned in Triad Football Federation (TFF) and Triad Champions League (TCL) history.",
      },
    ],
  }),
  component: ChampionsPage,
});

function ChampionsPage() {
  const champions = useQuery({ queryKey: ["champions"], queryFn: fetchChampions });
  const tournaments = useQuery({ queryKey: ["tournaments"], queryFn: fetchTournaments });
  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });

  const teamMap = new Map((teams.data ?? []).map((t) => [t.id, t]));
  const tournamentMap = new Map((tournaments.data ?? []).map((t) => [t.id, t]));
  const list = champions.data ?? [];

  const titleCount = new Map<string, number>();
  for (const champion of list) {
    const winnerId = champion.champion_team_id;
    if (!winnerId) continue;
    titleCount.set(winnerId, (titleCount.get(winnerId) ?? 0) + 1);
  }
  const mostDecorated = [...titleCount.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 space-y-10">
      <SectionHeading
        eyebrow="Legacy"
        title="Hall of Champions"
        subtitle="Completed TFF tournaments are preserved forever. These are the sides that made history."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Tournaments Won" value={list.length} />
        <StatCard label="Different Champions" value={titleCount.size} />
        <StatCard
          label="Most Decorated"
          value={
            <span className="text-2xl">
              {mostDecorated[0] ? (teamMap.get(mostDecorated[0][0])?.name ?? "—") : "—"}
            </span>
          }
          hint={mostDecorated[0] ? `${mostDecorated[0][1]} title(s)` : undefined}
        />
      </div>

      {list.length ? (
        <div className="space-y-6">
          {list.map((champion, index) => {
            const tournament = tournamentMap.get(champion.tournament_id);
            if (!tournament) return null;
            return (
              <ChampionCard
                key={champion.id}
                tournament={tournament}
                champion={champion}
                teams={teamMap}
                featured={index === 0}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No champions yet"
          description="No TFF tournament has been completed yet. The first champion is still to be crowned."
        />
      )}

      {mostDecorated.length > 1 && (
        <section className="mt-14">
          <h2 className="mb-4 text-2xl">Title Leaderboard</h2>
          <div className="panel divide-y divide-border/50">
            {mostDecorated.map(([teamId, count], index) => {
              const team = teamMap.get(teamId);
              return (
                <div key={teamId} className="flex items-center gap-4 px-5 py-4">
                  <span className="font-display w-6 text-muted-foreground">{index + 1}</span>
                  <TeamLogo
                    name={team?.name ?? "Team"}
                    shortName={team?.short_name}
                    color={team?.team_color}
                    logoUrl={team?.logo_url}
                    size="sm"
                  />
                  <span className="flex-1 font-semibold">{team?.name}</span>
                  <span className="font-display text-2xl text-primary">{count}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
