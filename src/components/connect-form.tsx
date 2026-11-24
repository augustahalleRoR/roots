"use client";

import { useState, type FormEvent } from "react";
import { Honeypot } from "@/components/honeypot";

const inputClass =
  "w-full border border-line bg-paper px-3 py-2 text-[15px] text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none";

export function ConnectForm({ rootSlug }: { rootSlug: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 border border-ink bg-paper-warm p-8 text-center">
        <p className="font-mono text-[12px] uppercase tracking-wide text-moss-deep">
          Sent
        </p>
        <h2 className="mt-2 font-display text-2xl text-ink">
          Your note is on its way.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          We&rsquo;ll pass it along and follow up if there&rsquo;s a match.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <input type="hidden" name="rootSlug" value={rootSlug} />
      <Honeypot />
      <label className="block">
        <span className="font-mono text-[12px] uppercase tracking-wide text-ink">
          Your name
        </span>
        <input className={`mt-1.5 ${inputClass}`} name="name" required maxLength={200} />
      </label>
      <label className="block">
        <span className="font-mono text-[12px] uppercase tracking-wide text-ink">
          Your email
        </span>
        <input className={`mt-1.5 ${inputClass}`} type="email" name="email" required maxLength={200} />
      </label>
      <label className="block">
        <span className="font-mono text-[12px] uppercase tracking-wide text-ink">
          Your note
        </span>
        <textarea
          className={`mt-1.5 min-h-32 ${inputClass}`}
          name="note"
          required
          maxLength={3000}
        />
      </label>

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-ink px-6 py-3 font-mono text-[12px] uppercase text-paper transition-colors hover:bg-moss disabled:opacity-50"
      >
        {submitting ? "Sending…" : "Send introduction request"}
      </button>
      <p className="text-[13px] leading-relaxed text-ink-soft">
        We read your note and pass it along ourselves. Your email is never
        published or shared without your OK.{" "}
        <a href="/privacy" className="underline decoration-line underline-offset-4 hover:text-ink">
          Privacy
        </a>
      </p>
    </form>
  );
}
