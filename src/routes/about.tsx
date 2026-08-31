import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, ExternalLink, Gamepad2, ShieldCheck, Trophy, Users } from "lucide-react";

import { SectionHeading } from "@/components/tff/ui";
import { Button } from "@/components/ui/button";
import { TrophyRevealCard } from "@/components/tff/trophy-reveal-card";
import danteJrImg from "@/assets/dante_jr.png";
import pabloImg from "@/assets/pablo.png";

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
          {/* Founder 1 - Frieza x pablo */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-zinc-950/90 shadow-xl transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            {/* Media Banner */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900 border-b border-border/50">
              <img
                src={pabloImg}
                alt="Frieza x pablo - TFF Co-Founder"
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

              <div className="absolute top-4 left-4 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-950/85 text-primary border border-primary/30 uppercase tracking-wider backdrop-blur-md shadow-md">
                  <ShieldCheck className="size-3.5 text-primary" /> Co-Founder
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h3 className="text-2xl font-display uppercase tracking-wide text-foreground font-bold group-hover:text-primary transition-colors">
                  Frieza x pablo
                </h3>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mt-1">
                  Founder & Federation Director
                </p>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  Directing federation governance, competitive regulations, and executive organization vision for the Triad Champions League.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                  <Crown className="size-3.5 text-primary" /> Executive Board
                </span>
                <a
                  href="https://www.youtube.com/@FRIEZAXPABLO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all hover:scale-105"
                >
                  <ExternalLink className="size-3" /> YouTube Channel
                </a>
              </div>
            </div>
          </div>

          {/* Founder 2 - Dante Jr */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-zinc-950/90 shadow-xl transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            {/* Media Banner */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900 border-b border-border/50">
              <img
                src={danteJrImg}
                alt="Dante Jr - TFF Co-Founder"
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

              <div className="absolute top-4 left-4 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-950/85 text-primary border border-primary/30 uppercase tracking-wider backdrop-blur-md shadow-md">
                  <ShieldCheck className="size-3.5 text-primary" /> Co-Founder
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h3 className="text-2xl font-display uppercase tracking-wide text-foreground font-bold group-hover:text-primary transition-colors">
                  Dante Jr
                </h3>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mt-1">
                  Founder & Operations Head
                </p>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  Leading tournament operations, live match broadcasts, official streaming, and competitive fixture scheduling.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                  <Crown className="size-3.5 text-primary" /> Executive Board
                </span>
                <a
                  href="https://www.youtube.com/@Dante_JR_7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all hover:scale-105"
                >
                  <ExternalLink className="size-3" /> YouTube Channel
                </a>
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
      {/* TFF Federation Portal */}
    </div>
  );
}
