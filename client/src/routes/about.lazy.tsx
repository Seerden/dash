import { trpc } from "@/lib/trpc";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
	component: About
});

function About() {
	const { data, status } = trpc.hello.useQuery({ name: "test" });
	console.log({ data, status });

	return <div className="p-2">Hello from About! -- changed!!! {data?.message} </div>;
}
