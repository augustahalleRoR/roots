import Link from "next/link";
import { getUsMapGeometry, projectPoint, MAP_VIEWBOX } from "@/lib/us-map";
import type { Root } from "@/lib/roots-data";
import { ArrowRightIcon } from "@/components/icons";

type Pin = { root: Root; x: number; y: number };

// A real, live snapshot of the actual map data (not a mockup image) --
// same geo source as /map, styled bigger and livelier for the homepage,
// with a pulsing ring on each pin so it reads as "alive," not static.
// Counts only read as momentum once there are enough of them.
const SHOW_COUNT_AT = 10;

export function MapSnapshot({
  roots,
  showFooter = true,
}: {
  roots: Root[];
  showFooter?: boolean;
}) {
  const { land, interior, outline } = getUsMapGeometry();
  const pins = roots
    .map((root) => {
      const p = projectPoint(root.lon, root.lat);
      return p ? { root, x: p.x, y: p.y } : null;
    })
    .filter((p): p is Pin => Boolean(p));

  return (
    <div className="border-2 border-line bg-paper-warm p-5 shadow-[0_1px_2px_rgba(42,36,28,0.08)] sm:p-8">
      <svg
        viewBox={MAP_VIEWBOX}
        className="w-full"
        role="img"
        aria-label="Preview of the Roots map"
      >
        <path
          d={land}
          fill="color-mix(in srgb, var(--moss) 7%, var(--paper))"
        />
        <path
          d={interior}
          fill="none"
          stroke="var(--line)"
          strokeWidth={1}
          strokeLinejoin="round"
        />
        <path
          d={outline}
          fill="none"
          stroke="var(--ink)"
          strokeOpacity={0.55}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <g>
          {pins.map((pin) => (
            <g key={pin.root.slug} transform={`translate(${pin.x}, ${pin.y})`}>
              <circle r={7} fill="var(--moss)" opacity={0.45}>
                <animate
                  attributeName="r"
                  values="7;22;7"
                  dur="2.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.45;0;0.45"
                  dur="2.8s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r={7} fill="var(--wheat)" opacity={0.9} />
              <circle
                r={7}
                fill="none"
                stroke="var(--paper)"
                strokeWidth={2}
              />
            </g>
          ))}
        </g>
      </svg>

      {showFooter && (
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <p className="font-mono text-[12px] uppercase tracking-wide text-ink-soft">
          {roots.length >= SHOW_COUNT_AT
            ? `${roots.length} stories on the map so far, and counting`
            : "New portraits added as we go"}
        </p>
        <Link
          href="/map"
          className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-mono text-[12px] uppercase tracking-wide text-paper transition-colors hover:bg-moss-deep"
        >
          Explore the full map <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
      )}
    </div>
  );
}
