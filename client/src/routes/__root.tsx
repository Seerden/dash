import App from "@/App";
import type { queryClient } from "@/lib/query-client";
import type { trpc } from "@/lib/trpc";
import { createRootRouteWithContext } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{trpc: typeof trpc, queryClient: typeof queryClient}>()({
	component: App
});
