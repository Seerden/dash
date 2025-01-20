import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";

const DOMAIN = import.meta.env.DOMAIN ?? "localhost";
const HOST = import.meta.env.NODE_ENV === "production" ? DOMAIN : "localhost";

export default function useTRPCClient() {
	const url = `http://${HOST}:5000/api/trpc`;

	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					transformer: superjson,
					url,
					fetch(url, options) {
						return fetch(url, {
							...options,
							credentials: "include"
						});
					}
				})
			]
		})
	);

	return trpcClient;
}
