import { API } from "@/config/api-endpoints";
import { apiGet } from "@/lib/api-client";
import type { StorageAssetRef } from "./storage.type";

const assetCache = new Map<string, Promise<StorageAssetRef>>();

export function getStorageAssetByName(folder: string, name: string) {
  const key = `${folder}/${name}`;
  const cached = assetCache.get(key);
  if (cached) return cached;

  const request = apiGet<StorageAssetRef>(API.storage.assetByName(folder, name));
  assetCache.set(key, request);
  return request;
}
