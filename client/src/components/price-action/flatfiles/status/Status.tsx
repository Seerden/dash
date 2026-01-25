import { useLoaderData } from "@tanstack/react-router";

export default function Status() {
	const status = useLoaderData({ from: "/price-action/flatfiles/status" });
	console.log({ status });

	return null;
}
