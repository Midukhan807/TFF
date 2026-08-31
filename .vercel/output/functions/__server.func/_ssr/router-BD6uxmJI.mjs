import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as supabase } from "./client-D-eR6n2z.mjs";
import { _ as useNavigate, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as useQuery, r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { C as LogOut, b as Menu, n as X } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-BpE9Czok.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BD6uxmJI.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var logo_default = "/assets/logo-BtoeHkZL.png";
function TffLogo({ className, showText = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: logo_default,
			alt: "TFF Logo",
			className: "size-10 object-contain"
		}), showText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display block text-lg tracking-wide",
				children: "TFF eFOOTBALL"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-caps block text-[0.6rem] text-muted-foreground",
				children: "Tournament Hub"
			})]
		})]
	});
}
function TeamLogo({ name, shortName, color, logoUrl, videoUrl, isHovered, autoPlay = false, size = "md", className }) {
	const sizes = {
		xs: "size-6 text-[0.55rem]",
		sm: "size-8 text-[0.65rem]",
		md: "size-11 text-xs",
		lg: "size-16 text-base",
		xl: "size-28 text-2xl"
	};
	const [selfHover, setSelfHover] = (0, import_react.useState)(false);
	const [isTouchDevice, setIsTouchDevice] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			const touchQuery = window.matchMedia("(hover: none)");
			setIsTouchDevice(touchQuery.matches);
			const handleQueryChange = (e) => {
				setIsTouchDevice(e.matches);
			};
			if (touchQuery.addEventListener) touchQuery.addEventListener("change", handleQueryChange);
			return () => {
				if (touchQuery.removeEventListener) touchQuery.removeEventListener("change", handleQueryChange);
			};
		}
	}, []);
	const shouldPlay = autoPlay || isTouchDevice || (isHovered ?? selfHover) || size === "xl";
	(0, import_react.useEffect)(() => {
		if (videoRef.current && videoUrl) {
			if (shouldPlay) {
				const playPromise = videoRef.current.play();
				if (playPromise !== void 0) playPromise.catch(() => {});
			} else videoRef.current.pause();
		}
	}, [shouldPlay, videoUrl]);
	const initials = (shortName ?? name).slice(0, 3).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative shrink-0 overflow-hidden rounded-xl", sizes[size], className),
		onMouseEnter: () => setSelfHover(true),
		onMouseLeave: () => setSelfHover(false),
		onTouchStart: () => setSelfHover(true),
		onTouchEnd: () => setSelfHover(false),
		children: [logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: logoUrl,
			alt: `${name} logo`,
			loading: "lazy",
			className: "size-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-label": `${name} logo`,
			className: "font-display grid size-full place-items-center border border-border/80 tracking-wider",
			style: {
				background: `linear-gradient(150deg, ${color ?? "#D4A017"}33, oklch(0.2 0.008 265))`,
				color: color ?? void 0
			},
			children: initials
		}), videoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			ref: videoRef,
			src: videoUrl,
			muted: true,
			loop: true,
			playsInline: true,
			autoPlay: shouldPlay,
			className: cn("absolute inset-0 size-full object-cover transition-opacity duration-300 pointer-events-none", shouldPlay ? "opacity-100 z-10" : "opacity-0 -z-10")
		})]
	});
}
function useSession() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
			setSession(next?.user ? {
				userId: next.user.id,
				email: next.user.email ?? null
			} : null);
			setLoading(false);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session?.user ? {
				userId: data.session.user.id,
				email: data.session.user.email ?? null
			} : null);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return {
		session,
		loading
	};
}
function useIsAdmin() {
	const { session, loading } = useSession();
	const query = useQuery({
		queryKey: ["is-admin", session?.userId],
		enabled: !!session,
		queryFn: async () => {
			const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.userId);
			return (data ?? []).length > 0;
		}
	});
	return {
		isAdmin: !!query.data,
		session,
		loading: loading || query.isLoading
	};
}
var NAV = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/tournaments",
		label: "Tournaments"
	},
	{
		to: "/teams",
		label: "Teams"
	},
	{
		to: "/h2h",
		label: "H2H Rivalry"
	},
	{
		to: "/predictions",
		label: "Predictions"
	},
	{
		to: "/rankings",
		label: "Rankings"
	},
	{
		to: "/champions",
		label: "Hall of Champions"
	},
	{
		to: "/about",
		label: "About TFF"
	}
];
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const { session } = useIsAdmin();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "glass sticky top-0 z-50 border-b border-border/70",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TffLogo, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "ml-4 hidden items-center gap-1 lg:flex",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						activeOptions: { exact: item.to === "/" },
						className: "label-caps rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
						activeProps: { className: "text-primary bg-primary/10" },
						children: item.label
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [session && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: async () => {
							await supabase.auth.signOut();
							navigate({
								to: "/",
								replace: true
							});
						},
						"aria-label": "Sign out",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "lg:hidden",
						onClick: () => setOpen((value) => !value),
						"aria-label": "Toggle navigation",
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("overflow-hidden border-t border-border/70 transition-[max-height] duration-300 lg:hidden", open ? "max-h-96" : "max-h-0"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-col gap-1 p-4",
				children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					onClick: () => setOpen(false),
					className: "label-caps rounded-md px-3 py-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground",
					activeProps: { className: "text-primary bg-primary/10" },
					activeOptions: { exact: item.to === "/" },
					children: item.label
				}, item.to))
			})
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-24 border-t border-border/70 bg-[var(--surface)]/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TffLogo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xs text-sm text-muted-foreground",
					children: "Triad Football Federation — a competitive eFootball tournament organization. Compete. Conquer. Create History."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps mb-3 text-primary",
					children: "Competitions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tournaments",
							className: "hover:text-foreground",
							children: "All Tournaments"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/champions",
							className: "hover:text-foreground",
							children: "Hall of Champions"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/rankings",
							className: "hover:text-foreground",
							children: "TFF Rankings"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-caps mb-3 text-primary",
					children: "Organization"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/teams",
						className: "hover:text-foreground",
						children: "Team Database"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/about",
						className: "hover:text-foreground",
						children: "About TFF"
					}) })]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border/70 px-4 py-5 text-center text-xs text-muted-foreground",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" TFF eFootball — Tournament Hub. Organized by TFF."
			]
		})]
	});
}
function PublicShell({ children }) {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var styles_default = "/assets/styles-BkIfoTp-.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-8xl text-primary",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-2xl",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Triad Football Federation (TFF) | Triad Champions League" },
			{
				name: "description",
				content: "Official website of the Triad Football Federation (TFF eFootball) & Triad Champions League (TCL). Follow competitive eFootball tournaments, live fixtures, standings, team power rankings & Hall of Champions."
			},
			{
				name: "keywords",
				content: "Triad Football Federation, Triad Champions League, TFF, TFF eFootball, Triad Football, eFootball tournaments, TCL, TCL Season 7, TFF rankings, eFootball league"
			},
			{
				name: "author",
				content: "Triad Football Federation"
			},
			{
				name: "robots",
				content: "index, follow"
			},
			{
				name: "google-site-verification",
				content: "googled6272ab66f432fba"
			},
			{
				property: "og:site_name",
				content: "Triad Football Federation"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:title",
				content: "Triad Football Federation (TFF) | Triad Champions League"
			},
			{
				property: "og:description",
				content: "Compete. Conquer. Create History. Official home of the Triad Football Federation (TFF) and Triad Champions League (TCL)."
			},
			{
				property: "og:url",
				content: "https://triadfootballfederation.vercel.app"
			},
			{
				property: "og:image",
				content: "https://triadfootballfederation.vercel.app/logo.png"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Triad Football Federation (TFF) | Triad Champions League"
			},
			{
				name: "twitter:description",
				content: "Official eFootball tournament hub for Triad Football Federation (TFF) and Triad Champions League (TCL)."
			},
			{
				name: "twitter:image",
				content: "https://triadfootballfederation.vercel.app/logo.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "canonical",
				href: "https://triadfootballfederation.vercel.app"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@graph": [{
					"@type": "WebSite",
					"@id": "https://triadfootballfederation.vercel.app/#website",
					"url": "https://triadfootballfederation.vercel.app",
					"name": "Triad Football Federation",
					"alternateName": [
						"TFF",
						"TFF eFootball",
						"Triad Champions League",
						"TCL"
					],
					"publisher": {
						"@type": "SportsOrganization",
						"name": "Triad Football Federation"
					}
				}, {
					"@type": "SportsOrganization",
					"@id": "https://triadfootballfederation.vercel.app/#organization",
					"name": "Triad Football Federation",
					"alternateName": [
						"TFF",
						"TFF eFootball",
						"Triad Champions League",
						"TCL"
					],
					"url": "https://triadfootballfederation.vercel.app",
					"logo": "https://triadfootballfederation.vercel.app/logo.png",
					"description": "Official website of the Triad Football Federation (TFF eFootball) and Triad Champions League (TCL). Follow eFootball competitions, live fixtures, standings, team power rankings, and Hall of Champions.",
					"sport": "eFootball"
				}]
			})
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
}
var $$splitComponentImporter$11 = () => import("./routes-Bdv8vQd4.mjs");
var Route$11 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Triad Football Federation (TFF) | Triad Champions League & eFootball Hub" },
		{
			name: "description",
			content: "Official home of the Triad Football Federation (TFF eFootball) & Triad Champions League (TCL). Follow live eFootball tournaments, fixtures, results, standings, team power rankings and Hall of Champions."
		},
		{
			name: "keywords",
			content: "Triad Football Federation, Triad Champions League, TFF, TFF eFootball, Triad Football, TCL, eFootball tournaments, TCL Season 7, TFF global rankings"
		},
		{
			property: "og:title",
			content: "Triad Football Federation (TFF) | Triad Champions League"
		},
		{
			property: "og:description",
			content: "Compete. Conquer. Create History. Official home of the Triad Football Federation (TFF) and Triad Champions League (TCL)."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./about-BV4G79bY.mjs");
var Route$10 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About Triad Football Federation (TFF) | Triad Champions League" },
		{
			name: "description",
			content: "Triad Football Federation (TFF), founded by Frieza x pablo and Dante Jr, is the official eFootball tournament organization running the Triad Champions League (TCL), structured leagues, cups, standings and global team rankings."
		},
		{
			name: "keywords",
			content: "Triad Football Federation, TFF, Triad Champions League, TCL, eFootball organization, Frieza x pablo, Dante Jr, TFF Founders, Triad Football, TFF eFootball"
		},
		{
			property: "og:title",
			content: "About Triad Football Federation (TFF)"
		},
		{
			property: "og:description",
			content: "Who we are, founded by Frieza x pablo and Dante Jr, how Triad Football Federation (TFF) competitions work, and how to participate in the Triad Champions League."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin-BYa2yoEm.mjs");
var Route$9 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin Panel | TFF eFootball" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./auth-DIDwWMsK.mjs");
var Route$8 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Organizer Login | TFF eFootball" }, {
		name: "description",
		content: "Sign in to manage TFF tournaments, teams, and matches."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./champions-aZ5rOatV.mjs");
var Route$7 = createFileRoute("/champions")({
	head: () => ({ meta: [
		{ title: "Hall of Champions | Triad Football Federation (TFF) & Triad Champions League" },
		{
			name: "description",
			content: "The Triad Football Federation (TFF) Hall of Champions — every official Triad Champions League (TCL) title winner, runner-up, top scorer and MVP player of the tournament."
		},
		{
			name: "keywords",
			content: "Triad Champions League winners, TFF champions, Triad Football Federation Hall of Champions, TCL champions list, eFootball champions"
		},
		{
			property: "og:title",
			content: "Hall of Champions | Triad Football Federation (TFF)"
		},
		{
			property: "og:description",
			content: "Every champion crowned in Triad Football Federation (TFF) and Triad Champions League (TCL) history."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./h2h-e4a-dNHU.mjs");
var h2hSearchSchema = objectType({
	team1: stringType().optional(),
	team2: stringType().optional()
});
var Route$6 = createFileRoute("/h2h")({
	validateSearch: (search) => h2hSearchSchema.parse(search),
	head: () => ({ meta: [
		{ title: "Head-to-Head (H2H) Rivalry & Predictor | TFF eFootball" },
		{
			name: "description",
			content: "Compare head-to-head records, win probabilities, past match histories, and form between any two eFootball teams in the Triad Football Federation (TFF)."
		},
		{
			property: "og:title",
			content: "Head-to-Head (H2H) Rivalry | TFF eFootball"
		},
		{
			property: "og:description",
			content: "Analyze direct team rivalries, historical scores, and win predictions for TFF teams."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./predictions-DDKbQ272.mjs");
var Route$5 = createFileRoute("/predictions")({
	head: () => ({ meta: [{ title: "Match Predictions & Community Arena | Triad Football Federation" }, {
		name: "description",
		content: "Vote on upcoming eFootball match predictions, view live fan voting percentages, and compete on the TFF Predictor Leaderboard."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./rankings-C4LbuBgE.mjs");
var Route$4 = createFileRoute("/rankings")({
	head: () => ({ meta: [
		{ title: "TFF Global Rankings | Triad Football Federation Team Power Ratings" },
		{
			name: "description",
			content: "Official Triad Football Federation (TFF) Global Rankings — all-time team power ratings built from every Triad Champions League (TCL) tournament result, title, win, and goal."
		},
		{
			name: "keywords",
			content: "TFF global rankings, Triad Football Federation rankings, Triad Champions League team ratings, TFF eFootball leaderboard"
		},
		{
			property: "og:title",
			content: "TFF Global Rankings | Triad Football Federation"
		},
		{
			property: "og:description",
			content: "All-time team power ratings across every Triad Football Federation (TFF) tournament."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./teams-DHDnBLWd.mjs");
var Route$3 = createFileRoute("/teams")({
	head: () => ({ meta: [
		{ title: "TFF Teams | TFF eFootball" },
		{
			name: "description",
			content: "The global TFF team database — every side competing in TFF eFootball tournaments, with managers, colours and full career records."
		},
		{
			property: "og:title",
			content: "TFF Teams | TFF eFootball"
		},
		{
			property: "og:description",
			content: "Every team in the TFF eFootball ecosystem and their tournament history."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./tournaments-bj14m7Nj.mjs");
var Route$2 = createFileRoute("/tournaments")({
	head: () => ({ meta: [
		{ title: "Triad Champions League (TCL) & Competitions | Triad Football Federation (TFF)" },
		{
			name: "description",
			content: "Browse every eFootball competition organized by the Triad Football Federation (TFF), including official Triad Champions League (TCL) seasons, live matches, standings, and completed tournament archives."
		},
		{
			name: "keywords",
			content: "Triad Champions League, TCL, Triad Football Federation, TFF tournaments, eFootball league, TCL Season 7, eFootball competitions"
		},
		{
			property: "og:title",
			content: "Triad Champions League (TCL) & Competitions | TFF"
		},
		{
			property: "og:description",
			content: "Live, upcoming and completed Triad Champions League (TCL) and TFF eFootball tournaments."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./team._teamId-B9haCkWy.mjs");
var Route$1 = createFileRoute("/team/$teamId")({
	head: () => ({ meta: [
		{ title: "Team Profile | TFF eFootball" },
		{
			name: "description",
			content: "TFF team profile — tournament participations, championships, match record, goals and full TFF history."
		},
		{
			property: "og:title",
			content: "Team Profile | TFF eFootball"
		},
		{
			property: "og:description",
			content: "Complete TFF record for this team: titles, results and tournament history."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var TABS = [
	"overview",
	"fixtures",
	"results",
	"standings",
	"teams",
	"knockout",
	"statistics",
	"awards"
];
var db = supabase;
var FORMAT_LABELS = {
	league: "League",
	single_round_robin: "Single Round Robin",
	double_round_robin: "Double Round Robin",
	group_stage: "Group Stage",
	knockout: "Knockout",
	league_knockout: "League + Knockout"
};
function formatDate(value) {
	if (!value) return "TBD";
	let dateObj = new Date(value);
	if (isNaN(dateObj.getTime())) dateObj = /* @__PURE__ */ new Date(`${value}T00:00:00`);
	if (isNaN(dateObj.getTime())) return "TBD";
	return dateObj.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	}).toUpperCase();
}
function formatTime(value) {
	if (!value) return "--:--";
	return value.slice(0, 5);
}
function titleFromSlug(slug) {
	return slug.split("-").map((part) => part.length <= 3 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
function parseResultPenalties(result) {
	if (!result) return {
		homePen: null,
		awayPen: null
	};
	if (typeof result.home_penalties === "number" && typeof result.away_penalties === "number") return {
		homePen: result.home_penalties,
		awayPen: result.away_penalties
	};
	if (result.notes) try {
		if (result.notes.startsWith("{") && result.notes.endsWith("}")) {
			const parsed = JSON.parse(result.notes);
			if (typeof parsed.home_penalties === "number" && typeof parsed.away_penalties === "number") return {
				homePen: Number(parsed.home_penalties),
				awayPen: Number(parsed.away_penalties)
			};
		}
		const match = result.notes.match(/PEN:\s*(\d+)\s*[-:]\s*(\d+)/i) || result.notes.match(/penalties:\s*(\d+)\s*[-:]\s*(\d+)/i);
		if (match) return {
			homePen: parseInt(match[1], 10),
			awayPen: parseInt(match[2], 10)
		};
	} catch {}
	return {
		homePen: null,
		awayPen: null
	};
}
function getMatchWinner(fixture) {
	const result = fixture.result;
	if (!result) return {
		winnerTeamId: null,
		isPenalties: false
	};
	const homeScore = Number(result.home_score) || 0;
	const awayScore = Number(result.away_score) || 0;
	if (homeScore > awayScore) return {
		winnerTeamId: fixture.home_team_id,
		isPenalties: false
	};
	if (awayScore > homeScore) return {
		winnerTeamId: fixture.away_team_id,
		isPenalties: false
	};
	const { homePen, awayPen } = parseResultPenalties(result);
	if (homePen !== null && awayPen !== null) {
		if (homePen > awayPen) return {
			winnerTeamId: fixture.home_team_id,
			isPenalties: true
		};
		if (awayPen > homePen) return {
			winnerTeamId: fixture.away_team_id,
			isPenalties: true
		};
	}
	return {
		winnerTeamId: null,
		isPenalties: false
	};
}
async function fetchTeams() {
	const { data, error } = await db.from("teams").select("*").eq("is_demo", false).order("name");
	if (error) throw error;
	return data ?? [];
}
function parseSeasonNumber(name) {
	if (!name) return null;
	const match = name.match(/season\s*[-_]?\s*(\d+)/i) || name.match(/\bs(\d+)\b/i);
	return match ? parseInt(match[1], 10) : null;
}
function sortTournaments(tournaments) {
	return [...tournaments].sort((a, b) => {
		const seasonA = parseSeasonNumber(a.name);
		const seasonB = parseSeasonNumber(b.name);
		if (seasonA !== null && seasonB !== null) {
			if (seasonA !== seasonB) return seasonB - seasonA;
		} else if (seasonA !== null) return -1;
		else if (seasonB !== null) return 1;
		const yearA = a.season_year ?? 0;
		const yearB = b.season_year ?? 0;
		if (yearA !== yearB) return yearB - yearA;
		const dateA = a.start_date || a.created_at || "";
		const dateB = b.start_date || b.created_at || "";
		if (dateA !== dateB) return dateB.localeCompare(dateA);
		return a.name.localeCompare(b.name);
	});
}
async function fetchTournaments() {
	const { data, error } = await db.from("tournaments").select("*, tournament_teams(count), fixtures(count)").eq("is_demo", false).order("start_date", { ascending: false });
	if (error) throw error;
	return sortTournaments(data ?? []);
}
async function fetchTournamentBySlug(slug) {
	const { data, error } = await db.from("tournaments").select("*").eq("is_demo", false).eq("slug", slug).maybeSingle();
	if (error) throw error;
	return data ?? null;
}
async function fetchTournamentTeams(tournamentId) {
	const { data, error } = await db.from("tournament_teams").select("team_id, group_id, teams(*)").eq("tournament_id", tournamentId);
	if (error) throw error;
	return (data ?? []).map((row) => row.teams).filter(Boolean).filter((team) => !team.is_demo);
}
var FIXTURE_SELECT = "*, home:home_team_id(*), away:away_team_id(*), result:results(*), tournament:tournament_id(id,name,slug,is_demo)";
function normalizeFixture(row) {
	const result = Array.isArray(row.result) ? row.result[0] ?? null : row.result ?? null;
	return {
		...row,
		result
	};
}
async function fetchFixtures(tournamentId) {
	const { data, error } = await db.from("fixtures").select(FIXTURE_SELECT).eq("tournament_id", tournamentId).order("matchday").order("scheduled_time");
	if (error) throw error;
	return (data ?? []).map(normalizeFixture);
}
async function fetchAllFixtures() {
	const { data, error } = await db.from("fixtures").select(FIXTURE_SELECT).order("scheduled_date", { ascending: false });
	if (error) throw error;
	return (data ?? []).map(normalizeFixture).filter((f) => !f.tournament?.is_demo);
}
async function fetchLatestResults(limit = 6) {
	const { data, error } = await db.from("fixtures").select(FIXTURE_SELECT).eq("status", "completed").order("scheduled_date", { ascending: false });
	if (error) throw error;
	return (data ?? []).map(normalizeFixture).filter((f) => !f.tournament?.is_demo).slice(0, limit);
}
async function fetchUpcomingFixtures(limit = 6) {
	const { data, error } = await db.from("fixtures").select(FIXTURE_SELECT).eq("status", "scheduled").order("scheduled_date", { ascending: true });
	if (error) throw error;
	return (data ?? []).map(normalizeFixture).filter((f) => !f.tournament?.is_demo).slice(0, limit);
}
function getManualStandings(tournamentId) {
	try {
		const raw = localStorage.getItem("tff_manual_standings");
		if (!raw) return [];
		const allMap = JSON.parse(raw);
		if (tournamentId) return allMap[tournamentId] || [];
		return Object.values(allMap).flat();
	} catch {
		return [];
	}
}
function saveManualStandings(tournamentId, rows) {
	try {
		const raw = localStorage.getItem("tff_manual_standings");
		const allMap = raw ? JSON.parse(raw) : {};
		allMap[tournamentId] = rows;
		localStorage.setItem("tff_manual_standings", JSON.stringify(allMap));
	} catch (e) {
		console.error("Failed to save manual standings to localStorage", e);
	}
}
function getTournamentAwards(tournamentId) {
	try {
		const raw = localStorage.getItem("tff_tournament_awards");
		if (!raw) return null;
		return JSON.parse(raw)[tournamentId] || null;
	} catch {
		return null;
	}
}
function saveTournamentAwards(tournamentId, award) {
	try {
		const raw = localStorage.getItem("tff_tournament_awards");
		const allMap = raw ? JSON.parse(raw) : {};
		allMap[tournamentId] = award;
		localStorage.setItem("tff_tournament_awards", JSON.stringify(allMap));
	} catch (e) {
		console.error("Failed to save tournament awards to localStorage", e);
	}
}
async function getFixtureCardsMap(tournamentId) {
	const cardsMap = /* @__PURE__ */ new Map();
	try {
		let query = db.from("fixtures").select("home_team_id, away_team_id, tournament_id, results(home_yellow_cards, away_yellow_cards, home_red_cards, away_red_cards)").eq("status", "completed");
		if (tournamentId) query = query.eq("tournament_id", tournamentId);
		const { data, error } = await query;
		if (error || !data) return cardsMap;
		for (const f of data) {
			const res = Array.isArray(f.results) ? f.results[0] : f.results;
			if (!res) continue;
			if (f.home_team_id) {
				const key = tournamentId ? f.home_team_id : `${f.tournament_id}_${f.home_team_id}`;
				const cur = cardsMap.get(key) || {
					yellow: 0,
					red: 0
				};
				cur.yellow += Number(res.home_yellow_cards) || 0;
				cur.red += Number(res.home_red_cards) || 0;
				cardsMap.set(key, cur);
			}
			if (f.away_team_id) {
				const key = tournamentId ? f.away_team_id : `${f.tournament_id}_${f.away_team_id}`;
				const cur = cardsMap.get(key) || {
					yellow: 0,
					red: 0
				};
				cur.yellow += Number(res.away_yellow_cards) || 0;
				cur.red += Number(res.away_red_cards) || 0;
				cardsMap.set(key, cur);
			}
		}
	} catch (e) {
		console.error("Error fetching fixture cards", e);
	}
	return cardsMap;
}
async function fetchStandings(tournamentId) {
	const manual = getManualStandings(tournamentId);
	let rows = [];
	if (manual.length > 0) rows = manual;
	else {
		const { data, error } = await db.from("standings").select("*").eq("tournament_id", tournamentId);
		if (error) throw error;
		rows = data ?? [];
	}
	try {
		const cardsMap = await getFixtureCardsMap(tournamentId);
		if (cardsMap.size > 0) return rows.map((row) => {
			const cards = cardsMap.get(row.team_id);
			if (!cards) return row;
			return {
				...row,
				yellow_cards: Math.max(Number(row.yellow_cards) || 0, cards.yellow),
				red_cards: Math.max(Number(row.red_cards) || 0, cards.red)
			};
		});
	} catch {}
	return rows;
}
async function fetchAllStandings() {
	const { data, error } = await db.from("standings").select("*, tournament:tournament_id(id,is_demo)");
	let dbRows = (data ?? []).filter((row) => !row.tournament?.is_demo);
	const manualAll = getManualStandings();
	let rows = [];
	if (manualAll.length > 0) {
		const manualTourneyIds = new Set(manualAll.map((m) => m.tournament_id));
		dbRows = dbRows.filter((r) => !manualTourneyIds.has(r.tournament_id));
		rows = [...dbRows, ...manualAll];
	} else rows = dbRows;
	try {
		const cardsMap = await getFixtureCardsMap();
		if (cardsMap.size > 0) return rows.map((row) => {
			const key = `${row.tournament_id}_${row.team_id}`;
			const cards = cardsMap.get(key) || cardsMap.get(row.team_id);
			if (!cards) return row;
			return {
				...row,
				yellow_cards: Math.max(Number(row.yellow_cards) || 0, cards.yellow),
				red_cards: Math.max(Number(row.red_cards) || 0, cards.red)
			};
		});
	} catch {}
	return rows;
}
async function fetchChampions() {
	const { data, error } = await db.from("champions").select("*, tournament:tournament_id(id,is_demo)");
	if (error) throw error;
	return (data ?? []).filter((c) => !c.tournament?.is_demo);
}
async function fetchPlayerStats(tournamentId) {
	const { data, error } = await db.from("player_statistics").select("*").eq("tournament_id", tournamentId).order("goals", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
async function fetchTeamFixtures(teamId) {
	const { data, error } = await db.from("fixtures").select(FIXTURE_SELECT).or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`).order("scheduled_date", { ascending: false });
	if (error) throw error;
	return (data ?? []).map(normalizeFixture).filter((f) => !f.tournament?.is_demo);
}
function sortStandings(rows, tiebreakers = []) {
	const order = tiebreakers.length ? tiebreakers : [
		"points",
		"goal_difference",
		"goals_for",
		"head_to_head"
	];
	return [...rows].sort((a, b) => {
		for (const key of order) {
			if (key === "points" && a.points !== b.points) return b.points - a.points;
			if (key === "goal_difference" && a.goal_difference !== b.goal_difference) return b.goal_difference - a.goal_difference;
			if (key === "goals_for" && a.goals_for !== b.goals_for) return b.goals_for - a.goals_for;
			if (key === "wins" && a.wins !== b.wins) return b.wins - a.wins;
		}
		return 0;
	});
}
function getTeamFoundedYear(team) {
	if (team?.founded_year) return Number(team.founded_year);
	if (typeof window !== "undefined" && team?.id) try {
		const stored = localStorage.getItem("tff_founded_years");
		if (stored) {
			const map = JSON.parse(stored);
			if (map[team.id]) return Number(map[team.id]);
		}
	} catch {}
	return team?.created_at ? new Date(team.created_at).getFullYear() : 2026;
}
function setTeamFoundedYear(teamId, year) {
	if (typeof window === "undefined" || !teamId) return;
	try {
		const stored = localStorage.getItem("tff_founded_years");
		const map = stored ? JSON.parse(stored) : {};
		map[teamId] = year;
		localStorage.setItem("tff_founded_years", JSON.stringify(map));
	} catch {}
}
function getTeamVideoLogo(team) {
	if (!team) return null;
	if (team.logo_video_url) return team.logo_video_url;
	if (typeof window !== "undefined" && team.id) try {
		const stored = localStorage.getItem("tff_team_video_logos");
		if (stored) {
			const map = JSON.parse(stored);
			if (map[team.id]) return map[team.id];
		}
	} catch {}
	if (team.name?.toLowerCase().includes("demonic") || team.short_name?.toUpperCase() === "DMN") return "/Video Project 16.mp4";
	return null;
}
function setTeamVideoLogo(teamId, videoUrl) {
	if (typeof window === "undefined" || !teamId) return;
	try {
		const stored = localStorage.getItem("tff_team_video_logos");
		const map = stored ? JSON.parse(stored) : {};
		if (videoUrl) map[teamId] = videoUrl;
		else delete map[teamId];
		localStorage.setItem("tff_team_video_logos", JSON.stringify(map));
	} catch {}
}
var DEFAULT_RANKING = {
	points_champion: 100,
	points_runner_up: 70,
	points_semi_final: 50,
	points_quarter_final: 30,
	points_participation: 10
};
async function fetchRankingConfig() {
	const { data } = await db.from("ranking_settings").select("*").eq("id", 1).maybeSingle();
	return data ?? DEFAULT_RANKING;
}
function buildCareers(teams, standings, champions, config, fixtures) {
	const map = /* @__PURE__ */ new Map();
	for (const team of teams) map.set(team.id, {
		team,
		tournaments: 0,
		played: 0,
		wins: 0,
		draws: 0,
		losses: 0,
		goalsFor: 0,
		goalsAgainst: 0,
		yellowCards: 0,
		redCards: 0,
		titles: 0,
		rankingPoints: 0
	});
	const teamTournaments = /* @__PURE__ */ new Map();
	for (const row of standings) {
		const entry = map.get(row.team_id);
		if (!entry) continue;
		if (!teamTournaments.has(row.team_id)) teamTournaments.set(row.team_id, /* @__PURE__ */ new Set());
		if (row.tournament_id) teamTournaments.get(row.team_id).add(row.tournament_id);
		entry.played += Number(row.played) || 0;
		entry.wins += Number(row.wins) || 0;
		entry.draws += Number(row.draws) || 0;
		entry.losses += Number(row.losses) || 0;
		entry.goalsFor += Number(row.goals_for) || 0;
		entry.goalsAgainst += Number(row.goals_against) || 0;
		entry.yellowCards += Number(row.yellow_cards) || 0;
		entry.redCards += Number(row.red_cards) || 0;
	}
	if (fixtures && fixtures.length > 0) {
		const teamKnockoutRounds = /* @__PURE__ */ new Map();
		for (const f of fixtures) {
			if (!f.home_team_id || !f.away_team_id) continue;
			const isKnockout = f.stage === "knockout" || !!f.round;
			if (f.tournament_id) {
				if (!teamTournaments.has(f.home_team_id)) teamTournaments.set(f.home_team_id, /* @__PURE__ */ new Set());
				if (!teamTournaments.has(f.away_team_id)) teamTournaments.set(f.away_team_id, /* @__PURE__ */ new Set());
				teamTournaments.get(f.home_team_id).add(f.tournament_id);
				teamTournaments.get(f.away_team_id).add(f.tournament_id);
			}
			if (isKnockout && f.round && f.tournament_id) {
				const roundName = f.round.trim();
				const homeKey = `${f.home_team_id}_${f.tournament_id}`;
				const awayKey = `${f.away_team_id}_${f.tournament_id}`;
				if (!teamKnockoutRounds.has(homeKey)) teamKnockoutRounds.set(homeKey, /* @__PURE__ */ new Set());
				if (!teamKnockoutRounds.has(awayKey)) teamKnockoutRounds.set(awayKey, /* @__PURE__ */ new Set());
				teamKnockoutRounds.get(homeKey).add(roundName);
				teamKnockoutRounds.get(awayKey).add(roundName);
			}
			if (isKnockout && f.status === "completed" && f.result) {
				const homeEntry = map.get(f.home_team_id);
				const awayEntry = map.get(f.away_team_id);
				const hs = Number(f.result.home_score) || 0;
				const as = Number(f.result.away_score) || 0;
				if (homeEntry) {
					homeEntry.played += 1;
					homeEntry.goalsFor += hs;
					homeEntry.goalsAgainst += as;
					if (hs > as) homeEntry.wins += 1;
					else if (hs < as) homeEntry.losses += 1;
					else homeEntry.draws += 1;
				}
				if (awayEntry) {
					awayEntry.played += 1;
					awayEntry.goalsFor += as;
					awayEntry.goalsAgainst += hs;
					if (as > hs) awayEntry.wins += 1;
					else if (as < hs) awayEntry.losses += 1;
					else awayEntry.draws += 1;
				}
			}
		}
		for (const [key, rounds] of teamKnockoutRounds.entries()) {
			const [teamId, tournamentId] = key.split("_");
			const entry = map.get(teamId);
			if (!entry) continue;
			const champRow = champions.find((c) => c.tournament_id === tournamentId);
			const isWinner = champRow?.champion_team_id === teamId;
			const isRunnerUp = champRow?.runner_up_team_id === teamId;
			const isThird = champRow?.third_place_team_id === teamId;
			if (!isWinner && !isRunnerUp && !isThird) {
				if (rounds.has("Semi Final") || rounds.has("semi_final")) entry.rankingPoints += config.points_semi_final;
				else if (rounds.has("Quarter Final") || rounds.has("quarter_final")) entry.rankingPoints += config.points_quarter_final;
			}
		}
	}
	for (const [teamId, tourneySet] of teamTournaments.entries()) {
		const entry = map.get(teamId);
		if (entry) {
			entry.tournaments = tourneySet.size;
			entry.rankingPoints += tourneySet.size * config.points_participation;
		}
	}
	for (const champ of champions) {
		const winner = champ.champion_team_id ? map.get(champ.champion_team_id) : null;
		if (winner) {
			winner.titles += 1;
			winner.rankingPoints += config.points_champion;
		}
		const runner = champ.runner_up_team_id ? map.get(champ.runner_up_team_id) : null;
		if (runner) runner.rankingPoints += config.points_runner_up;
		const third = champ.third_place_team_id ? map.get(champ.third_place_team_id) : null;
		if (third) third.rankingPoints += config.points_semi_final;
	}
	return [...map.values()].sort((a, b) => b.rankingPoints - a.rankingPoints || b.titles - a.titles || b.wins - a.wins || b.goalsFor - a.goalsFor);
}
function calculateTournamentMVP(playerStats, championTeamId) {
	if (!playerStats || playerStats.length === 0) return null;
	const rankedPlayers = [...playerStats].map((p) => {
		let rawScore = (p.motm || 0) * 10 + (p.goals || 0) * 3 + (p.assists || 0) * 2 - (p.yellow_cards || 0) * 1 - (p.red_cards || 0) * 3;
		if (championTeamId && p.team_id && p.team_id === championTeamId) rawScore = rawScore * 1.2;
		return {
			player: p,
			score: Math.round(rawScore * 10) / 10
		};
	});
	rankedPlayers.sort((a, b) => b.score - a.score || (b.player.goals || 0) - (a.player.goals || 0) || (b.player.motm || 0) - (a.player.motm || 0));
	return rankedPlayers[0] ?? null;
}
var $$splitComponentImporter = () => import("./tournament._slug-CYtf6j3D.mjs");
var $$splitErrorComponentImporter = () => import("./tournament._slug-Dm7LJ2f9.mjs");
var Route = createFileRoute("/tournament/$slug")({
	validateSearch: (search) => ({ tab: typeof search["tab"] === "string" && TABS.includes(search["tab"]) ? search["tab"] : "overview" }),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	head: ({ params }) => {
		const title = titleFromSlug(params.slug).replace(/^Tff/, "TFF");
		return { meta: [
			{ title: `${title} | TFF eFootball` },
			{
				name: "description",
				content: `Follow the ${title} — fixtures, results, standings, teams and the eventual champion.`
			},
			{
				property: "og:title",
				content: `${title} | TFF eFootball`
			},
			{
				property: "og:description",
				content: `Fixtures, results, standings and champions for the ${title}.`
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$11.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$12
	}),
	AboutRoute: Route$10.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$12
	}),
	AdminRoute: Route$9.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$12
	}),
	AuthRoute: Route$8.update({
		id: "/auth",
		path: "/auth",
		getParentRoute: () => Route$12
	}),
	ChampionsRoute: Route$7.update({
		id: "/champions",
		path: "/champions",
		getParentRoute: () => Route$12
	}),
	H2hRoute: Route$6.update({
		id: "/h2h",
		path: "/h2h",
		getParentRoute: () => Route$12
	}),
	PredictionsRoute: Route$5.update({
		id: "/predictions",
		path: "/predictions",
		getParentRoute: () => Route$12
	}),
	RankingsRoute: Route$4.update({
		id: "/rankings",
		path: "/rankings",
		getParentRoute: () => Route$12
	}),
	TeamsRoute: Route$3.update({
		id: "/teams",
		path: "/teams",
		getParentRoute: () => Route$12
	}),
	TournamentsRoute: Route$2.update({
		id: "/tournaments",
		path: "/tournaments",
		getParentRoute: () => Route$12
	}),
	TeamTeamIdRoute: Route$1.update({
		id: "/team/$teamId",
		path: "/team/$teamId",
		getParentRoute: () => Route$12
	}),
	TournamentSlugRoute: Route.update({
		id: "/tournament/$slug",
		path: "/tournament/$slug",
		getParentRoute: () => Route$12
	})
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { saveTournamentAwards as A, Button as B, getManualStandings as C, getTournamentAwards as D, getTeamVideoLogo as E, Route$1 as F, Route$6 as I, useIsAdmin as L, setTeamVideoLogo as M, sortStandings as N, parseResultPenalties as O, TABS as P, TeamLogo as R, formatTime as S, getTeamFoundedYear as T, cn as V, fetchTournamentBySlug as _, buildCareers as a, fetchUpcomingFixtures as b, fetchAllStandings as c, fetchLatestResults as d, fetchPlayerStats as f, fetchTeams as g, fetchTeamFixtures as h, FORMAT_LABELS as i, setTeamFoundedYear as j, saveManualStandings as k, fetchChampions as l, fetchStandings as m, Route as n, calculateTournamentMVP as o, fetchRankingConfig as p, DEFAULT_RANKING as r, fetchAllFixtures as s, router_exports as t, fetchFixtures as u, fetchTournamentTeams as v, getMatchWinner as w, formatDate as x, fetchTournaments as y, TffLogo as z };
