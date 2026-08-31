import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-D-eR6n2z.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { R as Check, r as Vote, s as User } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Button, O as parseResultPenalties } from "./router-BD6uxmJI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prediction-poll-DehHr5SV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var VISITOR_ID_KEY = "tff_visitor_id";
var USER_HANDLE_KEY = "tff_user_handle";
var LOCAL_VOTES_KEY = "tff_local_prediction_votes";
function getVisitorId() {
	if (typeof window === "undefined") return "guest_visitor";
	let id = localStorage.getItem(VISITOR_ID_KEY);
	if (!id) {
		id = "v_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
		localStorage.setItem(VISITOR_ID_KEY, id);
	}
	return id;
}
function getStoredHandle() {
	if (typeof window === "undefined") return "";
	return localStorage.getItem(USER_HANDLE_KEY) || "";
}
function setStoredHandle(name) {
	if (typeof window === "undefined") return;
	localStorage.setItem(USER_HANDLE_KEY, name.trim());
}
function getLocalVotes() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(LOCAL_VOTES_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function saveLocalVote(vote) {
	if (typeof window === "undefined") return;
	try {
		const filtered = getLocalVotes().filter((v) => !(v.fixture_id === vote.fixture_id && v.visitor_id === vote.visitor_id));
		filtered.push(vote);
		localStorage.setItem(LOCAL_VOTES_KEY, JSON.stringify(filtered));
	} catch {}
}
var GLOBAL_PREDICTIONS_URL = `https://api.restful-api.dev/objects/ff8081819ff5b11001a01978f8174eb1`;
async function fetchGlobalCloudVotes() {
	try {
		const res = await fetch(GLOBAL_PREDICTIONS_URL);
		if (!res.ok) return [];
		return (await res.json()).data?.votes || [];
	} catch {
		return [];
	}
}
async function syncGlobalCloudVotes(votesToSync) {
	try {
		const existingCloudVotes = await fetchGlobalCloudVotes();
		const map = /* @__PURE__ */ new Map();
		for (const v of [...existingCloudVotes, ...votesToSync]) if (v.fixture_id && v.visitor_id) map.set(`${v.fixture_id}_${v.visitor_id}`, v);
		const merged = Array.from(map.values());
		if (merged.length > existingCloudVotes.length || votesToSync.length > 0) await fetch(GLOBAL_PREDICTIONS_URL, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: "TFF_PREDICTIONS_GLOBAL_STORE_V1",
				data: { votes: merged }
			})
		});
		return merged;
	} catch {
		return votesToSync;
	}
}
async function fetchPredictionsForFixture(fixtureId) {
	return (await fetchAllPredictions()).filter((v) => v.fixture_id === fixtureId);
}
async function fetchAllPredictions() {
	let dbVotes = [];
	try {
		const { data, error } = await supabase.from("predictions").select("*");
		if (!error && data) dbVotes = data;
	} catch {}
	const localVotes = getLocalVotes();
	const syncedVotes = await syncGlobalCloudVotes([...dbVotes, ...localVotes]);
	const combinedMap = /* @__PURE__ */ new Map();
	for (const v of [
		...dbVotes,
		...syncedVotes,
		...localVotes
	]) combinedMap.set(`${v.fixture_id}_${v.visitor_id}`, v);
	return Array.from(combinedMap.values());
}
async function submitPredictionVote(fixtureId, choice, userName) {
	const visitorId = getVisitorId();
	const nameToUse = userName?.trim() || getStoredHandle() || "Anonymous Fan";
	if (userName?.trim()) setStoredHandle(userName.trim());
	const votePayload = {
		id: `vote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
		fixture_id: fixtureId,
		visitor_id: visitorId,
		user_name: nameToUse,
		prediction: choice,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	saveLocalVote(votePayload);
	await syncGlobalCloudVotes([votePayload]);
	try {
		await supabase.from("predictions").upsert({
			fixture_id: fixtureId,
			visitor_id: visitorId,
			user_name: nameToUse,
			prediction: choice
		}, { onConflict: "fixture_id,visitor_id" });
	} catch {}
	return votePayload;
}
function computePredictionStats(votes) {
	const totalVotes = votes.length;
	if (totalVotes === 0) return {
		totalVotes: 0,
		homeVotes: 0,
		drawVotes: 0,
		awayVotes: 0,
		homePct: 34,
		drawPct: 33,
		awayPct: 33
	};
	const homeVotes = votes.filter((v) => v.prediction === "home").length;
	const drawVotes = votes.filter((v) => v.prediction === "draw").length;
	const awayVotes = votes.filter((v) => v.prediction === "away").length;
	const homePct = Math.round(homeVotes / totalVotes * 100);
	const drawPct = Math.round(drawVotes / totalVotes * 100);
	return {
		totalVotes,
		homeVotes,
		drawVotes,
		awayVotes,
		homePct,
		drawPct,
		awayPct: Math.max(0, 100 - homePct - drawPct)
	};
}
function computePredictionLeaderboard(completedFixtures, allVotes) {
	const fixtureOutcomeMap = /* @__PURE__ */ new Map();
	for (const f of completedFixtures) if (f.status === "completed" && f.result) {
		const res = f.result;
		const homeScore = Number(res.home_score) || 0;
		const awayScore = Number(res.away_score) || 0;
		if (homeScore > awayScore) fixtureOutcomeMap.set(f.id, "home");
		else if (awayScore > homeScore) fixtureOutcomeMap.set(f.id, "away");
		else {
			const { homePen, awayPen } = parseResultPenalties(res);
			if (homePen !== null && awayPen !== null) fixtureOutcomeMap.set(f.id, homePen > awayPen ? "home" : "away");
			else fixtureOutcomeMap.set(f.id, "draw");
		}
	}
	const userStatsMap = /* @__PURE__ */ new Map();
	for (const vote of allVotes) {
		const outcome = fixtureOutcomeMap.get(vote.fixture_id);
		if (!outcome) continue;
		const key = vote.user_name || "Anonymous Fan";
		const current = userStatsMap.get(key) || {
			total: 0,
			correct: 0,
			points: 0
		};
		current.total += 1;
		if (vote.prediction === outcome) {
			current.correct += 1;
			current.points += 3;
		}
		userStatsMap.set(key, current);
	}
	const rows = [];
	for (const [userName, stats] of userStatsMap.entries()) rows.push({
		userName,
		totalPredictions: stats.total,
		correctCount: stats.correct,
		points: stats.points,
		accuracyPct: stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0
	});
	return rows.sort((a, b) => b.points - a.points || b.accuracyPct - a.accuracyPct);
}
function MatchPredictionPoll({ fixture, compact = false }) {
	const queryClient = useQueryClient();
	const visitorId = getVisitorId();
	const [userNameInput, setUserNameInput] = (0, import_react.useState)(getStoredHandle());
	const [showNameModal, setShowNameModal] = (0, import_react.useState)(false);
	const [pendingChoice, setPendingChoice] = (0, import_react.useState)(null);
	const predictionsQuery = useQuery({
		queryKey: ["predictions", fixture.id],
		queryFn: () => fetchPredictionsForFixture(fixture.id),
		refetchInterval: 1e4
	});
	const voteMutation = useMutation({
		mutationFn: async ({ choice, handle }) => {
			return submitPredictionVote(fixture.id, choice, handle);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["predictions", fixture.id] });
			queryClient.invalidateQueries({ queryKey: ["all-predictions"] });
			toast.success(`Prediction submitted for ${variables.choice.toUpperCase()}!`);
		}
	});
	const votes = predictionsQuery.data ?? [];
	const stats = computePredictionStats(votes);
	const userVote = votes.find((v) => v.visitor_id === visitorId);
	function handleVoteClick(choice) {
		if (fixture.status === "completed") {
			toast.error("Match is completed. Voting is closed!");
			return;
		}
		const currentHandle = getStoredHandle();
		if (!currentHandle) {
			setPendingChoice(choice);
			setShowNameModal(true);
			return;
		}
		voteMutation.mutate({
			choice,
			handle: currentHandle
		});
	}
	function handleNameSubmit(e) {
		e.preventDefault();
		if (!userNameInput.trim()) {
			toast.error("Please enter a predictor handle or name.");
			return;
		}
		setStoredHandle(userNameInput.trim());
		setShowNameModal(false);
		if (pendingChoice) {
			voteMutation.mutate({
				choice: pendingChoice,
				handle: userNameInput.trim()
			});
			setPendingChoice(null);
		}
	}
	const homeName = fixture.home?.short_name || fixture.home?.name || "HOME";
	const awayName = fixture.away?.short_name || fixture.away?.name || "AWAY";
	if (compact) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5 w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-2.5 w-full overflow-hidden rounded-full border border-border/60 bg-secondary shadow-inner",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: { width: `${stats.homePct}%` },
					className: "bg-primary flex items-center justify-center text-[9px] font-extrabold text-primary-foreground transition-all duration-300",
					title: `${homeName} Win: ${stats.homePct}%`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: { width: `${stats.drawPct}%` },
					className: "bg-zinc-600 flex items-center justify-center text-[9px] font-extrabold text-white transition-all duration-300",
					title: `Draw: ${stats.drawPct}%`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: { width: `${stats.awayPct}%` },
					className: "bg-emerald-500 flex items-center justify-center text-[9px] font-extrabold text-white transition-all duration-300",
					title: `${awayName} Win: ${stats.awayPct}%`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-[10px] font-bold text-muted-foreground gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleVoteClick("home"),
					className: `hover:text-primary transition-colors flex items-center gap-1 min-w-0 truncate ${userVote?.prediction === "home" ? "text-primary font-black" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0",
							children: "🔴"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "truncate",
							children: [
								homeName,
								" (",
								stats.homePct,
								"%)"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleVoteClick("draw"),
					className: `hover:text-foreground transition-colors flex items-center gap-1 shrink-0 ${userVote?.prediction === "draw" ? "text-foreground font-black" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚪" }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"DRAW (",
							stats.drawPct,
							"%)"
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleVoteClick("away"),
					className: `hover:text-emerald-400 transition-colors flex items-center gap-1 min-w-0 truncate justify-end ${userVote?.prediction === "away" ? "text-emerald-400 font-black" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0",
							children: "🟢"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "truncate",
							children: [
								awayName,
								" (",
								stats.awayPct,
								"%)"
							]
						})
					]
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel p-5 space-y-4 border-border/80 bg-card/60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border/40 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vote, { className: "size-4 text-primary animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold uppercase tracking-wider text-foreground",
						children: "Fan Match Prediction Poll"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
					children: [
						stats.totalVotes,
						" Vote",
						stats.totalVotes !== 1 ? "s" : "",
						" Cast"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-4 w-full overflow-hidden rounded-full border border-border/80 bg-secondary shadow-inner",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { width: `${stats.homePct}%` },
							className: "bg-primary flex items-center justify-center text-[10px] font-black text-primary-foreground transition-all duration-500",
							children: stats.homePct >= 10 && `${stats.homePct}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { width: `${stats.drawPct}%` },
							className: "bg-zinc-600 flex items-center justify-center text-[10px] font-black text-zinc-100 transition-all duration-500",
							children: stats.drawPct >= 10 && `${stats.drawPct}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { width: `${stats.awayPct}%` },
							className: "bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white transition-all duration-500",
							children: stats.awayPct >= 10 && `${stats.awayPct}%`
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-[11px] font-semibold text-muted-foreground px-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-primary font-bold",
							children: [
								homeName,
								" ",
								stats.homePct,
								"%"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-zinc-400",
							children: [
								"Draw ",
								stats.drawPct,
								"%"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-emerald-400 font-bold",
							children: [
								awayName,
								" ",
								stats.awayPct,
								"%"
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: userVote?.prediction === "home" ? "default" : "outline",
						onClick: () => handleVoteClick("home"),
						disabled: fixture.status === "completed" || voteMutation.isPending,
						className: `h-9 font-bold text-xs uppercase tracking-wider border-primary/40 ${userVote?.prediction === "home" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-primary/10 hover:text-primary"}`,
						children: [
							userVote?.prediction === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 mr-1" }),
							"🔴 ",
							homeName,
							" Win"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: userVote?.prediction === "draw" ? "secondary" : "outline",
						onClick: () => handleVoteClick("draw"),
						disabled: fixture.status === "completed" || voteMutation.isPending,
						className: `h-9 font-bold text-xs uppercase tracking-wider border-zinc-700 ${userVote?.prediction === "draw" ? "bg-zinc-700 text-white shadow-md" : "hover:bg-zinc-800 hover:text-white"}`,
						children: [userVote?.prediction === "draw" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 mr-1" }), "⚪ Draw"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: userVote?.prediction === "away" ? "default" : "outline",
						onClick: () => handleVoteClick("away"),
						disabled: fixture.status === "completed" || voteMutation.isPending,
						className: `h-9 font-bold text-xs uppercase tracking-wider border-emerald-500/40 ${userVote?.prediction === "away" ? "bg-emerald-600 text-white shadow-md" : "hover:bg-emerald-500/10 hover:text-emerald-400 text-emerald-400"}`,
						children: [
							userVote?.prediction === "away" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 mr-1" }),
							"🟢 ",
							awayName,
							" Win"
						]
					})
				]
			}),
			showNameModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg uppercase",
								children: "Enter Predictor Handle"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Enter your name or gamer handle to save your predictions and compete on the Prediction Leaderboard!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleNameSubmit,
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: userNameInput,
								onChange: (e) => setUserNameInput(e.target.value),
								placeholder: "e.g. Alex_eFootball",
								className: "w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-semibold",
								autoFocus: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => setShowNameModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									className: "font-bold",
									children: "Submit Vote"
								})]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { setStoredHandle as a, getStoredHandle as i, computePredictionLeaderboard as n, fetchAllPredictions as r, MatchPredictionPoll as t };
