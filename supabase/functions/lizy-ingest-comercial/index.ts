import { createClient } from "npm:@supabase/supabase-js@2";
import { createHash, timingSafeEqual } from "node:crypto";
import { clientIp, ipPermitido } from "../_shared/allowed-ips.ts";
import { BodySchema } from "./schema.ts";

// Recebe snapshots do comercial da Lizy enviados pelo coletor (extensão do Chrome na rede da empresa).
// Proteções: IP autorizado + chave x-ingest-key + validação do payload + limite de tamanho.
// Sem CORS: o coletor roda como extensão com permissão de host e não depende de CORS.

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const MAX_BODY_BYTES = 4 * 1024 * 1024;

const digest = (v: string) => createHash("sha256").update(v, "utf8").digest();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });
  if (req.method !== "POST") return json({ error: "Metodo nao permitido" }, 405);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = clientIp(req);
  const userAgent = (req.headers.get("user-agent") ?? "").slice(0, 300);
  const audit = async (permitido: boolean, motivo: string) => {
    try {
      await db.from("lizy_com_audit").insert({ ip, permitido, motivo, user_agent: userAgent });
    } catch (_e) { /* auditoria nunca derruba o envio */ }
  };

  if (!ipPermitido(ip)) {
    await audit(false, "IP fora da lista autorizada");
    return json({ error: "Acesso restrito a rede autorizada" }, 403);
  }

  const secret = Deno.env.get("LIZY_INGEST_KEY");
  if (!secret) {
    await audit(false, "secret LIZY_INGEST_KEY nao configurado");
    return json({ error: "Erro de configuracao do servidor" }, 500);
  }
  const provided = req.headers.get("x-ingest-key") ?? "";
  if (!provided || !timingSafeEqual(digest(provided), digest(secret))) {
    await audit(false, "chave de ingestao invalida ou ausente");
    return json({ error: "Nao autorizado" }, 401);
  }

  if (Number(req.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) {
    await audit(false, "corpo acima do limite");
    return json({ error: "Corpo muito grande" }, 413);
  }
  let raw: Uint8Array;
  try {
    raw = new Uint8Array(await req.arrayBuffer());
  } catch {
    return json({ error: "Corpo invalido" }, 400);
  }
  if (raw.byteLength > MAX_BODY_BYTES) {
    await audit(false, "corpo acima do limite");
    return json({ error: "Corpo muito grande" }, 413);
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    await audit(false, "JSON invalido");
    return json({ error: "JSON invalido" }, 400);
  }
  const parsed = BodySchema.safeParse(parsedJson);
  if (!parsed.success) {
    await audit(false, "payload invalido");
    const campos = parsed.error.issues.slice(0, 20).map((i) => ({ campo: i.path.join("."), erro: i.message }));
    return json({ error: "Payload invalido", campos }, 400);
  }
  const body = parsed.data;

  const resultados: { empresa: string; orcamentos: number; notas: number; ok: boolean }[] = [];
  for (const emp of body.empresas) {
    try {
      const { data, error } = await db.rpc("lizy_com_replace_snapshot", {
        p_empresa: emp.empresa,
        p_orcamentos: emp.orcamentos,
        p_notas: emp.notas,
        p_clientes: emp.clientes ?? null,
        p_periodo_inicio: body.periodo_inicio,
        p_periodo_fim: body.periodo_fim,
        p_coletado_em: body.coletado_em,
      });
      if (error) throw new Error(error.message);
      const r = (data ?? {}) as { orcamentos?: number; notas?: number };
      resultados.push({ empresa: emp.empresa, orcamentos: r.orcamentos ?? 0, notas: r.notas ?? 0, ok: true });
    } catch (e) {
      try {
        await db.from("lizy_com_sync").upsert({
          empresa: emp.empresa,
          ultimo_erro: String((e as Error).message ?? e).slice(0, 500),
          ultimo_erro_em: new Date().toISOString(),
        }, { onConflict: "empresa" });
      } catch (_e) { /* ignora */ }
      resultados.push({ empresa: emp.empresa, orcamentos: 0, notas: 0, ok: false });
    }
  }

  const falhas = resultados.filter((r) => !r.ok).map((r) => r.empresa);
  await audit(true, falhas.length ? `snapshot recebido; falha em: ${falhas.join(", ")}` : "snapshot recebido");
  return json({ ok: true, empresas: resultados });
});
