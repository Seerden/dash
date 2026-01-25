import { HeadContent, Link, Scripts } from "@tanstack/react-router";
import { Suspense } from "react";
import AnimatedRoutes from "@/components/AnimatedRoutes";

export default function App() {
	return (
		<>
			<HeadContent />
			<Scripts />
			<Suspense fallback={<>{/* TODO: skeleton goes here */}</>}>
				{/* TODO: this becomes the Header */}
				<div>
					<Link to="/">Home</Link> <Link to="/about">About</Link>{" "}
					<Link to="/register">Register</Link>{" "}
					<Link to="/price-action/daily-recap">Daily Recap</Link>
					<hr />
				</div>
				<main>
					<AnimatedRoutes />
				</main>
			</Suspense>
		</>
	);
}
