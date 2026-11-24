import { defineField, defineType } from "sanity";

// Loose trip/road photos for the homepage "How We Got Here" section --
// not tied to any one person's story, just the ride itself.
export const tripPhoto = defineType({
  name: "tripPhoto",
  title: "Trip photo",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional -- shown as alt text.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers show first. Ties broken by upload date.",
    }),
  ],
  preview: {
    select: { title: "caption", media: "image" },
    prepare: ({ title, media }) => ({ title: title || "Untitled trip photo", media }),
  },
});
