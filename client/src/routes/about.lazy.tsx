import { trpc } from "@/lib/trpc";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
	component: About
});

function About() {
	const { data } = trpc.hello.useQuery({ name: "test" });

	return <div className="p-2">Hello from About! {data?.message} </div>;
}
