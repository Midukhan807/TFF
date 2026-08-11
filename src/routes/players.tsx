import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search as SearchIcon, SlidersHorizontal, User, Shield, Compass, Star, ChevronLeft, ChevronRight, Award } from "lucide-react";

import { fetchPlayers, POSITION_MAP } from "@/lib/tff";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PlayersSearch {
  q?: string;
  position?: string;
  nationality?: string;
  team?: string;
  style?: string;
  minRating?: number;
  page?: number;
}

export const Route = createFileRoute("/players")({
  validateSearch: (search): PlayersSearch => {
    return {
      q: (search.q as string) || undefined,
      position: (search.position as string) || undefined,
      nationality: (search.nationality as string) || undefined,
      team: (search.team as string) || undefined,
      style: (search.style as string) || undefined,
      minRating: search.minRating ? Number(search.minRating) : undefined,
      page: search.page ? Number(search.page) : 1,
    };
  },
  head: () => ({
    meta: [
      { title: "eFootball Player Database | TFF" },
      { name: "description", content: "Explore, filter and search the complete eFootball player database on TFF." }
    ]
  }),
  component: PlayersPage,
});

function PlayersPage() {
  const searchParams = useSearch({ from: "/players" });
  const navigate = useNavigate({ from: "/players" });

  const [localSearch, setLocalSearch] = useState(searchParams.q || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.q || "");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch]);

  // Sync debounced search with query params
  useEffect(() => {
    navigate({
      search: (prev) => ({ ...prev, q: debouncedSearch || undefined, page: 1 }),
    });
  }, [debouncedSearch]);

  const page = searchParams.page || 1;
  const limit = 24;

  const playersQuery = useQuery({
    queryKey: ["players", debouncedSearch, searchParams.position, searchParams.nationality, searchParams.team, searchParams.style, searchParams.minRating, page],
    queryFn: () => fetchPlayers({
      search: debouncedSearch,
      position: searchParams.position,
      nationality: searchParams.nationality,
      team: searchParams.team,
      playingStyle: searchParams.style,
      minRating: searchParams.minRating,
      page,
      limit,
    }),
  });

  const { players = [], totalCount = 0 } = playersQuery.data || {};
  const totalPages = Math.ceil(totalCount / limit);

  // Lists of options for filters
  const positions = ["CF", "SS", "LWF", "RWF", "AMF", "CMF", "LMF", "RMF", "DMF", "CB", "LB", "RB", "GK"];
  const nationalities = ["Argentina", "Brazil", "France", "England", "Spain", "Germany", "Portugal", "Italy", "Norway", "Japan", "South Korea"];
  const teams = ["Manchester Red", "Madrid White", "Barcelona Blaugrana", "München Red", "Paris Blue", "Milano Black", "London Gunners"];
  const playingStyles = ["Goal Poacher", "Creative Playmaker", "Box-to-Box", "Destroyer", "Anchor Man", "Roaming Flank", "Prolific Winger", "Build Up"];

  function handleFilterChange(key: keyof PlayersSearch, value: any) {
    navigate({
      search: (prev) => ({
        ...prev,
        [key]: value || undefined,
        page: 1, // Reset page when changing filter
      }),
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header section */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-border/40 pb-8">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-wider uppercase text-primary">
            eFootball Player Database
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Search, filter, and inspect detailed eFootball player attributes, ratings and specialties.
          </p>
        </div>
        <div className="flex items-center gap-2 self-center sm:self-auto bg-primary/10 border border-primary/20 px-4 py-2 rounded-lg text-primary text-xs font-semibold label-caps">
          <Award className="size-4 animate-pulse" />
          <span>{totalCount.toLocaleString()} Players Loaded</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters Sidebar */}
        <aside className="panel p-5 space-y-6 h-fit bg-secondary/10 border border-border/40 rounded-xl">
          <div className="flex items-center gap-2 pb-4 border-b border-border/50">
            <SlidersHorizontal className="size-4 text-primary" />
            <h2 className="font-bold font-display uppercase tracking-wider text-sm">Database Filters</h2>
          </div>

          {/* Search bar */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Search Name</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="e.g. Messi..."
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          {/* Position Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Position</label>
            <select
              value={searchParams.position || ""}
              onChange={(e) => handleFilterChange("position", e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs outline-none focus:border-primary"
            >
              <option value="">All Positions</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {/* Nationality Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nationality</label>
            <select
              value={searchParams.nationality || ""}
              onChange={(e) => handleFilterChange("nationality", e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs outline-none focus:border-primary"
            >
              <option value="">All Nationalities</option>
              {nationalities.map((nat) => (
                <option key={nat} value={nat}>{nat}</option>
              ))}
            </select>
          </div>

          {/* Team Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Club / Team</label>
            <select
              value={searchParams.team || ""}
              onChange={(e) => handleFilterChange("team", e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs outline-none focus:border-primary"
            >
              <option value="">All Clubs</option>
              {teams.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Playing Style Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Playing Style</label>
            <select
              value={searchParams.style || ""}
              onChange={(e) => handleFilterChange("style", e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs outline-none focus:border-primary"
            >
              <option value="">All Styles</option>
              {playingStyles.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Min Overall Rating</label>
            <select
              value={searchParams.minRating || ""}
              onChange={(e) => handleFilterChange("minRating", e.target.value ? Number(e.target.value) : undefined)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs outline-none focus:border-primary"
            >
              <option value="">Any Rating</option>
              <option value="90">90+ Rated</option>
              <option value="85">85+ Rated</option>
              <option value="80">80+ Rated</option>
              <option value="75">75+ Rated</option>
              <option value="70">70+ Rated</option>
            </select>
          </div>

          {/* Reset Filters */}
          <Button
            variant="ghost"
            onClick={() => {
              setLocalSearch("");
              setDebouncedSearch("");
              navigate({ search: {} });
            }}
            className="w-full text-xs h-9 uppercase tracking-wider border border-border"
          >
            Clear Filters
          </Button>
        </aside>

        {/* Players Grid Area */}
        <div className="space-y-8">
          {playersQuery.isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="panel h-[340px] animate-pulse bg-secondary/15 rounded-xl border border-border/40" />
              ))}
            </div>
          ) : players.length > 0 ? (
            <>
              {/* Grid of Players */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {players.map((p) => {
                  const posStr = p.registered_position !== undefined ? POSITION_MAP[p.registered_position] : "N/A";
                  const rating = p.overall_rating || 60;
                  
                  // Rating color badge styles
                  const ratingColorClass = 
                    rating >= 90 ? "bg-red-500 text-white font-bold" :
                    rating >= 80 ? "bg-amber-500 text-black font-semibold" :
                    rating >= 70 ? "bg-blue-500 text-white" :
                    "bg-zinc-600 text-zinc-300";

                  return (
                    <Link
                      key={p.id}
                      to="/players/$pesId"
                      params={{ pesId: p.id }}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/40 bg-zinc-950/60 p-5 transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:bg-zinc-900/60"
                      style={{
                        boxShadow: `0 4px 20px -2px oklch(0.62 0.22 25 / 0.03)`
                      }}
                    >
                      {/* Glow Background depending on Star Rating */}
                      <div className="absolute inset-0 opacity-10 bg-radial from-primary/30 to-transparent group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />

                      {/* Header block (Position, Rating, Stars) */}
                      <div className="flex justify-between items-start z-10">
                        <div className="flex flex-col gap-1">
                          <span className="font-display font-black text-xs text-primary/95 bg-primary/10 px-2 py-0.5 rounded border border-primary/20 tracking-wider">
                            {posStr}
                          </span>
                          {p.star_rating && (
                            <div className="flex gap-0.5 text-amber-500">
                              {Array.from({ length: p.star_rating }).map((_, i) => (
                                <Star key={i} className="size-2 fill-current" />
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center justify-center font-display rounded-md text-base px-2.5 py-0.5 font-bold ${ratingColorClass}`}>
                          {rating}
                        </div>
                      </div>

                      {/* Player Image Placeholder (eFootball Style) */}
                      <div className="relative my-4 mx-auto flex size-24 items-center justify-center rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/50 shadow-inner group-hover:border-primary/40 transition-colors z-10">
                        <User className="size-12 text-zinc-600 group-hover:text-zinc-500 transition-colors" />
                        
                        {/* Tiny flag/nationality indicator */}
                        {p.nationality && (
                          <span className="absolute bottom-0 right-0 bg-zinc-950 border border-zinc-700/60 text-[9px] px-1.5 py-0.5 rounded font-medium">
                            {p.nationality.slice(0, 3).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Footer block (Name, Team, Playing Style) */}
                      <div className="text-center z-10 space-y-1">
                        <h3 className="font-bold text-sm tracking-wide text-foreground truncate group-hover:text-primary transition-colors">
                          {p.name}
                        </h3>
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          {p.team && (
                            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                              <Shield className="size-2.5 text-zinc-500" />
                              {p.team}
                            </span>
                          )}
                          {p.playing_style && (
                            <span className="text-[9px] text-zinc-400 font-display uppercase tracking-widest">
                              {p.playing_style}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border/40 pt-6">
                  <p className="text-xs text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{((page - 1) * limit) + 1}</span> to{" "}
                    <span className="font-semibold text-foreground">
                      {Math.min(page * limit, totalCount)}
                    </span>{" "}
                    of <span className="font-semibold text-foreground">{totalCount}</span> players
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => navigate({ search: (prev) => ({ ...prev, page: page - 1 }) })}
                      className="h-8 px-3"
                    >
                      <ChevronLeft className="size-4 mr-1" /> Previous
                    </Button>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-muted-foreground">Page</span>
                      <span className="font-semibold text-foreground">{page}</span>
                      <span className="text-muted-foreground">of</span>
                      <span className="font-semibold text-foreground">{totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => navigate({ search: (prev) => ({ ...prev, page: page + 1 }) })}
                      className="h-8 px-3"
                    >
                      Next <ChevronRight className="size-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="panel p-12 text-center border border-dashed border-border rounded-xl">
              <Compass className="size-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold">No players found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Try clearing your search query or adjusting your filters to find players.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
