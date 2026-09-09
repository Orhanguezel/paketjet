import { validateUpload, safeStoragePath, safeUploadName } from "./upload-policy";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/core/env";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
  getStorageSettings,
  type StorageSettings,
} from "@/modules/siteSettings";
import {type Driver,type Cfg,type UploadResult,configCache,CFG_CACHE_MS,envDriver,type UpOpts,type FsErrorLike} from './cloudinary.shared';
export async function loadStorageSettingsSafe(): Promise<StorageSettings | null> {
  try {
    return await getStorageSettings();
  } catch {
    return null;
  }
}
export async function getCloudinaryConfig(): Promise<Cfg | null> {
  const now = Date.now();
  if (configCache.cfg && now - configCache.at < CFG_CACHE_MS) return configCache.cfg;

  const settings = await loadStorageSettingsSafe();
  const driver: Driver = settings?.driver ?? envDriver();

  const cfg: Cfg = {
    driver,
    cloudName: settings?.cloudName || (driver === "local" ? "local" : ""),
    apiKey: settings?.apiKey || undefined,
    apiSecret: settings?.apiSecret || undefined,
    defaultFolder: settings?.folder || undefined,
    unsignedUploadPreset: settings?.unsignedUploadPreset ?? null,
    localRoot: settings?.localRoot ?? null,
    localBaseUrl: settings?.localBaseUrl ?? null,

    cdnPublicBase: settings?.cdnPublicBase ?? null,
    publicApiBase: settings?.publicApiBase ?? null,
  };

  if (driver === "cloudinary") {
    if (!cfg.cloudName || !cfg.apiKey || !cfg.apiSecret) return null;

    cloudinary.config({
      cloud_name: cfg.cloudName,
      api_key: cfg.apiKey,
      api_secret: cfg.apiSecret,
      secure: true,
    });
  }

  configCache.cfg = cfg;
  configCache.at = now;
  return cfg;
}
export function guessExt(mime?: string): string {
  if (!mime) return "";
  const m = mime.toLowerCase();
  if (m === "image/jpeg" || m === "image/jpg") return ".jpg";
  if (m === "image/png") return ".png";
  if (m === "image/webp") return ".webp";
  if (m === "image/gif") return ".gif";
  return "";
}
export async function uploadLocal(cfg: Cfg, buffer: Buffer, opts: UpOpts): Promise<UploadResult> {
  const fallbackRoot = path.join(process.cwd(), "uploads");

  let root = env.LOCAL_STORAGE_ROOT || cfg.localRoot || fallbackRoot;

  const folder = (opts.folder ?? cfg.defaultFolder ?? "").replace(/^\/+|\/+$/g, "");

  const baseName = safeUploadName(opts.publicId || `${Date.now()}-${Math.random().toString(36).slice(2)}`, opts.mime || '');
  const ext = path.extname(baseName);

  const relativePath = folder ? `${folder}/${baseName}` : baseName;

  let absDir = path.join(root, folder || ".");
  let absFile = safeStoragePath(root, relativePath);

  try {
    await fs.mkdir(absDir, { recursive: true });
  } catch (err: unknown) {
    const fsError = typeof err === "object" && err !== null ? (err as FsErrorLike) : {};
    if (fsError.code === "EACCES" || fsError.code === "EPERM") {
      root = fallbackRoot;
      absDir = path.join(root, folder || ".");
      absFile = safeStoragePath(root, relativePath);
      await fs.mkdir(absDir, { recursive: true });
    } else {
      throw err;
    }
  }

  await fs.writeFile(absFile, buffer);

  const baseUrlRaw = env.LOCAL_STORAGE_BASE_URL || cfg.localBaseUrl || "/uploads";
  const baseUrl = baseUrlRaw.replace(/\/+$/, "");
  const rel = relativePath.replace(/^\/+/, "");

  const url = `${baseUrl}/${rel}`;

  return {
    // ✅ IMPORTANT FIX: ext dahil
    public_id: rel,
    secure_url: url,
    bytes: buffer.length,
    width: null,
    height: null,
    format: ext ? ext.replace(".", "") : null,
    resource_type: "image",
    version: null,
    etag: null,
  };
}