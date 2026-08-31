import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { F as CircleCheck, H as Award, c as Trophy, f as Sparkles, j as Flame, r as Vote, x as Medal } from "../_libs/lucide-react.mjs";
import { B as Button, s as fetchAllFixtures, y as fetchTournaments } from "./router-BD6uxmJI.mjs";
import { a as setStoredHandle, i as getStoredHandle, n as computePredictionLeaderboard, r as fetchAllPredictions, t as MatchPredictionPoll } from "./prediction-poll-DehHr5SV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/predictions-DDKbQ272.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PredictionsPage() {
	const [selectedTourneyId, setSelectedTourneyId] = (0, import_react.useState)("all");
	const [selectedMatchday, setSelectedMatchday] = (0, import_react.useState)("all");
	const [userHandle, setUserHandleState] = (0, import_react.useState)(getStoredHandle());
	const [editingHandle, setEditingHandle] = (0, import_react.useState)(false);
	const tournaments = useQuery({
		queryKey: ["tournaments"],
		queryFn: fetchTournaments
	});
	const fixtures = useQuery({
		queryKey: ["all-fixtures"],
		queryFn: fetchAllFixtures
	});
	const predictions = useQuery({
		queryKey: ["all-predictions"],
		queryFn: fetchAllPredictions,
		refetchInterval: 1e4
	});
	const allFixtures = fixtures.data ?? [];
	const allVotes = predictions.data ?? [];
	const upcomingFixtures = allFixtures.filter((f) => selectedTourneyId === "all" ? true : f.tournament_id === selectedTourneyId).filter((f) => f.status !== "completed");
	const completedFixtures = allFixtures.filter((f) => f.status === "completed");
	const availableMatchdays = Array.from(new Set(upcomingFixtures.map((f) => f.matchday).filter((m) => m !== null && m !== void 0 && m > 0))).sort((a, b) => a - b);
	const displayedUpcomingFixtures = upcomingFixtures.filter((f) => selectedMatchday === "all" ? true : f.matchday === selectedMatchday);
	const leaderboard = computePredictionLeaderboard(completedFixtures, allVotes);
	function handleSaveHandle(e) {
		e.preventDefault();
		if (userHandle.trim()) {
			setStoredHandle(userHandle.trim());
			setEditingHandle(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-14 sm:px-6 space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/70 pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4 text-primary animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-caps text-xs text-primary",
							children: "Community Voting Arena"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl sm:text-5xl tracking-wide uppercase",
						children: "Match Predictions Hub"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm text-muted-foreground",
						children: "Cast your match outcome predictions, view real-time fan voting bars, and climb the predictor leaderboard!"
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 bg-secondary/40 p-2.5 rounded-xl border border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 text-amber-400" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[10px] uppercase font-bold",
									children: "Predictor Handle:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-foreground",
									children: userHandle || "Anonymous Guest"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => setEditingHandle(!editingHandle),
								className: "h-6 text-[10px] px-2 font-bold uppercase text-primary ml-1",
								children: "Edit"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: selectedTourneyId,
						onChange: (e) => {
							setSelectedTourneyId(e.target.value);
							setSelectedMatchday("all");
						},
						className: "bg-background border border-border text-sm font-semibold rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "🏆 All Tournaments"
						}), tournaments.data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: t.id,
							children: ["⚽ ", t.name]
						}, t.id))]
					})]
				})]
			}),
			editingHandle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-4 bg-primary/10 border-primary/40 flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold",
						children: "Set your custom predictor handle to rank on the leaderboard!"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveHandle,
					className: "flex gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: userHandle,
						onChange: (e) => setUserHandleState(e.target.value),
						placeholder: "e.g. GamerTag99",
						className: "h-8 px-2.5 rounded border border-input text-xs font-semibold bg-background"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						type: "submit",
						className: "h-8 text-xs font-bold",
						children: "Save"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 lg:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display text-2xl uppercase tracking-wider flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vote, { className: "size-5 text-primary" }), " Upcoming Matches to Predict"]
							})
						}),
						availableMatchdays.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5 p-1.5 bg-card/60 border border-border/80 rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelectedMatchday("all"),
								className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedMatchday === "all" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"}`,
								children: [
									"All Matchdays (",
									upcomingFixtures.length,
									")"
								]
							}), availableMatchdays.map((md) => {
								const count = upcomingFixtures.filter((f) => f.matchday === md).length;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSelectedMatchday(md),
									className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedMatchday === md ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"}`,
									children: [
										"Matchday ",
										md,
										" (",
										count,
										")"
									]
								}, md);
							})]
						}),
						displayedUpcomingFixtures.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel p-12 text-center text-muted-foreground space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto size-12 opacity-40 text-green-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-base text-foreground",
									children: "No Upcoming Scheduled Matches"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs",
									children: "All current fixtures have been completed or no matches found for this matchday."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6",
							children: displayedUpcomingFixtures.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "panel p-5 space-y-4 border-border/80 bg-card/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs font-bold border-b border-border/40 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary",
											children: f.tournament?.name || "TFF League"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: f.round || (f.matchday ? `Matchday ${f.matchday}` : "Fixture")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-base font-bold py-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate max-w-[140px] text-right",
												children: f.home?.name || "Home"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-sm px-3 py-1 bg-secondary rounded-lg border border-border",
												children: "VS"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate max-w-[140px] text-left",
												children: f.away?.name || "Away"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchPredictionPoll, { fixture: f })
								]
							}, f.id))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-2xl uppercase tracking-wider flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medal, { className: "size-5 text-amber-400" }), " Predictor Leaderboard"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel overflow-hidden border-border/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-secondary/60 p-3.5 border-b border-border/60 flex items-center justify-between text-xs font-bold text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Predictor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pts (Acc %)" })]
						}), leaderboard.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 text-center text-xs text-muted-foreground space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "mx-auto size-8 opacity-40 text-amber-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold",
									children: "No Leaderboard Data Yet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px]",
									children: "Rankings generate automatically as predicted matches finish!"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border/40",
							children: leaderboard.map((row, idx) => {
								const rankIcon = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 flex items-center justify-between hover:bg-secondary/30 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display font-black text-sm text-amber-400 w-6",
											children: rankIcon
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-sm text-foreground truncate max-w-[130px]",
											children: row.userName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground font-semibold",
											children: [
												row.correctCount,
												"/",
												row.totalPredictions,
												" Correct"
											]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-display text-base font-extrabold text-primary",
											children: [row.points, " pts"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-[10px] font-bold text-emerald-400",
											children: [row.accuracyPct, "% Acc"]
										})]
									})]
								}, row.userName);
							})
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { PredictionsPage as component };
