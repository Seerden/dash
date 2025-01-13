import { sqlConnection as sql } from "./init";

describe("test-database connection", () => {
	it("is test environment", () => {
		expect(process.env.IS_TEST_ENVIRONMENT).toBe("true");
	});

	it("initializes", async () => {
		const [result] = await sql`select array[1]`;
		expect(result.array).toEqual([1]);
	});
});
