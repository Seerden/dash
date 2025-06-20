import Status from "@/components/price-action/flatfiles/Status";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/price-action/flatfiles/status")({
	loader: async ({ context: { trpc } }) => {},
	component: Status
});
