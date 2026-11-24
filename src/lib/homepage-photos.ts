// The two big landing-page banners. Both are editable in Studio under
// "Homepage photos". Until a top banner is uploaded there, it falls back to
// the Everett Farms crew trip photo. The bottom photo sits beside the
// "Where it started" text (4:3); without one, that section is a plain band.

import type { Image } from "sanity";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { homepagePhotosQuery } from "@/sanity/queries";

export type BannerPhoto = { url: string; alt: string };

type SanityBanner = Image & { alt?: string };

type HomepageDoc = {
  home?: { heroImage?: SanityBanner; bannerImage?: SanityBanner } | null;
  fallback?: { image?: Image; caption?: string } | null;
};

// "The crew at Everett Farms" -- the only wide trip photo so far.
const FALLBACK_HERO_ID = "N6YrtqhBxp84DVEIXUasbc";

function wide(image: Image | undefined, width: number, height: number) {
  if (!image?.asset) return undefined;
  return urlForImage(image)?.width(width).height(height).fit("crop").auto("format").url();
}

export async function getHomepagePhotos(): Promise<{
  hero?: BannerPhoto;
  banner?: BannerPhoto;
}> {
  if (!client) return {};
  const doc = await client.fetch<HomepageDoc>(homepagePhotosQuery, {
    fallbackId: FALLBACK_HERO_ID,
  });

  const heroSource = doc.home?.heroImage?.asset ? doc.home.heroImage : doc.fallback?.image;
  const heroUrl = wide(heroSource, 2400, 1200);
  const heroAlt =
    doc.home?.heroImage?.alt || doc.fallback?.caption || "A photo from the Roots on the Road ride";

  const bannerUrl = doc.home?.bannerImage?.asset
    ? urlForImage(doc.home.bannerImage)?.width(1400).height(1050).fit("crop").auto("format").url()
    : undefined;

  return {
    hero: heroUrl ? { url: heroUrl, alt: heroAlt } : undefined,
    banner: bannerUrl
      ? { url: bannerUrl, alt: doc.home?.bannerImage?.alt || "" }
      : undefined,
  };
}
