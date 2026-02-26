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
      <div className="rounded-lg bg-card border border-border p-5 animate-slide-up">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={data.length * 36 + 20}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={160} tick={{ fill: "hsl(210, 20%, 70%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(220, 18%, 16%)", border: "1px solid hsl(220, 15%, 22%)", borderRadius: 8, color: "hsl(210, 20%, 90%)", fontSize: 12 }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card border border-border p-5 animate-slide-up">
      <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fill: "hsl(210, 20%, 70%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(210, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "hsl(220, 18%, 16%)", border: "1px solid hsl(220, 15%, 22%)", borderRadius: 8, color: "hsl(210, 20%, 90%)", fontSize: 12 }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
