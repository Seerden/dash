/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	BUCKET,
	ENDPOINT,
	FOLDERS,
	POLYGON_ACCESS_KEY_ID,
	POLYGON_FLAT_FILES_URL,
	POLYGON_SECRET_ACCESS_KEY,
	PREFIX,
} from "@/lib/polygon/flatfiles/constants";
import { ensureFlatFilesFolderExists } from "@/lib/polygon/flatfiles/ensure-folder";
import { spawn } from "child_process";
import fs from "fs/promises";
import _path from "path";
import type { YearMonthDayObject } from "types/data.types";
import { fileURLToPath } from "url";

/** Sets the AWS credentials so we can interact with the CLI.
 * @usage run this once on startup.
 */
export async function setAwsCredentials() {
	const commands = [
		["configure", "set", "aws_access_key_id", POLYGON_ACCESS_KEY_ID!],
		["configure", "set", "aws_secret_access_key", POLYGON_SECRET_ACCESS_KEY!],
	];

	const promises = commands.map(async (command) => {
		const child = spawn("aws", command, { shell: true });

		child.stdout.on("data", (chunk) => {
			// could do something here
			console.log({ chunk });
		});

		await new Promise((resolve) => {
			child.on("close", (code) => {
				if (code !== 0) {
					console.error(`child process exited with code ${code}`);
					resolve(null);
				} else {
					resolve(null);
				}
			});
		});
	});

	return Promise.all(promises);
}

type ListS3ObjectsArgs = {
	folder?: `${FOLDERS}`;
};

/** Lists all objects in the given folder of the flatfiles bucket. */
export async function listS3Objects({
	folder = FOLDERS.DAY_AGGS,
}: ListS3ObjectsArgs = {}) {
	return new Promise((resolve, reject) => {
		const awsProcess = spawn(
			"aws",
			[
				`s3 ls s3://${BUCKET}/${PREFIX}/${folder}/ --endpoint-url ${ENDPOINT} --recursive | awk '{print $4}'`,
			],
			{ shell: true },
		);

		const output: string[] = [];

		awsProcess.stdout.on("data", (data) => {
			const line: string = (data.toString() as string).trim();
			// for some reason, there are sometimes multiple filenames in the same
			// line even after trimming, hence the following if-else block.
			if (line.split("\n").length > 1) {
				output.push(...line.split("\n"));
			} else {
				output.push(line);
			}
		});

		awsProcess.stderr.on("data", (data) => {
			console.error(`stderr: ${data}`);
			reject(data.toString()); // Reject the promise on error
		});

		awsProcess.on("close", (code) => {
			if (code === 0) {
				resolve(output); // Resolve with the output
			} else {
				reject(`child process exited with code ${code}`);
			}
		});
	});
}

/** DEV function. Gets all the objects from the specified flatfiles s3 folder
 * and stores them in a .json file (in this directory). */
export async function storeS3Objects() {
	const filenames = await listS3Objects();
	await fs.writeFile(
		fileURLToPath(new URL("s3objects.json", import.meta.url)),
		JSON.stringify(
			{
				updatedAt: new Date().toISOString(),
				filenames,
			},
			null,
			0,
		),
	);
}

type GetFileArgs = {
	folder: `${FOLDERS}`;
} & YearMonthDayObject;

/** Downloads a single file from the flatfiles bucket and stores it in
 * `[dash/]/flatfiles/...` */
export async function getFile({ folder, year, month, day }: GetFileArgs) {
	// day_aggs_v1 or minute_aggs_v1 path
	const path = `${folder}/${year}/${month}/${year}-${month}-${day}.csv.gz`;

	await ensureFlatFilesFolderExists(`${folder}/${year}/${month}`);
	const outputPath = _path.join("/dash", "flatfiles", folder, `${year}`, `${month}`);

	return new Promise((resolve, reject) => {
		const awsProcess = spawn(
			"aws",
			[
				"s3",
				"cp",
				`s3://${BUCKET}/${PREFIX}/${path}`,
				outputPath,
				"--endpoint-url",
				"https://files.polygon.io",
			],
			{ shell: true },
		);

		// this will be an array of download state strings or something. We don't
		// need it, but keeping it here doesn't hurt in case we ever want to debug
		// it.
		const output: string[] = [""];

		awsProcess.stdout.on("data", (data) => {
			const string: string = data.toString();
			output.push(string);
		});

		awsProcess.stderr.on("data", (data) => {
			console.error(`stderr: ${data}`);
			reject(data.toString()); // Reject the promise on error
		});

		awsProcess.on("close", (code) => {
			if (code === 0) {
				resolve(output); // Resolve with the output
			} else {
				reject(`child process exited with code ${code}`);
			}
		});
	});
}

/** Downloads all the files in the specified folder on the flatfiles bucket for
 * the given year.
 * @note depending on the Polygon subscription, data for a given year may not be
 * available. The starter subscription allows going back 5 years from the
 * current date. */
export async function getFiles({
	folder,
	year,
	month,
}: {
	folder: `${FOLDERS}`;
	year: string;
	/** Get only a single month (expects e.g. `01`, not `1`) */
	month?: string;
}) {
	let path = `${folder}/${year}/`;

	if (month) {
		path = path.concat(`/${month}`);
	}
	await ensureFlatFilesFolderExists(path);
	const BUCKET_PATH = `${BUCKET}/${PREFIX}/${path}`;
	const OUTPUT_PATH = `/dash/flatfiles/${path}`;

	return new Promise((resolve, reject) => {
		const awsProcess = spawn(
			"aws",
			[
				"s3",
				"cp",
				"--recursive",
				`s3://${BUCKET_PATH}`,
				OUTPUT_PATH,
				"--endpoint-url",
				POLYGON_FLAT_FILES_URL!,
			],
			{ shell: true },
		);

		// see note with `getFile`, this is the same thing, just for more files.
		const output: string[] = [];

		awsProcess.stdout.on("data", (data) => {
			const string: string = data.toString();
			output.push(string);
		});

		awsProcess.stderr.on("data", (data) => {
			console.error(`stderr: ${data}`);
			reject(data.toString()); // Reject the promise on error
		});

		awsProcess.on("close", (code) => {
			if (code === 0) {
				resolve(output); // Resolve with the output
			} else {
				reject(`getFiles errored out with code ${code}`);
			}
		});
	});
}
