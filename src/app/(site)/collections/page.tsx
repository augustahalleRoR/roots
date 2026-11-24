import { redirect } from "next/navigation";

// Roots on the Road is the whole archive for now, so there's no separate
// Collections index -- send anyone who lands here to the journey page.
// (If a second collection is ever added, this can become a list again.)
export default function CollectionsPage() {
  redirect("/collections/roots-on-the-road");
}
