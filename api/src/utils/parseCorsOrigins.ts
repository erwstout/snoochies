export function parseCorsOrigins(corsOriginsEnv: string | undefined): string[] | false {
  const allowedOrigins = (corsOriginsEnv ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return allowedOrigins.length > 0 ? allowedOrigins : false;
}
