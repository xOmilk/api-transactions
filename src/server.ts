import fastify from "fastify";
import cookie from "@fastify/cookie";

import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";
import { getRouteInfo } from "./middlewares/get-route-info";

const app = fastify();

app.register(cookie);
app.addHook("preHandler", getRouteInfo);
app.register(transactionsRoutes, {
	prefix: "transactions",
});

app.listen({ port: env.PORT }).then(() =>
	console.log("Server Running at port:3333")
);
