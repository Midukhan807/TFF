import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Settings, Users, Trophy, CalendarDays, Loader2, ArrowLeft, Edit, Trash2 } from "lucide-react";
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
    mutationFn: async (newTeam: { name: string; short_name: string; team_color: string; manager_name: string; logo_url?: string | null }) => {
      const { data, error } = await supabase.from("teams").insert([{ ...newTeam, is_demo: false }]).select();
      if (error) throw error;
      return data;
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

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    navigate({ to: "/auth", replace: true });
    return null;
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
        <TabsList className="grid grid-cols-4 max-w-lg">
          <TabsTrigger value="tournaments" className="flex items-center gap-2">
            <Trophy className="size-4" /> Tournaments
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="size-4" /> Teams
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center gap-2">
            <CalendarDays className="size-4" /> Matches
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
    setLogoFile(null);
  }

  // Reset form states
  function resetForm() {
    setEditingTeam(null);
    setName("");
    setShortName("");
    setColor("#D4A017");
    setManager("");
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
        const { error: updateError } = await supabase
          .from("teams")
          .update({
            name,
            short_name: shortName,
            team_color: color,
            manager_name: manager,
            logo_url: logoUrl,
          })
          .eq("id", editingTeam.id);

        if (updateError) throw updateError;
        toast.success("Team updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["teams-admin"] });
        queryClient.invalidateQueries({ queryKey: ["teams"] });
      } else {
        await onCreate({ name, short_name: shortName, team_color: color, manager_name: manager, logo_url: logoUrl });
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name) {
      toast.error("Tournament name is required.");
      return;
    }
    setLoading(true);
    try {
      let logoUrl = null;
      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("logos")
          .upload(filePath, logoFile);

        if (uploadError) {
          toast.error("Failed to upload tournament banner: " + uploadError.message);
          setLoading(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("logos")
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      await onCreate({
        name,
        format,
        season_year: year,
        points_win: ptsWin,
        points_draw: ptsDraw,
        points_loss: ptsLoss,
        description: description || null,
        logo_url: logoUrl,
      });
      setName("");
      setDescription("");
      setLogoFile(null);
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
      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("logos").upload(fileName, logoFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(fileName);
        logoUrl = publicUrl;
      }
      const { error } = await supabase.from("tournaments").update({
        name, format, season_year: year, points_win: ptsWin, points_draw: ptsDraw, points_loss: ptsLoss,
        description: description || null, logo_url: logoUrl,
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
            <label className="text-xs text-muted-foreground label-caps">Tournament Banner / Cover Image</label>
            <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="cursor-pointer" />
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

  // Generate simple schedule (Round Robin)
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
      const matchdayFixtures = [];

      // Simple round robin algorithm
      const n = list.length;
      const numMatchdays = n % 2 === 0 ? n - 1 : n;
      const numMatchesPerDay = Math.floor((n + 1) / 2);

      for (let day = 0; day < numMatchdays; day++) {
        for (let match = 0; match < numMatchesPerDay; match++) {
          const homeIdx = (day + match) % (n - 1);
          let awayIdx = (n - 1 - match + day) % (n - 1);

          if (match === 0) {
            awayIdx = n - 1;
          }

          if (homeIdx < n && awayIdx < n && homeIdx !== awayIdx) {
            matchdayFixtures.push({
              tournament_id: selectedTourneyId,
              matchday: day + 1,
              home_team_id: list[homeIdx].id,
              away_team_id: list[awayIdx].id,
              stage: "league",
              status: "scheduled",
            });
          }
        }
      }

      const { error } = await supabase.from("fixtures").insert(matchdayFixtures);
      if (error) throw error;
      toast.success("Schedule generated successfully!");
      queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate schedule.");
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

        {selectedTourneyId && !fixturesQuery.data?.length && (
          <Button onClick={generateSchedule}>
            Generate Round Robin Schedule
          </Button>
        )}
      </div>

      {selectedTourneyId && (
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-display tracking-wider">Fixtures</h3>
            <div className="border border-border/70 rounded-md divide-y divide-border/50 max-h-[500px] overflow-y-auto p-2 bg-secondary/10">
              {fixturesQuery.data?.map((f) => (
                <div key={f.id} className="flex items-center justify-between py-3 px-2 text-sm">
                  <div className="w-24 text-xs text-muted-foreground font-semibold">Matchday {f.matchday}</div>
                  <div className="flex-1 flex items-center justify-center gap-4">
                    <span className="font-semibold text-right w-36">{f.home?.name || "TBD"}</span>
                    <span className="bg-primary/20 px-3 py-1 rounded text-primary font-bold">
                      {f.status === "completed" ? `${f.result?.home_score} - ${f.result?.away_score}` : "VS"}
                    </span>
                    <span className="font-semibold text-left w-36">{f.away?.name || "TBD"}</span>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedFixture(f);
                        setHomeScore(f.result?.home_score || 0);
                        setAwayScore(f.result?.away_score || 0);
                      }}
                    >
                      {f.status === "completed" ? "Edit Score" : "Record Score"}
                    </Button>
                  </div>
                </div>
              ))}
              {!fixturesQuery.data?.length && (
                <p className="text-xs text-muted-foreground p-4 text-center">No fixtures generated yet.</p>
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
