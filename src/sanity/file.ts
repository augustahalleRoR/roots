import { dataset, projectId } from "./env";

// Sanity file assets aren't served through the image pipeline, so there's
// no builder package for them -- the CDN URL is a deterministic function of
// the asset ref (`file-<id>-<extension>`). See:
// https://www.sanity.io/docs/asset-type#8ec4b62c8ca6
export function urlForFile(ref?: string) {
  if (!projectId || !ref) return undefined;
  const [, id, ext] = ref.split("-");
  if (!id || !ext) return undefined;
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`;
}
