import { queryClient } from "@/lib/query-client";
import { trpc } from "@/lib/trpc";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createLazyFileRoute("/")({
	component: Index
});

function Index() {
	// TODO: get rid of this stuff
	const { mutateAsync } = trpc.auth.login.useMutation();
	const { mutateAsync: mutateLogout } = trpc.auth.logout.useMutation();
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
							queryKey: trpc.auth.me.queryOptions().queryKey
						});
					}
				}
			);
		})();
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
