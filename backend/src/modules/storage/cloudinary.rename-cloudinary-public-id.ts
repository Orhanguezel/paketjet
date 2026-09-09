import { validateUpload, safeStoragePath, safeUploadName } from "./upload-policy";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/core/env";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
  getStorageSettings,
  type StorageSettings,
} from "@/modules/siteSettings";
import {getCloudinaryConfig} from './cloudinary.load-storage-settings-safe';
import {type Driver,type RenameResult,envDriver} from './cloudinary.shared';
export async function renameCloudinaryPublicId(
  oldPublicId: string,
  newPublicId: string,
  resourceType: string = "image",
  provider?: string,
): Promise<RenameResult> {
  const cfg = await getCloudinaryConfig();

  const driverFromProvider: Driver | null =
    provider === "local" ? "local" : provider === "cloudinary" ? "cloudinary" : null;

  const driver: Driver = driverFromProvider ?? cfg?.driver ?? envDriver();

  if (driver === "local") {
    const root = env.LOCAL_STORAGE_ROOT || cfg?.localRoot || path.join(process.cwd(), "uploads");
    const oldRel = oldPublicId.replace(/^\/+/, "");
    const newRel = newPublicId.replace(/^\/+/, "");
    const oldAbs = safeStoragePath(root, oldRel);
    const newAbs = safeStoragePath(root, newRel);

    await fs.mkdir(path.dirname(newAbs), { recursive: true });
    try {
      await fs.rename(oldAbs, newAbs);
    } catch {
      // yoksa sessiz geç
    }

    const baseUrlRaw = env.LOCAL_STORAGE_BASE_URL || cfg?.localBaseUrl || "/uploads";
    const baseUrl = baseUrlRaw.replace(/\/+$/, "");
    const rel = newRel.replace(/^\/+/, "");

    return {
      public_id: newRel,
      secure_url: `${baseUrl}/${rel}`,
    };
  }

  const raw = await cloudinary.uploader.rename(oldPublicId, newPublicId, {
    resource_type: resourceType,
    overwrite: true,
  });

  const r = raw as {
    public_id?: string;
    secure_url?: string;
    version?: number;
    format?: string;
  };

  return {
    public_id: r.public_id ?? newPublicId,
    secure_url: r.secure_url,
    version: r.version,
    format: r.format,
  };
}