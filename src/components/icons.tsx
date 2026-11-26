// A small set of hand-drawn line icons in the mockup's thin-stroke style.
// Kept as inline SVG (no icon package) so the app stays dependency-free.
// All icons: 24x24 viewBox, currentColor stroke, no fill.

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 4c-8.5 0-15 6.2-15 14 0 .6.4 1 1 1 7.8 0 14-6.5 14-15Z" />
      <path d="M6 19c3-4 6.5-7.5 12-11" />
    </svg>
  );
}

export function AnimalIcon(props: IconProps) {
  // Simplified sheep / grazing-animal mark for "animal integration"
  return (
    <svg {...base} {...props}>
      <path d="M6.5 11a3 3 0 1 1 3-3.6" />
      <path d="M17.5 11a3 3 0 1 0-3-3.6" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M9 20.5 10 16M15 20.5 14 16M10.5 21h3" />
    </svg>
  );
}

export function MushroomIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11c0-4 3.6-7 8-7s8 3 8 7c-2.6-1.4-13.4-1.4-16 0Z" />
      <path d="M10 11v6a2 2 0 0 0 4 0v-6" />
    </svg>
  );
}

export function GraduationCapIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 9.5 12 5l10 4.5-10 4.5-10-4.5Z" />
      <path d="M6.5 11.7v4.3c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-4.3" />
      <path d="M21 9.5v5" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M15.5 6.2a3 3 0 0 1 0 5.8" />
      <path d="M16.5 14.2c2.6.5 4.5 2.6 4.5 5.8" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-6.3 7-11.5a7 7 0 1 0-14 0C5 14.7 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.3" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4v11" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 19.5h14" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h16" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

export function PenIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      <path d="M14.5 5.5l3 3" />
      <path d="M12 20h8" />
    </svg>
  );
}

export function BikeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="17" r="3.2" />
      <circle cx="18" cy="17" r="3.2" />
      <path d="M6 17 10 9h5l3 8" />
      <path d="M10 9 9 6h-2" />
      <path d="m13 9 3.5 4" />
    </svg>
  );
}

// Fallback + keyword match for a tag string, used to pick an icon for
// whatever tags a Root happens to have without hard-coding per-person icons.
const TAG_ICONS: { match: RegExp; Icon: (p: IconProps) => React.JSX.Element }[] = [
  { match: /regenerativ|soil|fungal|compost/i, Icon: LeafIcon },
  { match: /animal|livestock|sheep|grazing|poultry|dairy/i, Icon: AnimalIcon },
  { match: /mushroom|fungi/i, Icon: MushroomIcon },
  { match: /education|tour|workshop|school/i, Icon: GraduationCapIcon },
  { match: /communit|stewardship|neighbor/i, Icon: UsersIcon },
];

export function iconForTag(tag: string) {
  return TAG_ICONS.find((t) => t.match.test(tag))?.Icon ?? LeafIcon;
}
