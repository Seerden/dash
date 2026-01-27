// import { ErrorBoundary } from "@sentry/react";
import {
	getRouterContext,
	Outlet,
	useMatch,
	useMatches,
} from "@tanstack/react-router";
import { cloneDeep } from "lodash";
import {
	AnimatePresence,
	motion,
	useIsPresent,
	type Variants,
} from "motion/react";
import { forwardRef, useContext, useEffect, useRef } from "react";

const pageMotionVariants: Variants = {
	initial: {
		clipPath: "circle(0% at 0% 0%)",
		filter: "blur(2px)",
		transition: {
			duration: 0.25,
			ease: "easeOut",
		},
	},
	animate: {
		clipPath: `circle(150% at 50% 0%)`,
		filter: "blur(0)",
		transition: {
			duration: 0.25,
			ease: "easeIn",
		},
	},
	exit: {
		clipPath: "circle(0% at 100% 100%)",
		filter: "blur(2px)",
		transition: {
			duration: 0.25,
			ease: "easeIn",
		},
	},
};

/**
 * @see https://stackoverflow.com/questions/74190609/exit-animations-with-animatepresence-framer-motion-and-createbrowserrouter-r
 * @see https://github.com/TanStack/router/discussions/823#discussioncomment-8535087
 */
const AnimatedOutlet = forwardRef<HTMLDivElement>((_, ref) => {
	const RouterContext = getRouterContext();
	const routerContext = useContext(RouterContext);
	const renderedContext = useRef(routerContext);
	const isPresent = useIsPresent();

	useEffect(() => {
		if (isPresent) {
			renderedContext.current = cloneDeep(routerContext);
		}
	}, [isPresent]);

	return (
		<motion.div
			className="AnimatedRoutes"
			ref={ref}
			variants={pageMotionVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{
				duration: 0.15,
				type: "tween",
				ease: "easeInOut",
			}}
		>
			{/* <ErrorBoundary fallback={<p>An error occurred</p>}> */}
			<RouterContext.Provider value={renderedContext.current}>
				<Outlet />
			</RouterContext.Provider>
			{/* </ErrorBoundary> */}
		</motion.div>
	);
});

/** @see https://github.com/TanStack/router/discussions/823 */
export default function AnimatedRoutes() {
	const matches = useMatches();
	const match = useMatch({ strict: false });
	const nextMatchIndex = matches.findIndex((d) => d.id === match.id) + 1;
	const nextMatch = matches[nextMatchIndex];

	return (
		<>
			{/* <PageWrapper> */}
			<AnimatePresence mode="wait">
				<AnimatedOutlet key={nextMatch.id} />
			</AnimatePresence>
			{/* </PageWrapper> */}
		</>
	);
}
