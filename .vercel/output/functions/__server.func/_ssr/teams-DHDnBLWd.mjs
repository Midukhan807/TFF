import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as buildCareers, c as fetchAllStandings, g as fetchTeams, l as fetchChampions, p as fetchRankingConfig, r as DEFAULT_RANKING, s as fetchAllFixtures } from "./router-BD6uxmJI.mjs";
import { c as TeamCard, i as SectionHeading, t as EmptyState } from "./ui-CA5ZAn3t.mjs";
import { t as Input } from "./input-NvmijQlt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teams-DHDnBLWd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeamsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
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
	const fixtures = useQuery({
		queryKey: ["all-fixtures"],
		queryFn: fetchAllFixtures
	});
	const ranking = useQuery({
		queryKey: ["ranking-config"],
		queryFn: fetchRankingConfig
	}).data ?? DEFAULT_RANKING;
	const careers = buildCareers(teams.data ?? [], standings.data ?? [], champions.data ?? [], ranking, fixtures.data ?? []);
	const careerMap = new Map(careers.map((c) => [c.team.id, c]));
	const filtered = (teams.data ?? []).filter((team) => team.name.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-14 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Database",
			title: "TFF Teams",
			subtitle: "Teams are reusable across every TFF tournament, and keep their complete historical record.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: search,
				onChange: (event) => setSearch(event.target.value),
				placeholder: "Search teams...",
				className: "max-w-xs"
			})
		}), filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: filtered.map((team) => {
				const stats = careerMap.get(team.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamCard, {
					team,
					played: stats?.played,
					titles: stats?.titles
				}, team.id);
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No teams have been registered",
			description: "TFF organizers can add teams from the admin panel."
		})]
	});
}
//#endregion
export { TeamsPage as component };
