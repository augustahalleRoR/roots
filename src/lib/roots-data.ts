// This file stands in for Sanity as the content source for now.
// The shape here mirrors the schema in src/sanity/schemaTypes, so swapping
// this out for a real `sanity.fetch` call later is a drop-in change --
// nothing in the page components needs to know the difference.

export type RootTier = "quick" | "full";

export type RootUpdate = {
  date: string; // ISO date
  note: string;
};

export type Root = {
  slug: string;
  name: string;
  tier: RootTier;
  city: string;
  state: string;
  orgName?: string; // e.g. "Hungry World Farm" -- shown instead of city/state when present
  connection: string[]; // e.g. ["Farmer", "Educator"]
  oneLine: string;
  quote: string;
  story?: string[]; // paragraphs
  tags: string[];
  submittedBy?: string;
  openToConnect: boolean;
  photoAlt: string;
  photoUrl?: string; // populated once Sanity is wired up; falls back to the placeholder box
  audioUrl?: string; // optional "in their own words" clip
  audioCaption?: string;
  lon: number;
  lat: number;
  updates: RootUpdate[];
  publishedAt?: string; // ISO date, used to sort "recently added"
  collectionSlug?: string; // e.g. "roots-on-the-road"
  collectionTitle?: string;
  writtenBy?: string;
  photographedBy?: string;
  writtenOn?: string; // ISO date
  visitedOn?: string; // ISO date
  dek?: string; // one-line summary under the headline
};

export const roots: Root[] = [
  {
    slug: "sam-ingersoll",
    name: "Sam Ingersoll",
    collectionSlug: "roots-on-the-road",
    collectionTitle: "Roots on the Road",
    tier: "full",
    city: "Tiskilwa",
    state: "IL",
    orgName: "Hungry World Farm",
    connection: ["Farmer", "Nonprofit Leader"],
    oneLine:
      "Runs Hungry World Farm, a working farm and teaching community built on the land his own family once farmed.",
    quote: "It's not about the cow. It's about the how.",
    tags: ["Regenerative Agriculture", "Food Education", "Community Building"],
    submittedBy: "Roots on the Road",
    openToConnect: true,
    photoAlt: "Sam Ingersoll standing in a field at Hungry World Farm",
    lon: -89.6104,
    lat: 41.2953,
    story: [
      "That's Sam Ingersoll's answer when you ask him what he's actually building at Hungry World Farm. And while he may not have cows, he embodies this ideal in every other way possible. Spending a day and night at his farm, which is a humble thing to call it, rather it's a sprawling community, we had the opportunity to see how systems and processes inform all the work they're doing.",
      "Sam's roots are agricultural in the most literal sense. He grew up on a farm in Washington state, and by his own account, couldn't wait to get off it. After high school he went east to Yale, then into financial services and tech consulting, where he picked up, of all things, a new language. Not the kind you're thinking, not Chinese, not Spanish, but the language of business. Sam learned how to market in a way that actually engages people, how to read a spreadsheet at a glance, and a handful of other financial skills most farmers never get the chance to learn.",
      "But the more time he spent in the corporate world, the more he felt pulled back to his roots. So he pivoted, taking a marketing job at a small organic dairy built by Amish and Mennonite farmers in the area. This job let him draw on his \"language\" skills, speaking both farming and finance at once. And then, in the funny way fate tends to work, his final pivot landed him right back at the start. Sam found himself on the board of Hungry World Farm, the very nonprofit now running the land his own family had once farmed.",
      "I, along with five friends, had the opportunity to rest, reset, and observe his new life as we biked across America. Though I'd challenge my use of the word \"observe,\" as we became part of the community for the brief time we spent there. Sam uses food and fellowship as a vehicle to teach about regenerative farming. Mushrooms grow in one corner, sheep rotate through another, families wander in for a taste of agritourism, and somehow Sam has stitched it all together into something that runs less like a farm and more like a small, thoughtfully built community. He'll talk margins and cash flow with you one minute and soil health the next, because to him the two were never really separate. Anyone can love the land, he'll tell you. Fewer people know how to keep a farm standing long enough for that love to grow across communities.",
      "So that philosophy, finding the intersection of sustainability and profitability, now runs the whole operation: the eco-tours and workshops, the Harvest Days in the Market Garden, the internships, the overnight stays. Education isn't an add-on here. It's built into the architecture, or rather, it is the very foundation of the farm.",
      "What makes Sam's optimism worth paying attention to is its discipline and realism. He's always testing something new, another workshop, another way to bring people onto the land, but he never lets ambition outrun what the farm can actually sustain. It's a kind of hope that, from a student perspective, does its homework first. And that's exactly the kind of story we set out looking for on this ride. Not some far-off, utopian vision of what farming could be, but real, working proof that it already is. Sam is one patch in a much bigger quilt we're stitching together, farm by farm, conversation by conversation, and if his story does its job, maybe it convinces someone else, wherever they are, that they can be a patch in it too.",
    ],
    updates: [],
  },
];

export function getRoot(slug: string) {
  return roots.find((r) => r.slug === slug);
}
