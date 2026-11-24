import type { Root } from "@/lib/roots-data";

// The scale of the archive, counted live from published portraits.
// Hidden until the numbers read as momentum rather than "1 portrait".
export const SHOW_STATS_AT = 10;

export function ArchiveStats({ roots }: { roots: Root[] }) {
  if (roots.length < SHOW_STATS_AT) return null;

  const states = new Set(roots.map((r) => r.state.trim().toUpperCase()));
  const communities = new Set(
    roots.map((r) => `${r.city.trim().toLowerCase()}|${r.state.trim().toUpperCase()}`)
  );
  const stats = [
    { value: roots.length, label: "Portraits collected" },
    { value: states.size, label: states.size === 1 ? "State represented" : "States represented" },
    { value: communities.size, label: communities.size === 1 ? "Community reached" : "Communities reached" },
  ];

  return (
    <section className="border-b border-line">
      <dl className="mx-auto grid max-w-6xl divide-y divide-line px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-10">
        {stats.map((s) => (
          <div key={s.label} className="py-10 text-center">
            <dd className="font-display text-6xl leading-none text-ink">{s.value}</dd>
            <dt className="mt-3 font-mono text-[10.5px] uppercase text-ink-soft">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
