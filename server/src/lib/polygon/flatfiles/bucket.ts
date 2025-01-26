/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BUCKET, ENDPOINT, FOLDERS, PREFIX } from "@/lib/polygon/flatfiles/constants";
import { ensureFlatFilesFolderExists } from "@/lib/polygon/flatfiles/ensure-folder";
import { spawn } from "child_process";
import fs from "fs/promises";
import _path from "path";
import { fileURLToPath } from "url";

const { POLYGON_SECRET_ACCESS_KEY, POLYGON_ACCESS_KEY_ID } = process.env;

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

export async function listS3Objects({
	folder = FOLDERS.DAY_AGGS,
}: {
	folder?: `${FOLDERS}`;
} = {}) {
	await setAwsCredentials();

	return new Promise((resolve, reject) => {
		// aws s3 ls s3://flatfiles/us_stocks_sip/minute_aggs_v1/ --endpoint-url https://files.polygon.io --recursive | awk '{print $4}'
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

export async function storeS3Objects() {
	const filenames = await listS3Objects();
	console.log({ filenames });
	// create a json file in this folder containing the filenames
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

export async function getFile({
	folder,
	year,
	month,
	day,
}: {
	folder: `${FOLDERS}`;
	year: string;
	month: string;
	day: string;
}) {
	await setAwsCredentials();

	// day_aggs_v1 path
	const path = `${folder}/${year}/${month}/${year}-${month}-${day}.csv.gz`;
	// const filename = "2025-01-02.csv.gz";

	console.log({ path });

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

		let output = "";

		awsProcess.stdout.on("data", (data) => {
			const string: string = data.toString();
			// const str = string.replace(/PRE /g, "").replace(/\s/g, "").split("/");
			output += string;
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

export async function getFiles({
	folder,
	year,
	month,
}: {
	folder: `${FOLDERS}`;
	year: string;
	month?: string;
}) {
	await setAwsCredentials();

	const path = `${folder}/${year}/`;

	console.log({ path });

	await ensureFlatFilesFolderExists(`${folder}/${year}/`);
	const outputPath = _path.join("/dash", "flatfiles", folder, `${year}`);

	return new Promise((resolve, reject) => {
		const awsProcess = spawn(
			"aws",
			[
				"s3",
				"cp",
				"--recursive",
				`s3://${BUCKET}/${PREFIX}/${path}`,
				outputPath,
				"--endpoint-url",
				"https://files.polygon.io",
			],
			{ shell: true },
		);

		let output = "";

		awsProcess.stdout.on("data", (data) => {
			const string: string = data.toString();
			// const str = string.replace(/PRE /g, "").replace(/\s/g, "").split("/");
			output += string;
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
