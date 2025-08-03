import { FastifyRequest } from "fastify";

export async function getRouteInfo(request: FastifyRequest) {
	console.log(`[${request.method}] ${request.url}`);
}
