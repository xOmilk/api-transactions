import fastify from "fastify";
import crypto from "crypto";
import { knex } from "./database";
import { env } from "./env";

const app = fastify();

app.get("/hello", async () => {
	return await knex("transactions").select("*");
});

app.listen({ port: env.PORT }).then(() =>
	console.log("Server Running at port:3333")
);
