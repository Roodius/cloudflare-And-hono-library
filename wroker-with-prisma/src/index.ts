import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export interface Env {
  DATABASE_URL: string;
}

export default {
  async fetch(request, env, ctx) {
    const prisma = new PrismaClient({
      datasourceUrl: env.DATABASE_URL,
    }).$extends(withAccelerate());

    const users = await prisma.log.create({
		data:{
			level:'Info',
			message:`${request.method} ${request.url}`,
			meta:{
				headers:JSON.stringify(request.headers),
			}
		}
	});
    const result = JSON.stringify(users);
    return new Response(result);
  },
} satisfies ExportedHandler<Env>;