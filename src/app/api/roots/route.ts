import { NextRequest, NextResponse } from "next/server";
import { getWriteClient } from "@/sanity/client";
import { field, isBot, MAX_PHOTOS, MAX_PHOTO_BYTES } from "@/lib/form-guard";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

async function geocode(city: string, state: string) {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("city", city);
    url.searchParams.set("state", state);
    url.searchParams.set("country", "USA");
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    const res = await fetch(url, {
      headers: { "User-Agent": "roots-on-the-road-site/1.0" },
    });
    if (!res.ok) return null;
    const results = (await res.json()) as { lat: string; lon: string }[];
    if (!results[0]) return null;
    return { lat: Number(results[0].lat), lng: Number(results[0].lon) };
  } catch {
    return null;
  }
}

function toPortableText(text: string) {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => ({
      _type: "block",
      _key: randomKey(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: randomKey(), text: p, marks: [] }],
    }));
}

export async function POST(request: NextRequest) {
  const client = getWriteClient();
  if (!client) {
    return NextResponse.json(
      {
        error:
          "Sanity isn't configured yet. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.",
      },
      { status: 503 }
    );
  }

  const form = await request.formData();
  if (isBot(form)) {
    return NextResponse.json({ ok: true });
  }

  const name = field(form, "name", 200);
  const city = field(form, "city", 200);
  const state = field(form, "state", 200);
  const quote = field(form, "quote", 1000);
  const contact = field(form, "contact", 200);

  if (!name || !city || !state || !quote || !contact) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const submittedBy = field(form, "submittedBy", 200);
  const oneLine = field(form, "oneLine", 1000);
  const storyText = field(form, "story", 20000);
  const tier = storyText ? "full" : "quick";
  const connection = form.getAll("connection").map((v) => v.toString().slice(0, 100)).slice(0, 20);
  const tags = form.getAll("tags").map((v) => v.toString().slice(0, 100)).slice(0, 20);
  const openToConnect = form.get("openToConnect") === "on";

  const photoFiles = form
    .getAll("photo")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (photoFiles.length > MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Please attach at most ${MAX_PHOTOS} photos.` },
      { status: 400 }
    );
  }
  for (const file of photoFiles) {
    if (!file.type.startsWith("image/") || file.size > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: "Photos must be image files under 10 MB each." },
        { status: 400 }
      );
    }
  }

  const photos = [];
  for (const file of photoFiles) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });
    photos.push({
      _type: "image",
      _key: randomKey(),
      asset: { _type: "reference", _ref: asset._id },
    });
  }

  const coords = await geocode(city, state);

  const baseSlug = slugify(name) || "root";
  let slug = baseSlug;
  let suffix = 2;
  while (
    await client.fetch<number>(`count(*[_type == "root" && slug.current == $slug])`, { slug })
  ) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const doc = await client.create({
    _type: "root",
    name,
    slug: { _type: "slug", current: slug },
    tier,
    status: "submitted",
    city,
    state,
    geopoint: coords ? { _type: "geopoint", lat: coords.lat, lng: coords.lng } : undefined,
    connection,
    oneLine: oneLine ?? quote,
    quote,
    story: storyText ? toPortableText(storyText) : undefined,
    tags,
    submittedBy,
    consentGiven: true,
    contact,
    openToConnect,
    photos,
  });

  return NextResponse.json({ ok: true, id: doc._id });
}
