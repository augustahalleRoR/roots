import Link from "next/link";
import Image from "next/image";
import { getTripPhotos } from "@/lib/trip-photos";
import { ArrowRightIcon, BikeIcon } from "@/components/icons";

export const metadata = {
  title: "About — Roots",
  description:
    "Roots is mapping the people, places, and ideas shaping the future of food. It started on Roots on the Road, a 3,700-mile bike ride across America.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const tripPhotos = await getTripPhotos();

  return (
    <div>
      {/* What Roots is */}
      <section className="mx-auto max-w-3xl px-6 pb-14 pt-16 sm:px-10 sm:pt-20">
        <p className="section-label">About Roots</p>
        <h1 className="mt-2 font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
          Food doesn&rsquo;t just come from somewhere. It comes from
          someone.
        </h1>
        <div className="mt-6 space-y-5 text-[18px] leading-relaxed text-ink">
          <p>
            Roots is mapping the people, places, and ideas shaping the
            future of food: farmers, fishers, cooks, truck drivers,
            teachers, neighbors &mdash; anyone growing, making, moving, or
            sharing what we eat, or imagining what comes next.
          </p>
          <p>
            Every portrait is a real person, in their own words, pinned to
            the place they work. Anyone can add someone to the map, including
            themselves. We read every submission by hand and check in before
            anything goes public.
          </p>
        </div>
      </section>

      {/* Roots on the Road -- the trip it grew out of */}
      <section id="roots-on-the-road" className="scroll-mt-20 border-t border-line bg-paper-warm">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-20">
          <p className="section-label flex items-center gap-2">
            <BikeIcon className="h-4 w-4" /> Where it started &middot; Roots on the Road
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
            It started with a bike ride.
          </h2>
          <div className="mt-8 space-y-6 text-[18px] leading-relaxed text-ink">
            <p className="font-medium">
              What is the future of our food system? Fueled by Wendell
              Berry&rsquo;s notion that &ldquo;eating is an agricultural
              act&rdquo; and an unhealthy amount of Uncrustables, six friends
              set out to bike 3,700 miles across America to find out. We
              called the trip Roots on the Road.
            </p>
            <p>
              We thought the answer might be found in the usual places.
              Instead, we found it in conversations. We stopped to talk with
              anyone and everyone who had a hand in food, and the more
              people we met, the clearer it became that the future of food
              isn&rsquo;t something we can predict. It&rsquo;s something
              people are already shaping.
            </p>
            <p>
              Along the way, we found seeds of hope worth paying attention
              to. People are the roots, and strong roots are connected. So
              we&rsquo;re bringing those stories together, connecting the
              people and ideas behind them, and building a clearer picture
              of what could grow next.
            </p>
          </div>

          {tripPhotos.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {tripPhotos.map((photo) => (
                <figure key={photo.id}>
                  <Image
                    src={photo.url}
                    alt={photo.caption || "A photo from the ride"}
                    width={600}
                    height={600}
                    className="aspect-square w-full object-cover"
                  />
                </figure>
              ))}
            </div>
          )}

          <p className="mt-12 font-display text-2xl italic leading-snug text-moss-deep sm:text-3xl">
            Roots on the Road was the first chapter. Roots is what comes
            next: a home for those stories, and for the ones we didn&rsquo;t
            get to ride past.
          </p>
          <a
            href="https://rootsontheroad.squarespace.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wide text-indigo underline decoration-line underline-offset-4 hover:text-ink"
          >
            Follow the trip at Roots on the Road &rarr;
          </a>
        </div>
      </section>

      {/* The ask */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-10">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            Know someone who belongs here?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] leading-relaxed text-ink-soft">
            A photo, where they are, and one line in their words is all it
            takes to start.
          </p>
          <Link
            href="/add"
            className="mt-8 inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-paper transition-colors hover:bg-moss"
          >
            Add a story <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
