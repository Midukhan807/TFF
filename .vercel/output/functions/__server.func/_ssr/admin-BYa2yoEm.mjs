import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-D-eR6n2z.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { K as ArrowLeft, P as Crown, T as LoaderCircle, V as CalendarDays, _ as Plus, c as Trophy, d as SquarePen, g as Settings, l as Trash2, o as Users, z as ChartColumn } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as saveTournamentAwards, B as Button, C as getManualStandings, D as getTournamentAwards, E as getTeamVideoLogo, L as useIsAdmin, M as setTeamVideoLogo, O as parseResultPenalties, T as getTeamFoundedYear, f as fetchPlayerStats, g as fetchTeams, j as setTeamFoundedYear, k as saveManualStandings, l as fetchChampions, o as calculateTournamentMVP, p as fetchRankingConfig, u as fetchFixtures, v as fetchTournamentTeams, y as fetchTournaments } from "./router-BD6uxmJI.mjs";
import { t as Input } from "./input-NvmijQlt.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DO3DZj4v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BYa2yoEm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const navigate = useNavigate();
	const { session, isAdmin, loading: authLoading } = useIsAdmin();
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = (0, import_react.useState)("tournaments");
	const teamsQuery = useQuery({
		queryKey: ["teams-admin"],
		queryFn: fetchTeams
	});
	const tournamentsQuery = useQuery({
		queryKey: ["tournaments-admin"],
		queryFn: fetchTournaments
	});
	const configQuery = useQuery({
		queryKey: ["ranking-config"],
		queryFn: fetchRankingConfig
	});
	const createTeamMutation = useMutation({
		mutationFn: async (newTeam) => {
			const { founded_year, logo_video_url, ...rest } = newTeam;
			let res = await supabase.from("teams").insert([{
				...newTeam,
				is_demo: false
			}]).select();
			if (res.error && (res.error.message.includes("founded_year") || res.error.message.includes("logo_video_url"))) {
				const fallbackObj = {
					...newTeam,
					is_demo: false
				};
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
		onError: (err) => {
			toast.error(err.message || "Failed to create team.");
		}
	});
	const createTournamentMutation = useMutation({
		mutationFn: async (newTourney) => {
			const slug = newTourney.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
			const { data, error } = await supabase.from("tournaments").insert([{
				...newTourney,
				slug,
				status: "draft",
				is_demo: false
			}]).select();
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tournaments-admin"] });
			queryClient.invalidateQueries({ queryKey: ["tournaments"] });
			toast.success("Tournament created successfully!");
		},
		onError: (err) => {
			toast.error(err.message || "Failed to create tournament.");
		}
	});
	const updateConfigMutation = useMutation({
		mutationFn: async (updated) => {
			const { error } = await supabase.from("ranking_settings").update(updated).eq("id", 1);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ranking-config"] });
			toast.success("Settings updated successfully!");
		},
		onError: (err) => {
			toast.error(err.message || "Failed to update settings.");
		}
	});
	(0, import_react.useEffect)(() => {
		if (!authLoading && (!session || !isAdmin)) navigate({
			to: "/auth",
			replace: true
		});
	}, [
		authLoading,
		session,
		isAdmin,
		navigate
	]);
	if (authLoading || !session || !isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-10 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border/70 pb-5 mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-bold font-display tracking-wide",
				children: "TFF Admin Panel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "Manage your tournaments, teams, fixtures, and results"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				onClick: () => navigate({ to: "/" }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 size-4" }), " Exit Panel"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: activeTab,
			onValueChange: setActiveTab,
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid grid-cols-6 max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "tournaments",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4" }), " Tournaments"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "teams",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), " Teams"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "matches",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4" }), " Matches"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "standings",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4" }), " Standings"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "champions",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-4" }), " Champions"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "settings",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" }), " Settings"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "tournaments",
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TournamentTabContent, {
						tournaments: tournamentsQuery.data || [],
						teams: teamsQuery.data || [],
						onCreate: createTournamentMutation.mutateAsync
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "teams",
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamTabContent, {
						teams: teamsQuery.data || [],
						onCreate: createTeamMutation.mutateAsync
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "matches",
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchesTabContent, { tournaments: tournamentsQuery.data || [] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "standings",
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandingsTabContent, {
						tournaments: tournamentsQuery.data || [],
						teams: teamsQuery.data || [],
						onSelectTab: setActiveTab
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "champions",
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChampionsTabContent, {
						tournaments: tournamentsQuery.data || [],
						teams: teamsQuery.data || [],
						onSelectTab: setActiveTab
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "settings",
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsTabContent, {
						config: configQuery.data,
						onUpdate: updateConfigMutation.mutateAsync
					})
				})
			]
		})]
	});
}
function TeamTabContent({ teams, onCreate }) {
	const [editingTeam, setEditingTeam] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [shortName, setShortName] = (0, import_react.useState)("");
	const [color, setColor] = (0, import_react.useState)("#D4A017");
	const [manager, setManager] = (0, import_react.useState)("");
	const [foundedYear, setFoundedYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear());
	const [logoFile, setLogoFile] = (0, import_react.useState)(null);
	const [logoVideoUrl, setLogoVideoUrl] = (0, import_react.useState)("");
	const [logoVideoFile, setLogoVideoFile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const queryClient = useQueryClient();
	function startEdit(team) {
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
	function resetForm() {
		setEditingTeam(null);
		setName("");
		setShortName("");
		setColor("#D4A017");
		setManager("");
		setFoundedYear((/* @__PURE__ */ new Date()).getFullYear());
		setLogoFile(null);
		setLogoVideoUrl("");
		setLogoVideoFile(null);
	}
	async function handleCreate(e) {
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
				const filePath = `${`${Math.random()}.${fileExt}`}`;
				const { error: uploadError } = await supabase.storage.from("logos").upload(filePath, logoFile);
				if (uploadError) {
					toast.error("Failed to upload logo image: " + uploadError.message);
					setLoading(false);
					return;
				}
				const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(filePath);
				logoUrl = publicUrl;
			}
			let videoUrl = logoVideoUrl.trim() || null;
			if (logoVideoFile) {
				const fileExt = logoVideoFile.name.split(".").pop();
				const filePath = `${`vid_${Math.random()}.${fileExt}`}`;
				const { error: videoUploadErr } = await supabase.storage.from("logos").upload(filePath, logoVideoFile);
				if (!videoUploadErr) {
					const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(filePath);
					videoUrl = publicUrl;
				}
			}
			if (editingTeam) {
				setTeamFoundedYear(editingTeam.id, foundedYear);
				setTeamVideoLogo(editingTeam.id, videoUrl);
				let updatePayload = {
					name,
					short_name: shortName,
					team_color: color,
					manager_name: manager,
					logo_url: logoUrl,
					founded_year: foundedYear,
					logo_video_url: videoUrl
				};
				let { error: updateError } = await supabase.from("teams").update(updatePayload).eq("id", editingTeam.id);
				if (updateError && (updateError.message.includes("founded_year") || updateError.message.includes("logo_video_url"))) {
					if (updateError.message.includes("founded_year")) delete updatePayload.founded_year;
					if (updateError.message.includes("logo_video_url")) delete updatePayload.logo_video_url;
					const { error: retryError } = await supabase.from("teams").update(updatePayload).eq("id", editingTeam.id);
					if (retryError) throw retryError;
				} else if (updateError) throw updateError;
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
					logo_video_url: videoUrl
				});
				if (createdTeam?.id && videoUrl) setTeamVideoLogo(createdTeam.id, videoUrl);
			}
			resetForm();
		} catch (err) {
			toast.error(err.message || "An error occurred.");
		} finally {
			setLoading(false);
		}
	}
	async function handleDelete(teamId) {
		if (!confirm("Are you sure you want to delete this team?")) return;
		try {
			const { error } = await supabase.from("teams").delete().eq("id", teamId);
			if (error) throw error;
			toast.success("Team deleted successfully!");
			queryClient.invalidateQueries({ queryKey: ["teams-admin"] });
			queryClient.invalidateQueries({ queryKey: ["teams"] });
			if (editingTeam?.id === teamId) resetForm();
		} catch (err) {
			toast.error(err.message || "Failed to delete team.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_2fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel p-6 space-y-4 h-fit",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold font-display tracking-wider",
				children: editingTeam ? "Edit Team" : "Register Team"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleCreate,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground label-caps",
							children: "Team Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "e.g. Manchester Red"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground label-caps",
							children: "Short Name (3 letters)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							maxLength: 3,
							value: shortName,
							onChange: (e) => setShortName(e.target.value.toUpperCase()),
							placeholder: "e.g. MNR"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground label-caps",
							children: "Team Color"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "color",
							value: color,
							onChange: (e) => setColor(e.target.value),
							className: "h-10 p-1"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground label-caps",
							children: "Manager Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: manager,
							onChange: (e) => setManager(e.target.value),
							placeholder: "e.g. Sir Alex"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground label-caps",
							children: "Founded Year"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 1900,
							max: (/* @__PURE__ */ new Date()).getFullYear(),
							value: foundedYear,
							onChange: (e) => setFoundedYear(parseInt(e.target.value) || (/* @__PURE__ */ new Date()).getFullYear()),
							className: "w-full h-9 px-3 rounded-md border border-input bg-background text-sm",
							placeholder: "e.g. 2020"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground label-caps",
							children: editingTeam ? "Replace Static Team Logo" : "Team Logo Image"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "file",
							accept: "image/*",
							onChange: (e) => setLogoFile(e.target.files?.[0] || null),
							className: "cursor-pointer"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 border-t border-border/50 pt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs text-muted-foreground label-caps flex items-center gap-1.5 text-primary",
								children: "🎬 Animated Logo Video (MP4)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "file",
								accept: "video/mp4,video/webm",
								onChange: (e) => setLogoVideoFile(e.target.files?.[0] || null),
								className: "cursor-pointer text-xs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Or enter Video URL (e.g. /Video Project 16.mp4)",
								value: logoVideoUrl,
								onChange: (e) => setLogoVideoUrl(e.target.value),
								className: "h-8 text-xs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Plays animation when hovering over team card."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							className: "flex-1",
							disabled: loading,
							children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-4 mr-2" }) : editingTeam ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4 mr-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-2" }), editingTeam ? "Save Changes" : "Add Team"]
						}), editingTeam && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: resetForm,
							children: "Cancel"
						})]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel p-6 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-xl font-bold font-display tracking-wider",
				children: [
					"All Teams (",
					teams.length,
					")"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border/50 max-h-[500px] overflow-y-auto pr-2",
				children: teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-4 rounded-full border border-border",
							style: { backgroundColor: t.team_color }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: t.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Manager: ", t.manager_name || "None"]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-sm text-primary bg-primary/10 px-2 py-0.5 rounded",
								children: t.short_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => startEdit(t),
								title: "Edit team",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "text-destructive hover:bg-destructive/10",
								onClick: () => handleDelete(t.id),
								title: "Delete team",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})
						]
					})]
				}, t.id))
			})]
		})]
	});
}
function TournamentTabContent({ tournaments, teams, onCreate }) {
	const [name, setName] = (0, import_react.useState)("");
	const [format, setFormat] = (0, import_react.useState)("single_round_robin");
	const [year, setYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear());
	const [ptsWin, setPtsWin] = (0, import_react.useState)(3);
	const [ptsDraw, setPtsDraw] = (0, import_react.useState)(1);
	const [ptsLoss, setPtsLoss] = (0, import_react.useState)(0);
	const [description, setDescription] = (0, import_react.useState)("");
	const [logoFile, setLogoFile] = (0, import_react.useState)(null);
	const [bannerFile, setBannerFile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [editingTourney, setEditingTourney] = (0, import_react.useState)(null);
	const [selectedTourney, setSelectedTourney] = (0, import_react.useState)(null);
	const [associatedTeams, setAssociatedTeams] = (0, import_react.useState)([]);
	const queryClient = useQueryClient();
	const [editingChampionsTourney, setEditingChampionsTourney] = (0, import_react.useState)(null);
	const [championTeamId, setChampionTeamId] = (0, import_react.useState)("");
	const [runnerUpTeamId, setRunnerUpTeamId] = (0, import_react.useState)("");
	const [thirdPlaceTeamId, setThirdPlaceTeamId] = (0, import_react.useState)("");
	const [finalScore, setFinalScore] = (0, import_react.useState)("");
	const [mvp, setMvp] = (0, import_react.useState)("");
	const [topScorer, setTopScorer] = (0, import_react.useState)("");
	const activeTourneyTeamsQuery = useQuery({
		queryKey: ["tourney-teams-admin", selectedTourney?.id],
		queryFn: () => fetchTournamentTeams(selectedTourney.id),
		enabled: !!selectedTourney
	});
	const championsTourneyTeamsQuery = useQuery({
		queryKey: ["tourney-teams-champions", editingChampionsTourney?.id],
		queryFn: () => fetchTournamentTeams(editingChampionsTourney.id),
		enabled: !!editingChampionsTourney
	});
	const championsQuery = useQuery({
		queryKey: ["champions-admin", editingChampionsTourney?.id],
		queryFn: async () => {
			const { data } = await supabase.from("champions").select("*").eq("tournament_id", editingChampionsTourney.id).maybeSingle();
			return data;
		},
		enabled: !!editingChampionsTourney
	});
	const tourneyPlayerStatsQuery = useQuery({
		queryKey: ["player-stats-admin", editingChampionsTourney?.id],
		queryFn: () => fetchPlayerStats(editingChampionsTourney.id),
		enabled: !!editingChampionsTourney
	});
	(0, import_react.useEffect)(() => {
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
	async function uploadFile(file, bucket) {
		const fileExt = file.name.split(".").pop();
		const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
		const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
		if (uploadError) throw new Error(uploadError.message);
		const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
		return publicUrl;
	}
	async function handleCreate(e) {
		e.preventDefault();
		if (!name) {
			toast.error("Tournament name is required.");
			return;
		}
		setLoading(true);
		try {
			let logoUrl = null;
			let bannerUrl = null;
			if (logoFile) logoUrl = await uploadFile(logoFile, "logos");
			if (bannerFile) bannerUrl = await uploadFile(bannerFile, "logos");
			await onCreate({
				name,
				format,
				season_year: year,
				points_win: ptsWin,
				points_draw: ptsDraw,
				points_loss: ptsLoss,
				description: description || null,
				logo_url: logoUrl,
				banner_url: bannerUrl
			});
			setName("");
			setDescription("");
			setLogoFile(null);
			setBannerFile(null);
		} catch (err) {
			toast.error(err.message || "Failed to create tournament.");
		} finally {
			setLoading(false);
		}
	}
	async function handleAddTeam(teamId) {
		if (!selectedTourney) return;
		try {
			const { error } = await supabase.from("tournament_teams").insert([{
				tournament_id: selectedTourney.id,
				team_id: teamId
			}]);
			if (error) throw error;
			toast.success("Team added to tournament!");
			queryClient.invalidateQueries({ queryKey: ["tourney-teams-admin", selectedTourney.id] });
		} catch (err) {
			toast.error(err.message || "Failed to add team.");
		}
	}
	async function handleRemoveTeam(teamId) {
		if (!selectedTourney) return;
		try {
			const { error } = await supabase.from("tournament_teams").delete().eq("tournament_id", selectedTourney.id).eq("team_id", teamId);
			if (error) throw error;
			toast.success("Team removed from tournament!");
			queryClient.invalidateQueries({ queryKey: ["tourney-teams-admin", selectedTourney.id] });
		} catch (err) {
			toast.error(err.message || "Failed to remove team.");
		}
	}
	function startEditTourney(t) {
		setEditingTourney(t);
		setName(t.name);
		setFormat(t.format);
		setYear(t.season_year || (/* @__PURE__ */ new Date()).getFullYear());
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
		setYear((/* @__PURE__ */ new Date()).getFullYear());
		setPtsWin(3);
		setPtsDraw(1);
		setPtsLoss(0);
		setDescription("");
		setLogoFile(null);
		setBannerFile(null);
	}
	async function handleDeleteTourney(tourneyId) {
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
		} catch (err) {
			toast.error(err.message || "Failed to delete tournament.");
		}
	}
	async function handleUpdateTourney(e) {
		e.preventDefault();
		if (!editingTourney) return;
		setLoading(true);
		try {
			let logoUrl = editingTourney.logo_url;
			let bannerUrl = editingTourney.banner_url;
			if (logoFile) logoUrl = await uploadFile(logoFile, "logos");
			if (bannerFile) bannerUrl = await uploadFile(bannerFile, "logos");
			const { error } = await supabase.from("tournaments").update({
				name,
				format,
				season_year: year,
				points_win: ptsWin,
				points_draw: ptsDraw,
				points_loss: ptsLoss,
				description: description || null,
				logo_url: logoUrl,
				banner_url: bannerUrl
			}).eq("id", editingTourney.id);
			if (error) throw error;
			toast.success("Tournament updated!");
			queryClient.invalidateQueries({ queryKey: ["tournaments-admin"] });
			queryClient.invalidateQueries({ queryKey: ["tournaments"] });
			resetTourneyForm();
		} catch (err) {
			toast.error(err.message || "Failed to update tournament.");
		} finally {
			setLoading(false);
		}
	}
	async function updateStatus(tourneyId, newStatus) {
		try {
			const { error } = await supabase.from("tournaments").update({ status: newStatus }).eq("id", tourneyId);
			if (error) throw error;
			toast.success(`Status updated to ${newStatus}`);
			queryClient.invalidateQueries({ queryKey: ["tournaments-admin"] });
			if (selectedTourney?.id === tourneyId) setSelectedTourney({
				...selectedTourney,
				status: newStatus
			});
		} catch (err) {
			toast.error(err.message || "Failed to update status.");
		}
	}
	async function handleSaveChampions(e) {
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
				top_scorer: topScorer || null
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
		} catch (err) {
			toast.error(err.message || "Failed to save champions.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_2fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel p-6 space-y-4 h-fit",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold font-display tracking-wider",
					children: editingTourney ? "Edit Tournament" : "Create Tournament"
				}), editingTourney && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "ghost",
					onClick: resetTourneyForm,
					children: "Cancel"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: editingTourney ? handleUpdateTourney : handleCreate,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground label-caps",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "e.g. TFF League Season 5"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground label-caps",
							children: "Format"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: format,
							onChange: (e) => setFormat(e.target.value),
							className: "w-full h-10 px-3 rounded-md border border-input bg-background text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "single_round_robin",
									children: "Single Round Robin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "double_round_robin",
									children: "Double Round Robin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "knockout",
									children: "Knockout"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground label-caps",
							children: "Season Year"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: year,
							onChange: (e) => setYear(parseInt(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-muted-foreground label-caps",
									children: "Win Pts"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: ptsWin,
									onChange: (e) => setPtsWin(parseInt(e.target.value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-muted-foreground label-caps",
									children: "Draw Pts"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: ptsDraw,
									onChange: (e) => setPtsDraw(parseInt(e.target.value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-muted-foreground label-caps",
									children: "Loss Pts"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: ptsLoss,
									onChange: (e) => setPtsLoss(parseInt(e.target.value))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground label-caps",
							children: "Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							placeholder: "Provide a brief summary of the tournament...",
							className: "w-full min-h-[80px] p-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-muted-foreground label-caps",
								children: ["Poster / Cover Image ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground/60",
									children: "(shown on tournament card)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "file",
								accept: "image/*",
								onChange: (e) => setLogoFile(e.target.files?.[0] || null),
								className: "cursor-pointer"
							}),
							editingTourney?.logo_url && !logoFile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["Current: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: editingTourney.logo_url,
									target: "_blank",
									rel: "noreferrer",
									className: "underline text-primary",
									children: "view"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-muted-foreground label-caps",
								children: ["Header Banner ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground/60",
									children: "(wide image shown at top of tournament page)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "file",
								accept: "image/*",
								onChange: (e) => setBannerFile(e.target.files?.[0] || null),
								className: "cursor-pointer"
							}),
							editingTourney?.banner_url && !bannerFile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["Current: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: editingTourney.banner_url,
									target: "_blank",
									rel: "noreferrer",
									className: "underline text-primary",
									children: "view"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "w-full",
						disabled: loading,
						children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-4 mr-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-2" }), "Create Tournament"]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold font-display tracking-wider",
						children: "All Tournaments"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border/50 max-h-[300px] overflow-y-auto pr-2",
						children: tournaments.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: t.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground uppercase",
								children: [
									t.format.replace(/_/g, " "),
									" | Season: ",
									t.season_year
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: t.status,
										onChange: (e) => updateStatus(t.id, e.target.value),
										className: "h-8 px-2 rounded-md border border-input bg-background text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "draft",
												children: "Draft"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "upcoming",
												children: "Upcoming"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "live",
												children: "Live"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "completed",
												children: "Completed"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => {
											setSelectedTourney(t);
											setEditingChampionsTourney(null);
											setEditingTourney(null);
										},
										children: "Teams"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "border-primary/40 hover:bg-primary/10",
										onClick: () => {
											setEditingChampionsTourney(t);
											setSelectedTourney(null);
											setEditingTourney(null);
										},
										children: "Champions"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "size-8",
										onClick: () => startEditTourney(t),
										title: "Edit tournament",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "size-8 hover:text-destructive",
										onClick: () => handleDeleteTourney(t.id),
										title: "Delete tournament",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})
								]
							})]
						}, t.id))
					})]
				}),
				selectedTourney && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-xl font-bold font-display tracking-wider",
							children: ["Manage Teams - ", selectedTourney.name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => setSelectedTourney(null),
							children: "Close"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs text-muted-foreground label-caps mb-2",
							children: "Available Teams"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border border-border/70 rounded-md divide-y divide-border/50 max-h-[250px] overflow-y-auto p-2 space-y-1 bg-secondary/20",
							children: teams.filter((t) => !activeTourneyTeamsQuery.data?.some((at) => at.id === t.id)).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between py-1 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "xs",
									onClick: () => handleAddTeam(t.id),
									children: "Add"
								})]
							}, t.id))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs text-muted-foreground label-caps mb-2",
							children: "Registered Teams"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border/70 rounded-md divide-y divide-border/50 max-h-[250px] overflow-y-auto p-2 space-y-1 bg-secondary/20",
							children: [activeTourneyTeamsQuery.data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between py-1 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "xs",
									variant: "destructive",
									onClick: () => handleRemoveTeam(t.id),
									children: "Remove"
								})]
							}, t.id)), !activeTourneyTeamsQuery.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground p-2",
								children: "No teams registered yet."
							})]
						})] })]
					})]
				}),
				editingChampionsTourney && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-xl font-bold font-display tracking-wider",
							children: ["Set Champions - ", editingChampionsTourney.name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => setEditingChampionsTourney(null),
							children: "Close"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveChampions,
						className: "grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs text-muted-foreground label-caps",
											children: "Champion Team"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: championTeamId,
											onChange: (e) => setChampionTeamId(e.target.value),
											className: "w-full h-10 px-3 rounded-md border border-input bg-background text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Select Champion"
											}), championsTourneyTeamsQuery.data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: t.id,
												children: t.name
											}, t.id))]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs text-muted-foreground label-caps",
											children: "Runner Up"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: runnerUpTeamId,
											onChange: (e) => setRunnerUpTeamId(e.target.value),
											className: "w-full h-10 px-3 rounded-md border border-input bg-background text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Select Runner Up"
											}), championsTourneyTeamsQuery.data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: t.id,
												children: t.name
											}, t.id))]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs text-muted-foreground label-caps",
											children: "Third Place"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: thirdPlaceTeamId,
											onChange: (e) => setThirdPlaceTeamId(e.target.value),
											className: "w-full h-10 px-3 rounded-md border border-input bg-background text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Select Third Place (Optional)"
											}), championsTourneyTeamsQuery.data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: t.id,
												children: t.name
											}, t.id))]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs text-muted-foreground label-caps",
											children: "Final Match Score"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: finalScore,
											onChange: (e) => setFinalScore(e.target.value),
											placeholder: "e.g. 2-1 or 3-2 (PEN)"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs text-muted-foreground label-caps",
												children: "Tournament MVP (Player Name)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													const stats = tourneyPlayerStatsQuery.data || [];
													const result = calculateTournamentMVP(stats, championTeamId);
													if (result) {
														setMvp(result.player.player_name);
														toast.success(`Auto-calculated MVP: ${result.player.player_name} (Score: ${result.score})!`);
													} else toast.info("No player statistics recorded for this tournament yet.");
												},
												className: "text-[10px] text-purple-400 font-bold uppercase hover:underline flex items-center gap-1",
												children: "⚡ Auto-Calculate MVP"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: mvp,
											onChange: (e) => setMvp(e.target.value),
											placeholder: "e.g. Messi"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs text-muted-foreground label-caps",
											children: "Top Scorer (Player Name)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: topScorer,
											onChange: (e) => setTopScorer(e.target.value),
											placeholder: "e.g. Ronaldo"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: loading,
									children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-4 mr-2" }), "Save Champions Data"]
								})
							})
						]
					})]
				})
			]
		})]
	});
}
function MatchesTabContent({ tournaments }) {
	const [selectedTourneyId, setSelectedTourneyId] = (0, import_react.useState)("");
	const [activeStageTab, setActiveStageTab] = (0, import_react.useState)("league");
	const queryClient = useQueryClient();
	const fixturesQuery = useQuery({
		queryKey: ["fixtures-admin", selectedTourneyId],
		queryFn: () => fetchFixtures(selectedTourneyId),
		enabled: !!selectedTourneyId
	});
	const tourneyTeamsQuery = useQuery({
		queryKey: ["tourney-teams-admin", selectedTourneyId],
		queryFn: () => fetchTournamentTeams(selectedTourneyId),
		enabled: !!selectedTourneyId
	});
	const [selectedFixture, setSelectedFixture] = (0, import_react.useState)(null);
	const [homeScore, setHomeScore] = (0, import_react.useState)(0);
	const [awayScore, setAwayScore] = (0, import_react.useState)(0);
	const [homePenalties, setHomePenalties] = (0, import_react.useState)(0);
	const [awayPenalties, setAwayPenalties] = (0, import_react.useState)(0);
	const [enablePenalties, setEnablePenalties] = (0, import_react.useState)(false);
	const [homeYellow, setHomeYellow] = (0, import_react.useState)(0);
	const [awayYellow, setAwayYellow] = (0, import_react.useState)(0);
	const [homeRed, setHomeRed] = (0, import_react.useState)(0);
	const [awayRed, setAwayRed] = (0, import_react.useState)(0);
	const [newStage, setNewStage] = (0, import_react.useState)("league");
	const [newRound, setNewRound] = (0, import_react.useState)("Semi Final");
	const [newHomeId, setNewHomeId] = (0, import_react.useState)("");
	const [newAwayId, setNewAwayId] = (0, import_react.useState)("");
	const [newMatchday, setNewMatchday] = (0, import_react.useState)(1);
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
			if (list.length % 2 !== 0) list.push(null);
			const totalTeams = list.length;
			const rounds = totalTeams - 1;
			const matchesPerRound = totalTeams / 2;
			const rotation = list.slice(1);
			const matchdayFixtures = [];
			for (let round = 0; round < rounds; round++) {
				const current = [list[0], ...rotation];
				for (let i = 0; i < matchesPerRound; i++) {
					const home = current[i];
					const away = current[totalTeams - 1 - i];
					if (home && away) matchdayFixtures.push({
						tournament_id: selectedTourneyId,
						matchday: round + 1,
						home_team_id: home.id,
						away_team_id: away.id,
						stage: "league",
						status: "scheduled"
					});
				}
				rotation.unshift(rotation.pop());
			}
			const { error } = await supabase.from("fixtures").insert(matchdayFixtures);
			if (error) throw error;
			toast.success(`Schedule generated: ${rounds} matchdays, ${matchdayFixtures.length} fixtures!`);
			setActiveStageTab("league");
			queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
		} catch (err) {
			toast.error(err.message || "Failed to generate schedule.");
		}
	}
	function openScoreDialog(f) {
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
				status: "scheduled"
			}]);
			if (error) throw error;
			toast.success(`Added ${newStage === "knockout" ? newRound : `Matchday ${newMatchday}`} fixture!`);
			setNewHomeId("");
			setNewAwayId("");
			if (newStage === "knockout") setActiveStageTab("knockout");
			queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
		} catch (err) {
			toast.error(err.message || "Failed to add fixture.");
		}
	}
	async function deleteFixture(fixtureId) {
		if (!confirm("Delete this fixture?")) return;
		try {
			await supabase.from("results").delete().eq("fixture_id", fixtureId);
			const { error } = await supabase.from("fixtures").delete().eq("id", fixtureId);
			if (error) throw error;
			toast.success("Fixture deleted.");
			if (selectedFixture?.id === fixtureId) setSelectedFixture(null);
			queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
		} catch (err) {
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
		} catch (err) {
			toast.error(err.message || "Failed to delete all fixtures.");
		}
	}
	async function handleRecordScore(e) {
		e.preventDefault();
		if (!selectedFixture) return;
		try {
			const { data: existingResult } = await supabase.from("results").select("id").eq("fixture_id", selectedFixture.id).maybeSingle();
			let notesPayload = null;
			if (enablePenalties || homeScore === awayScore && (homePenalties > 0 || awayPenalties > 0)) notesPayload = JSON.stringify({
				home_penalties: homePenalties,
				away_penalties: awayPenalties
			});
			const resultPayload = {
				fixture_id: selectedFixture.id,
				home_score: homeScore,
				away_score: awayScore,
				home_yellow_cards: homeYellow,
				away_yellow_cards: awayYellow,
				home_red_cards: homeRed,
				away_red_cards: awayRed,
				notes: notesPayload
			};
			if (existingResult) {
				let res = await supabase.from("results").update(resultPayload).eq("id", existingResult.id);
				if (res.error) res = await supabase.from("results").update({
					home_score: homeScore,
					away_score: awayScore
				}).eq("id", existingResult.id);
				if (res.error) throw res.error;
			} else {
				let res = await supabase.from("results").insert([resultPayload]);
				if (res.error) res = await supabase.from("results").insert([{
					fixture_id: selectedFixture.id,
					home_score: homeScore,
					away_score: awayScore
				}]);
				if (res.error) throw res.error;
			}
			const { error: fixError } = await supabase.from("fixtures").update({ status: "completed" }).eq("id", selectedFixture.id);
			if (fixError) throw fixError;
			if (selectedTourneyId && (homeYellow > 0 || awayYellow > 0 || homeRed > 0 || awayRed > 0)) {
				const manual = getManualStandings(selectedTourneyId);
				if (manual.length > 0) {
					const updated = manual.map((row) => {
						if (row.team_id === selectedFixture.home_team_id) return {
							...row,
							yellow_cards: (Number(row.yellow_cards) || 0) + homeYellow,
							red_cards: (Number(row.red_cards) || 0) + homeRed
						};
						if (row.team_id === selectedFixture.away_team_id) return {
							...row,
							yellow_cards: (Number(row.yellow_cards) || 0) + awayYellow,
							red_cards: (Number(row.red_cards) || 0) + awayRed
						};
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
		} catch (err) {
			toast.error(err.message || "Failed to record score.");
		}
	}
	async function handleResetScore() {
		if (!selectedFixture) return;
		if (!confirm("Reset this match score? It will mark the match as scheduled/unplayed again.")) return;
		try {
			await supabase.from("results").delete().eq("fixture_id", selectedFixture.id);
			const { error: fixError } = await supabase.from("fixtures").update({ status: "scheduled" }).eq("id", selectedFixture.id);
			if (fixError) throw fixError;
			toast.success("Match reset to scheduled (unplayed)!");
			setSelectedFixture(null);
			queryClient.invalidateQueries({ queryKey: ["fixtures-admin", selectedTourneyId] });
			queryClient.invalidateQueries({ queryKey: ["all-standings"] });
			queryClient.invalidateQueries({ queryKey: ["standings"] });
			queryClient.invalidateQueries({ queryKey: ["standings-admin", selectedTourneyId] });
		} catch (err) {
			toast.error(err.message || "Failed to reset match.");
		}
	}
	const allFixtures = fixturesQuery.data || [];
	const leagueFixtures = allFixtures.filter((f) => f.stage !== "knockout" && !f.round);
	const knockoutFixtures = allFixtures.filter((f) => f.stage === "knockout" || !!f.round);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel p-6 space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted-foreground label-caps",
					children: "Select Tournament"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: selectedTourneyId,
					onChange: (e) => {
						setSelectedTourneyId(e.target.value);
						setSelectedFixture(null);
					},
					className: "h-10 px-3 rounded-md border border-input bg-background text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "-- Choose Tournament --"
					}), tournaments.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: t.id,
						children: t.name
					}, t.id))]
				})]
			}), selectedTourneyId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: generateSchedule,
					variant: "outline",
					size: "sm",
					className: "gap-1",
					children: "⚽ Auto-Generate Round Robin"
				})
			})]
		}), selectedTourneyId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-[2fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold font-display tracking-wider",
							children: "Tournament Fixtures"
						}), allFixtures.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "destructive",
							onClick: deleteAllFixtures,
							className: "gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " Delete All Fixtures"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel p-4 space-y-3 border-dashed border-primary/40 bg-primary/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-primary label-caps uppercase tracking-wider",
								children: "Add Fixture Manually"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setNewStage("league"),
									className: `text-xs px-2.5 py-1 rounded font-semibold transition-colors ${newStage === "league" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`,
									children: "⚽ League / Round Robin"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setNewStage("knockout"),
									className: `text-xs px-2.5 py-1 rounded font-semibold transition-colors ${newStage === "knockout" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`,
									children: "🏆 Knockout Stage"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 sm:grid-cols-5 items-end",
							children: [
								newStage === "league" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] text-zinc-500 uppercase font-semibold",
									children: "Matchday #"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									value: newMatchday,
									onChange: (e) => setNewMatchday(parseInt(e.target.value) || 1),
									className: "w-full h-9 px-2 rounded-md border border-input bg-background text-sm"
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] text-zinc-500 uppercase font-semibold",
									children: "Knockout Round"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: newRound,
									onChange: (e) => setNewRound(e.target.value),
									className: "w-full h-9 px-2 rounded-md border border-input bg-background text-sm font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Semi Final",
											children: "Semi Final (Single Leg)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Semi Final - 1st Leg",
											children: "Semi Final - 1st Leg"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Semi Final - 2nd Leg",
											children: "Semi Final - 2nd Leg"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Quarter Final",
											children: "Quarter Final (Single Leg)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Quarter Final - 1st Leg",
											children: "Quarter Final - 1st Leg"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Quarter Final - 2nd Leg",
											children: "Quarter Final - 2nd Leg"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Final",
											children: "Final 🏆 (Single Leg)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Final - 1st Leg",
											children: "Final - 1st Leg 🏆"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Final - 2nd Leg",
											children: "Final - 2nd Leg 🏆"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Third Place",
											children: "3rd Place Match"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Round of 16",
											children: "Round of 16"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] text-zinc-500 uppercase font-semibold",
										children: "Home Team"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: newHomeId,
										onChange: (e) => setNewHomeId(e.target.value),
										className: "w-full h-9 px-2 rounded-md border border-input bg-background text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "-- TBD / Select Home --"
										}), tourneyTeamsQuery.data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: t.id,
											children: t.name
										}, t.id))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] text-zinc-500 uppercase font-semibold",
										children: "Away Team"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: newAwayId,
										onChange: (e) => setNewAwayId(e.target.value),
										className: "w-full h-9 px-2 rounded-md border border-input bg-background text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "-- TBD / Select Away --"
										}), tourneyTeamsQuery.data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: t.id,
											children: t.name
										}, t.id))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-span-2 sm:col-span-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "w-full h-9",
										size: "sm",
										onClick: addFixture,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5 mr-1" }),
											" Add ",
											newStage === "knockout" ? newRound : `Matchday ${newMatchday}`,
											" Match"
										]
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveStageTab("league"),
							className: `py-2 px-4 text-sm font-semibold border-b-2 transition-colors ${activeStageTab === "league" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
							children: [
								"⚽ Round Robin Matches (",
								leagueFixtures.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveStageTab("knockout"),
							className: `py-2 px-4 text-sm font-semibold border-b-2 transition-colors ${activeStageTab === "knockout" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
							children: [
								"🏆 Knockout Bracket & Finals (",
								knockoutFixtures.length,
								")"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4 max-h-[600px] overflow-y-auto pr-1",
						children: activeStageTab === "league" ? leagueFixtures.length > 0 ? [...new Set(leagueFixtures.map((f) => f.matchday ?? 0))].sort((a, b) => a - b).map((matchday) => {
							const group = leagueFixtures.filter((f) => (f.matchday ?? 0) === matchday);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border border-border/60 rounded-lg overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-secondary/30 px-4 py-2 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-sm font-bold tracking-wider text-primary",
										children: ["MATCHDAY ", matchday]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-zinc-500",
										children: [
											group.length,
											" match",
											group.length !== 1 ? "es" : ""
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
									className: "w-full text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-border/30",
										children: group.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-secondary/10 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-2.5 text-right font-semibold w-[35%]",
													children: f.home?.name || "TBD"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-2 py-2.5 text-center w-[12%]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `px-2 py-0.5 rounded text-xs font-bold ${f.status === "completed" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-primary/20 text-primary"}`,
														children: f.status === "completed" ? (() => {
															const { homePen, awayPen } = parseResultPenalties(f.result);
															return homePen !== null && awayPen !== null ? `${f.result?.home_score}-${f.result?.away_score} (${homePen}-${awayPen}p)` : `${f.result?.home_score} - ${f.result?.away_score}`;
														})() : "VS"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-2.5 text-left font-semibold w-[35%]",
													children: f.away?.name || "TBD"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-2 py-2.5 text-right w-[18%]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-end gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "secondary",
															className: "h-7 text-xs px-2",
															onClick: () => openScoreDialog(f),
															children: f.status === "completed" ? "Edit" : "Score"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "icon",
															variant: "ghost",
															className: "size-7 hover:text-destructive",
															onClick: () => deleteFixture(f.id),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
														})]
													})
												})
											]
										}, f.id))
									})
								})]
							}, matchday);
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground p-6 text-center",
							children: "No round robin league fixtures yet. Click \"Auto-Generate Round Robin\" or add manually above."
						}) : knockoutFixtures.length > 0 ? [.../* @__PURE__ */ new Set([...[
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
							"Final - 2nd Leg"
						], ...knockoutFixtures.map((f) => f.round).filter(Boolean)])].filter((r) => knockoutFixtures.some((f) => f.round === r)).map((roundName) => {
							const group = knockoutFixtures.filter((f) => f.round === roundName);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border border-primary/40 rounded-lg overflow-hidden bg-primary/5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-primary/20 px-4 py-2 flex items-center justify-between border-b border-primary/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-sm font-bold tracking-wider text-primary uppercase",
										children: roundName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-primary/80 font-semibold",
										children: [
											group.length,
											" match",
											group.length !== 1 ? "es" : ""
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
									className: "w-full text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-border/30",
										children: group.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-primary/10 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-2.5 text-right font-semibold w-[35%]",
													children: f.home?.name || "TBD"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-2 py-2.5 text-center w-[12%]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `px-2.5 py-0.5 rounded text-xs font-bold ${f.status === "completed" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-primary/20 text-primary border border-primary/30"}`,
														children: f.status === "completed" ? (() => {
															const { homePen, awayPen } = parseResultPenalties(f.result);
															return homePen !== null && awayPen !== null ? `${f.result?.home_score}-${f.result?.away_score} (${homePen}-${awayPen}p)` : `${f.result?.home_score} - ${f.result?.away_score}`;
														})() : "VS"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-2.5 text-left font-semibold w-[35%]",
													children: f.away?.name || "TBD"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-2 py-2.5 text-right w-[18%]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-end gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "secondary",
															className: "h-7 text-xs px-2 border border-primary/40",
															onClick: () => openScoreDialog(f),
															children: f.status === "completed" ? "Edit" : "Score"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "icon",
															variant: "ghost",
															className: "size-7 hover:text-destructive",
															onClick: () => deleteFixture(f.id),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
														})]
													})
												})
											]
										}, f.id))
									})
								})]
							}, roundName);
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground p-6 text-center",
							children: "No knockout fixtures yet. Click \"Auto-Generate Top 4 Knockout\" or select \"Knockout Stage\" in the manual form above."
						})
					})
				]
			}), selectedFixture && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-6 space-y-4 h-fit border-primary/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-lg font-bold font-display tracking-wider",
					children: ["Record Score — ", selectedFixture.stage === "knockout" ? selectedFixture.round : `Matchday ${selectedFixture.matchday}`]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleRecordScore,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 p-3 border border-border/70 rounded-lg bg-secondary/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-primary label-caps block",
									children: selectedFixture.home?.name || "Home Team (TBD)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] text-muted-foreground uppercase font-semibold",
										children: "Goals Scored"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										required: true,
										value: homeScore,
										onChange: (e) => setHomeScore(parseInt(e.target.value) || 0)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] text-yellow-400 uppercase font-semibold flex items-center gap-1",
										children: "🟨 Yellow Cards"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										value: homeYellow,
										onChange: (e) => setHomeYellow(parseInt(e.target.value) || 0),
										className: "h-8 text-xs border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] text-red-400 uppercase font-semibold flex items-center gap-1",
										children: "🟥 Red Cards"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										value: homeRed,
										onChange: (e) => setHomeRed(parseInt(e.target.value) || 0),
										className: "h-8 text-xs border-red-500/40 bg-red-500/10 text-red-400"
									})] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 p-3 border border-border/70 rounded-lg bg-secondary/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-primary label-caps block",
									children: selectedFixture.away?.name || "Away Team (TBD)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] text-muted-foreground uppercase font-semibold",
										children: "Goals Scored"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										required: true,
										value: awayScore,
										onChange: (e) => setAwayScore(parseInt(e.target.value) || 0)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] text-yellow-400 uppercase font-semibold flex items-center gap-1",
										children: "🟨 Yellow Cards"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										value: awayYellow,
										onChange: (e) => setAwayYellow(parseInt(e.target.value) || 0),
										className: "h-8 text-xs border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] text-red-400 uppercase font-semibold flex items-center gap-1",
										children: "🟥 Red Cards"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										value: awayRed,
										onChange: (e) => setAwayRed(parseInt(e.target.value) || 0),
										className: "h-8 text-xs border-red-500/40 bg-red-500/10 text-red-400"
									})] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 border border-amber-500/40 rounded-lg bg-amber-500/10 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5",
									children: "🏆 Penalty Shootout (Tiebreaker)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: enablePenalties,
									onChange: (e) => setEnablePenalties(e.target.checked),
									className: "size-4 rounded accent-primary cursor-pointer"
								})]
							}), enablePenalties && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-[10px] text-amber-300 font-semibold uppercase",
									children: [selectedFixture.home?.short_name || "Home", " Penalties"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: homePenalties,
									onChange: (e) => setHomePenalties(parseInt(e.target.value) || 0),
									className: "h-8 text-xs border-amber-500/40 bg-amber-500/20 text-amber-300 font-bold"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-[10px] text-amber-300 font-semibold uppercase",
									children: [selectedFixture.away?.short_name || "Away", " Penalties"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: awayPenalties,
									onChange: (e) => setAwayPenalties(parseInt(e.target.value) || 0),
									className: "h-8 text-xs border-amber-500/40 bg-amber-500/20 text-amber-300 font-bold"
								})] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								children: "Save Score & Cards"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [selectedFixture.status === "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									className: "flex-1 text-destructive border-destructive/40 hover:bg-destructive/10",
									onClick: handleResetScore,
									children: "Reset Match (Unplay)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									className: selectedFixture.status === "completed" ? "" : "w-full",
									onClick: () => setSelectedFixture(null),
									children: "Cancel"
								})]
							})]
						})
					]
				})]
			})]
		})]
	});
}
function SettingsTabContent({ config, onUpdate }) {
	const [youtubeUrl, setYoutubeUrl] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (config) setYoutubeUrl(config.youtube_live_url || "");
	}, [config]);
	async function handleSave(e) {
		e.preventDefault();
		setLoading(true);
		try {
			await onUpdate({ youtube_live_url: youtubeUrl });
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl panel p-6 space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold font-display tracking-wider",
			children: "Global Settings"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: "Configure global streaming and tournament configurations"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSave,
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground label-caps",
						children: "YouTube Live Stream / Video URL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: youtubeUrl,
						onChange: (e) => setYoutubeUrl(e.target.value),
						placeholder: "e.g. https://www.youtube.com/watch?v=... or channel URL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[0.7rem] text-muted-foreground",
						children: "Paste any active YouTube Live Stream link, video URL, or your channel link. The home page banner will automatically embed and link to it."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled: loading,
				children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-4 mr-2" }), "Save Settings"]
			})]
		})]
	});
}
function StandingsTabContent({ tournaments, teams, onSelectTab }) {
	const [selectedTourneyId, setSelectedTourneyId] = (0, import_react.useState)("");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [showNewTourney, setShowNewTourney] = (0, import_react.useState)(false);
	const [newTourneyName, setNewTourneyName] = (0, import_react.useState)("");
	const [newTourneyYear, setNewTourneyYear] = (0, import_react.useState)(2025);
	const queryClient = useQueryClient();
	const standingsQuery = useQuery({
		queryKey: ["standings-admin", selectedTourneyId],
		queryFn: () => fetchStandings(selectedTourneyId),
		enabled: !!selectedTourneyId
	});
	(0, import_react.useEffect)(() => {
		if (!selectedTourneyId) {
			setRows([]);
			return;
		}
		if (standingsQuery.data && standingsQuery.data.length > 0) {
			const sorted = [...standingsQuery.data].sort((a, b) => b.points - a.points || b.goal_difference - a.goal_difference || b.goals_for - a.goals_for);
			setRows(sorted);
		} else {
			const initial = teams.map((t) => ({
				tournament_id: selectedTourneyId,
				team_id: t.id,
				played: 0,
				wins: 0,
				draws: 0,
				losses: 0,
				goals_for: 0,
				goals_against: 0,
				goal_difference: 0,
				yellow_cards: 0,
				red_cards: 0,
				points: 0
			}));
			setRows(initial);
		}
	}, [
		selectedTourneyId,
		standingsQuery.data,
		teams
	]);
	function deleteRow(index) {
		setRows(rows.filter((_, i) => i !== index));
	}
	function updateRowField(index, field, value) {
		const updated = [...rows];
		updated[index] = {
			...updated[index],
			[field]: value
		};
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
	async function handleCreatePastTournament(e) {
		e.preventDefault();
		if (!newTourneyName.trim()) {
			toast.error("Enter tournament name.");
			return;
		}
		setLoading(true);
		try {
			const trimmedName = newTourneyName.trim();
			const baseSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
			const existing = tournaments.find((t) => t.slug === baseSlug || t.name.toLowerCase() === trimmedName.toLowerCase());
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
				points_win: 3,
				points_draw: 1,
				points_loss: 0,
				organizer: "TFF",
				is_demo: false
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
						points_win: 3,
						points_draw: 1,
						points_loss: 0,
						organizer: "TFF",
						is_demo: false
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
		} catch (err) {
			toast.error(err.message || "Failed to create tournament.");
		} finally {
			setLoading(false);
		}
	}
	async function handleSave(e) {
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
				points: Number(r.points) || 0
			}));
			saveManualStandings(selectedTourneyId, validRows);
			for (const r of validRows) await supabase.from("tournament_teams").upsert([{
				tournament_id: selectedTourneyId,
				team_id: r.team_id
			}], { onConflict: "tournament_id,team_id" });
			toast.success("Standings table saved successfully!");
			queryClient.invalidateQueries({ queryKey: ["standings-admin", selectedTourneyId] });
			queryClient.invalidateQueries({ queryKey: ["standings", selectedTourneyId] });
			queryClient.invalidateQueries({ queryKey: ["all-standings"] });
			queryClient.invalidateQueries({ queryKey: ["tourney-teams-admin", selectedTourneyId] });
		} catch (err) {
			toast.error(err.message || "Failed to save standings.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-6 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold font-display tracking-wider",
						children: "Tournament Standings Editor"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Directly edit or import final standings table for any tournament"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => setShowNewTourney(!showNewTourney),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add Past Tournament"]
					})
				})]
			}),
			showNewTourney && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-5 space-y-4 border-primary/40 bg-primary/5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold font-display tracking-wider text-primary uppercase",
					children: "Create Past Tournament Record"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleCreatePastTournament,
					className: "grid gap-3 sm:grid-cols-3 items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 sm:col-span-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] text-muted-foreground uppercase font-semibold",
								children: "Tournament Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								placeholder: "e.g. TCL SEASON 1",
								value: newTourneyName,
								onChange: (e) => setNewTourneyName(e.target.value),
								className: "h-9"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 sm:col-span-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] text-muted-foreground uppercase font-semibold",
								children: "Season / Year"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 2015,
								max: 2030,
								value: newTourneyYear,
								onChange: (e) => setNewTourneyYear(parseInt(e.target.value) || 2025),
								className: "w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 sm:col-span-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								size: "sm",
								disabled: loading,
								className: "flex-1",
								children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-3.5 mr-1" }), "Add & Continue"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								onClick: () => setShowNewTourney(false),
								children: "Cancel"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground label-caps",
						children: "Select Tournament"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: selectedTourneyId,
						onChange: (e) => setSelectedTourneyId(e.target.value),
						className: "w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "— Choose Tournament —"
						}), tournaments.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: t.id,
							children: [
								t.name,
								" (",
								t.season_year || "Past",
								")"
							]
						}, t.id))]
					})]
				}), selectedTourneyId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSave,
					className: "space-y-4 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto border border-border/70 rounded-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-secondary/40 text-xs font-semibold label-caps text-muted-foreground border-b border-border/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 text-left w-8",
										children: "#"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 text-left min-w-[180px]",
										children: "Team"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-center w-14",
										children: "P"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-center w-14",
										children: "W"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-center w-14",
										children: "D"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-center w-14",
										children: "L"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-center w-16",
										children: "GF"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-center w-16",
										children: "GA"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-center w-16",
										children: "GD"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-center w-14 text-yellow-400",
										title: "Yellow Cards",
										children: "YC"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-center w-14 text-red-400",
										title: "Red Cards",
										children: "RC"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-2 py-2 text-center w-20",
										children: "PTS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-2 py-2 text-center w-10" })
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/40",
								children: rows.map((row, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-secondary/10 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-muted-foreground font-display text-base",
											children: idx + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 font-semibold",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: row.team_id,
												onChange: (e) => updateRowField(idx, "team_id", e.target.value),
												className: "w-full h-8 px-2 rounded border border-input bg-background text-xs font-semibold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "— Select Team —"
												}), teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: t.id,
													children: t.name
												}, t.id))]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1 py-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												value: row.played ?? 0,
												onChange: (e) => updateRowField(idx, "played", e.target.value),
												className: "w-12 h-8 text-center rounded border border-input bg-background text-xs font-semibold"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1 py-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												value: row.wins ?? 0,
												onChange: (e) => updateRowField(idx, "wins", e.target.value),
												className: "w-12 h-8 text-center rounded border border-input bg-background text-xs font-semibold text-green-400"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1 py-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												value: row.draws ?? 0,
												onChange: (e) => updateRowField(idx, "draws", e.target.value),
												className: "w-12 h-8 text-center rounded border border-input bg-background text-xs font-semibold text-yellow-400"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1 py-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												value: row.losses ?? 0,
												onChange: (e) => updateRowField(idx, "losses", e.target.value),
												className: "w-12 h-8 text-center rounded border border-input bg-background text-xs font-semibold text-red-400"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1 py-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												value: row.goals_for ?? 0,
												onChange: (e) => updateRowField(idx, "goals_for", e.target.value),
												className: "w-14 h-8 text-center rounded border border-input bg-background text-xs font-semibold"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1 py-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												value: row.goals_against ?? 0,
												onChange: (e) => updateRowField(idx, "goals_against", e.target.value),
												className: "w-14 h-8 text-center rounded border border-input bg-background text-xs font-semibold"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1 py-2 text-center font-bold text-xs",
											children: row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1 py-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												value: row.yellow_cards ?? 0,
												onChange: (e) => updateRowField(idx, "yellow_cards", e.target.value),
												className: "w-12 h-8 text-center rounded border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 text-xs font-semibold"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1 py-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												value: row.red_cards ?? 0,
												onChange: (e) => updateRowField(idx, "red_cards", e.target.value),
												className: "w-12 h-8 text-center rounded border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-semibold"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1 py-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												value: row.points ?? 0,
												onChange: (e) => updateRowField(idx, "points", e.target.value),
												className: "w-16 h-8 text-center rounded border border-primary/40 bg-primary/10 text-primary font-bold text-sm"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												size: "icon",
												variant: "ghost",
												onClick: () => deleteRow(idx),
												className: "size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
												title: "Delete row",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
											})
										})
									]
								}, idx))
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => setRows([...rows, {
								tournament_id: selectedTourneyId,
								team_id: "",
								played: 0,
								wins: 0,
								draws: 0,
								losses: 0,
								goals_for: 0,
								goals_against: 0,
								goal_difference: 0,
								yellow_cards: 0,
								red_cards: 0,
								points: 0
							}]),
							children: "+ Add Row"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: loading,
							size: "lg",
							children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-4 mr-2" }), "Save Standings Table"]
						})]
					})]
				})]
			})
		]
	});
}
function ChampionsTabContent({ tournaments, teams, onSelectTab }) {
	const [selectedTourneyId, setSelectedTourneyId] = (0, import_react.useState)("");
	const [championId, setChampionId] = (0, import_react.useState)("");
	const [runnerUpId, setRunnerUpId] = (0, import_react.useState)("");
	const [thirdPlaceId, setThirdPlaceId] = (0, import_react.useState)("");
	const [finalScore, setFinalScore] = (0, import_react.useState)("");
	const [mvp, setMvp] = (0, import_react.useState)("");
	const [topScorer, setTopScorer] = (0, import_react.useState)("");
	const [bestGoalPlayer, setBestGoalPlayer] = (0, import_react.useState)("");
	const [bestGoalTeamId, setBestGoalTeamId] = (0, import_react.useState)("");
	const [bestGoalDescription, setBestGoalDescription] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [showNewTourney, setShowNewTourney] = (0, import_react.useState)(false);
	const [newTourneyName, setNewTourneyName] = (0, import_react.useState)("");
	const [newTourneyYear, setNewTourneyYear] = (0, import_react.useState)(2025);
	const queryClient = useQueryClient();
	const championsQuery = useQuery({
		queryKey: ["champions-admin"],
		queryFn: fetchChampions
	});
	const tourneyTeamsQuery = useQuery({
		queryKey: ["tourney-teams-champions", selectedTourneyId],
		queryFn: () => fetchTournamentTeams(selectedTourneyId),
		enabled: !!selectedTourneyId
	});
	(0, import_react.useEffect)(() => {
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
			setChampionId("");
			setRunnerUpId("");
			setThirdPlaceId("");
			setFinalScore("");
			setMvp("");
			setTopScorer("");
		}
		const award = getTournamentAwards(selectedTourneyId);
		if (award) {
			setBestGoalPlayer(award.best_goal_player ?? "");
			setBestGoalTeamId(award.best_goal_team_id ?? "");
			setBestGoalDescription(award.best_goal_description ?? "");
		} else {
			setBestGoalPlayer("");
			setBestGoalTeamId("");
			setBestGoalDescription("");
		}
	}, [selectedTourneyId, championsQuery.data]);
	async function handleCreatePastTournament(e) {
		e.preventDefault();
		if (!newTourneyName.trim()) {
			toast.error("Enter a tournament name (e.g. TCL SEASON 1)");
			return;
		}
		setLoading(true);
		try {
			const trimmedName = newTourneyName.trim();
			const baseSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
			const existing = tournaments.find((t) => t.slug === baseSlug || t.name.toLowerCase() === trimmedName.toLowerCase());
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
				points_win: 3,
				points_draw: 1,
				points_loss: 0,
				organizer: "TFF",
				is_demo: false
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
						points_win: 3,
						points_draw: 1,
						points_loss: 0,
						organizer: "TFF",
						is_demo: false
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
		} catch (err) {
			toast.error(err.message || "Failed to create tournament.");
		} finally {
			setLoading(false);
		}
	}
	async function handleSave(e) {
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
				top_scorer: topScorer || null
			};
			if (existing) {
				const { error } = await supabase.from("champions").update(payload).eq("id", existing.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("champions").insert([payload]);
				if (error) throw error;
			}
			saveTournamentAwards(selectedTourneyId, {
				tournament_id: selectedTourneyId,
				best_goal_player: bestGoalPlayer || null,
				best_goal_team_id: bestGoalTeamId || null,
				best_goal_description: bestGoalDescription || null
			});
			toast.success("Hall of Champions & Tournament Awards updated!");
			queryClient.invalidateQueries({ queryKey: ["champions-admin"] });
			queryClient.invalidateQueries({ queryKey: ["champions"] });
			queryClient.invalidateQueries({ queryKey: ["all-standings"] });
		} catch (err) {
			toast.error(err.message || "Failed to save champion.");
		} finally {
			setLoading(false);
		}
	}
	async function handleDelete() {
		if (!selectedTourneyId) return;
		const existing = championsQuery.data?.find((c) => c.tournament_id === selectedTourneyId);
		if (!existing) {
			toast.error("No champion record to delete.");
			return;
		}
		if (!confirm("Remove this champion record from Hall of Champions?")) return;
		try {
			const { error } = await supabase.from("champions").delete().eq("id", existing.id);
			if (error) throw error;
			toast.success("Champion record removed.");
			setChampionId("");
			setRunnerUpId("");
			setThirdPlaceId("");
			setFinalScore("");
			setMvp("");
			setTopScorer("");
			setBestGoalPlayer("");
			setBestGoalTeamId("");
			setBestGoalDescription("");
			queryClient.invalidateQueries({ queryKey: ["champions-admin"] });
			queryClient.invalidateQueries({ queryKey: ["champions"] });
		} catch (err) {
			toast.error(err.message || "Failed to delete.");
		}
	}
	const existing = championsQuery.data?.find((c) => c.tournament_id === selectedTourneyId);
	const availableTeams = tourneyTeamsQuery.data && tourneyTeamsQuery.data.length > 0 ? tourneyTeamsQuery.data : teams;
	const teamSelect = (label, value, setter, emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "text-xs text-muted-foreground label-caps",
			children: [
				emoji,
				" ",
				label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value,
			onChange: (e) => setter(e.target.value),
			className: "w-full h-9 px-3 rounded-md border border-input bg-background text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "",
				children: "— Select Team —"
			}), availableTeams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: t.id,
				children: t.name
			}, t.id))]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-6 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold font-display tracking-wider",
						children: "Hall of Champions & Tournament Awards"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Record tournament winners and special awards (Goal of the Tournament, MVP)"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => setShowNewTourney(!showNewTourney),
					className: "gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add Past Tournament"]
				})]
			}),
			showNewTourney && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-5 space-y-4 border-primary/40 bg-primary/5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold font-display tracking-wider text-primary uppercase",
					children: "Create Past Tournament Record"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleCreatePastTournament,
					className: "grid gap-3 sm:grid-cols-3 items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 sm:col-span-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] text-muted-foreground uppercase font-semibold",
								children: "Tournament Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								placeholder: "e.g. TCL SEASON 1",
								value: newTourneyName,
								onChange: (e) => setNewTourneyName(e.target.value),
								className: "h-9"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 sm:col-span-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] text-muted-foreground uppercase font-semibold",
								children: "Season / Year"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 2015,
								max: 2030,
								value: newTourneyYear,
								onChange: (e) => setNewTourneyYear(parseInt(e.target.value) || 2025),
								className: "w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 sm:col-span-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								size: "sm",
								disabled: loading,
								className: "flex-1",
								children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-3.5 mr-1" }), "Add & Continue"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								onClick: () => setShowNewTourney(false),
								children: "Cancel"
							})]
						})
					]
				})]
			}),
			championsQuery.data && championsQuery.data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-4 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-semibold text-muted-foreground label-caps",
					children: [
						"Existing Champion Records (",
						championsQuery.data.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1",
					children: championsQuery.data.map((c) => {
						const tourney = tournaments.find((t) => t.id === c.tournament_id);
						const champ = teams.find((t) => t.id === c.champion_team_id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${selectedTourneyId === c.tournament_id ? "bg-primary/15 border border-primary/30" : "hover:bg-secondary/30"}`,
							onClick: () => setSelectedTourneyId(c.tournament_id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: tourney?.name ?? c.tournament_id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-primary font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-3.5" }), champ?.name ?? "—"]
							})]
						}, c.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-6 space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground label-caps",
							children: "Select Tournament"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: selectedTourneyId,
							onChange: (e) => setSelectedTourneyId(e.target.value),
							className: "w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "— Select Tournament —"
							}), tournaments.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: t.id,
								children: [
									t.name,
									" (",
									t.season_year || "Past",
									")"
								]
							}, t.id))]
						}),
						existing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[0.75rem] text-green-400 font-medium pt-1",
							children: "✓ Champion record exists — editing it"
						}),
						selectedTourneyId && !existing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[0.75rem] text-muted-foreground pt-1",
							children: "No champion record saved for this tournament yet — fill fields below to save"
						})
					]
				}), selectedTourneyId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSave,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-3",
							children: [
								teamSelect("Champion 🏆", championId, setChampionId, "🥇"),
								teamSelect("Runner-Up", runnerUpId, setRunnerUpId, "🥈"),
								teamSelect("3rd Place", thirdPlaceId, setThirdPlaceId, "🥉")
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs text-muted-foreground label-caps",
										children: "⚽ Final Score"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. 2 - 1",
										value: finalScore,
										onChange: (e) => setFinalScore(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs text-muted-foreground label-caps",
										children: "⭐ MVP Player"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Player name",
										value: mvp,
										onChange: (e) => setMvp(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs text-muted-foreground label-caps",
										children: "🎯 Top Scorer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Player name",
										value: topScorer,
										onChange: (e) => setTopScorer(e.target.value)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel p-4 space-y-3 bg-amber-500/5 border-amber-500/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-amber-400 label-caps uppercase tracking-wider",
									children: "🚀 Best Goal of the Tournament Award"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[10px] text-muted-foreground uppercase font-semibold",
											children: "Goalscorer Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "e.g. Arnold Exe",
											value: bestGoalPlayer,
											onChange: (e) => setBestGoalPlayer(e.target.value),
											className: "h-9"
										})]
									}), teamSelect("Goalscorer Team", bestGoalTeamId, setBestGoalTeamId, "🛡️")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] text-muted-foreground uppercase font-semibold",
										children: "Goal Details / Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. 89th min bicycle kick vs Johor FC in the Final",
										value: bestGoalDescription,
										onChange: (e) => setBestGoalDescription(e.target.value),
										className: "h-9"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: loading,
								children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-4 mr-2" }), existing ? "Update Champion & Awards Record" : "Save Tournament Honors & Awards"]
							}), existing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "destructive",
								size: "sm",
								onClick: handleDelete,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5 mr-1" }), " Delete Record"]
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { AdminPage as component };
