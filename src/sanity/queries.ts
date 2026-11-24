// GROQ projections shaped to match src/lib/roots-data.ts's Root type,
// so src/lib/roots.ts can map a Sanity doc straight onto it.

const rootProjection = `{
  "slug": slug.current,
  name,
  tier,
  city,
  state,
  orgName,
  connection,
  oneLine,
  quote,
  story,
  tags,
  submittedBy,
  openToConnect,
  photos,
  "audioRef": audio.asset._ref,
  audioCaption,
  "lon": geopoint.lng,
  "lat": geopoint.lat,
  updates,
  "publishedAt": _createdAt,
  "collectionSlug": collection->slug.current,
  "collectionTitle": collection->title,
  writtenBy,
  photographedBy,
  visitedOn,
  dek
}`;

const collectionProjection = `{
  "slug": slug.current,
  title,
  subtitle,
  dates,
  route,
  intro,
  coverImage,
  gallery,
  "rootSlugs": *[_type == "root" && status == "published" && references(^._id)].slug.current
}`;

export const collectionsQuery = `*[_type == "collection"] | order(coalesce(order, 999) asc, title asc) ${collectionProjection}`;

export const collectionBySlugQuery = `*[_type == "collection" && slug.current == $slug][0] ${collectionProjection}`;

export const publishedRootsQuery = `*[_type == "root" && status == "published"] | order(name asc) ${rootProjection}`;

export const rootBySlugQuery = `*[_type == "root" && slug.current == $slug][0] ${rootProjection}`;

export const allSlugsQuery = `*[_type == "root" && status == "published"].slug.current`;

// The homepage banner photos, plus a fallback trip photo for the top
// banner until a dedicated one is uploaded.
export const homepagePhotosQuery = `{
  "home": *[_id == "homepage"][0]{ heroImage, bannerImage },
  "fallback": *[_id == $fallbackId][0]{ image, caption }
}`;

export const tripPhotosQuery = `*[_type == "tripPhoto"] | order(order asc, _createdAt asc){
  _id,
  image,
  caption
}`;
