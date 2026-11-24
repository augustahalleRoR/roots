import Image from "next/image";
import { getRoots } from "@/lib/roots";
import { getTripPhotos } from "@/lib/trip-photos";
import {
  getStatePaths,
  getUsMapGeometry,
  projectPoint,
  MAP_VIEWBOX,
} from "@/lib/us-map";
import { MapExplorer } from "@/components/map-explorer";
import { PortraitStrip } from "@/components/portrait-strip";
import { StatRow, Stat } from "@/components/stat-row";
import { UsersIcon, MapPinIcon } from "@/components/icons";

// A specific trip photo (the crew at Everett Farms, WA) used to give this
// otherwise text-only intro some life. Picked by id since captions aren't
// guaranteed unique/stable; see src/lib/trip-photos.ts for the source.
const MAP_HERO_PHOTO_ID = "N6YrtqhBxp84DVEIXUasbc";

export const metadata = {
  title: "The Map — Roots",
};

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>;
}) {
  const [roots, tripPhotos, { theme }] = await Promise.all([
    getRoots(),
    getTripPhotos(),
    searchParams,
  ]);
  const heroPhoto = tripPhotos.find((p) => p.id === MAP_HERO_PHOTO_ID);
  const statePaths = getStatePaths();
  const { outline: nationOutline } = getUsMapGeometry();
  const pins = roots
    .map((root) => {
      const p = projectPoint(root.lon, root.lat);
      return p ? { root, x: p.x, y: p.y } : null;
    })
    .filter((p): p is { root: (typeof roots)[number]; x: number; y: number } =>
      Boolean(p)
    );
  const stateCount = new Set(roots.map((r) => r.state)).size;
  const recentRoots = [...roots]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, 5);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-14 sm:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="section-label">Explore</p>
            <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
              Where the stories are rooted.
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              Every pin is a person, not a place. Click one to meet them, or
              switch to search if you&rsquo;d rather read your way through.
            </p>

            {/* Counts only read as momentum once there are enough of them */}
            {roots.length >= 10 && (
            <div className="mt-8">
              <StatRow>
                <Stat icon={<UsersIcon className="h-5 w-5" />} value={roots.length} label={roots.length === 1 ? "Story" : "Stories"} />
                <Stat icon={<MapPinIcon className="h-5 w-5" />} value={stateCount} label={stateCount === 1 ? "State" : "States"} />
              </StatRow>
            </div>
            )}
          </div>

          {heroPhoto && (
            <div className="w-full shrink-0 sm:w-64">
              <Image
                src={heroPhoto.url}
                alt={heroPhoto.caption || "A photo from the ride"}
                width={400}
                height={300}
                className="aspect-[4/3] w-full rounded-sm object-cover"
              />
              {heroPhoto.caption && (
                <p className="mt-2 text-[13px] leading-snug text-ink-soft">
                  {heroPhoto.caption}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-12 sm:px-10">
        <MapExplorer
          statePaths={statePaths}
          nationOutline={nationOutline}
          pins={pins}
          viewBox={MAP_VIEWBOX}
          initialTheme={theme}
        />
      </section>

      {roots.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-10">
          <p className="font-mono text-[12px] uppercase tracking-wide text-ink-soft">
            Recently added
          </p>
          <div className="mt-4">
            <PortraitStrip roots={recentRoots} minCount={0} carousel />
          </div>
        </section>
      )}
    </div>
  );
}
