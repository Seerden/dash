import { RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "./normalize.css";
import { createRouter } from "@/router";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

if (import.meta.env.NODE_ENV === "development") {
	// do nothing
}

export const router = createRouter();

// biome-ignore lint/style/noNonNullAssertion: exists
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
		<TanStackRouterDevtools router={router} />
	</React.StrictMode>
);
