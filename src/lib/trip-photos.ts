// Loose trip/road photos for the homepage "How We Got Here" section.
// No local fallback data -- if Sanity isn't configured, the homepage just
// shows its placeholder boxes, same as it did before this existed.

import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { tripPhotosQuery } from "@/sanity/queries";

export type TripPhoto = {
  id: string;
  url: string;
  caption?: string;
};

type SanityTripPhoto = {
  _id: string;
  image?: { _type: "image"; asset?: { _ref: string; _type: string } };
  caption?: string;
};

export async function getTripPhotos(): Promise<TripPhoto[]> {
  if (!client) return [];
  const docs = await client.fetch<SanityTripPhoto[]>(tripPhotosQuery);
  const photos: TripPhoto[] = [];
  for (const doc of docs) {
    const url = doc.image ? urlForImage(doc.image)?.width(600).height(600).url() : undefined;
    if (url) photos.push({ id: doc._id, url, caption: doc.caption });
  }
  return photos;
}
