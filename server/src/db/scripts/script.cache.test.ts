import scriptCache from "@/db/scripts/script.cache";

describe("script.cache", () => {
	describe("key", () => {
		it("should use the test database cache key when in test environment", () => {
			const key = scriptCache._key;
			expect(key).toMatch(/test/);
		});
	});

	describe("redis", () => {
		it("should return an array with filenames", async () => {
			const scripts = await scriptCache.listExecuted();
			expect(scripts).toBeInstanceOf(Array);
		});
	});

	describe("sync", () => {
		it("should find files", async () => {
			const files = await scriptCache.listFiles();
			expect(files).toBeInstanceOf(Array);
			expect(files.length).toBeGreaterThan(0);
		});

		it("should not have unexecuted scripts after synchronizing", async () => {
			await scriptCache.synchronize();
			expect(await scriptCache.isSynchronized()).toBe(true);
			expect(await scriptCache.listExecuted()).toEqual(await scriptCache.listFiles());
		});
	});
});
