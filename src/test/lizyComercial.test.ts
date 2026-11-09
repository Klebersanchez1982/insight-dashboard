import { describe, expect, it } from "vitest";
import { agregarLizy } from "../../supabase/functions/dashboard-data/lizy";

// Sexta, 06/11/2026 14:00 em São Paulo (17:00 UTC)
const agora = new Date("2026-11-06T17:00:00Z");
const syncOk = ["Matriz", "Eletronica", "Filial"].map((empresa) => ({
  empresa,
  ultimo_sucesso: "2026-11-06T16:55:00Z",
}));

describe("agregarLizy", () => {
  it("propostas: todos os status; nos em aberto só a equipe comercial", () => {
    const r = agregarLizy(
      [
        { empresa: "Matriz", tipo_orcamento: 1, status: "ENVIAR_AO_CLIENTE", vendedor: "KAUANA.SILVA", valor: 100 },
        { empresa: "Filial", tipo_orcamento: 1, status: "AGUARDANDO_APROVACAO", vendedor: "giuliana.ferreira", valor: 50 },
        { empresa: "Matriz", tipo_orcamento: 1, status: "AGUARDANDO_APROVACAO", vendedor: "OUTRO.VENDEDOR", valor: 999 },
        { empresa: "Matriz", tipo_orcamento: 1, status: "AGUARDANDO_APROVACAO", vendedor: null, valor: 999 },
        { empresa: "Eletronica", tipo_orcamento: 1, status: "NAO_APROVADO", vendedor: "JOSIANE.PAULA", valor: 10 },
      ],
      [], [], syncOk, agora,
    );
    // 2 em aberto da equipe + 1 não aprovado (qualquer vendedor); os 2 em aberto de fora da equipe não contam
    expect(r.propostasAbertas).toBe(3);
    expect(r.propostasAbertasValor).toBe(160);
    expect(r.statusEquipe).toContainEqual({ name: "NÃO APROVADO", value: 1 });
    expect(r.statusEquipe.reduce((a, s) => a + s.value, 0)).toBe(r.propostasAbertas);
  });

  it("pedidos aprovados por unidade valem para todos os vendedores", () => {
    const r = agregarLizy(
      [
        { empresa: "Matriz", tipo_orcamento: 1, status: "APROVADO", vendedor: "OUTRO", valor: 1 },
        { empresa: "Matriz", tipo_orcamento: 1, status: "APROVADO", vendedor: null, valor: 1 },
        { empresa: "Filial", tipo_orcamento: 1, status: "FINALIZADO", vendedor: null, valor: 1 },
        { empresa: "Eletronica", tipo_orcamento: 1, status: "APROVADO", vendedor: null, valor: 1 },
      ],
      [], [], syncOk, agora,
    );
    expect(r.pedidos).toEqual({ matriz: 2, eletronica: 1, filial: 0 });
  });

  it("faturamento soma só notas CONCLUIDO do mês corrente", () => {
    const r = agregarLizy(
      [],
      [
        { empresa: "Matriz", situacao: "CONCLUIDO", cliente: "A", id_cliente: "1", valor: 10000.5, emissao: "2026-11-02" },
        { empresa: "Matriz", situacao: "CONCLUIDO", cliente: "A", id_cliente: "1", valor: 0.17, emissao: "2026-11-03" },
        { empresa: "Filial", situacao: "CONCLUIDO", cliente: "B", id_cliente: "2", valor: 500, emissao: "2026-11-04" },
        { empresa: "Matriz", situacao: "REJEITADO", cliente: "C", id_cliente: "3", valor: 7000, emissao: "2026-11-04" },
        { empresa: "Matriz", situacao: "CANCELADO", cliente: "C", id_cliente: "3", valor: 7000, emissao: "2026-11-04" },
        { empresa: "Matriz", situacao: "CONCLUIDO", cliente: "D", id_cliente: "4", valor: 9000, emissao: "2026-10-31" },
      ],
      [], syncOk, agora,
    );
    expect(r.faturamentoMes).toBe(10500.67);
    expect(r.faturamentoPorUnidade).toEqual({ matriz: 10000.67, eletronica: 0, filial: 500 });
    expect(r.notasMes).toBe(3);
    expect(r.topClientes[0]).toEqual({ nome: "A", valor: 10000.67 });
  });

  it("considera só venda de produtos (tipo 1); OS de serviço (tipo 5) ficam de fora", () => {
    const r = agregarLizy(
      [
        { empresa: "Matriz", tipo_orcamento: 1, status: "AGUARDANDO_APROVACAO", vendedor: "KAUANA.SILVA", valor: 100 },
        { empresa: "Matriz", tipo_orcamento: 5, status: "AGUARDANDO_APROVACAO", vendedor: "KAUANA.SILVA", valor: 900 },
        { empresa: "Matriz", tipo_orcamento: 5, status: "APROVADO", vendedor: "KAUANA.SILVA", valor: 900 },
        { empresa: "Matriz", tipo_orcamento: null, status: "APROVADO", vendedor: null, valor: 1 },
        { empresa: "Filial", tipo_orcamento: 1, status: "APROVADO", vendedor: null, valor: 1 },
      ],
      [], [], syncOk, agora,
    );
    // tipo 1: 1 em aberto da equipe + 1 aprovado (Filial); tipo 5 e tipo nulo ficam de fora
    expect(r.propostasAbertas).toBe(2);
    expect(r.pedidos).toEqual({ matriz: 0, eletronica: 0, filial: 1 });
    expect(r.statusEquipe).toEqual(expect.arrayContaining([{ name: "AGUARDANDO APROVAÇÃO", value: 1 }, { name: "APROVADO", value: 1 }]));
  });

  it("marca desatualizado no expediente quando a coleta passa de 30 min", () => {
    const velho = syncOk.map((s) => ({ ...s, ultimo_sucesso: "2026-11-06T16:00:00Z" }));
    expect(agregarLizy([], [], [], velho, agora).desatualizado).toBe(true);
    expect(agregarLizy([], [], [], syncOk, agora).desatualizado).toBe(false);
    // Sábado: coletor parado de propósito, sem alerta
    expect(agregarLizy([], [], [], velho, new Date("2026-11-07T17:00:00Z")).desatualizado).toBe(false);
  });

  it("sem nenhum envio, sinaliza semDados", () => {
    const r = agregarLizy([], [], [], [], agora);
    expect(r.semDados).toBe(true);
    expect(r.desatualizado).toBe(false);
  });
});
