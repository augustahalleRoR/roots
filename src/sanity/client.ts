import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, isSanityConfigured } from "./env";

// null until NEXT_PUBLIC_SANITY_PROJECT_ID is set -- callers should check
// isSanityConfigured (or a falsy client) and fall back to local data.
export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === "production",
    })
  : null;

// Separate client for server-side writes (Add a Story submissions).
// Requires SANITY_API_TOKEN with "Editor" or "Create" permissions --
// never expose this token to the browser.
export function getWriteClient() {
  const token = process.env.SANITY_API_TOKEN;
  if (!isSanityConfigured || !token) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}
