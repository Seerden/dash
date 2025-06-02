import { BUCKET } from "@/lib/polygon/flatfiles/constants";
import fs from "fs/promises";
import path from "path";

/** Ensures that the folder at `/dash/flatfiles/<filepath>` exists. If it
 * doesn't, then it'll be created recursively.
 * @usage provide a filepath like `day_aggs_v1/2025/01/`. */
export async function ensureFlatFilesFolderExists(filepath: string) {
	const p = path.join("/dash", BUCKET, filepath);

	await fs.mkdir(p, {
		recursive: true,
	});

	const stat = await fs.stat(p);
	if (stat.isDirectory()) {
		return p;
	}
}
