// Email alerts for new submissions, sent through Resend (resend.com).
//
// Turned on by two environment variables in Vercel:
//   RESEND_API_KEY  -- from resend.com > API Keys
//   NOTIFY_EMAIL    -- where alerts go (comma-separate several addresses)
// Optional:
//   NOTIFY_FROM     -- a sender on a domain verified in Resend, e.g.
//                      "Roots <alerts@yourdomain.org>". Until a domain is
//                      verified, Resend's test sender is used, which can
//                      only deliver to the email you signed up to Resend with.
//
// Without RESEND_API_KEY / NOTIFY_EMAIL this does nothing, and it never
// throws: a failed alert must never make a visitor's submission fail.

import { siteUrl } from "@/lib/site-url";

type Field = { label: string; value?: string | null };

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function notifyNewSubmission({
  subject,
  heading,
  fields,
  studioPath,
}: {
  subject: string;
  heading: string;
  fields: Field[];
  // Where in Studio to review it, e.g. "/studio/structure/root".
  studioPath?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return;

  const rows = fields
    .filter((f) => f.value && String(f.value).trim())
    .map(
      (f) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#5f5e59;font:13px sans-serif;vertical-align:top;white-space:nowrap">${escapeHtml(
          f.label
        )}</td><td style="padding:6px 0;color:#161615;font:15px sans-serif;white-space:pre-wrap">${escapeHtml(
          String(f.value)
        )}</td></tr>`
    )
    .join("");
  const studioUrl = studioPath ? `${siteUrl}${studioPath}` : `${siteUrl}/studio`;
  const html = `<div style="max-width:560px">
<p style="font:22px Georgia,serif;color:#161615;margin:0 0 16px">${escapeHtml(heading)}</p>
<table style="border-collapse:collapse">${rows}</table>
<p style="margin:24px 0 0"><a href="${studioUrl}" style="font:14px sans-serif;color:#2f5240">Review it in Studio &rarr;</a></p>
</div>`;
  const text = `${heading}\n\n${fields
    .filter((f) => f.value)
    .map((f) => `${f.label}: ${f.value}`)
    .join("\n")}\n\nReview it in Studio: ${studioUrl}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || "Roots <onboarding@resend.dev>",
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        subject,
        html,
        text,
      }),
    });
    if (!res.ok) console.error("Submission alert failed:", res.status, await res.text());
  } catch (err) {
    console.error("Submission alert failed:", err);
  }
}
