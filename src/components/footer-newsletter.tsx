"use client";

import { usePathname } from "next/navigation";
import { EmailSignupForm } from "@/components/email-signup-form";

// The footer's newsletter line. Hidden on the homepage, which has its own
// "Stay in the loop" section right above the footer.
export function FooterNewsletter() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
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
  );
}
