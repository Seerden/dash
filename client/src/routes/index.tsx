import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { queryClient } from "@/lib/query-client";
import { trpc } from "@/lib/trpc";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	// TODO: get rid of this stuff
	const { mutate } = useMutation(trpc.auth.login.mutationOptions());
	useEffect(() => {
		mutate(
			{
				username: "admin",
				password: "test",
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
				},
			}
		);
	}, []);

	// const { data } = trpc.dbTest.useQuery();
	const { data: me } = useQuery(trpc.auth.me.queryOptions());
	// console.log({ data });
	console.log({ me });

	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
		</div>
	);
}
