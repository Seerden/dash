import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect } from "react";
import { queryClient } from "@/lib/query-client";
import { trpc } from "@/lib/trpc";
import { router } from "@/main";
import { verifyMeSearchSchema } from "@/routes/verify-me";

export default function VerifyMe() {
	const { useSearch } = getRouteApi("/verify-me");
	const search = useSearch();

	const { mutate } = useMutation(trpc.auth.verifyMe.mutationOptions());

	useEffect(() => {
		if (verifyMeSearchSchema.safeParse(search).success) {
			mutate(search, {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: trpc.auth.me.queryKey(),
					});
					router.navigate({ to: "/" });
				},
			});
		}
	}, [search]);

	return <div></div>;
}
