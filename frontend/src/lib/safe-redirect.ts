export function safeReturnPath(value: string | null | undefined, fallback='/panel') {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\r\n]/.test(value)) return fallback;
  try { const url=new URL(value,'https://paketjet.com'); return url.origin==='https://paketjet.com'?url.pathname+url.search+url.hash:fallback; } catch { return fallback; }
}
