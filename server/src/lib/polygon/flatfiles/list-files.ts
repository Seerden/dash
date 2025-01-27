/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { FOLDERS } from "@/lib/polygon/flatfiles/constants";
import fs from "fs/promises";

/** Lists (recursively) all (compressed and uncompressed) csv files in
 * `[/dash]/flatfiles/<folder>`.
 * @returns a list of strings like `2024/09/2024-09-01.csv.gz`. */
export async function listFlatFiles(folder: `${FOLDERS}`) {
	const path = `/dash/flatfiles/${folder}`;
	const files = await fs.readdir(path, { recursive: true });
	return files.filter((file) => file.endsWith(".csv") || file.endsWith(".csv.gz"));
}
