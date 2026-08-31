import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as Award, P as Crown, U as ArrowUpRight, c as Trophy, j as Flame, m as Shield, x as Medal } from "../_libs/lucide-react.mjs";
import { E as getTeamVideoLogo, O as parseResultPenalties, R as TeamLogo, V as cn, w as getMatchWinner } from "./router-BD6uxmJI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trophy-7cgQCfQW.js
var import_jsx_runtime = require_jsx_runtime();
function ChampionCard({ tournament, champion, teams, featured }) {
	const winner = champion.champion_team_id ? teams.get(champion.champion_team_id) : null;
	const runnerUp = champion.runner_up_team_id ? teams.get(champion.runner_up_team_id) : null;
	const third = champion.third_place_team_id ? teams.get(champion.third_place_team_id) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("group relative overflow-hidden rounded-2xl border transition-all duration-300", featured ? "border-amber-500/50 bg-gradient-to-b from-amber-950/40 via-zinc-950/90 to-zinc-950 shadow-[0_0_35px_rgba(245,158,11,0.18)]" : "border-border/80 bg-zinc-950/80 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.1)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("pointer-events-none absolute -top-24 right-0 size-72 rounded-full blur-3xl transition-opacity duration-500", featured ? "opacity-35" : "opacity-15 group-hover:opacity-25"),
				style: { background: "radial-gradient(circle, oklch(0.75 0.18 70) 0%, transparent 70%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-zinc-900/60 px-6 py-3.5 backdrop-blur-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[0.65rem] font-bold uppercase tracking-widest text-amber-400/90",
							children: featured ? "★ Reigning Champion" : "Official Champion"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-zinc-600",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground",
							children: tournament.season_year ? `Season ${tournament.season_year}` : "TFF Archive"
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/tournament/$slug",
					params: { slug: tournament.slug },
					search: { tab: "overview" },
					className: "inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-amber-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tournament.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-5",
						children: [winner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/team/$teamId",
							params: { teamId: winner.id },
							className: "shrink-0 transition-transform duration-300 group-hover:scale-105",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
								name: winner.name,
								shortName: winner.short_name,
								color: winner.team_color,
								logoUrl: winner.logo_url,
								videoUrl: featured ? getTeamVideoLogo(winner) : null,
								autoPlay: featured ?? false,
								size: featured ? "xl" : "lg",
								className: "shadow-xl ring-2 ring-amber-500/30"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-16 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-8" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-amber-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-3" }), " Champion"]
								}), champion.final_score && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 text-[0.65rem] font-mono text-zinc-300",
									children: ["Final: ", champion.final_score]
								})]
							}),
							winner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/team/$teamId",
								params: { teamId: winner.id },
								className: cn("font-display block uppercase tracking-wide text-foreground transition-colors hover:text-amber-400 mt-1", featured ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"),
								children: winner.name
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl uppercase tracking-wide text-muted-foreground mt-1",
								children: "To Be Decided"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: ["Crowned Champion of ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-zinc-300",
									children: tournament.name
								})]
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center justify-end gap-3 border-t border-border/40 pt-4 sm:border-t-0 sm:pt-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-end text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[0.65rem] font-bold uppercase tracking-wider text-amber-400/80",
								children: "Title Record"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl text-amber-400",
								children: "#1 PLACE"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-12 place-items-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-950/40 border border-amber-500/40 text-amber-400 shadow-inner",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-6" })
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-3 border-t border-border/60 pt-5 sm:grid-cols-2 lg:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3",
							children: [runnerUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/team/$teamId",
								params: { teamId: runnerUp.id },
								className: "shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
									name: runnerUp.name,
									shortName: runnerUp.short_name,
									color: runnerUp.team_color,
									logoUrl: runnerUp.logo_url,
									autoPlay: false,
									size: "sm",
									className: "rounded-lg shadow-sm"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 shrink-0 place-items-center rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medal, { className: "size-5 text-zinc-300" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[0.65rem] font-bold uppercase tracking-wider text-zinc-400",
									children: "Runner-Up 🥈"
								}), runnerUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/team/$teamId",
									params: { teamId: runnerUp.id },
									className: "truncate block text-xs font-semibold text-foreground hover:text-amber-400 transition-colors",
									children: runnerUp.name
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs font-semibold text-muted-foreground",
									children: "—"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3",
							children: [third ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/team/$teamId",
								params: { teamId: third.id },
								className: "shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
									name: third.name,
									shortName: third.short_name,
									color: third.team_color,
									logoUrl: third.logo_url,
									autoPlay: false,
									size: "sm",
									className: "rounded-lg shadow-sm"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 shrink-0 place-items-center rounded-lg bg-amber-950/50 text-amber-600 border border-amber-800/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medal, { className: "size-5 text-amber-600" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[0.65rem] font-bold uppercase tracking-wider text-amber-600/90",
									children: "3rd Place 🥉"
								}), third ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/team/$teamId",
									params: { teamId: third.id },
									className: "truncate block text-xs font-semibold text-foreground hover:text-amber-400 transition-colors",
									children: third.name
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs font-semibold text-muted-foreground",
									children: "—"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-5 text-amber-400" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[0.65rem] font-bold uppercase tracking-wider text-amber-400",
									children: "Tournament MVP 🎖️"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs font-semibold text-foreground",
									children: champion.mvp || "—"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-5 text-amber-400" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[0.65rem] font-bold uppercase tracking-wider text-amber-400",
									children: "Top Scorer ⚽"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs font-semibold text-foreground",
									children: champion.top_scorer || "—"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 shrink-0 place-items-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-5 text-cyan-400" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[0.65rem] font-bold uppercase tracking-wider text-cyan-400",
									children: "Golden Glove 🧤"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs font-semibold text-foreground",
									children: "Clean Sheets Record"
								})]
							})]
						})
					]
				})]
			})
		]
	});
}
function BracketMatchCard({ f1, stepFixtures }) {
	const isTwoLegged = f1.round?.includes("1st Leg");
	const f2 = isTwoLegged ? stepFixtures.find((f) => f.round?.includes("2nd Leg") && (f.home_team_id === f1.away_team_id && f.away_team_id === f1.home_team_id || f.bracket_slot === (f1.bracket_slot ? f1.bracket_slot + 1 : -1))) : null;
	if (isTwoLegged && f2) {
		const agg = computeTwoLegAggregate(f1, f2);
		const homeWon = agg.winnerTeamId === f1.home_team_id;
		const awayWon = agg.winnerTeamId === f1.away_team_id;
		const res1 = f1.result;
		const res2 = f2.result;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel p-2 space-y-1 border-primary/30 bg-card/80 hover:border-primary/60 transition-all shadow-sm relative group w-full text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-[9px] uppercase font-bold tracking-wider text-muted-foreground border-b border-border/40 pb-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary truncate",
					children: "2-Legged Tie"
				}), agg.isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-amber-400 font-extrabold shrink-0 ml-1",
					children: [
						"Agg: ",
						agg.totalGoalsA,
						"-",
						agg.totalGoalsB
					]
				})]
			}), [{
				team: f1.home,
				scoreL1: res1?.home_score,
				scoreL2: res2?.away_score,
				total: agg.totalGoalsA,
				pen: agg.penA,
				won: homeWon
			}, {
				team: f1.away,
				scoreL1: res1?.away_score,
				scoreL2: res2?.home_score,
				total: agg.totalGoalsB,
				pen: agg.penB,
				won: awayWon
			}].map((side, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex items-center gap-1.5 rounded px-1.5 py-1 transition-colors min-w-0", side.won && "bg-primary/20 border border-primary/40"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
						name: side.team?.name ?? "TBD",
						shortName: side.team?.short_name,
						color: side.team?.team_color,
						logoUrl: side.team?.logo_url,
						size: "xs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("flex-1 truncate text-xs", side.won ? "font-bold text-primary" : "text-muted-foreground"),
						children: side.team?.name ?? "TBD"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right flex items-center gap-1 text-[11px] shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground font-mono text-[10px]",
								children: [
									"(",
									side.scoreL1 ?? "-",
									"-",
									side.scoreL2 ?? "-",
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xs font-bold text-foreground",
								children: agg.isCompleted ? side.total : "-"
							}),
							agg.isPenalties && side.pen !== null && side.pen !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[9px] font-extrabold text-amber-400",
								children: [
									"(",
									side.pen,
									"p)"
								]
							})
						]
					})
				]
			}, i))]
		});
	}
	const result = f1.result;
	const { winnerTeamId, isPenalties } = getMatchWinner(f1);
	const { homePen, awayPen } = parseResultPenalties(result);
	const homeWon = winnerTeamId === f1.home_team_id;
	const awayWon = winnerTeamId === f1.away_team_id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "panel p-2 bg-card/80 border-primary/30 hover:border-primary/60 transition-all shadow-sm relative group w-full text-xs",
		children: [{
			team: f1.home,
			score: result?.home_score,
			pen: homePen,
			won: homeWon
		}, {
			team: f1.away,
			score: result?.away_score,
			pen: awayPen,
			won: awayWon
		}].map((side, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex items-center gap-1.5 rounded px-1.5 py-1 transition-colors min-w-0", side.won && "bg-primary/20 border border-primary/40"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
					name: side.team?.name ?? "TBD",
					shortName: side.team?.short_name,
					color: side.team?.team_color,
					logoUrl: side.team?.logo_url,
					size: "xs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("flex-1 truncate text-xs", side.won ? "font-semibold text-primary" : "text-muted-foreground"),
					children: side.team?.name ?? "TBD"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-sm font-bold text-foreground",
						children: side.score ?? "-"
					}), isPenalties && side.pen !== null && side.pen !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1 text-[10px] font-bold text-amber-400",
						children: [
							"(",
							side.pen,
							"p)"
						]
					})]
				})
			]
		}, i))
	});
}
function KnockoutBracket({ fixtures }) {
	if (!fixtures || fixtures.length === 0) return null;
	const getLeg1ForRound = (roundKey) => {
		return fixtures.filter((f) => f.round && f.round.startsWith(roundKey)).filter((f) => !f.round?.includes("2nd Leg")).sort((a, b) => (a.bracket_slot ?? 0) - (b.bracket_slot ?? 0));
	};
	const r16Leg1 = getLeg1ForRound("Round of 16");
	const qfLeg1 = getLeg1ForRound("Quarter Final");
	const sfLeg1 = getLeg1ForRound("Semi Final");
	const finalLeg1 = getLeg1ForRound("Final");
	const thirdPlaceLeg1 = getLeg1ForRound("Third Place");
	const partition = (list) => {
		if (list.length <= 1) return {
			left: list,
			right: []
		};
		const mid = Math.ceil(list.length / 2);
		return {
			left: list.slice(0, mid),
			right: list.slice(mid)
		};
	};
	const r16Part = partition(r16Leg1);
	const qfPart = partition(qfLeg1);
	const sfPart = partition(sfLeg1);
	const finalStep = fixtures.filter((f) => f.round && f.round.startsWith("Final"));
	const finalF1 = finalStep.find((f) => !f.round?.includes("2nd Leg"));
	const finalF2 = finalStep.find((f) => f.round?.includes("2nd Leg"));
	const championName = (() => {
		if (finalF1?.round?.includes("1st Leg") && finalF2) {
			const agg = computeTwoLegAggregate(finalF1, finalF2);
			if (!agg.winnerTeamId) return null;
			const championTeam = fixtures.find((f) => f.home_team_id === agg.winnerTeamId || f.away_team_id === agg.winnerTeamId);
			return (championTeam?.home_team_id === agg.winnerTeamId ? championTeam.home?.name : championTeam?.away?.name) ?? null;
		}
		if (!finalF1?.result) return null;
		const { winnerTeamId } = getMatchWinner(finalF1);
		if (!winnerTeamId) return null;
		return winnerTeamId === finalF1.home_team_id ? finalF1.home?.name ?? null : finalF1.away?.name ?? null;
	})();
	const allRoundFixtures = (roundKey) => fixtures.filter((f) => f.round && f.round.startsWith(roundKey));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full overflow-x-auto pb-2 pt-1",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-full min-w-[700px] items-center justify-between gap-2.5 sm:gap-3 px-1 sm:px-2",
			children: [
				r16Part.left.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 max-w-[210px] shrink-0 flex flex-col h-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps mb-2 text-center text-primary font-bold tracking-wider text-[11px]",
						children: "ROUND OF 16"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col justify-around gap-2.5 flex-1",
						children: r16Part.left.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BracketMatchCard, {
							f1: f,
							stepFixtures: allRoundFixtures("Round of 16")
						}, f.id))
					})]
				}),
				qfPart.left.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 max-w-[210px] shrink-0 flex flex-col h-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps mb-2 text-center text-primary font-bold tracking-wider text-[11px]",
						children: "QUARTER FINAL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col justify-around gap-2.5 flex-1",
						children: qfPart.left.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BracketMatchCard, {
							f1: f,
							stepFixtures: allRoundFixtures("Quarter Final")
						}, f.id))
					})]
				}),
				sfPart.left.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 max-w-[210px] shrink-0 flex flex-col h-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps mb-2 text-center text-primary font-bold tracking-wider text-[11px]",
						children: "SEMI FINAL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col justify-around gap-2.5 flex-1",
						children: sfPart.left.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BracketMatchCard, {
							f1: f,
							stepFixtures: allRoundFixtures("Semi Final")
						}, f.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 max-w-[230px] shrink-0 flex flex-col items-center justify-center gap-3 h-full",
					children: [
						finalLeg1.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-caps mb-2 text-center text-primary font-bold tracking-wider text-xs flex items-center justify-center gap-1",
								children: "FINAL 🏆"
							}), finalLeg1.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BracketMatchCard, {
								f1: f,
								stepFixtures: allRoundFixtures("Final")
							}, f.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full panel flex flex-col items-center justify-center gap-1.5 p-3.5 text-center bg-gradient-to-b from-amber-950/40 via-card/90 to-card border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.12)] rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-8 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-4 animate-pulse" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[9px] uppercase tracking-widest text-amber-400 font-extrabold",
								children: "CHAMPION"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg font-black text-amber-400 mt-0.5 truncate max-w-[190px]",
								children: championName ?? "TBD"
							})] })]
						}),
						thirdPlaceLeg1.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full mt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-caps mb-1.5 text-center text-muted-foreground font-bold tracking-wider text-[10px]",
								children: "3RD PLACE 🥉"
							}), thirdPlaceLeg1.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BracketMatchCard, {
								f1: f,
								stepFixtures: allRoundFixtures("Third Place")
							}, f.id))]
						})
					]
				}),
				sfPart.right.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 max-w-[210px] shrink-0 flex flex-col h-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps mb-2 text-center text-primary font-bold tracking-wider text-[11px]",
						children: "SEMI FINAL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col justify-around gap-2.5 flex-1",
						children: sfPart.right.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BracketMatchCard, {
							f1: f,
							stepFixtures: allRoundFixtures("Semi Final")
						}, f.id))
					})]
				}),
				qfPart.right.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 max-w-[210px] shrink-0 flex flex-col h-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps mb-2 text-center text-primary font-bold tracking-wider text-[11px]",
						children: "QUARTER FINAL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col justify-around gap-2.5 flex-1",
						children: qfPart.right.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BracketMatchCard, {
							f1: f,
							stepFixtures: allRoundFixtures("Quarter Final")
						}, f.id))
					})]
				}),
				r16Part.right.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 max-w-[210px] shrink-0 flex flex-col h-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps mb-2 text-center text-primary font-bold tracking-wider text-[11px]",
						children: "ROUND OF 16"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col justify-around gap-2.5 flex-1",
						children: r16Part.right.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BracketMatchCard, {
							f1: f,
							stepFixtures: allRoundFixtures("Round of 16")
						}, f.id))
					})]
				})
			]
		})
	});
}
//#endregion
export { KnockoutBracket as n, ChampionCard as t };
