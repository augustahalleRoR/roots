// The public URL of the site, used for canonical links, the sitemap, and
// social-share previews. Set NEXT_PUBLIC_SITE_URL once the domain is live;
// until then it falls back to the Vercel production URL, then localhost.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
