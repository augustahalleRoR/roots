import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl } from "@/lib/site-url";

// The bare outer shell shared by the public site and the Sanity Studio.
// The site's own styles, header, and footer live in app/(site)/layout.tsx,
// so the Studio at /studio gets a clean, full-screen page of its own.

// The share-preview image is generated in src/app/opengraph-image.tsx;
// portrait pages use the person's own photo instead.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Roots — Food has roots. So do we.",
  description:
    "Roots is mapping the people, places, and ideas shaping the future of food. Know someone who belongs here? Help us find them.",
  openGraph: {
    siteName: "Roots",
    type: "website",
    title: "Roots — Food has roots. So do we.",
    description:
      "Meet the people shaping the future of food: farmers, cooks, fishers, and neighbors, in their own words.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
