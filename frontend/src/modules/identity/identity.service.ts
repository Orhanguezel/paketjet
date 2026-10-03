import { apiDelete, apiGet } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { IdentitySide, IdentityState } from "./identity.type";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export const getMyIdentity = () => apiGet<IdentityState>(API.identity.me, { cache: "no-store" });

export const deleteMyIdentitySide = (side: IdentitySide) => apiDelete<IdentityState>(API.identity[side]);

export async function uploadMyIdentitySide(side: IdentitySide, image: Blob): Promise<IdentityState> {
  const body = new FormData();
  body.append("file", image, `kimlik-${side}.jpg`);
  const res = await fetch(BASE_URL + API.identity[side], { method: "POST", body, credentials: "include" });
  if (!res.ok) throw new Error(res.status === 400 ? "invalid_identity_file" : "upload_failed");
  return res.json();
}

/** Gorsel cerezle korunur; <img src> yerine blob olarak alinip yerel URL'ye cevrilir. */
export async function fetchMyIdentitySideUrl(side: IdentitySide): Promise<string> {
  const res = await fetch(BASE_URL + API.identity[side], { credentials: "include", cache: "no-store" });
  if (!res.ok) throw new Error("image_failed");
  return URL.createObjectURL(await res.blob());
}
