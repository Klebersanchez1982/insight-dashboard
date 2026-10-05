import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_IPS = ["45.230.209.12", "170.83.211.253"];
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets";
const PROPOSTAS_ID = "1jVafNaC-9xi_b2RDzSIIp73dohZQUGkkbNATf5Hwqbs";
const FATURAMENTO_ID = "1RB5PP1cxQcCjbGmbTYiAZcMxmMz9Ki2MQMJRbS4yA9I";
const META_MIN = 400000;
const META_MAX = 800000;
const USUARIAS_COMERCIAIS = new Set(["KAUANA.SILVA", "GIULIANA.FERREIRA", "JOSIANE.PAULA"]);
const MESES = ["JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function clientIp(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = req.headers.get("x-forwarded-for");
  return xff ? xff.split(",")[0].trim() : "";
}

async function batchGet(id: string, ranges: string[], render = "FORMATTED_VALUE"): Promise<string[][][]> {
  const connectionKey = Deno.env.get("GOOGLE_SHEETS_API_KEY");
  if (!connectionKey) throw new Error("Conexão com Google Planilhas não configurada");
  const qs = ranges.map((r) => `ranges=${encodeURIComponent(r)}`).join("&");
  const url = `${GATEWAY}/${id}/values:batchGet?${qs}&valueRenderOption=${render}`;
  let lastErr = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "X-Connection-Api-Key": connectionKey,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return (data.valueRanges ?? []).map((v: { values?: string[][] }) => v.values ?? []);
    }
    lastErr = `Sheets [${res.status}]: ${await res.text()}`;
    if (res.status !== 429 && res.status < 500) break;
    await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
  }
  throw new Error(lastErr);
}

const UNIDADES = ["MATRIZ", "ELETRONICA", "FILIAL"];
const CACHE_MS = 5 * 60_000;
let cache: { at: number; body: unknown } | null = null;

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

async function loadStored(): Promise<{ at: number; body: unknown } | null> {
  try {
    const { data } = await db.from("dashboard_cache").select("body, updated_at").eq("id", "main").maybeSingle();
    return data ? { at: new Date(data.updated_at).getTime(), body: data.body } : null;
  } catch (e) {
    console.error("cache read:", e);
    return null;
  }
}

async function saveStored(body: unknown) {
  try {
    await db.from("dashboard_cache").upsert({ id: "main", body, updated_at: new Date().toISOString() });
  } catch (e) {
    console.error("cache write:", e);
  }
}

function toNumber(v: unknown): number {
  const s = typeof v === "number" ? null : String(v ?? "").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  return s === null ? (v as number) : parseFloat(s) || 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const ip = clientIp(req);
  if (!ALLOWED_IPS.includes(ip)) return json({ forbidden: true }, 200);

  if (!cache) cache = await loadStored();
  if (cache && Date.now() - cache.at < CACHE_MS) return json(cache.body);


  try {
    const [propRes, fatRes] = await Promise.allSettled([
      batchGet(PROPOSTAS_ID, [
        ...UNIDADES.map((u) => `Proposta_${u}!A2:G`),
        ...UNIDADES.map((u) => `Pedido_${u}!A2:B`),
      ]),
      batchGet(FATURAMENTO_ID, ["'ANO 2026'!A2:C", "INFORMACOES!A3:C"]),
    ]);

    if (propRes.status === "rejected" && fatRes.status === "rejected") {
      throw propRes.reason;
    }
    if (propRes.status === "rejected") console.error("propostas:", propRes.reason);
    if (fatRes.status === "rejected") console.error("faturamento:", fatRes.reason);

    const propRanges = propRes.status === "fulfilled" ? propRes.value : [];
    const fatRanges = fatRes.status === "fulfilled" ? fatRes.value : [];

    const propostas = propRanges.slice(0, UNIDADES.length).flat();
    const pedidosPorUnidade = propRanges.slice(UNIDADES.length);

    const ano = fatRanges[0] ?? [];
    const info = fatRanges[1] ?? [];


    const counts: Record<string, number> = {};
    const commercialCounts: Record<string, number> = {};
    for (const r of propostas) {
      if (!r.some((c) => String(c ?? "").trim())) continue;
      const s = String(r[3] ?? "").toUpperCase().trim() || "SEM STATUS";
      counts[s] = (counts[s] || 0) + 1;
      const usuario = String(r[4] ?? "").toUpperCase().trim();
      if (USUARIAS_COMERCIAIS.has(usuario)) {
        commercialCounts[s] = (commercialCounts[s] || 0) + 1;
      }
    }
    const statusCounts = Object.entries(commercialCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const contarAbertos = (rows: string[][]) =>
      rows.filter((r) => String(r[1] ?? "").toUpperCase().trim() === "EM ABERTO").length;
    const pedidos = {
      matriz: contarAbertos(pedidosPorUnidade[0] ?? []),
      eletronica: contarAbertos(pedidosPorUnidade[1] ?? []),
      filial: contarAbertos(pedidosPorUnidade[2] ?? []),
    };


    const mesAtual = MESES[new Date(Date.now() - 3 * 3600 * 1000).getUTCMonth()];
    const row = ano.find((r) => String(r[0] ?? "").toUpperCase().trim() === mesAtual);
    const fat = row ? toNumber(row[1]) : 0;

    const importacoes: string[] = [];
    const pendencias: string[] = [];
    for (const r of info) {
      const a = String(r[0] ?? "").trim();
      const c = String(r[2] ?? "").trim();
      if (a) importacoes.push(a);
      if (c) pendencias.push(c);
    }

    const prev = (cache?.body ?? null) as Record<string, unknown> | null;
    const propOk = propRes.status === "fulfilled";
    const fatOk = fatRes.status === "fulfilled";

    const body = {
      kpis: propOk
        ? {
            abertas: commercialCounts["ABERTO"] ?? 0,
            pedidosMatriz: pedidos.matriz,
            pedidosEletronica: pedidos.eletronica,
            pedidosFilial: pedidos.filial,
          }
        : (prev?.kpis ?? { abertas: 0, pedidosMatriz: 0, pedidosEletronica: 0, pedidosFilial: 0 }),
      statusCounts: propOk ? statusCounts : (prev?.statusCounts ?? []),
      metaPctMin: fatOk ? Math.round((fat / META_MIN) * 1000) / 10 : (prev?.metaPctMin ?? 0),
      importacoes: fatOk ? importacoes : (prev?.importacoes ?? []),
      pendencias: fatOk ? pendencias : (prev?.pendencias ?? []),
      parcial: !propOk || !fatOk,
    };
    if (propOk && fatOk) { cache = { at: Date.now(), body }; await saveStored(body); }
    return json(body);
  } catch (e) {
    console.error(e);
    const stored = cache ?? (await loadStored());
    if (stored) return json({ ...(stored.body as Record<string, unknown>), parcial: true });
    return json({ kpis: { abertas: 0, pedidosMatriz: 0, pedidosEletronica: 0, pedidosFilial: 0 }, statusCounts: [], metaPctMin: 0, importacoes: [], pendencias: [], parcial: true });
  }
});
