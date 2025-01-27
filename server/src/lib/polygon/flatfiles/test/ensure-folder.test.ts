import { BUCKET } from "@/lib/polygon/flatfiles/constants";
import { ensureFlatFilesFolderExists } from "@/lib/polygon/flatfiles/ensure-folder";
import fs from "fs/promises";
import path from "path";

describe("ensureFlatFilesFolderExists", () => {
	it("should create a folder", async () => {
		// using 1901, because there can never be actual data for that year.
		const folder = "day_aggs_v1/1901/01/";
		const p = path.join("/dash", BUCKET, folder);

		const dir = await ensureFlatFilesFolderExists(folder);
		expect(dir).toBe(p);
		expect((await fs.stat(p)).isDirectory()).toBe(true);

		// clean up
		await fs.rmdir(p, { recursive: true });
		await expect(fs.stat(p)).rejects.toThrowError();
	});
});
