"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/portraits", label: "Portraits" },
  { href: "/map", label: "Map" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-4 sm:flex-nowrap sm:px-10 sm:py-6">
        {/* Wordmark: the serif name with the tagline as a quiet label */}
        <Link href="/" className="flex items-baseline gap-4 leading-none">
          <span className="font-display text-[2rem] leading-none text-ink">
            Roots
          </span>
          <span className="hidden font-mono text-[10px] uppercase text-ink-soft md:block">
            Food has roots. So do we.
          </span>
        </Link>
        <nav className="flex w-full items-center justify-between gap-4 font-mono text-[11px] uppercase text-ink-soft sm:w-auto sm:justify-end sm:gap-7">
          {navLinks.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b py-1 transition-colors hover:text-ink ${
                  active ? "border-ink text-ink" : "border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/add"
            className="hidden border border-ink px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-paper sm:inline-block"
          >
            Nominate someone
          </Link>
        </nav>
      </div>
    </header>
  );
}
