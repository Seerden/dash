import { queryClient } from "@/lib/query-client";
import { trpc } from "@/lib/trpc";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getQueryKey } from "@trpc/react-query";
import { useEffect } from "react";

export const Route = createLazyFileRoute("/")({
	component: Index
});

function Index() {
	// TODO: get rid of this stuff
	const { mutate } = trpc.auth.login.useMutation();
	useEffect(() => {
		mutate(
			{
				username: "admin",
				password: "test"
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: getQueryKey(trpc.auth.me) });
				}
			}
		);
	}, []);

	// const { data } = trpc.dbTest.useQuery();
	const { data: me } = trpc.auth.me.useQuery();
	// console.log({ data });
	console.log({ me });

	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
		</div>
	);
}
