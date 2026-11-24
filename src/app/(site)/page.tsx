import Link from "next/link";
import Image from "next/image";
import { getRoots } from "@/lib/roots";
import { getCollections } from "@/lib/collections";
import { getHomepagePhotos } from "@/lib/homepage-photos";
import { ArrowRightIcon } from "@/components/icons";
import { ShareButton } from "@/components/share-button";
import { MapSnapshot } from "@/components/map-snapshot";
import { PortraitCard } from "@/components/portrait-card";
import { ArchiveStats } from "@/components/archive-stats";

// Re-fetch from Sanity at most once a minute so edits in the Studio go
// live without a redeploy.
export const revalidate = 60;

// The structure follows what works for established story archives
// (Southern Foodways Alliance, StoryCorps, The Bitter Southerner):
// lead with a real person, state the purpose in a breath, show recent
// portraits quote-first, group them into collections, then make one
// plain ask.

const steps = [
  {
    title: "Think of someone",
    body: "Who is doing work worth knowing about? It could be someone in your community, someone you work alongside, or someone whose story has stayed with you.",
  },
  {
    title: "Tell us about them",
    body: "Share their name, where they are, a photo if you have one, and a few words about why their story matters. It takes about five minutes.",
  },
  {
    title: "We add their portrait",
    body: "We read every submission by hand and check in before anything goes public.",
  },
];

export default async function Home() {
  const [roots, collections, { banner }] = await Promise.all([
    getRoots(),
    getCollections(),
    getHomepagePhotos(),
  ]);

  // Lead with the most recently added portrait that has a photo.
  const byNewest = [...roots].sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
  );
  const featured = byNewest.find((r) => r.photoUrl) ?? byNewest[0];
  const recent = byNewest.filter((r) => r.slug !== featured?.slug).slice(0, 3);
  const firstCollection = collections[0];
  const featuredFirstName = featured?.name.split(" ")[0];
  // The homepage "bottom photo" (Studio > Homepage photos) if set,
  // otherwise the collection's own cover.
  const collectionPhoto = banner ?? firstCollection?.cover;

  return (
    <div>
      {/* Opening: the team's own words, with a real person beside them */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-14 sm:px-10 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h1 className="font-display text-[2.75rem] leading-[1.03] text-ink sm:text-[3.6rem]">
            Food doesn&rsquo;t just come from somewhere. It comes from
            someone.
          </h1>
          <p className="mt-6 font-display text-2xl italic text-moss sm:text-[1.9rem]">
            Help us find them.
          </p>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink-soft">
            We&rsquo;re mapping the people, places, and ideas shaping the
            future of food.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href="/portraits"
              className="inline-flex items-center gap-2 bg-ink px-6 py-3.5 font-mono text-[11px] uppercase text-paper transition-colors hover:bg-moss"
            >
              Meet the people <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/add"
              className="border-b border-ink pb-0.5 font-mono text-[11px] uppercase text-ink transition-colors hover:border-moss hover:text-moss"
            >
              Nominate someone
            </Link>
          </div>
        </div>

        {featured && (
          <Link href={`/roots/${featured.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-paper-warm">
              {featured.photoUrl && (
                <Image
                  src={featured.photoUrl}
                  alt={featured.photoAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              )}
            </div>
            <div className="mt-5 flex items-start justify-between gap-6 border-t border-line pt-5">
              <div>
                <p className="font-mono text-[10px] uppercase text-moss">
                  Featured portrait
                  {featured.collectionTitle ? ` · ${featured.collectionTitle}` : ""}
                </p>
                <p className="mt-2 font-display text-2xl italic leading-snug text-ink">
                  &ldquo;{featured.quote}&rdquo;
                </p>
                <p className="mt-2 font-mono text-[10.5px] uppercase text-ink-soft">
                  {featured.name} &middot; {featured.orgName ?? `${featured.city}, ${featured.state}`}
                </p>
              </div>
              <span className="mt-6 hidden shrink-0 items-center gap-2 font-mono text-[10.5px] uppercase text-ink group-hover:text-moss sm:inline-flex">
                Read {featuredFirstName}&rsquo;s portrait <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        )}
      </section>

      {/* Purpose, in a breath */}
      <section className="border-y border-line bg-paper-warm">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-10 sm:py-28">
          <p className="section-label">Our purpose</p>
          <h2 className="mt-6 font-display text-4xl leading-[1.12] text-ink sm:text-[3.4rem]">
            Food connects us.
            <br />
            <span className="italic">People make it possible.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl font-display text-2xl italic leading-snug text-moss">
            Every meal carries the work, knowledge, and traditions of the
            people behind it.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-soft sm:text-[18px]">
            Roots discovers and documents the people shaping how food is
            grown, raised, caught, prepared, and shared. Through their
            portraits, we are building a living record of the people and
            ideas shaping the future of food.
          </p>
        </div>
      </section>

      {/* Scale of the archive -- appears once there are 10+ portraits */}
      <ArchiveStats roots={roots} />

      {/* Recent portraits, quote first -- shown once there's more than one */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label">Recent portraits</p>
              <h2 className="mt-4 font-display text-4xl text-ink sm:text-5xl">
                Meet the people behind our food.
              </h2>
            </div>
            <Link href="/portraits" className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase text-ink hover:text-moss">
              All portraits <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((r) => (
              <PortraitCard key={r.slug} root={r} />
            ))}
          </div>
        </section>
      )}

      {/* Where it started -- Roots on the Road, the journey page */}
      {firstCollection && (
        <section className={recent.length > 0 ? "border-t border-line" : ""}>
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:px-10 sm:py-28 md:grid-cols-2 md:gap-16">
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden bg-paper-warm">
                {collectionPhoto && (
                  <Image
                    src={collectionPhoto.url}
                    alt={collectionPhoto.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              {banner?.alt && (
                <figcaption className="mt-3 text-[13px] italic text-ink-soft">{banner.alt}</figcaption>
              )}
            </figure>
            <div>
              <p className="section-label">Where it started</p>
              <h2 className="mt-4 font-display text-4xl text-ink sm:text-[3.25rem]">
                {firstCollection.title}
              </h2>
              {firstCollection.subtitle && (
                <p className="mt-4 font-display text-2xl italic leading-snug text-ink-soft">
                  {firstCollection.subtitle}
                </p>
              )}
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-soft">
                We set out across America with one question:{" "}
                <em className="font-display text-[1.2rem] text-ink">
                  What does the future of food look like?
                </em>
              </p>
              <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink-soft">
                Along the way, we met the farmers, ranchers, cooks, and
                communities answering it every day. Those conversations
                became the foundation for Roots.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link
                  href={`/collections/${firstCollection.slug}`}
                  className="inline-flex items-center gap-2 bg-ink px-6 py-3.5 font-mono text-[11px] uppercase text-paper transition-colors hover:bg-moss"
                >
                  Explore the journey <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/about"
                  className="border-b border-ink pb-0.5 font-mono text-[11px] uppercase text-ink hover:border-moss hover:text-moss"
                >
                  How Roots began
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* The map, and the one ask */}
      <section className="border-t border-line bg-paper-warm">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 py-20 sm:px-10 sm:py-28 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="section-label">Explore by place</p>
            <h2 className="mt-4 font-display text-4xl text-ink sm:text-5xl">
              Every pin is a person.
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink-soft">
              A map of food stories from communities across the country.
            </p>
            <div className="mt-8">
              <MapSnapshot roots={roots} showFooter={false} />
            </div>
            <Link
              href="/map"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase text-ink hover:text-moss"
            >
              Explore the map <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="lg:border-l lg:border-line lg:pl-20">
            <p className="section-label">Contribute</p>
            <h2 className="mt-4 font-display text-4xl text-ink sm:text-5xl">
              Who should we meet next?
            </h2>
            <p className="mt-4 max-w-md font-display text-2xl italic leading-snug text-moss">
              Know someone who deserves to be part of the story?
            </p>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink-soft">
              A farmer, fisher, rancher, cook, truck driver, teacher,
              neighbor, or anyone whose work helps shape how we grow, share,
              and think about food. We want to hear about them.
            </p>
            <ol className="mt-10 space-y-7">
              {steps.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-2">
                  <span className="font-display text-3xl leading-none text-moss">{i + 1}</span>
                  <div>
                    <p className="font-display text-2xl leading-tight text-ink">{step.title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="/add"
                className="inline-flex items-center gap-2 bg-ink px-6 py-3.5 font-mono text-[11px] uppercase text-paper transition-colors hover:bg-moss"
              >
                Nominate someone <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
              <ShareButton
                title="Roots"
                text="Portraits of the people shaping America's food future."
                className="border-b border-ink pb-0.5 font-mono text-[11px] uppercase text-ink transition-colors hover:border-moss hover:text-moss"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
