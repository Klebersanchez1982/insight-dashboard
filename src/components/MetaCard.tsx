import { Target } from "lucide-react";

interface MetaCardProps {
  meta: number;
  atual: number;
}

export function MetaCard({ meta, atual }: MetaCardProps) {
  const percent = meta > 0 ? Math.min((atual / meta) * 100, 100) : 0;
  const remaining = Math.max(meta - atual, 0);
  const remainingPercent = meta > 0 ? (remaining / meta) * 100 : 0;

  const getColor = () => {
    if (percent >= 80) return "bg-primary";
    if (percent >= 50) return "bg-accent";
    return "bg-destructive";
  };

  const getLabel = () => {
    if (percent >= 100) return "Meta atingida! 🎉";
    if (percent >= 80) return "Quase lá!";
    if (percent >= 50) return "Em progresso";
    return "Atenção — meta distante";
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-card border border-border p-6 xl:p-8 animate-slide-up group hover:border-primary/30 transition-colors col-span-1 sm:col-span-2">
      <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-60" />
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <p className="text-xs xl:text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Meta Mensal
          </p>
          <p className="text-3xl xl:text-5xl font-bold font-mono text-foreground">
            {percent.toFixed(1)}%
          </p>
          <p className="text-xs xl:text-sm text-muted-foreground">{getLabel()}</p>
        </div>
        <div className="p-2 rounded-md bg-secondary text-accent">
          <Target className="h-6 w-6" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Realizado: {percent.toFixed(1)}%</span>
        <span>Falta: {remainingPercent.toFixed(1)}%</span>
      </div>
    </div>
  );
}
