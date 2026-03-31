// src/modules/carrier-kyc/controller.ts
import type { RouteHandler, FastifyRequest } from "fastify";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { MultipartFile } from "@fastify/multipart";
import { getAuthUserId, handleRouteError, sendNotFound, sendForbidden } from "@/modules/_shared";
import { uploadDocumentSchema } from "./validation";
import {
  repoGetDocumentsByCarrier,
  repoGetDocumentById,
  repoUpsertDocument,
  repoDeleteDocument,
  repoSyncKycStatus,
  repoGetKycStatus,
  repoUpdateUserKycFields,
} from "./repository";

const KYC_UPLOAD_DIR = path.resolve(process.cwd(), "uploads/kyc");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIMES = ["image/jpeg", "image/png", "application/pdf"];

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

/** GET /carrier-kyc/status */
export const getKycStatus: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const status = await repoGetKycStatus(userId);
    const docs = await repoGetDocumentsByCarrier(userId);
    return reply.send({
      ...status,
      documents: docs,
      document_count: docs.length,
      approved_count: docs.filter((d) => d.status === "approved").length,
    });
  } catch (e) {
    return handleRouteError(reply, req, e, "kyc_status");
  }
};

/** GET /carrier-kyc/documents */
export const getDocuments: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const docs = await repoGetDocumentsByCarrier(userId);
    return reply.send(docs);
  } catch (e) {
    return handleRouteError(reply, req, e, "kyc_documents");
  }
};

/** POST /carrier-kyc/upload */
export const uploadDocument: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);

    const data = await (req as FastifyRequest & { file: () => Promise<MultipartFile | undefined> }).file();
    if (!data) return reply.code(400).send({ error: { message: "no_file" } });

    const fields: Record<string, string> = {};
    for (const [key, val] of Object.entries(data.fields)) {
      const f = val as { value?: string };
      if (f?.value) fields[key] = f.value;
    }

    const parsed = uploadDocumentSchema.safeParse(fields);
    if (!parsed.success) return reply.code(400).send({ error: { message: "invalid_body", details: parsed.error.issues } });

    if (!ALLOWED_MIMES.includes(data.mimetype)) {
      return reply.code(400).send({ error: { message: "invalid_file_type", allowed: ALLOWED_MIMES } });
    }

    const buf = await data.toBuffer();
    if (buf.length > MAX_FILE_SIZE) {
      return reply.code(400).send({ error: { message: "file_too_large", max_bytes: MAX_FILE_SIZE } });
    }

    // Dosyayı kaydet
    const dir = path.join(KYC_UPLOAD_DIR, userId);
    await ensureDir(dir);
    const ext = path.extname(data.filename) || ".bin";
    const fileName = `${parsed.data.document_type}_${randomUUID()}${ext}`;
    const filePath = path.join(dir, fileName);
    await fs.writeFile(filePath, buf);

    // DB'ye kaydet
    const relativePath = `/uploads/kyc/${userId}/${fileName}`;
    const doc = await repoUpsertDocument(userId, parsed.data.document_type, {
      file_path: relativePath,
      original_name: data.filename,
      file_size: buf.length,
    });

    // KYC alanlarını güncelle
    if (parsed.data.tc_identity || parsed.data.tax_number || parsed.data.tax_office || parsed.data.legal_company_title) {
      await repoUpdateUserKycFields(userId, parsed.data);
    }

    await repoSyncKycStatus(userId);
    return reply.code(201).send(doc);
  } catch (e) {
    return handleRouteError(reply, req, e, "kyc_upload");
  }
};

/** DELETE /carrier-kyc/:id */
export const deleteDocument: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params as { id: string };

    const doc = await repoGetDocumentById(id);
    if (!doc) return sendNotFound(reply);
    if (doc.carrier_id !== userId) return sendForbidden(reply);
    if (doc.status !== "pending") {
      return reply.code(400).send({ error: { message: "only_pending_deletable" } });
    }

    // Dosyayı sil
    try {
      const absPath = path.resolve(process.cwd(), doc.file_path.replace(/^\//, ""));
      await fs.unlink(absPath);
    } catch { /* dosya yoksa sorun değil */ }

    await repoDeleteDocument(id);
    await repoSyncKycStatus(userId);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, "kyc_delete");
  }
};
