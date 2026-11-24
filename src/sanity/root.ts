// Reference Sanity schema for the future CMS integration.
// Not wired up yet -- drop this into a Sanity Studio project's
// schemaTypes and install `next-sanity` to replace src/lib/roots-data.ts
// with a real `sanity.fetch()` call. The shapes match on purpose.

import { defineField, defineType } from "sanity";

export const root = defineType({
  name: "root",
  title: "Root",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Subject name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tier",
      title: "Tier",
      type: "string",
      options: { list: ["quick", "full"] },
      initialValue: "quick",
      description: "Quick Add can be upgraded to Full later -- same document.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Submitted", value: "submitted" },
          { title: "Needs information", value: "needs_info" },
          { title: "Approved", value: "approved" },
          { title: "Published", value: "published" },
          { title: "Declined", value: "declined" },
        ],
      },
      initialValue: "submitted",
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      to: [{ type: "collection" }],
      description: "Which collection this portrait belongs to, e.g. Roots on the Road.",
    }),
    defineField({
      name: "writtenBy",
      title: "Written by",
      type: "string",
      description: "Credit line on the portrait page, e.g. \"Augusta Halle\".",
    }),
    defineField({
      name: "photographedBy",
      title: "Photographed by",
      type: "string",
    }),
    defineField({
      name: "visitedOn",
      title: "Visited / interviewed on",
      type: "date",
    }),
    defineField({
      name: "dek",
      title: "One-line summary under the headline",
      type: "string",
      description: "Optional. Falls back to the \"One line\" field.",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "geopoint",
      title: "Map location",
      type: "geopoint",
      description: "Used to place the pin on the map.",
    }),
    defineField({
      name: "orgName",
      title: "Organization / farm name",
      type: "string",
      description:
        "Shown in place of city/state on the portrait page, e.g. \"Hungry World Farm\".",
    }),
    defineField({
      name: "connection",
      title: "Connection to the food system",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          "Farmer",
          "Cook",
          "Distributor",
          "Educator",
          "Eater",
          "Other",
        ],
      },
    }),
    defineField({
      name: "oneLine",
      title: "One line",
      type: "string",
      description: "Used for Quick Add and as the card summary everywhere.",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [
        {
          type: "image",
          fields: [{ name: "credit", type: "string", title: "Photo credit" }],
        },
      ],
    }),
    defineField({
      name: "audio",
      title: "Audio clip",
      type: "file",
      options: { accept: "audio/*" },
      description: "Optional \"in their own words\" recording for the portrait page.",
    }),
    defineField({
      name: "audioCaption",
      title: "Audio caption",
      type: "string",
    }),
    defineField({
      name: "story",
      title: "The story",
      type: "array",
      of: [{ type: "block" }],
      description: "The one canonical story. Suggested ~600 words, flexible.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "submittedBy",
      title: "Submitted by",
      type: "string",
    }),
    defineField({
      name: "consentGiven",
      title: "Consent to publish",
      type: "boolean",
    }),
    defineField({
      name: "contact",
      title: "Contact (private)",
      type: "string",
      description: "For follow-up only. Never rendered on the public site.",
    }),
    defineField({
      name: "openToConnect",
      title: "Open to connect",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "updates",
      title: "Updates",
      type: "array",
      of: [{ type: "update" }],
      description: "Short, dated additions to the story over time.",
    }),
  ],
});
