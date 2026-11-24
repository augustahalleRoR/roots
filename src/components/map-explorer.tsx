"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Root } from "@/lib/roots-data";
import { stateName } from "@/lib/us-states";

type Pin = {
  root: Root;
  x: number;
  y: number;
};

export function MapExplorer({
  statePaths,
  nationOutline,
  pins,
  viewBox,
  initialTheme,
}: {
  statePaths: { id: string | number; d: string }[];
  nationOutline: string;
  pins: Pin[];
  viewBox: string;
  initialTheme?: string;
}) {
  const uniqueTags = useMemo(() => {
    const set = new Set<string>();
    pins.forEach((p) => p.root.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [pins]);

  // Deep-link support: /map?theme=Regenerative%20Agriculture jumps straight
  // to that filter, in list view so results are immediately visible.
  // Computed once at initial render (lazy initializer) rather than an
  // effect, since everything it needs is already available on mount.
  const initialMatch = initialTheme
    ? uniqueTags.find((t) => t.toLowerCase() === initialTheme.toLowerCase())
    : undefined;

  const [view, setView] = useState<"map" | "list">(initialMatch ? "list" : "map");
  const [active, setActive] = useState<Pin | null>(null);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(initialMatch ?? null);

  const filteredPins = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pins.filter((pin) => {
      if (activeTag && !pin.root.tags.includes(activeTag)) return false;
      if (!q) return true;
      const haystack = [
        pin.root.name,
        pin.root.city,
        pin.root.state,
        pin.root.orgName,
        pin.root.oneLine,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [pins, query, activeTag]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 rounded-sm border border-ink p-1 font-mono text-[12px] uppercase tracking-wide">
          <button
            onClick={() => setView("map")}
            className={`rounded-sm px-4 py-1.5 transition-colors ${
              view === "map"
                ? "bg-moss-deep text-paper"
                : "text-ink hover:bg-ink/10"
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-sm px-4 py-1.5 transition-colors ${
              view === "list"
                ? "bg-moss-deep text-paper"
                : "text-ink hover:bg-ink/10"
            }`}
          >
            Search
          </button>
        </div>
        <p className="hidden font-mono text-[12px] uppercase tracking-wide text-ink-soft sm:block">
          {filteredPins.length} of {pins.length}{" "}
          {pins.length === 1 ? "story" : "stories"}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, place, or story..."
          aria-label="Search stories"
          className="w-full border border-line bg-paper px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
        />
        {uniqueTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                activeTag === null
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              All themes
            </button>
            {uniqueTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                  activeTag === tag
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {view === "map" ? (
        <div className="relative mt-8 rounded-sm border border-line bg-paper-warm p-4 shadow-[0_1px_2px_rgba(42,36,28,0.08)] sm:p-6">
          <svg
            viewBox={viewBox}
            className="w-full"
            role="img"
            aria-label="Map of Roots stories across the United States"
          >
            <g>
              {statePaths.map((s) => (
                <path key={s.id} d={s.d} className="map-state" />
              ))}
            </g>
            <path
              d={nationOutline}
              fill="none"
              stroke="var(--ink)"
              strokeOpacity={0.55}
              strokeWidth={1.5}
              strokeLinejoin="round"
              pointerEvents="none"
            />
            <g>
              {filteredPins.map((pin) => (
                <g
                  key={pin.root.slug}
                  transform={`translate(${pin.x}, ${pin.y})`}
                  className="cursor-pointer"
                  onClick={() => setActive(pin)}
                >
                  <circle r={12} fill="var(--moss)" opacity={0.18} />
                  <circle
                    r={6}
                    fill="var(--moss-deep)"
                    stroke="var(--paper)"
                    strokeWidth={2}
                  />
                </g>
              ))}
            </g>
          </svg>

          {active && (
            <div className="absolute bottom-4 left-1/2 w-[min(90vw,340px)] -translate-x-1/2 border border-ink bg-paper p-5 shadow-lg sm:bottom-6 sm:left-6 sm:translate-x-0">
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-3 top-2 font-mono text-sm text-ink-soft hover:text-ink"
              >
                &times;
              </button>
              <p className="font-mono text-[11px] uppercase tracking-wide text-indigo">
                {active.root.orgName ?? active.root.city},{" "}
                {stateName(active.root.state)}
              </p>
              <h3 className="mt-1 font-display text-lg text-ink">
                {active.root.name}
              </h3>
              <p className="mt-1 text-sm leading-snug text-ink-soft">
                {active.root.oneLine}
              </p>
              <Link
                href={`/roots/${active.root.slug}`}
                className="mt-3 inline-block font-mono text-[12px] uppercase tracking-wide text-moss-deep underline decoration-line underline-offset-4 hover:text-ink"
              >
                Read their story &rarr;
              </Link>
            </div>
          )}
        </div>
      ) : filteredPins.length === 0 ? (
        <p className="mt-10 border-y border-line py-10 text-center text-sm text-ink-soft">
          Nothing matches yet. Try a different search or theme.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {filteredPins.map((pin) => (
            <li key={pin.root.slug}>
              <Link
                href={`/roots/${pin.root.slug}`}
                className="flex flex-col gap-1 py-5 transition-colors hover:bg-paper-warm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-display text-lg text-ink">{pin.root.name}</p>
                  <p className="text-sm text-ink-soft">{pin.root.oneLine}</p>
                </div>
                <p className="shrink-0 font-mono text-[12px] uppercase tracking-wide text-indigo">
                  {pin.root.orgName ?? pin.root.city}, {stateName(pin.root.state)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
