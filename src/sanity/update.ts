import { defineField, defineType } from "sanity";

export const update = defineType({
  name: "update",
  title: "Update",
  type: "object",
  fields: [
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "note", title: "Note", type: "text", rows: 2 }),
  ],
});
