import { apiDelete, apiGet } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { IdentityState } from "./identity.type";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export const getMyIdentity = () => apiGet<IdentityState>(API.identity.me, { cache: "no-store" });

export const deleteMyIdentityFront = () => apiDelete<IdentityState>(API.identity.front);

export async function uploadMyIdentityFront(image: Blob): Promise<IdentityState> {
  const body = new FormData();
  body.append("file", image, "kimlik-on-yuz.jpg");
  const res = await fetch(BASE_URL + API.identity.front, { method: "POST", body, credentials: "include" });
  if (!res.ok) throw new Error(res.status === 400 ? "invalid_identity_file" : "upload_failed");
  return res.json();
}

/** Gorsel cerezle korunur; <img src> yerine blob olarak alinip yerel URL'ye cevrilir. */
export async function fetchMyIdentityFrontUrl(): Promise<string> {
  const res = await fetch(BASE_URL + API.identity.front, { credentials: "include", cache: "no-store" });
  if (!res.ok) throw new Error("image_failed");
  return URL.createObjectURL(await res.blob());
}
