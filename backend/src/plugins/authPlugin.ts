import fp from "fastify-plugin";
import { requireAuth } from "@/common/middleware/auth";
export default fp(async (app) => {
  app.addHook("onRequest", async (req,reply) => {
    if (req.method !== "OPTIONS" && (req.routeOptions.config as {auth?: boolean}).auth) await requireAuth(req,reply);
  });
});
