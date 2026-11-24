// Values are optional here (not asserted) so the app can fall back to the
// local placeholder data in src/lib/roots-data.ts until a real Sanity
// project is configured. See README.md for setup steps.

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export const isSanityConfigured = Boolean(projectId);
