import { trpc } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
	component: About
});

function About() {
	const { data, status } = useQuery(trpc.hello.queryOptions({ name: "test" }));
	console.log({ data, status });

	return <div className="p-2">Hello from About! -- changed!!! {data?.message} </div>;
}
