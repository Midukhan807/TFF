import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as Funnel, P as Crown } from "../_libs/lucide-react.mjs";
import { R as TeamLogo, a as buildCareers, c as fetchAllStandings, g as fetchTeams, l as fetchChampions, p as fetchRankingConfig, r as DEFAULT_RANKING, s as fetchAllFixtures, y as fetchTournaments } from "./router-BD6uxmJI.mjs";
import { t as EmptyState } from "./ui-CA5ZAn3t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rankings-C4LbuBgE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RankingsPage() {
	const [selectedTourneyId, setSelectedTourneyId] = (0, import_react.useState)("all");
	const tournaments = useQuery({
		queryKey: ["tournaments"],
		queryFn: fetchTournaments
	});
	const teams = useQuery({
		queryKey: ["teams"],
		queryFn: fetchTeams
	});
	const standings = useQuery({
		queryKey: ["all-standings"],
		queryFn: fetchAllStandings
	});
	const champions = useQuery({
		queryKey: ["champions"],
		queryFn: fetchChampions
	});
	const config = useQuery({
		queryKey: ["ranking-config"],
		queryFn: fetchRankingConfig
	});
	const fixtures = useQuery({
		queryKey: ["all-fixtures"],
		queryFn: fetchAllFixtures
	});
	const ranking = config.data ?? DEFAULT_RANKING;
	const filteredStandings = (standings.data ?? []).filter((s) => selectedTourneyId === "all" ? true : s.tournament_id === selectedTourneyId);
	const filteredChampions = (champions.data ?? []).filter((c) => selectedTourneyId === "all" ? true : c.tournament_id === selectedTourneyId);
	const filteredFixtures = (fixtures.data ?? []).filter((f) => selectedTourneyId === "all" ? true : f.tournament_id === selectedTourneyId);
	let careers = buildCareers(teams.data ?? [], filteredStandings, filteredChampions, ranking, filteredFixtures);
	if (selectedTourneyId !== "all") {
		const activeCareers = careers.filter((c) => c.played > 0 || c.tournaments > 0);
		if (activeCareers.length > 0) careers = activeCareers;
	}
	const selectedTourneyName = selectedTourneyId === "all" ? "All-Time" : tournaments.data?.find((t) => t.id === selectedTourneyId)?.name ?? "Selected Tournament";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-14 sm:px-6 space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-border/70 pb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps text-xs text-primary mb-1",
					children: selectedTourneyId === "all" ? "All-Time" : "Tournament Filter"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl sm:text-5xl tracking-wide uppercase",
					children: selectedTourneyId === "all" ? "TFF Global Rankings" : `${selectedTourneyName}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: selectedTourneyId === "all" ? "All-time team power ratings built from every TFF tournament result, title and match win." : `Standings & rating metrics for ${selectedTourneyName}.`
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 bg-secondary/30 p-2 rounded-xl border border-border/60 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-4 text-primary ml-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold label-caps text-muted-foreground hidden sm:inline",
						children: "Filter:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: selectedTourneyId,
						onChange: (e) => setSelectedTourneyId(e.target.value),
						className: "bg-background border border-border text-sm font-semibold rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "🏆 All-Time (All Tournaments)"
						}), tournaments.data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: t.id,
							children: [
								"⚽ ",
								t.name,
								" (",
								t.season_year || "Past",
								")"
							]
						}, t.id))]
					})
				]
			})]
		}), careers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "panel overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[900px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "label-caps border-b border-border/70 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "#"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "Team"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-center",
							children: "Titles"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-center",
							children: "Tour."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-center",
							children: "P"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-center",
							children: "W"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-center",
							children: "D"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-center",
							children: "L"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-center",
							children: "GF"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-center",
							children: "GA"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-center",
							children: "Win %"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right",
							children: "Rating"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: careers.map((career, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: `border-b border-border/40 last:border-0 ${index < 3 ? "bg-primary/5" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg text-muted-foreground",
								children: index + 1
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/team/$teamId",
								params: { teamId: career.team.id },
								className: "flex items-center gap-3 font-semibold hover:text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
									name: career.team.name,
									shortName: career.team.short_name,
									color: career.team.team_color,
									logoUrl: career.team.logo_url,
									size: "sm"
								}), career.team.name]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-primary font-bold",
								children: [career.titles > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-3.5" }), career.titles]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-center",
							children: career.tournaments
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-center",
							children: career.played
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-center",
							children: career.wins
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-center",
							children: career.draws
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-center",
							children: career.losses
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-center",
							children: career.goalsFor
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-center",
							children: career.goalsAgainst
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-center",
							children: [career.played ? Math.round(career.wins / career.played * 100) : 0, "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "font-display px-4 py-3 text-right text-xl text-primary font-bold",
							children: career.rankingPoints
						})
					]
				}, career.team.id)) })]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No ranking data yet",
			description: "Rankings appear once TFF tournaments have been played."
		})]
	});
}
//#endregion
export { RankingsPage as component };
