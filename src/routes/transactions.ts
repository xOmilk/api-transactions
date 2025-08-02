import { FastifyInstance } from "fastify";
import { knex } from "../database";
import z from "zod";
import { randomUUID } from "node:crypto";

export async function transactionsRoutes(app: FastifyInstance) {
	app.get("/", async () => {
		const transactions = await knex("transactions").select("*");

		return {
			transactions,
		};
	});

	app.get("/:id", async (request) => {
		const getTransactionsParamsSchema = z.object({
			id: z.uuid(),
		});

		const params = getTransactionsParamsSchema.parse(request.params);

		const transaction = await knex("transactions")
			.select()
			.where("id", params.id)
			.first();

		return { transaction };
	});

	app.get("/summary", async () => {
		const summary = await knex("transactions")
			.sum("amount", {
				as: "totalAmount",
			})
			.first();

		return { summary };
	});

	app.post("/", async (request, response) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(["credit", "debit"]),
		});

		//A função parse() do zod tem o objetivo de validar se o tipo de dado bate com o criado, lançando um erro caso nao seja
		const { amount, title, type } = createTransactionBodySchema.parse(
			request.body
		);

		const transaction = await knex("transactions").insert({
			id: randomUUID(),
			title,
			amount: type === "credit" ? amount : amount * -1,
		});

		return response.status(201).send();
	});
}
