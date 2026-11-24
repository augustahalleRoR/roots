import Link from "next/link";
import Image from "next/image";
import type { Root } from "@/lib/roots-data";

// A horizontal row of "more portraits" thumbnails, used at the bottom of a
// portrait page and (trimmed) on the homepage. Pads out with placeholders
// when the archive is still small so the row doesn't look empty or, worse,
// implausibly full.
export function PortraitStrip({
  roots,
  minCount = 4,
  carousel = false,
}: {
  roots: Root[];
  minCount?: number;
  // Always a horizontal scroller with snap points, even on wide screens --
  // used where the strip is a secondary "keep scrolling" beat rather than
  // a grid meant to be scanned all at once.
  carousel?: boolean;
}) {
  // At most one placeholder: a single "more soon" tile reads as "growing",
  // a row of them reads as "empty".
  const placeholders = Math.min(1, Math.max(0, minCount - roots.length));

  return (
    <div
      className={
        carousel
          ? "-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 sm:mx-0 sm:px-0"
          : "-mx-6 flex gap-5 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0"
      }
    >
      {roots.map((root) => (
        <Link
          key={root.slug}
          href={`/roots/${root.slug}`}
          className={
            carousel
              ? "group w-40 shrink-0 snap-start sm:w-48"
              : "group w-40 shrink-0 sm:w-auto"
          }
        >
          {root.photoUrl ? (
            <Image
              src={root.photoUrl}
              alt={root.photoAlt}
              width={300}
              height={225}
              className="aspect-[4/3] w-full object-cover transition-opacity group-hover:opacity-80"
            />
          ) : (
            <div
              aria-hidden
              className="flex aspect-[4/3] items-center justify-center bg-ink/10 font-mono text-[10px] uppercase tracking-wide text-ink-soft"
            >
              {root.photoAlt}
            </div>
          )}
          <p className="mt-2 font-display text-base text-ink">{root.name}</p>
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            {root.city}, {root.state}
          </p>
        </Link>
      ))}
      {Array.from({ length: placeholders }).map((_, i) => (
        <div key={i} className="w-40 shrink-0 sm:w-auto">
          <div
            aria-hidden
            className="flex aspect-[4/3] items-center justify-center border border-dashed border-line font-mono text-[10px] uppercase tracking-wide text-ink-soft"
          >
            More portraits soon
          </div>
        </div>
      ))}
    </div>
  );
}
