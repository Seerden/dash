import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import SuperJSON from "superjson";

export default function useTRPCClient() {
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					transformer: SuperJSON,
					url: "http://localhost:5000/trpc", // TODO: use a baseUrl variable for this
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
		})
	);

	return trpcClient;
}
