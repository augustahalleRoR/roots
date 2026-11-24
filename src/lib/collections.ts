// Collections group portraits gathered together (a trip, a season, a
// partner project). Fetched from Sanity; falls back to a single local
// "Roots on the Road" collection when Sanity isn't configured.

import type { Image } from "sanity";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { collectionBySlugQuery, collectionsQuery } from "@/sanity/queries";
import { blocksToParagraphs, getRoots } from "@/lib/roots";
import type { Root } from "@/lib/roots-data";

export type CollectionPhoto = { url: string; alt: string };

export type Collection = {
  slug: string;
  title: string;
  subtitle?: string;
  dates?: string;
  route?: string;
  intro: string[];
  cover?: CollectionPhoto;
  gallery: CollectionPhoto[];
  rootSlugs: string[];
};

type SanityImage = Image & { alt?: string };

type SanityCollectionDoc = {
  slug: string;
  title: string;
  subtitle?: string;
  dates?: string;
  route?: string;
  intro?: { _type: string; children?: { text?: string }[] }[];
  coverImage?: SanityImage;
  gallery?: SanityImage[];
  rootSlugs?: string[];
};

const fallbackCollections: Collection[] = [
  {
    slug: "roots-on-the-road",
    title: "Roots on the Road",
    subtitle: "Six friends. 3,700 miles. Countless stories along the way.",
    intro: [],
    gallery: [],
    rootSlugs: ["sam-ingersoll"],
  },
];

function photo(img: SanityImage | undefined, w: number, h: number, fallbackAlt: string) {
  if (!img?.asset) return undefined;
  const url = urlForImage(img)?.width(w).height(h).fit("crop").auto("format").url();
  return url ? { url, alt: img.alt || fallbackAlt } : undefined;
}

function mapCollection(doc: SanityCollectionDoc): Collection {
  return {
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle,
    dates: doc.dates,
    route: doc.route,
    intro: blocksToParagraphs(doc.intro),
    cover: photo(doc.coverImage, 2000, 1125, doc.title),
    gallery: (doc.gallery ?? [])
      .map((g) => photo(g, 900, 900, `A photo from ${doc.title}`))
      .filter((g): g is CollectionPhoto => Boolean(g)),
    rootSlugs: doc.rootSlugs ?? [],
  };
}

export async function getCollections(): Promise<Collection[]> {
  if (!client) return fallbackCollections;
  const docs = await client.fetch<SanityCollectionDoc[]>(collectionsQuery);
  return docs.map(mapCollection);
}

export async function getCollection(
  slug: string
): Promise<{ collection: Collection; roots: Root[] } | undefined> {
  let collection: Collection | undefined;
  if (!client) {
    collection = fallbackCollections.find((c) => c.slug === slug);
  } else {
    const doc = await client.fetch<SanityCollectionDoc | null>(collectionBySlugQuery, { slug });
    collection = doc ? mapCollection(doc) : undefined;
  }
  if (!collection) return undefined;
  const all = await getRoots();
  const roots = all.filter(
    (r) => r.collectionSlug === slug || collection!.rootSlugs.includes(r.slug)
  );
  return { collection, roots };
}
