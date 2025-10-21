import { test, beforeAll, afterAll, describe } from "vitest";
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
});
