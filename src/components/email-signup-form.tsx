"use client";

import { useState, type FormEvent } from "react";
import { Honeypot } from "@/components/honeypot";

// Compact inline signup for the Get Involved band -- deliberately smaller
// and quieter than the Share button, since Share is the primary ask.
export function EmailSignupForm() {
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="font-mono text-[12px] uppercase tracking-wide text-paper/80">
        You&rsquo;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <Honeypot />
      <input
        type="email"
        name="email"
        required
        maxLength={200}
        placeholder="you@example.com"
        aria-label="Email address"
        className="w-full border border-paper/40 bg-transparent px-3 py-2 text-[14px] text-paper placeholder:text-paper/65 focus:border-paper focus:outline-none sm:w-56"
      />
      <button
        type="submit"
        disabled={state === "submitting"}
        className="shrink-0 border border-paper/60 px-4 py-2 font-mono text-[12px] uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-moss-deep disabled:opacity-50"
      >
        {state === "submitting" ? "Sending…" : "Get occasional updates"}
      </button>
      {error && (
        <p className="font-mono text-[11px] text-paper/70 sm:ml-2 sm:self-center" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
