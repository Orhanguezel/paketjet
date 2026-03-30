import { pingIndexNow } from "@/lib/indexnow";

function isAuthorized(request: Request) {
  const secret = process.env.INDEXNOW_TRIGGER_SECRET;
  if (!secret) return true;
  return request.headers.get("x-indexnow-secret") === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  return Response.json({
    ok: true,
    hasKey: Boolean(process.env.INDEXNOW_KEY),
    keyLocation: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com"}/indexnow-key.txt`,
  });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as
    | { url?: string; urls?: string[] }
    | null;

  const urls = Array.from(
    new Set(
      [
        ...(body?.url ? [body.url] : []),
        ...((body?.urls ?? []).filter(Boolean)),
      ].filter(Boolean),
    ),
  );

  const result = await pingIndexNow(urls);
  const status = result.ok ? 200 : 400;
  return Response.json(result, { status });
}
