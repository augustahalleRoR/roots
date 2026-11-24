import Link from "next/link";
import Image from "next/image";
import type { Root } from "@/lib/roots-data";

// The quote-led portrait card: the person's own words are the headline,
// with their name and place set quietly underneath -- the way story
// archives like StoryCorps title their stories.
export function PortraitCard({
  root,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  root: Root;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Link href={`/roots/${root.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-warm">
        {root.photoUrl ? (
          <Image
            src={root.photoUrl}
            alt={root.photoAlt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center font-mono text-[10px] uppercase text-ink-soft">
            {root.photoAlt}
          </div>
        )}
      </div>
      {root.quote && (
        <p className="mt-5 font-display text-[1.55rem] italic leading-[1.2] text-ink transition-colors group-hover:text-moss">
          &ldquo;{root.quote}&rdquo;
        </p>
      )}
      <p className="mt-3 font-mono text-[10.5px] uppercase text-ink-soft">
        {root.name} &middot; {root.orgName ?? `${root.city}, ${root.state}`}
      </p>
    </Link>
  );
}
