import { ThemeProvider } from "@emotion/react";
import {
   createTheme,
   DEFAULT_THEME,
   MantineProvider,
   Tooltip,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { theme } from "@/lib/theme";
import { trpc } from "@/lib/trpc";
import { queryClient } from "./lib/query-client";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		defaultViewTransition: true,
		defaultPendingMinMs: 0,
		scrollRestoration: true,
		defaultPreload: "intent",
		// TODO (from TRK-254): this is temporary, but I do want to use some kind
		// of skeleton here. Maybe include a skeleton for the header, too.
		defaultPendingComponent: () => {
			return (
				<>
					<div
						style={{
							padding: "3rem",
							width: "100%",
						}}
					>
						TODO: skeleton goes here
					</div>
				</>
			);
		},
		Wrap: function WrapComponent({ children }) {
			// const { theme, themeValue } = usePreferredTheme();

			return (
				<QueryClientProvider client={queryClient}>
					<ReactQueryDevtools initialIsOpen={false} position="bottom" />
					<MantineProvider
						// defaultColorScheme={themeValue}
						// forceColorScheme={themeValue}
						theme={{
							...createTheme(DEFAULT_THEME),
							cursorType: "pointer",
							components: {
								...DEFAULT_THEME.components,
								Tooltip: Tooltip.extend({
									defaultProps: {
										events: {
											hover: true,
											focus: true,
											touch: true,
										},
									},
								}),
							},
						}}
					>
						{/* <Global styles={theme.global} /> */}
						<Notifications />
						<ThemeProvider theme={theme}>{children}</ThemeProvider>
					</MantineProvider>
				</QueryClientProvider>
			);
		},
		context: {
			queryClient,
			trpc,
		},
	});

	return router;
}

// register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
