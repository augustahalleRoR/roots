import { defineField, defineType } from "sanity";

// A single document (id "homepage") holding the two big banner photos on
// the landing page. Swap a photo here and it's live within a minute --
// no code change or redeploy needed.
const bannerImage = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Describe the photo",
        type: "string",
        description: "For screen readers, e.g. \"Sam Ingersoll in a field at Hungry World Farm\".",
      }),
    ],
  });

export const homepage = defineType({
  name: "homepage",
  title: "Homepage photos",
  type: "document",
  fields: [
    bannerImage(
      "heroImage",
      "Top banner photo",
      "Optional. A large photo of a person, shown tall beside the headline at the top of the homepage (cropped to roughly 8:9). Leave empty to use the Everett Farms crew photo from the ride. Click the crop icon to set the focus point on the person's face."
    ),
    bannerImage(
      "bannerImage",
      "Bottom photo (Where it started)",
      "A photo from the ride, shown beside the Roots on the Road text and cropped to 4:3. Group shots work well. The description below doubles as the visible caption, e.g. \"Stephen, Augusta, and Molly at UVA's Morven Farm\"."
    ),
  ],
  preview: {
    prepare: () => ({ title: "Homepage photos" }),
  },
});
