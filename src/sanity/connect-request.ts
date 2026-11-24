import { defineField, defineType } from "sanity";

export const connectRequest = defineType({
  name: "connectRequest",
  title: "Connect request",
  type: "document",
  fields: [
    defineField({
      name: "root",
      title: "About",
      type: "reference",
      to: [{ type: "root" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "email", title: "Email", type: "string", validation: (r) => r.required() }),
    defineField({ name: "note", title: "Note", type: "text", rows: 4 }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["new", "forwarded", "closed"] },
      initialValue: "new",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "email" },
  },
});
