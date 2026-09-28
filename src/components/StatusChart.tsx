import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = [
  "hsl(172, 66%, 50%)",
  "hsl(38, 92%, 50%)",
  "hsl(262, 60%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(340, 65%, 55%)",
  "hsl(142, 70%, 45%)",
  "hsl(20, 80%, 55%)",
  "hsl(280, 50%, 50%)",
];

interface StatusChartProps {
  data: { name: string; value: number }[];
  title: string;
  layout?: "vertical" | "horizontal";
}

// Cores com significado: sucesso (verde), andamento (azul/âmbar), neutro/encerrado (cinza)
function semanticColor(name: string, index: number): string {
  const s = name.toUpperCase();
  if (/APROVAD|FECHAD|GANH|CONCLU|FATURAD/.test(s)) return "hsl(142, 70%, 45%)";
  if (/ABERT|ANDAMENTO|NEGOCIA/.test(s)) return "hsl(200, 80%, 55%)";
  if (/ENVIAD|AGUARD|PENDENT|AVALIA/.test(s)) return "hsl(38, 92%, 50%)";
  if (/CANCEL|PERDID|DECLIN|RECUSAD|REPROVAD|ENCERRAD/.test(s)) return "hsl(215, 12%, 50%)";
  return COLORS[index % COLORS.length];
}

export function StatusChart({ data, title, layout = "horizontal" }: StatusChartProps) {
  if (layout === "vertical") {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const max = data.reduce((m, d) => Math.max(m, d.value), 0) || 1;

    return (
      <div className="rounded-lg bg-card border border-border p-6 animate-slide-up flex flex-col h-full min-h-[280px]">
        <div className="flex items-baseline justify-between mb-4 gap-3">
          <h3 className="xl:text-base font-medium uppercase tracking-wider text-muted-foreground text-sm">{title}</h3>
          <span className="text-muted-foreground text-sm font-mono">{total} no total</span>
        </div>

        {data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Sem dados</div>
        ) : (
          <div className="flex-1 flex flex-col justify-between gap-3 min-h-0">
            {data.map((d, i) => {
              const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
              const color = semanticColor(d.name, i);
              return (
                <div key={d.name} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-foreground font-semibold text-base xl:text-lg truncate">{d.name}</span>
                    <span className="font-mono font-bold text-foreground text-lg xl:text-xl whitespace-nowrap">
                      {d.value}
                      <span className="text-muted-foreground font-semibold text-sm xl:text-base ml-2">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max((d.value / max) * 100, 2)}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card border border-border p-6 animate-slide-up">
      <h3 className="xl:text-base font-medium uppercase tracking-wider text-muted-foreground mb-4 text-sm">{title}</h3>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fill: "hsl(210, 20%, 70%)", fontSize: 13 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(210, 20%, 55%)", fontSize: 13 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "hsl(220, 18%, 16%)", border: "1px solid hsl(220, 15%, 22%)", borderRadius: 8, color: "hsl(210, 20%, 90%)", fontSize: 13 }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
            {data.map((_, i) => (
              <Cell key={i} fill={semanticColor(_.name, i)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
