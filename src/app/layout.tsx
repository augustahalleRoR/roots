import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl } from "@/lib/site-url";

// The bare outer shell shared by the public site and the Sanity Studio.
// The site's own styles, header, and footer live in app/(site)/layout.tsx,
// so the Studio at /studio gets a clean, full-screen page of its own.

// The social-share preview image: the team + bikes in front of Albert the
// Bull (a roadside statue in Audubon, IA) -- captures both halves of Roots
// in one frame, the ride and the food world it rides through. Sourced
// straight from the real trip-photo asset already in Sanity; swap the path
// here if a better cover photo comes along later.
const ogImage =
  "https://cdn.sanity.io/images/lxtvdh1t/production/c902cd2cb91a66c493d99ab55cb08466753ffbdb-1440x1920.jpg?w=1200&h=630&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.6";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Roots — People shaping America's food future",
  description:
    "Roots is mapping the people, places, and ideas shaping the future of food. Know someone who belongs here? Help us find them.",
  openGraph: {
    siteName: "Roots",
    type: "website",
    title: "Roots — People shaping America's food future",
    description:
      "A living map of the people, places, and ideas shaping the future of food.",
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage],
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
