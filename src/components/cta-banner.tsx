import Link from "next/link";

// The pull-quote + CTA band that sits above the footer, echoing the
// mockup's dark banner without borrowing its copy.
export function CtaBanner() {
  return (
    <section className="bg-moss-deep py-16 text-paper">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
        <p className="font-display text-2xl italic leading-snug sm:text-3xl">
          &ldquo;Every portrait adds to a fuller picture of where our food
          comes from.&rdquo;
        </p>
        <Link
          href="/add"
          className="mt-8 inline-block rounded-sm bg-paper px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-moss-deep transition-colors hover:bg-wheat hover:text-ink"
        >
          Add a story
        </Link>
      </div>
    </section>
  );
}
