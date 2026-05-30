import type { FastifyReply, FastifyRequest } from "fastify";

import { handleRouteError } from "@/modules/_shared";
import { repoGetByFolderName } from "./repository";
import { buildPublicUrl, stripLeadingSlashes } from "./util";

const normalizeAssetSegment = (raw: string) =>
  stripLeadingSlashes(raw).replace(/\/{2,}/g, "/").trim();

function getRequestOrigin(req: FastifyRequest) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const forwardedHost = String(req.headers["x-forwarded-host"] || "").split(",")[0].trim();
  const host = forwardedHost || String(req.headers.host || "").trim();
  const proto = forwardedProto || (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return host ? `${proto}://${host}` : "";
}

function buildAssetUrl(req: FastifyRequest, row: {
  bucket: string;
  path: string;
  url?: string | null;
  provider?: string | null;
}) {
  if (row.provider === "local" && row.url?.startsWith("/")) {
    const origin = getRequestOrigin(req);
    return origin ? `${origin}${row.url}` : row.url;
  }
  return buildPublicUrl(row.bucket, row.path, row.url, null);
}

/** GET /storage/assets/:folder/:name — isimle public asset çöz */
export async function publicAssetByName(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { folder, name } = req.params as { folder: string; name: string };
    const cleanFolder = normalizeAssetSegment(folder);
    const cleanName = decodeURIComponent(name || "").trim();
    if (!cleanFolder || !cleanName) {
      return reply.code(400).send({ message: "invalid_asset_key" });
    }

    const row =
      await repoGetByFolderName(cleanFolder, cleanName) ??
      await repoGetByFolderName(cleanFolder, `${cleanName}.png`);

    if (!row) return reply.code(404).send({ message: "not_found" });

    return reply.send({
      id: row.id,
      name: row.name,
      bucket: row.bucket,
      folder: row.folder,
      path: row.path,
      mime: row.mime,
      width: row.width ?? null,
      height: row.height ?? null,
      url: buildAssetUrl(req, row),
    });
  } catch (e) {
    return handleRouteError(reply, req, e, "public_asset_by_name");
  }
}
