import type { OSRecord } from "@/data/osData";

interface RecentOSTableProps {
  data: OSRecord[];
}

function statusBadge(status: string) {
  if (!status) return null;
  
  const isUrgent = status.includes("URGENTE");
  const isApproved = status.includes("APROVADO");
  const isGarantia = status.includes("GARANTIA");
  
  let classes = "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ";
  if (isUrgent) classes += "bg-destructive/20 text-destructive";
  else if (isApproved) classes += "bg-success/20 text-success";
  else if (isGarantia) classes += "bg-warning/20 text-warning";
  else classes += "bg-secondary text-secondary-foreground";

  return <span className={classes}>{status.length > 20 ? status.slice(0, 20) + "…" : status}</span>;
}

export function RecentOSTable({ data }: RecentOSTableProps) {
  const recent = data.slice(0, 12);

  return (
    <div className="rounded-lg bg-card border border-border p-5 animate-slide-up">
      <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
        Ordens de Serviço Recentes
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">OS</th>
              <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</th>
              <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
              <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Técnico</th>
              <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">UF</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(os => (
              <tr key={os.numero} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                <td className="py-2.5 px-2 font-mono text-primary font-semibold">{os.numero}</td>
                <td className="py-2.5 px-2 text-foreground max-w-[200px] truncate">{os.descricao}</td>
                <td className="py-2.5 px-2 text-muted-foreground max-w-[180px] truncate">{os.razaoSocial}</td>
                <td className="py-2.5 px-2">{statusBadge(os.statusOS)}{!os.statusOS && <span className="text-muted-foreground text-xs">—</span>}</td>
                <td className="py-2.5 px-2 text-foreground">{os.tecnico}</td>
                <td className="py-2.5 px-2 text-muted-foreground font-mono">{os.uf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
