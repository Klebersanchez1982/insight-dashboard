import { FileText, ShoppingCart, Send, RefreshCw, Package, Info, ShieldX } from "lucide-react";
import logo from "@/assets/logo.png";
import { KpiCard } from "@/components/KpiCard";
import { MetaRangeCard } from "@/components/MetaRangeCard";
import { InfoListCard } from "@/components/InfoListCard";
import { StatusChart } from "@/components/StatusChart";
import { fetchDashboard, AccessDeniedError, type DashboardData } from "@/data/cncshopData";
import { useQuery } from "@tanstack/react-query";

const CncShop = () => {
  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery<DashboardData>({
    queryKey: ["cncshop-dashboard"],
    queryFn: fetchDashboard,
    refetchInterval: 5 * 60 * 1000,
    retry: (count, err) => !(err instanceof AccessDeniedError) && count < 2,
  });

  if (error instanceof AccessDeniedError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-card border border-border rounded-lg p-8 text-center space-y-4">
          <ShieldX className="h-10 w-10 text-destructive mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Acesso não autorizado</h1>
          <p className="text-sm text-muted-foreground">Este dashboard só pode ser acessado a partir da rede autorizada.</p>
        </div>
      </div>
    );
  }

  const propostasAbertas = data?.kpis.abertas ?? 0;
  const pedidosAbertos = data?.kpis.pedidosAbertos ?? 0;
  const propostasEnviadas = data?.kpis.enviadas ?? 0;
  const statusData = data?.statusCounts ?? [];
  const infos = { importacoes: data?.importacoes ?? [], informacoes: data?.pendencias ?? [] };
  const metaAtual = { faturamento: ((data?.metaPctMin ?? 0) / 100) * 400000 };

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
            <h1 className="font-bold text-foreground tracking-tight text-3xl">CNCSHOP</h1>
            <p className="text-muted-foreground text-base">Dashboard Comercial — Propostas e Pedidos</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 px-3 py-2 rounded-md transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <span className="text-muted-foreground text-sm">Últ. atualização: {lastUpdate}</span>
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
              <KpiCard title="Pedidos de Venda em Aberto" value={pedidosAbertos} icon={<ShoppingCart className="h-6 w-6" />} subtitle="Status: Em Aberto" />
              <KpiCard title="Enviadas ao Cliente" value={propostasEnviadas} icon={<Send className="h-6 w-6" />} subtitle="Aguardando retorno" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="flex flex-col gap-6">
                <MetaRangeCard
                  atual={metaAtual?.faturamento ?? 0}
                  metaMin={400000}
                  metaMax={800000}
                />
                <div className="flex-1 min-h-[280px]">
                  <StatusChart data={statusData} title="Distribuição por Status (Contagem)" layout="vertical" />
                </div>
              </div>
              <InfoListCard
                title="Importações"
                items={infos?.importacoes ?? []}
                icon={<Package className="h-6 w-6" />}
              />
              <InfoListCard
                title="​pendências "
                items={infos?.informacoes ?? []}
                icon={<Info className="h-6 w-6" />}
              />
            </div>

          </>
        )}
      </main>
    </div>
  );
};

export default CncShop;
