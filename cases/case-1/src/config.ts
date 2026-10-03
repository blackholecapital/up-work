export interface Config { origin: string; capacity: number; retryMs: number; retentionMs: number }
export function normalize(raw: Record<string, string>): Config {
  const origin = raw.origin;
  const number = (key: string, fallback: number) => {
    const n = parseInt(raw[key] ?? String(fallback), 10);
    if (!Number.isInteger(n) || n <= 0) throw new Error(`invalid ${key}`);
    return n;
  };
  return { origin, capacity: number('capacity', 3), retryMs: number('retryMs', 100), retentionMs: number('retentionMs', 500) };
}
