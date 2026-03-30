const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export async function pingIndexNow(urls: string[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";
  const key = process.env.INDEXNOW_KEY;
  const host = new URL(siteUrl).host;

  if (!key || urls.length === 0) {
    return { ok: false, reason: "missing_key_or_urls" } as const;
  }

  const keyLocation = `${siteUrl}/indexnow-key.txt`;
  const payload = {
    host,
    key,
    keyLocation,
    urlList: urls,
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    return {
      ok: response.ok,
      status: response.status,
      keyLocation,
    } as const;
  } catch {
    return { ok: false, reason: "request_failed", keyLocation } as const;
  }
}
