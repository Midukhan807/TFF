import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Gamepad2, ShieldCheck, Trophy, Users } from "lucide-react";

import { SectionHeading } from "@/components/tff/ui";
import { Button } from "@/components/ui/button";
import { TrophyRevealCard } from "@/components/tff/trophy-reveal-card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Triad Football Federation (TFF) | Triad Champions League" },
      {
        name: "description",
        content:
          "Triad Football Federation (TFF), founded by Frieza x pablo and Dante Jr, is the official eFootball tournament organization running the Triad Champions League (TCL), structured leagues, cups, standings and global team rankings.",
      },
      {
        name: "keywords",
        content:
          "Triad Football Federation, TFF, Triad Champions League, TCL, eFootball organization, Frieza x pablo, Dante Jr, TFF Founders, Triad Football, TFF eFootball",
      },
      { property: "og:title", content: "About Triad Football Federation (TFF)" },
      {
        property: "og:description",
        content: "Who we are, founded by Frieza x pablo and Dante Jr, how Triad Football Federation (TFF) competitions work, and how to participate in the Triad Champions League.",
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
          The Triad Football Federation (TFF), founded by <strong className="text-foreground">Frieza x pablo</strong> and <strong className="text-foreground">Dante Jr</strong>, runs structured eFootball competitions with real
          consequences: verified results, transparent standings and permanent records. Every
          tournament we organize is archived in full, so a title won today still counts a decade
          from now.
        </p>
        <p className="mt-4">
          Our mission is simple — intense matches, fair officiating and unforgettable finals. TFF
          handles the scheduling, the tables and the history. You handle the football.
        </p>
      </div>

      {/* Founders Section */}
      <section className="mt-12">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="size-5 text-primary" />
          <h2 className="text-2xl font-display uppercase tracking-wide">TFF Founders</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          The visionary leaders behind the founding and operation of the Triad Football Federation.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Founder 1 */}
          <div className="panel relative overflow-hidden p-6 transition-all duration-300 hover:border-primary/50 group bg-zinc-950/80">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity">
              <Crown className="size-24 text-primary" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/10 border border-primary/40 text-primary font-display text-2xl shadow-xl">
                FP
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold bg-primary/15 text-primary border border-primary/30 uppercase tracking-wider">
                  <ShieldCheck className="size-3" /> Co-Founder
                </span>
                <h3 className="text-2xl font-display uppercase tracking-wide text-foreground mt-1">
                  Frieza x pablo
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Founder & Federation Director
                </p>
              </div>
            </div>
          </div>

          {/* Founder 2 */}
          <div className="panel relative overflow-hidden p-6 transition-all duration-300 hover:border-primary/50 group bg-zinc-950/80">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity">
              <Crown className="size-24 text-primary" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/10 border border-primary/40 text-primary font-display text-2xl shadow-xl">
                DJ
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold bg-primary/15 text-primary border border-primary/30 uppercase tracking-wider">
                  <ShieldCheck className="size-3" /> Co-Founder
                </span>
                <h3 className="text-2xl font-display uppercase tracking-wide text-foreground mt-1">
                  Dante Jr
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Founder & Operations Head
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
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

      <div className="mt-12">
        <TrophyRevealCard />
      </div>

      <section className="mt-14">
        <h2 className="text-3xl font-display uppercase">How TFF Tournaments Work</h2>
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
        <h2 className="text-3xl font-display uppercase">Want to compete in TFF?</h2>
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
