import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Calendar, M as Eye, c as Trophy, m as Shield, p as Shirt, q as Activity, s as User } from "../_libs/lucide-react.mjs";
import { E as getTeamVideoLogo, O as parseResultPenalties, R as TeamLogo, S as formatTime, T as getTeamFoundedYear, V as cn, i as FORMAT_LABELS, w as getMatchWinner, x as formatDate } from "./router-BD6uxmJI.mjs";
import { t as MatchPredictionPoll } from "./prediction-poll-DehHr5SV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-CA5ZAn3t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SectionHeading({ eyebrow, title, subtitle, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-7 flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "label-caps mb-2 text-primary",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-3xl sm:text-4xl",
				children: title
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted-foreground",
				children: subtitle
			})
		] }), action]
	});
}
function StatusBadge({ status }) {
	const styles = {
		live: "border-[var(--live)]/50 bg-[var(--live)]/15 text-[oklch(0.78_0.15_25)]",
		upcoming: "border-primary/40 bg-primary/10 text-primary",
		completed: "border-border bg-secondary text-muted-foreground",
		archived: "border-border bg-secondary text-muted-foreground",
		draft: "border-border bg-secondary text-muted-foreground",
		scheduled: "border-primary/30 bg-primary/10 text-primary",
		postponed: "border-border bg-secondary text-muted-foreground",
		cancelled: "border-destructive/40 bg-destructive/10 text-destructive"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("label-caps inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1", styles[status] ?? styles["draft"]),
		children: [status === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 animate-pulse rounded-full bg-[var(--live)]" }), status]
	});
}
function StatCard({ label, value, hint, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel p-5 transition-transform duration-300 hover:-translate-y-0.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps text-muted-foreground",
					children: label
				}), icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary",
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display mt-3 text-4xl leading-none",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function EmptyState({ title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel flex flex-col items-center gap-3 px-6 py-14 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-12 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-2xl",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm text-muted-foreground",
				children: description
			}),
			action
		]
	});
}
function TeamCard({ team, played, titles }) {
	const [isHovered, setIsHovered] = (0, import_react.useState)(false);
	const primaryColor = team.team_color || "#D4A017";
	const foundedYear = getTeamFoundedYear(team);
	const videoUrl = getTeamVideoLogo(team);
	const borderStyle = {
		borderColor: `${primaryColor}44`,
		boxShadow: `0 4px 20px rgba(0,0,0,0.5), inset 0 0 20px ${primaryColor}08`
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/team/$teamId",
		params: { teamId: team.id },
		className: "group relative flex rounded-2xl bg-zinc-950/90 border transition-all duration-500 flex-row items-center gap-3 p-3 sm:flex-col sm:items-center sm:p-6 sm:hover:-translate-y-2",
		style: borderStyle,
		onMouseEnter: (e) => {
			setIsHovered(true);
			e.currentTarget.style.borderColor = primaryColor;
			e.currentTarget.style.boxShadow = `0 10px 30px ${primaryColor}22, inset 0 0 25px ${primaryColor}15`;
		},
		onMouseLeave: (e) => {
			setIsHovered(false);
			e.currentTarget.style.borderColor = `${primaryColor}44`;
			e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.5), inset 0 0 20px ${primaryColor}08`;
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
				style: {
					border: `1px solid ${primaryColor}`,
					boxShadow: `0 0 15px ${primaryColor}33`
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative shrink-0 sm:mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute -inset-1 rounded-full blur-sm opacity-40 group-hover:opacity-80 transition-opacity duration-300",
					style: { backgroundColor: primaryColor }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
					name: team.name,
					shortName: team.short_name,
					color: team.team_color,
					logoUrl: team.logo_url,
					videoUrl,
					isHovered,
					size: "lg",
					className: "relative size-14 sm:size-32 rounded-full border-2 sm:border-4 border-zinc-950 object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0 sm:w-full sm:text-center sm:space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base sm:text-3xl uppercase tracking-wider text-white group-hover:text-primary transition-colors duration-200 truncate sm:whitespace-normal leading-tight",
						children: team.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mt-1 sm:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-[10px] tracking-widest px-2 py-0.5 rounded border font-semibold uppercase shrink-0",
							style: {
								color: primaryColor,
								borderColor: `${primaryColor}55`,
								backgroundColor: `${primaryColor}11`
							},
							children: team.short_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-zinc-500 uppercase tracking-wider",
							children: ["Est. ", foundedYear]
						})]
					}),
					team.manager_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs text-zinc-500 mt-1 sm:justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
							className: "size-3 shrink-0",
							style: { color: primaryColor }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: team.manager_name
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden sm:flex items-center justify-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-[1px] w-8 bg-zinc-800" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xs tracking-widest px-2.5 py-0.5 rounded border font-semibold uppercase",
								style: {
									color: primaryColor,
									borderColor: `${primaryColor}55`,
									backgroundColor: `${primaryColor}11`
								},
								children: team.short_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-[1px] w-8 bg-zinc-800" })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sm:hidden shrink-0 text-zinc-600",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					className: "size-4",
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					strokeWidth: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						d: "M9 5l7 7-7 7"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden sm:block w-full mt-6 border-t border-zinc-900 pt-6 space-y-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
								className: "size-4",
								style: { color: primaryColor }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-wider font-medium text-zinc-500",
								children: "Founded"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-white font-medium",
							children: foundedYear
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, {
								className: "size-4",
								style: { color: primaryColor }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-wider font-medium text-zinc-500",
								children: "Home Kit"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-white font-medium uppercase flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-2.5 rounded-full",
								style: { backgroundColor: primaryColor }
							}), "Primary"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
								className: "size-4",
								style: { color: primaryColor }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-wider font-medium text-zinc-500",
								children: "Matches Played"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-white font-medium",
							children: played !== void 0 && played !== null ? played : "--"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
								className: "size-4",
								style: { color: primaryColor }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-wider font-medium text-zinc-500",
								children: "Titles"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-white font-medium",
							children: titles !== void 0 && titles !== null ? String(titles).padStart(2, "0") : "00"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden sm:flex w-full mt-6 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 bg-zinc-950 text-zinc-300",
				style: { borderColor: `${primaryColor}22` },
				onMouseEnter: (e) => {
					e.currentTarget.style.borderColor = primaryColor;
					e.currentTarget.style.backgroundColor = `${primaryColor}11`;
					e.currentTarget.style.color = primaryColor;
				},
				onMouseLeave: (e) => {
					e.currentTarget.style.borderColor = `${primaryColor}22`;
					e.currentTarget.style.backgroundColor = "transparent";
					e.currentTarget.style.color = "";
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), "View Team Profile"]
			})
		]
	});
}
function TournamentCard({ tournament, championName, teamCount: propTeamCount, matchCount: propMatchCount }) {
	const teamCount = propTeamCount ?? tournament.tournament_teams?.[0]?.count ?? 0;
	const matchCount = propMatchCount ?? tournament.fixtures?.[0]?.count ?? 0;
	tournament.banner_url ? `${tournament.banner_url}` : tournament.logo_url && `${tournament.logo_url}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/tournament/$slug",
		params: { slug: tournament.slug },
		search: { tab: "overview" },
		className: "panel group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] bg-zinc-950/80 border border-zinc-900 rounded-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full overflow-hidden transition-transform duration-500 group-hover:scale-105 bg-zinc-950",
			children: [
				tournament.banner_url || tournament.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: tournament.banner_url || tournament.logo_url,
					alt: tournament.name,
					className: "w-full h-auto object-contain block"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-48 w-full",
					style: { background: "linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(9,9,11,0.95) 100%)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-950 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-4 right-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: tournament.status })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 pt-6 flex-1 flex flex-col justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase font-semibold tracking-widest text-red-500/80 bg-red-500/10 px-2.5 py-0.5 rounded-full",
						children: FORMAT_LABELS[tournament.format] ?? "League"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-zinc-500 font-medium",
						children: ["Season ", tournament.season_year || (/* @__PURE__ */ new Date()).getFullYear()]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-3 text-2xl font-bold font-display tracking-wide text-white group-hover:text-red-500 transition-colors duration-200 leading-tight",
					children: tournament.name
				}),
				tournament.start_date ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center gap-2 text-xs text-zinc-500 font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 text-zinc-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						formatDate(tournament.start_date),
						" — ",
						formatDate(tournament.end_date)
					] })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center gap-2 text-xs text-zinc-500 italic",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 text-zinc-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scheduling in progress" })]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 border-t border-zinc-900 pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl text-white font-bold",
							children: teamCount
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[0.65rem] uppercase tracking-wider font-semibold text-zinc-500 mt-0.5",
							children: "Teams"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl text-white font-bold",
							children: matchCount
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[0.65rem] uppercase tracking-wider font-semibold text-zinc-500 mt-0.5",
							children: "Matches"
						})]
					})]
				}), championName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-5 text-yellow-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[0.6rem] uppercase tracking-wider font-bold text-yellow-500/80",
						children: "Champion"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-semibold text-white leading-tight mt-0.5",
						children: championName
					})] })]
				})]
			})]
		})]
	});
}
function FixtureCard({ fixture }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel flex flex-col gap-3 p-4 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 border-b border-border/40 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps text-primary truncate",
						children: fixture.tournament?.name ?? "TFF"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground truncate",
						children: fixture.round ?? "Fixture"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0 text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-caps text-muted-foreground text-[11px] font-medium hidden sm:block",
						children: formatDate(fixture.scheduled_date)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: fixture.status })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 sm:gap-4 py-1 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamSide, {
						team: fixture.home,
						align: "left"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0 text-center px-1 sm:px-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-base sm:text-lg font-bold text-muted-foreground leading-none",
							children: "VS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] sm:text-xs text-muted-foreground mt-0.5",
							children: formatTime(fixture.scheduled_time)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamSide, {
						team: fixture.away,
						align: "right"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border/40 pt-2.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchPredictionPoll, {
					fixture,
					compact: true
				})
			})
		]
	});
}
function ResultCard({ fixture }) {
	const result = fixture.result;
	const { winnerTeamId, isPenalties } = getMatchWinner(fixture);
	const { homePen, awayPen } = parseResultPenalties(result);
	const homeWin = winnerTeamId === fixture.home_team_id;
	const awayWin = winnerTeamId === fixture.away_team_id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel p-4 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps text-primary truncate",
					children: fixture.tournament?.name ?? "TFF"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground shrink-0",
					children: formatDate(fixture.scheduled_date)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground truncate",
				children: fixture.round ?? ""
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between gap-3 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamSide, {
						team: fixture.home,
						align: "left",
						dim: awayWin
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display rounded-lg border border-border bg-secondary px-3 py-1 text-2xl font-bold",
							children: result ? `${result.home_score} — ${result.away_score}` : "—"
						}), isPenalties && homePen !== null && awayPen !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full",
							children: [
								"(",
								homePen,
								" - ",
								awayPen,
								" pen)"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamSide, {
						team: fixture.away,
						align: "right",
						dim: homeWin
					})
				]
			})
		]
	});
}
function TeamSide({ team, align, dim }) {
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
		name: team?.name ?? "TBD",
		shortName: team?.short_name,
		color: team?.team_color,
		logoUrl: team?.logo_url,
		size: "sm"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("truncate text-xs sm:text-sm font-semibold min-w-0", dim && "text-muted-foreground"),
		children: team?.name ?? "TBD"
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex min-w-0 flex-1 items-center gap-2", align === "right" && "flex-row-reverse text-right"),
		children: content
	});
}
function StandingsTable({ rows, teams, qualifyCount }) {
	const teamMap = new Map(teams.map((t) => [t.id, t]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "panel overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[720px] text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "label-caps border-b border-border/70 text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 text-left",
						children: "Pos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-3 text-left",
						children: "Team"
					}),
					[
						"P",
						"W",
						"D",
						"L",
						"GF",
						"GA",
						"GD"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-3 text-center",
						children: h
					}, h)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-3 text-center text-yellow-400",
						title: "Yellow Cards",
						children: "YC"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-3 text-center text-red-400",
						title: "Red Cards",
						children: "RC"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 text-center text-primary",
						children: "Pts"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row, index) => {
				const team = teamMap.get(row.team_id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/40 transition-colors last:border-0 hover:bg-secondary/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("font-display grid size-7 place-items-center rounded-md border border-border text-sm", (qualifyCount ? index < qualifyCount : false) && "border-primary/60 bg-primary/15 text-primary"),
								children: index + 1
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/team/$teamId",
								params: { teamId: row.team_id },
								className: "flex items-center gap-2.5 hover:text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
									name: team?.name ?? "Team",
									shortName: team?.short_name,
									color: team?.team_color,
									logoUrl: team?.logo_url,
									size: "sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: team?.name ?? "Unknown"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-3 text-center",
							children: row.played
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-3 text-center",
							children: row.wins
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-3 text-center",
							children: row.draws
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-3 text-center",
							children: row.losses
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-3 text-center",
							children: row.goals_for
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-3 text-center",
							children: row.goals_against
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-3 text-center",
							children: row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-3 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center justify-center gap-1 rounded bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-400 border border-yellow-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-2 rounded-sm bg-yellow-400" }), row.yellow_cards ?? 0]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-3 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center justify-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-2 rounded-sm bg-red-500" }), row.red_cards ?? 0]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "font-display px-4 py-3 text-center text-lg text-primary font-bold",
							children: row.points
						})
					]
				}, row.team_id);
			}) })]
		})
	});
}
//#endregion
export { StandingsTable as a, TeamCard as c, SectionHeading as i, TournamentCard as l, FixtureCard as n, StatCard as o, ResultCard as r, StatusBadge as s, EmptyState as t };
