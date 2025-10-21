import fastify from "fastify";
import cookie from "@fastify/cookie";
import { transactionsRoutes } from "./routes/transactions";
import { getRouteInfo } from "./middlewares/get-route-info";

export const app = fastify();

app.register(cookie);
app.addHook("preHandler", getRouteInfo);
app.register(transactionsRoutes, {
    prefix: "transactions",
});