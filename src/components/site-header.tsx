"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Five plain destinations. "Contribute" is the existing add-a-story flow;
// it gets a light outline so the one ask is easy to find.
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portraits", label: "People" },
  { href: "/map", label: "Map" },
  { href: "/add", label: "Contribute", emphasis: true },
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
          <span className="hidden whitespace-nowrap font-mono text-[10px] uppercase text-ink-soft lg:block">
            Food has roots. So do we.
          </span>
        </Link>
        <nav
          aria-label="Main"
          className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-[11px] uppercase text-ink-soft sm:w-auto sm:justify-end sm:gap-7"
        >
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            if (link.emphasis) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap border-b py-1 transition-colors sm:border sm:px-4 sm:py-2 ${
                    active
                      ? "border-ink text-ink sm:bg-ink sm:text-paper"
                      : "border-transparent text-ink hover:text-moss sm:border-ink sm:hover:bg-ink sm:hover:text-paper"
                  }`}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`border-b py-1 transition-colors hover:text-ink ${
                  active ? "border-ink text-ink" : "border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
