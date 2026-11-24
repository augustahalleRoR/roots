"use client";

import { useState, type FormEvent } from "react";
import { Honeypot } from "@/components/honeypot";

type Path = "quick" | "full";
type Subject = "self" | "other";

const connectionOptions = [
  "Farmer",
  "Cook",
  "Distributor",
  "Educator",
  "Eater",
  "Other",
];

const tagOptions = [
  "Regenerative Agriculture",
  "Soil Health",
  "Urban Agriculture",
  "Seed Saving",
  "Food Justice & Access",
  "Indigenous Foodways",
  "Aquaculture & Fishing",
  "Food Waste",
  "Local & Regional Food Systems",
  "Agroecology",
  "Livestock & Grazing",
  "Food Education",
];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[12px] uppercase tracking-wide text-ink">
        {label}
      </span>
      {hint && <span className="ml-2 text-xs text-ink-soft">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full border border-line bg-paper px-3 py-2 text-[15px] text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none";

export function AddStoryForm({ initialSubject }: { initialSubject?: Subject } = {}) {
  const [subject, setSubject] = useState<Subject | null>(initialSubject ?? null);
  const [path, setPath] = useState<Path | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData(e.currentTarget);
      const photos = form
        .getAll("photo")
        .filter((f): f is File => f instanceof File && f.size > 0);
      form.delete("photo");
      for (const photo of photos) {
        form.append("photo", await shrinkPhoto(photo));
      }
      const res = await fetch("/api/roots", { method: "POST", body: form });
      if (res.status === 413) {
        throw new Error("Those photos are too large together. Try fewer photos.");
      }
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
      <div className="border border-ink bg-paper-warm p-8 text-center">
        <p className="font-mono text-[12px] uppercase tracking-wide text-moss-deep">
          Thank you
        </p>
        <h2 className="mt-2 font-display text-2xl text-ink">
          This one&rsquo;s in the review queue.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          We read every submission by hand. If it&rsquo;s a fit for Roots,
          we&rsquo;ll reach out before anything goes public.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Honeypot />
      {/* Step 1: who is this about */}
      <fieldset>
        <legend className="font-mono text-[12px] uppercase tracking-wide text-moss-deep">
          Is this about you, or someone else?
        </legend>
        <div className="mt-3 flex gap-3">
          {(["self", "other"] as Subject[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubject(s)}
              className={`rounded-sm border px-5 py-2.5 font-mono text-[13px] uppercase tracking-wide transition-colors ${
                subject === s
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink hover:border-ink"
              }`}
            >
              {s === "self" ? "This is me" : "Someone else"}
            </button>
          ))}
        </div>
      </fieldset>

      {subject && (
        <fieldset>
          <legend className="font-mono text-[12px] uppercase tracking-wide text-moss-deep">
            How much time do you have?
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPath("quick")}
              className={`border p-4 text-left transition-colors ${
                path === "quick"
                  ? "border-ink bg-paper-warm"
                  : "border-line hover:border-ink"
              }`}
            >
              <p className="font-display text-lg text-ink">Quick Add</p>
              <p className="mt-1 text-sm text-ink-soft">
                A name, a photo, a quote. Two minutes, on the spot.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setPath("full")}
              className={`border p-4 text-left transition-colors ${
                path === "full"
                  ? "border-ink bg-paper-warm"
                  : "border-line hover:border-ink"
              }`}
            >
              <p className="font-display text-lg text-ink">Full Portrait</p>
              <p className="mt-1 text-sm text-ink-soft">
                The whole story, written up. Fifteen minutes or so.
              </p>
            </button>
          </div>
        </fieldset>
      )}

      {path && (
        <fieldset className="space-y-6 border-t border-line pt-8">
          {subject === "other" && (
            <Field label="Submitted by" hint="you, or your relationship to them">
              <input className={inputClass} name="submittedBy" required />
            </Field>
          )}

          <Field label="Subject name">
            <input className={inputClass} name="name" required />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="City">
              <input className={inputClass} name="city" required />
            </Field>
            <Field label="State">
              <input className={inputClass} name="state" required maxLength={2} />
            </Field>
          </div>

          <Field label="Photo" hint="credit the photographer if it isn't you">
            <input
              className={`${inputClass} file:mr-3 file:border-0 file:bg-ink file:px-3 file:py-1.5 file:font-mono file:text-[12px] file:uppercase file:text-paper`}
              type="file"
              accept="image/*"
              name="photo"
              multiple={path === "full"}
            />
          </Field>

          <Field label="Quote" hint='one line, e.g. "It\u2019s not about the cow, it\u2019s about the how."'>
            <input className={inputClass} name="quote" required />
          </Field>

          {path === "quick" ? (
            <Field label="One line" hint="what they do, or their connection to food">
              <input className={inputClass} name="oneLine" required />
            </Field>
          ) : (
            <>
              <fieldset>
                <legend className="font-mono text-[12px] uppercase tracking-wide text-ink">
                  Connection to the food system
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {connectionOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-1.5 border border-line px-2.5 py-1 text-sm has-checked:border-ink"
                    >
                      <input type="checkbox" name="connection" value={opt} />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field
                label="The story"
                hint="around 600 words is a good target, any length is fine"
              >
                <textarea className={`${inputClass} min-h-48`} name="story" required />
              </Field>

              <fieldset>
                <legend className="font-mono text-[12px] uppercase tracking-wide text-ink">
                  Tags
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-1.5 border border-line px-2.5 py-1 text-sm has-checked:border-ink"
                    >
                      <input type="checkbox" name="tags" value={tag} />
                      {tag}
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          <Field label="Your contact info" hint="for follow-up only, never published">
            <input className={inputClass} type="email" name="contact" required />
          </Field>

          <label className="flex items-start gap-2 text-sm text-ink-soft">
            <input type="checkbox" required className="mt-1" />
            {subject === "self"
              ? "I give Roots permission to publish this story."
              : "I have permission from the subject to submit and publish this story."}
          </label>

          <label className="flex items-start gap-2 text-sm text-ink-soft">
            <input type="checkbox" name="openToConnect" className="mt-1" />
            Open to being contacted by others doing similar work
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
            {submitting ? "Submitting…" : "Submit for review"}
          </button>
          <p className="text-[13px] leading-relaxed text-ink-soft">
            Every submission is read by hand. We check in with the person
            before anything is published, and we never publish contact
            details.{" "}
            <a href="/privacy" className="underline decoration-line underline-offset-4 hover:text-ink">
              How we handle what you share
            </a>
          </p>
        </fieldset>
      )}
    </form>
  );
}

// Phone photos are often 4-10 MB, and Vercel rejects request bodies over
// 4.5 MB. Downscale to at most 2000px on the long edge as a JPEG before
// uploading -- plenty for the site, and typically well under 1 MB.
async function shrinkPhoto(file: File): Promise<File> {
  const MAX_EDGE = 2000;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1_000_000) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    if (!blob) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    // Formats the browser can't decode (e.g. HEIC outside Safari) go up as-is.
    return file;
  }
}
