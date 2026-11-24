import Link from "next/link";
import Image from "next/image";
import type { Root } from "@/lib/roots-data";

const rotations = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]"];

export function QuiltCard({ root, index = 0 }: { root: Root; index?: number }) {
  const rotate = rotations[index % rotations.length];

  return (
    <Link
      href={`/roots/${root.slug}`}
      className={`stitched group block bg-paper-warm p-5 shadow-[0_1px_0_var(--line)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 ${rotate}`}
    >
      {root.photoUrl ? (
        <Image
          src={root.photoUrl}
          alt={root.photoAlt}
          width={400}
          height={160}
          className="mb-4 h-40 w-full object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="mb-4 flex h-40 items-center justify-center bg-ink/10 font-mono text-[11px] uppercase tracking-wide text-ink-soft"
        >
          {root.photoAlt}
        </div>
      )}
      <p className="font-mono text-[11px] uppercase tracking-wide text-indigo">
        {root.city}, {root.state}
      </p>
      <h3 className="mt-1 font-display text-xl text-ink">{root.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{root.oneLine}</p>
      <p className="mt-3 font-display text-[15px] italic text-moss-deep">
        &ldquo;{root.quote}&rdquo;
      </p>
    </Link>
  );
}

export function QuiltCardPlaceholder({ index = 0 }: { index?: number }) {
  const rotate = rotations[index % rotations.length];
  return (
    <div
      className={`flex h-full min-h-[220px] flex-col items-center justify-center border-2 border-dashed border-line bg-transparent p-5 text-center ${rotate}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
        More portraits soon
      </p>
    </div>
  );
}
