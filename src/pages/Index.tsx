import { Wrench, ClipboardList, Users, Zap } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { StatusChart } from "@/components/StatusChart";
import { RecentOSTable } from "@/components/RecentOSTable";
import {
  osData,
  getTechnicianGroups,
  getStatusLabCountData,
} from "@/data/osData";

const Index = () => {
  const total = osData.length;
  const aguardando = osData.filter(os => os.statusLab.includes("AGUARDANDO")).length;
  const technicians = new Set(osData.map(os => os.tecnico)).size;

  const techData = getTechnicianGroups(osData);
  const statusLabData = getStatusLabCountData(osData);

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
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary px-4 py-2 rounded-md">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
              {total} OS ativas
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-6 xl:px-10 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <KpiCard title="Total de OS" value={total} icon={<ClipboardList className="h-6 w-6" />} subtitle="Ordens ativas no sistema" />
          <KpiCard title="Aguardando Avaliação" value={aguardando} icon={<Wrench className="h-6 w-6" />} subtitle={`${((aguardando / total) * 100).toFixed(0)}% do total`} />
          <KpiCard title="Técnicos Ativos" value={technicians} icon={<Users className="h-6 w-6" />} subtitle="Profissionais atuando" />
        </div>

        {/* Charts: OS por Técnico + Status Lab */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusChart data={techData} title="Contagem de OS por Técnico" />
          <StatusChart data={statusLabData} title="Status do Laboratório (Contagem)" layout="vertical" />
        </div>

        {/* Tabela: OS Aguardando Avaliação */}
        <RecentOSTable data={osData} />
      </main>
    </div>
  );
};

export default Index;
