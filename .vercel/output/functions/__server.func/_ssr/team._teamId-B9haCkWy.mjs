import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as Swords } from "../_libs/lucide-react.mjs";
import { E as getTeamVideoLogo, F as Route$1, R as TeamLogo, T as getTeamFoundedYear, c as fetchAllStandings, g as fetchTeams, h as fetchTeamFixtures, l as fetchChampions, y as fetchTournaments } from "./router-BD6uxmJI.mjs";
import { o as StatCard, r as ResultCard, t as EmptyState } from "./ui-CA5ZAn3t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/team._teamId-B9haCkWy.js
var import_jsx_runtime = require_jsx_runtime();
function TeamProfile() {
	const { teamId } = Route$1.useParams();
	const teams = useQuery({
		queryKey: ["teams"],
		queryFn: fetchTeams
	});
	const standings = useQuery({
		queryKey: ["all-standings"],
		queryFn: fetchAllStandings
	});
	const tournaments = useQuery({
		queryKey: ["tournaments"],
		queryFn: fetchTournaments
	});
	const champions = useQuery({
		queryKey: ["champions"],
		queryFn: fetchChampions
	});
	const fixtures = useQuery({
		queryKey: ["team-fixtures", teamId],
		queryFn: () => fetchTeamFixtures(teamId)
	});
	const team = (teams.data ?? []).find((t) => t.id === teamId);
	if (!team) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-4 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Team not found",
			description: "This team is not in the TFF database."
		})
	});
	const rows = (standings.data ?? []).filter((row) => row.team_id === teamId);
	const totals = rows.reduce((acc, row) => ({
		played: acc.played + row.played,
		wins: acc.wins + row.wins,
		draws: acc.draws + row.draws,
		losses: acc.losses + row.losses,
		gf: acc.gf + row.goals_for,
		ga: acc.ga + row.goals_against,
		yellow: acc.yellow + (row.yellow_cards || 0),
		red: acc.red + (row.red_cards || 0),
		points: acc.points + row.points
	}), {
		played: 0,
		wins: 0,
		draws: 0,
		losses: 0,
		gf: 0,
		ga: 0,
		yellow: 0,
		red: 0,
		points: 0
	});
	const knockoutCompleted = (fixtures.data ?? []).filter((f) => (f.stage === "knockout" || !!f.round) && f.status === "completed" && f.result);
	for (const f of knockoutCompleted) {
		totals.played += 1;
		const isHome = f.home_team_id === teamId;
		const myScore = isHome ? Number(f.result?.home_score) || 0 : Number(f.result?.away_score) || 0;
		const oppScore = isHome ? Number(f.result?.away_score) || 0 : Number(f.result?.home_score) || 0;
		totals.gf += myScore;
		totals.ga += oppScore;
		if (isHome) {
			totals.yellow += Number(f.result?.home_yellow_cards) || 0;
			totals.red += Number(f.result?.home_red_cards) || 0;
		} else {
			totals.yellow += Number(f.result?.away_yellow_cards) || 0;
			totals.red += Number(f.result?.away_red_cards) || 0;
		}
		if (myScore > oppScore) totals.wins += 1;
		else if (myScore < oppScore) totals.losses += 1;
		else totals.draws += 1;
	}
	const titles = (champions.data ?? []).filter((c) => c.champion_team_id === teamId).length;
	const tournamentMap = new Map((tournaments.data ?? []).map((t) => [t.id, t]));
	const recent = (fixtures.data ?? []).filter((f) => f.result).slice(0, 4);
	const winPct = totals.played ? Math.round(totals.wins / totals.played * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "border-b border-border/70",
		style: { background: "var(--gradient-surface)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 py-12 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
				name: team.name,
				shortName: team.short_name,
				color: team.team_color,
				logoUrl: team.logo_url,
				videoUrl: getTeamVideoLogo(team),
				size: "xl"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps text-primary",
						children: "TFF Team"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[0.65rem] font-semibold text-primary/80 border border-primary/30 bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider",
						children: ["Est. ", getTeamFoundedYear(team)]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-5xl uppercase",
					children: team.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						team.short_name,
						team.manager_name ? ` · Manager ${team.manager_name}` : "",
						` · Founded ${getTeamFoundedYear(team)}`
					]
				})
			] })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Tournaments",
						value: rows.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Championships",
						value: titles
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Matches Played",
						value: totals.played
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Win %",
						value: `${winPct}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Discipline",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-yellow-400 font-bold",
								children: ["🟨 ", totals.yellow]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-red-400 font-bold",
								children: ["🟥 ", totals.red]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 text-2xl",
				children: "Tournament History"
			}), rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[660px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "label-caps border-b border-border/70 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Tournament"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-center",
								children: "Year"
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
								className: "px-3 py-3 text-center text-yellow-400",
								title: "Yellow Cards",
								children: "YC"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-center text-red-400",
								title: "Red Cards",
								children: "RC"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-center",
								children: "Pts"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => {
						const tournament = tournamentMap.get(row.tournament_id);
						if (!tournament) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/40 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/tournament/$slug",
										params: { slug: tournament.slug },
										search: { tab: "overview" },
										className: "font-semibold hover:text-primary",
										children: tournament.name
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-center",
									children: tournament.season_year
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-center",
									children: row.played
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-center",
									children: row.wins
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-center",
									children: row.draws
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-center",
									children: row.losses
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center justify-center gap-1 rounded bg-yellow-500/10 px-1.5 py-0.5 text-xs font-semibold text-yellow-400 border border-yellow-500/20",
										children: row.yellow_cards ?? 0
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center justify-center gap-1 rounded bg-red-500/10 px-1.5 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20",
										children: row.red_cards ?? 0
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-center text-primary font-bold",
									children: row.points
								})
							]
						}, row.tournament_id);
					}) })]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No tournaments yet",
				description: "This team has not competed in a TFF tournament yet."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 text-2xl",
				children: "Recent Results"
			}), recent.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: recent.map((fixture) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, { fixture }, fixture.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No results yet",
				description: "No results have been recorded yet."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel p-6 border-primary/30 bg-card/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-2xl font-extrabold uppercase tracking-wide flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-6 text-primary" }), " Head-to-Head Rivalries"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: [
							"Compare ",
							team.name,
							" head-to-head against any rival team in TFF."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/h2h",
						search: { team1: team.id },
						className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90",
						children: ["Open Full H2H Predictor ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-4" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: (teams.data ?? []).filter((t) => t.id !== team.id).slice(0, 8).map((opp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/h2h",
						search: {
							team1: team.id,
							team2: opp.id
						},
						className: "flex items-center gap-3 rounded-lg border border-border/70 bg-card/40 p-3 transition-all hover:border-primary/50 hover:bg-primary/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
							name: opp.name,
							shortName: opp.short_name,
							color: opp.team_color,
							logoUrl: opp.logo_url,
							size: "sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold truncate",
								children: opp.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-primary font-semibold flex items-center gap-1",
								children: ["Compare H2H ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-3" })]
							})]
						})]
					}, opp.id))
				})]
			})
		]
	})] });
}
//#endregion
export { TeamProfile as component };
