import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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
  fetchChampions,
  fetchTeams,
  fetchTournaments,
} from "@/lib/tff";

export const Route = createFileRoute("/tournaments")({
  head: () => ({
    meta: [
      { title: "TFF Tournaments | TFF eFootball" },
      {
        name: "description",
        content:
          "Browse every TFF eFootball tournament — live competitions, upcoming events and the complete completed archive with champions.",
      },
      { property: "og:title", content: "TFF Tournaments | TFF eFootball" },
      {
        property: "og:description",
        content: "Live, upcoming and completed TFF eFootball tournaments in one place.",
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

  const tournaments = useQuery({ queryKey: ["tournaments"], queryFn: fetchTournaments });
  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const champions = useQuery({ queryKey: ["champions"], queryFn: fetchChampions });

  const teamMap = new Map((teams.data ?? []).map((t) => [t.id, t]));
  const championMap = new Map(
    (champions.data ?? []).map((c) => [c.tournament_id, c.champion_team_id]),
  );
  const all = tournaments.data ?? [];
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Competitions"
        title="TFF Tournaments"
        subtitle="Every competition organized by TFF, from the first kick-off to the final whistle."
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

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
      </div>

      {filtered.length ? (
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
