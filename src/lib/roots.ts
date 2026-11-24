// The real data layer. Fetches published Roots from Sanity when a project
// is configured (NEXT_PUBLIC_SANITY_PROJECT_ID set); otherwise falls back
// to the local placeholder data in roots-data.ts so the site still works
// before Sanity is wired up.

import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { urlForFile } from "@/sanity/file";
import { publishedRootsQuery, rootBySlugQuery } from "@/sanity/queries";
import {
  roots as fallbackRoots,
  getRoot as getFallbackRoot,
  type Root,
} from "@/lib/roots-data";

type SanityPhoto = {
  _type: "image";
  asset?: { _ref: string; _type: string };
  credit?: string;
};

type PortableTextBlock = {
  _type: string;
  children?: { text?: string }[];
};

type SanityRootDoc = {
  slug: string;
  name: string;
  tier?: "quick" | "full";
  city: string;
  state: string;
  orgName?: string;
  connection?: string[];
  oneLine?: string;
  quote?: string;
  story?: PortableTextBlock[];
  tags?: string[];
  submittedBy?: string;
  openToConnect?: boolean;
  photos?: SanityPhoto[];
  audioRef?: string;
  audioCaption?: string;
  lon?: number;
  lat?: number;
  updates?: { date: string; note: string }[];
  publishedAt?: string;
  collectionSlug?: string;
  collectionTitle?: string;
  writtenBy?: string;
  photographedBy?: string;
  visitedOn?: string;
  dek?: string;
};

export function blocksToParagraphs(blocks?: PortableTextBlock[]): string[] {
  if (!blocks) return [];
  return blocks
    .filter((b) => b._type === "block")
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .filter(Boolean);
}

function mapSanityRoot(doc: SanityRootDoc): Root {
  const photo = doc.photos?.[0];
  return {
    slug: doc.slug,
    name: doc.name,
    tier: doc.tier ?? "quick",
    city: doc.city,
    state: doc.state,
    orgName: doc.orgName,
    connection: doc.connection ?? [],
    oneLine: doc.oneLine ?? "",
    quote: doc.quote ?? "",
    story: blocksToParagraphs(doc.story),
    tags: doc.tags ?? [],
    submittedBy: doc.submittedBy,
    openToConnect: doc.openToConnect ?? false,
    photoAlt: `Photo of ${doc.name}`,
    photoUrl: photo ? urlForImage(photo)?.width(1200).url() : undefined,
    audioUrl: urlForFile(doc.audioRef),
    audioCaption: doc.audioCaption,
    publishedAt: doc.publishedAt,
    lon: doc.lon ?? 0,
    lat: doc.lat ?? 0,
    updates: doc.updates ?? [],
    collectionSlug: doc.collectionSlug ?? undefined,
    collectionTitle: doc.collectionTitle ?? undefined,
    writtenBy: doc.writtenBy ?? undefined,
    photographedBy: doc.photographedBy ?? undefined,
    visitedOn: doc.visitedOn ?? undefined,
    dek: doc.dek ?? undefined,
  };
}

export async function getRoots(): Promise<Root[]> {
  if (!client) return fallbackRoots;
  const docs = await client.fetch<SanityRootDoc[]>(publishedRootsQuery);
  return docs.map(mapSanityRoot);
}

export async function getRootBySlug(slug: string): Promise<Root | undefined> {
  if (!client) return getFallbackRoot(slug);
  const doc = await client.fetch<SanityRootDoc | null>(rootBySlugQuery, { slug });
  return doc ? mapSanityRoot(doc) : undefined;
}
