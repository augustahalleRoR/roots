import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getRoots, getRootBySlug } from "@/lib/roots";
import { stateName } from "@/lib/us-states";
import { ArrowRightIcon } from "@/components/icons";
import { AudioPlayer } from "@/components/audio-player";
import { PortraitCard } from "@/components/portrait-card";

// Re-fetch from Sanity at most once a minute so edits in the Studio go live
// without a redeploy.
export const revalidate = 60;

export async function generateStaticParams() {
  const roots = await getRoots();
  return roots.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const root = await getRootBySlug(slug);
  if (!root) return {};
  const description = root.dek || root.oneLine;
  return {
    title: `${root.name} — Roots`,
    description,
    openGraph: {
      title: `“${root.quote}” — ${root.name}`,
      description,
      ...(root.photoUrl ? { images: [{ url: root.photoUrl }] } : {}),
    },
  };
}

function monthYear(iso?: string) {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

// A single portrait, laid out like a magazine feature: the person's own
// words as the headline, a credit line (as oral-history archives do), the
// story in a reading column, and more from the same collection at the end.
export default async function RootPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [root, allRoots] = await Promise.all([getRootBySlug(slug), getRoots()]);
  if (!root) notFound();

  const firstName = root.name.split(" ")[0];
  const place = `${root.orgName ? `${root.orgName}, ` : ""}${root.city}, ${stateName(root.state)}`;
  const sameCollection = allRoots.filter(
    (r) => r.slug !== root.slug && root.collectionSlug && r.collectionSlug === root.collectionSlug
  );
  const more = sameCollection.length > 0 ? sameCollection : allRoots.filter((r) => r.slug !== root.slug);
  const visited = monthYear(root.visitedOn);
  const credits = [
    root.writtenBy && `Words by ${root.writtenBy}`,
    root.photographedBy && `Photographs by ${root.photographedBy}`,
    visited && `Visited ${visited}`,
    root.collectionTitle && `Part of ${root.collectionTitle}`,
  ].filter(Boolean) as string[];
  const dek = root.dek || root.oneLine;

  return (
    <article>
      {/* Title block */}
      <header className="mx-auto max-w-4xl px-6 pb-12 pt-12 text-center sm:px-10 sm:pt-16">
        <Link
          href={root.collectionSlug ? `/collections/${root.collectionSlug}` : "/portraits"}
          className="font-mono text-[10.5px] uppercase text-ink-soft hover:text-ink"
        >
          &larr; {root.collectionTitle ?? "All portraits"}
        </Link>
        <p className="section-label mt-10">{place}</p>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-[2.6rem] italic leading-[1.08] text-ink sm:text-[3.75rem]">
          &ldquo;{root.quote}&rdquo;
        </h1>
        <p className="mt-8 font-display text-3xl text-ink">{root.name}</p>
        {root.connection.length > 0 && (
          <p className="mt-2 font-mono text-[10.5px] uppercase text-ink-soft">
            {root.connection.join(" · ")}
          </p>
        )}
        {dek && (
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft">{dek}</p>
        )}
        <p className="mt-8 border-y border-line py-3 font-mono text-[10px] uppercase text-ink-soft">
          {credits.length > 0 ? credits.join("  ·  ") : "A Roots portrait"}
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 sm:px-10 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
        {/* Photo, held in place while the story scrolls */}
        <figure className="lg:sticky lg:top-8">
          <div className="relative aspect-[4/5] overflow-hidden bg-paper-warm">
            {root.photoUrl ? (
              <Image
                src={root.photoUrl}
                alt={root.photoAlt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center font-mono text-[10px] uppercase text-ink-soft">
                {root.photoAlt}
              </div>
            )}
          </div>
          <figcaption className="mt-3 text-[13px] italic text-ink-soft">
            {root.name}, {place}
            {root.photographedBy ? `. Photo by ${root.photographedBy}.` : "."}
          </figcaption>
        </figure>

        {/* The story */}
        <div className="max-w-2xl">
          {root.audioUrl && (
            <div className="mb-10">
              <AudioPlayer
                src={root.audioUrl}
                label={`Hear ${firstName} in their own words`}
                caption={root.audioCaption}
              />
            </div>
          )}

          {root.story && root.story.length > 0 ? (
            <div className="prose-story text-ink">
              {root.story.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="text-[18px] leading-relaxed text-ink">{root.oneLine}</p>
          )}

          <p aria-hidden className="mt-10 text-center font-display text-2xl text-moss">
            &#9674;
          </p>

          {root.tags.length > 0 && (
            <p className="mt-10 border-t border-line pt-6 text-[14px] text-ink-soft">
              <span className="font-mono text-[10px] uppercase text-ink">Themes</span>
              <span className="ml-3">{root.tags.join(" · ")}</span>
            </p>
          )}

          {root.updates.length > 0 && (
            <section className="mt-8 border-t border-line pt-6">
              <p className="font-mono text-[10px] uppercase text-ink">Updates</p>
              <ul className="mt-4 space-y-3">
                {root.updates.map((u, i) => (
                  <li key={i} className="text-[15px] text-ink-soft">
                    <span className="font-mono text-[10px] uppercase text-moss">{u.date}</span>{" "}
                    {u.note}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {root.openToConnect && (
            <div className="mt-10 border border-line p-7">
              <p className="font-display text-2xl text-ink">{firstName} is open to connecting.</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Reach out through Roots and we&rsquo;ll pass your note along.
                We don&rsquo;t publish contact details.
              </p>
              <Link
                href={`/roots/${root.slug}/connect`}
                className="mt-5 inline-flex items-center gap-2 bg-ink px-5 py-3 font-mono text-[10.5px] uppercase text-paper transition-colors hover:bg-moss"
              >
                Request an introduction <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* More from the same collection */}
      <section className="border-t border-line bg-paper-warm">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label">
                {sameCollection.length > 0 ? `More from ${root.collectionTitle}` : "More portraits"}
              </p>
              <h2 className="mt-4 font-display text-4xl text-ink">Keep meeting people.</h2>
            </div>
            <Link
              href={root.collectionSlug ? `/collections/${root.collectionSlug}` : "/portraits"}
              className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase text-ink hover:text-moss"
            >
              {root.collectionTitle ? `All of ${root.collectionTitle}` : "All portraits"}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {more.slice(0, 3).map((r) => (
              <PortraitCard key={r.slug} root={r} />
            ))}
            <Link
              href="/add?for=other"
              className="group flex aspect-[4/5] flex-col justify-end border border-line bg-paper p-8 transition-colors hover:border-ink"
            >
              <p className="font-display text-3xl leading-tight text-ink">
                Know someone {firstName} would want you to meet?
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase text-ink-soft group-hover:text-ink">
                Nominate them <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
