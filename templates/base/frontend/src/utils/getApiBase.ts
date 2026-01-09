export function getApiBase(): string {
  const rawApiEnv: unknown = import.meta.env.VITE_API_URL;
  return typeof rawApiEnv === 'string' && rawApiEnv.trim().length > 0
    ? rawApiEnv.trim()
    : window.location.origin;
}
