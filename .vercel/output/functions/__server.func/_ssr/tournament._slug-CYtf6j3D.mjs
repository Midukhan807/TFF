import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { E as Info, H as Award, O as Goal, V as CalendarDays, c as Trophy, f as Sparkles, j as Flame, m as Shield } from "../_libs/lucide-react.mjs";
import { D as getTournamentAwards, N as sortStandings, P as TABS, R as TeamLogo, _ as fetchTournamentBySlug, f as fetchPlayerStats, i as FORMAT_LABELS, l as fetchChampions, m as fetchStandings, n as Route, o as calculateTournamentMVP, u as fetchFixtures, v as fetchTournamentTeams, x as formatDate } from "./router-BD6uxmJI.mjs";
import { a as StandingsTable, c as TeamCard, n as FixtureCard, o as StatCard, r as ResultCard, s as StatusBadge, t as EmptyState } from "./ui-CA5ZAn3t.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-DO3DZj4v.mjs";
import { n as KnockoutBracket, t as ChampionCard } from "./trophy-7cgQCfQW.mjs";
import { t as Progress } from "./progress-ChzuiZwr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tournament._slug-CYtf6j3D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TournamentAwardsSection({ tournament, completedFixtures, standings, teamsMap, champion, playerStats = [] }) {
	const customAward = getTournamentAwards(tournament.id);
	const ranked = sortStandings(standings);
	const topScoringTeamRow = [...ranked].sort((a, b) => b.goals_for - a.goals_for)[0];
	const bestDefenseTeamRow = [...ranked].sort((a, b) => a.goals_against - b.goals_against)[0];
	const topScoringTeam = topScoringTeamRow?.team_id ? teamsMap.get(topScoringTeamRow.team_id) : null;
	const bestDefenseTeam = bestDefenseTeamRow?.team_id ? teamsMap.get(bestDefenseTeamRow.team_id) : null;
	const bestGoalTeam = customAward?.best_goal_team_id ? teamsMap.get(customAward.best_goal_team_id) : null;
	const matchThriller = [...completedFixtures].sort((a, b) => (b.result?.home_score ?? 0) + (b.result?.away_score ?? 0) - ((a.result?.home_score ?? 0) + (a.result?.away_score ?? 0)))[0];
	const autoMVP = calculateTournamentMVP(playerStats, champion?.champion_team_id);
	const mvpTeam = autoMVP?.player.team_id ? teamsMap.get(autoMVP.player.team_id) : null;
	const topPlayerStat = [...playerStats].sort((a, b) => b.goals - a.goals)[0];
	customAward?.top_scorer_player || topPlayerStat?.player_name || champion?.top_scorer;
	const mvpName = champion?.mvp || autoMVP?.player.player_name || "TBD";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-primary/10 to-purple-500/10 border border-amber-500/30 p-6 sm:p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-amber-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-caps font-semibold",
							children: "Official Honors"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-3xl sm:text-4xl uppercase tracking-wider text-white mt-1",
						children: [tournament.name, " — Tournament Awards"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Celebrating outstanding team performances, spectacular goals, top scorers, and tournament MVPs."
					})
				] })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel relative overflow-hidden p-6 border-purple-500/40 bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent sm:col-span-2 lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-purple-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-caps font-semibold",
									children: "Tournament MVP (Most Valuable Player)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-display uppercase tracking-wider font-bold",
								children: "👑 TOP PERFORMER"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
									name: mvpTeam?.name ?? "TFF",
									shortName: mvpTeam?.short_name,
									color: mvpTeam?.team_color,
									logoUrl: mvpTeam?.logo_url,
									size: "xl"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-3xl sm:text-4xl text-white font-bold tracking-wide",
									children: mvpName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-purple-400 font-semibold mt-0.5",
									children: mvpTeam?.name ? mvpTeam.name : "Triad Football Federation"
								})] })]
							}), autoMVP && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 bg-zinc-950/80 p-3 rounded-xl border border-purple-500/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center px-3 border-r border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-2xl text-purple-400 font-bold",
										children: autoMVP.score
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground uppercase font-semibold",
										children: "MVP Rating"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs space-y-0.5 text-zinc-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"⭐ ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: autoMVP.player.motm || 0 }),
										" MOTM Awards"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"⚽ ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: autoMVP.player.goals || 0 }),
										" Goals · 🎯 ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: autoMVP.player.assists || 0 }),
										" Assists"
									] })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted-foreground bg-zinc-900/60 p-3 rounded-lg border border-border/40",
							children: "Calculated automatically using weighted performance metrics: MOTM awards (10pts), Goals (3pts), Assists (2pts), Fair Play cards (-1pt YC / -3pts RC), plus Champion team multiplier bonus."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel relative overflow-hidden p-6 border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-transparent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-amber-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-caps font-semibold",
									children: "Goal of the Tournament"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-display",
								children: "SPECTACULAR"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
								name: bestGoalTeam?.name ?? "TFF",
								shortName: bestGoalTeam?.short_name,
								color: bestGoalTeam?.team_color,
								logoUrl: bestGoalTeam?.logo_url,
								size: "lg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl text-white",
								children: customAward?.best_goal_player || "Nomination Open"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-amber-400/90 font-medium",
								children: bestGoalTeam?.name || "TFF League Match"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted-foreground line-clamp-3 bg-zinc-900/60 p-3 rounded-lg border border-border/40",
							children: customAward?.best_goal_description || "Awarded for the most technical, powerful, or decisive goal scored during this tournament edition."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel relative overflow-hidden p-6 border-primary/40 bg-gradient-to-b from-primary/5 to-transparent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Goal, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-caps font-semibold",
									children: "Top Scoring Team"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-display",
								children: "ATTACKING POWER"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
								name: topScoringTeam?.name ?? "TBD",
								shortName: topScoringTeam?.short_name,
								color: topScoringTeam?.team_color,
								logoUrl: topScoringTeam?.logo_url,
								size: "lg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl text-white",
								children: topScoringTeam?.name ?? "To be determined"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-primary font-medium",
								children: topScoringTeamRow ? `${topScoringTeamRow.goals_for} Goals Scored` : "0 Goals"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted-foreground bg-zinc-900/60 p-3 rounded-lg border border-border/40",
							children: "Awarded to the team with the highest total goal output across all tournament matches."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel relative overflow-hidden p-6 border-blue-500/40 bg-gradient-to-b from-blue-500/5 to-transparent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-blue-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-caps font-semibold",
									children: "Best Defensive Team"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-display",
								children: "IRON DEFENSE"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
								name: bestDefenseTeam?.name ?? "TBD",
								shortName: bestDefenseTeam?.short_name,
								color: bestDefenseTeam?.team_color,
								logoUrl: bestDefenseTeam?.logo_url,
								size: "lg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl text-white",
								children: bestDefenseTeam?.name ?? "To be determined"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-blue-400 font-medium",
								children: bestDefenseTeamRow ? `${bestDefenseTeamRow.goals_against} Goals Conceded` : "0 Conceded"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted-foreground bg-zinc-900/60 p-3 rounded-lg border border-border/40",
							children: "Awarded to the side maintaining the tightest defensive record with the fewest goals conceded."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel relative overflow-hidden p-6 border-cyan-500/40 bg-gradient-to-b from-cyan-500/5 to-transparent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-cyan-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-caps font-semibold",
								children: "Golden Glove (Clean Sheets)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-display",
							children: "SHUTOUT KING 🧤"
						})]
					}), (() => {
						const cleanSheetsMap = /* @__PURE__ */ new Map();
						for (const f of completedFixtures) if (f.status === "completed" && f.result) {
							if (f.home_team_id) {
								if (!cleanSheetsMap.has(f.home_team_id)) cleanSheetsMap.set(f.home_team_id, 0);
								if ((f.result.away_score ?? 0) === 0) cleanSheetsMap.set(f.home_team_id, cleanSheetsMap.get(f.home_team_id) + 1);
							}
							if (f.away_team_id) {
								if (!cleanSheetsMap.has(f.away_team_id)) cleanSheetsMap.set(f.away_team_id, 0);
								if ((f.result.home_score ?? 0) === 0) cleanSheetsMap.set(f.away_team_id, cleanSheetsMap.get(f.away_team_id) + 1);
							}
						}
						let topCleanSheetTeamId = "";
						let maxCleanSheets = 0;
						for (const [teamId, count] of cleanSheetsMap.entries()) if (count > maxCleanSheets) {
							maxCleanSheets = count;
							topCleanSheetTeamId = teamId;
						}
						const cleanSheetTeam = topCleanSheetTeamId ? teamsMap.get(topCleanSheetTeamId) : null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
								name: cleanSheetTeam?.name ?? "TBD",
								shortName: cleanSheetTeam?.short_name,
								color: cleanSheetTeam?.team_color,
								logoUrl: cleanSheetTeam?.logo_url,
								size: "lg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl text-white",
								children: cleanSheetTeam?.name ?? "To be determined"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-cyan-400 font-medium",
								children: [
									maxCleanSheets,
									" Clean Sheet",
									maxCleanSheets !== 1 ? "s" : ""
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted-foreground bg-zinc-900/60 p-3 rounded-lg border border-border/40",
							children: "Awarded to the team with the most shutouts (zero goals conceded in a match) across all fixtures."
						})] });
					})()]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel relative overflow-hidden p-6 border-emerald-500/40 bg-gradient-to-b from-emerald-500/5 to-transparent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-emerald-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-caps font-semibold",
								children: "Highest Scoring Match"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-display",
							children: "THRILLER"
						})]
					}), matchThriller ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between bg-zinc-900/80 p-3 rounded-lg border border-border/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
										name: matchThriller.home?.name ?? "",
										shortName: matchThriller.home?.short_name,
										color: matchThriller.home?.team_color,
										logoUrl: matchThriller.home?.logo_url,
										size: "sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-sm",
										children: matchThriller.home?.name
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-display text-lg text-primary font-bold",
									children: [
										matchThriller.result?.home_score,
										" – ",
										matchThriller.result?.away_score
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-sm",
										children: matchThriller.away?.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
										name: matchThriller.away?.name ?? "",
										shortName: matchThriller.away?.short_name,
										color: matchThriller.away?.team_color,
										logoUrl: matchThriller.away?.logo_url,
										size: "sm"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Total goals: ", (matchThriller.result?.home_score ?? 0) + (matchThriller.result?.away_score ?? 0)]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-sm text-muted-foreground",
						children: "No completed match recorded yet."
					})]
				})
			]
		})]
	});
}
function TournamentDetail() {
	const { slug } = Route.useParams();
	const { tab } = Route.useSearch();
	const navigate = Route.useNavigate();
	const tournamentQuery = useQuery({
		queryKey: ["tournament", slug],
		queryFn: () => fetchTournamentBySlug(slug)
	});
	const tournament = tournamentQuery.data;
	const id = tournament?.id;
	const teams = useQuery({
		queryKey: ["tournament-teams", id],
		queryFn: () => fetchTournamentTeams(id),
		enabled: !!id
	});
	const fixtures = useQuery({
		queryKey: ["fixtures", id],
		queryFn: () => fetchFixtures(id),
		enabled: !!id
	});
	const standings = useQuery({
		queryKey: ["standings", id],
		queryFn: () => fetchStandings(id),
		enabled: !!id
	});
	const players = useQuery({
		queryKey: ["player-stats", id],
		queryFn: () => fetchPlayerStats(id),
		enabled: !!id
	});
	const champions = useQuery({
		queryKey: ["champions"],
		queryFn: fetchChampions
	});
	if (tournamentQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-24 text-muted-foreground",
		children: "Loading..."
	});
	if (!tournament) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-4 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Tournament not found",
			description: "This TFF tournament does not exist."
		})
	});
	const allFixtures = fixtures.data ?? [];
	const league = allFixtures.filter((f) => f.stage === "league");
	const knockout = allFixtures.filter((f) => f.stage === "knockout");
	const completed = allFixtures.filter((f) => f.status === "completed" && f.result);
	const upcoming = allFixtures.filter((f) => f.status === "scheduled");
	const ranked = sortStandings(standings.data ?? [], tournament.tiebreakers);
	const teamMap = new Map((teams.data ?? []).map((t) => [t.id, t]));
	const leader = ranked[0] ? teamMap.get(ranked[0].team_id) : null;
	const champion = (champions.data ?? []).find((c) => c.tournament_id === tournament.id);
	const goals = completed.reduce((sum, f) => sum + ((f.result?.home_score ?? 0) + (f.result?.away_score ?? 0)), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "relative overflow-hidden border-b border-border/70 min-h-[220px] flex items-end",
		children: [tournament.banner_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 z-0 overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: tournament.banner_url,
					alt: tournament.name,
					className: "w-full h-full object-cover object-center opacity-40 blur-[1px] scale-105"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/30" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" })
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 z-0 opacity-50",
			style: { background: "radial-gradient(90% 120% at 15% 0%, oklch(0.34 0.08 84 / 55%), transparent 60%), var(--gradient-surface)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 w-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-5",
				children: [tournament.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: tournament.logo_url,
					alt: tournament.name,
					className: "size-20 rounded-2xl object-contain border border-primary/40 p-2 bg-zinc-950/80 shadow-lg"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display grid size-20 place-items-center rounded-2xl border border-primary/40 text-xl text-primary",
					style: { background: "var(--gradient-surface)" },
					children: "TFF"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: tournament.status }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-4xl uppercase font-display tracking-wider sm:text-5xl",
						children: tournament.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-3.5" }),
									formatDate(tournament.start_date),
									" — ",
									formatDate(tournament.end_date)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-3.5" }),
									teams.data?.length ?? 0,
									" Teams"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: FORMAT_LABELS[tournament.format] })
						]
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				value: tab,
				onValueChange: (value) => navigate({
					to: ".",
					search: (prev) => ({
						...prev,
						tab: value
					})
				}),
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
					className: "flex-wrap",
					children: TABS.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value,
						className: "capitalize",
						children: value
					}, value))
				})
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6",
		children: [
			tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8",
				children: [
					champion && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChampionCard, {
						tournament,
						champion,
						teams: teamMap,
						featured: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Teams",
								value: teams.data?.length ?? 0,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Matches Played",
								value: `${completed.length} / ${allFixtures.length}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Goals",
								value: goals,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Goal, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Current Leader",
								value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl",
									children: leader?.name ?? "—"
								}),
								hint: `${ranked[0]?.points ?? 0} points`,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-[1.2fr_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "label-caps mb-4 flex items-center gap-2 text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4" }), " Tournament Information"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "grid gap-3 text-sm sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "Organizer",
											value: tournament.organizer
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "Format",
											value: FORMAT_LABELS[tournament.format] ?? "League"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "Teams",
											value: String(teams.data?.length ?? 0)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "Start",
											value: formatDate(tournament.start_date)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "End",
											value: formatDate(tournament.end_date)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "Points",
											value: `W ${tournament.points_win} / D ${tournament.points_draw} / L ${tournament.points_loss}`
										})
									]
								}),
								tournament.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 text-sm text-muted-foreground",
									children: tournament.description
								}),
								tournament.rules && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 border-t border-border/60 pt-3 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label-caps mr-2 text-primary",
										children: "Rules"
									}), tournament.rules]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-caps mb-3 text-primary",
									children: "Progress"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-4xl",
									children: [
										completed.length,
										" / ",
										allFixtures.length
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									className: "mt-3",
									value: allFixtures.length ? completed.length / allFixtures.length * 100 : 0
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "label-caps text-muted-foreground",
										children: "Top of the table"
									}), ranked.slice(0, 5).map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display w-5 text-muted-foreground",
												children: index + 1
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
												name: teamMap.get(row.team_id)?.name ?? "Team",
												shortName: teamMap.get(row.team_id)?.short_name,
												color: teamMap.get(row.team_id)?.team_color,
												size: "sm"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex-1 truncate",
												children: teamMap.get(row.team_id)?.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-primary",
												children: row.points
											})
										]
									}, row.team_id))]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-4 text-2xl",
							children: "Latest Results"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [completed.slice(-3).reverse().map((fixture) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, { fixture }, fixture.id)), !completed.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "No results yet",
								description: "No results have been recorded yet."
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-4 text-2xl",
							children: "Next Matches"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [upcoming.slice(0, 3).map((fixture) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FixtureCard, { fixture }, fixture.id)), !upcoming.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "No upcoming matches",
								description: "All matches have been played."
							})]
						})] })]
					})
				]
			}),
			tab === "fixtures" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FixtureList, { fixtures: league }),
			tab === "results" && (completed.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [...completed].reverse().map((fixture) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, { fixture }, fixture.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No results yet",
				description: "No results have been recorded yet."
			})),
			tab === "standings" && (ranked.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandingsTable, {
				rows: ranked,
				teams: teams.data ?? []
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No standings yet",
				description: "Standings appear once teams are added."
			})),
			tab === "teams" && (teams.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: teams.data.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamCard, { team }, team.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No teams registered",
				description: "No teams have been registered."
			})),
			tab === "knockout" && (knockout.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KnockoutBracket, { fixtures: knockout }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No knockout stage",
				description: "This tournament has no knockout fixtures yet."
			})),
			tab === "statistics" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Statistics, {
				completed,
				goals,
				ranked,
				teamNames: teamMap,
				players: players.data ?? []
			}),
			tab === "awards" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TournamentAwardsSection, {
				tournament,
				completedFixtures: completed,
				standings: standings.data ?? [],
				teamsMap: teamMap,
				champion,
				playerStats: players.data ?? []
			})
		]
	})] });
}
function Detail({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "label-caps text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-0.5",
		children: value
	})] });
}
function FixtureList({ fixtures }) {
	const [selectedMatchday, setSelectedMatchday] = (0, import_react.useState)("all");
	if (!fixtures.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No fixtures yet",
		description: "Fixtures will appear once the TFF organizer generates them."
	});
	const matchdays = [...new Set(fixtures.map((f) => f.matchday ?? 0))].sort((a, b) => a - b);
	const visibleMatchdays = selectedMatchday === "all" ? matchdays : matchdays.filter((md) => md === selectedMatchday);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [matchdays.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-1.5 p-1.5 bg-card/60 border border-border/80 rounded-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setSelectedMatchday("all"),
				className: `px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedMatchday === "all" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"}`,
				children: [
					"All Matchdays (",
					fixtures.length,
					")"
				]
			}), matchdays.map((md) => {
				const count = fixtures.filter((f) => (f.matchday ?? 0) === md).length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSelectedMatchday(md),
					className: `px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedMatchday === md ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"}`,
					children: [
						"Matchday ",
						md,
						" (",
						count,
						")"
					]
				}, md);
			})]
		}), visibleMatchdays.map((matchday) => {
			const group = fixtures.filter((f) => (f.matchday ?? 0) === matchday);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-primary/10 border-b border-primary/20 px-5 py-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-lg tracking-widest text-primary uppercase",
						children: ["Matchday ", matchday]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: group[0]?.scheduled_date ? formatDate(group[0].scheduled_date) : `${group.length} match${group.length !== 1 ? "es" : ""}`
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
					className: "w-full text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border/40",
						children: group.map((fixture) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-secondary/10 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-right font-semibold w-[42%]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fixture.home?.name || "TBD" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
											name: fixture.home?.name ?? "",
											shortName: fixture.home?.short_name,
											color: fixture.home?.team_color,
											logoUrl: fixture.home?.logo_url,
											size: "sm"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-3 text-center w-[16%]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `inline-block px-3 py-1 rounded font-bold text-sm ${fixture.status === "completed" ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-primary/15 text-primary border border-primary/30"}`,
										children: fixture.status === "completed" ? `${fixture.result?.home_score} – ${fixture.result?.away_score}` : "VS"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-left font-semibold w-[42%]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
											name: fixture.away?.name ?? "",
											shortName: fixture.away?.short_name,
											color: fixture.away?.team_color,
											logoUrl: fixture.away?.logo_url,
											size: "sm"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fixture.away?.name || "TBD" })]
									})
								})
							]
						}, fixture.id))
					})
				})]
			}, matchday);
		})]
	});
}
function Statistics({ completed, goals, ranked, teamNames, players }) {
	const completedWithResults = completed.filter((f) => f.result && f.result.home_score !== null && f.result.home_score !== void 0);
	const biggest = [...completedWithResults].sort((a, b) => Math.abs((b.result?.home_score ?? 0) - (b.result?.away_score ?? 0)) - Math.abs((a.result?.home_score ?? 0) - (a.result?.away_score ?? 0)))[0];
	const highest = [...completedWithResults].sort((a, b) => (b.result?.home_score ?? 0) + (b.result?.away_score ?? 0) - ((a.result?.home_score ?? 0) + (a.result?.away_score ?? 0)))[0];
	const mostWins = [...ranked].sort((a, b) => b.wins - a.wins)[0];
	const bestDefense = [...ranked].sort((a, b) => a.goals_against - b.goals_against)[0];
	const mostGoals = [...ranked].sort((a, b) => b.goals_for - a.goals_for)[0];
	const cleanSheetsMap = /* @__PURE__ */ new Map();
	for (const f of completed) if (f.status === "completed" && f.result) {
		if (f.home_team_id) {
			if (!cleanSheetsMap.has(f.home_team_id)) cleanSheetsMap.set(f.home_team_id, 0);
			if ((f.result.away_score ?? 0) === 0) cleanSheetsMap.set(f.home_team_id, cleanSheetsMap.get(f.home_team_id) + 1);
		}
		if (f.away_team_id) {
			if (!cleanSheetsMap.has(f.away_team_id)) cleanSheetsMap.set(f.away_team_id, 0);
			if ((f.result.home_score ?? 0) === 0) cleanSheetsMap.set(f.away_team_id, cleanSheetsMap.get(f.away_team_id) + 1);
		}
	}
	let topCleanSheetTeamId = "";
	let maxCleanSheets = 0;
	for (const [teamId, count] of cleanSheetsMap.entries()) if (count > maxCleanSheets) {
		maxCleanSheets = count;
		topCleanSheetTeamId = teamId;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Matches",
						value: completed.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Goals",
						value: goals
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Goals / Match",
						value: completed.length ? (goals / completed.length).toFixed(2) : "0.00"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Biggest Victory",
						value: biggest && biggest.result ? `${biggest.result.home_score}-${biggest.result.away_score}` : "—",
						hint: biggest ? `${biggest.home?.name} vs ${biggest.away?.name}` : void 0
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Most Wins",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl",
							children: teamNames.get(mostWins?.team_id ?? "")?.name ?? "—"
						}),
						hint: `${mostWins?.wins ?? 0} wins`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Most Goals",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl",
							children: teamNames.get(mostGoals?.team_id ?? "")?.name ?? "—"
						}),
						hint: `${mostGoals?.goals_for ?? 0} scored`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Best Defense",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl",
							children: teamNames.get(bestDefense?.team_id ?? "")?.name ?? "—"
						}),
						hint: `${bestDefense?.goals_against ?? 0} conceded`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Most Clean Sheets 🧤",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl",
							children: topCleanSheetTeamId ? teamNames.get(topCleanSheetTeamId)?.name ?? "—" : "—"
						}),
						hint: topCleanSheetTeamId ? `${maxCleanSheets} clean sheet${maxCleanSheets !== 1 ? "s" : ""}` : "0 clean sheets"
					})
				]
			}),
			highest && highest.result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps text-primary",
					children: "Highest scoring match"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display mt-2 text-3xl",
					children: [
						highest.home?.name,
						" ",
						highest.result.home_score,
						" — ",
						highest.result.away_score,
						" ",
						highest.away?.name
					]
				})]
			}),
			players.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[480px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "label-caps border-b border-border/70 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Player"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-center",
								children: "Goals"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-center",
								children: "Assists"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-center",
								children: "MOTM"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: players.map((player) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/40 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-semibold",
								children: player.player_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-center text-primary",
								children: player.goals
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-center",
								children: player.assists
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-center",
								children: player.motm
							})
						]
					}, player.player_name)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Looking for the full table?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: ".",
						search: { tab: "standings" },
						className: "text-primary hover:underline",
						children: "View standings"
					})
				]
			})
		]
	});
}
//#endregion
export { TournamentDetail as component };
