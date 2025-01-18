import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import SuperJSON from "superjson";

const DOMAIN = import.meta.env.DOMAIN ?? "localhost";
const HOST = import.meta.env.NODE_ENV === "production" ? DOMAIN : "localhost";

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
