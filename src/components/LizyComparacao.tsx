import { AlertTriangle, Database, FileText, ShoppingCart, Receipt, Users } from "lucide-react";
import type { LizyComercial } from "@/data/cncshopData";

interface Planilha {
  propostasAbertas: number;
  pedidos: { matriz: number; eletronica: number; filial: number };
  faturamentoMes: number;
}

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const hora = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

function Bloco({ titulo, lizy, planilha, icon }: { titulo: string; lizy: string | number; planilha: string | number; icon: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-card border border-border p-5 xl:p-6">
      <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-60" />
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{titulo}</p>
          <p className="text-4xl font-bold font-mono text-foreground">{lizy}</p>
          <p className="text-sm text-muted-foreground">Planilha: <span className="font-mono">{planilha}</span></p>
        </div>
        <div className="p-2 rounded-md bg-secondary text-accent shrink-0">{icon}</div>
      </div>
    </div>
  );
}

export function LizyComparacao({ lizy, planilha }: { lizy: LizyComercial | null | undefined; planilha: Planilha }) {
  if (!lizy || lizy.semDados) {
    return (
      <section className="rounded-lg border border-dashed border-border px-5 py-4 text-sm text-muted-foreground flex items-center gap-2">
        <Database className="h-4 w-4" />
        Lizy: aguardando o primeiro envio do coletor.
      </section>
    );
  }

  return (
    <section className="space-y-4" aria-label="Comparação com a Lizy">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Database className="h-5 w-5 text-accent" /> Lizy — comparação
        </h2>
        {lizy.atualizadoEm && (
          <span className="text-sm text-muted-foreground">atualizado em {hora(lizy.atualizadoEm)}</span>
        )}
        {lizy.desatualizado && (
          <span className="flex items-center gap-1 rounded-md bg-destructive/10 border border-destructive/40 px-2 py-1 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" /> Dados da Lizy desatualizados — verificar o coletor
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Bloco
          titulo="Propostas em aberto"
          lizy={lizy.propostasAbertas}
          planilha={planilha.propostasAbertas}
          icon={<FileText className="h-6 w-6" />}
        />
        <Bloco titulo="Pedidos aprovados — Matriz" lizy={lizy.pedidos.matriz} planilha={planilha.pedidos.matriz} icon={<ShoppingCart className="h-6 w-6" />} />
        <Bloco titulo="Pedidos aprovados — Eletrônica" lizy={lizy.pedidos.eletronica} planilha={planilha.pedidos.eletronica} icon={<ShoppingCart className="h-6 w-6" />} />
        <Bloco titulo="Pedidos aprovados — Filial" lizy={lizy.pedidos.filial} planilha={planilha.pedidos.filial} icon={<ShoppingCart className="h-6 w-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-lg bg-card border border-border p-5 xl:p-6 space-y-3">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-60" />
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Faturamento do mês</p>
            <div className="p-2 rounded-md bg-secondary text-accent"><Receipt className="h-6 w-6" /></div>
          </div>
          <p className="text-4xl font-bold font-mono text-foreground">{brl(lizy.faturamentoMes)}</p>
          <p className="text-sm text-muted-foreground">Planilha: <span className="font-mono">{brl(planilha.faturamentoMes)}</span></p>
          <ul className="text-sm text-foreground space-y-1 pt-1">
            <li className="flex justify-between"><span>Matriz</span><span className="font-mono">{brl(lizy.faturamentoPorUnidade.matriz)}</span></li>
            <li className="flex justify-between"><span>Eletrônica</span><span className="font-mono">{brl(lizy.faturamentoPorUnidade.eletronica)}</span></li>
            <li className="flex justify-between"><span>Filial</span><span className="font-mono">{brl(lizy.faturamentoPorUnidade.filial)}</span></li>
          </ul>
          <p className="text-xs text-muted-foreground">{lizy.notasMes} notas autorizadas no mês</p>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-card border border-border p-5 xl:p-6 space-y-3">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-60" />
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Clientes</p>
            <div className="p-2 rounded-md bg-secondary text-accent"><Users className="h-6 w-6" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-4xl font-bold font-mono text-foreground">{lizy.clientes.novos}</p>
              <p className="text-sm text-muted-foreground">novos no mês</p>
            </div>
            <div>
              <p className="text-4xl font-bold font-mono text-foreground">{lizy.clientes.ativos}</p>
              <p className="text-sm text-muted-foreground">ativos</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Em aberto com a equipe: <span className="font-mono">{brl(lizy.propostasAbertasValor)}</span>
          </p>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-card border border-border p-5 xl:p-6 space-y-3">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-60" />
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Top clientes do mês</p>
          {lizy.topClientes.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Sem notas autorizadas no mês</p>
          ) : (
            <ol className="space-y-2">
              {lizy.topClientes.map((c, i) => (
                <li key={i} className="flex justify-between gap-3 text-foreground">
                  <span className="truncate">{i + 1}. {c.nome}</span>
                  <span className="font-mono shrink-0">{brl(c.valor)}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
