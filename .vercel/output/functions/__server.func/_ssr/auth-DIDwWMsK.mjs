import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-D-eR6n2z.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Mail, T as LoaderCircle, w as Lock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Button, L as useIsAdmin, z as TffLogo } from "./router-BD6uxmJI.mjs";
import { t as Input } from "./input-NvmijQlt.mjs";
import { t as useForm } from "../_libs/react-hook-form.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DIDwWMsK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const { session, isAdmin } = useIsAdmin();
	const { register, handleSubmit } = useForm({ defaultValues: {
		email: "",
		password: ""
	} });
	if (session && isAdmin) {
		navigate({
			to: "/admin",
			replace: true
		});
		return null;
	}
	async function onSubmit(values) {
		setLoading(true);
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: values.email,
				password: values.password
			});
			if (error) toast.error(error.message);
			else {
				toast.success("Successfully logged in!");
				navigate({
					to: "/admin",
					replace: true
				});
			}
		} catch (e) {
			toast.error(e.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md space-y-8 panel p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TffLogo, {
						showText: true,
						className: "mb-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 text-center text-3xl font-bold tracking-tight text-foreground",
						children: "Organizer Portal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-center text-sm text-muted-foreground",
						children: "Sign in to manage your eFootball tournaments"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 space-y-6",
				onSubmit: handleSubmit(onSubmit),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 rounded-md shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							...register("email", { required: true }),
							type: "email",
							autoComplete: "email",
							required: true,
							placeholder: "Email address",
							className: "pl-10"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							...register("password", { required: true }),
							type: "password",
							autoComplete: "current-password",
							required: true,
							placeholder: "Password",
							className: "pl-10"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: loading,
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Signing in..."] }) : "Sign In"
				}) })]
			})]
		})
	});
}
//#endregion
export { AuthPage as component };
