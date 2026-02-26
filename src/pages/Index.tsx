import { Wrench, ClipboardList, Users, MapPin, Zap, Package } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { StatusChart } from "@/components/StatusChart";
import { PieChartCard } from "@/components/PieChartCard";
import { RecentOSTable } from "@/components/RecentOSTable";
import {
  osData,
  getStatusLabGroups,
  getTechnicianGroups,
  getUFGroups,
  getTipoOSGroups,
  getTopClients,
} from "@/data/osData";

const Index = () => {
  const total = osData.length;
  const comFaturamento = osData.filter(os => os.tipoOS === "OS com Faturamento").length;
  const semFaturamento = total - comFaturamento;
  const aguardando = osData.filter(os => os.statusLab.includes("AGUARDANDO")).length;
  const emTeste = osData.filter(os => os.statusLab.includes("TESTE")).length;
  const concluidos = osData.filter(os => os.statusLab.includes("ENTREGUE") || os.statusLab.includes("PRONTO") || os.statusLab.includes("EMBALADO")).length;
  const technicians = new Set(osData.map(os => os.tecnico)).size;

  const statusLabData = getStatusLabGroups(osData);
  const techData = getTechnicianGroups(osData);
  const ufData = getUFGroups(osData);
  const tipoData = getTipoOSGroups(osData);
  const clientData = getTopClients(osData);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Laboratório Eletrônico</h1>
            <p className="text-xs text-muted-foreground">Dashboard de KPIs — Ordens de Serviço</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-md">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
              {total} OS ativas
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <KpiCard title="Total de OS" value={total} icon={<ClipboardList className="h-5 w-5" />} subtitle="Ordens ativas no sistema" />
          <KpiCard title="Com Faturamento" value={comFaturamento} icon={<Package className="h-5 w-5" />} subtitle={`${((comFaturamento / total) * 100).toFixed(0)}% do total`} />
          <KpiCard title="Sem Faturamento" value={semFaturamento} icon={<Package className="h-5 w-5" />} subtitle={`${((semFaturamento / total) * 100).toFixed(0)}% do total`} />
          <KpiCard title="Aguardando" value={aguardando} icon={<Wrench className="h-5 w-5" />} subtitle="Aguardando avaliação" />
          <KpiCard title="Em Teste" value={emTeste} icon={<Wrench className="h-5 w-5" />} subtitle="Em bancada ou teste final" />
          <KpiCard title="Técnicos" value={technicians} icon={<Users className="h-5 w-5" />} subtitle="Profissionais atuando" />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <StatusChart data={techData} title="OS por Técnico" />
          </div>
          <PieChartCard data={tipoData} title="Tipo de OS" />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatusChart data={ufData} title="OS por Estado (UF)" />
          <div className="lg:col-span-2">
            <StatusChart data={clientData} title="Top Clientes" layout="vertical" />
          </div>
        </div>

        {/* Status Lab Chart */}
        <StatusChart data={statusLabData.slice(0, 10)} title="Status do Laboratório" layout="vertical" />

        {/* Recent OS Table */}
        <RecentOSTable data={osData} />
      </main>
    </div>
  );
};

export default Index;
