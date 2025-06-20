import { queryClient } from "@/lib/query-client";
import { trpc } from "@/lib/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createLazyFileRoute("/")({
	component: Index
});

function Index() {
	// TODO: get rid of this stuff
	const { mutateAsync } = useMutation(trpc.auth.login.mutationOptions());
	const { mutateAsync: mutateLogout } = useMutation(trpc.auth.logout.mutationOptions());
	useEffect(() => {
		(async function () {
			// await mutateLogout();

			await mutateAsync(
				{
					username: "test",
					password: "123"
				},
				{
					onSuccess: () => {
						queryClient.invalidateQueries({
							queryKey: trpc.auth.me.queryKey()
						});
					}
				}
			);
		})();
	}, []);

	const { data: me } = useQuery(trpc.auth.me.queryOptions());
	// console.log({ data });
	console.log({ me });

	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
		</div>
	);
}
