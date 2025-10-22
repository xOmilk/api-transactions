import { test, beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("Transactions routes", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	test("user can create a new transaction", async () => {
		await request(app.server)
			.post("/transactions")
			.send({
				title: "New Transaction",
				amount: 5000,
				type: "credit",
			})
			.expect(201);
	});

	it("should be able to list all transactions", async () => {
		//para listar uma transação é preciso criar uma primeiramente

		const createTransaction = await request(app.server)
			.post("/transactions")
			.send({
				title: "New Transaction",
				amount: 5000,
				type: "credit",
			});

		const cookies = createTransaction.get("Set-Cookie");

		if (!cookies) throw new Error("No cookies returned from transaction");

		const allTransactionsResponse = await request(app.server)
			.get("/transactions")
			.set("Cookie", cookies)
			.expect(200);

		expect(allTransactionsResponse.body.transactions).toEqual([
			expect.objectContaining({
				title: "New Transaction",
				amount: 5000,
			})
		])


	});
});
