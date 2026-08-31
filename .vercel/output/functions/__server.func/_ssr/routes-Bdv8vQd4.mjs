import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { V as CalendarDays, W as ArrowRight, c as Trophy, o as Users, t as Youtube, v as Play } from "../_libs/lucide-react.mjs";
import { B as Button, N as sortStandings, R as TeamLogo, b as fetchUpcomingFixtures, d as fetchLatestResults, g as fetchTeams, l as fetchChampions, m as fetchStandings, p as fetchRankingConfig, u as fetchFixtures, v as fetchTournamentTeams, x as formatDate, y as fetchTournaments } from "./router-BD6uxmJI.mjs";
import { i as SectionHeading, l as TournamentCard, n as FixtureCard, r as ResultCard, s as StatusBadge, t as EmptyState } from "./ui-CA5ZAn3t.mjs";
import { n as TrophyRevealModalButton, t as TrophyRevealCard } from "./trophy-reveal-card-BF_YJMwS.mjs";
import { t as Progress } from "./progress-ChzuiZwr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bdv8vQd4.js
var import_jsx_runtime = require_jsx_runtime();
function getEmbedUrl(url) {
	if (!url) return "https://www.youtube.com/embed/live_stream?channel=UCphlpfpbcsfwubdrtfpmb";
	if (url.includes("embed/")) return url;
	let videoId = "";
	if (url.includes("watch?v=")) videoId = url.split("watch?v=")[1]?.split("&")[0];
	else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split("?")[0];
	else if (url.includes("live/")) videoId = url.split("live/")[1]?.split("?")[0];
	if (videoId) return `https://www.youtube.com/embed/${videoId}`;
	return url;
}
function LiveStreamSection({ liveUrl }) {
	const embedUrl = getEmbedUrl(liveUrl);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel relative overflow-hidden p-6 sm:p-8 border-red-600/30 bg-black/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-0 right-0 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex h-3 w-3 relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-red-600" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-[1.2fr_1.8fr] items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-red-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "size-6 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg tracking-wider",
							children: "TFF LIVE STREAM"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl font-display uppercase tracking-wide",
						children: "Watch the Action Live"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground leading-relaxed",
						children: "Sometimes we stream tournaments and matches live on our YouTube channel. Tune in to watch competitive eFootball, intense finals, and highlight reels."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "bg-red-600 hover:bg-red-700 text-white font-semibold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: liveUrl || "https://www.youtube.com/@Dante_JR_7",
							target: "_blank",
							rel: "noopener noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 mr-2" }), " Visit YouTube Channel"]
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative aspect-video rounded-xl overflow-hidden border border-border/80 shadow-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					className: "absolute inset-0 w-full h-full",
					src: embedUrl,
					title: "TFF Live Stream",
					allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
					allowFullScreen: true
				})
			})]
		})]
	});
}
function Home() {
	const tournaments = useQuery({
		queryKey: ["tournaments"],
		queryFn: fetchTournaments
	});
	const teams = useQuery({
		queryKey: ["teams"],
		queryFn: fetchTeams
	});
	const champions = useQuery({
		queryKey: ["champions"],
		queryFn: fetchChampions
	});
	const results = useQuery({
		queryKey: ["latest-results"],
		queryFn: () => fetchLatestResults(4)
	});
	const upcoming = useQuery({
		queryKey: ["upcoming"],
		queryFn: () => fetchUpcomingFixtures(4)
	});
	const config = useQuery({
		queryKey: ["ranking-config"],
		queryFn: fetchRankingConfig
	});
	const all = tournaments.data ?? [];
	const active = all.find((t) => t.status === "live") ?? null;
	const archive = all.filter((t) => t.status === "completed" || t.status === "archived");
	const teamMap = new Map((teams.data ?? []).map((t) => [t.id, t]));
	const championByTournament = new Map((champions.data ?? []).map((c) => [c.tournament_id, c.champion_team_id]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrophyRevealCard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveStreamSection, { liveUrl: config.data?.youtube_live_url }),
			active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActiveTournament, {
				tournamentId: active.id,
				slug: active.slug
			}),
			results.data && results.data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Match Centre",
				title: "Latest Results",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tournaments",
						children: "View All Results"
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: results.data.map((fixture) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, { fixture }, fixture.id))
			})] }),
			upcoming.data && upcoming.data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Fixtures",
				title: "Upcoming Matches"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: upcoming.data.map((fixture) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FixtureCard, { fixture }, fixture.id))
			})] }),
			archive.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "History",
				title: "TFF Tournament Archive",
				subtitle: "Every tournament. Every result. Every champion.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/tournaments",
						children: ["All Tournaments ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 md:grid-cols-2 lg:grid-cols-3",
				children: archive.map((tournament) => {
					const championId = championByTournament.get(tournament.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TournamentCard, {
						tournament,
						championName: championId ? teamMap.get(championId)?.name : null
					}, tournament.id);
				})
			})] })
		]
	})] });
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden border-b border-border/70",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 opacity-75",
			style: { background: "radial-gradient(120% 90% at 50% -10%, oklch(0.62 0.22 25 / 20%), transparent 70%)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps text-primary",
					children: "Triad Football Federation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-4 text-6xl leading-[0.9] sm:text-8xl",
					children: ["TFF ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gradient-gold",
						children: "eFOOTBALL"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display mt-4 text-2xl text-silver sm:text-3xl",
					children: "Compete. Conquer. Create History."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-6 max-w-2xl text-sm text-muted-foreground sm:text-base",
					children: "TFF is a competitive eFootball tournament organization bringing players together through organized competitions, intense matches and unforgettable finals."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-9 flex flex-wrap justify-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/tournaments",
								children: "View Tournaments"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrophyRevealModalButton, { label: "Watch Trophy Reveal" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/teams",
								children: "View Teams"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/champions",
								children: "Tournament History"
							})
						})
					]
				})
			]
		})]
	});
}
function ActiveTournament({ tournamentId, slug }) {
	const tournament = (useQuery({
		queryKey: ["tournaments"],
		queryFn: fetchTournaments
	}).data ?? []).find((t) => t.id === tournamentId);
	const fixtures = useQuery({
		queryKey: ["fixtures", tournamentId],
		queryFn: () => fetchFixtures(tournamentId),
		enabled: !!tournamentId
	});
	const standings = useQuery({
		queryKey: ["standings", tournamentId],
		queryFn: () => fetchStandings(tournamentId),
		enabled: !!tournamentId
	});
	const entrants = useQuery({
		queryKey: ["tournament-teams", tournamentId],
		queryFn: () => fetchTournamentTeams(tournamentId),
		enabled: !!tournamentId
	});
	if (!tournament || !slug) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
		eyebrow: "Now Playing",
		title: "Current Tournament"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No Active Tournament",
		description: "Stay tuned for the next TFF competition.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tournaments",
				children: "Explore Tournament History"
			})
		})
	})] });
	const all = fixtures.data ?? [];
	const played = all.filter((f) => f.status === "completed").length;
	const leaderRow = sortStandings(standings.data ?? [], tournament.tiebreakers)[0];
	const leader = (entrants.data ?? []).find((team) => team.id === leaderRow?.team_id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
		eyebrow: "Now Playing",
		title: "Current Tournament"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel relative overflow-hidden p-6 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -right-20 -top-24 size-72 rounded-full opacity-20 blur-3xl",
				style: { background: "var(--gradient-gold)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-wrap items-start justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display grid size-16 place-items-center rounded-2xl border border-primary/40 text-lg text-primary",
						style: { background: "var(--gradient-surface)" },
						children: "TFF"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: tournament.status }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 text-4xl uppercase",
							children: tournament.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 flex items-center gap-2 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-3.5" }),
								formatDate(tournament.start_date),
								" — ",
								formatDate(tournament.end_date)
							]
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/tournament/$slug",
						params: { slug },
						search: { tab: "overview" },
						children: ["View Tournament ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "Teams",
							value: entrants.data?.length ?? 0,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "Played",
							value: played
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "Remaining",
							value: all.length - played
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "Total",
							value: all.length
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-caps",
							children: "Progress"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							played,
							" / ",
							all.length,
							" matches"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: all.length ? played / all.length * 100 : 0 })]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel flex items-center gap-4 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLogo, {
						name: leader?.name ?? "TBD",
						shortName: leader?.short_name,
						color: leader?.team_color,
						logoUrl: leader?.logo_url,
						size: "lg"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "label-caps flex items-center gap-1.5 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-3.5" }), " Current Leader"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display mt-1 text-2xl",
							children: leader?.name ?? "To be decided"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [leaderRow?.points ?? 0, " points"]
						})
					] })]
				})]
			})
		]
	})] });
}
function MiniStat({ label, value, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border/70 bg-secondary/40 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "label-caps flex items-center gap-1.5 text-muted-foreground",
			children: [
				icon,
				" ",
				label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display mt-1.5 text-3xl",
			children: value
		})]
	});
}
//#endregion
export { Home as component };
