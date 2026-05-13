import { type ReactNode } from "react";

interface InfoListCardProps {
  title: string;
  items: string[];
  icon: ReactNode;
  emptyLabel?: string;
}

export function InfoListCard({ title, items, icon, emptyLabel = "Sem registros" }: InfoListCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-card border border-border p-5 xl:p-6 animate-slide-up hover:border-primary/30 transition-colors flex flex-col">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-60" />
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs xl:text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <div className="p-2 rounded-md bg-secondary text-primary">{icon}</div>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[220px] pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">{emptyLabel}</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li
                key={i}
                className="text-sm xl:text-base text-foreground border-l-2 border-primary/40 pl-3 py-1 leading-snug whitespace-pre-wrap"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
