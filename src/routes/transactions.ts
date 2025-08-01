import { FastifyInstance } from "fastify";
import { knex } from "../database";

export async function transactionsRoutes(app: FastifyInstance) {
	app.get("/hello", async () => {
		return await knex("transactions").select("*");
	});
}
