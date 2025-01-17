import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import SuperJSON from "superjson";

// const HOST = process.env.NODE_ENV === "production" ? "server" : "localhost";
const HOST = "localhost";

export default function useTRPCClient() {
	const url = `http://${HOST}:5000/api/trpc`;
	console.log({ url });

	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					transformer: SuperJSON,
					url: `http://${HOST}:5000/api/trpc`, // TODO: use a baseUrl variable for this
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
