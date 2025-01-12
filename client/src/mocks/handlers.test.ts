describe("mock", () => {
	it("resolves test fetch", async () => {
		async () => {
			const response = await fetch("/test");
			const json = await response.json();

			expect(json).toEqual({ message: "Hello, world" });
		};
	});
});
