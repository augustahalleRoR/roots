import { defineField, defineType } from "sanity";

// A collection groups portraits gathered together -- a trip, a season, a
// place, a partner project. Modeled on how oral-history archives group
// interviews by project. Roots on the Road is the first one.
export const collection = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subtitle",
      title: "One-line summary",
      type: "string",
      description: "Shown under the title, e.g. \"Six friends. 3,700 miles. Countless stories along the way.\"",
    }),
    defineField({
      name: "dates",
      title: "When",
      type: "string",
      description: "Free text, e.g. \"May–August 2026\".",
    }),
    defineField({
      name: "route",
      title: "Where",
      type: "string",
      description: "Free text, e.g. \"Seattle, WA to Washington, DC\".",
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "coverImage",
      title: "Cover photo",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Describe the photo", type: "string" })],
    }),
    defineField({
      name: "gallery",
      title: "Photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Describe the photo", type: "string" })],
        },
      ],
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers show first on the Collections page.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "dates", media: "coverImage" },
  },
});
