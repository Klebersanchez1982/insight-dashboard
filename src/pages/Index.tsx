import { Wrench, ClipboardList, RefreshCw } from "lucide-react";
import logo from "@/assets/logo.png";
import { KpiCard } from "@/components/KpiCard";
import { StatusChart } from "@/components/StatusChart";
import { RecentOSTable } from "@/components/RecentOSTable";
import {
  fetchOSData,
  getStatusLabCountData,
  type OSRecord,
} from "@/data/osData";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const { data: osData = [], isLoading, refetch, dataUpdatedAt } = useQuery<OSRecord[]>({
    queryKey: ["osData"],
    queryFn: fetchOSData,
    refetchInterval: 5 * 60 * 1000, // auto-refresh every 5 min
  });

  const total = osData.length;
  const aguardando = osData.filter(os => os.statusLab.includes("AGUARDANDO")).length;

  const statusLabData = getStatusLabCountData(osData);

  const lastUpdate = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1920px] mx-auto px-6 xl:px-10 py-4 flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Laboratório Eletrônico</h1>
            <p className="text-sm text-muted-foreground">Dashboard de KPIs — Ordens de Serviço</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 px-3 py-2 rounded-md transition-colors"
              title="Atualizar dados"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <span className="text-xs text-muted-foreground">
              Últ. atualização: {lastUpdate}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary px-4 py-2 rounded-md">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
              {total} OS ativas
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-6 xl:px-10 py-8 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mr-3" />
            Carregando dados da planilha…
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <KpiCard title="Total de OS" value={total} icon={<ClipboardList className="h-6 w-6" />} subtitle="Ordens ativas no sistema" />
              <KpiCard title="Aguardando Avaliação" value={aguardando} icon={<Wrench className="h-6 w-6" />} subtitle={`${total > 0 ? ((aguardando / total) * 100).toFixed(0) : 0}% do total`} />
            </div>

            {/* Chart: Status Lab */}
            <StatusChart data={statusLabData} title="Status do Laboratório (Contagem)" layout="vertical" />

            {/* Tabela: OS Aguardando Avaliação */}
            <RecentOSTable data={osData} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
