import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { worker } from "./mocks/browser";
import "./normalize.css";

if (process.env.NODE_ENV === "development") {
	await worker.start({
		onUnhandledRequest: "bypass"
	});
}

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
