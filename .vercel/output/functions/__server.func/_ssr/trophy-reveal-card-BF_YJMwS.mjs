import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Volume2, c as Trophy, i as VolumeX, n as X, v as Play, y as Pause } from "../_libs/lucide-react.mjs";
import { B as Button, V as cn } from "./router-BD6uxmJI.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trophy-reveal-card-BF_YJMwS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function TrophyRevealCard({ className, compact = false, autoPlay = true }) {
	const videoRef = (0, import_react.useRef)(null);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(autoPlay);
	const [isMuted, setIsMuted] = (0, import_react.useState)(true);
	const togglePlay = () => {
		if (!videoRef.current) return;
		if (isPlaying) {
			videoRef.current.pause();
			setIsPlaying(false);
		} else {
			videoRef.current.play();
			setIsPlaying(true);
		}
	};
	const toggleMute = () => {
		if (!videoRef.current) return;
		videoRef.current.muted = !isMuted;
		setIsMuted(!isMuted);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("panel relative overflow-hidden border-amber-500/30 bg-black/60 shadow-[var(--shadow-gold)] transition-all hover:border-amber-500/50", compact ? "p-4" : "p-6 sm:p-8", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -top-24 -right-24 size-80 rounded-full opacity-20 blur-3xl",
				style: { background: "var(--gradient-gold)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full opacity-15 blur-3xl",
				style: { background: "radial-gradient(circle, oklch(0.62 0.22 25) 0%, transparent 70%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("grid gap-6 items-center", compact ? "grid-cols-1" : "lg:grid-cols-[1fr_1.3fr]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 relative z-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-5 animate-pulse text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-caps font-semibold tracking-wider text-amber-400",
								children: "OFFICIAL TFF SEASON 7 TROPHY"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: cn("font-display uppercase tracking-wide", compact ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl"),
							children: "Season 7 Championship Trophy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground leading-relaxed",
							children: "Unveiling the official Triad Football Federation (TFF) Season 7 Championship Trophy. Forged for perfection, awarded exclusively to the champions of the Triad Champions League."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative group aspect-video rounded-xl overflow-hidden border border-amber-500/40 shadow-2xl bg-black cursor-pointer",
					onClick: togglePlay,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						src: "/trophy_reveal.mp4",
						className: "w-full h-full object-cover",
						autoPlay,
						loop: true,
						muted: isMuted,
						playsInline: true,
						onPlay: () => setIsPlaying(true),
						onPause: () => setIsPlaying(false)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4 pointer-events-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-auto flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "secondary",
								className: "size-8 rounded-full bg-black/70 backdrop-blur-md hover:bg-black/90 text-white border border-amber-500/30",
								onClick: (e) => {
									e.stopPropagation();
									togglePlay();
								},
								title: isPlaying ? "Pause" : "Play",
								children: isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "secondary",
								className: "size-8 rounded-full bg-black/70 backdrop-blur-md hover:bg-black/90 text-white border border-amber-500/30",
								onClick: (e) => {
									e.stopPropagation();
									toggleMute();
								},
								title: isMuted ? "Unmute" : "Mute",
								children: isMuted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4 text-amber-400" })
							})]
						})
					})]
				})]
			})
		]
	});
}
function TrophyRevealModalButton({ label = "Watch Season 7 Trophy Reveal" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "lg",
			className: "border-amber-500/50 hover:border-amber-400 text-amber-400 hover:bg-amber-500/10 font-semibold gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 text-amber-400" }), label]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-4xl border-amber-500/40 bg-black/95 p-6 text-white shadow-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2 text-2xl font-display text-amber-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-6 text-amber-400" }), " TFF Official Season 7 Trophy Unveiling"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative aspect-video rounded-xl overflow-hidden border border-amber-500/30 bg-black",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: "/trophy_reveal.mp4",
				className: "w-full h-full object-cover",
				autoPlay: true,
				controls: true,
				loop: true,
				playsInline: true
			})
		})]
	})] });
}
//#endregion
export { TrophyRevealModalButton as n, TrophyRevealCard as t };
