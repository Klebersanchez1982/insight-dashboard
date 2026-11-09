// Agregação do comercial da Lizy. Código puro (sem Deno/Supabase) para poder ser testado no Vitest.
// Só agregados saem daqui: nada de linhas brutas para o navegador.

export interface OrcamentoRow {
  empresa: string;
  tipo_orcamento: number | null;
  status: string | null;
  vendedor: string | null;
  valor: number | string | null;
}
export interface NotaRow {
  empresa: string;
  situacao: string | null;
  cliente: string | null;
  id_cliente: string | null;
  valor: number | string | null;
  emissao: string | null; // YYYY-MM-DD
}
export interface ClientesRow {
  empresa: string;
  ativos: number | null;
  novos: number | null;
}
export interface SyncRow {
  empresa: string;
  ultimo_sucesso: string | null;
}

export interface LizyComercial {
  atualizadoEm: string | null;
  desatualizado: boolean;
  semDados: boolean;
  propostasAbertas: number;
  propostasAbertasValor: number;
  statusEquipe: { name: string; value: number }[];
  pedidos: { matriz: number; eletronica: number; filial: number };
  faturamentoMes: number;
  faturamentoPorUnidade: { matriz: number; eletronica: number; filial: number };
  notasMes: number;
  clientes: { novos: number; ativos: number };
  topClientes: { nome: string; valor: number }[];
}

// Mesma regra das planilhas: KPIs de propostas em aberto contam só a equipe comercial.
export const USUARIAS_COMERCIAIS = new Set(["KAUANA.SILVA", "GIULIANA.FERREIRA", "JOSIANE.PAULA"]);

// Tipos de orçamento da Lizy: 1 = venda de produtos (referência "OVP"), 5 = OS de serviço.
// O painel considera só venda de produtos (filtro "Produtos" da tela de Orçamentos da Lizy).
export const TIPOS_PRODUTO = new Set([1]);

// Status da Lizy que equivalem a "proposta em aberto".
export const STATUS_ABERTOS = new Set(["ENVIAR_AO_CLIENTE", "AGUARDANDO_APROVACAO"]);
// Aprovado e ainda não finalizado/faturado = pedido em aberto.
export const STATUS_PEDIDO_ABERTO = "APROVADO";
// Nota autorizada (é o que a Lizy soma em "Faturado no mês").
export const SITUACAO_FATURADA = "CONCLUIDO";

const ROTULO_STATUS: Record<string, string> = {
  ENVIAR_AO_CLIENTE: "AGUARDANDO ENVIO",
  AGUARDANDO_APROVACAO: "AGUARDANDO APROVAÇÃO",
  APROVADO: "APROVADO",
  NAO_APROVADO: "NÃO APROVADO",
  FINALIZADO: "FINALIZADO",
};

const UNIDADE: Record<string, "matriz" | "eletronica" | "filial"> = {
  Matriz: "matriz",
  Eletronica: "eletronica",
  Filial: "filial",
};

const MAX_IDADE_MS = 30 * 60_000;

const n = (v: unknown) => {
  const x = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(x) ? x : 0;
};
const arred = (v: number) => Math.round(v * 100) / 100;

// Horário de São Paulo (UTC-3, sem horário de verão desde 2019).
function sp(now: Date) {
  const d = new Date(now.getTime() - 3 * 3600_000);
  return {
    mes: d.toISOString().slice(0, 7),
    dia: d.getUTCDay(),
    min: d.getUTCHours() * 60 + d.getUTCMinutes(),
  };
}

// Expediente do coletor: seg–sex, 08:00–16:30. Fora disso os dados ficam parados de propósito.
function noExpediente(now: Date) {
  const { dia, min } = sp(now);
  return dia >= 1 && dia <= 5 && min >= 8 * 60 + 20 && min <= 16 * 60 + 30;
}

export function agregarLizy(
  orcamentos: OrcamentoRow[],
  notas: NotaRow[],
  clientes: ClientesRow[],
  sync: SyncRow[],
  now = new Date(),
): LizyComercial {
  const mesAtual = sp(now).mes;

  const sucessos = ["Matriz", "Eletronica", "Filial"].map(
    (e) => sync.find((s) => s.empresa === e)?.ultimo_sucesso ?? null,
  );
  const semDados = sucessos.every((s) => !s);
  const maisAntigo = sucessos.reduce<number | null>((acc, s) => {
    if (!s) return acc;
    const t = new Date(s).getTime();
    return acc === null ? t : Math.min(acc, t);
  }, null);
  const algumFaltando = sucessos.some((s) => !s);
  const desatualizado = !semDados && noExpediente(now) &&
    (algumFaltando || (maisAntigo !== null && now.getTime() - maisAntigo > MAX_IDADE_MS));

  let propostasAbertas = 0;
  let propostasAbertasValor = 0;
  const statusMap: Record<string, number> = {};
  const pedidos = { matriz: 0, eletronica: 0, filial: 0 };

  for (const o of orcamentos) {
    if (!TIPOS_PRODUTO.has(Number(o.tipo_orcamento))) continue;
    const status = String(o.status ?? "").toUpperCase().trim();
    const vendedor = String(o.vendedor ?? "").toUpperCase().trim();
    // Cartão de propostas = todas as propostas de produto, em qualquer status.
    // Nos status em aberto (envio/aprovação) contam só as vendedoras da equipe; nos demais, todos.
    const conta = !STATUS_ABERTOS.has(status) || USUARIAS_COMERCIAIS.has(vendedor);
    if (conta) {
      const rotulo = ROTULO_STATUS[status] ?? (status.replace(/_/g, " ") || "SEM STATUS");
      statusMap[rotulo] = (statusMap[rotulo] ?? 0) + 1;
      propostasAbertas++;
      propostasAbertasValor += n(o.valor);
    }
    const u = UNIDADE[o.empresa];
    if (u && status === STATUS_PEDIDO_ABERTO) pedidos[u]++;
  }

  const faturamentoPorUnidade = { matriz: 0, eletronica: 0, filial: 0 };
  let notasMes = 0;
  const porCliente = new Map<string, { nome: string; valor: number }>();
  for (const nf of notas) {
    if (String(nf.situacao ?? "").toUpperCase() !== SITUACAO_FATURADA) continue;
    if (!nf.emissao || nf.emissao.slice(0, 7) !== mesAtual) continue;
    const u = UNIDADE[nf.empresa];
    if (!u) continue;
    const valor = n(nf.valor);
    faturamentoPorUnidade[u] += valor;
    notasMes++;
    const nome = (nf.cliente ?? "").trim() || "Sem nome";
    const chave = nf.id_cliente || nome.toUpperCase();
    const atual = porCliente.get(chave) ?? { nome, valor: 0 };
    atual.valor += valor;
    porCliente.set(chave, atual);
  }

  const topClientes = [...porCliente.values()]
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5)
    .map((c) => ({ nome: c.nome.slice(0, 60), valor: arred(c.valor) }));

  const clientesTot = clientes.reduce(
    (acc, c) => ({ novos: acc.novos + n(c.novos), ativos: acc.ativos + n(c.ativos) }),
    { novos: 0, ativos: 0 },
  );

  return {
    atualizadoEm: maisAntigo === null ? null : new Date(maisAntigo).toISOString(),
    desatualizado,
    semDados,
    propostasAbertas,
    propostasAbertasValor: arred(propostasAbertasValor),
    statusEquipe: Object.entries(statusMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
    pedidos,
    faturamentoMes: arred(faturamentoPorUnidade.matriz + faturamentoPorUnidade.eletronica + faturamentoPorUnidade.filial),
    faturamentoPorUnidade: {
      matriz: arred(faturamentoPorUnidade.matriz),
      eletronica: arred(faturamentoPorUnidade.eletronica),
      filial: arred(faturamentoPorUnidade.filial),
    },
    notasMes,
    clientes: clientesTot,
    topClientes,
  };
}
