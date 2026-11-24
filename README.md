# Roots

A living archive of the people shaping America's food system, grown out of
Roots on the Road.

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Without Sanity configured, the site runs
on the local placeholder data in `src/lib/roots-data.ts`.

### Wiring up Sanity (the CMS)

1. `npx sanity login` (opens a browser to sign in), then `npx sanity init
   --project <name> --dataset production` inside this folder, or create a
   project at [sanity.io/manage](https://sanity.io/manage) directly.
2. Copy `.env.local.example` to `.env.local` and fill in
   `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
3. In sanity.io/manage → API → Tokens, create a token with **Editor**
   permission and set it as `SANITY_API_TOKEN` in `.env.local` (this is
   what lets the Add a Story form write documents).
4. Restart `npm run dev`. The site now fetches published Roots from
   Sanity instead of the local file, and `/studio` opens an embedded
   Sanity Studio (schema lives in `src/sanity/root.ts` and `update.ts`)
   where you can review submissions and flip `status` to `published`.

Pages currently built:

- `/` — homepage
- `/map` — the map, with a Map / Search toggle
- `/roots/sam-ingersoll` — a sample Root portrait page
- `/add` — the Add a Story form (Quick Add / Full Portrait)
- `/roots/[slug]/connect` — the "request an introduction" flow

## What's real vs. placeholder right now

**Real:**
- The design system (colors, type, the stitched quilt-card motif) in
  `src/app/globals.css`
- The US map: built with `d3-geo` + `us-atlas`, which ships real
  geographic data as an npm package, so it renders an accurate map with no
  Mapbox account or API key needed. Pins are projected from real
  lat/lon coordinates.
- Sam Ingersoll's portrait page, using the actual text from the
  submission doc
- Sanity integration (`src/lib/roots.ts`, `src/sanity/`): once a project
  is configured (see above), `/` and `/map` fetch published Roots for
  real, `/roots/[slug]` fetches by slug, and `/studio` is an embedded
  Sanity Studio for reviewing submissions. Photos upload to and render
  from Sanity's CDN. Until a project is configured, everything falls
  back to `src/lib/roots-data.ts` so local dev still works.
- The Add a Story form posts to `src/app/api/roots/route.ts`, which
  uploads any photos and creates a `root` document with
  `status: "submitted"` for review in Studio (requires
  `SANITY_API_TOKEN`, see above)

**Placeholder / not wired up yet:**
- New submissions don't have map coordinates (`geopoint`) — set that
  manually in Studio when approving a submission
- Domain isn't purchased / site isn't deployed to Vercel yet

## Next steps, in a reasonable order

1. **Buy the domain** and point it at Vercel.
2. **Deploy to Vercel.** Add the same `NEXT_PUBLIC_SANITY_PROJECT_ID`,
   `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`, and (once the domain is
   live) `NEXT_PUBLIC_SITE_URL` as environment variables in the Vercel project settings. `next/font/google` and any
   real Mapbox tiles you add later will work fine there since Vercel has
   normal internet access — the self-hosted fonts and offline map here
   were built to also work in network-restricted environments like this
   one, but nothing about them is required once you're on Vercel.
3. **Add the next few Roots** as they're ready, either through `/add` or
   directly in `/studio`.

## Launch checklist

- In sanity.io/manage → API → CORS origins, add the production domain
  (with credentials allowed) so `/studio` works there.
- Set the env vars above in Vercel (Production + Preview).
- After deploying, check `/robots.txt`, `/sitemap.xml`, and paste a page
  URL into a link-preview checker to confirm the share image shows up.
- Public forms have a hidden honeypot field plus length/photo-size limits;
  photos are downscaled in the browser to stay under Vercel's 4.5 MB
  request limit.
