import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { EmptyState, SectionHeading, TeamCard } from "@/components/tff/ui";
import { Input } from "@/components/ui/input";
import { fetchTeams } from "@/lib/tff";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "TFF Teams | TFF eFootball" },
      {
        name: "description",
        content:
          "The global TFF team database — every side competing in TFF eFootball tournaments, with managers, colours and full career records.",
      },
      { property: "og:title", content: "TFF Teams | TFF eFootball" },
      {
        property: "og:description",
        content: "Every team in the TFF eFootball ecosystem and their tournament history.",
      },
    ],
  }),
  component: TeamsPage,
});

function TeamsPage() {
  const [search, setSearch] = useState("");
  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const filtered = (teams.data ?? []).filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Database"
        title="TFF Teams"
        subtitle="Teams are reusable across every TFF tournament, and keep their complete historical record."
        action={
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search teams..."
            className="max-w-xs"
          />
        }
      />
      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No teams have been registered"
          description="TFF organizers can add teams from the admin panel."
        />
      )}
    </div>
  );
}
