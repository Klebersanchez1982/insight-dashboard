import type { OSRecord } from "@/data/osData";

interface RecentOSTableProps {
  data: OSRecord[];
}

function statusBadge(status: string) {
  if (!status) return <span className="text-muted-foreground text-xs">—</span>;
  
  const isUrgent = status.includes("URGENTE");
  const isApproved = status.includes("APROVADO");
  const isGarantia = status.includes("GARANTIA");
  
  let classes = "inline-flex items-center px-2.5 py-1 rounded text-[11px] xl:text-xs font-medium uppercase tracking-wide ";
  if (isUrgent) classes += "bg-destructive/20 text-destructive";
  else if (isApproved) classes += "bg-success/20 text-success";
  else if (isGarantia) classes += "bg-warning/20 text-warning";
  else classes += "bg-secondary text-secondary-foreground";

  return <span className={classes}>{status.length > 28 ? status.slice(0, 28) + "…" : status}</span>;
}

function labBadge(status: string) {
  if (!status) return <span className="text-muted-foreground text-xs">—</span>;
  let classes = "inline-flex items-center px-2.5 py-1 rounded text-[11px] xl:text-xs font-medium uppercase tracking-wide bg-primary/15 text-primary";
  return <span className={classes}>{status.length > 30 ? status.slice(0, 30) + "…" : status}</span>;
}

export function RecentOSTable({ data }: RecentOSTableProps) {
  const aguardando = data.filter(os => os.statusLab.includes("AGUARDANDO"));

  return (
    <div className="rounded-lg bg-card border border-border p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm xl:text-base font-medium uppercase tracking-wider text-muted-foreground">
          OS Aguardando Avaliação
        </h3>
        <span className="text-xs xl:text-sm font-mono bg-warning/15 text-warning px-3 py-1.5 rounded">
          {aguardando.length} registros
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm xl:text-base">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider">OS</th>
              <th className="text-left py-3 px-3 text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider">Seq</th>
              <th className="text-left py-3 px-3 text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider">Status OS</th>
              <th className="text-left py-3 px-3 text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider">Status Lab</th>
              <th className="text-left py-3 px-3 text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider">Descrição</th>
              <th className="text-left py-3 px-3 text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider">Nº Série</th>
              <th className="text-left py-3 px-3 text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
            </tr>
          </thead>
          <tbody>
            {aguardando.map(os => (
              <tr key={os.numero} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                <td className="py-3 px-3 font-mono text-primary font-semibold">{os.numero}</td>
                <td className="py-3 px-3 font-mono text-muted-foreground">{os.seq ?? "—"}</td>
                <td className="py-3 px-3">{statusBadge(os.statusOS)}</td>
                <td className="py-3 px-3">{labBadge(os.statusLab)}</td>
                <td className="py-3 px-3 text-foreground max-w-[300px] truncate">{os.descricao}</td>
                <td className="py-3 px-3 font-mono text-muted-foreground text-xs xl:text-sm">{os.numSerie ?? "—"}</td>
                <td className="py-3 px-3 text-muted-foreground max-w-[280px] truncate">{os.razaoSocial}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
