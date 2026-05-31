// src/modules/storage/router.ts
import type { FastifyInstance } from "fastify";
import { publicAssetByName } from "./asset.controller";
import { publicServe, uploadToBucket, signPut, signMultipart } from "./controller";

export async function registerStorage(app: FastifyInstance) {
  const B = "/storage";

  // Public statik asset'ler (logo, ikonlar) — sayfa basina ~10 istek;
  // global API rate-limit'ine dahil edilmez.
  app.get(`${B}/assets/:folder/:name`, { config: { rateLimit: false } }, publicAssetByName);
  app.get(`${B}/:bucket/*`, { config: { rateLimit: false } }, publicServe);
  app.post(`${B}/:bucket/upload`, uploadToBucket);
  app.post(`${B}/uploads/sign-put`, signPut);
  app.post(`${B}/uploads/sign-multipart`, signMultipart);
}
