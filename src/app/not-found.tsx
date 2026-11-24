import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Page not found — Roots",
};

// Renders outside the (site) layout, so it brings its own styles, header,
// and footer.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink antialiased">
      <SiteHeader />
      <main className="flex-1">
    <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:px-10 sm:py-32">
      <p className="font-mono text-[12px] uppercase tracking-wide text-moss-deep">
        404 &middot; Off the route
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
        We took a wrong turn somewhere.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-ink-soft">
        This page doesn&rsquo;t exist, or it moved. The people are still
        right where we left them.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <Link
          href="/portraits"
          className="bg-ink px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-paper transition-colors hover:bg-moss"
        >
          Meet the people
        </Link>
        <Link
          href="/"
          className="font-mono text-[13px] uppercase tracking-wide text-moss-deep underline decoration-line underline-offset-4 hover:text-ink"
        >
          Back home
        </Link>
      </div>
    </section>
      </main>
      <SiteFooter />
    </div>
  );
}
