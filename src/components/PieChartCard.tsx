import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = [
  "hsl(172, 66%, 50%)",
  "hsl(38, 92%, 50%)",
  "hsl(262, 60%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(340, 65%, 55%)",
];

interface PieChartCardProps {
  data: { name: string; value: number }[];
  title: string;
}

export function PieChartCard({ data, title }: PieChartCardProps) {
  return (
    <div className="rounded-lg bg-card border border-border p-5 animate-slide-up">
      <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "hsl(220, 18%, 16%)", border: "1px solid hsl(220, 15%, 22%)", borderRadius: 8, color: "hsl(210, 20%, 90%)", fontSize: 12 }}
          />
          <Legend
            formatter={(value) => <span style={{ color: "hsl(210, 20%, 70%)", fontSize: 11 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
