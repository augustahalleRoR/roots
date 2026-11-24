import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCollection, getCollections } from "@/lib/collections";
import { PortraitCard } from "@/components/portrait-card";
import { ArrowRightIcon } from "@/components/icons";

export const revalidate = 60;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCollection(slug);
  if (!data) return {};
  return {
    title: `${data.collection.title} — Roots`,
    description: data.collection.subtitle,
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCollection(slug);
  if (!data) notFound();
  const { collection: c, roots } = data;

  const meta = [
    c.dates && { label: "When", value: c.dates },
    c.route && { label: "Where", value: c.route },
    { label: "Portraits", value: String(roots.length) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article>
      {/* Title block */}
      <header className="mx-auto max-w-6xl px-6 pb-10 pt-14 sm:px-10 sm:pt-20">
        <p className="section-label">Where it started</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl text-ink sm:text-7xl">{c.title}</h1>
        {c.subtitle && (
          <p className="mt-5 max-w-2xl font-display text-2xl italic leading-snug text-ink-soft sm:text-[1.75rem]">
            {c.subtitle}
          </p>
        )}
        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 border-t border-line pt-6">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="font-mono text-[10px] uppercase text-ink-soft">{m.label}</dt>
              <dd className="mt-1 font-display text-xl text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {c.cover && (
        <div className="mx-auto max-w-6xl sm:px-10">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-warm">
            <Image src={c.cover.url} alt={c.cover.alt} fill priority sizes="(min-width: 1152px) 1072px, 100vw" className="object-cover" />
          </div>
        </div>
      )}

      {/* Introduction */}
      {c.intro.length > 0 && (
        <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:px-10 sm:py-24 md:grid-cols-[1fr_2fr] md:gap-14">
          <p className="section-label">About the journey</p>
          <div className="prose-story max-w-2xl text-ink">
            {c.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Portraits */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
          <p className="section-label">Portraits from the road</p>
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {roots.map((r, i) => (
              <PortraitCard key={r.slug} root={r} priority={i === 0} />
            ))}
            <Link
              href="/add?for=other"
              className="group flex aspect-[4/5] flex-col justify-end border border-line p-8 transition-colors hover:border-ink"
            >
              <p className="font-display text-3xl leading-tight text-ink">
                More portraits from the road are on their way.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase text-ink-soft group-hover:text-ink">
                Know someone we should meet? <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Photos */}
      {c.gallery.length > 0 && (
        <section className="border-t border-line bg-paper-warm">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
            <p className="section-label">From the road</p>
            <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {c.gallery.map((g, i) => (
                <div key={i} className="relative aspect-square overflow-hidden bg-paper">
                  <Image src={g.url} alt={g.alt} fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
