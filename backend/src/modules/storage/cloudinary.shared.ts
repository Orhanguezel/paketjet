import { validateUpload, safeStoragePath, safeUploadName } from "./upload-policy";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/core/env";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
  getStorageSettings,
  type StorageSettings,
} from "@/modules/siteSettings";
export type Driver = "local" | "cloudinary";
export type Cfg = {
  driver: Driver;
  cloudName: string;
  apiKey?: string;
  apiSecret?: string;
  defaultFolder?: string;
  unsignedUploadPreset?: string | null;
  localRoot?: string | null;
  localBaseUrl?: string | null;

  // ✅ site_settings üzerinden gelen public URL config'leri
  cdnPublicBase?: string | null;
  publicApiBase?: string | null;
};
export type UploadResult = {
  public_id: string;
  secure_url: string;
  bytes: number;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  resource_type?: string | null;
  version?: number | null;
  etag?: string | null;
};
export type RenameResult = {
  public_id: string;
  secure_url?: string;
  version?: number;
  format?: string;
};
export const configCache:{cfg:Cfg|null;at:number}={cfg:null,at:0};
export const CFG_CACHE_MS = 30_000;
export const envDriver = (): Driver =>
  (env.STORAGE_DRIVER || "").toLowerCase() === "local" ? "local" : "cloudinary";
export type UpOpts = { folder?: string; publicId?: string; mime?: string };
export type FsErrorLike = { code?: string };
