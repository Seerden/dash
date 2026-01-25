import Status from "@/components/price-action/flatfiles/status/Status";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/price-action/flatfiles/status")({
	loader: async ({ context: { trpc, queryClient } }) => {
		return await queryClient.ensureQueryData(trpc.priceAction.status.queryOptions());
	},
	component: Status
});
