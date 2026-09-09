import { validateUpload, safeStoragePath, safeUploadName } from "./upload-policy";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/core/env";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
  getStorageSettings,
  type StorageSettings,
} from "@/modules/siteSettings";
import {getCloudinaryConfig,uploadLocal} from './cloudinary.load-storage-settings-safe';
import {type Driver,type Cfg,type UploadResult,envDriver,type UpOpts} from './cloudinary.shared';
export async function uploadBufferAuto(cfg: Cfg, buffer: Buffer, opts: UpOpts): Promise<UploadResult> {
  validateUpload(buffer, opts.mime ?? "");
  const driver: Driver = cfg.driver ?? envDriver();

  if (driver === "local") {
    console.debug?.("[storage] uploadBufferAuto LOCAL", {
      folder: opts.folder ?? cfg.defaultFolder,
      publicId: opts.publicId,
      bytes: buffer.length,
    });
    return uploadLocal(cfg, buffer, opts);
  }

  const folder = opts.folder ?? cfg.defaultFolder;

  console.debug?.("[storage] uploadBufferAuto CLOUDINARY start", {
    cloud: cfg.cloudName,
    folder,
    publicId: opts.publicId,
    mime: opts.mime,
    bytes: buffer.length,
  });

  const rawResult = await new Promise<unknown>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: opts.publicId,
        resource_type: "auto",
        overwrite: true,
      },
      (err, res) => {
        if (err || !res) return reject(err ?? new Error("upload_failed"));
        resolve(res);
      },
    );
    stream.end(buffer);
  });

  const r = rawResult as {
    public_id?: string;
    secure_url?: string;
    bytes?: number;
    width?: number;
    height?: number;
    format?: string;
    resource_type?: string;
    version?: number;
    etag?: string;
  };

  if (!r.public_id || !r.secure_url) {
    console.error("[storage] uploadBufferAuto CLOUDINARY invalid_response", {
      cloud: cfg.cloudName,
      folder,
      publicId: opts.publicId,
    });
    throw new Error("cloudinary_invalid_response");
  }

  console.debug?.("[storage] uploadBufferAuto CLOUDINARY ok", {
    cloud: cfg.cloudName,
    public_id: r.public_id,
    bytes: r.bytes,
    format: r.format,
    resource_type: r.resource_type,
  });

  return {
    public_id: r.public_id,
    secure_url: r.secure_url,
    bytes: typeof r.bytes === "number" ? r.bytes : buffer.length,
    width: typeof r.width === "number" ? r.width : null,
    height: typeof r.height === "number" ? r.height : null,
    format: r.format ?? null,
    resource_type: r.resource_type ?? null,
    version: typeof r.version === "number" ? r.version : null,
    etag: r.etag ?? null,
  };
}
export async function destroyCloudinaryById(
  publicId: string,
  resourceType?: string,
  provider?: string, // "local" | "cloudinary" | undefined
): Promise<void> {
  const cfg = await getCloudinaryConfig();

  const driverFromProvider: Driver | null =
    provider === "local" ? "local" : provider === "cloudinary" ? "cloudinary" : null;

  const driver: Driver = driverFromProvider ?? cfg?.driver ?? envDriver();

  if (driver === "local") {
    const root = env.LOCAL_STORAGE_ROOT || cfg?.localRoot || path.join(process.cwd(), "uploads");
    const rel = publicId.replace(/^\/+/, "");
    const abs = safeStoragePath(root, rel);
    try {
      await fs.unlink(abs);
    } catch {
      // dosya yoksa sessiz geç
    }
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType ?? "image",
    invalidate: true,
  });
}