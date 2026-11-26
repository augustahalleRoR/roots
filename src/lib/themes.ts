// Themes: browse the archive by idea instead of by person.
// A theme is not its own page or Sanity document -- it's a filter over the
// portraits' existing tags and "connection" roles, so it can never show a
// story that isn't there. A theme only appears on the homepage once at
// least one published portrait matches it. To add or retune a theme, edit
// the list below.

import type { Root } from "@/lib/roots-data";

export type Theme = {
  slug: string;
  title: string;
  blurb: string;
  // Matched (case-insensitively) against each portrait's tags and roles.
  match: RegExp;
};

export const themes: Theme[] = [
  {
    slug: "food-and-heritage",
    title: "Food & Heritage",
    blurb: "Seeds, recipes, and ways of growing passed down through generations.",
    match: /heritage|indigenous|seed sav|tradition|foodways|\bcultur/i,
  },
  {
    slug: "growing-the-future",
    title: "Growing the Future",
    blurb: "Soil, grazing, and new ways of farming that give back to the land.",
    match: /regenerativ|soil|agroecolog|urban agri|livestock|grazing|aquaculture|fishing|farmer|rancher/i,
  },
  {
    slug: "food-and-community",
    title: "Food & Community",
    blurb: "Feeding neighbors, teaching, and building places to gather around food.",
    match: /communit|justice|access|food education|educator|local & regional/i,
  },
  {
    slug: "behind-every-meal",
    title: "Behind Every Meal",
    blurb: "The cooks, drivers, and distributors who get food from field to table.",
    match: /cook|chef|distribut|truck|supply|food waste|kitchen/i,
  },
];

export function rootMatchesTheme(root: Root, theme: Theme) {
  return [...root.tags, ...root.connection].some((t) => theme.match.test(t));
}

export function getTheme(slug: string | undefined) {
  return themes.find((t) => t.slug === slug);
}
