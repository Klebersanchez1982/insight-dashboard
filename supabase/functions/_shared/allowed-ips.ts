// IPs da rede da empresa autorizados a ler o dashboard e a enviar dados da Lizy.
// Lista única para que leitura (dashboard-data) e envio (lizy-ingest-comercial) sigam a mesma regra.
export const ALLOWED_IPS = ["45.230.209.12", "170.83.211.253"];

export function clientIp(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = req.headers.get("x-forwarded-for");
  return xff ? xff.split(",")[0].trim() : "";
}

export const ipPermitido = (ip: string) => ALLOWED_IPS.includes(ip);
