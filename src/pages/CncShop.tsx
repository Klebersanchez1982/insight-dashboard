import { FileText, CheckCircle2, Send, RefreshCw, Package, Info } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { KpiCard } from "@/components/KpiCard";
import { MetaRangeCard } from "@/components/MetaRangeCard";
import { InfoListCard } from "@/components/InfoListCard";
import { StatusChart } from "@/components/StatusChart";
import {
  fetchPropostas,
  fetchMetasMensais,
  fetchInformacoes,
  getMetaMesAtual,
  getStatusCounts,
  type PropostaRecord,
  type MetaMensalRecord,
  type InformacoesData,
} from "@/data/cncshopData";
import { useQuery } from "@tanstack/react-query";

const CncShop = () => {
  const { data: propostas = [], isLoading, refetch: refetchP, dataUpdatedAt } = useQuery<PropostaRecord[]>({
    queryKey: ["cncshop-propostas"],
    queryFn: fetchPropostas,
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: metas = [], refetch: refetchM } = useQuery<MetaMensalRecord[]>({
    queryKey: ["cncshop-metas"],
    queryFn: fetchMetasMensais,
    refetchInterval: 5 * 60 * 1000,
  });

  const refetch = () => { refetchP(); refetchM(); };

  const propostasAbertas = propostas.filter(p => p.status === "ABERTO").length;
  const propostasAprovadas = propostas.filter(p => p.status === "PROPOSTA APROVADA").length;
  const propostasEnviadas = propostas.filter(p => p.status === "PROPOSTA ENVIADA PARA O CLIENTE").length;

  const statusData = getStatusCounts(propostas);
  const metaAtual = getMetaMesAtual(metas);

  const lastUpdate = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1920px] mx-auto px-6 xl:px-10 py-4 flex items-center gap-3">
          <div className="bg-white rounded-md px-3 py-1">
            <img src={logo} alt="CNCShop - Grupo Manutex CNC" className="h-10" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">CNCSHOP</h1>
            <p className="text-sm text-muted-foreground">Dashboard Comercial — Propostas e Pedidos</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 px-3 py-2 rounded-md transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <span className="text-xs text-muted-foreground">Últ. atualização: {lastUpdate}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-6 xl:px-10 py-8 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mr-3" />
            Carregando dados…
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <KpiCard title="Propostas em Aberto" value={propostasAbertas} icon={<FileText className="h-6 w-6" />} subtitle="Status: Aberto" />
              <KpiCard title="Propostas Aprovadas" value={propostasAprovadas} icon={<CheckCircle2 className="h-6 w-6" />} subtitle="Aguardando pedido" />
              <KpiCard title="Enviadas ao Cliente" value={propostasEnviadas} icon={<Send className="h-6 w-6" />} subtitle="Aguardando retorno" />
            </div>

            <MetaRangeCard
              atual={metaAtual?.faturamento ?? 0}
              metaMin={400000}
              metaMax={800000}
            />


            <StatusChart data={statusData} title="Distribuição por Status (Contagem)" layout="vertical" />
          </>
        )}
      </main>
    </div>
  );
};

export default CncShop;
