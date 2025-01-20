import { queryClient } from "@/lib/query-client";
import { trpc } from "@/lib/trpc";
import { router } from "@/main";
import { verifyMeSearchSchema } from "@/routes/verify-me";
import { getRouteApi } from "@tanstack/react-router";
import { getQueryKey } from "@trpc/react-query";
import { useEffect } from "react";

export default function VerifyMe() {
	const { useSearch } = getRouteApi("/verify-me");
	const search = useSearch();

	const { mutate } = trpc.auth.verifyMe.useMutation({});

	useEffect(() => {
		if (verifyMeSearchSchema.safeParse(search).success) {
			mutate(search, {
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: getQueryKey(trpc.auth.me) });
					router.navigate({ to: "/" });
				}
			});
		}
	}, [search]);

	return <div></div>;
}
