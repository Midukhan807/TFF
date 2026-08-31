import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as Crown, T as LoaderCircle, c as Trophy, f as Sparkles, m as Shield } from "../_libs/lucide-react.mjs";
import { E as getTeamVideoLogo, R as TeamLogo, g as fetchTeams, l as fetchChampions, y as fetchTournaments } from "./router-BD6uxmJI.mjs";
import { t as EmptyState } from "./ui-CA5ZAn3t.mjs";
import { t as ChampionCard } from "./trophy-7cgQCfQW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/champions-aZ5rOatV.js
var import_jsx_runtime = require_jsx_runtime();
function ChampionsPage() {
	const champions = useQuery({
		queryKey: ["champions"],
		queryFn: fetchChampions
	});
	const tournaments = useQuery({
		queryKey: ["tournaments"],
		queryFn: fetchTournaments
	});
	const teams = useQuery({
		queryKey: ["teams"],
		queryFn: fetchTeams
	});
	const isLoading = champions.isLoading || tournaments.isLoading || teams.isLoading;
	const teamMap = new Map((teams.data ?? []).map((t) => [t.id, t]));
	const tournamentMap = new Map((tournaments.data ?? []).map((t) => [t.id, t]));
	const list = champions.data ?? [];
	const tourneyOrderMap = new Map((tournaments.data ?? []).map((t, idx) => [t.id, idx]));
	const sortedChampions = [...list].sort((a, b) => {
		return (tourneyOrderMap.get(a.tournament_id) ?? 999) - (tourneyOrderMap.get(b.tournament_id) ?? 999);
	});
	const titleCount = /* @__PURE__ */ new Map();
	for (const champion of list) {
		const winnerId = champion.champion_team_id;
		if (!winnerId) continue;
		titleCount.set(winnerId, (titleCount.get(winnerId) ?? 0) + 1);
	}
	const mostDecorated = [...titleCount.entries()].sort((a, b) => b[1] - a[1]);
	const topTeam = mostDecorated[0] ? teamMap.get(mostDecorated[0][0]) : null;
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[60vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-amber-400" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/40 via-zinc-950/90 to-zinc-950 p-8 sm:p-12 shadow-[0_0_50px_rgba(245,158,11,0.12)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-96 rounded-full blur-3xl opacity-25",
					style: { background: "radial-gradient(circle, oklch(0.75 0.18 70) 0%, transparent 70%)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 backdrop-blur-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-4 animate-pulse" }), " Immortal Legacy"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 font-display text-4xl sm:text-6xl tracking-wide uppercase text-foreground",
							children: "Hall of Champions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed",
							children: "Completed TFF tournaments are etched into eternity. Here are the elite sides, commanders, and goalscorers who conquered the federation."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-4 backdrop-blur-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 mb-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-3xl text-amber-400",
											children: list.length
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mt-0.5",
											children: "Tournaments Crowned"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-4 backdrop-blur-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 mb-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-3xl text-amber-400",
											children: titleCount.size
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mt-0.5",
											children: "Unique Champions"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-4 backdrop-blur-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 mb-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-2xl text-amber-400 truncate max-w-[180px]",
											children: topTeam ? topTeam.name : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mt-0.5",
											children: mostDecorated[0] ? `${mostDecorated[0][1]} Title(s) • Most Decorated` : "Most Decorated"
										})
									]
								})
							]
						})
					]
				})]
			}),
			mostDecorated.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), " Honor Roll"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl uppercase tracking-wide text-foreground mt-1",
						children: "Title Leaderboard"
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: mostDecorated.map(([teamId, count], index) => {
						const team = teamMap.get(teamId);
						if (!team) return null;
						const isFirst = index === 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/team/$teamId",
							params: { teamId },
							className: `group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${isFirst ? "border-amber-500/50 bg-gradient-to-br from-amber-950/30 to-zinc-950 shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:border-amber-500" : "border-border/70 bg-zinc-950/70 hover:border-amber-500/30 hover:bg-zinc-900/60"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
											name: team.name,
											shortName: team.short_name,
											color: team.team_color,
											logoUrl: team.logo_url,
											videoUrl: isFirst ? getTeamVideoLogo(team) : null,
											autoPlay: isFirst,
											size: "lg",
											className: "shadow-lg"
										}), isFirst && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-md",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-3.5 fill-current" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-display text-xs text-muted-foreground",
													children: ["Rank #", index + 1]
												}), isFirst && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[0.6rem] font-bold text-amber-400 uppercase",
													children: "Leader"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-xl uppercase tracking-wide text-foreground truncate group-hover:text-amber-400 transition-colors",
												children: team.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground mt-0.5",
												children: [
													count,
													" TFF Championship Title",
													count > 1 ? "s" : ""
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-col items-end justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 text-amber-400 font-display text-3xl",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-6" }),
												" ",
												count
											]
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-3 border-t border-border/50 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1.5 flex-1 rounded-full bg-zinc-800 overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full",
										style: { width: `${list.length > 0 ? Math.min(100, count / list.length * 100) : 0}%` }
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[0.65rem] font-mono text-muted-foreground",
									children: [list.length > 0 ? Math.round(count / list.length * 100) : 0, "% of titles"]
								})]
							})]
						}, teamId);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4" }), " Hall of Fame Archives"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl uppercase tracking-wide text-foreground mt-1",
						children: "Championship History"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground font-mono",
						children: [sortedChampions.length, " Official Season Archives"]
					})]
				}), sortedChampions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6",
					children: sortedChampions.map((champion, index) => {
						const tournament = tournamentMap.get(champion.tournament_id);
						if (!tournament) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChampionCard, {
							tournament,
							champion,
							teams: teamMap,
							featured: index === 0
						}, champion.id);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No champions yet",
					description: "No TFF tournament has been completed yet. The first champion is still to be crowned."
				})]
			})
		]
	});
}
//#endregion
export { ChampionsPage as component };
