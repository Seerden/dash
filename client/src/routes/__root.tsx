import { createRootRouteWithContext } from "@tanstack/react-router";
import App from "@/App";
import indexCss from "@/index.scss?url";
import { queryClient } from "@/lib/query-client";
import { trpc } from "@/lib/trpc";
import normalizeCss from "@/normalize.css?url";

type RouterContext = {
	queryClient: typeof queryClient;
	trpc: typeof trpc;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: App,
	head: (_ctx) => {
		return {
			meta: [{ title: "Home" }],
			links: [
				// NOTE: if we import the mantine css files here, some things won't
				// work properly, e.g. our overwrite of the cursor in the
				// MantineProvider will not be applied, I think because of the order
				// of things (that gets set first, then the css is imported here
				// which resets it, or something).
				{ rel: "stylesheet", href: indexCss },
				{ rel: "stylesheet", href: normalizeCss },
				// { rel: "manifest", href: "/site.webmanifest", color: "#171717" },
				// TODO (DAS-55) this is not a PWA yet. Removing these for now
				// {
				// 	rel: "icon",
				// 	href: "/public/favicon.ico?=TRK-351",
				// 	sizes: "48x48",
				// },
				// {
				// 	rel: "icon",
				// 	href: "/public/favicon.svg?=TRK-351",
				// 	type: "image/svg+xml",
				// },
				// {
				// 	rel: "apple-touch-icon",
				// 	href: "/public/apple-touch-icon-180x180.png?=TRK-351",
				// 	sizes: "180x180",
				// },
			],
		};
	},

	context: () => {
		return {
			queryClient,
			trpc,
		};
	},
});
