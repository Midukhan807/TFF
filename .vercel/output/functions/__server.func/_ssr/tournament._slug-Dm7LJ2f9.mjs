import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tournament._slug-Dm7LJ2f9.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-4xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel p-6 bg-red-950/60 border-red-500/50 text-red-200 space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold text-red-400",
				children: "Tournament Detail Error"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "text-xs font-mono whitespace-pre-wrap overflow-auto bg-black/60 p-4 rounded-xl border border-red-500/30",
				children: error instanceof Error ? error.stack || error.message : JSON.stringify(error, null, 2)
			})]
		})
	});
};
//#endregion
export { SplitErrorComponent as errorComponent };
