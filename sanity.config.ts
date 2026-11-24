import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId: projectId || "",
  dataset,
  schema: { types: schemaTypes },
  document: {
    // "Homepage photos" is a single document -- hide it from the "new document" menu.
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== "homepage"),
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
