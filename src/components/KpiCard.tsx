import { type ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  accentColor?: string;
}

export function KpiCard({ title, value, icon, subtitle, accentColor = "primary" }: KpiCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-card border border-border p-6 xl:p-8 animate-slide-up group hover:border-primary/30 transition-colors">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-60" />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs xl:text-sm font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-3xl xl:text-5xl font-bold font-mono text-foreground">{value}</p>
          {subtitle && <p className="text-xs xl:text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="p-2 rounded-md bg-secondary text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
