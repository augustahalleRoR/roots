import Link from "next/link";
import Image from "next/image";
import { getRoots } from "@/lib/roots";
import { getCollections } from "@/lib/collections";
import { getHomepagePhotos } from "@/lib/homepage-photos";
import { themes, rootMatchesTheme } from "@/lib/themes";
import { CONTACT_EMAIL } from "@/lib/contact";
import type { Root } from "@/lib/roots-data";
import {
  ArrowRightIcon,
  GraduationCapIcon,
  LeafIcon,
  MapPinIcon,
  PenIcon,
  UsersIcon,
} from "@/components/icons";
import { ShareButton } from "@/components/share-button";
import { MapSnapshot } from "@/components/map-snapshot";
import { ArchiveStats } from "@/components/archive-stats";
import { EmailSignupForm } from "@/components/email-signup-form";

// Re-fetch from Sanity at most once a minute so edits in the Studio go
// live without a redeploy.
export const revalidate = 60;

// Homepage order: a real person and the purpose up top, then the people,
// ways into the archive (themes, the map), the ask, where it started, and
// the newsletter. Every section is driven by published content, so it
// grows with the archive and never shows invented people or numbers.

const ideas = [
  { title: "Discover", body: "Meet the people shaping our food system.", Icon: UsersIcon },
  { title: "Explore", body: "Find stories by place, idea, or experience.", Icon: MapPinIcon },
  {
    title: "Contribute",
    body: "Nominate someone, share a story, or document your community.",
    Icon: PenIcon,
  },
  { title: "Learn", body: "Use real stories to build understanding and connection.", Icon: GraduationCapIcon },
];

const primaryButton =
  "inline-flex items-center gap-2 bg-ink px-6 py-3.5 font-mono text-[11px] uppercase text-paper transition-colors hover:bg-moss";
const textLink =
  "inline-flex items-center gap-2 border-b border-ink pb-0.5 font-mono text-[11px] uppercase text-ink transition-colors hover:border-moss hover:text-moss";

function place(root: Root) {
  return `${root.city}, ${root.state}`;
}

function role(root: Root) {
  return root.connection.join(" · ");
}

// One person, as a large photographic card.
function PersonCard({ root, sizes }: { root: Root; sizes: string }) {
  return (
    <Link href={`/roots/${root.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-warm">
        {root.photoUrl && (
          <Image
            src={root.photoUrl}
            alt={root.photoAlt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>
      {role(root) && <p className="mt-5 font-mono text-[10px] uppercase text-moss">{role(root)}</p>}
      <p className="mt-2 font-display text-[1.9rem] leading-tight text-ink transition-colors group-hover:text-moss">
        {root.name}
      </p>
      <p className="mt-1 font-mono text-[10.5px] uppercase text-ink-soft">
        {root.orgName ? `${root.orgName} · ${place(root)}` : place(root)}
      </p>
      {root.oneLine && (
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{root.oneLine}</p>
      )}
      <span className="mt-4 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase text-ink group-hover:text-moss">
        Read the portrait <ArrowRightIcon className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

// With a single published portrait, a wide feature reads better than one
// lonely card in a three-column grid.
function FeatureCard({ root }: { root: Root }) {
  return (
    <Link
      href={`/roots/${root.slug}`}
      className="group grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-warm">
        {root.photoUrl && (
          <Image
            src={root.photoUrl}
            alt={root.photoAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div>
        {role(root) && <p className="font-mono text-[10.5px] uppercase text-moss">{role(root)}</p>}
        <p className="mt-3 font-display text-4xl leading-tight text-ink transition-colors group-hover:text-moss sm:text-5xl">
          {root.name}
        </p>
        <p className="mt-2 font-mono text-[10.5px] uppercase text-ink-soft">
          {root.orgName ? `${root.orgName} · ${place(root)}` : place(root)}
        </p>
        {root.quote && (
          <p className="mt-7 font-display text-[1.75rem] italic leading-snug text-ink">
            &ldquo;{root.quote}&rdquo;
          </p>
        )}
        {root.oneLine && (
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-soft">{root.oneLine}</p>
        )}
        <span className="mt-8 inline-flex items-center gap-2 border-b border-ink pb-0.5 font-mono text-[11px] uppercase text-ink group-hover:border-moss group-hover:text-moss">
          Read the portrait <ArrowRightIcon className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

const MIN_THEMES = 3;
const FULL_MAP_AT = 10;

const themeGridCols: Record<number, string> = {
  1: "sm:grid-cols-1 max-w-md",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export default async function Home() {
  const [roots, collections, { hero, banner }] = await Promise.all([
    getRoots(),
    getCollections(),
    getHomepagePhotos(),
  ]);

  const byNewest = [...roots].sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
  );
  const people = byNewest.slice(0, 6);

  // Hero: a photo chosen in Studio, otherwise the newest portrait's photo.
  const heroPerson = hero ? undefined : byNewest.find((r) => r.photoUrl);
  const heroPhoto = hero ?? (heroPerson?.photoUrl ? { url: heroPerson.photoUrl, alt: heroPerson.photoAlt } : undefined);

  // Themes with at least one published portrait. Each card gets a photo
  // no other theme card is already using; otherwise it's a text card.
  const usedPhotos = new Set<string>();
  const liveThemes = themes
    .map((theme) => {
      const matches = byNewest.filter((r) => rootMatchesTheme(r, theme));
      const photo = matches.find((r) => r.photoUrl && !usedPhotos.has(r.photoUrl));
      if (photo?.photoUrl) usedPhotos.add(photo.photoUrl);
      return { theme, count: matches.length, photo };
    })
    .filter((t) => t.count > 0);
  const comingThemes = themes.filter((t) => !liveThemes.some((l) => l.theme.slug === t.slug));
  // Hold the section back until it offers real choice: with one or two
  // themes it just sends people to the same few portraits.
  const showThemes = liveThemes.length >= MIN_THEMES;

  // Until the map has some density, keep it beside the text instead of
  // full width, so a handful of pins doesn't read as an empty map.
  const mapIsFull = roots.length >= FULL_MAP_AT;

  const journey = collections.find((c) => c.slug === "roots-on-the-road") ?? collections[0];
  const journeyPhoto = banner ?? journey?.cover;

  return (
    <div>
      {/* 1. Hero: the headline beside a real person */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[90rem] lg:grid-cols-[1fr_1.05fr]">
          <div className="flex flex-col justify-center px-6 pb-14 pt-14 sm:px-10 sm:pt-20 lg:py-24 lg:pl-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] lg:pr-16">
            <h1 className="font-display text-[2.9rem] leading-[1.02] text-ink sm:text-[4rem] xl:text-[4.6rem]">
              Food doesn&rsquo;t just come from somewhere. It comes from someone.
            </h1>
            <p className="mt-7 max-w-md text-[18px] leading-relaxed text-ink-soft">
              We&rsquo;re mapping the people, places, and ideas shaping the
              future of food.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link href="/portraits" className={primaryButton}>
                Meet the People <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
              <Link href="/about" className={textLink}>
                Our Story
              </Link>
            </div>
          </div>

          {heroPhoto && (
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-warm lg:aspect-auto lg:h-full lg:min-h-[min(calc(100svh-90px),58rem)]">
                <Image
                  src={heroPhoto.url}
                  alt={heroPhoto.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
                />
              </div>
              {hero && (
                <figcaption className="px-6 py-4 text-[13px] italic text-ink-soft sm:px-10 lg:absolute lg:bottom-0 lg:left-0 lg:bg-paper lg:px-6 lg:py-3">
                  {hero.alt}
                </figcaption>
              )}
              {heroPerson && (
                <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-6 py-4 sm:px-10 lg:absolute lg:bottom-0 lg:left-0 lg:bg-paper lg:px-6 lg:py-4">
                  <span className="font-mono text-[10.5px] uppercase text-ink-soft">
                    {heroPerson.name} &middot; {heroPerson.orgName ?? place(heroPerson)}
                  </span>
                  <Link
                    href={`/roots/${heroPerson.slug}`}
                    className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase text-ink hover:text-moss"
                  >
                    Read the portrait <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </section>

      {/* 2. What Roots does, in four ideas */}
      <section className="border-b border-line bg-paper-warm">
        <ul className="mx-auto grid max-w-6xl gap-x-10 gap-y-8 px-6 py-12 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
          {ideas.map(({ title, body, Icon }) => (
            <li key={title} className="flex gap-4">
              <Icon className="mt-1 h-6 w-6 shrink-0 text-moss" aria-hidden />
              <div>
                <p className="font-display text-2xl leading-tight text-ink">{title}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Meet the People */}
      {people.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="section-label">The portraits</p>
              <h2 className="mt-4 font-display text-4xl text-ink sm:text-[3.4rem]">Meet the People</h2>
              <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
                Farmers, cooks, educators, organizers, and everyday
                changemakers shaping a more rooted food system.
              </p>
            </div>
            <Link href="/portraits" className={textLink}>
              Explore All Portraits <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-14">
            {people.length === 1 ? (
              <FeatureCard root={people[0]} />
            ) : (
              <div
                className={`grid gap-x-8 gap-y-16 sm:grid-cols-2 ${people.length >= 3 ? "lg:grid-cols-3" : ""}`}
              >
                {people.map((r) => (
                  <PersonCard
                    key={r.slug}
                    root={r}
                    sizes={
                      people.length >= 3
                        ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        : "(min-width: 640px) 50vw, 100vw"
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Explore by theme -- only themes that have stories behind them */}
      {showThemes && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
            <p className="section-label">Explore by theme</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl text-ink sm:text-5xl">
              Ways into the archive.
            </h2>
            <ul className={`mt-12 grid gap-6 ${themeGridCols[Math.min(liveThemes.length, 4)]}`}>
              {liveThemes.map(({ theme, count, photo }) => (
                <li key={theme.slug}>
                  <Link
                    href={`/portraits?theme=${theme.slug}`}
                    className={`group relative block overflow-hidden bg-moss-deep ${
                      liveThemes.length <= 2 ? "aspect-[4/3]" : "aspect-[3/4]"
                    }`}
                  >
                    {photo?.photoUrl ? (
                      <Image
                        src={photo.photoUrl}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <LeafIcon className="absolute right-6 top-6 h-10 w-10 text-wheat/70" aria-hidden />
                    )}
                    <div className="absolute inset-x-3 bottom-3 bg-paper p-5">
                      <p className="font-display text-2xl leading-tight text-ink group-hover:text-moss">
                        {theme.title}
                      </p>
                      <p className="mt-1.5 text-[14px] leading-snug text-ink-soft">{theme.blurb}</p>
                      <p className="mt-3 font-mono text-[10px] uppercase text-moss">
                        {count} {count === 1 ? "portrait" : "portraits"} &rarr;
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {comingThemes.length > 0 && (
              <p className="mt-8 text-[14px] italic text-ink-soft">
                More themes open as the archive grows:{" "}
                {comingThemes.map((t) => t.title).join(", ")}.
              </p>
            )}
          </div>
        </section>
      )}

      {/* 5. The map */}
      <ArchiveStats roots={roots} />
      <section className="border-t border-line bg-sage">
        <div
          className={`mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28 ${
            mapIsFull ? "" : "grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16"
          }`}
        >
          <div
            className={mapIsFull ? "grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end" : ""}
          >
            <div className="max-w-2xl">
              <p className="section-label">The map</p>
              <h2 className="mt-4 font-display text-4xl text-ink sm:text-[3.4rem]">
                A National Portraits Project
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
                Explore stories from across the country, from rural towns to
                urban neighborhoods, from farms and fisheries to kitchens and
                classrooms.
              </p>
            </div>
            <Link href="/map" className={`${primaryButton} ${mapIsFull ? "self-end" : "mt-8"}`}>
              Explore the Map <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className={mapIsFull ? "mt-12" : ""}>
            <MapSnapshot roots={roots} showFooter={false} linkPins />
            <p className="mt-4 font-mono text-[10.5px] uppercase text-ink-soft">
              Every pin is a real person and their story.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Contribute: three levels of involvement */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
          <div className="max-w-2xl">
            <p className="section-label">Contribute</p>
            <h2 className="mt-4 font-display text-4xl text-ink sm:text-[3.4rem]">
              Who should we meet next?
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
              Know someone with a story worth telling? There are many ways to
              get involved, from a simple nomination to creating a portrait
              yourself.
            </p>
          </div>
          <ol className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
            <li className="flex flex-col bg-paper p-8">
              <p className="font-mono text-[10px] uppercase text-moss">01 &middot; The simplest way</p>
              <p className="mt-4 font-display text-3xl text-ink">Nominate</p>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">
                Share the name of someone whose story we should know.
              </p>
              <Link href="/add?for=other&path=quick" className={`${primaryButton} mt-8 self-start`}>
                Nominate someone <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </li>
            <li className="flex flex-col bg-paper p-8">
              <p className="font-mono text-[10px] uppercase text-moss">02 &middot; More involved</p>
              <p className="mt-4 font-display text-3xl text-ink">Create</p>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">
                Tell a story from your community and help document
                someone&rsquo;s portrait.
              </p>
              <Link href="/add?path=full" className={`${textLink} mt-8 self-start`}>
                Start a portrait <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </li>
            <li className="flex flex-col bg-paper p-8">
              <p className="font-mono text-[10px] uppercase text-moss">03 &middot; A larger project</p>
              <p className="mt-4 font-display text-3xl text-ink">Build a Collection</p>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">
                Document a place, group, community, or shared question through
                a collection of portraits.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Building a Roots collection")}`}
                className={`${textLink} mt-8 self-start`}
              >
                Get in touch <ArrowRightIcon className="h-3.5 w-3.5" />
              </a>
            </li>
          </ol>
          <div className="mt-8">
            <ShareButton
              title="Roots"
              text="Portraits of the people shaping America's food future."
              className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase text-ink-soft underline decoration-line underline-offset-4 hover:text-moss"
            />
          </div>
        </div>
      </section>

      {/* 7. Roots on the Road: where it began */}
      {journey && (
        <section className="border-t border-line bg-paper-warm">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:px-10 sm:py-24 md:grid-cols-[1.2fr_1fr] md:gap-16">
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden bg-paper">
                {journeyPhoto && (
                  <Image
                    src={journeyPhoto.url}
                    alt={journeyPhoto.alt}
                    fill
                    sizes="(min-width: 768px) 55vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              {banner?.alt && (
                <figcaption className="mt-3 text-[13px] italic text-ink-soft">{banner.alt}</figcaption>
              )}
            </figure>
            <div>
              <p className="section-label">Where it began</p>
              <h2 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Roots on the Road</h2>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-soft">
                It began with a simple idea: to travel across the country by
                bike, meet the people behind our food, and listen. That journey
                sparked ROOTS, and a growing national collection of stories.
              </p>
              <Link href={`/collections/${journey.slug}`} className={`${textLink} mt-8`}>
                Explore the Journey <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 8. Newsletter (the footer's own signup is hidden on this page) */}
      <section className="border-b border-paper/15 bg-moss-deep text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 sm:px-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-4xl leading-tight">Stay in the loop.</h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-paper/75">
              Get new stories, project updates, and ways to get involved
              delivered to your inbox.
            </p>
          </div>
          <EmailSignupForm />
        </div>
      </section>
    </div>
  );
}
