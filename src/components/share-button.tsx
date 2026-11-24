"use client";

import { useState } from "react";
import { ArrowRightIcon } from "@/components/icons";

// Real sharing: the Web Share API on devices that support it (mobile
// Safari/Chrome), falling back to copying the link for desktop browsers
// that don't. No fake modal, no third-party share widget.
export function ShareButton({
  title,
  text,
  className,
}: {
  title: string;
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user cancelled the share sheet -- nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked -- nothing more we can do without a fake fallback
    }
  }

  return (
    <button
      onClick={handleShare}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-sm bg-paper px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-moss-deep transition-colors hover:bg-wheat hover:text-ink"
      }
    >
      {copied ? "Link copied" : "Share Roots with a friend"}
      <ArrowRightIcon className="h-4 w-4" />
    </button>
  );
}
