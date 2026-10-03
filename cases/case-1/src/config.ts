export interface Config { origin: string; capacity: number; retryMs: number; retentionMs: number }
export function normalize(raw: Record<string, string>): Config {
  const parsedOrigin = new URL(raw.origin);
  if (!['http:', 'https:'].includes(parsedOrigin.protocol) || parsedOrigin.username || parsedOrigin.password || parsedOrigin.search || parsedOrigin.hash) throw new Error('invalid origin');
  const origin = parsedOrigin.origin;
  const number = (key: string, fallback: number) => {
    const value = raw[key] ?? String(fallback);
    if (!/^\d+$/.test(value)) throw new Error(`invalid ${key}`);
    const n = Number(value);
    if (!Number.isSafeInteger(n) || n <= 0) throw new Error(`invalid ${key}`);
    return n;
  };
  return { origin, capacity: number('capacity', 3), retryMs: number('retryMs', 100), retentionMs: number('retentionMs', 500) };
}
