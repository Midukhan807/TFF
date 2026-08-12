import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Settings, Users, Trophy, CalendarDays, Loader2, ArrowLeft, Edit, Trash2, Crown } from "lucide-react";
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
  sortStandings,
  getTeamFoundedYear,
  setTeamFoundedYear,
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
      const { founded_year, ...rest } = newTeam;
      let res = await supabase.from("teams").insert([{ ...newTeam, is_demo: false }]).select();
      if (res.error && res.error.message.includes("founded_year")) {
        res = await supabase.from("teams").insert([{ ...rest, is_demo: false }]).select();
        if (res.data?.[0]?.id && founded_year) {
          setTeamFoundedYear(res.data[0].id, founded_year);
        }
      }
      if (res.error) throw res.error;
      if (res.data?.[0]?.id && founded_year) {
        setTeamFoundedYear(res.data[0].id, founded_year);
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
        <TabsList className="grid grid-cols-5 max-w-2xl">
          <TabsTrigger value="tournaments" className="flex items-center gap-2">
            <Trophy className="size-4" /> Tournaments
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="size-4" /> Teams
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center gap-2">
            <CalendarDays className="size-4" /> Matches
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

        <TabsContent value="champions" className="space-y-6">
          <ChampionsTabContent
            tournaments={tournamentsQuery.data || []}
            teams={teamsQuery.data || []}
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

      if (editingTeam) {
        setTeamFoundedYear(editingTeam.id, foundedYear);
        let { error: updateError } = await supabase
          .from("teams")
          .update({
            name,
            short_name: shortName,
            team_color: color,
            manager_name: manager,
            logo_url: logoUrl,
            founded_year: foundedYear,
          })
          .eq("id", editingTeam.id);

        if (updateError && updateError.message.includes("founded_year")) {
          const { error: retryError } = await supabase
            .from("teams")
            .update({
              name,
              short_name: shortName,
              team_color: color,
              manager_name: manager,
              logo_url: logoUrl,
            })
            .eq("id", editingTeam.id);
          if (retryError) throw retryError;
        } else if (updateError) {
          throw updateError;
        }

        toast.success("Team updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["teams-admin"] });
        queryClient.invalidateQueries({ queryKey: ["teams"] });
      } else {
        await onCreate({ name, short_name: shortName, team_color: color, manager_name: manager, logo_url: logoUrl, founded_year: foundedYear });
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
              {editingTeam ? "Replace Team Logo" : "Team Logo File"}
            </label>
            <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="cursor-pointer" />
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
                  <label className="text-xs text-muted-foreground label-caps">Tournament MVP (Player Name)</label>
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

  // State for adding a fixture manually
  const [newHomeId, setNewHomeId] = useState("");
  const [newAwayId, setNewAwayId] = useState("");
  const [newMatchday, setNewMatchday] = useState(1);

  // Generate schedule using proper circle/Berger-table round-robin
  // Guarantees each team plays EXACTLY ONCE per matchday
  async function generateSchedule() {
    if (!selectedTourneyId || !tourneyTeamsQuery.data?.length) return;
    const teams = tourneyTeamsQuery.data;
    if (teams.length < 2) {
      toast.error("You need at least 2 teams in the tournament to generate a schedule.");
      return;
    }

    try {
      toast.info("Generating schedule...");
      const list = [...teams];
      // If odd number of teams, add a "bye" slot
      if (list.length % 2 !== 0) list.push(null as any);
      const totalTeams = list.length;
      const rounds = totalTeams - 1;
      const matchesPerRound = totalTeams / 2;

      // Circle method: fix first team, rotate the rest
      const rotation = list.slice(1);
      const matchdayFixtures: any[] = [];

      for (let round = 0; round < rounds; round++) {
        const current = [list[0], ...rotation];
        for (let i = 0; i < matchesPerRound; i++) {
          const home = current[i];
          const away = current[totalTeams - 1 - i];
          // Skip bye slots (null)
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
        // Rotate: move last element to front of rotation
        rotation.unshift(rotation.pop()!);
      }

      const { error } = await supabase.from("fixtures").insert(matchdayFixtures);
      if (error) throw error;
      toast.success(`Schedule generated: ${rounds} matchdays, ${matchdayFixtures.length} fixtures!`);
      queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate schedule.");
    }
  }

  async function addFixture() {
    if (!newHomeId || !newAwayId) { toast.error("Select both teams."); return; }
    if (newHomeId === newAwayId) { toast.error("Home and Away teams must be different."); return; }
    try {
      const { error } = await supabase.from("fixtures").insert([{
        tournament_id: selectedTourneyId,
        matchday: newMatchday,
        home_team_id: newHomeId,
        away_team_id: newAwayId,
        stage: "league",
        status: "scheduled",
      }]);
      if (error) throw error;
      toast.success("Fixture added!");
      setNewHomeId(""); setNewAwayId(""); setNewMatchday(1);
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
      // Delete results first (FK constraint)
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
      // 1. Insert or update results
      const { data: existingResult } = await supabase
        .from("results")
        .select("id")
        .eq("fixture_id", selectedFixture.id)
        .maybeSingle();

      if (existingResult) {
        const { error } = await supabase
          .from("results")
          .update({ home_score: homeScore, away_score: awayScore })
          .eq("id", existingResult.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("results")
          .insert([{ fixture_id: selectedFixture.id, home_score: homeScore, away_score: awayScore }]);
        if (error) throw error;
      }

      // 2. Update fixture status to completed
      const { error: fixError } = await supabase
        .from("fixtures")
        .update({ status: "completed" })
        .eq("id", selectedFixture.id);
      if (fixError) throw fixError;

      toast.success("Score recorded successfully!");
      setSelectedFixture(null);
      queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
      queryClient.invalidateQueries({ queryKey: ["all-standings"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to record score.");
    }
  }

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
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="">-- Choose Tournament --</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {selectedTourneyId && (
          <Button onClick={generateSchedule} variant="outline" size="sm">
            Auto-Generate Round Robin
          </Button>
        )}
      </div>

      {selectedTourneyId && (
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display tracking-wider">Fixtures</h3>
              {fixturesQuery.data && fixturesQuery.data.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={generateSchedule}>Re-Generate</Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={deleteAllFixtures}
                    className="gap-1"
                  >
                    <Trash2 className="size-3.5" /> Delete All
                  </Button>
                </div>
              )}
            </div>

            {/* Add fixture manually */}
            <div className="panel p-4 space-y-3 border-dashed">
              <p className="text-xs font-semibold text-muted-foreground label-caps">Add Fixture Manually</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase">Matchday</label>
                  <input
                    type="number" min={1} value={newMatchday}
                    onChange={(e) => setNewMatchday(parseInt(e.target.value) || 1)}
                    className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase">Home Team</label>
                  <select value={newHomeId} onChange={(e) => setNewHomeId(e.target.value)} className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm">
                    <option value="">-- Home --</option>
                    {tourneyTeamsQuery.data?.map((t: any) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase">Away Team</label>
                  <select value={newAwayId} onChange={(e) => setNewAwayId(e.target.value)} className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm">
                    <option value="">-- Away --</option>
                    {tourneyTeamsQuery.data?.map((t: any) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full" size="sm" onClick={addFixture}>
                    <Plus className="size-3.5 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Matchday-grouped fixture tables */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {fixturesQuery.data && fixturesQuery.data.length > 0 ? (
                [...new Set(fixturesQuery.data.map((f) => f.matchday ?? 0))]
                  .sort((a, b) => a - b)
                  .map((matchday) => {
                    const group = fixturesQuery.data!.filter((f) => (f.matchday ?? 0) === matchday);
                    return (
                      <div key={matchday} className="border border-border/60 rounded-lg overflow-hidden">
                        <div className="bg-secondary/30 px-4 py-2 flex items-center gap-2">
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
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-primary/20 text-primary"
                                    }`}>
                                    {f.status === "completed"
                                      ? `${f.result?.home_score} - ${f.result?.away_score}`
                                      : "VS"}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-left font-semibold w-[35%]">{f.away?.name || "TBD"}</td>
                                <td className="px-2 py-2.5 text-right w-[18%]">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      size="sm" variant="secondary"
                                      className="h-7 text-xs px-2"
                                      onClick={() => { setSelectedFixture(f); setHomeScore(f.result?.home_score || 0); setAwayScore(f.result?.away_score || 0); }}
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
                <p className="text-xs text-muted-foreground p-4 text-center">No fixtures yet. Add manually or auto-generate above.</p>
              )}
            </div>
          </div>

          {selectedFixture && (
            <div className="panel p-6 space-y-4 h-fit border-primary/40">
              <h3 className="text-lg font-bold font-display tracking-wider">Record Match Score</h3>
              <form onSubmit={handleRecordScore} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground label-caps">{selectedFixture.home?.name}</label>
                  <Input type="number" min={0} required value={homeScore} onChange={(e) => setHomeScore(parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground label-caps">{selectedFixture.away?.name}</label>
                  <Input type="number" min={0} required value={awayScore} onChange={(e) => setAwayScore(parseInt(e.target.value))} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Save Score</Button>
                  <Button type="button" variant="ghost" onClick={() => setSelectedFixture(null)}>Cancel</Button>
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
function StandingsTabContent({ tournaments, teams }: { tournaments: any[]; teams: any[] }) {
  const [selectedTourneyId, setSelectedTourneyId] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewTourney, setShowNewTourney] = useState(false);
  const [newTourneyName, setNewTourneyName] = useState("");
  const [newTourneyYear, setNewTourneyYear] = useState<number>(2025);

  const queryClient = useQueryClient();

  const standingsQuery = useQuery({
    queryKey: ["standings-admin", selectedTourneyId],
    queryFn: async () => {
      const { data } = await supabase.from("standings").select("*").eq("tournament_id", selectedTourneyId);
      return data ?? [];
    },
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
        goals_for: 0, goals_against: 0, goal_difference: 0, points: 0,
      }));
      setRows(initial);
    }
  }, [selectedTourneyId, standingsQuery.data, teams]);

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
      const slug = newTourneyName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { data, error } = await supabase.from("tournaments").insert([{
        name: newTourneyName.trim(),
        slug: slug || `tcl-${Date.now()}`,
        season_year: newTourneyYear,
        status: "completed",
        format: "single_round_robin",
        points_win: 3, points_draw: 1, points_loss: 0,
        organizer: "TFF",
        is_demo: false,
      }]).select().single();

      if (error) throw error;
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

  async function loadTcl5Preset() {
    let targetId = selectedTourneyId;
    let tcl5Tourney = tournaments.find(
      (t) => t.name.toUpperCase().includes("TCL") && t.name.includes("5")
    );

    if (!tcl5Tourney) {
      toast.info("Creating TCL SEASON 5 tournament...");
      const slug = "tcl-season-5";
      const { data: created, error } = await supabase.from("tournaments").insert([{
        name: "TCL SEASON 5",
        slug,
        season_year: 2024,
        status: "completed",
        format: "single_round_robin",
        points_win: 3, points_draw: 1, points_loss: 0,
        organizer: "TFF",
        is_demo: false,
      }]).select().single();

      if (error) {
        toast.error("Failed to create TCL 5: " + error.message);
        return;
      }
      tcl5Tourney = created;
      await queryClient.invalidateQueries({ queryKey: ["tournaments-admin"] });
      await queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    }

    targetId = tcl5Tourney.id;
    setSelectedTourneyId(targetId);

    const tcl5Preset = [
      { name: "FC CHIMBAM", P: 9, W: 8, D: 1, L: 0, GF: 34, GA: 5, GD: 29, PTS: 25 },
      { name: "JOHOR FC", P: 9, W: 6, D: 2, L: 1, GF: 22, GA: 10, GD: 12, PTS: 20 },
      { name: "NIRMALA CF", P: 9, W: 6, D: 1, L: 2, GF: 23, GA: 13, GD: 10, PTS: 19 },
      { name: "CRUSADER FC", P: 9, W: 6, D: 0, L: 3, GF: 21, GA: 14, GD: 7, PTS: 18 },
      { name: "RAGNAR FC", P: 9, W: 5, D: 2, L: 2, GF: 22, GA: 13, GD: 9, PTS: 17 },
      { name: "CHITHRAM FC", P: 9, W: 3, D: 1, L: 5, GF: 13, GA: 12, GD: 1, PTS: 10 },
      { name: "SKULLX CITY", P: 9, W: 2, D: 2, L: 5, GF: 7, GA: 21, GD: -14, PTS: 8 },
      { name: "RAVEN X", P: 9, W: 2, D: 1, L: 6, GF: 11, GA: 21, GD: -10, PTS: 7 },
    ];

    const presetRows = tcl5Preset.map((preset) => {
      const matchTeam = teams.find(
        (t) => t.name.trim().toUpperCase() === preset.name.toUpperCase()
      );
      return {
        tournament_id: targetId,
        team_id: matchTeam?.id ?? "",
        played: preset.P,
        wins: preset.W,
        draws: preset.D,
        losses: preset.L,
        goals_for: preset.GF,
        goals_against: preset.GA,
        goal_difference: preset.GD,
        points: preset.PTS,
      };
    });

    setRows(presetRows);
    toast.success("Loaded TCL 5 Standings! Click 'Save Standings Table' below to save.");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTourneyId) {
      toast.error("Select a tournament first.");
      return;
    }
    setLoading(true);
    try {
      await supabase.from("standings").delete().eq("tournament_id", selectedTourneyId);

      const validRows = rows.filter((r) => r.team_id).map((r) => ({
        tournament_id: selectedTourneyId,
        team_id: r.team_id,
        played: Number(r.played) || 0,
        wins: Number(r.wins) || 0,
        draws: Number(r.draws) || 0,
        losses: Number(r.losses) || 0,
        goals_for: Number(r.goals_for) || 0,
        goals_against: Number(r.goals_against) || 0,
        goal_difference: Number(r.goal_difference) || 0,
        points: Number(r.points) || 0,
      }));

      if (validRows.length > 0) {
        const { error } = await supabase.from("standings").insert(validRows);
        if (error) throw error;
      }

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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadTcl5Preset}
            className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
          >
            ⚡ Load TCL 5 Standings
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
                    <th className="px-2 py-2 text-center w-20">PTS</th>
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
                          type="number" min={0} value={row.points ?? 0}
                          onChange={(e) => updateRowField(idx, "points", e.target.value)}
                          className="w-16 h-8 text-center rounded border border-primary/40 bg-primary/10 text-primary font-bold text-sm"
                        />
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
                      goals_for: 0, goals_against: 0, goal_difference: 0, points: 0,
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
function ChampionsTabContent({ tournaments, teams }: { tournaments: any[]; teams: any[] }) {
  const [selectedTourneyId, setSelectedTourneyId] = useState("");
  const [championId, setChampionId] = useState("");
  const [runnerUpId, setRunnerUpId] = useState("");
  const [thirdPlaceId, setThirdPlaceId] = useState("");
  const [finalScore, setFinalScore] = useState("");
  const [mvp, setMvp] = useState("");
  const [topScorer, setTopScorer] = useState("");
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

  // Load existing champion record when tournament changes
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
  }, [selectedTourneyId, championsQuery.data]);

  async function handleCreatePastTournament(e: React.FormEvent) {
    e.preventDefault();
    if (!newTourneyName.trim()) { toast.error("Enter a tournament name (e.g. TCL SEASON 1)"); return; }
    setLoading(true);
    try {
      const slug = newTourneyName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { data, error } = await supabase.from("tournaments").insert([{
        name: newTourneyName.trim(),
        slug: slug || `tcl-${Date.now()}`,
        season_year: newTourneyYear,
        status: "completed",
        format: "single_round_robin",
        points_win: 3, points_draw: 1, points_loss: 0,
        organizer: "TFF",
        is_demo: false,
      }]).select().single();

      if (error) throw error;
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
      toast.success("Hall of Champions updated!");
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
            <h2 className="text-xl font-bold font-display tracking-wider">Hall of Champions</h2>
            <p className="text-sm text-muted-foreground">Record tournament winners for the Champions page</p>
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
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin size-4 mr-2" />}
                {existing ? "Update Champion Record" : "Save to Hall of Champions"}
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

