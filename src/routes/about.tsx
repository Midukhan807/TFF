import { createFileRoute, Link } from "@tanstack/react-router";
import { Gamepad2, Trophy, Users } from "lucide-react";

import { SectionHeading } from "@/components/tff/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Triad Football Federation (TFF) | Triad Champions League" },
      {
        name: "description",
        content:
          "Triad Football Federation (TFF) is the official eFootball tournament organization running the Triad Champions League (TCL), structured leagues, cups, standings and global team rankings.",
      },
      {
        name: "keywords",
        content:
          "Triad Football Federation, TFF, Triad Champions League, TCL, eFootball organization, Triad Football, TFF eFootball",
      },
      { property: "og:title", content: "About Triad Football Federation (TFF)" },
      {
        property: "og:description",
        content: "Who we are, how Triad Football Federation (TFF) competitions work, and how to participate in the Triad Champions League.",
      },
    ],
  }),
  component: AboutPage,
});

const STEPS = [
  {
    title: "Register your team",
    body: "Teams join the TFF database once and keep their identity, colours and full record across every future tournament.",
  },
  {
    title: "Get drawn into fixtures",
    body: "Organizers generate round-robin or knockout schedules automatically, with matchdays and groups where required.",
  },
  {
    title: "Play and report",
    body: "Play your eFootball match, then TFF organizers verify and publish the scoreline for the whole federation to see.",
  },
  {
    title: "Climb and conquer",
    body: "Standings, statistics and global rankings update instantly. Champions are archived in the Hall of Champions forever.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Triad Football Federation"
        title="About TFF"
        subtitle="TFF is a competitive eFootball tournament organization built to bring players together through organized competition."
      />

      <div className="panel p-7 text-sm leading-relaxed text-muted-foreground">
        <p>
          The Triad Football Federation runs structured eFootball competitions with real
          consequences: verified results, transparent standings and permanent records. Every
          tournament we organize is archived in full, so a title won today still counts a decade
          from now.
        </p>
        <p className="mt-4">
          Our mission is simple — intense matches, fair officiating and unforgettable finals. TFF
          handles the scheduling, the tables and the history. You handle the football.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: <Gamepad2 className="size-5" />, label: "Structured Competitions", value: "Leagues, groups & cups" },
          { icon: <Users className="size-5" />, label: "Persistent Teams", value: "One identity, all-time record" },
          { icon: <Trophy className="size-5" />, label: "Permanent History", value: "Champions archived forever" },
        ].map((item) => (
          <div key={item.label} className="panel p-5">
            <span className="text-primary">{item.icon}</span>
            <p className="label-caps mt-3 text-muted-foreground">{item.label}</p>
            <p className="font-display mt-1 text-xl">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="text-3xl">How TFF Tournaments Work</h2>
        <ol className="mt-6 space-y-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="panel flex gap-5 p-5">
              <span className="font-display text-3xl text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-display text-xl">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel mt-14 p-8 text-center">
        <h2 className="text-3xl">Want to compete in TFF?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Entries for TFF tournaments are handled by our organizers. Browse the upcoming
          competitions and reach out to be added to the next draw.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/tournaments">Browse Tournaments</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/teams">View Teams</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
