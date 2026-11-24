import type { ReactNode } from "react";

export function StatRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
      {children}
    </div>
  );
}

export function Stat({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-moss-deep">{icon}</span>
      <div>
        <p className="font-display text-xl leading-none text-ink">{value}</p>
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
          {label}
        </p>
      </div>
    </div>
  );
}
