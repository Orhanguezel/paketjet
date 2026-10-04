// Shopier urun olusturma yanitini, CDN'deki buyuk/kucuk gorseller hazir olmadan donebilir.
const ATTEMPTS = 16;
const RETRY_MS = 800;
const IMAGE_TIMEOUT_MS = 3_000;

export async function waitForShopierMedia(mediaUrl: string, fetcher: typeof fetch = fetch): Promise<boolean> {
  let large: URL;
  try {
    large = new URL(mediaUrl);
  } catch {
    return false;
  }
  if (large.protocol !== 'https:' || !['cdn.shopier.app', 'dmih5ui1qqea9.cloudfront.net'].includes(large.hostname)
    || !/^\/pictures_large\/[^/]+$/.test(large.pathname)) return false;

  const small = new URL(large);
  small.pathname = large.pathname.replace('/pictures_large/', '/pictures_small/');
  const ready = async (url: URL) => {
    try {
      const response = await fetcher(url, { method: 'HEAD', signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS) });
      return response.ok;
    } catch {
      return false;
    }
  };

  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const [largeReady, smallReady] = await Promise.all([ready(large), ready(small)]);
    if (largeReady && smallReady) return true;
    if (attempt < ATTEMPTS - 1) await new Promise((resolve) => setTimeout(resolve, RETRY_MS));
  }
  return false;
}
