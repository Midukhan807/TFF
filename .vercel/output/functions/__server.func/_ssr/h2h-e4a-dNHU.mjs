import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as History, G as ArrowRightLeft, T as LoaderCircle, c as Trophy, f as Sparkles, h as ShieldCheck, j as Flame, u as Swords } from "../_libs/lucide-react.mjs";
import { E as getTeamVideoLogo, I as Route$6, R as TeamLogo, T as getTeamFoundedYear, c as fetchAllStandings, g as fetchTeams, l as fetchChampions, s as fetchAllFixtures, w as getMatchWinner, x as formatDate } from "./router-BD6uxmJI.mjs";
import { t as EmptyState } from "./ui-CA5ZAn3t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/h2h-e4a-dNHU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function computeForm(teamId, allFixtures, limit = 5) {
	return allFixtures.filter((f) => f.status === "completed" && f.result && (f.home_team_id === teamId || f.away_team_id === teamId)).sort((a, b) => {
		const dateA = a.scheduled_date || a.result?.played_at || "";
		return (b.scheduled_date || b.result?.played_at || "").localeCompare(dateA);
	}).slice(0, limit).map((f) => {
		const isHome = f.home_team_id === teamId;
		const myScore = isHome ? Number(f.result?.home_score) || 0 : Number(f.result?.away_score) || 0;
		const oppScore = isHome ? Number(f.result?.away_score) || 0 : Number(f.result?.home_score) || 0;
		const opp = isHome ? f.away : f.home;
		let res = "D";
		if (myScore > oppScore) res = "W";
		else if (myScore < oppScore) res = "L";
		return {
			fixtureId: f.id,
			opponentName: opp?.name || "Unknown",
			opponentShortName: opp?.short_name || "UNK",
			result: res,
			scoreText: `${myScore}-${oppScore}`,
			date: f.scheduled_date || ""
		};
	});
}
function computeH2HComparison(teamA, teamB, allFixtures, allStandings = [], _champions = []) {
	const directFixtures = allFixtures.filter((f) => f.status === "completed" && f.result && (f.home_team_id === teamA.id && f.away_team_id === teamB.id || f.home_team_id === teamB.id && f.away_team_id === teamA.id));
	let winsA = 0;
	let winsB = 0;
	let draws = 0;
	let gfA = 0;
	let gfB = 0;
	let cleanSheetsA = 0;
	let cleanSheetsB = 0;
	let yellowA = 0;
	let yellowB = 0;
	let redA = 0;
	let redB = 0;
	let maxMarginA = 0;
	let maxMarginB = 0;
	let biggestWinA = null;
	let biggestWinB = null;
	let maxTotalGoals = -1;
	let highestScoringMatch = null;
	const matchesList = [];
	for (const f of directFixtures) {
		const res = f.result;
		const isAHome = f.home_team_id === teamA.id;
		const scoreA = isAHome ? Number(res.home_score) || 0 : Number(res.away_score) || 0;
		const scoreB = isAHome ? Number(res.away_score) || 0 : Number(res.home_score) || 0;
		const yA = isAHome ? Number(res.home_yellow_cards) || 0 : Number(res.away_yellow_cards) || 0;
		const yB = isAHome ? Number(res.away_yellow_cards) || 0 : Number(res.home_yellow_cards) || 0;
		const rA = isAHome ? Number(res.home_red_cards) || 0 : Number(res.away_red_cards) || 0;
		const rB = isAHome ? Number(res.away_red_cards) || 0 : Number(res.home_red_cards) || 0;
		gfA += scoreA;
		gfB += scoreB;
		yellowA += yA;
		yellowB += yB;
		redA += rA;
		redB += rB;
		if (scoreB === 0) cleanSheetsA += 1;
		if (scoreA === 0) cleanSheetsB += 1;
		const { winnerTeamId } = getMatchWinner(f);
		let winnerId = winnerTeamId;
		if (winnerId === teamA.id) {
			winsA += 1;
			const margin = Math.max(1, scoreA - scoreB);
			if (margin > maxMarginA) {
				maxMarginA = margin;
				biggestWinA = {
					fixture: f,
					date: f.scheduled_date || res.played_at || f.created_at || "",
					tournamentName: f.tournament?.name || "TFF Tournament",
					homeTeamId: f.home_team_id || "",
					awayTeamId: f.away_team_id || "",
					homeScore: Number(res.home_score) || 0,
					awayScore: Number(res.away_score) || 0,
					winnerTeamId: winnerId
				};
			}
		} else if (winnerId === teamB.id) {
			winsB += 1;
			const margin = Math.max(1, scoreB - scoreA);
			if (margin > maxMarginB) {
				maxMarginB = margin;
				biggestWinB = {
					fixture: f,
					date: f.scheduled_date || res.played_at || f.created_at || "",
					tournamentName: f.tournament?.name || "TFF Tournament",
					homeTeamId: f.home_team_id || "",
					awayTeamId: f.away_team_id || "",
					homeScore: Number(res.home_score) || 0,
					awayScore: Number(res.away_score) || 0,
					winnerTeamId: winnerId
				};
			}
		} else draws += 1;
		const matchObj = {
			fixture: f,
			date: f.scheduled_date || res.played_at || f.created_at || "",
			tournamentName: f.tournament?.name || "TFF Tournament",
			homeTeamId: f.home_team_id || "",
			awayTeamId: f.away_team_id || "",
			homeScore: Number(res.home_score) || 0,
			awayScore: Number(res.away_score) || 0,
			winnerTeamId: winnerId
		};
		matchesList.push(matchObj);
		const totG = scoreA + scoreB;
		if (totG > maxTotalGoals) {
			maxTotalGoals = totG;
			highestScoringMatch = matchObj;
		}
	}
	const calcCareerStats = (teamId) => {
		const rows = allStandings.filter((s) => s.team_id === teamId);
		let p = 0;
		let w = 0;
		for (const r of rows) {
			p += r.played;
			w += r.wins;
		}
		const koCompleted = allFixtures.filter((f) => (f.stage === "knockout" || !!f.round) && f.status === "completed" && f.result && (f.home_team_id === teamId || f.away_team_id === teamId));
		for (const f of koCompleted) {
			p += 1;
			const isHome = f.home_team_id === teamId;
			if ((isHome ? Number(f.result?.home_score) || 0 : Number(f.result?.away_score) || 0) > (isHome ? Number(f.result?.away_score) || 0 : Number(f.result?.home_score) || 0)) w += 1;
		}
		const winPct = p > 0 ? w / p * 100 : 50;
		return {
			p,
			w,
			winPct
		};
	};
	const careerA = calcCareerStats(teamA.id);
	const careerB = calcCareerStats(teamB.id);
	const formA = computeForm(teamA.id, allFixtures, 5);
	const formB = computeForm(teamB.id, allFixtures, 5);
	const formPts = (form) => form.reduce((sum, item) => sum + (item.result === "W" ? 3 : item.result === "D" ? 1 : 0), 0);
	const ptsFormA = formPts(formA);
	const ptsFormB = formPts(formB);
	let ratingA = 50;
	let ratingB = 50;
	if (directFixtures.length > 0) {
		const h2hPctA = (winsA + draws * .5) / directFixtures.length;
		const h2hPctB = (winsB + draws * .5) / directFixtures.length;
		ratingA = h2hPctA * 50 + careerA.winPct / 100 * 30 + ptsFormA / 15 * 20;
		ratingB = h2hPctB * 50 + careerB.winPct / 100 * 30 + ptsFormB / 15 * 20;
	} else {
		ratingA = careerA.winPct / 100 * 60 + ptsFormA / 15 * 40;
		ratingB = careerB.winPct / 100 * 60 + ptsFormB / 15 * 40;
	}
	const totalRating = ratingA + ratingB || 100;
	let rawWinA = ratingA / totalRating * 78;
	let rawWinB = ratingB / totalRating * 78;
	if ((directFixtures.length > 0 ? draws / directFixtures.length : .25) > .3) {
		const rem = 72;
		rawWinA = ratingA / totalRating * rem;
		rawWinB = ratingB / totalRating * rem;
	}
	const winPctA = Math.round(rawWinA);
	const winPctB = Math.round(rawWinB);
	const drawPct = 100 - winPctA - winPctB;
	return {
		teamA,
		teamB,
		totalMatches: directFixtures.length,
		statsA: {
			wins: winsA,
			draws,
			losses: winsB,
			goalsScored: gfA,
			goalsConceded: gfB,
			cleanSheets: cleanSheetsA,
			yellowCards: yellowA,
			redCards: redA,
			overallWinPct: Math.round(careerA.winPct),
			form: formA
		},
		statsB: {
			wins: winsB,
			draws,
			losses: winsA,
			goalsScored: gfB,
			goalsConceded: gfA,
			cleanSheets: cleanSheetsB,
			yellowCards: yellowB,
			redCards: redB,
			overallWinPct: Math.round(careerB.winPct),
			form: formB
		},
		matches: matchesList,
		probability: {
			winPctA,
			drawPct,
			winPctB
		},
		biggestWinA,
		biggestWinB,
		highestScoringMatch
	};
}
function H2HPredictor({ teams, teamAId, teamBId, onSelectTeamA, onSelectTeamB, allFixtures, allStandings, champions }) {
	const teamA = (0, import_react.useMemo)(() => teams.find((t) => t.id === teamAId) || teams[0], [teams, teamAId]);
	const teamB = (0, import_react.useMemo)(() => teams.find((t) => t.id === teamBId) || teams.find((t) => t.id !== teamA?.id) || teams[1], [
		teams,
		teamBId,
		teamA
	]);
	const comparison = (0, import_react.useMemo)(() => {
		if (!teamA || !teamB) return null;
		return computeH2HComparison(teamA, teamB, allFixtures, allStandings, champions);
	}, [
		teamA,
		teamB,
		allFixtures,
		allStandings,
		champions
	]);
	if (!teamA || !teamB || !comparison) return null;
	const swapTeams = () => {
		onSelectTeamA(teamB.id);
		onSelectTeamB(teamA.id);
	};
	const { statsA, statsB, probability, matches, totalMatches, biggestWinA, biggestWinB } = comparison;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel p-6 border-border/80 bg-card/60 backdrop-blur-md shadow-2xl rounded-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-between gap-6 md:flex-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full flex-1 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
								name: teamA.name,
								shortName: teamA.short_name,
								color: teamA.team_color,
								logoUrl: teamA.logo_url,
								videoUrl: getTeamVideoLogo(teamA),
								size: "md"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
									children: "Team 1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: teamA.id,
									onChange: (e) => onSelectTeamA(e.target.value),
									className: "mt-1 w-full rounded-lg border border-border/80 bg-background/90 px-3 py-2 text-sm font-semibold text-foreground shadow-sm focus:border-primary focus:outline-none",
									children: teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: t.id,
										disabled: t.id === teamB.id,
										children: [
											t.name,
											" (",
											t.short_name,
											")"
										]
									}, t.id))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: swapTeams,
							title: "Swap Teams",
							className: "flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110 active:scale-95",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full flex-1 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 text-right md:text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
									children: "Team 2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: teamB.id,
									onChange: (e) => onSelectTeamB(e.target.value),
									className: "mt-1 w-full rounded-lg border border-border/80 bg-background/90 px-3 py-2 text-sm font-semibold text-foreground shadow-sm focus:border-primary focus:outline-none",
									children: teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: t.id,
										disabled: t.id === teamA.id,
										children: [
											t.name,
											" (",
											t.short_name,
											")"
										]
									}, t.id))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
								name: teamB.name,
								shortName: teamB.short_name,
								color: teamB.team_color,
								logoUrl: teamB.logo_url,
								videoUrl: getTeamVideoLogo(teamB),
								size: "md"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-b from-background via-card/80 to-background p-6 sm:p-8 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -left-20 -top-20 size-72 rounded-full opacity-20 blur-3xl",
						style: { backgroundColor: teamA.team_color || "#3b82f6" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -right-20 -top-20 size-72 rounded-full opacity-20 blur-3xl",
						style: { backgroundColor: teamB.team_color || "#ef4444" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center text-center md:items-start md:text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
										name: teamA.name,
										shortName: teamA.short_name,
										color: teamA.team_color,
										logoUrl: teamA.logo_url,
										videoUrl: getTeamVideoLogo(teamA),
										size: "lg"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 text-3xl font-extrabold uppercase tracking-wide",
										children: teamA.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground font-medium",
										children: [
											"Manager: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-semibold",
												children: teamA.manager_name || "N/A"
											}),
											" · Est. ",
											getTeamFoundedYear(teamA)
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground uppercase font-semibold",
											children: "Form:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormBadges, { form: statsA.form })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex size-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 shadow-lg shadow-primary/20 animate-pulse",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-8 text-primary" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-2 text-xs uppercase tracking-widest font-bold text-muted-foreground",
										children: "Rivalry Clash"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex items-center gap-2 rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-primary border border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-3.5" }),
											" ",
											totalMatches,
											" ",
											totalMatches === 1 ? "Meeting" : "Meetings",
											" Recorded"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center text-center md:items-end md:text-right",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
										name: teamB.name,
										shortName: teamB.short_name,
										color: teamB.team_color,
										logoUrl: teamB.logo_url,
										videoUrl: getTeamVideoLogo(teamB),
										size: "lg"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 text-3xl font-extrabold uppercase tracking-wide",
										children: teamB.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground font-medium",
										children: [
											"Manager: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-semibold",
												children: teamB.manager_name || "N/A"
											}),
											" · Est. ",
											getTeamFoundedYear(teamB)
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground uppercase font-semibold",
											children: "Form:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormBadges, { form: statsB.form })]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 border-t border-border/70 pt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm font-bold uppercase tracking-wider mb-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-blue-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }),
											" ",
											teamA.short_name,
											" Win ",
											probability.winPctA,
											"%"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground text-xs font-semibold",
										children: [
											"Draw ",
											probability.drawPct,
											"%"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-emerald-400",
										children: [
											teamB.short_name,
											" Win ",
											probability.winPctB,
											"% ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" })
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-4.5 w-full overflow-hidden rounded-full border border-border/80 bg-secondary shadow-inner",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											width: `${probability.winPctA}%`,
											backgroundColor: teamA.team_color || "#3b82f6"
										},
										className: "flex items-center justify-center text-[10px] font-extrabold text-white transition-all duration-500",
										title: `${teamA.name} Win Probability: ${probability.winPctA}%`,
										children: probability.winPctA >= 15 && `${probability.winPctA}%`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: { width: `${probability.drawPct}%` },
										className: "flex items-center justify-center bg-zinc-600/70 text-[10px] font-extrabold text-zinc-200 transition-all duration-500",
										title: `Draw Probability: ${probability.drawPct}%`,
										children: probability.drawPct >= 10 && `${probability.drawPct}%`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											width: `${probability.winPctB}%`,
											backgroundColor: teamB.team_color || "#10b981"
										},
										className: "flex items-center justify-center text-[10px] font-extrabold text-white transition-all duration-500",
										title: `${teamB.name} Win Probability: ${probability.winPctB}%`,
										children: probability.winPctB >= 15 && `${probability.winPctB}%`
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-center text-xs text-muted-foreground italic",
								children: "*Predictive rating calculated using direct H2H history, career win percentages, and recent form."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-6 border-border/80 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-xl font-bold uppercase tracking-wide flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-5 text-primary" }), " Head-to-Head Stats Comparison"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatComparisonRow, {
							label: "Direct Wins",
							valA: statsA.wins,
							valB: statsB.wins,
							colorA: teamA.team_color,
							colorB: teamB.team_color
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatComparisonRow, {
							label: "Direct Goals Scored",
							valA: statsA.goalsScored,
							valB: statsB.goalsScored,
							colorA: teamA.team_color,
							colorB: teamB.team_color
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatComparisonRow, {
							label: "Clean Sheets in H2H",
							valA: statsA.cleanSheets,
							valB: statsB.cleanSheets,
							colorA: teamA.team_color,
							colorB: teamB.team_color
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatComparisonRow, {
							label: "Overall Career Win %",
							valA: `${statsA.overallWinPct}%`,
							valB: `${statsB.overallWinPct}%`,
							rawA: statsA.overallWinPct,
							rawB: statsB.overallWinPct,
							colorA: teamA.team_color,
							colorB: teamB.team_color
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatComparisonRow, {
							label: "Yellow Cards (H2H)",
							valA: statsA.yellowCards,
							valB: statsB.yellowCards,
							rawA: statsA.yellowCards,
							rawB: statsB.yellowCards,
							invertHighlight: true,
							colorA: teamA.team_color,
							colorB: teamB.team_color
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatComparisonRow, {
							label: "Red Cards (H2H)",
							valA: statsA.redCards,
							valB: statsB.redCards,
							rawA: statsA.redCards,
							rawB: statsB.redCards,
							invertHighlight: true,
							colorA: teamA.team_color,
							colorB: teamB.team_color
						})
					]
				})]
			}),
			(biggestWinA || biggestWinB) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [biggestWinA && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-4 border-l-4 border-l-primary bg-card/70",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs uppercase font-bold text-muted-foreground",
							children: ["Biggest Win for ", teamA.short_name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-lg font-extrabold text-foreground",
							children: [
								teamA.short_name,
								" ",
								biggestWinA.homeScore,
								" - ",
								biggestWinA.awayScore,
								" ",
								teamB.short_name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								biggestWinA.tournamentName,
								" · ",
								formatDate(biggestWinA.date)
							]
						})
					]
				}), biggestWinB && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-4 border-l-4 border-l-emerald-500 bg-card/70",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs uppercase font-bold text-muted-foreground",
							children: ["Biggest Win for ", teamB.short_name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-lg font-extrabold text-foreground",
							children: [
								teamB.short_name,
								" ",
								biggestWinB.awayScore,
								" - ",
								biggestWinB.homeScore,
								" ",
								teamA.short_name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								biggestWinB.tournamentName,
								" · ",
								formatDate(biggestWinB.date)
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-6 border-border/80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-xl font-bold uppercase tracking-wide flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-5 text-primary" }),
							" Past Encounters (",
							matches.length,
							")"
						]
					})
				}), matches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-dashed border-border/80 p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mx-auto size-10 text-muted-foreground/50" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mt-2 font-semibold",
							children: "No Past Matches Recorded"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: [
								teamA.name,
								" and ",
								teamB.name,
								" have not faced each other in an official TFF tournament match yet."
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: matches.map((m, idx) => {
						const homeIsA = m.homeTeamId === teamA.id;
						const teamHome = homeIsA ? teamA : teamB;
						const teamAway = homeIsA ? teamB : teamA;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-between gap-4 rounded-xl border border-border/70 bg-card/40 p-4 transition-all hover:bg-card/90 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-3.5 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.tournamentName }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(m.date) })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 font-bold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: m.winnerTeamId === teamHome.id ? "text-primary font-black" : "",
											children: teamHome.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
											name: teamHome.name,
											shortName: teamHome.short_name,
											color: teamHome.team_color,
											logoUrl: teamHome.logo_url,
											size: "xs"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-secondary px-3 py-1 text-sm font-extrabold tracking-wider border border-border",
										children: [
											m.homeScore,
											" - ",
											m.awayScore
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
											name: teamAway.name,
											shortName: teamAway.short_name,
											color: teamAway.team_color,
											logoUrl: teamAway.logo_url,
											size: "xs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: m.winnerTeamId === teamAway.id ? "text-primary font-black" : "",
											children: teamAway.name
										})]
									})
								]
							})]
						}, m.fixture.id || idx);
					})
				})]
			})
		]
	});
}
function FormBadges({ form }) {
	if (form.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-muted-foreground italic",
		children: "No games"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-1",
		children: form.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			title: `${f.result} vs ${f.opponentName} (${f.scoreText})`,
			className: `flex size-5.5 items-center justify-center rounded text-[10px] font-extrabold uppercase text-white shadow-sm ${f.result === "W" ? "bg-emerald-600" : f.result === "D" ? "bg-amber-600" : "bg-red-600"}`,
			children: f.result
		}, f.fixtureId + i))
	});
}
function StatComparisonRow({ label, valA, valB, rawA, rawB, invertHighlight = false, colorA, colorB }) {
	const numA = rawA !== void 0 ? rawA : typeof valA === "number" ? valA : 0;
	const numB = rawB !== void 0 ? rawB : typeof valB === "number" ? valB : 0;
	const total = numA + numB || 1;
	const pctA = Math.round(numA / total * 100);
	const pctB = Math.round(numB / total * 100);
	const isAheadA = invertHighlight ? numA < numB : numA > numB;
	const isAheadB = invertHighlight ? numB < numA : numB > numA;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-xs font-bold uppercase tracking-wider",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: isAheadA ? "text-primary font-black text-sm" : "text-muted-foreground",
					children: valA
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground/80",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: isAheadB ? "text-primary font-black text-sm" : "text-muted-foreground",
					children: valB
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-2 w-full overflow-hidden rounded-full bg-secondary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					width: `${pctA}%`,
					backgroundColor: isAheadA ? colorA || "#3b82f6" : "#64748b"
				},
				className: "h-full transition-all duration-300"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					width: `${pctB}%`,
					backgroundColor: isAheadB ? colorB || "#ef4444" : "#64748b"
				},
				className: "h-full transition-all duration-300"
			})]
		})]
	});
}
function H2HPage() {
	const { team1, team2 } = Route$6.useSearch();
	const navigate = useNavigate({ from: Route$6.fullPath });
	const teams = useQuery({
		queryKey: ["teams"],
		queryFn: fetchTeams
	});
	const fixtures = useQuery({
		queryKey: ["all-fixtures"],
		queryFn: fetchAllFixtures
	});
	const standings = useQuery({
		queryKey: ["all-standings"],
		queryFn: fetchAllStandings
	});
	const champions = useQuery({
		queryKey: ["champions"],
		queryFn: fetchChampions
	});
	const isLoading = teams.isLoading || fixtures.isLoading || standings.isLoading || champions.isLoading;
	const teamList = teams.data ?? [];
	const selectedA = team1 && teamList.some((t) => t.id === team1) ? team1 : teamList[0]?.id || "";
	const selectedB = team2 && teamList.some((t) => t.id === team2) && team2 !== selectedA ? team2 : teamList.find((t) => t.id !== selectedA)?.id || "";
	const handleSelectA = (id) => {
		navigate({
			search: (prev) => ({
				...prev,
				team1: id
			}),
			replace: true
		});
	};
	const handleSelectB = (id) => {
		navigate({
			search: (prev) => ({
				...prev,
				team2: id
			}),
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "border-b border-border/70",
		style: { background: "var(--gradient-surface)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 py-12 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-primary mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-6 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-caps font-bold",
						children: "TFF Analytics Tool"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl sm:text-5xl uppercase font-black",
					children: "Head-to-Head Rivalry"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl",
					children: "Compare any two TFF teams side-by-side. Analyze historical match scores, direct win/loss records, current form, and win probability predictions."
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-10 sm:px-6",
		children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-10 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground font-semibold",
				children: "Calculating Head-to-Head analytics..."
			})]
		}) : teamList.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Insufficient Teams",
			description: "At least 2 teams must exist in TFF to run Head-to-Head comparison."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(H2HPredictor, {
			teams: teamList,
			teamAId: selectedA,
			teamBId: selectedB,
			onSelectTeamA: handleSelectA,
			onSelectTeamB: handleSelectB,
			allFixtures: fixtures.data ?? [],
			allStandings: standings.data ?? [],
			champions: champions.data ?? []
		})
	})] });
}
//#endregion
export { H2HPage as component };
