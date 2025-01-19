import verificationTokenStore from "@/lib/data/models/auth/store/verification-token.store";

describe("verificationTokenStore", () => {
	describe("insert", async () => {
		it("should insert a verification token", async () => {
			const user_id = "1";
			const mockToken = "fakeToken";

			await verificationTokenStore.set(user_id, mockToken);

			const token = await verificationTokenStore.get(user_id);

			// insert should have used the correct key (test, user_id)
			expect(await verificationTokenStore.__keys()).toContain(
				verificationTokenStore.__key(user_id),
			);

			// token should be the one we inserted
			expect(token).toEqual(mockToken);

			await verificationTokenStore.clear(user_id);
		});
	});

	describe("token query", () => {
		afterAll(async () => {
			await verificationTokenStore.clearAll();
		});

		it("should correctly return empty list", async () => {
			const tokens = await verificationTokenStore.getAll();
			expect(tokens).toBeInstanceOf(Map);
			expect(tokens.size).toEqual(0);
		});
		it("should return all tokens", async () => {
			const token1 = "fakeToken1";
			const token2 = "fakeToken2";

			await verificationTokenStore.set("1", token1);
			await verificationTokenStore.set("2", token2);

			const tokens = await verificationTokenStore.getAll();
			expect(tokens).toBeInstanceOf(Map);
			expect(tokens.size).toEqual(2);
			expect(tokens.get("1")).toEqual(token1);
			expect(tokens.get("2")).toEqual(token2);
			expect(tokens.get("3")).toBeUndefined();
		});
	});

	it("should delete by user", async () => {
		await verificationTokenStore.set("1", "fakeToken");
		expect(await verificationTokenStore.get("1")).toBeTruthy();
		await verificationTokenStore.clear("1");
		expect(await verificationTokenStore.get("1")).toBeFalsy();
	});

	it("should delete all tokens", async () => {
		await verificationTokenStore.set("1", "fakeToken");
		await verificationTokenStore.set("2", "fakeToken");
		expect(await verificationTokenStore.clearAll()).toEqual(2);
	});
});
