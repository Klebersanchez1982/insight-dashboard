import { Target } from "lucide-react";

interface MetaRangeCardProps {
  atual: number;
  metaMin: number;
  metaMax: number;
}

export function MetaRangeCard({ atual, metaMin, metaMax }: MetaRangeCardProps) {
  const pctMin = metaMin > 0 ? Math.min((atual / metaMin) * 100, 100) : 0;
  const pctMax = metaMax > 0 ? Math.min((atual / metaMax) * 100, 100) : 0;

  const getLabel = () => {
    if (atual >= metaMax) return "Meta máxima atingida! 🎉";
    if (atual >= metaMin) return "Meta mínima batida — rumo à máxima";
    return "Atenção — meta mínima ainda não atingida";
  };

  const barColor = (p: number) =>
    p >= 100 ? "bg-primary" : p >= 50 ? "bg-accent" : "bg-destructive";

  return (
    <div className="relative overflow-hidden rounded-lg bg-card border border-border p-6 xl:p-8 animate-slide-up group hover:border-primary/30 transition-colors">
      <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-60" />
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <p className="xl:text-sm font-medium uppercase tracking-wider text-muted-foreground text-sm">
            Meta Mensal
          </p>
          <p className="xl:text-base text-foreground text-sm">{getLabel()}</p>
        </div>
        <div className="p-2 rounded-md bg-secondary text-accent">
          <Target className="h-6 w-6" />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-xs xl:text-sm mb-2">
            <span className="text-muted-foreground uppercase tracking-wider text-sm">Meta Mínima</span>
            <span className="font-mono font-bold text-foreground text-2xl">{pctMin.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(pctMin)}`}
              style={{ width: `${pctMin}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs xl:text-sm mb-2">
            <span className="text-muted-foreground uppercase tracking-wider text-sm">Meta Máxima</span>
            <span className="font-mono font-bold text-foreground text-2xl">{pctMax.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(pctMax)}`}
              style={{ width: `${pctMax}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
