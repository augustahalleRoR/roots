import { notFound } from "next/navigation";
import Link from "next/link";
import { getRootBySlug } from "@/lib/roots";
import { ConnectForm } from "@/components/connect-form";

export default async function ConnectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const root = await getRootBySlug(slug);
  if (!root) notFound();

  return (
    <section className="mx-auto max-w-xl px-6 py-14 sm:px-10">
      <Link
        href={`/roots/${root.slug}`}
        className="font-mono text-[12px] uppercase tracking-wide text-ink-soft hover:text-ink"
      >
        &larr; Back to {root.name.split(" ")[0]}&rsquo;s story
      </Link>
      <h1 className="mt-4 font-display text-3xl text-ink">
        Request an introduction to {root.name}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        Tell us a bit about yourself and why you&rsquo;d like to connect.
        We&rsquo;ll pass your note along, we never share contact info
        directly.
      </p>
      <ConnectForm rootSlug={root.slug} />
    </section>
  );
}
