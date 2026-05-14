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

export function StatusChart({ data, title, layout = "horizontal" }: StatusChartProps) {
  if (layout === "vertical") {
    return (
      <div className="rounded-lg bg-card border border-border p-6 animate-slide-up flex flex-col h-full min-h-[280px]">
        <h3 className="xl:text-base font-medium uppercase tracking-wider text-muted-foreground mb-4 text-sm">{title}</h3>
        <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%" minHeight={data.length * 36}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
            <XAxis type="number" hide domain={[0, (dataMax: number) => dataMax * 1.15]} />
            <YAxis type="category" dataKey="name" width={180} tick={{ fill: "hsl(210, 20%, 70%)", fontSize: 13 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(220, 18%, 16%)", border: "1px solid hsl(220, 15%, 22%)", borderRadius: 8, color: "hsl(210, 20%, 90%)", fontSize: 13 }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} label={{ position: "right", fill: "hsl(210, 20%, 95%)", fontSize: 18, fontWeight: 800 }}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </div>
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
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
