import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { createHash, timingSafeEqual } from "node:crypto";
import { isAllowedIp } from "../_shared/allowed-ips.ts";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_ORIGINS = ["https://kpis-cncshop.cncshop.com.br", "https://kpiscncshop.lovable.app"];

function cors(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, x-ingest-key",
    Vary: "Origin",
  };
  if (ALLOWED_ORIGINS.includes(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(req), "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

const str = z.string().max(300).nullish();
const iso = z.string().datetime({ offset: true });
const isoOpt = iso.nullish();
const num = z.number().finite().nullish();
const int = z.number().int().nullish();

const Ordem = z.object({
  id_externo: z.union([z.string().min(1).max(300), z.number()]).transform(String),
  numero_ordem: int,
  sigla_tipo_servico: str,
  nome_cliente: str,
  etapa_atual_nome: str,
  status: str,
  data_entrada: isoOpt,
  data_prevista_entrega: isoOpt,
  data_fim: isoOpt,
  atrasada: z.boolean().nullish(),
  urgente: z.boolean().nullish(),
  nome_tipo_servico: str,
  nome_categoria_equipamento: str,
  fabricante: str,
  equipamento: str,
  modelo: str,
  prioridade: str,
});

const Tecnico = z.object({
  nome_tecnico: z.string().min(1).max(300),
  ordens_finalizadas: int,
  etapas_participadas: int,
  tempo_trabalhado_horas: num,
  tempo_medio_ordem_horas: num,
  em_andamento: int,
});

const Body = z.object({
  coletado_em: iso,
  periodo_inicio: iso,
  periodo_fim: iso,
  empresas: z.array(z.object({
    empresa: z.enum(["Matriz", "Filial", "Eletronica"]),
    ordens: z.array(Ordem).max(5000),
    tecnicos: z.array(Tecnico).max(5000),
  })).min(1).max(3),
});

const digest = (v: string) => createHash("sha256").update(v, "utf8").digest();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
  if (req.method !== "POST") return json(req, { error: "method_not_allowed" }, 405);

  if (!isAllowedIp(req)) return json(req, { error: "forbidden" }, 403);

  const secret = Deno.env.get("LIZY_INGEST_KEY");
  if (!secret) return json(req, { error: "server_error" }, 500);
  const provided = req.headers.get("x-ingest-key") ?? "";
  if (!provided || !timingSafeEqual(digest(provided), digest(secret))) {
    return json(req, { error: "unauthorized" }, 401);
  }

  const len = Number(req.headers.get("content-length") ?? "0");
  if (len > MAX_BYTES) return json(req, { error: "payload_too_large" }, 413);
  let raw: ArrayBuffer;
  try { raw = await req.arrayBuffer(); } catch { return json(req, { error: "bad_request" }, 400); }
  if (raw.byteLength > MAX_BYTES) return json(req, { error: "payload_too_large" }, 413);

  let parsedJson: unknown;
  try { parsedJson = JSON.parse(new TextDecoder().decode(raw)); } catch {
    return json(req, { error: "invalid_json" }, 400);
  }
  const parsed = Body.safeParse(parsedJson);
  if (!parsed.success) {
    return json(req, { error: "invalid_body", issues: parsed.error.issues.slice(0, 20).map((i) => ({ path: i.path.join("."), message: i.message })) }, 400);
  }
  const body = parsed.data;

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const results: { empresa: string; ordens: number; tecnicos: number; ok: boolean }[] = [];

  for (const e of body.empresas) {
    const { data, error } = await db.rpc("lizy_replace_snapshot", {
      p_empresa: e.empresa,
      p_ordens: e.ordens,
      p_tecnicos: e.tecnicos,
      p_periodo_inicio: body.periodo_inicio,
      p_periodo_fim: body.periodo_fim,
      p_coletado_em: body.coletado_em,
    });
    if (error) {
      console.error(`lizy ${e.empresa}:`, error.message);
      await db.from("lizy_sync").upsert({
        empresa: e.empresa,
        ultimo_erro: String(error.message).slice(0, 500),
        ultimo_erro_em: new Date().toISOString(),
      });
      results.push({ empresa: e.empresa, ordens: 0, tecnicos: 0, ok: false });
    } else {
      const d = (data ?? {}) as { ordens?: number; tecnicos?: number };
      results.push({ empresa: e.empresa, ordens: d.ordens ?? 0, tecnicos: d.tecnicos ?? 0, ok: true });
    }
  }

  return json(req, { ok: true, empresas: results });
});
