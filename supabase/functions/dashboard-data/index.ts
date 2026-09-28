import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const ALLOWED_IPS = ["45.230.209.12"];
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
  const res = await fetch(`${GATEWAY}/${id}/values:batchGet?${qs}&valueRenderOption=${render}`, {
    headers: {
      Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      "X-Connection-Api-Key": connectionKey,
    },
  });
  if (!res.ok) throw new Error(`Sheets [${res.status}]: ${await res.text()}`);
  const data = await res.json();
  return (data.valueRanges ?? []).map((v: { values?: string[][] }) => v.values ?? []);
}

const UNIDADES = ["MATRIZ", "ELETRONICA", "FILIAL"];
const CACHE_MS = 60_000;
let cache: { at: number; body: unknown } | null = null;

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  const s = String(v ?? "").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  return parseFloat(s) || 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const ip = clientIp(req);
  if (!ALLOWED_IPS.includes(ip)) return json({ error: "forbidden" }, 403);

  if (cache && Date.now() - cache.at < CACHE_MS) return json(cache.body);

  try {
    const [propRanges, fatRanges, infoRanges] = await Promise.all([
      batchGet(PROPOSTAS_ID, [
        ...UNIDADES.map((u) => `Proposta_${u}!A2:G`),
        ...UNIDADES.map((u) => `Pedido_${u}!A2:B`),
      ]),
      batchGet(FATURAMENTO_ID, ["'ANO 2026'!A2:C"], "UNFORMATTED_VALUE"),
      batchGet(FATURAMENTO_ID, ["INFORMACOES!A3:C"]),
    ]);
    const propostas = propRanges.slice(0, UNIDADES.length).flat();
    const pedidos = propRanges.slice(UNIDADES.length).flat();
    const ano = fatRanges[0] ?? [];
    const info = infoRanges[0] ?? [];

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
    const statusCounts = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const pedidosAbertos = pedidos.filter((r) =>
      String(r[1] ?? "").toUpperCase().trim() === "EM ABERTO"
    ).length;

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

    const body = {
      kpis: {
        abertas: commercialCounts["ABERTO"] ?? 0,
        pedidosAbertos,
        enviadas: commercialCounts["PROPOSTA ENVIADA PARA O CLIENTE"] ?? 0,
      },
      statusCounts,
      metaPctMin: Math.round((fat / META_MIN) * 1000) / 10,
      importacoes,
      pendencias,
    };
    cache = { at: Date.now(), body };
    return json(body);
  } catch (e) {
    console.error(e);
    return json({ error: "Falha ao carregar dados" }, 500);
  }
});
