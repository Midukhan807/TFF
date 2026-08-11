import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, User, Shield, Info, Dumbbell, Zap, Target, ShieldAlert, Award, Footprints } from "lucide-react";

import { fetchPlayerById, POSITION_MAP } from "@/lib/tff";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/players/$pesId")({
  head: ({ params }) => ({
    meta: [
      { title: `Player Details | TFF eFootball` },
      { name: "description", content: "View full attributes, stats and skills in the eFootball player database." }
    ]
  }),
  component: PlayerDetailsPage,
});

function PlayerDetailsPage() {
  const { pesId } = Route.useParams();

  const playerQuery = useQuery({
    queryKey: ["player-detail", pesId],
    queryFn: () => fetchPlayerById(pesId),
  });

  const p = playerQuery.data;

  if (playerQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 bg-secondary/20 rounded mx-auto" />
          <div className="panel h-96 bg-secondary/15 rounded-xl border border-border/40" />
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Player not found</h2>
        <p className="text-muted-foreground mt-2">The player with ID {pesId} does not exist in the database.</p>
        <Button asChild className="mt-6">
          <Link to="/players">Back to Database</Link>
        </Button>
      </div>
    );
  }

  const posStr = p.registered_position !== undefined ? POSITION_MAP[p.registered_position] : "N/A";
  const rating = p.overall_rating || 60;

  // Rating badge color mapping
  const ratingColorClass = 
    rating >= 90 ? "bg-red-500 text-white font-bold" :
    rating >= 80 ? "bg-amber-500 text-black font-semibold" :
    rating >= 70 ? "bg-blue-500 text-white" :
    "bg-zinc-600 text-zinc-300";

  // Attributes formatting helper
  const attr = p.attributes || {};
  const attributeGroups = [
    {
      title: "Attacking & Passing",
      icon: <Target className="size-4 text-red-500" />,
      stats: [
        { name: "Offensive Awareness", val: attr.offensive_awareness },
        { name: "Ball Control", val: attr.ball_control },
        { name: "Dribbling", val: attr.dribbling },
        { name: "Tight Possession", val: attr.tight_possession },
        { name: "Low Pass", val: attr.low_pass },
        { name: "Lofted Pass", val: attr.lofted_pass },
        { name: "Finishing", val: attr.finishing },
      ]
    },
    {
      title: "Physicality & Speed",
      icon: <Zap className="size-4 text-amber-500" />,
      stats: [
        { name: "Speed", val: attr.speed },
        { name: "Acceleration", val: attr.acceleration },
        { name: "Kicking Power", val: attr.kicking_power },
        { name: "Jump", val: attr.jump },
        { name: "Physical Contact", val: attr.physical_contact },
        { name: "Balance", val: attr.balance },
        { name: "Stamina", val: attr.stamina },
      ]
    },
    {
      title: "Defending & GK",
      icon: <ShieldAlert className="size-4 text-blue-500" />,
      stats: [
        { name: "Defensive Awareness", val: attr.defensive_awareness },
        { name: "Tackling", val: attr.tackling },
        { name: "Aggression", val: attr.aggression },
        { name: "Heading", val: attr.heading },
      ]
    }
  ];

  // Helper for progress bar colors
  function getProgressColor(val: number) {
    if (val >= 90) return "bg-red-500";
    if (val >= 80) return "bg-amber-500";
    if (val >= 70) return "bg-blue-500";
    return "bg-zinc-500";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      {/* Back button */}
      <div className="mb-6 flex">
        <Button asChild variant="ghost" className="gap-2">
          <Link to="/players">
            <ArrowLeft className="size-4" /> Back to Database
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Player Profile Header Card */}
        <div className="panel p-6 space-y-6 bg-zinc-950/60 border border-border/40 rounded-xl flex flex-col justify-between h-fit relative overflow-hidden lg:col-span-1">
          <div className="absolute inset-0 opacity-10 bg-radial from-primary/30 to-transparent pointer-events-none" />

          {/* Rating Circle & Position */}
          <div className="flex justify-between items-center z-10">
            <span className="font-display font-black text-xs text-primary bg-primary/10 px-3 py-1 rounded border border-primary/20 tracking-wider">
              {posStr}
            </span>
            <div className={`flex items-center justify-center font-display rounded-md text-xl px-3 py-1 font-black ${ratingColorClass}`}>
              {rating}
            </div>
          </div>

          {/* Player Picture placeholder */}
          <div className="my-6 mx-auto flex size-36 items-center justify-center rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/60 shadow-xl relative z-10">
            <User className="size-20 text-zinc-500" />
            {p.nationality && (
              <span className="absolute bottom-0 right-0 bg-zinc-950 border border-zinc-700 text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                {p.nationality.slice(0, 3)}
              </span>
            )}
          </div>

          {/* Player Main Info */}
          <div className="text-center z-10 space-y-3">
            <h2 className="text-2xl font-bold font-display tracking-wide uppercase text-foreground">
              {p.name}
            </h2>
            <div className="flex flex-col items-center justify-center gap-1">
              {p.team && (
                <span className="text-sm text-muted-foreground font-semibold flex items-center gap-1.5">
                  <Shield className="size-4 text-primary" />
                  {p.team}
                </span>
              )}
              {p.playing_style && (
                <span className="text-xs text-zinc-400 font-display uppercase tracking-widest bg-zinc-800/50 px-2 py-0.5 rounded">
                  {p.playing_style}
                </span>
              )}
            </div>
          </div>

          {/* Core Specs Grid */}
          <div className="border-t border-border/50 pt-5 mt-5 grid grid-cols-2 gap-3 text-xs z-10">
            <div className="space-y-1">
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Nationality</span>
              <span className="font-semibold">{p.nationality || "N/A"}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Age</span>
              <span className="font-semibold">{p.age ? `${p.age} years` : "N/A"}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Height / Weight</span>
              <span className="font-semibold">{p.height && p.weight ? `${p.height}cm / ${p.weight}kg` : "N/A"}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Strong Foot</span>
              <span className="font-semibold flex items-center gap-1">
                <Footprints className="size-3.5 text-zinc-400" />
                {p.strong_foot === 1 ? "Left" : "Right"}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Stats Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attributes Section */}
          <div className="panel p-6 bg-zinc-950/60 border border-border/40 rounded-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <Dumbbell className="size-5 text-primary" />
              <h3 className="font-bold font-display uppercase tracking-wider text-base">Player Attributes</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {attributeGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-3">
                  <div className="flex items-center gap-1.5 text-sm font-semibold font-display uppercase tracking-wide text-zinc-300">
                    {group.icon}
                    {group.title}
                  </div>
                  <div className="space-y-2.5">
                    {group.stats.map((stat, sIdx) => {
                      const value = stat.val || 60;
                      return (
                        <div key={sIdx} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground">{stat.name}</span>
                            <span className={`font-semibold ${value >= 90 ? "text-red-500" : value >= 80 ? "text-amber-500" : "text-zinc-300"}`}>
                              {value}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getProgressColor(value)}`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Versions Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Skills Panel */}
            <div className="panel p-6 bg-zinc-950/60 border border-border/40 rounded-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                <Award className="size-5 text-primary" />
                <h3 className="font-bold font-display uppercase tracking-wider text-sm">Player Skills</h3>
              </div>
              {p.skills && p.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {p.skills.map((skill: string, idx: number) => (
                    <span key={idx} className="bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs px-2.5 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No specialized skills listed.</p>
              )}
            </div>

            {/* Game Versions Panel */}
            <div className="panel p-6 bg-zinc-950/60 border border-border/40 rounded-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                <Info className="size-5 text-primary" />
                <h3 className="font-bold font-display uppercase tracking-wider text-sm">Game Versions</h3>
              </div>
              {p.game_versions && p.game_versions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {p.game_versions.map((ver: string, idx: number) => (
                    <span key={idx} className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded label-caps">
                      {ver}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No version presence history available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
