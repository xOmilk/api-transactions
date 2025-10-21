import { app } from "./app";
import { env } from "./env";

app.listen({ port: env.PORT }).then(() =>
	console.log("Server Running at port:3333")
);
