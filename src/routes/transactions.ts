import { FastifyInstance } from "fastify";
import { knex } from "../database";
import z from "zod";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-sessionId-exists";

export async function transactionsRoutes(app: FastifyInstance) {
	app.get(
		"/",
		{
			preHandler: [checkSessionIdExists],
		},
		async (request, response) => {
			const { sessionId } = request.cookies;

			//Selecionar as transações apenas onde a sessionId é igual ao do usuario logado
			const transactions = await knex("transactions")
				.where({ session_id: sessionId })
				.select("*");

			return {
				transactions,
			};
		}
	);

	app.get(
		"/:id",
		{
			preHandler: [checkSessionIdExists],
		},
		async (request) => {
			const getTransactionsParamsSchema = z.object({
				id: z.uuid(),
			});
			const { sessionId } = request.cookies;
			const params = getTransactionsParamsSchema.parse(request.params);

			const transaction = await knex("transactions")
				.select()
				.where({
					session_id: sessionId,
					id: params.id,
				})
				.first();

			return { transaction };
		}
	);

	app.get(
		"/summary",
		{
			preHandler: [checkSessionIdExists],
		},
		async (request) => {
			const { sessionId } = request.cookies;

			const summary = await knex("transactions")
				.sum("amount", {
					as: "totalAmount",
				})
				.where({ session_id: sessionId })
				.first();

			return { summary };
		}
	);

	app.post("/", async (request, response) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(["credit", "debit"]),
		});

		//Defining cookies
		let sessionId = request.cookies.sessionId;
		if (!sessionId) {
			sessionId = randomUUID();

			response.cookie("sessionId", sessionId, {
				path: "/",
				maxAge: 60 * 60 * 24 * 7, //7 days
			});
		}

		//A função parse() do zod tem o objetivo de validar se o tipo de dado bate com o criado, lançando um erro caso nao seja
		const { amount, title, type } = createTransactionBodySchema.parse(
			request.body
		);

		await knex("transactions").insert({
			id: randomUUID(),
			title,
			amount: type === "credit" ? amount : amount * -1,
			session_id: sessionId,
		});

		return response.status(201).send();
	});
}
