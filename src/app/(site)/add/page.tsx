import { AddStoryForm } from "@/components/add-story-form";

export const metadata = {
  title: "Add a Story — Roots",
};

export default async function AddPage({
  searchParams,
}: {
  searchParams: Promise<{ for?: string }>;
}) {
  // /add?for=self or /add?for=other preselects the first question, so the
  // homepage's "Tell your own story" / "Add someone to the map" buttons land
  // one step in.
  const { for: who } = await searchParams;
  const initialSubject = who === "self" ? "self" : who === "other" ? "other" : undefined;

  return (
    <section className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
      <p className="section-label">Add someone to the map</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Add a story.</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        Tell us about someone shaping the future of food &mdash; or about
        yourself. A photo, where they are, and one line in their words is
        enough; a longer story is welcome. We read every submission by hand
        and check in before anything goes public.
      </p>

      <div className="mt-10">
        <AddStoryForm initialSubject={initialSubject} />
      </div>
    </section>
  );
}
