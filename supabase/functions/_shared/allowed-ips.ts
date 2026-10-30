export const ALLOWED_IPS = ["45.230.209.12", "170.83.211.253"];

export function clientIp(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = req.headers.get("x-forwarded-for");
  return xff ? xff.split(",")[0].trim() : "";
}

export function isAllowedIp(req: Request): boolean {
  return ALLOWED_IPS.includes(clientIp(req));
}
