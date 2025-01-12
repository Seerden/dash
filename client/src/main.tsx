import App from "@/App";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
