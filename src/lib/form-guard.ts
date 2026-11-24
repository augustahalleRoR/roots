// Lightweight spam protection for the public forms. Every form includes a
// hidden "website" field that people never see or fill in; bots that
// auto-fill every input do, and those submissions are quietly dropped.
export const HONEYPOT_FIELD = "website";

export function isBot(form: FormData) {
  return Boolean(form.get(HONEYPOT_FIELD)?.toString().trim());
}

// Trims a text field and caps its length so a single submission can't
// write megabytes of text into Sanity.
export function field(form: FormData, name: string, max = 500) {
  const value = form.get(name)?.toString().trim();
  return value ? value.slice(0, max) : undefined;
}

export const MAX_PHOTOS = 6;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB
