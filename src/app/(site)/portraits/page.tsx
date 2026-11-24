import Link from "next/link";
import Image from "next/image";
import { getRoots } from "@/lib/roots";

export const metadata = {
  title: "Portraits — Roots",
  description:
    "Every person in the Roots archive, one photo each. Tap a portrait to read their story.",
};

export const revalidate = 60;

// Just one open tile -- an invitation to add a story. A row of empty
// tiles reads as "unfinished" rather than "growing".
const MIN_TILES = 1;

export default async function PortraitsPage() {
  const roots = await getRoots();
  const openTiles = MIN_TILES;

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-14 sm:px-10">
        <p className="section-label">The Portraits</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] text-ink sm:text-6xl">
          Meet the people shaping the future of food.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          Every face here has a story behind it. Tap a portrait to read it,
          in their own words.
        </p>
      </section>

      <ul className="grid grid-cols-2 gap-[3px] bg-ink sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {roots.map((root, i) => (
          <li key={root.slug}>
            <Link
              href={`/roots/${root.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden bg-ink focus-visible:outline-none"
            >
              {root.photoUrl ? (
                <Image
                  src={root.photoUrl}
                  alt={root.photoAlt}
                  fill
                  priority={i < 6}
                  sizes="(min-width: 1280px) 17vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0 group-focus-visible:grayscale-0"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center font-mono text-[10px] uppercase tracking-wide text-paper/60">
                  {root.photoAlt}
                </div>
              )}
              {/* Name + place, always readable on touch; quote slides in on hover */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-12 sm:p-4 sm:pt-16">
                <p className="font-display text-lg leading-tight text-paper">
                  {root.name}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-paper/75">
                  {root.orgName ?? `${root.city}, ${root.state}`}
                </p>
                <p className="mt-2 hidden max-h-0 overflow-hidden font-display text-[13px] italic leading-snug text-paper/90 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100 sm:block">
                  &ldquo;{root.quote}&rdquo;
                </p>
              </div>
              <span className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-transparent transition group-focus-visible:ring-paper" />
            </Link>
          </li>
        ))}

        {Array.from({ length: openTiles }).map((_, i) => (
          <li key={`open-${i}`} aria-hidden={i > 0}>
            {i === 0 ? (
              <Link
                href="/add"
                className="flex aspect-[4/5] flex-col items-center justify-center gap-2 bg-paper-warm p-4 text-center transition-colors hover:bg-paper"
              >
                <span className="font-display text-lg text-ink">
                  Know someone who belongs here?
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wide text-moss-deep">
                  Add a story &rarr;
                </span>
              </Link>
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center bg-paper-warm/90 font-mono text-[10px] uppercase tracking-wide text-ink-soft/60">
                A new portrait soon
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
