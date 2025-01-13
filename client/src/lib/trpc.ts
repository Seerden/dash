import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "server/src/lib/trpc";
import SuperJSON from "superjson";
//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpc = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			transformer: SuperJSON,
			// TODO: use a baseUrl variable for this
			url: "http://localhost:5000/trpc",
			fetch(url, options) {
				return fetch(url, {
					...options,
					headers: {
						...options?.headers,
						"Content-Type": "application/json"
					},
					credentials: "include"
				});
			}
		})
	]
});
