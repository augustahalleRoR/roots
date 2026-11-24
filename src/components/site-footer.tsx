import Link from "next/link";
import { EmailSignupForm } from "@/components/email-signup-form";

const explore = [
  { href: "/portraits", label: "Portraits" },
  { href: "/collections/roots-on-the-road", label: "Roots on the Road" },
  { href: "/map", label: "The Map" },
  { href: "/about", label: "About" },
  { href: "/add", label: "Nominate someone" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter() {
  return (
    <footer className="bg-moss-deep text-paper">
      {/* The newsletter as a quiet line, not a pitch */}
      <div className="border-b border-paper/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-12 sm:px-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-3xl leading-tight">
              We&rsquo;ll bring the next portrait to you.
            </p>
            <p className="mt-1 text-[14px] text-paper/70">
              Occasional updates when new stories go up. Nothing else.
            </p>
          </div>
          <EmailSignupForm />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3 sm:px-10">
        <div>
          <p className="font-display text-3xl leading-none">Roots</p>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-paper/70">
            Mapping the people, places, and ideas shaping the future of food.
            Started on Roots on the Road, a 3,700-mile bike ride across the
            country.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase text-paper/70">Explore</p>
          <ul className="mt-4 space-y-2 text-[14px]">
            {explore.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper/85 hover:text-wheat">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase text-paper/70">Where it started</p>
          <p className="mt-4 text-[14px]">
            <a
              href="https://rootsontheroad.squarespace.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper/85 underline decoration-paper/30 underline-offset-4 hover:text-wheat"
            >
              Roots on the Road
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <p className="mx-auto max-w-6xl px-6 py-5 font-mono text-[10px] uppercase text-paper/70 sm:px-10">
          Roots &middot; Food has roots. So do we.
        </p>
      </div>
    </footer>
  );
}
