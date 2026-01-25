import { queryClient } from "@/lib/query-client";
import { theme } from "@/lib/theme";
import { trpc } from "@/lib/trpc";
import useTRPCClient from "@/lib/use-trpc-client";
import { ThemeProvider } from "@emotion/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Link, Outlet } from "@tanstack/react-router";
import React from "react";

const TanStackRouterDevtools =
	import.meta.env.NODE_ENV === "production"
		? () => null
		: React.lazy(() =>
				import("@tanstack/react-router-devtools").then((res) => ({
					default: res.TanStackRouterDevtools
					// For Embedded Mode
					// default: res.TanStackRouterDevtoolsPanel
				}))
			);

const ReactQueryDevtools =
	import.meta.env.NODE_ENV === "production"
		? () => null
		: React.lazy(() =>
				import("@tanstack/react-query-devtools").then((res) => ({
					default: res.ReactQueryDevtools
				}))
			);

export default function App() {
	const trpcClient = useTRPCClient();

	return (
		<ThemeProvider theme={theme}>
			<trpc.Provider client={trpcClient} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
					<div className="p-2 flex gap-2">
						<Link to="/" className="[&.active]:font-bold">
							Home
						</Link>{" "}
						<Link to="/about" className="[&.active]:font-bold">
							About
						</Link>{" "}
						<Link to="/register" className="[&.active]:font-bold">
							Register
						</Link>{" "}
						<Link to="/price-action/daily-recap" className="[&.active]:font-bold">
							Daily Recap
						</Link>
					</div>
					<hr />
					<Outlet />
					<TanStackRouterDevtools />
					<ReactQueryDevtools initialIsOpen={false} position="bottom" />
				</QueryClientProvider>
			</trpc.Provider>
		</ThemeProvider>
	);
}
