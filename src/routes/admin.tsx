import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Settings, Users, Trophy, CalendarDays, Loader2, ArrowLeft, Edit, Trash2, Crown, BarChart3 } from "lucide-react";
import { toast } from "sonner";

import { useIsAdmin } from "@/hooks/use-tff-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchTeams,
  fetchTournaments,
  fetchFixtures,
  fetchTournamentTeams,
  fetchRankingConfig,
  fetchChampions,
  fetchPlayerStats,
  calculateTournamentMVP,
  sortStandings,
  getTeamFoundedYear,
  setTeamFoundedYear,
  getTeamVideoLogo,
  setTeamVideoLogo,
  getManualStandings,
  saveManualStandings,
  getTournamentAwards,
  saveTournamentAwards,
  parseResultPenalties,
  getMatchWinner,
  type RankingConfig,
} from "@/lib/tff";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel | TFF eFootball" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { session, isAdmin, loading: authLoading } = useIsAdmin();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("tournaments");

  // Queries
  const teamsQuery = useQuery({ queryKey: ["teams-admin"], queryFn: fetchTeams });
  const tournamentsQuery = useQuery({ queryKey: ["tournaments-admin"], queryFn: fetchTournaments });
  const configQuery = useQuery({ queryKey: ["ranking-config"], queryFn: fetchRankingConfig });

  // Mutations
  const createTeamMutation = useMutation({
    mutationFn: async (newTeam: any) => {
      const { founded_year, logo_video_url, ...rest } = newTeam;
      let res = await supabase.from("teams").insert([{ ...newTeam, is_demo: false }]).select();
      if (res.error && (res.error.message.includes("founded_year") || res.error.message.includes("logo_video_url"))) {
        const fallbackObj: any = { ...newTeam, is_demo: false };
        if (res.error.message.includes("founded_year")) delete fallbackObj.founded_year;
        if (res.error.message.includes("logo_video_url")) delete fallbackObj.logo_video_url;
        res = await supabase.from("teams").insert([fallbackObj]).select();
      }
      if (res.error) throw res.error;
      if (res.data?.[0]?.id) {
        if (founded_year) setTeamFoundedYear(res.data[0].id, founded_year);
        if (logo_video_url) setTeamVideoLogo(res.data[0].id, logo_video_url);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams-admin"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Team created successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create team.");
    },
  });

  const createTournamentMutation = useMutation({
    mutationFn: async (newTourney: { name: string; format: string; season_year: number; points_win: number; points_draw: number; points_loss: number; description?: string; logo_url?: string | null }) => {
      const slug = newTourney.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { data, error } = await supabase.from("tournaments").insert([{
        ...newTourney,
        slug,
        status: "draft",
        is_demo: false,
      }]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments-admin"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast.success("Tournament created successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create tournament.");
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (updated: Partial<RankingConfig>) => {
      const { error } = await supabase.from("ranking_settings").update(updated).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ranking-config"] });
      toast.success("Settings updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update settings.");
    },
  });

  useEffect(() => {
    if (!authLoading && (!session || !isAdmin)) {
      navigate({ to: "/auth", replace: true });
    }
  }, [authLoading, session, isAdmin, navigate]);

  if (authLoading || !session || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between border-b border-border/70 pb-5 mb-8">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-wide">TFF Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your tournaments, teams, fixtures, and results
          </p>
        </div>
        <Button variant="ghost" onClick={() => navigate({ to: "/" })}>
          <ArrowLeft className="mr-2 size-4" /> Exit Panel
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 max-w-3xl">
          <TabsTrigger value="tournaments" className="flex items-center gap-2">
            <Trophy className="size-4" /> Tournaments
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="size-4" /> Teams
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center gap-2">
            <CalendarDays className="size-4" /> Matches
          </TabsTrigger>
          <TabsTrigger value="standings" className="flex items-center gap-2">
            <BarChart3 className="size-4" /> Standings
          </TabsTrigger>
          <TabsTrigger value="champions" className="flex items-center gap-2">
            <Crown className="size-4" /> Champions
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="size-4" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tournaments" className="space-y-6">
          <TournamentTabContent tournaments={tournamentsQuery.data || []} teams={teamsQuery.data || []} onCreate={createTournamentMutation.mutateAsync} />
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <TeamTabContent teams={teamsQuery.data || []} onCreate={createTeamMutation.mutateAsync} />
        </TabsContent>

        <TabsContent value="matches" className="space-y-6">
          <MatchesTabContent tournaments={tournamentsQuery.data || []} />
        </TabsContent>

        <TabsContent value="standings" className="space-y-6">
          <StandingsTabContent
            tournaments={tournamentsQuery.data || []}
            teams={teamsQuery.data || []}
            onSelectTab={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="champions" className="space-y-6">
          <ChampionsTabContent
            tournaments={tournamentsQuery.data || []}
            teams={teamsQuery.data || []}
            onSelectTab={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SettingsTabContent config={configQuery.data} onUpdate={updateConfigMutation.mutateAsync} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TeamTabContent({ teams, onCreate }: { teams: any[]; onCreate: any }) {
  const [editingTeam, setEditingTeam] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [color, setColor] = useState("#D4A017");
  const [manager, setManager] = useState("");
  const [foundedYear, setFoundedYear] = useState<number>(new Date().getFullYear());
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoVideoUrl, setLogoVideoUrl] = useState("");
  const [logoVideoFile, setLogoVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Populate form fields when starting to edit
  function startEdit(team: any) {
    setEditingTeam(team);
    setName(team.name);
    setShortName(team.short_name);
    setColor(team.team_color);
    setManager(team.manager_name || "");
    setFoundedYear(getTeamFoundedYear(team));
    setLogoFile(null);
    setLogoVideoUrl(getTeamVideoLogo(team) || "");
    setLogoVideoFile(null);
  }

  // Reset form states
  function resetForm() {
    setEditingTeam(null);
    setName("");
    setShortName("");
    setColor("#D4A017");
    setManager("");
    setFoundedYear(new Date().getFullYear());
    setLogoFile(null);
    setLogoVideoUrl("");
    setLogoVideoFile(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !shortName) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      let logoUrl = editingTeam?.logo_url || null;
      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("logos")
          .upload(filePath, logoFile);

        if (uploadError) {
          toast.error("Failed to upload logo image: " + uploadError.message);
          setLoading(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("logos")
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      let videoUrl = logoVideoUrl.trim() || null;
      if (logoVideoFile) {
        const fileExt = logoVideoFile.name.split(".").pop();
        const fileName = `vid_${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: videoUploadErr } = await supabase.storage
          .from("logos")
          .upload(filePath, logoVideoFile);

        if (!videoUploadErr) {
          const { data: { publicUrl } } = supabase.storage
            .from("logos")
            .getPublicUrl(filePath);
          videoUrl = publicUrl;
        }
      }

      if (editingTeam) {
        setTeamFoundedYear(editingTeam.id, foundedYear);
        setTeamVideoLogo(editingTeam.id, videoUrl);

        let updatePayload: any = {
          name,
          short_name: shortName,
          team_color: color,
          manager_name: manager,
          logo_url: logoUrl,
          founded_year: foundedYear,
          logo_video_url: videoUrl,
        };

        let { error: updateError } = await supabase
          .from("teams")
          .update(updatePayload)
          .eq("id", editingTeam.id);

        if (
          updateError &&
          (updateError.message.includes("founded_year") || updateError.message.includes("logo_video_url"))
        ) {
          if (updateError.message.includes("founded_year")) delete updatePayload.founded_year;
          if (updateError.message.includes("logo_video_url")) delete updatePayload.logo_video_url;
          const { error: retryError } = await supabase
            .from("teams")
            .update(updatePayload)
            .eq("id", editingTeam.id);
          if (retryError) throw retryError;
        } else if (updateError) {
          throw updateError;
        }

        toast.success("Team updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["teams-admin"] });
        queryClient.invalidateQueries({ queryKey: ["teams"] });
      } else {
        const createdTeam = await onCreate({
          name,
          short_name: shortName,
          team_color: color,
          manager_name: manager,
          logo_url: logoUrl,
          founded_year: foundedYear,
          logo_video_url: videoUrl,
        });
        if (createdTeam?.id && videoUrl) {
          setTeamVideoLogo(createdTeam.id, videoUrl);
        }
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(teamId: string) {
    if (!confirm("Are you sure you want to delete this team?")) return;
    try {
      const { error } = await supabase.from("teams").delete().eq("id", teamId);
      if (error) throw error;
      toast.success("Team deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["teams-admin"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      if (editingTeam?.id === teamId) {
        resetForm();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete team.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <div className="panel p-6 space-y-4 h-fit">
        <h2 className="text-xl font-bold font-display tracking-wider">
          {editingTeam ? "Edit Team" : "Register Team"}
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground label-caps">Team Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Manchester Red" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground label-caps">Short Name (3 letters)</label>
            <Input required maxLength={3} value={shortName} onChange={(e) => setShortName(e.target.value.toUpperCase())} placeholder="e.g. MNR" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground label-caps">Team Color</label>
            <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 p-1" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground label-caps">Manager Name</label>
            <Input value={manager} onChange={(e) => setManager(e.target.value)} placeholder="e.g. Sir Alex" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground label-caps">Founded Year</label>
            <input
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              value={foundedYear}
              onChange={(e) => setFoundedYear(parseInt(e.target.value) || new Date().getFullYear())}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              placeholder="e.g. 2020"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground label-caps">
              {editingTeam ? "Replace Static Team Logo" : "Team Logo Image"}
            </label>
            <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="cursor-pointer" />
          </div>
          <div className="space-y-2 border-t border-border/50 pt-3">
            <label className="text-xs text-muted-foreground label-caps flex items-center gap-1.5 text-primary">
              🎬 Animated Logo Video (MP4)
            </label>
            <Input
              type="file"
              accept="video/mp4,video/webm"
              onChange={(e) => setLogoVideoFile(e.target.files?.[0] || null)}
              className="cursor-pointer text-xs"
            />
            <Input
              placeholder="Or enter Video URL (e.g. /Video Project 16.mp4)"
              value={logoVideoUrl}
              onChange={(e) => setLogoVideoUrl(e.target.value)}
              className="h-8 text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Plays animation when hovering over team card.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="animate-spin size-4 mr-2" /> : (editingTeam ? <Settings className="size-4 mr-2" /> : <Plus className="size-4 mr-2" />)}
              {editingTeam ? "Save Changes" : "Add Team"}
            </Button>
            {editingTeam && (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="panel p-6 space-y-4">
        <h2 className="text-xl font-bold font-display tracking-wider">All Teams ({teams.length})</h2>
        <div className="divide-y divide-border/50 max-h-[500px] overflow-y-auto pr-2">
          {teams.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="size-4 rounded-full border border-border" style={{ backgroundColor: t.team_color }} />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">Manager: {t.manager_name || "None"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm text-primary bg-primary/10 px-2 py-0.5 rounded">{t.short_name}</span>
                <Button size="icon" variant="ghost" onClick={() => startEdit(t)} title="Edit team">
                  <Edit className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(t.id)} title="Delete team">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ TOURNAMENTS TAB ----------------------------- */
function TournamentTabContent({ tournaments, teams, onCreate }: { tournaments: any[]; teams: any[]; onCreate: any }) {
  const [name, setName] = useState("");
  const [format, setFormat] = useState("single_round_robin");
  const [year, setYear] = useState(new Date().getFullYear());
  const [ptsWin, setPtsWin] = useState(3);
  const [ptsDraw, setPtsDraw] = useState(1);
  const [ptsLoss, setPtsLoss] = useState(0);
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingTourney, setEditingTourney] = useState<any>(null);

  // States for adding teams to a tournament
  const [selectedTourney, setSelectedTourney] = useState<any>(null);
  const [associatedTeams, setAssociatedTeams] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // States for editing champions
  const [editingChampionsTourney, setEditingChampionsTourney] = useState<any>(null);
  const [championTeamId, setChampionTeamId] = useState<string>("");
  const [runnerUpTeamId, setRunnerUpTeamId] = useState<string>("");
  const [thirdPlaceTeamId, setThirdPlaceTeamId] = useState<string>("");
  const [finalScore, setFinalScore] = useState<string>("");
  const [mvp, setMvp] = useState<string>("");
  const [topScorer, setTopScorer] = useState<string>("");

  const activeTourneyTeamsQuery = useQuery({
    queryKey: ["tourney-teams-admin", selectedTourney?.id],
    queryFn: () => fetchTournamentTeams(selectedTourney.id),
    enabled: !!selectedTourney,
  });

  const championsTourneyTeamsQuery = useQuery({
    queryKey: ["tourney-teams-champions", editingChampionsTourney?.id],
    queryFn: () => fetchTournamentTeams(editingChampionsTourney.id),
    enabled: !!editingChampionsTourney,
  });

  const championsQuery = useQuery({
    queryKey: ["champions-admin", editingChampionsTourney?.id],
    queryFn: async () => {
      const { data } = await supabase.from("champions").select("*").eq("tournament_id", editingChampionsTourney.id).maybeSingle();
      return data;
    },
    enabled: !!editingChampionsTourney,
  });

  const tourneyPlayerStatsQuery = useQuery({
    queryKey: ["player-stats-admin", editingChampionsTourney?.id],
    queryFn: () => fetchPlayerStats(editingChampionsTourney.id),
    enabled: !!editingChampionsTourney,
  });

  useEffect(() => {
    if (championsQuery.data) {
      setChampionTeamId(championsQuery.data.champion_team_id || "");
      setRunnerUpTeamId(championsQuery.data.runner_up_team_id || "");
      setThirdPlaceTeamId(championsQuery.data.third_place_team_id || "");
      setFinalScore(championsQuery.data.final_score || "");
      setMvp(championsQuery.data.mvp || "");
      setTopScorer(championsQuery.data.top_scorer || "");
    } else {
      setChampionTeamId("");
      setRunnerUpTeamId("");
      setThirdPlaceTeamId("");
      setFinalScore("");
      setMvp("");
      setTopScorer("");
    }
  }, [championsQuery.data, editingChampionsTourney]);

  async function uploadFile(file: File, bucket: string): Promise<string | null> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
    if (uploadError) throw new Error(uploadError.message);
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrl;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name) { toast.error("Tournament name is required."); return; }
    setLoading(true);
    try {
      let logoUrl: string | null = null;
      let bannerUrl: string | null = null;
      if (logoFile) logoUrl = await uploadFile(logoFile, "logos");
      if (bannerFile) bannerUrl = await uploadFile(bannerFile, "logos");
      await onCreate({
        name, format, season_year: year,
        points_win: ptsWin, points_draw: ptsDraw, points_loss: ptsLoss,
        description: description || null,
        logo_url: logoUrl,
        banner_url: bannerUrl,
      });
      setName(""); setDescription(""); setLogoFile(null); setBannerFile(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to create tournament.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTeam(teamId: string) {
    if (!selectedTourney) return;
    try {
      const { error } = await supabase.from("tournament_teams").insert([
        { tournament_id: selectedTourney.id, team_id: teamId }
      ]);
      if (error) throw error;
      toast.success("Team added to tournament!");
      queryClient.invalidateQueries({ queryKey: ["tourney-teams-admin", selectedTourney.id] });
    } catch (err: any) {
      toast.error(err.message || "Failed to add team.");
    }
  }

  async function handleRemoveTeam(teamId: string) {
    if (!selectedTourney) return;
    try {
      const { error } = await supabase
        .from("tournament_teams")
        .delete()
        .eq("tournament_id", selectedTourney.id)
        .eq("team_id", teamId);
      if (error) throw error;
      toast.success("Team removed from tournament!");
      queryClient.invalidateQueries({ queryKey: ["tourney-teams-admin", selectedTourney.id] });
    } catch (err: any) {
      toast.error(err.message || "Failed to remove team.");
    }
  }

  function startEditTourney(t: any) {
    setEditingTourney(t);
    setName(t.name);
    setFormat(t.format);
    setYear(t.season_year || new Date().getFullYear());
    setPtsWin(t.points_win ?? 3);
    setPtsDraw(t.points_draw ?? 1);
    setPtsLoss(t.points_loss ?? 0);
    setDescription(t.description || "");
    setLogoFile(null);
    setSelectedTourney(null);
    setEditingChampionsTourney(null);
  }

  function resetTourneyForm() {
    setEditingTourney(null);
    setName("");
    setFormat("single_round_robin");
    setYear(new Date().getFullYear());
    setPtsWin(3);
    setPtsDraw(1);
    setPtsLoss(0);
    setDescription("");
    setLogoFile(null);
    setBannerFile(null);
  }

  async function handleDeleteTourney(tourneyId: string) {
    if (!confirm("Delete this tournament? This will also remove associated data.")) return;
    try {
      const { error } = await supabase.from("tournaments").delete().eq("id", tourneyId);
      if (error) throw error;
      toast.success("Tournament deleted!");
      queryClient.invalidateQueries({ queryKey: ["tournaments-admin"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      if (editingTourney?.id === tourneyId) resetTourneyForm();
      if (selectedTourney?.id === tourneyId) setSelectedTourney(null);
      if (editingChampionsTourney?.id === tourneyId) setEditingChampionsTourney(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete tournament.");
    }
  }

  async function handleUpdateTourney(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTourney) return;
    setLoading(true);
    try {
      let logoUrl = editingTourney.logo_url;
      let bannerUrl = editingTourney.banner_url;
      if (logoFile) logoUrl = await uploadFile(logoFile, "logos");
      if (bannerFile) bannerUrl = await uploadFile(bannerFile, "logos");
      const { error } = await supabase.from("tournaments").update({
        name, format, season_year: year, points_win: ptsWin, points_draw: ptsDraw, points_loss: ptsLoss,
        description: description || null, logo_url: logoUrl, banner_url: bannerUrl,
      }).eq("id", editingTourney.id);
      if (error) throw error;
      toast.success("Tournament updated!");
      queryClient.invalidateQueries({ queryKey: ["tournaments-admin"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      resetTourneyForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to update tournament.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(tourneyId: string, newStatus: string) {
    try {
      const { error } = await supabase.from("tournaments").update({ status: newStatus }).eq("id", tourneyId);
      if (error) throw error;
      toast.success(`Status updated to ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ["tournaments-admin"] });
      if (selectedTourney?.id === tourneyId) {
        setSelectedTourney({ ...selectedTourney, status: newStatus });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    }
  }

  async function handleSaveChampions(e: React.FormEvent) {
    e.preventDefault();
    if (!editingChampionsTourney) return;
    setLoading(true);
    try {
      const payload = {
        tournament_id: editingChampionsTourney.id,
        champion_team_id: championTeamId || null,
        runner_up_team_id: runnerUpTeamId || null,
        third_place_team_id: thirdPlaceTeamId || null,
        final_score: finalScore || null,
        mvp: mvp || null,
        top_scorer: topScorer || null,
      };

      if (championsQuery.data?.id) {
        const { error } = await supabase.from("champions").update(payload).eq("id", championsQuery.data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("champions").insert([payload]);
        if (error) throw error;
      }

      toast.success("Champions configuration saved!");
      queryClient.invalidateQueries({ queryKey: ["champions"] });
      queryClient.invalidateQueries({ queryKey: ["champions-admin", editingChampionsTourney.id] });
      setEditingChampionsTourney(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save champions.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <div className="panel p-6 space-y-4 h-fit">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display tracking-wider">
            {editingTourney ? "Edit Tournament" : "Create Tournament"}
          </h2>
          {editingTourney && (
            <Button type="button" size="sm" variant="ghost" onClick={resetTourneyForm}>Cancel</Button>
          )}
        </div>
        <form onSubmit={editingTourney ? handleUpdateTourney : handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground label-caps">Name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. TFF League Season 5" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground label-caps">Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
              <option value="single_round_robin">Single Round Robin</option>
              <option value="double_round_robin">Double Round Robin</option>
              <option value="knockout">Knockout</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground label-caps">Season Year</label>
            <Input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground label-caps">Win Pts</label>
              <Input type="number" value={ptsWin} onChange={(e) => setPtsWin(parseInt(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground label-caps">Draw Pts</label>
              <Input type="number" value={ptsDraw} onChange={(e) => setPtsDraw(parseInt(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground label-caps">Loss Pts</label>
              <Input type="number" value={ptsLoss} onChange={(e) => setPtsLoss(parseInt(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground label-caps">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief summary of the tournament..."
              className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground label-caps">Poster / Cover Image <span className="text-muted-foreground/60">(shown on tournament card)</span></label>
            <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="cursor-pointer" />
            {editingTourney?.logo_url && !logoFile && (
              <p className="text-xs text-muted-foreground">Current: <a href={editingTourney.logo_url} target="_blank" rel="noreferrer" className="underline text-primary">view</a></p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground label-caps">Header Banner <span className="text-muted-foreground/60">(wide image shown at top of tournament page)</span></label>
            <Input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} className="cursor-pointer" />
            {editingTourney?.banner_url && !bannerFile && (
              <p className="text-xs text-muted-foreground">Current: <a href={editingTourney.banner_url} target="_blank" rel="noreferrer" className="underline text-primary">view</a></p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin size-4 mr-2" /> : <Plus className="size-4 mr-2" />}
            Create Tournament
          </Button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="panel p-6 space-y-4">
          <h2 className="text-xl font-bold font-display tracking-wider">All Tournaments</h2>
          <div className="divide-y divide-border/50 max-h-[300px] overflow-y-auto pr-2">
            {tournaments.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground uppercase">{t.format.replace(/_/g, " ")} | Season: {t.season_year}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select value={t.status} onChange={(e) => updateStatus(t.id, e.target.value)} className="h-8 px-2 rounded-md border border-input bg-background text-xs">
                    <option value="draft">Draft</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                  </select>
                  <Button size="sm" variant="secondary" onClick={() => { setSelectedTourney(t); setEditingChampionsTourney(null); setEditingTourney(null); }}>
                    Teams
                  </Button>
                  <Button size="sm" variant="outline" className="border-primary/40 hover:bg-primary/10" onClick={() => { setEditingChampionsTourney(t); setSelectedTourney(null); setEditingTourney(null); }}>
                    Champions
                  </Button>
                  <Button size="icon" variant="ghost" className="size-8" onClick={() => startEditTourney(t)} title="Edit tournament">
                    <Edit className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="size-8 hover:text-destructive" onClick={() => handleDeleteTourney(t.id)} title="Delete tournament">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedTourney && (
          <div className="panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display tracking-wider">Manage Teams - {selectedTourney.name}</h2>
              <Button size="sm" variant="ghost" onClick={() => setSelectedTourney(null)}>Close</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-xs text-muted-foreground label-caps mb-2">Available Teams</h3>
                <div className="border border-border/70 rounded-md divide-y divide-border/50 max-h-[250px] overflow-y-auto p-2 space-y-1 bg-secondary/20">
                  {teams.filter(t => !activeTourneyTeamsQuery.data?.some(at => at.id === t.id)).map(t => (
                    <div key={t.id} className="flex items-center justify-between py-1 text-sm">
                      <span>{t.name}</span>
                      <Button size="xs" onClick={() => handleAddTeam(t.id)}>Add</Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs text-muted-foreground label-caps mb-2">Registered Teams</h3>
                <div className="border border-border/70 rounded-md divide-y divide-border/50 max-h-[250px] overflow-y-auto p-2 space-y-1 bg-secondary/20">
                  {activeTourneyTeamsQuery.data?.map(t => (
                    <div key={t.id} className="flex items-center justify-between py-1 text-sm">
                      <span>{t.name}</span>
                      <Button size="xs" variant="destructive" onClick={() => handleRemoveTeam(t.id)}>Remove</Button>
                    </div>
                  ))}
                  {!activeTourneyTeamsQuery.data?.length && (
                    <p className="text-xs text-muted-foreground p-2">No teams registered yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {editingChampionsTourney && (
          <div className="panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display tracking-wider">Set Champions - {editingChampionsTourney.name}</h2>
              <Button size="sm" variant="ghost" onClick={() => setEditingChampionsTourney(null)}>Close</Button>
            </div>

            <form onSubmit={handleSaveChampions} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground label-caps">Champion Team</label>
                  <select value={championTeamId} onChange={(e) => setChampionTeamId(e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="">Select Champion</option>
                    {championsTourneyTeamsQuery.data?.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground label-caps">Runner Up</label>
                  <select value={runnerUpTeamId} onChange={(e) => setRunnerUpTeamId(e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="">Select Runner Up</option>
                    {championsTourneyTeamsQuery.data?.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground label-caps">Third Place</label>
                  <select value={thirdPlaceTeamId} onChange={(e) => setThirdPlaceTeamId(e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="">Select Third Place (Optional)</option>
                    {championsTourneyTeamsQuery.data?.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground label-caps">Final Match Score</label>
                  <Input value={finalScore} onChange={(e) => setFinalScore(e.target.value)} placeholder="e.g. 2-1 or 3-2 (PEN)" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground label-caps">Tournament MVP (Player Name)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const stats = tourneyPlayerStatsQuery.data || [];
                        const result = calculateTournamentMVP(stats, championTeamId);
                        if (result) {
                          setMvp(result.player.player_name);
                          toast.success(`Auto-calculated MVP: ${result.player.player_name} (Score: ${result.score})!`);
                        } else {
                          toast.info("No player statistics recorded for this tournament yet.");
                        }
                      }}
                      className="text-[10px] text-purple-400 font-bold uppercase hover:underline flex items-center gap-1"
                    >
                      ⚡ Auto-Calculate MVP
                    </button>
                  </div>
                  <Input value={mvp} onChange={(e) => setMvp(e.target.value)} placeholder="e.g. Messi" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground label-caps">Top Scorer (Player Name)</label>
                  <Input value={topScorer} onChange={(e) => setTopScorer(e.target.value)} placeholder="e.g. Ronaldo" />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="animate-spin size-4 mr-2" />}
                  Save Champions Data
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------- MATCHES TAB -------------------------------- */
function MatchesTabContent({ tournaments }: { tournaments: any[] }) {
  const [selectedTourneyId, setSelectedTourneyId] = useState("");
  const [activeStageTab, setActiveStageTab] = useState<"league" | "knockout">("league");
  const queryClient = useQueryClient();

  const fixturesQuery = useQuery({
    queryKey: ["fixtures-admin", selectedTourneyId],
    queryFn: () => fetchFixtures(selectedTourneyId),
    enabled: !!selectedTourneyId,
  });

  const tourneyTeamsQuery = useQuery({
    queryKey: ["tourney-teams-admin", selectedTourneyId],
    queryFn: () => fetchTournamentTeams(selectedTourneyId),
    enabled: !!selectedTourneyId,
  });

  // State for recording scores
  const [selectedFixture, setSelectedFixture] = useState<any>(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [homePenalties, setHomePenalties] = useState(0);
  const [awayPenalties, setAwayPenalties] = useState(0);
  const [enablePenalties, setEnablePenalties] = useState(false);
  const [homeYellow, setHomeYellow] = useState(0);
  const [awayYellow, setAwayYellow] = useState(0);
  const [homeRed, setHomeRed] = useState(0);
  const [awayRed, setAwayRed] = useState(0);

  // State for adding a fixture manually
  const [newStage, setNewStage] = useState<"league" | "knockout">("league");
  const [newRound, setNewRound] = useState<string>("Semi Final");
  const [newHomeId, setNewHomeId] = useState("");
  const [newAwayId, setNewAwayId] = useState("");
  const [newMatchday, setNewMatchday] = useState(1);

  // Generate schedule using proper circle/Berger-table round-robin
  async function generateSchedule() {
    if (!selectedTourneyId || !tourneyTeamsQuery.data?.length) return;
    const teams = tourneyTeamsQuery.data;
    if (teams.length < 2) {
      toast.error("You need at least 2 teams in the tournament to generate a schedule.");
      return;
    }

    try {
      toast.info("Generating Round Robin schedule...");
      const list = [...teams];
      if (list.length % 2 !== 0) list.push(null as any);
      const totalTeams = list.length;
      const rounds = totalTeams - 1;
      const matchesPerRound = totalTeams / 2;

      const rotation = list.slice(1);
      const matchdayFixtures: any[] = [];

      for (let round = 0; round < rounds; round++) {
        const current = [list[0], ...rotation];
        for (let i = 0; i < matchesPerRound; i++) {
          const home = current[i];
          const away = current[totalTeams - 1 - i];
          if (home && away) {
            matchdayFixtures.push({
              tournament_id: selectedTourneyId,
              matchday: round + 1,
              home_team_id: home.id,
              away_team_id: away.id,
              stage: "league",
              status: "scheduled",
            });
          }
        }
        rotation.unshift(rotation.pop()!);
      }

      const { error } = await supabase.from("fixtures").insert(matchdayFixtures);
      if (error) throw error;
      toast.success(`Schedule generated: ${rounds} matchdays, ${matchdayFixtures.length} fixtures!`);
      setActiveStageTab("league");
      queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate schedule.");
    }
  }

  // Generate Top 4 Knockout Bracket (Single Leg or Two-Legged Home & Away)
  async function generateTop4Knockout(isTwoLegged = false) {
    if (!selectedTourneyId || !tourneyTeamsQuery.data?.length) return;
    const teams = tourneyTeamsQuery.data;
    if (teams.length < 2) {
      toast.error("You need at least 2 teams to generate a Knockout Bracket.");
      return;
    }

    try {
      toast.info(`Generating Top 4 Knockout Bracket (${isTwoLegged ? "Two-Legged Aggregate" : "Single Leg"})...`);
      const standingsData = await fetchStandings(selectedTourneyId).catch(() => []);
      const sortedTeams = standingsData.length > 0
        ? standingsData.map((s: any) => teams.find((t: any) => t.id === s.team_id)).filter(Boolean)
        : teams;

      const team1 = sortedTeams[0] || teams[0];
      const team2 = sortedTeams[1] || teams[1];
      const team3 = sortedTeams[2] || teams[2] || null;
      const team4 = sortedTeams[3] || teams[3] || null;

      let knockoutFixtures: any[] = [];

      if (isTwoLegged) {
        knockoutFixtures = [
          {
            tournament_id: selectedTourneyId,
            home_team_id: team1?.id || null,
            away_team_id: team4?.id || null,
            stage: "knockout",
            round: "Semi Final - 1st Leg",
            bracket_slot: 1,
            status: "scheduled",
          },
          {
            tournament_id: selectedTourneyId,
            home_team_id: team4?.id || null,
            away_team_id: team1?.id || null,
            stage: "knockout",
            round: "Semi Final - 2nd Leg",
            bracket_slot: 2,
            status: "scheduled",
          },
          {
            tournament_id: selectedTourneyId,
            home_team_id: team2?.id || null,
            away_team_id: team3?.id || null,
            stage: "knockout",
            round: "Semi Final - 1st Leg",
            bracket_slot: 3,
            status: "scheduled",
          },
          {
            tournament_id: selectedTourneyId,
            home_team_id: team3?.id || null,
            away_team_id: team2?.id || null,
            stage: "knockout",
            round: "Semi Final - 2nd Leg",
            bracket_slot: 4,
            status: "scheduled",
          },
          {
            tournament_id: selectedTourneyId,
            home_team_id: null,
            away_team_id: null,
            stage: "knockout",
            round: "Final - 1st Leg",
            bracket_slot: 5,
            status: "scheduled",
          },
          {
            tournament_id: selectedTourneyId,
            home_team_id: null,
            away_team_id: null,
            stage: "knockout",
            round: "Final - 2nd Leg",
            bracket_slot: 6,
            status: "scheduled",
          },
        ];
      } else {
        knockoutFixtures = [
          {
            tournament_id: selectedTourneyId,
            home_team_id: team1?.id || null,
            away_team_id: team4?.id || null,
            stage: "knockout",
            round: "Semi Final",
            bracket_slot: 1,
            status: "scheduled",
          },
          {
            tournament_id: selectedTourneyId,
            home_team_id: team2?.id || null,
            away_team_id: team3?.id || null,
            stage: "knockout",
            round: "Semi Final",
            bracket_slot: 2,
            status: "scheduled",
          },
          {
            tournament_id: selectedTourneyId,
            home_team_id: null,
            away_team_id: null,
            stage: "knockout",
            round: "Third Place",
            bracket_slot: 3,
            status: "scheduled",
          },
          {
            tournament_id: selectedTourneyId,
            home_team_id: null,
            away_team_id: null,
            stage: "knockout",
            round: "Final",
            bracket_slot: 4,
            status: "scheduled",
          },
        ];
      }

      const { error } = await supabase.from("fixtures").insert(knockoutFixtures);
      if (error) throw error;
      toast.success(`Knockout Bracket generated (${isTwoLegged ? "Two-Legged Home & Away" : "Single Leg"})!`);
      setActiveStageTab("knockout");
      queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate knockout bracket.");
    }
  }

  function openScoreDialog(f: any) {
    setSelectedFixture(f);
    setHomeScore(f.result?.home_score || 0);
    setAwayScore(f.result?.away_score || 0);
    setHomeYellow(f.result?.home_yellow_cards || 0);
    setAwayYellow(f.result?.away_yellow_cards || 0);
    setHomeRed(f.result?.home_red_cards || 0);
    setAwayRed(f.result?.away_red_cards || 0);

    const { homePen, awayPen } = parseResultPenalties(f.result);
    setHomePenalties(homePen !== null ? homePen : 0);
    setAwayPenalties(awayPen !== null ? awayPen : 0);
    setEnablePenalties(homePen !== null || awayPen !== null || f.stage === "knockout" || !!f.round);
  }

  async function addFixture() {
    if (newHomeId && newAwayId && newHomeId === newAwayId) {
      toast.error("Home and Away teams must be different.");
      return;
    }
    try {
      const { error } = await supabase.from("fixtures").insert([{
        tournament_id: selectedTourneyId,
        matchday: newStage === "league" ? newMatchday : null,
        home_team_id: newHomeId || null,
        away_team_id: newAwayId || null,
        stage: newStage,
        round: newStage === "knockout" ? newRound : null,
        status: "scheduled",
      }]);
      if (error) throw error;
      toast.success(`Added ${newStage === "knockout" ? newRound : `Matchday ${newMatchday}`} fixture!`);
      setNewHomeId(""); setNewAwayId("");
      if (newStage === "knockout") setActiveStageTab("knockout");
      queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
    } catch (err: any) {
      toast.error(err.message || "Failed to add fixture.");
    }
  }

  async function deleteFixture(fixtureId: string) {
    if (!confirm("Delete this fixture?")) return;
    try {
      await supabase.from("results").delete().eq("fixture_id", fixtureId);
      const { error } = await supabase.from("fixtures").delete().eq("id", fixtureId);
      if (error) throw error;
      toast.success("Fixture deleted.");
      if (selectedFixture?.id === fixtureId) setSelectedFixture(null);
      queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete fixture.");
    }
  }

  async function deleteAllFixtures() {
    if (!selectedTourneyId || !fixturesQuery.data?.length) return;
    if (!confirm(`Delete ALL ${fixturesQuery.data.length} fixtures for this tournament? This cannot be undone.`)) return;
    try {
      const ids = fixturesQuery.data.map((f) => f.id);
      await supabase.from("results").delete().in("fixture_id", ids);
      const { error } = await supabase.from("fixtures").delete().eq("tournament_id", selectedTourneyId);
      if (error) throw error;
      toast.success("All fixtures deleted.");
      setSelectedFixture(null);
      queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
      queryClient.invalidateQueries({ queryKey: ["all-standings"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete all fixtures.");
    }
  }

  async function handleRecordScore(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFixture) return;
    try {
      const { data: existingResult } = await supabase
        .from("results")
        .select("id")
        .eq("fixture_id", selectedFixture.id)
        .maybeSingle();

      let notesPayload: string | null = null;
      if (enablePenalties || (homeScore === awayScore && (homePenalties > 0 || awayPenalties > 0))) {
        notesPayload = JSON.stringify({
          home_penalties: homePenalties,
          away_penalties: awayPenalties,
        });
      }

      const resultPayload = {
        fixture_id: selectedFixture.id,
        home_score: homeScore,
        away_score: awayScore,
        home_yellow_cards: homeYellow,
        away_yellow_cards: awayYellow,
        home_red_cards: homeRed,
        away_red_cards: awayRed,
        notes: notesPayload,
      };

      if (existingResult) {
        let res = await supabase.from("results").update(resultPayload).eq("id", existingResult.id);
        if (res.error) {
          res = await supabase.from("results").update({ home_score: homeScore, away_score: awayScore }).eq("id", existingResult.id);
        }
        if (res.error) throw res.error;
      } else {
        let res = await supabase.from("results").insert([resultPayload]);
        if (res.error) {
          res = await supabase.from("results").insert([{ fixture_id: selectedFixture.id, home_score: homeScore, away_score: awayScore }]);
        }
        if (res.error) throw res.error;
      }

      const { error: fixError } = await supabase
        .from("fixtures")
        .update({ status: "completed" })
        .eq("id", selectedFixture.id);
      if (fixError) throw fixError;

      // If manual standings exist for this tournament, accumulate cards directly into manual standings as well
      if (selectedTourneyId && (homeYellow > 0 || awayYellow > 0 || homeRed > 0 || awayRed > 0)) {
        const manual = getManualStandings(selectedTourneyId);
        if (manual.length > 0) {
          const updated = manual.map((row) => {
            if (row.team_id === selectedFixture.home_team_id) {
              return {
                ...row,
                yellow_cards: (Number(row.yellow_cards) || 0) + homeYellow,
                red_cards: (Number(row.red_cards) || 0) + homeRed,
              };
            }
            if (row.team_id === selectedFixture.away_team_id) {
              return {
                ...row,
                yellow_cards: (Number(row.yellow_cards) || 0) + awayYellow,
                red_cards: (Number(row.red_cards) || 0) + awayRed,
              };
            }
            return row;
          });
          saveManualStandings(selectedTourneyId, updated);
        }
      }

      toast.success("Score and card stats recorded successfully!");
      setSelectedFixture(null);
      queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
      queryClient.invalidateQueries({ queryKey: ["all-standings"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
      queryClient.invalidateQueries({ queryKey: ["standings-admin", selectedTourneyId] });
    } catch (err: any) {
      toast.error(err.message || "Failed to record score.");
    }
  }

  async function handleResetScore() {
    if (!selectedFixture) return;
    if (!confirm("Reset this match score? It will mark the match as scheduled/unplayed again.")) return;
    try {
      await supabase.from("results").delete().eq("fixture_id", selectedFixture.id);
      const { error: fixError } = await supabase
        .from("fixtures")
        .update({ status: "scheduled" })
        .eq("id", selectedFixture.id);
      if (fixError) throw fixError;

      toast.success("Match reset to scheduled (unplayed)!");
      setSelectedFixture(null);
      queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
      queryClient.invalidateQueries({ queryKey: ["all-standings"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
      queryClient.invalidateQueries({ queryKey: ["standings-admin", selectedTourneyId] });
    } catch (err: any) {
      toast.error(err.message || "Failed to reset match.");
    }
  }

  const allFixtures = fixturesQuery.data || [];
  const leagueFixtures = allFixtures.filter((f) => f.stage !== "knockout" && !f.round);
  const knockoutFixtures = allFixtures.filter((f) => f.stage === "knockout" || !!f.round);

  const KNOCKOUT_ROUNDS = [
    "Round of 16",
    "Quarter Final",
    "Quarter Final - 1st Leg",
    "Quarter Final - 2nd Leg",
    "Semi Final",
    "Semi Final - 1st Leg",
    "Semi Final - 2nd Leg",
    "Third Place",
    "Final",
    "Final - 1st Leg",
    "Final - 2nd Leg",
  ];

  return (
    <div className="panel p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <label className="text-xs text-muted-foreground label-caps">Select Tournament</label>
          <select
            value={selectedTourneyId}
            onChange={(e) => {
              setSelectedTourneyId(e.target.value);
              setSelectedFixture(null);
            }}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm font-semibold"
          >
            <option value="">-- Choose Tournament --</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {selectedTourneyId && (
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={generateSchedule} variant="outline" size="sm" className="gap-1">
              ⚽ Auto-Generate Round Robin
            </Button>
          </div>
        )}
      </div>

      {selectedTourneyId && (
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display tracking-wider">Tournament Fixtures</h3>
              {allFixtures.length > 0 && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={deleteAllFixtures}
                  className="gap-1"
                >
                  <Trash2 className="size-3.5" /> Delete All Fixtures
                </Button>
              )}
            </div>

            {/* Add Fixture Form */}
            <div className="panel p-4 space-y-3 border-dashed border-primary/40 bg-primary/5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-primary label-caps uppercase tracking-wider">Add Fixture Manually</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStage("league")}
                    className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${newStage === "league" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                  >
                    ⚽ League / Round Robin
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStage("knockout")}
                    className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${newStage === "knockout" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                  >
                    🏆 Knockout Stage
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 items-end">
                {newStage === "league" ? (
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase font-semibold">Matchday #</label>
                    <input
                      type="number" min={1} value={newMatchday}
                      onChange={(e) => setNewMatchday(parseInt(e.target.value) || 1)}
                      className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase font-semibold">Knockout Round</label>
                    <select
                      value={newRound}
                      onChange={(e) => setNewRound(e.target.value)}
                      className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm font-semibold"
                    >
                      <option value="Semi Final">Semi Final (Single Leg)</option>
                      <option value="Semi Final - 1st Leg">Semi Final - 1st Leg</option>
                      <option value="Semi Final - 2nd Leg">Semi Final - 2nd Leg</option>
                      <option value="Quarter Final">Quarter Final (Single Leg)</option>
                      <option value="Quarter Final - 1st Leg">Quarter Final - 1st Leg</option>
                      <option value="Quarter Final - 2nd Leg">Quarter Final - 2nd Leg</option>
                      <option value="Final">Final 🏆 (Single Leg)</option>
                      <option value="Final - 1st Leg">Final - 1st Leg 🏆</option>
                      <option value="Final - 2nd Leg">Final - 2nd Leg 🏆</option>
                      <option value="Third Place">3rd Place Match</option>
                      <option value="Round of 16">Round of 16</option>
                    </select>
                  </div>
                )}

                <div className="sm:col-span-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-semibold">Home Team</label>
                  <select value={newHomeId} onChange={(e) => setNewHomeId(e.target.value)} className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm">
                    <option value="">-- TBD / Select Home --</option>
                    {tourneyTeamsQuery.data?.map((t: any) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-semibold">Away Team</label>
                  <select value={newAwayId} onChange={(e) => setNewAwayId(e.target.value)} className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm">
                    <option value="">-- TBD / Select Away --</option>
                    {tourneyTeamsQuery.data?.map((t: any) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-2">
                  <Button className="w-full h-9" size="sm" onClick={addFixture}>
                    <Plus className="size-3.5 mr-1" /> Add {newStage === "knockout" ? newRound : `Matchday ${newMatchday}`} Match
                  </Button>
                </div>
              </div>
            </div>

            {/* Stage View Filter Tabs */}
            <div className="flex border-b border-border">
              <button
                type="button"
                onClick={() => setActiveStageTab("league")}
                className={`py-2 px-4 text-sm font-semibold border-b-2 transition-colors ${activeStageTab === "league" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                ⚽ Round Robin Matches ({leagueFixtures.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveStageTab("knockout")}
                className={`py-2 px-4 text-sm font-semibold border-b-2 transition-colors ${activeStageTab === "knockout" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                🏆 Knockout Bracket & Finals ({knockoutFixtures.length})
              </button>
            </div>

            {/* Matchday / Knockout Grouped Tables */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {activeStageTab === "league" ? (
                leagueFixtures.length > 0 ? (
                  [...new Set(leagueFixtures.map((f) => f.matchday ?? 0))]
                    .sort((a, b) => a - b)
                    .map((matchday) => {
                      const group = leagueFixtures.filter((f) => (f.matchday ?? 0) === matchday);
                      return (
                        <div key={matchday} className="border border-border/60 rounded-lg overflow-hidden">
                          <div className="bg-secondary/30 px-4 py-2 flex items-center justify-between">
                            <span className="font-display text-sm font-bold tracking-wider text-primary">MATCHDAY {matchday}</span>
                            <span className="text-xs text-zinc-500">{group.length} match{group.length !== 1 ? "es" : ""}</span>
                          </div>
                          <table className="w-full text-sm">
                            <tbody className="divide-y divide-border/30">
                              {group.map((f) => (
                                <tr key={f.id} className="hover:bg-secondary/10 transition-colors">
                                  <td className="px-4 py-2.5 text-right font-semibold w-[35%]">{f.home?.name || "TBD"}</td>
                                  <td className="px-2 py-2.5 text-center w-[12%]">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${f.status === "completed"
                                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                      : "bg-primary/20 text-primary"
                                      }`}>
                                      {f.status === "completed"
                                        ? (() => {
                                          const { homePen, awayPen } = parseResultPenalties(f.result);
                                          return homePen !== null && awayPen !== null
                                            ? `${f.result?.home_score}-${f.result?.away_score} (${homePen}-${awayPen}p)`
                                            : `${f.result?.home_score} - ${f.result?.away_score}`;
                                        })()
                                        : "VS"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2.5 text-left font-semibold w-[35%]">{f.away?.name || "TBD"}</td>
                                  <td className="px-2 py-2.5 text-right w-[18%]">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button
                                        size="sm" variant="secondary"
                                        className="h-7 text-xs px-2"
                                        onClick={() => openScoreDialog(f)}
                                      >
                                        {f.status === "completed" ? "Edit" : "Score"}
                                      </Button>
                                      <Button size="icon" variant="ghost" className="size-7 hover:text-destructive" onClick={() => deleteFixture(f.id)}>
                                        <Trash2 className="size-3" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-xs text-muted-foreground p-6 text-center">No round robin league fixtures yet. Click "Auto-Generate Round Robin" or add manually above.</p>
                )
              ) : (
                knockoutFixtures.length > 0 ? (
                  [...new Set([...KNOCKOUT_ROUNDS, ...knockoutFixtures.map((f) => f.round).filter(Boolean)])]
                    .filter((r) => knockoutFixtures.some((f) => f.round === r))
                    .map((roundName) => {
                      const group = knockoutFixtures.filter((f) => f.round === roundName);
                      return (
                        <div key={roundName} className="border border-primary/40 rounded-lg overflow-hidden bg-primary/5">
                          <div className="bg-primary/20 px-4 py-2 flex items-center justify-between border-b border-primary/30">
                            <span className="font-display text-sm font-bold tracking-wider text-primary uppercase">{roundName}</span>
                            <span className="text-xs text-primary/80 font-semibold">{group.length} match{group.length !== 1 ? "es" : ""}</span>
                          </div>
                          <table className="w-full text-sm">
                            <tbody className="divide-y divide-border/30">
                              {group.map((f) => (
                                <tr key={f.id} className="hover:bg-primary/10 transition-colors">
                                  <td className="px-4 py-2.5 text-right font-semibold w-[35%]">{f.home?.name || "TBD"}</td>
                                  <td className="px-2 py-2.5 text-center w-[12%]">
                                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${f.status === "completed"
                                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                      : "bg-primary/20 text-primary border border-primary/30"
                                      }`}>
                                      {f.status === "completed"
                                        ? (() => {
                                          const { homePen, awayPen } = parseResultPenalties(f.result);
                                          return homePen !== null && awayPen !== null
                                            ? `${f.result?.home_score}-${f.result?.away_score} (${homePen}-${awayPen}p)`
                                            : `${f.result?.home_score} - ${f.result?.away_score}`;
                                        })()
                                        : "VS"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2.5 text-left font-semibold w-[35%]">{f.away?.name || "TBD"}</td>
                                  <td className="px-2 py-2.5 text-right w-[18%]">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button
                                        size="sm" variant="secondary"
                                        className="h-7 text-xs px-2 border border-primary/40"
                                        onClick={() => openScoreDialog(f)}
                                      >
                                        {f.status === "completed" ? "Edit" : "Score"}
                                      </Button>
                                      <Button size="icon" variant="ghost" className="size-7 hover:text-destructive" onClick={() => deleteFixture(f.id)}>
                                        <Trash2 className="size-3" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-xs text-muted-foreground p-6 text-center">No knockout fixtures yet. Click "Auto-Generate Top 4 Knockout" or select "Knockout Stage" in the manual form above.</p>
                )
              )}
            </div>
          </div>

          {selectedFixture && (
            <div className="panel p-6 space-y-4 h-fit border-primary/40">
              <h3 className="text-lg font-bold font-display tracking-wider">
                Record Score — {selectedFixture.stage === "knockout" ? selectedFixture.round : `Matchday ${selectedFixture.matchday}`}
              </h3>
              <form onSubmit={handleRecordScore} className="space-y-4">
                {/* Home Team Inputs */}
                <div className="space-y-2 p-3 border border-border/70 rounded-lg bg-secondary/20">
                  <label className="text-xs font-bold text-primary label-caps block">{selectedFixture.home?.name || "Home Team (TBD)"}</label>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted-foreground uppercase font-semibold">Goals Scored</label>
                    <Input type="number" min={0} required value={homeScore} onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] text-yellow-400 uppercase font-semibold flex items-center gap-1">🟨 Yellow Cards</label>
                      <Input type="number" min={0} value={homeYellow} onChange={(e) => setHomeYellow(parseInt(e.target.value) || 0)} className="h-8 text-xs border-yellow-500/40 bg-yellow-500/10 text-yellow-400" />
                    </div>
                    <div>
                      <label className="text-[10px] text-red-400 uppercase font-semibold flex items-center gap-1">🟥 Red Cards</label>
                      <Input type="number" min={0} value={homeRed} onChange={(e) => setHomeRed(parseInt(e.target.value) || 0)} className="h-8 text-xs border-red-500/40 bg-red-500/10 text-red-400" />
                    </div>
                  </div>
                </div>

                {/* Away Team Inputs */}
                <div className="space-y-2 p-3 border border-border/70 rounded-lg bg-secondary/20">
                  <label className="text-xs font-bold text-primary label-caps block">{selectedFixture.away?.name || "Away Team (TBD)"}</label>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted-foreground uppercase font-semibold">Goals Scored</label>
                    <Input type="number" min={0} required value={awayScore} onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] text-yellow-400 uppercase font-semibold flex items-center gap-1">🟨 Yellow Cards</label>
                      <Input type="number" min={0} value={awayYellow} onChange={(e) => setAwayYellow(parseInt(e.target.value) || 0)} className="h-8 text-xs border-yellow-500/40 bg-yellow-500/10 text-yellow-400" />
                    </div>
                    <div>
                      <label className="text-[10px] text-red-400 uppercase font-semibold flex items-center gap-1">🟥 Red Cards</label>
                      <Input type="number" min={0} value={awayRed} onChange={(e) => setAwayRed(parseInt(e.target.value) || 0)} className="h-8 text-xs border-red-500/40 bg-red-500/10 text-red-400" />
                    </div>
                  </div>
                </div>

                {/* Penalty Shootout Section (Knockout Tiebreaker) */}
                <div className="p-3 border border-amber-500/40 rounded-lg bg-amber-500/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      🏆 Penalty Shootout (Tiebreaker)
                    </label>
                    <input
                      type="checkbox"
                      checked={enablePenalties}
                      onChange={(e) => setEnablePenalties(e.target.checked)}
                      className="size-4 rounded accent-primary cursor-pointer"
                    />
                  </div>
                  {enablePenalties && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] text-amber-300 font-semibold uppercase">{selectedFixture.home?.short_name || "Home"} Penalties</label>
                        <Input type="number" min={0} value={homePenalties} onChange={(e) => setHomePenalties(parseInt(e.target.value) || 0)} className="h-8 text-xs border-amber-500/40 bg-amber-500/20 text-amber-300 font-bold" />
                      </div>
                      <div>
                        <label className="text-[10px] text-amber-300 font-semibold uppercase">{selectedFixture.away?.short_name || "Away"} Penalties</label>
                        <Input type="number" min={0} value={awayPenalties} onChange={(e) => setAwayPenalties(parseInt(e.target.value) || 0)} className="h-8 text-xs border-amber-500/40 bg-amber-500/20 text-amber-300 font-bold" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <Button type="submit" className="w-full">Save Score & Cards</Button>
                  <div className="flex gap-2">
                    {selectedFixture.status === "completed" && (
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 text-destructive border-destructive/40 hover:bg-destructive/10"
                        onClick={handleResetScore}
                      >
                        Reset Match (Unplay)
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      className={selectedFixture.status === "completed" ? "" : "w-full"}
                      onClick={() => setSelectedFixture(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SettingsTabContent({ config, onUpdate }: { config: any; onUpdate: any }) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config) {
      setYoutubeUrl(config.youtube_live_url || "");
    }
  }, [config]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate({ youtube_live_url: youtubeUrl });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl panel p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display tracking-wider">Global Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure global streaming and tournament configurations</p>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground label-caps">YouTube Live Stream / Video URL</label>
          <Input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="e.g. https://www.youtube.com/watch?v=... or channel URL"
          />
          <p className="text-[0.7rem] text-muted-foreground">
            Paste any active YouTube Live Stream link, video URL, or your channel link. The home page banner will automatically embed and link to it.
          </p>
        </div>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin size-4 mr-2" />}
          Save Settings
        </Button>
      </form>
    </div>
  );
}

/* ---------------------------- STANDINGS TAB ----------------------------- */
function StandingsTabContent({ tournaments, teams, onSelectTab }: { tournaments: any[]; teams: any[]; onSelectTab?: (tab: string) => void }) {
  const [selectedTourneyId, setSelectedTourneyId] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewTourney, setShowNewTourney] = useState(false);
  const [newTourneyName, setNewTourneyName] = useState("");
  const [newTourneyYear, setNewTourneyYear] = useState<number>(2025);

  const queryClient = useQueryClient();

  const standingsQuery = useQuery({
    queryKey: ["standings-admin", selectedTourneyId],
    queryFn: () => fetchStandings(selectedTourneyId),
    enabled: !!selectedTourneyId,
  });

  // Sync rows when query loads or tournament selection changes
  useEffect(() => {
    if (!selectedTourneyId) {
      setRows([]);
      return;
    }
    if (standingsQuery.data && standingsQuery.data.length > 0) {
      const sorted = [...standingsQuery.data].sort(
        (a, b) => b.points - a.points || b.goal_difference - a.goal_difference || b.goals_for - a.goals_for
      );
      setRows(sorted);
    } else {
      const initial = teams.map((t) => ({
        tournament_id: selectedTourneyId,
        team_id: t.id,
        played: 0, wins: 0, draws: 0, losses: 0,
        goals_for: 0, goals_against: 0, goal_difference: 0,
        yellow_cards: 0, red_cards: 0,
        points: 0,
      }));
      setRows(initial);
    }
  }, [selectedTourneyId, standingsQuery.data, teams]);

  function deleteRow(index: number) {
    setRows(rows.filter((_, i) => i !== index));
  }

  function updateRowField(index: number, field: string, value: any) {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "goals_for" || field === "goals_against") {
      const gf = field === "goals_for" ? Number(value) : Number(updated[index].goals_for || 0);
      const ga = field === "goals_against" ? Number(value) : Number(updated[index].goals_against || 0);
      updated[index].goal_difference = gf - ga;
    }
    if (field === "wins" || field === "draws") {
      const w = field === "wins" ? Number(value) : Number(updated[index].wins || 0);
      const d = field === "draws" ? Number(value) : Number(updated[index].draws || 0);
      updated[index].points = w * 3 + d * 1;
    }
    setRows(updated);
  }

  async function handleCreatePastTournament(e: React.FormEvent) {
    e.preventDefault();
    if (!newTourneyName.trim()) { toast.error("Enter tournament name."); return; }
    setLoading(true);
    try {
      const trimmedName = newTourneyName.trim();
      const baseSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      // Check if tournament already exists
      const existing = tournaments.find(
        (t) => t.slug === baseSlug || t.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (existing) {
        toast.info(`"${existing.name}" already exists! Selected automatically.`);
        setSelectedTourneyId(existing.id);
        setShowNewTourney(false);
        setNewTourneyName("");
        return;
      }

      const slug = baseSlug || `tcl-${Date.now()}`;
      const { data, error } = await supabase.from("tournaments").insert([{
        name: trimmedName,
        slug,
        season_year: newTourneyYear,
        status: "completed",
        format: "single_round_robin",
        points_win: 3, points_draw: 1, points_loss: 0,
        organizer: "TFF",
        is_demo: false,
      }]).select().single();

      if (error) {
        if (error.code === "23505" || error.message.includes("unique constraint")) {
          const uniqueSlug = `${slug}-${Date.now().toString().slice(-4)}`;
          const { data: retryData, error: retryError } = await supabase.from("tournaments").insert([{
            name: trimmedName,
            slug: uniqueSlug,
            season_year: newTourneyYear,
            status: "completed",
            format: "single_round_robin",
            points_win: 3, points_draw: 1, points_loss: 0,
            organizer: "TFF",
            is_demo: false,
          }]).select().single();

          if (retryError) throw retryError;
          toast.success(`Created ${retryData.name}!`);
          await queryClient.invalidateQueries({ queryKey: ["tournaments-admin"] });
          await queryClient.invalidateQueries({ queryKey: ["tournaments"] });
          setSelectedTourneyId(retryData.id);
          setShowNewTourney(false);
          setNewTourneyName("");
          return;
        }
        throw error;
      }

      toast.success(`Created ${data.name}!`);
      await queryClient.invalidateQueries({ queryKey: ["tournaments-admin"] });
      await queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      setSelectedTourneyId(data.id);
      setShowNewTourney(false);
      setNewTourneyName("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create tournament.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTourneyId) {
      toast.error("Select a tournament first.");
      return;
    }
    setLoading(true);
    try {
      const validRows = rows.filter((r) => r.team_id).map((r) => ({
        tournament_id: selectedTourneyId,
        team_id: r.team_id,
        group_id: null,
        played: Number(r.played) || 0,
        wins: Number(r.wins) || 0,
        draws: Number(r.draws) || 0,
        losses: Number(r.losses) || 0,
        goals_for: Number(r.goals_for) || 0,
        goals_against: Number(r.goals_against) || 0,
        goal_difference: Number(r.goal_difference) || 0,
        yellow_cards: Number(r.yellow_cards) || 0,
        red_cards: Number(r.red_cards) || 0,
        points: Number(r.points) || 0,
      }));

      // Save to manual standings storage (bypasses PostgreSQL view insert constraint)
      saveManualStandings(selectedTourneyId, validRows);

      // Associate teams with tournament_teams in Supabase DB
      for (const r of validRows) {
        await supabase.from("tournament_teams").upsert(
          [{ tournament_id: selectedTourneyId, team_id: r.team_id }],
          { onConflict: "tournament_id,team_id" }
        );
      }

      toast.success("Standings table saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["standings-admin", selectedTourneyId] });
      queryClient.invalidateQueries({ queryKey: ["standings", selectedTourneyId] });
      queryClient.invalidateQueries({ queryKey: ["all-standings"] });
      queryClient.invalidateQueries({ queryKey: ["tourney-teams-admin", selectedTourneyId] });
    } catch (err: any) {
      toast.error(err.message || "Failed to save standings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="size-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold font-display tracking-wider">Tournament Standings Editor</h2>
            <p className="text-sm text-muted-foreground">Directly edit or import final standings table for any tournament</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowNewTourney(!showNewTourney)}
            className="gap-1.5"
          >
            <Plus className="size-4" /> Add Past Tournament
          </Button>
        </div>
      </div>

      {/* Quick Add Past Tournament Form */}
      {showNewTourney && (
        <div className="panel p-5 space-y-4 border-primary/40 bg-primary/5">
          <h3 className="text-sm font-bold font-display tracking-wider text-primary uppercase">Create Past Tournament Record</h3>
          <form onSubmit={handleCreatePastTournament} className="grid gap-3 sm:grid-cols-3 items-end">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[10px] text-muted-foreground uppercase font-semibold">Tournament Name</label>
              <Input
                required
                placeholder="e.g. TCL SEASON 1"
                value={newTourneyName}
                onChange={(e) => setNewTourneyName(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[10px] text-muted-foreground uppercase font-semibold">Season / Year</label>
              <input
                type="number"
                min={2015}
                max={2030}
                value={newTourneyYear}
                onChange={(e) => setNewTourneyYear(parseInt(e.target.value) || 2025)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              />
            </div>
            <div className="flex gap-2 sm:col-span-1">
              <Button type="submit" size="sm" disabled={loading} className="flex-1">
                {loading && <Loader2 className="animate-spin size-3.5 mr-1" />}
                Add & Continue
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewTourney(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Select Tournament */}
      <div className="panel p-6 space-y-4">
        <div className="space-y-1 max-w-md">
          <label className="text-xs text-muted-foreground label-caps">Select Tournament</label>
          <select
            value={selectedTourneyId}
            onChange={(e) => setSelectedTourneyId(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-semibold"
          >
            <option value="">— Choose Tournament —</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.season_year || "Past"})
              </option>
            ))}
          </select>
        </div>

        {selectedTourneyId && (
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="overflow-x-auto border border-border/70 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/40 text-xs font-semibold label-caps text-muted-foreground border-b border-border/60">
                    <th className="px-3 py-2 text-left w-8">#</th>
                    <th className="px-3 py-2 text-left min-w-[180px]">Team</th>
                    <th className="px-2 py-2 text-center w-14">P</th>
                    <th className="px-2 py-2 text-center w-14">W</th>
                    <th className="px-2 py-2 text-center w-14">D</th>
                    <th className="px-2 py-2 text-center w-14">L</th>
                    <th className="px-2 py-2 text-center w-16">GF</th>
                    <th className="px-2 py-2 text-center w-16">GA</th>
                    <th className="px-2 py-2 text-center w-16">GD</th>
                    <th className="px-2 py-2 text-center w-14 text-yellow-400" title="Yellow Cards">YC</th>
                    <th className="px-2 py-2 text-center w-14 text-red-400" title="Red Cards">RC</th>
                    <th className="px-2 py-2 text-center w-20">PTS</th>
                    <th className="px-2 py-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-3 py-2 text-muted-foreground font-display text-base">{idx + 1}</td>
                      <td className="px-3 py-2 font-semibold">
                        <select
                          value={row.team_id}
                          onChange={(e) => updateRowField(idx, "team_id", e.target.value)}
                          className="w-full h-8 px-2 rounded border border-input bg-background text-xs font-semibold"
                        >
                          <option value="">— Select Team —</option>
                          {teams.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-1 py-2 text-center">
                        <input
                          type="number" min={0} value={row.played ?? 0}
                          onChange={(e) => updateRowField(idx, "played", e.target.value)}
                          className="w-12 h-8 text-center rounded border border-input bg-background text-xs font-semibold"
                        />
                      </td>
                      <td className="px-1 py-2 text-center">
                        <input
                          type="number" min={0} value={row.wins ?? 0}
                          onChange={(e) => updateRowField(idx, "wins", e.target.value)}
                          className="w-12 h-8 text-center rounded border border-input bg-background text-xs font-semibold text-green-400"
                        />
                      </td>
                      <td className="px-1 py-2 text-center">
                        <input
                          type="number" min={0} value={row.draws ?? 0}
                          onChange={(e) => updateRowField(idx, "draws", e.target.value)}
                          className="w-12 h-8 text-center rounded border border-input bg-background text-xs font-semibold text-yellow-400"
                        />
                      </td>
                      <td className="px-1 py-2 text-center">
                        <input
                          type="number" min={0} value={row.losses ?? 0}
                          onChange={(e) => updateRowField(idx, "losses", e.target.value)}
                          className="w-12 h-8 text-center rounded border border-input bg-background text-xs font-semibold text-red-400"
                        />
                      </td>
                      <td className="px-1 py-2 text-center">
                        <input
                          type="number" value={row.goals_for ?? 0}
                          onChange={(e) => updateRowField(idx, "goals_for", e.target.value)}
                          className="w-14 h-8 text-center rounded border border-input bg-background text-xs font-semibold"
                        />
                      </td>
                      <td className="px-1 py-2 text-center">
                        <input
                          type="number" value={row.goals_against ?? 0}
                          onChange={(e) => updateRowField(idx, "goals_against", e.target.value)}
                          className="w-14 h-8 text-center rounded border border-input bg-background text-xs font-semibold"
                        />
                      </td>
                      <td className="px-1 py-2 text-center font-bold text-xs">
                        {row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}
                      </td>
                      <td className="px-1 py-2 text-center">
                        <input
                          type="number" min={0} value={row.yellow_cards ?? 0}
                          onChange={(e) => updateRowField(idx, "yellow_cards", e.target.value)}
                          className="w-12 h-8 text-center rounded border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 text-xs font-semibold"
                        />
                      </td>
                      <td className="px-1 py-2 text-center">
                        <input
                          type="number" min={0} value={row.red_cards ?? 0}
                          onChange={(e) => updateRowField(idx, "red_cards", e.target.value)}
                          className="w-12 h-8 text-center rounded border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-semibold"
                        />
                      </td>
                      <td className="px-1 py-2 text-center">
                        <input
                          type="number" min={0} value={row.points ?? 0}
                          onChange={(e) => updateRowField(idx, "points", e.target.value)}
                          className="w-16 h-8 text-center rounded border border-primary/40 bg-primary/10 text-primary font-bold text-sm"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteRow(idx)}
                          className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete row"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setRows([
                    ...rows,
                    {
                      tournament_id: selectedTourneyId,
                      team_id: "",
                      played: 0, wins: 0, draws: 0, losses: 0,
                      goals_for: 0, goals_against: 0, goal_difference: 0,
                      yellow_cards: 0, red_cards: 0,
                      points: 0,
                    },
                  ])
                }
              >
                + Add Row
              </Button>

              <Button type="submit" disabled={loading} size="lg">
                {loading && <Loader2 className="animate-spin size-4 mr-2" />}
                Save Standings Table
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------------------------- CHAMPIONS TAB ----------------------------- */
function ChampionsTabContent({ tournaments, teams, onSelectTab }: { tournaments: any[]; teams: any[]; onSelectTab?: (tab: string) => void }) {
  const [selectedTourneyId, setSelectedTourneyId] = useState("");
  const [championId, setChampionId] = useState("");
  const [runnerUpId, setRunnerUpId] = useState("");
  const [thirdPlaceId, setThirdPlaceId] = useState("");
  const [finalScore, setFinalScore] = useState("");
  const [mvp, setMvp] = useState("");
  const [topScorer, setTopScorer] = useState("");

  // Goal of the Tournament State
  const [bestGoalPlayer, setBestGoalPlayer] = useState("");
  const [bestGoalTeamId, setBestGoalTeamId] = useState("");
  const [bestGoalDescription, setBestGoalDescription] = useState("");

  const [loading, setLoading] = useState(false);

  // Quick past tournament modal state
  const [showNewTourney, setShowNewTourney] = useState(false);
  const [newTourneyName, setNewTourneyName] = useState("");
  const [newTourneyYear, setNewTourneyYear] = useState<number>(2025);

  const queryClient = useQueryClient();

  const championsQuery = useQuery({
    queryKey: ["champions-admin"],
    queryFn: fetchChampions,
  });

  const tourneyTeamsQuery = useQuery({
    queryKey: ["tourney-teams-champions", selectedTourneyId],
    queryFn: () => fetchTournamentTeams(selectedTourneyId),
    enabled: !!selectedTourneyId,
  });

  // Load existing champion & award record when tournament changes
  useEffect(() => {
    if (!selectedTourneyId) return;
    const existing = championsQuery.data?.find((c) => c.tournament_id === selectedTourneyId);
    if (existing) {
      setChampionId(existing.champion_team_id ?? "");
      setRunnerUpId(existing.runner_up_team_id ?? "");
      setThirdPlaceId(existing.third_place_team_id ?? "");
      setFinalScore(existing.final_score ?? "");
      setMvp(existing.mvp ?? "");
      setTopScorer(existing.top_scorer ?? "");
    } else {
      setChampionId(""); setRunnerUpId(""); setThirdPlaceId("");
      setFinalScore(""); setMvp(""); setTopScorer("");
    }

    const award = getTournamentAwards(selectedTourneyId);
    if (award) {
      setBestGoalPlayer(award.best_goal_player ?? "");
      setBestGoalTeamId(award.best_goal_team_id ?? "");
      setBestGoalDescription(award.best_goal_description ?? "");
    } else {
      setBestGoalPlayer(""); setBestGoalTeamId(""); setBestGoalDescription("");
    }
  }, [selectedTourneyId, championsQuery.data]);

  async function handleCreatePastTournament(e: React.FormEvent) {
    e.preventDefault();
    if (!newTourneyName.trim()) { toast.error("Enter a tournament name (e.g. TCL SEASON 1)"); return; }
    setLoading(true);
    try {
      const trimmedName = newTourneyName.trim();
      const baseSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      // Check if tournament already exists
      const existing = tournaments.find(
        (t) => t.slug === baseSlug || t.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (existing) {
        toast.info(`"${existing.name}" already exists! Selected automatically.`);
        setSelectedTourneyId(existing.id);
        setShowNewTourney(false);
        setNewTourneyName("");
        return;
      }

      const slug = baseSlug || `tcl-${Date.now()}`;
      const { data, error } = await supabase.from("tournaments").insert([{
        name: trimmedName,
        slug,
        season_year: newTourneyYear,
        status: "completed",
        format: "single_round_robin",
        points_win: 3, points_draw: 1, points_loss: 0,
        organizer: "TFF",
        is_demo: false,
      }]).select().single();

      if (error) {
        if (error.code === "23505" || error.message.includes("unique constraint")) {
          const uniqueSlug = `${slug}-${Date.now().toString().slice(-4)}`;
          const { data: retryData, error: retryError } = await supabase.from("tournaments").insert([{
            name: trimmedName,
            slug: uniqueSlug,
            season_year: newTourneyYear,
            status: "completed",
            format: "single_round_robin",
            points_win: 3, points_draw: 1, points_loss: 0,
            organizer: "TFF",
            is_demo: false,
          }]).select().single();

          if (retryError) throw retryError;
          toast.success(`Created ${retryData.name}!`);
          await queryClient.invalidateQueries({ queryKey: ["tournaments-admin"] });
          await queryClient.invalidateQueries({ queryKey: ["tournaments"] });
          setSelectedTourneyId(retryData.id);
          setShowNewTourney(false);
          setNewTourneyName("");
          return;
        }
        throw error;
      }

      toast.success(`Created ${data.name}!`);
      await queryClient.invalidateQueries({ queryKey: ["tournaments-admin"] });
      await queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      setSelectedTourneyId(data.id);
      setShowNewTourney(false);
      setNewTourneyName("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create tournament.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTourneyId || !championId) {
      toast.error("Select a tournament and a champion team.");
      return;
    }
    setLoading(true);
    try {
      const existing = championsQuery.data?.find((c) => c.tournament_id === selectedTourneyId);
      const payload = {
        tournament_id: selectedTourneyId,
        champion_team_id: championId || null,
        runner_up_team_id: runnerUpId || null,
        third_place_team_id: thirdPlaceId || null,
        final_score: finalScore || null,
        mvp: mvp || null,
        top_scorer: topScorer || null,
      };
      if (existing) {
        const { error } = await supabase.from("champions").update(payload).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("champions").insert([payload]);
        if (error) throw error;
      }

      // Save custom tournament awards (Best Goal of the Tournament)
      saveTournamentAwards(selectedTourneyId, {
        tournament_id: selectedTourneyId,
        best_goal_player: bestGoalPlayer || null,
        best_goal_team_id: bestGoalTeamId || null,
        best_goal_description: bestGoalDescription || null,
      });

      toast.success("Hall of Champions & Tournament Awards updated!");
      queryClient.invalidateQueries({ queryKey: ["champions-admin"] });
      queryClient.invalidateQueries({ queryKey: ["champions"] });
      queryClient.invalidateQueries({ queryKey: ["all-standings"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to save champion.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedTourneyId) return;
    const existing = championsQuery.data?.find((c) => c.tournament_id === selectedTourneyId);
    if (!existing) { toast.error("No champion record to delete."); return; }
    if (!confirm("Remove this champion record from Hall of Champions?")) return;
    try {
      const { error } = await supabase.from("champions").delete().eq("id", existing.id);
      if (error) throw error;
      toast.success("Champion record removed.");
      setChampionId(""); setRunnerUpId(""); setThirdPlaceId("");
      setFinalScore(""); setMvp(""); setTopScorer("");
      setBestGoalPlayer(""); setBestGoalTeamId(""); setBestGoalDescription("");
      queryClient.invalidateQueries({ queryKey: ["champions-admin"] });
      queryClient.invalidateQueries({ queryKey: ["champions"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete.");
    }
  }

  const existing = championsQuery.data?.find((c) => c.tournament_id === selectedTourneyId);
  // Fall back to all teams if no teams registered specifically for this tournament
  const availableTeams = (tourneyTeamsQuery.data && tourneyTeamsQuery.data.length > 0)
    ? tourneyTeamsQuery.data
    : teams;

  const teamSelect = (label: string, value: string, setter: (v: string) => void, emoji: string) => (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground label-caps">{emoji} {label}</label>
      <select
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
      >
        <option value="">— Select Team —</option>
        {availableTeams.map((t: any) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="size-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold font-display tracking-wider">Hall of Champions & Tournament Awards</h2>
            <p className="text-sm text-muted-foreground">Record tournament winners and special awards (Goal of the Tournament, MVP)</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowNewTourney(!showNewTourney)}
          className="gap-1.5"
        >
          <Plus className="size-4" /> Add Past Tournament
        </Button>
      </div>

      {/* Quick Add Past Tournament Form */}
      {showNewTourney && (
        <div className="panel p-5 space-y-4 border-primary/40 bg-primary/5">
          <h3 className="text-sm font-bold font-display tracking-wider text-primary uppercase">Create Past Tournament Record</h3>
          <form onSubmit={handleCreatePastTournament} className="grid gap-3 sm:grid-cols-3 items-end">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[10px] text-muted-foreground uppercase font-semibold">Tournament Name</label>
              <Input
                required
                placeholder="e.g. TCL SEASON 1"
                value={newTourneyName}
                onChange={(e) => setNewTourneyName(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1 sm:col-span-1">
              <label className="text-[10px] text-muted-foreground uppercase font-semibold">Season / Year</label>
              <input
                type="number"
                min={2015}
                max={2030}
                value={newTourneyYear}
                onChange={(e) => setNewTourneyYear(parseInt(e.target.value) || 2025)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              />
            </div>
            <div className="flex gap-2 sm:col-span-1">
              <Button type="submit" size="sm" disabled={loading} className="flex-1">
                {loading && <Loader2 className="animate-spin size-3.5 mr-1" />}
                Add & Continue
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewTourney(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Existing champions overview */}
      {championsQuery.data && championsQuery.data.length > 0 && (
        <div className="panel p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground label-caps">Existing Champion Records ({championsQuery.data.length})</p>
          <div className="space-y-1">
            {championsQuery.data.map((c) => {
              const tourney = tournaments.find((t) => t.id === c.tournament_id);
              const champ = teams.find((t) => t.id === c.champion_team_id);
              return (
                <div
                  key={c.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${selectedTourneyId === c.tournament_id ? "bg-primary/15 border border-primary/30" : "hover:bg-secondary/30"
                    }`}
                  onClick={() => setSelectedTourneyId(c.tournament_id)}
                >
                  <span className="font-medium">{tourney?.name ?? c.tournament_id}</span>
                  <span className="flex items-center gap-1.5 text-primary font-semibold">
                    <Crown className="size-3.5" />
                    {champ?.name ?? "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="panel p-6 space-y-5">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground label-caps">Select Tournament</label>
          <select
            value={selectedTourneyId}
            onChange={(e) => setSelectedTourneyId(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-semibold"
          >
            <option value="">— Select Tournament —</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.season_year || "Past"})</option>
            ))}
          </select>
          {existing && (
            <p className="text-[0.75rem] text-green-400 font-medium pt-1">✓ Champion record exists — editing it</p>
          )}
          {selectedTourneyId && !existing && (
            <p className="text-[0.75rem] text-muted-foreground pt-1">No champion record saved for this tournament yet — fill fields below to save</p>
          )}
        </div>

        {selectedTourneyId && (
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-3">
              {teamSelect("Champion 🏆", championId, setChampionId, "🥇")}
              {teamSelect("Runner-Up", runnerUpId, setRunnerUpId, "🥈")}
              {teamSelect("3rd Place", thirdPlaceId, setThirdPlaceId, "🥉")}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground label-caps">⚽ Final Score</label>
                <Input
                  placeholder="e.g. 2 - 1"
                  value={finalScore}
                  onChange={(e) => setFinalScore(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground label-caps">⭐ MVP Player</label>
                <Input
                  placeholder="Player name"
                  value={mvp}
                  onChange={(e) => setMvp(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground label-caps">🎯 Top Scorer</label>
                <Input
                  placeholder="Player name"
                  value={topScorer}
                  onChange={(e) => setTopScorer(e.target.value)}
                />
              </div>
            </div>

            {/* Special Award: Goal of the Tournament */}
            <div className="panel p-4 space-y-3 bg-amber-500/5 border-amber-500/30">
              <p className="text-xs font-semibold text-amber-400 label-caps uppercase tracking-wider">
                🚀 Best Goal of the Tournament Award
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase font-semibold">Goalscorer Name</label>
                  <Input
                    placeholder="e.g. Arnold Exe"
                    value={bestGoalPlayer}
                    onChange={(e) => setBestGoalPlayer(e.target.value)}
                    className="h-9"
                  />
                </div>
                {teamSelect("Goalscorer Team", bestGoalTeamId, setBestGoalTeamId, "🛡️")}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase font-semibold">Goal Details / Description</label>
                <Input
                  placeholder="e.g. 89th min bicycle kick vs Johor FC in the Final"
                  value={bestGoalDescription}
                  onChange={(e) => setBestGoalDescription(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin size-4 mr-2" />}
                {existing ? "Update Champion & Awards Record" : "Save Tournament Honors & Awards"}
              </Button>
              {existing && (
                <Button type="button" variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="size-3.5 mr-1" /> Delete Record
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

